import { marked } from 'marked';
import { computed } from 'mobx';
import { toggle } from 'mobx-restful';
import { BaseData, MediaData, NestedData } from 'mobx-strapi';
import { Day, formatDate } from 'web-utility';

import { Organization } from './Organization';
import { CollectionModel, service } from './service';

export interface Activity extends BaseData {
    name: string;
    slogan: string;
    banner: MediaData;
    description: string;
    partner_ships: NestedData<Partnership>[];
    start_time: string;
    end_time: string;
    location: string;
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
    activity: NestedData<Activity>;
    level: number;
    organization: NestedData<Organization>;
    type: PartnershipTypes;
    accounts: any[];
    verified: boolean;
}

export class ActivityModel extends CollectionModel<Activity> {
    name = 'activity';
    baseURI = 'activities';

    @computed
    get currentDays() {
        const { start_time, end_time } = this.currentOne,
            days: string[] = [];

        if (!start_time || !end_time) return [];

        let start = new Date(start_time);
        const end = new Date(end_time);
        do {
            days.push(formatDate(start, 'YYYY-MM-DD'));
        } while (+(start = new Date(+start + Day)) <= +end);

        return days;
    }

    @toggle('downloading')
    async getOne(id: Activity['id']) {
        const { body } = await service.get<Partnership[]>(
            'partner-ships?_sort=level:DESC&activity=' + id
        );
        let activity: Activity;

        if (body[0]) {
            activity = { ...body[0].activity } as Activity;
            activity.partner_ships = body;
        } else
            activity = (await service.get<Activity>('activities/' + id)).body;

        const { description, ...data } = activity;

        return (this.currentOne = {
            description: marked(description),
            ...data
        });
    }
}
