import { observable } from 'mobx';

import { BaseData, service } from './service';
import { Organization } from './Organization';
import { Activity } from './Activity';

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
    accounts: [];
    verified: boolean;
    default: false;
}

export class PartnershipModel {
    @observable
    current: Partnership = {} as Partnership;

    @observable
    all: Partnership[];

    async getOne(id: string) {
        const { body } = await service.get<Partnership>('partner-ships/' + id);

        return (this.current = body);
    }

    async getAllOfOneActivity(id: string) {
        const { body } = await service.get<Partnership[]>(
            'partner-ships?_sort=type&activity=' + id
        );

        return (this.all = body);
    }
}
