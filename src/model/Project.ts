import { BaseData, MediaData, NestedData } from 'mobx-strapi';

import { Organization } from './Organization';
import { CollectionModel, User } from './service';

export interface Project extends BaseData {
    name: string;
    logo?: MediaData;
    link: string;
    summary?: string;
    start_date: string;
    end_date?: string;
    members: NestedData<User>[];
    organization?: NestedData<Organization>;
}

export class ProjectModel extends CollectionModel<Project> {
    name = 'project';
    baseURI = 'projects';
}
