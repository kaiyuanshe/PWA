import 'array-unique-proposal';

import {
    Badge,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    CardTitle,
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
import { t } from '../../i18n';
import { activity, Program, program, session } from '../../model';
import { ProgramMap } from './constants';
import * as styles from './index.module.less';

const BadgeColors = [...Object.values(Status), ...Object.values(Theme)];

export interface AgendaPageProps extends WebCellProps {
    aid: number;
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
    accessor aid = 2;

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
            <TooltipBox content={t('loginFirst')}>{button}</TooltipBox>
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
                    <option value="0">{t('allCategories')}</option>
                    {programsOfToday
                        .uniqueBy(({ category: { id } }) => id)
                        .map(({ category: { id, name } }) => (
                            <option key={id} value={id + ''}>
                                {name}
                            </option>
                        ))}
                </FormField>
                <div className="col-12 col-sm-4">
                    <Button block color="success" onClick={this.showCurrent}>
                        {t('currentAgenda')}
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
            <Card className="flex-fill">
                <CardHeader className="d-flex justify-content-around">
                    <Badge color={BadgeColors[+cid % BadgeColors.length]}>
                        {name}
                    </Badge>
                    <Badge color={type === 'lecture' ? 'info' : 'warning'}>
                        {ProgramMap[type]}
                    </Badge>
                </CardHeader>
                <CardBody>
                    <CardTitle>
                        <a href={'activity/agenda?pid=' + id}>{title}</a>
                    </CardTitle>
                    <dl>
                        <dt>{t('lecturer')}</dt>
                        <dd className="d-flex flex-wrap justify-content-between py-2">
                            {mentors.map(({ avatar, username }) => (
                                <div>
                                    {avatar && (
                                        <Image
                                            className="rounded mr-2"
                                            style={{ width: '2rem' }}
                                            src={avatar.url}
                                        />
                                    )}
                                    {username}
                                </div>
                            ))}
                        </dd>
                        {place && (
                            <>
                                <dt>{t('venue')}</dt>
                                <dd>
                                    <address>{place.location}</address>
                                </dd>
                            </>
                        )}
                    </dl>
                </CardBody>
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
        >
            <img src={project?.logo?.url || organization?.logo?.url} />
            <CardBody>
                <CardTitle>
                    <a
                        className="stretched-link"
                        target="_blank"
                        href={project?.link || organization?.link}
                        rel="noreferrer"
                    >
                        {project?.name || organization?.name}
                    </a>
                </CardTitle>
                {project?.summary || organization?.summary}
            </CardBody>
            {place && (
                <CardFooter>
                    <address>{place.location}</address>
                </CardFooter>
            )}
        </Card>
    );

    render() {
        const { date, category } = this,
            { currentOne } = activity,
            { currentAgenda, currentExhibitions } = program;
        const loading = activity.downloading > 0,
            pending = program.downloading > 0,
            { banner, id } = currentOne;

        const programsOfToday = currentAgenda.filter(({ start_time }) =>
            start_time.startsWith(date)
        );
        const programs = !+category
            ? programsOfToday
            : programsOfToday.filter(({ category: { id } }) => +category == id);

        return (
            <SpinnerBox cover={loading}>
                {banner && <Image background src={banner.url} />}

                <main className="container">
                    <h2 className="mt-5 text-center">
                        {t('conferenceAgenda')}
                    </h2>
                    <p className="mt-4 text-center text-muted">
                        {this.renderApply(`activity/speech/edit?aid=${id}`)}
                    </p>
                    <section>
                        {this.renderFilter(programsOfToday)}
                        <SpinnerBox className="row" cover={pending}>
                            {programs[0] ? (
                                programs.map(this.renderAgenda)
                            ) : (
                                <p className="m-auto">{t('noAgenda')}</p>
                            )}
                        </SpinnerBox>
                    </section>

                    <h2 className="mt-5 text-center">{t('openMarket')}</h2>
                    <p className="mt-4 text-center text-muted">
                        {t('openMarketVenue')}
                        <strong>{t('chengduVenue')}</strong>
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
                        {t('partners')}
                    </Button>
                </footer>
            </SpinnerBox>
        );
    }
}
