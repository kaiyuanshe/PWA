import { computed } from 'mobx';
import {
    BaseData,
    MediaData,
    NestedData,
    CollectionModel,
    service,
    loading
} from 'mobx-strapi';
import { Day, formatDate } from 'web-utility/source/date';
import marked from 'marked';

import { Organization } from './Organization';

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
    basePath = 'activities';

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

    @loading
    async getOne(id: Activity['id']) {
        const { body } = await service.get<Partnership[]>(
            'partner-ships?_sort=level:DESC&activity=' + id
        );
        var activity: Activity;

        if (body[0]) {
            activity = { ...body[0].activity } as Activity;
            activity.partner_ships = body;
        } else
            activity = (await service.get<Activity>('activities/' + id)).body;

        const { description, ...data } = activity;

        return (this.current = { description: marked(description), ...data });
    }
}
