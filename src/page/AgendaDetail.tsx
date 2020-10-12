import {
    component,
    mixin,
    watch,
    attribute,
    createCell,
    Fragment
} from 'web-cell';
import { observer } from 'mobx-web-cell';
import { formatDate } from 'web-utility/source/date';
import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { Image } from 'boot-cell/source/Media/Image';
import { NavLink } from 'boot-cell/source/Navigator/Nav';

import style from './MainShowRoom.module.less';
import { program, User } from '../model';
import { ProgramMap } from './Common';
import { Evaluation } from '../component/Evaluation';

@observer
@component({
    tagName: 'agenda-detail',
    renderTarget: 'children'
})
export class AgendaDetail extends mixin() {
    @attribute
    @watch
    pid = 0;

    @attribute
    @watch
    cid = 0;

    connectedCallback() {
        program.getById(this.pid);
        program.getSameCategory(this.pid, this.cid);
        super.connectedCallback();
    }

    renderMentor = ({ avatar, name, summary }: User) => (
        <div className="row px-2" style={{ backgroundColor: '#745491' }}>
            <div className="col-2 my-4">
                {avatar && <Image thumbnail src={avatar.url} />}
            </div>
            <div className="col-10 my-4">
                <h5>{name}</h5>
                <p>{summary}</p>
            </div>
        </div>
    );

    render() {
        const {
            loading,
            current: {
                title,
                start_time,
                end_time,
                type,
                summary,
                place,
                mentors,
                category
            },
            list
        } = program;

        return (
            <SpinnerBox className={style.ground} cover={loading}>
                <div className="container overflow-auto">
                    <h1 className="mt-5 text-center">{title}</h1>
                    <div class="row mt-3">
                        <div class="col-4 text-left">
                            {start_time?.split('T')[0]}
                            <span class="mx-2" />
                            {formatDate(start_time, 'HH:mm')} ~{' '}
                            {formatDate(end_time, 'HH:mm')}
                        </div>
                        <div class="col-4 text-center">{ProgramMap[type]}</div>
                        <div class="col-4 text-right">{place}</div>
                    </div>
                    {summary && (
                        <>
                            <h2 class="text-center mt-5">议题简介</h2>
                            <div
                                class="row mt-4 mb-5 px-3 py-4"
                                style={{ backgroundColor: '#745491' }}
                            >
                                {summary}
                            </div>
                        </>
                    )}
                    <h2 class="text-center mt-5">演讲者</h2>
                    <section className="mt-4 mb-5">
                        {mentors?.map(this.renderMentor)}
                    </section>

                    <h2 class="text-center">专场主题</h2>
                    <div
                        class="row mt-4 mb-5"
                        style={{ backgroundColor: '#745491' }}
                    >
                        <h5 class="text-center my-2 col-12">
                            {category?.name}
                        </h5>
                        <p class="mb-3 px-3">{category?.summary}</p>
                        {list.length > 0 ? (
                            <div
                                class="col-12 text-center py-2"
                                style={{
                                    backgroundColor: '#bf91c2',
                                    color: 'black'
                                }}
                            >
                                <h5 class="pt-2">主题相关议题</h5>
                                {list.map(p => (
                                    <NavLink
                                        style={{ color: 'black' }}
                                        href={
                                            'program?pid=' +
                                            p.id +
                                            '&cid=' +
                                            p.category.id
                                        }
                                    >
                                        - {p.title}
                                    </NavLink>
                                ))}
                            </div>
                        ) : null}
                    </div>
                    <Evaluation />
                </div>
            </SpinnerBox>
        );
    }
}
