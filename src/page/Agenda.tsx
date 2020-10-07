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

import { activity, Program } from '../model';

const BadgeColors = [...Object.values(Status), ...Object.values(Theme)],
    ProgramMap = {
        lecture: '演讲',
        workshop: '动手训练营',
        exhibition: '展位'
    };

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
        activity.getAgenda(this.aid);

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

    renderProgram = ({
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
            className="col-12 col-sm-6 col-md-3 mb-4"
            id={'program-' + id}
            key={'program-' + id}
        >
            <Card
                className="h-100"
                title={title}
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
                    <div className="text-center">
                        {formatDate(start_time, 'M-D H:mm') +
                            ' ~ ' +
                            formatDate(end_time, 'M-D H:mm')}
                    </div>
                }
            >
                <dl>
                    <dt>讲师</dt>
                    <dd className="d-flex py-2">
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
                            <dt>场地</dt>
                            <dd>{place.location}</dd>
                        </>
                    )}
                </dl>
            </Card>
        </div>
    );

    render(_, { date, category }: AgendaPageState) {
        const {
            loading,
            current: { banner, id },
            currentAgenda,
            currentDays
        } = activity;

        const programsOfToday = currentAgenda.filter(({ start_time }) =>
            start_time.startsWith(date)
        );
        const programs = !category
            ? programsOfToday
            : programsOfToday.filter(({ category: { id } }) => category === id);

        return (
            <SpinnerBox cover={loading}>
                {banner && <Image background src={banner.url} />}

                <main className="container my-5">
                    <h2 className="text-center">大会议程</h2>
                    <form
                        className="row m-0 py-4 sticky-top bg-white"
                        style={{ top: '3.6rem' }}
                    >
                        <FormField
                            is="select"
                            className="col-6 col-sm-4"
                            value={date}
                            onChange={({ target }) =>
                                this.setState({
                                    date: (target as HTMLSelectElement).value
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
                                    category: +(target as HTMLSelectElement)
                                        .value
                                })
                            }
                        >
                            <option value={0}>全部类别</option>
                            {programsOfToday.map(
                                ({ category: { id, name } }) => (
                                    <option value={id}>{name}</option>
                                )
                            )}
                        </FormField>
                        <div className="col-12 col-sm-4">
                            <Button
                                block
                                color="success"
                                onClick={this.showCurrent}
                            >
                                当前议题
                            </Button>
                        </div>
                    </form>
                    <section className="row">
                        {programs[0] ? (
                            programs.map(this.renderProgram)
                        ) : (
                            <p className="text-center">没有议程</p>
                        )}
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
