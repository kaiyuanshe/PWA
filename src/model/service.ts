import { HTTPClient } from 'koajax';

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
