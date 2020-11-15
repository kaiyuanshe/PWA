import {
    component,
    mixin,
    watch,
    attribute,
    createCell,
    Fragment
} from 'web-cell';
import { observer } from 'mobx-web-cell';
import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { Image } from 'boot-cell/source/Media/Image';
import { ListGroup, ListItem } from 'boot-cell/source/Content/ListGroup';

import { TimeRange } from '../../component/TimeRange';
import { Evaluation } from '../../component/Evaluation';
import { ProgramMap } from './constants';
import style from './ShowRoom.module.less';
import { program, User } from '../../model';

@observer
@component({
    tagName: 'agenda-detail',
    renderTarget: 'children'
})
export class AgendaDetail extends mixin() {
    @attribute
    @watch
    pid = '';

    connectedCallback() {
        program.getOne(this.pid).then(() => program.getSameCategory());

        super.connectedCallback();
    }

    renderMentor = ({ avatar, name, summary }: User) => (
        <div className={`row px-2 ${style.card}`}>
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
                category,
                id
            },
            list
        } = program;

        return (
            <SpinnerBox className={style.ground} cover={loading}>
                <div className="container overflow-auto text-white">
                    <h1 className="mt-5 text-center">{title}</h1>
                    <div className="row mt-3">
                        <TimeRange
                            className="col-4"
                            start={start_time}
                            end={end_time}
                        />
                        <div className="col-4 text-center">
                            {ProgramMap[type]}
                        </div>
                        <address className="col-4 text-right">
                            {place?.location}
                        </address>
                    </div>
                    {summary && (
                        <>
                            <h2 className="text-center mt-5">议题简介</h2>
                            <div
                                className={`row mt-4 mb-5 px-3 py-4 ${style.card}`}
                            >
                                {summary}
                            </div>
                        </>
                    )}
                    <h2 className="text-center mt-5">演讲者</h2>
                    <section className="mt-4 mb-5">
                        {mentors?.map(this.renderMentor)}
                    </section>

                    <h2 className="text-center">专场主题</h2>
                    <section className={`mt-4 mb-5 ${style.card}`}>
                        <h5 className="text-center my-2">{category?.name}</h5>
                        <p className="mb-3 px-3">{category?.summary}</p>
                        {list.length > 0 ? (
                            <div
                                className="py-2"
                                style={{
                                    backgroundColor: '#bf91c2',
                                    color: 'black'
                                }}
                            >
                                <h5 className="pt-2 text-center">
                                    主题相关议题
                                </h5>
                                <ListGroup>
                                    {list.map(({ id, title }) => (
                                        <ListItem
                                            href={'activity/agenda?pid=' + id}
                                        >
                                            {title}
                                        </ListItem>
                                    ))}
                                </ListGroup>
                            </div>
                        ) : null}
                    </section>
                    <Evaluation program={id} />
                </div>
            </SpinnerBox>
        );
    }
}
