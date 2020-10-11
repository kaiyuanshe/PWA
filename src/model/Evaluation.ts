import { BaseData, BaseModel } from './Base';
import { User } from './service';
import { Program } from './Activity';

export interface Evaluation extends BaseData {
    score: number;
    detail: string;
    contribution: any; // To implement
    program: Program;
    creator: User;
}

export class EvaluationModel extends BaseModel<Evaluation> {
    scope = 'evaluations';
}
