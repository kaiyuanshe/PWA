import { observable } from 'mobx';

import { Editor, MediaData, service } from './service';
import { Partnership } from './Partnership';

export interface Activity {
    id: string;
    name: string;
    slogan: string;
    banner: MediaData;
    description: string;
    partner_ships: Partnership[];
    start_time: Date;
    end_time: Date;
    location: string;
    created_by: Editor;
    updated_by: Editor;
}

export class ActivityModel {
    @observable
    current: Activity = {} as Activity;
    @observable
    partnerships: Partnership[];

    async getOne(id: string) {
        const { body } = await service.get<Activity>('activities/' + id);

        return (this.current = body);
    }
}
