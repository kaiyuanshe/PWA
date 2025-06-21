import { Partnership } from '@kaiyuanshe/data-server';
import { Byte, Encoder } from '@nuintun/qrcode';
import { DataObject, Filter } from 'mobx-restful';
import { StrapiListModel } from 'mobx-strapi';

import session from './Session';

if (!['localhost', '127.0.0.1', '0.0.0.0'].includes(location.hostname))
    session.client.baseURI = 'https://data.kaiyuanshe.cn/api/';

export abstract class CollectionModel<
    D extends DataObject,
    F extends Filter<D> = Filter<D>
> extends StrapiListModel<D, F> {
    client = session.client;

    select(key: keyof D, value: D[keyof D]) {
        return (this.currentOne = this.allItems.find(
            item => item[key] === value
        ));
    }
}

export type User = Required<Partnership>['creator'];

export const encodeURLQRC = (raw: string) =>
    new Encoder().encode(new Byte(raw)).toDataURL();
