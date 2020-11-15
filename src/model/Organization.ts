import { observable } from 'mobx';
import {
    BaseData,
    MediaData,
    CollectionModel,
    service,
    loading
} from 'mobx-strapi';

import { Program } from './Program';

export interface Organization extends BaseData {
    name: string;
    slogan?: string;
    logo?: MediaData;
    link: string;
    summary: string;
    video?: MediaData;
    message_link: string;
}

export class OrganizationModel extends CollectionModel<
    Organization,
    'name' | 'slogan' | 'summary'
> {
    name = 'organization';
    basePath = 'organizations';

    @observable
    programs: Program[] = [];

    @loading
    async getOne(id: Organization['id']) {
        const { body: list } = await service.get<Program[]>(
            'programs/?organization=' + id
        );
        this.programs = list;

        if (list[0]) return (this.current = list[0].organization);

        const { body } = await service.get<Organization>('organizations/' + id);

        return (this.current = body);
    }
}
