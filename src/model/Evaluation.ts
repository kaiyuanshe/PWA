import { computed } from 'mobx';

import { BaseData, CollectionModel } from './Base';
import { User } from './service';
import { Program } from './Activity';
import { SessionModel } from './Session';

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

    session: SessionModel;

    constructor(session: SessionModel) {
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

    @computed
    get userEvaluation() {
        const { id: uid } = this.session.user || {};

        return this.allItems.find(({ creator: { id } }) => id === uid);
    }
}
