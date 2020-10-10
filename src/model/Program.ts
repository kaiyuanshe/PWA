import { observable } from 'mobx';

import { service } from './service';
import { Program } from './Activity';

export class ProgramModel {
    @observable
    loading = false;

    @observable
    current: Program = {} as Program;

    @observable
    programs: Program[] = [];

    async getOne(pid: number) {
        this.loading = true;
        const { body } = await service.get<Program>('programs/' + pid);
        this.loading = false;
        return (this.current = body);
    }

    async getSameCategory(pid: number, cid: number) {
        this.loading = true;
        const { body } = await service.get<Program[]>(
            'programs?category=' + cid + '&id_ne=' + pid
        );
        this.loading = false;
        return (this.programs = body);
    }
}
