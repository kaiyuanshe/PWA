import { observable } from 'mobx';
import { BaseData, MediaData, service } from './service';
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

export class OrganizationModel {
    @observable
    loading = false;

    @observable
    current: Organization = {} as Organization;

    @observable
    program: Program[];

    async getOne(id: string) {
        this.loading = true;

        const { body } = await service.get<Program[]>(
            'programs/?organization=' + id
        );

        if (body[0]) {
            this.loading = false;
            this.current = body[0].organization;
            return (this.program = body);
        } else {
            this.loading = false;
            return (this.current = (
                await service.get<Organization>('organizations/' + id)
            ).body);
        }
    }
}
