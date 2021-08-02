import 'array-unique-proposal';
import {
    WebCellProps,
    component,
    mixin,
    watch,
    attribute,
    createCell,
    Fragment
} from 'web-cell';
import { observer } from 'mobx-web-cell';
import { formatDate } from 'web-utility/source/date';
import { scrollTo } from 'web-utility/source/DOM';

import { Status, Theme } from 'boot-cell/source/utility/constant';
import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { Image } from 'boot-cell/source/Media/Image';
import { FormField } from 'boot-cell/source/Form/FormField';
import { Button } from 'boot-cell/source/Form/Button';
import { Card, CardHeader, CardFooter } from 'boot-cell/source/Content/Card';
import { Badge } from 'boot-cell/source/Reminder/Badge';
import { TooltipBox } from 'boot-cell/source/Prompt/Tooltip';

import { TimeRange } from '../../component/TimeRange';
import { ProgramMap } from './constants';
import style from './index.module.less';
import { activity, program, Program, session } from '../../model';

const BadgeColors = [...Object.values(Status), ...Object.values(Theme)];

interface AgendaPageState {
    date: string;
    category: string;
}

export interface AgendaPageProps extends WebCellProps {
    aid: string;
}

@observer
@component({
    tagName: 'agenda-page',
    renderTarget: 'children'
})
export class AgendaPage extends mixin<AgendaPageProps, AgendaPageState>() {
    @attribute
    @watch
    aid = '2';

    state = { date: '', category: '' };

    static get toady() {
        return formatDate(Date.now(), 'YYYY-MM-DD');
    }

    connectedCallback() {
        activity.getOne(this.aid).then(() => {
            const { currentDays } = activity,
                today = AgendaPage.toady;

            this.setState({
                date: currentDays.find(day => day === today) || currentDays[0]
            });
        });
        program.getAll({ activity: this.aid });

        super.connectedCallback();
    }

    showCurrent = async (event: MouseEvent) => {
        event.preventDefault();

        const now = Date.now(),
            today = AgendaPage.toady,
            { date } = this.state,
            { currentAgenda } = program;

        if (date !== today) await this.setState({ date: today, category: '' });

        const { id } =
            currentAgenda.find(
                ({ start_time }) => +new Date(start_time) <= now
            ) || {};

        if (id) scrollTo('#program-' + id);
    };

    renderApply(path: string) {
        const button = (
            <Button
                className="mt-3"
                color="primary"
                href={path}
                disabled={!session.user}
            >
                立即申请
            </Button>
        );

        return session.user ? (
            button
        ) : (
            <TooltipBox text="请先登录">{button}</TooltipBox>
        );
    }

    renderFilter(programsOfToday: Program[]) {
        const { date, category } = this.state,
            { currentDays } = activity;

        return (
            <form
                className="row m-0 py-4 sticky-top bg-white"
                style={{ top: '3.6rem', zIndex: '1000' }}
            >
                <FormField
                    is="select"
                    className="col-6 col-sm-4"
                    value={date}
                    onChange={({ target }) =>
                        this.setState({
                            date: (target as HTMLSelectElement).value,
                            category: ''
                        })
                    }
                >
                    {currentDays.map(day => (
                        <option>{day}</option>
                    ))}
                </FormField>
                <FormField
                    is="select"
                    className="col-6 col-sm-4"
                    value={category + ''}
                    onChange={({ target }) =>
                        this.setState({
                            category: (target as HTMLSelectElement).value
                        })
                    }
                >
                    <option value="0">全部类别</option>
                    {programsOfToday
                        .uniqueBy(({ category: { id } }) => id)
                        .map(({ category: { id, name } }) => (
                            <option value={id}>{name}</option>
                        ))}
                </FormField>
                <div className="col-12 col-sm-4">
                    <Button block color="success" onClick={this.showCurrent}>
                        当前议题
                    </Button>
                </div>
            </form>
        );
    }

