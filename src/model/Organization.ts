import { observable } from 'mobx';

import { MediaData, service } from './service';
import { BaseData, BaseModel } from './Base';
import { Program } from './Activity';

export interface Organization extends BaseData {
    name: string;
    slogan?: string;
    logo?: MediaData;
    link: string;
    summary: string;
    video?: MediaData;
    message_link: string;
}

export class OrganizationModel extends BaseModel<
    Organization,
    'name' | 'slogan' | 'summary'
> {
    scope = 'organizations';

    @observable
    programs: Program[] = [];

    async getOne(id: number) {
        this.loading = true;

        const { body: list } = await service.get<Program[]>(
            'programs/?organization=' + id
        );
        this.programs = list;

        if (list[0]) {
            this.loading = false;
            return (this.current = list[0].organization);
        }
        const { body } = await service.get<Organization>('organizations/' + id);

        this.loading = false;
        return (this.current = body);
    }
}
