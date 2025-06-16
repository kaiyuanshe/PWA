import { computed, observable } from 'mobx';
import { NewData } from 'mobx-restful';
import { BaseData, NestedData, Query } from 'mobx-strapi';

import { Program } from './Program';
import { CollectionModel, User } from './service';
import { UserSessionModel } from './Session';

export interface Evaluation extends BaseData {
    score: number;
    detail: string;
    contribution?: BaseData; // To implement
    program?: NestedData<Program>;
    creator: NestedData<User>;
}

export class EvaluationModel extends CollectionModel<Evaluation> {
    name = 'evaluation';
    baseURI = 'evaluations';

    session: UserSessionModel;

    constructor(session: UserSessionModel) {
        super();
        this.session = session;
    }

    @computed
    get averageScore() {
        const { allItems } = this;

        return (
            allItems.reduce((sum, { score }) => sum + score, 0) /
            allItems.length
        );
    }

    @observable
    userSubmitted = false;

    async getAll(query: Query<Evaluation> = {}) {
        await super.getAll(query);

        const { id: uid } = this.session.user || {};

        const item = this.allItems.find(({ creator: { id } }) => id === uid);

        if (item) {
            this.currentOne = item;
            this.userSubmitted = true;
        }

        return this.allItems;
    }

    async updateOne(data: NewData<Evaluation>) {
        await super.updateOne(data);
        await this.getAll();

        return this.currentOne;
    }
}
