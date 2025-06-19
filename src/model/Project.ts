import { Project } from '@kaiyuanshe/data-server';

import { CollectionModel } from './service';

export class ProjectModel extends CollectionModel<Project> {
    name = 'project';
    baseURI = 'projects';
}
