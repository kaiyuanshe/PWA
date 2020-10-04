import { observable } from 'mobx';

import { BaseData, MediaData, service } from './service';
import { Partnership } from './Partnership';

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

export class ActivityModel {
    @observable
    loading = false;

    @observable
    current: Activity = {} as Activity;

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
}
