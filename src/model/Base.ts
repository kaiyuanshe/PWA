import { observable } from 'mobx';
import { buildURLData } from 'web-utility';

import { service } from './service';

export interface BaseData {
    id: number;
    created_at: string;
    updated_at: string;
    published_at: string;
}

export interface MediaData extends BaseData {
    name: string;
    alternativeText: string;
    caption: string;
    width: number;
    height: number;
    formats: [];
    hash: string;
    ext: string;
    mime: string;
    size: number;
    url: string;
    previewUrl: string;
    provider: string;
    provider_metadata: [];
    related: string;
}

export type NewData<T extends BaseData> = {
    [key in keyof T]?: T[key] extends MediaData
        ? File
        : T[key] extends MediaData[]
        ? File[]
        : T[key] extends BaseData
        ? number
        : T[key] extends BaseData[]
        ? number[]
        : T[key];
};

export type FileKeys<T> = {
    [K in keyof T]: T[K] extends MediaData ? K : never;
}[keyof T];

export type Query<D extends BaseData> = Omit<NewData<D>, FileKeys<D>> & {
    _sort?: string;
    _start?: number;
    _limit?: number;
    _publicationState?: 'live' | 'preview';
};

export abstract class BaseModel {
    @observable
    loading = false;

    static async upload(
        model: string,
        id: number,
        key: string,
        files: Blob[],
        module?: string
    ) {
        const data = new FormData();

        data.append('ref', model);
        data.append('refId', id + '');
        data.append('field', key);

        if (module) data.append('source', module);

        for (const file of files) data.append('files', file);

        const { body } = await service.post<MediaData>('upload', data);

        return body;
    }
}

export abstract class CollectionModel<
    D extends BaseData,
    K extends keyof D = null
> extends BaseModel {
    abstract name: string;
    abstract basePath: string;

    @observable
    current = {} as D;

    @observable
    list: D[] = [];

    @observable
    allItems: D[] = [];

    setCurrent(data: Partial<D>) {
        Object.assign(this.current, data);
    }

    async getOne(id: D['id']) {
        this.loading = true;

        const { body } = await service.get<D>(`${this.basePath}/${id}`);

        this.loading = false;
        return (this.current = body);
    }

    async getAll({ _sort, ...query }: Query<D> = {} as Query<D>) {
        const { body: count } = await service.get<number>(
            `${this.basePath}/count?${buildURLData(query)}`
        );
        const { body } = await service.get<D[]>(
            `${this.basePath}?${buildURLData({
                ...query,
                _sort,
                _limit: count
            })}`
        );
        return (this.allItems = body);
    }

    async searchBy(key: K, keyword: string) {
        this.loading = true;

        const { body } = await service.get<D[]>(
            `${this.basePath}?${key}_contains=${keyword}`
        );
        this.loading = false;
        return (this.list = body);
    }

    select(key: keyof D, value: D[keyof D]) {
        const item = this.list.find(({ [key]: data }) => data === value);

        return (this.current = item ?? ({} as D));
    }

    async update({ id, ...data }: NewData<D>) {
        this.loading = true;

        const [fields, files] = Object.entries(data).reduce(
            ([fields, files], [key, value]) => {
                if (value instanceof Blob) files[key] = value;
                else fields[key] = value;

                return [fields, files];
            },
            [{}, {}] as [
                Omit<NewData<D>, FileKeys<D>>,
                Pick<NewData<D>, FileKeys<D>>
            ]
        );
        const { body } = await (id
            ? service.put<D>(`${this.basePath}/${id}`, fields)
            : service.post<D>(this.basePath, fields));

        for (const file in files) await this.upload(body.id, files);

        this.loading = false;
        return (this.current = body);
    }

    async upload(id: D['id'], files: Pick<NewData<D>, FileKeys<D>>) {
        const map = {} as Pick<D, FileKeys<D>>;

        this.loading = true;

        for (const key in files)
            map[key] = await CollectionModel.upload(
                this.name,
                id,
                key,
                files[key] instanceof Array ? files[key] : [files[key]]
            );
        this.loading = false;
        return map;
    }
}
