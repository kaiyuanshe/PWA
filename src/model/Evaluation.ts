import { computed, observable } from 'mobx';
import { BaseData, NewData, Query, CollectionModel } from 'mobx-strapi';

import { User } from './service';
import { UserSessionModel } from './Session';
import { Program } from './Program';

export interface Evaluation extends BaseData {
    score: number;
    detail: string;
    contribution?: BaseData; // To implement
    program?: Program;
    creator: User;
}

export class EvaluationModel extends CollectionModel<Evaluation> {
    name = 'evaluation';
    basePath = 'evaluations';

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
            this.current = item;
            this.userSubmitted = true;
        }
        return this.allItems;
    }

    async update(data: NewData<Evaluation>) {
        await super.update(data);
        await this.getAll();

        return this.current;
    }
}
