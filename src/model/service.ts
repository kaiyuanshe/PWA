import { HTTPClient } from 'koajax';

export const service = new HTTPClient({
    baseURI: 'https://data.kaiyuanshe.cn/',
    responseType: 'json'
});

export interface BaseData {
    id: number;
    created_by: User;
    updated_by: User;
}

export interface User {
    id: string;
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    resetPasswordToken: string;
    registrationToken: string;
    isActive: boolean;
    roles: [];
    blocked: boolean;
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
