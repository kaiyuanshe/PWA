import { HTTPClient } from 'koajax';

import { Organization } from './Organization';

var token: string = self.localStorage.token || '';

export function setToken(raw: string) {
    token = self.localStorage.token = raw;
}

export const service = new HTTPClient({
    baseURI: 'https://data.kaiyuanshe.cn/',
    responseType: 'json'
}).use(({ request }, next) => {
    if (token)
        (request.headers = request.headers || {})['Authorization'] =
            'Bearer ' + token;

    return next();
});

export interface BaseData {
    id: number;
    created_at: string;
    created_by: User;
    updated_at: string;
    updated_by: User;
}

export interface User extends BaseData {
    username: string;
    email: string;
    provider?: string;
    confirmed: boolean;
    blocked: boolean;
    role: any;
    name?: string;
    organizations: Organization[];
    avatar?: MediaData;
    summary: string;
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

export interface Category extends BaseData {
    name: string;
    summary?: string;
}
