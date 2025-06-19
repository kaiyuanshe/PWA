import {
    Category,
    Evaluation,
    Place,
    Program as _Program} from '@kaiyuanshe/data-server';
import { observable } from 'mobx';
import { NewData, toggle } from 'mobx-restful';
import { Query } from 'mobx-strapi';

import { ActivityModel } from './Activity';
import { CollectionModel } from './service';

export interface Program extends _Program {
    category?: Category;
    place?: Place;
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

    @observable
    activityInfoList: Program[] = [];

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
    async getMentors(mentorId: number) {
        const { body } = await this.client.get<Program[]>(
            `programs?mentors=${mentorId}&verified=false`
        );

        return (this.activityInfoList = body);
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
                await this.activity.getOne(activity as number);

            ({ startTime: start_time, endTime: end_time } =
                this.activity.currentOne);
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
