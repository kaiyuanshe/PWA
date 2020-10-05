import { computed, observable } from 'mobx';
import { Day, formatDate } from 'web-utility/source/date';
import { buildURLData } from 'web-utility/source/URL';

import { BaseData, User, MediaData, Category, service } from './service';
import { Partnership } from './Partnership';
import { Organization } from './Organization';

export interface Activity extends BaseData {
    name: string;
    slogan: string;
    banner: MediaData;
    description: string;
    partner_ships: Partnership[];
    start_time: Date;
    end_time: Date;
    location: string;
}

export interface Program extends BaseData {
    title: string;
    start_time: string;
    end_time: string;
    summary?: string;
    mentors: User[];
    activity: Activity;
    type: 'lecture' | 'workshop' | 'exhibition';
    place?: any;
    evaluations: any[];
    accounts: any[];
    documents: MediaData[];
    verified: boolean;
    category: Category;
    organization?: Organization;
}

export class ActivityModel {
    @observable
    loading = false;

    @observable
    current: Activity = {} as Activity;

    @observable
    currentAgenda: Program[] = [];

    @computed
    get currentDays() {
        const { start_time, end_time } = this.current,
            days: string[] = [];

        if (!start_time || !end_time) return [];

        var start = new Date(start_time),
            end = new Date(end_time);
        do {
            days.push(formatDate(start, 'YYYY-MM-DD'));
        } while (+(start = new Date(+start + Day)) <= +end);

        return days;
    }

    async getOne(id: number) {
        this.loading = true;

        const { body } = await service.get<Partnership[]>(
            'partner-ships?_sort=level:DESC&activity=' + id
        );
        var activity: Activity;

        if (body[0]) {
            activity = { ...body[0].activity };
            activity.partner_ships = body;
        } else
            activity = (await service.get<Activity>('activities?id=' + id))
                .body;

        this.loading = false;
        return (this.current = activity);
    }

    async getAgenda(aid = this.current.id) {
        this.loading = true;

        const { body } = await service.get<Program[]>(
            'programs?' +
                buildURLData({
                    type_ne: 'exhibition',
                    activity: aid,
                    _sort: 'start_time:ASC'
                })
        );
        this.loading = false;
        return (this.currentAgenda = body);
    }
}
