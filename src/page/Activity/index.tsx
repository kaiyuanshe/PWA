import 'array-unique-proposal';

import {
    Badge,
    Button,
    Card,
    CardFooter,
    CardHeader,
    FormField,
    Image,
    SpinnerBox,
    Status,
    Theme,
    TooltipBox
} from 'boot-cell';
import { observable } from 'mobx';
import {
    attribute,
    component,
    observer,
    WebCell,
    WebCellProps
} from 'web-cell';
import { formatDate, scrollTo } from 'web-utility';

import { TimeRange } from '../../component/TimeRange';
import { activity, Program, program, session } from '../../model';
import { ProgramMap } from './constants';
import * as styles from './index.module.less';

const BadgeColors = [...Object.values(Status), ...Object.values(Theme)];

interface AgendaPageState {
    date: string;
    category: string;
}

export interface AgendaPageProps extends WebCellProps {
    aid: string;
}

export interface AgendaPage extends WebCell<AgendaPageProps> {}

@component({ tagName: 'agenda-page' })
@observer
export class AgendaPage
    extends HTMLElement
    implements WebCell<AgendaPageProps>
{
    @attribute
    @observable
    accessor aid = '2';

    @observable
    accessor date = '';

    @observable
    accessor category = '';

    static get toady() {
        return formatDate(Date.now(), 'YYYY-MM-DD');
    }

    connectedCallback() {
        activity.getOne(this.aid).then(() => {
            const { currentDays } = activity,
                today = AgendaPage.toady;

            this.date =
                currentDays.find(day => day === today) || currentDays[0];
        });
        program.getAll({ activity: this.aid });
    }

    showCurrent = async (event: MouseEvent) => {
        event.preventDefault();

        const now = Date.now(),
            today = AgendaPage.toady,
            { date } = this,
            { currentAgenda } = program;

        if (date !== today) {
            this.date = today;
            this.category = '';
        }
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
        const { date, category } = this,
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
                    onChange={({ target }) => {
                        this.date = (target as HTMLSelectElement).value;
                        this.category = '';
                    }}
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
                        (this.category = (target as HTMLSelectElement).value)
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
            key={'program-' + id}
            className="col-12 col-sm-6 col-md-4 mb-4 d-flex"
            id={'program-' + id}
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
            key={'program-' + id}
            className={`mt-2 shadow-sm ${styles.exhibition}`}
            id={'program-' + id}
            title={
                <a
                    className="stretched-link"
                    target="_blank"
                    href={project ? project.link : organization?.link}
                    rel="noreferrer"
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
        const { currentOne } = activity,
            { currentAgenda, currentExhibitions } = program;
        const loading = activity.downloading > 0,
            pending = program.downloading > 0,
            { banner, id } = currentOne;

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

                    <h2 className="mt-5 text-center">开源市集</h2>
                    <p className="mt-4 text-center text-muted">
                        本届大会的开源市集设置于<strong>成都分会场</strong>
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
                        合作伙伴
                    </Button>
                </footer>
            </SpinnerBox>
        );
    }
}
