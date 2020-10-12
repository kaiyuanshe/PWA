import { computed, observable } from 'mobx';
import { Day, formatDate } from 'web-utility/source/date';
import { buildURLData } from 'web-utility/source/URL';

import { User, Category, Place, service } from './service';
import { BaseData, MediaData, CollectionModel, NewData } from './Base';
import { Project } from './Project';
import { Organization } from './Organization';

export interface Activity extends BaseData {
    name: string;
    slogan: string;
    banner: MediaData;
    description: string;
    partner_ships: Partnership[];
    start_time: string;
    end_time: string;
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
    place?: Place;
    evaluations: any[];
    accounts: any[];
    documents: MediaData[];
    verified: boolean;
    category: Category;
    project?: Project;
    organization?: Organization;
}

export enum PartnershipTypes {
    sponsor = 'sponsor',
    place = 'place',
    media = 'media',
    community = 'community',
    device = 'device',
    travel = 'travel',
    vendor = 'vendor'
}

export interface Partnership extends BaseData {
    title: string;
    activity: Activity;
    level: number;
    organization: Organization;
    type: PartnershipTypes;
    accounts: any[];
    verified: boolean;
}

export class ActivityModel extends CollectionModel<Activity> {
    name = 'activity';
    basePath = 'activities';

    @observable
    currentAgenda: Program[] = [];

    @observable
    currentExhibitions: Program[] = [];

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

    async getOne(id: Activity['id']) {
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

    async getPrograms(aid = this.current.id, verified = true) {
        this.loading = true;

        const { body } = await service.get<Program[]>(
            'programs?' +
                buildURLData({
                    activity: aid,
                    verified,
                    _sort: 'start_time:ASC'
                })
        );
        const agenda: Program[] = [],
            exhibitions: Program[] = [];

        for (const program of body)
            if (program.type !== 'exhibition') agenda.push(program);
            else exhibitions.push(program);

        this.loading = false;
        this.currentAgenda = agenda;
        this.currentExhibitions = exhibitions;
        return body;
    }

    async createProgram({
        type,
        start_time,
        end_time,
        activity,
        ...data
    }: NewData<Program>) {
        if (type === 'exhibition') {
            if (!(start_time && end_time) && activity !== this.current.id)
                await this.getOne(activity);

            ({ start_time, end_time } = this.current);
        }
        const { body } = await service.post<Program>('programs', {
            type,
            start_time,
            end_time,
            activity,
            ...data
        });
        return body;
    }
}
