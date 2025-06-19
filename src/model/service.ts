import { Partnership } from '@kaiyuanshe/data-server';
import { HTTPClient } from 'koajax';
import { DataObject, Filter } from 'mobx-restful';
import { StrapiListModel } from 'mobx-strapi';

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

export type User = Required<Partnership>['creator'];
