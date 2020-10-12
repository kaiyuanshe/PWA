import { observable } from 'mobx';
import { CollectionModel } from './Base';
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

    async getSameCategory(cid: number, pid = this.current.id) {
        this.loading = true;

        const { body } = await service.get<Program[]>(
            `programs?category=${cid}&id_ne=${pid}`
        );
        this.loading = false;
        return (this.list = body);
    }

    async getEvaluation(pid: number) {
        this.loading = true;
        const { body } = await service.get<Evaluation[]>(
            'evaluations?program=' + pid
        );
        this.loading = false;
        return (this.evaluations = body);
    }
}
