import { Editor, MediaData } from './service';

export interface Organization {
    id: string;
    name: string;
    slogan?: string;
    logo?: MediaData;
    link: string;
    summary: string;
    video?: MediaData;
    message_link: string;
    created_by?: Editor;
    updated_by?: Editor;
}
