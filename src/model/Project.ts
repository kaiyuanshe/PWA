import { BaseData, MediaData, CollectionModel } from 'mobx-strapi';

import { User } from './service';
import { Organization } from './Organization';

export interface Project extends BaseData {
    name: string;
    logo?: MediaData;
    link: string;
    summary?: string;
    start_date: string;
    end_date?: string;
    members: User[];
    organization?: Organization;
}

export class ProjectModel extends CollectionModel<Project, 'name' | 'summary'> {
    name = 'project';
    basePath = 'projects';
}
