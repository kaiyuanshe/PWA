import { observable } from 'mobx';

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

    async getOne(id: string) {
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
        const { body } = await service.get<Program[]>(
            'programs?type_ne=exhibition&activity=' + aid
        );
        return (this.currentAgenda = body);
    }
}
