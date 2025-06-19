import { Image, ListGroup, ListItem, SpinnerBox } from 'boot-cell';
import { observable } from 'mobx';
import { NestedData } from 'mobx-strapi';
import { attribute, component } from 'web-cell';
import { observer } from 'web-cell';

import { EvaluationForm } from '../../component/Evaluation';
import { TimeRange } from '../../component/TimeRange';
import { program, User } from '../../model';
import { ProgramMap } from './constants';
import * as styles from './ShowRoom.module.less';

@component({ tagName: 'agenda-detail' })
@observer
export class AgendaDetail extends HTMLElement {
    @attribute
    @observable
    accessor pid = '';

    async connectedCallback() {
        await program.getOne(this.pid);

        program.getSameCategory();
    }

    renderMentor = ({ avatar, name, summary }: NestedData<User>) => (
        <div className={`row px-2 ${styles.card}`}>
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
        const { downloading, currentOne, currentPage } = program;
        const {
            title,
            start_time,
            end_time,
            type,
            summary,
            place,
            mentors,
            category,
            id
        } = currentOne;

        return (
            <SpinnerBox className={styles.ground} cover={downloading > 0}>
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
                                className={`row mt-4 mb-5 px-3 py-4 ${styles.card}`}
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
                    <section className={`mt-4 mb-5 ${styles.card}`}>
                        <h5 className="text-center my-2">{category?.name}</h5>
                        <p className="mb-3 px-3">{category?.summary}</p>
                        {currentPage.length > 0 ? (
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
                                    {currentPage.map(({ id, title }) => (
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
                    <EvaluationForm program={id + ''} />
                </div>
            </SpinnerBox>
        );
    }
}
