import { observable } from 'mobx';
import { NewData, toggle } from 'mobx-restful';
import { BaseData, MediaData, NestedData, Query } from 'mobx-strapi';

import { Activity, ActivityModel } from './Activity';
import { Category } from './Category';
import { Evaluation } from './Evaluation';
import { Organization } from './Organization';
import { Project } from './Project';
import { CollectionModel, Place, User } from './service';

export interface Program extends BaseData {
    title: string;
    start_time: string;
    end_time: string;
    summary?: string;
    mentors: NestedData<User>[];
    activity: NestedData<Activity>;
    type: 'lecture' | 'workshop' | 'exhibition';
    place?: NestedData<Place>;
    evaluations: any[];
    accounts: any[];
    documents: MediaData[];
    verified: boolean;
    category: NestedData<Category>;
    project?: NestedData<Project>;
    organization?: NestedData<Organization>;
}

export class ProgramModel extends CollectionModel<Program> {
    name = 'program';
    baseURI = 'programs';

    @observable
    currentAgenda: Program[] = [];

    @observable
    currentExhibitions: Program[] = [];

    @observable
    evaluations: Evaluation[] = [];

    constructor(public activity: ActivityModel) {
        super();
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

    @toggle('downloading')
    async getSameCategory(
        {
            id,
            activity,
            category
        }: Pick<Query<Program>, 'id' | 'activity' | 'category'> = {
            id: this.currentOne.id,
            activity: this.currentOne.activity?.id,
            category: this.currentOne.category?.id
        }
    ) {
        const { body } = await this.client.get<Program[]>(
            `programs?activity=${activity}&category=${category}&id_ne=${id}`
        );

        return (this.list = body);
    }

    @toggle('downloading')
    async getEvaluation(pid: number) {
        const { body } = await this.client.get<Evaluation[]>(
            'evaluations?program=' + pid
        );

        return (this.evaluations = body);
    }

    @toggle('downloading')
    async updateOne({
        type,
        start_time,
        end_time,
        activity,
        ...data
    }: NewData<Program>) {
        if (type === 'exhibition') {
            if (!(start_time && end_time) && activity !== this.currentOne.id)
                await this.activity.getOne(activity);

            ({ start_time, end_time } = this.activity.currentOne);
        }

        return super.updateOne({
            type,
            start_time,
            end_time,
            activity,
            ...data
        });
    }
}
