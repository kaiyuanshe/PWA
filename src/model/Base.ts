import { observable } from 'mobx';

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

export abstract class BaseModel<D extends BaseData, K extends keyof D = null> {
    abstract name: string;
    abstract basePath: string;

    @observable
    loading = false;

    @observable
    current = {} as D;

    @observable
    list: D[] = [];

    async searchBy(key: K, keyword: string) {
        const { body } = await service.get<D[]>(
            `${this.basePath}?${key}_contains=${keyword}`
        );
        return (this.list = body);
    }

    select(key: keyof D, value: D[keyof D]) {
        const item = this.list.find(({ [key]: data }) => data === value);

        return (this.current = item ?? ({} as D));
    }

    async update({ id, ...data }: NewData<D>) {
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

        return (this.current = body);
    }

    async getById(id: D[keyof D]) {
        const { body } = await service.get<D>(`${this.basePath}/${id}`);

        return (this.current = body);
    }
    async upload(id: number, files: Pick<NewData<D>, FileKeys<D>>) {
        const map = {} as Pick<D, FileKeys<D>>;

        for (const key in files) {
            const data = new FormData();

            data.append('ref', this.name);
            data.append('refId', id + '');
            data.append('field', key);

            files[key] =
                files[key] instanceof Array ? files[key] : [files[key]];

            for (const file of files[key]) data.append('files', file);

            const { body } = await service.post<MediaData>('upload', data);

            map[key] = body;
        }

        return map;
    }
}
