import 'core-js/es/string/match-all';
import { HTTPClient } from 'koajax';

export const service = new HTTPClient({
    baseURI: 'https://data.kaiyuanshe.cn/',
    responseType: 'json'
});

export interface Editor {
    id: string;
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    password: string;
    resetPasswordToken: string;
    registrationToken: string;
    isActive: boolean;
    roles: [];
    blocked: boolean;
}

export interface MediaData {
    id: string;
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
    created_by: string;
    updated_by: string;
}