    renderAgenda = ({
        id,
        title,
        category: { id: cid, name },
        type,
        start_time,
        end_time,
        mentors,
        place
    }: Program) => (
        <div
            className="col-12 col-sm-6 col-md-4 mb-4 d-flex"
            id={'program-' + id}
            key={'program-' + id}
        >
            <Card
                style={{ flex: '1' }}
                title={<a href={'activity/agenda?pid=' + id}>{title}</a>}
            >
                <CardHeader className="d-flex justify-content-around">
                    <Badge color={BadgeColors[+cid % BadgeColors.length]}>
                        {name}
                    </Badge>
                    <Badge color={type === 'lecture' ? 'info' : 'warning'}>
                        {ProgramMap[type]}
                    </Badge>
                </CardHeader>
                <dl>
                    <dt>讲师</dt>
                    <dd className="d-flex flex-wrap justify-content-between py-2">
                        {mentors.map(({ avatar, name, username }) => (
                            <div>
                                {avatar && (
                                    <Image
                                        className="rounded mr-2"
                                        style={{ width: '2rem' }}
                                        src={avatar.url}
                                    />
                                )}
                                {name || username}
                            </div>
                        ))}
                    </dd>
                    {place && (
                        <>
                            <dt>场地</dt>
                            <dd>
                                <address>{place.location}</address>
                            </dd>
                        </>
                    )}
                </dl>
                <CardFooter>
                    <TimeRange
                        className="text-center"
                        start={start_time}
                        end={end_time}
                    />
                </CardFooter>
            </Card>
        </div>
    );

    renderExhibition = ({ id, organization, project, place }: Program) => (
        <Card
            className={`mt-2 shadow-sm ${style.exhibition}`}
            id={'program-' + id}
            key={'program-' + id}
            title={
                <a
                    className="stretched-link"
                    target="_blank"
                    href={project ? project.link : organization?.link}
                >
                    {project ? project.name : organization?.name}
                </a>
            }
            image={project ? project.logo?.url : organization?.logo?.url}
        >
            {project ? project.summary : organization?.summary}
            {place && (
                <CardFooter>
                    <address>{place.location}</address>
                </CardFooter>
            )}
        </Card>
    );

    render(_, { date, category }: AgendaPageState) {
        const {
                loading,
                current: { banner, id }
            } = activity,
            { currentAgenda, currentExhibitions, loading: pending } = program;

        const programsOfToday = currentAgenda.filter(({ start_time }) =>
            start_time.startsWith(date)
        );
        const programs = !+category
            ? programsOfToday
            : programsOfToday.filter(({ category: { id } }) => category == id);

        return (
            <SpinnerBox cover={loading}>
                {banner && <Image background src={banner.url} />}

                <main className="container">
                    <h2 className="mt-5 text-center">大会议程</h2>
                    <p className="mt-4 text-center text-muted">
                        {this.renderApply(`activity/speech/edit?aid=${id}`)}
                    </p>
                    <section>
                        {this.renderFilter(programsOfToday)}
                        <SpinnerBox className="row" cover={pending}>
                            {programs[0] ? (
                                programs.map(this.renderAgenda)
                            ) : (
                                <p className="m-auto">没有议程</p>
                            )}
                        </SpinnerBox>
                    </section>

                    <h2 className="mt-5 text-center">开源市集sssssss</h2>
                    <p className="mt-4 text-center text-muted">
                        本届大会的开源市集设置于fasfas
                        <strong>成都分会场ssss</strong>
                        <br />
                        {this.renderApply(
                            'activity/exhibition/apply?aid=' + id
                        )}
                    </p>
                    <SpinnerBox className="card-columns" cover={pending}>
                        {currentExhibitions.map(this.renderExhibition)}
                    </SpinnerBox>
                </main>

                <footer className="my-5 text-center">
                    <Button
                        color="primary"
                        size="lg"
                        href={'activity/showroom?aid=' + id}
                    >
                        合作伙伴山山说
                    </Button>
                </footer>
            </SpinnerBox>
        );
    }
}
