import { BaseData, Category } from './service';
import { Activity } from './Activity';
import { Organization } from './Organization';

export interface Mentor extends BaseData {
    username: string;
    email: string;
    provider: string;
    resetPasswordToken: string;
    confirmed: boolean;
    blocked: boolean;
    role: string;
    name: string;
    organizations: string;
    avatar: string;
}

export enum ProgramTypes {
    lecture = 'lecture',
    workshop = 'workshop',
    exhibition = 'exhibition'
}

export interface Place extends BaseData {
    name: string;
    location: string;
    capacity: number;
    indoor: boolean;
    // available_times: component;
    contacts: string;
    owner: string;
    // equipments: component;
    films: string[];
}

export interface Program extends BaseData {
    title: string;
    start_time: Date;
    end_time: Date;
    summary: string;
    mentors: Mentor[];
    activity: Activity;
    type: ProgramTypes;
    place: Place;
    evaluations: [];
    accounts: [];
    documents: [];
    verified: boolean;
    category: Category;
    organization: Organization;
}
