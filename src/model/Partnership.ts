import { observable } from 'mobx';

import { Editor, service } from './service';
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

export interface Partnership {
    id: string;
    title: string;
    activity?: Activity;
    level: number;
    organization: Organization;
    type: string;
    accounts: [];
    verified: boolean;
    default: false;
    created_by?: Editor;
    updated_by?: Editor;
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

    async getAll() {
        const { body } = await service.get<Partnership[]>('partner-ships');

        return (this.all = body);
    }
}
