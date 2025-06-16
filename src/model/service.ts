import { HTTPClient } from 'koajax';
import { DataObject, Filter } from 'mobx-restful';
import { StrapiListModel } from 'mobx-strapi';

import { Organization } from './Organization';

export const service = new HTTPClient({
    baseURI:
        location.hostname === 'localhost'
            ? 'http://localhost:1337/api/'
            : 'https://data.kaiyuanshe.cn/'
});

export abstract class CollectionModel<
    D extends DataObject,
    F extends Filter<D> = Filter<D>
> extends StrapiListModel<D, F> {
    client = service;
}

export interface User extends BaseUser {
    name?: string;
    organizations: Organization[];
    avatar?: MediaData;
    summary: string;
    telphone?: string;
}

export interface Place extends BaseData {
    name: string;
    location: string;
    capacity: number;
    indoor: boolean;
    available_times: any[];
    contacts: User[];
    owner: Organization;
    equipments: any[];
    films: MediaData[];
}
