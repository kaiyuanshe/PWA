import 'array-unique-proposal';
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
import { scrollTo } from 'web-utility/source/DOM';

import { Status, Theme } from 'boot-cell/source/utility/constant';
import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { Image } from 'boot-cell/source/Media/Image';
import { FormField } from 'boot-cell/source/Form/FormField';
import { Button } from 'boot-cell/source/Form/Button';
import { Card } from 'boot-cell/source/Content/Card';
import { Badge } from 'boot-cell/source/Reminder/Badge';
import { TooltipBox } from 'boot-cell/source/Prompt/Tooltip';

import { TimeRange } from '../component/TimeRange';
import { ProgramMap } from './constants';
import { activity, Program, session } from '../model';

const BadgeColors = [...Object.values(Status), ...Object.values(Theme)];

interface AgendaPageState {
    date: string;
    category: number;
}

@observer
@component({
    tagName: 'agenda-page',
    renderTarget: 'children'
})
export class AgendaPage extends mixin<{ aid: number }, AgendaPageState>() {
    @attribute
    @watch
    aid = 1;

    state = { date: '', category: 0 };

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
        activity.getPrograms(this.aid);

        super.connectedCallback();
    }

    showCurrent = async (event: MouseEvent) => {
        event.preventDefault();

        const now = Date.now(),
            today = AgendaPage.toady,
            { date } = this.state,
            { currentAgenda } = activity;

        if (date !== today) await this.setState({ date: today, category: 0 });

        const { id } =
            currentAgenda.find(
                ({ start_time }) => +new Date(start_time) <= now
            ) || {};

        if (id) scrollTo('#program-' + id);
    };

    renderFilter(programsOfToday: Program[]) {
        const { date } = this.state,
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
                            category: 0
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
                    onChange={({ target }) =>
                        this.setState({
                            category: +(target as HTMLSelectElement).value
                        })
                    }
                >
                    <option value={0}>全部类别</option>
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
            className="col-12 col-sm-6 col-md-4 mb-4"
            id={'program-' + id}
            key={'program-' + id}
        >
            <Card
                className="h-100"
                title={<a href={'program?pid=' + id}>{title}</a>}
                header={
                    <div className="d-flex justify-content-around">
                        <Badge color={BadgeColors[cid % BadgeColors.length]}>
                            {name}
                        </Badge>
                        <Badge color={type === 'lecture' ? 'info' : 'warning'}>
                            {ProgramMap[type]}
                        </Badge>
                    </div>
                }
                footer={
                    <TimeRange
                        className="text-center"
                        start={start_time}
                        end={end_time}
                    />
                }
            >
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
            </Card>
        </div>
    );

    renderExhibition = ({ id, organization, project, place }: Program) => (
        <div
            className="col-12 col-sm-6 col-md-4 mb-4"
            id={'program-' + id}
            key={'program-' + id}
        >
            <Card
                title={project ? project.name : organization?.name}
                image={project ? project.logo?.url : organization?.logo?.url}
                footer={place && <address>{place.location}</address>}
            >
                {project ? project.summary : organization?.summary}
            </Card>
        </div>
    );

    render(_, { date, category }: AgendaPageState) {
        const {
            loading,
            current: { banner, id },
            currentAgenda,
            currentExhibitions
        } = activity;

        const programsOfToday = currentAgenda.filter(({ start_time }) =>
            start_time.startsWith(date)
        );
        const programs = !category
            ? programsOfToday
            : programsOfToday.filter(({ category: { id } }) => category === id);

        const applyButton = (
            <Button
                className="mt-3"
                href={'exhibition/apply?aid=' + id}
                disabled={!session.user}
            >
                立即申请
            </Button>
        );

        return (
            <SpinnerBox cover={loading}>
                {banner && <Image background src={banner.url} />}

                <main className="container">
                    <h2 className="mt-5 text-center">大会议程</h2>
                    <section>
                        {this.renderFilter(programsOfToday)}
                        <div className="row">
                            {programs[0] ? (
                                programs.map(this.renderAgenda)
                            ) : (
                                <p className="m-auto">没有议程</p>
                            )}
                        </div>
                    </section>

                    <h2 className="mt-5 text-center">开源市集</h2>
                    <p className="mt-4 text-center text-muted">
                        本届大会的开源市集设置于<strong>成都分会场</strong>
                        <br />
                        {session.user ? (
                            applyButton
                        ) : (
                            <TooltipBox text="请先登录">
                                {applyButton}
                            </TooltipBox>
                        )}
                    </p>
                    <section className="row">
                        {currentExhibitions.map(this.renderExhibition)}
                    </section>
                </main>

                <footer className="my-5 text-center">
                    <Button size="lg" href={'showroom?aid=' + id}>
                        合作伙伴
                    </Button>
                </footer>
            </SpinnerBox>
        );
    }
}
