import { observable } from 'mobx';
import {
    BaseData,
    NewData,
    Query,
    MediaData,
    CollectionModel,
    service,
    loading
} from 'mobx-strapi';

import { Category, Place, User } from './service';
import { Evaluation } from './Evaluation';
import { Activity, ActivityModel } from './Activity';
import { Project } from './Project';
import { Organization } from './Organization';

export interface Program extends BaseData {
    title: string;
    start_time: string;
    end_time: string;
    summary?: string;
    mentors: User[];
    activity: Activity;
    type: 'lecture' | 'workshop' | 'exhibition';
    place?: Place;
    evaluations: any[];
    accounts: any[];
    documents: MediaData[];
    verified: boolean;
    category: Category;
    project?: Project;
    organization?: Organization;
}

export class ProgramModel extends CollectionModel<
    Program,
    'id' | 'title' | 'mentors'
> {
    name = 'program';
    basePath = 'programs';

    @observable
    currentAgenda: Program[] = [];

    @observable
    currentExhibitions: Program[] = [];

    @observable
    evaluations: Evaluation[] = [];

    activity: ActivityModel;

    constructor(activity: ActivityModel) {
        super();
        this.activity = activity;
    }

    async getAll({
        activity,
        verified = true,
        _sort = 'start_time:ASC',
        ...query
    }: Query<Program>) {
        await super.getAll({
            activity,
            verified,
            _sort,
            ...query
        });
        const agenda: Program[] = [],
            exhibitions: Program[] = [];

        for (const program of this.allItems)
            if (program.type !== 'exhibition') agenda.push(program);
            else exhibitions.push(program);

        this.currentAgenda = agenda;
        this.currentExhibitions = exhibitions;
        return this.allItems;
    }

    @loading
    async getSameCategory(
        {
            id,
            activity,
            category
        }: Pick<Query<Program>, 'id' | 'activity' | 'category'> = {
            id: this.current.id,
            activity: this.current.activity?.id,
            category: this.current.category?.id
        }
    ) {
        const { body } = await service.get<Program[]>(
            `programs?activity=${activity}&category=${category}&id_ne=${id}`
        );
        return (this.list = body);
    }

    @loading
    async getEvaluation(pid: number) {
        const { body } = await service.get<Evaluation[]>(
            'evaluations?program=' + pid
        );
        return (this.evaluations = body);
    }

    @loading
    async update({
        type,
        start_time,
        end_time,
        activity,
        ...data
    }: NewData<Program>) {
        if (type === 'exhibition') {
            if (!(start_time && end_time) && activity !== this.current.id)
                await this.activity.getOne(activity);

            ({ start_time, end_time } = this.activity.current);
        }
        return super.update({
            type,
            start_time,
            end_time,
            activity,
            ...data
        });
    }
}
