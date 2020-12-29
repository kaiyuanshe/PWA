import { BaseData, MediaData, NestedData, CollectionModel } from 'mobx-strapi';

import { User } from './service';
import { Organization } from './Organization';

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

export class ProjectModel extends CollectionModel<Project, 'name' | 'summary'> {
    name = 'project';
    basePath = 'projects';
}
