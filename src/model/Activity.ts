import {
    Activity as _Activity,
    Organization,
    Partnership as _Partnership
} from '@kaiyuanshe/data-server';
import { marked } from 'marked';
import { computed } from 'mobx';
import { toggle } from 'mobx-restful';
import { Day, formatDate } from 'web-utility';

import { CollectionModel, service } from './service';

// @ts-expect-error Enum compatibility bug
export interface Activity extends _Activity {
    organization?: Organization;
    partnerships?: Partnership[];
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

export interface Partnership extends _Partnership {
    organization?: Organization;
}

export class ActivityModel extends CollectionModel<Activity> {
    name = 'activity';
    baseURI = 'activities';

    @computed
    get currentDays() {
        const { startTime, endTime } = this.currentOne,
            days: string[] = [];

        if (!startTime || !endTime) return [];

        let start = new Date(startTime);
        const end = new Date(endTime);
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
            activity.partnerships = body;
        } else
            activity = (await service.get<Activity>('activities/' + id)).body;

        const { description, ...data } = activity;

        return (this.currentOne = {
            description: marked(description) as string,
            ...data
        });
    }
}
