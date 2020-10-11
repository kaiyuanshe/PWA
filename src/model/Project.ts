import { BaseData, MediaData, BaseModel } from './Base';
import { Organization } from './Organization';
import { User } from './service';

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

export class ProjectModel extends BaseModel<Project, 'name' | 'summary'> {
    name = 'project';
    basePath = 'projects';
}
