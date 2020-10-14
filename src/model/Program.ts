import { observable } from 'mobx';
import { CollectionModel, pending } from './Base';
import { service } from './service';
import { Program } from './Activity';
import { Evaluation } from './Evaluation';

export class ProgramModel extends CollectionModel<
    Program,
    'id' | 'title' | 'mentors'
> {
    name = 'program';
    basePath = 'programs';

    @observable
    evaluations: Evaluation[] = [];

    @pending
    async getSameCategory(cid: number, pid = this.current.id) {
        const { body } = await service.get<Program[]>(
            `programs?category=${cid}&id_ne=${pid}`
        );
        return (this.list = body);
    }

    @pending
    async getEvaluation(pid: number) {
        const { body } = await service.get<Evaluation[]>(
            'evaluations?program=' + pid
        );
        return (this.evaluations = body);
    }
}
