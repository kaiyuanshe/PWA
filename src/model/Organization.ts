import { observable } from 'mobx';
import { toggle } from 'mobx-restful';
import { BaseData, MediaData } from 'mobx-strapi';

import { Program } from './Program';
import { CollectionModel } from './service';

export interface Organization extends BaseData {
    name: string;
    slogan?: string;
    logo?: MediaData;
    link: string;
    summary: string;
    video?: MediaData;
    message_link: string;
}

export class OrganizationModel extends CollectionModel<Organization> {
    name = 'organization';
    baseURI = 'organizations';

    @observable
    programs: Program[] = [];

    @toggle('downloading')
    async getOne(id: Organization['id']) {
        const { body: list } = await this.client.get<Program[]>(
            'programs/?organization=' + id
        );
        this.programs = list;

        if (list[0])
            return (this.currentOne = list[0].organization as Organization);

        const { body } = await this.client.get<Organization>(
            'organizations/' + id
        );

        return (this.currentOne = body);
    }
}
