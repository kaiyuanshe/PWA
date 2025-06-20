import {
    Category,
    Evaluation,
    Organization,
    Place,
    Program as _Program,
    Project
} from '@kaiyuanshe/data-server';
import { observable } from 'mobx';
import { Filter, NewData, toggle } from 'mobx-restful';

import { ActivityModel } from './Activity';
import { CollectionModel } from './service';

export interface Program extends _Program {
    category?: Category;
    organization?: Organization;
    project?: Project;
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

    async getAll({ activity, ...query }: Filter<Program>) {
        await super.getAll({ activity, ...query });
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
        }: Pick<Filter<Program>, 'id' | 'activity' | 'category'> = {
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
