import { HTTPClient, HTTPError } from 'koajax';

import { BaseData, MediaData } from './Base';
import { Organization } from './Organization';

const { localStorage, location } = self;

var token: string = localStorage.token || '';

export const setToken = (raw: string) => (token = localStorage.token = raw);

export const service = new HTTPClient({
    baseURI:
        location.hostname === 'localhost'
            ? 'http://localhost:1337/'
            : 'https://data.kaiyuanshe.cn/',
    responseType: 'json'
}).use(({ request }, next) => {
    if (token)
        (request.headers = request.headers || {})['Authorization'] =
            'Bearer ' + token;

    return next();
});

export const github = new HTTPClient({
    baseURI: 'https://api.github.com/',
    responseType: 'json'
});

export type APIError = HTTPError<{
    statusCode: number;
    error: string;
    message: string;
    data?: { messages: Record<string, string>[] }[];
}>;

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

export interface Category extends BaseData {
    name: string;
    summary?: string;
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
