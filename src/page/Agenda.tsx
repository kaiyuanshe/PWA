import {
    component,
    mixin,
    watch,
    attribute,
    createCell,
    Fragment
} from 'web-cell';
import { observer } from 'mobx-web-cell';
import { Status, Theme } from 'boot-cell/source/utility/constant';
import { Card } from 'boot-cell/source/Content/Card';
import { Badge } from 'boot-cell/source/Reminder/Badge';

import { activity, Program } from '../model';
import { Image } from 'boot-cell/source/Media/Image';

const BadgeColors = [...Object.values(Status), ...Object.values(Theme)];

@observer
@component({
    tagName: 'agenda-page',
    renderTarget: 'children'
})
export class AgendaPage extends mixin() {
    @attribute
    @watch
    aid = 1;

    connectedCallback() {
        activity.getOne(this.aid), activity.getAgenda(this.aid);

        super.connectedCallback();
    }

    renderProgram = ({
        title,
        category: { id: cid, name },
        start_time,
        end_time,
        mentors
    }: Program) => (
        <div className="col-12 col-sm-6 col-md-3">
            <Card
                title={title}
                header={
                    <Badge color={BadgeColors[cid % BadgeColors.length]}>
                        {name}
                    </Badge>
                }
                footer={
                    new Date(start_time).toLocaleString() +
                    ' ~ ' +
                    new Date(end_time).toLocaleString()
                }
            >
                <dl>
                    <dt>讲师</dt>
                    <dd className="d-flex">
                        {mentors.map(({ avatar, username }) => (
                            <div>
                                {avatar && (
                                    <Image thumbnail src={avatar.previewUrl} />
                                )}
                                {username}
                            </div>
                        ))}
                    </dd>
                </dl>
            </Card>
        </div>
    );

    render() {
        const {
            current: {
                banner: { url }
            },
            currentAgenda
        } = activity;

        return (
            <>
                <Image background style={{ height: '80vh' }} src={url} />

                <main className="container my-5">
                    <h2 className="text-center">大会议程</h2>
                    <section className="row mt-4">
                        {currentAgenda.map(this.renderProgram)}
                    </section>
                </main>
            </>
        );
    }
}
