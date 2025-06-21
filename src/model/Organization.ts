import { Organization } from '@kaiyuanshe/data-server';
import { observable } from 'mobx';
import { toggle } from 'mobx-restful';

import { Program } from './Program';
import { CollectionModel } from './service';

export class OrganizationModel extends CollectionModel<Organization> {
    name = 'organization';
    baseURI = 'organizations';

    searchKeys = ['name'] as const;

    @observable
    accessor programs: Program[] = [];

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
