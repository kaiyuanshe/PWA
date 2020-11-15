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
import { Embed } from 'boot-cell/source/Media/Embed';
import { Image } from 'boot-cell/source/Media/Image';
import { encodeQRC } from 'boot-cell/source/utility/QRCode';

import { TimeRange } from '../../component/TimeRange';
import style from './ShowRoom.module.less';
import { Program, organization, User } from '../../model';

@observer
@component({
    tagName: 'partner-detail',
    renderTarget: 'children'
})
export class PartnerDetail extends mixin() {
    @attribute
    @watch
    oid = '';

    connectedCallback() {
        organization.getOne(this.oid);

        super.connectedCallback();
    }

    renderProgram = ({
        title,
        start_time,
        end_time,
        place,
        summary
    }: Program) => (
        <div className={`row mb-5 px-2 ${style.card}`}>
            <div
                className="col-5 my-4"
                style={{ borderRight: '1px dashed white' }}
            >
                <p>{title}</p>
                <TimeRange start={start_time} end={end_time} />
                <address>{place?.location}</address>
            </div>
            <div className="col-7 my-4">{summary}</div>
        </div>
    );

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
            current: { name, slogan, video, logo, summary, message_link },
            programs
        } = organization;

        const mentors = programs.map(({ mentors }) => mentors).flat();

        return (
            <SpinnerBox className={style.ground} cover={loading}>
                <div className="container overflow-auto text-white">
                    <h1 className="mt-5 text-center">{name}</h1>
                    <p className="h4 my-4 text-center">{slogan}</p>
                    {video && (
                        <Embed
                            is="video"
                            className={style['main-video']}
                            src={video.url}
                            controls
                            autoplay
                        />
                    )}
                    <header className={`row mt-5 mb-5 px-2 ${style.card}`}>
                        <div className="col-2 my-4 text-center">
                            <Image thumbnail src={logo?.url} />
                            {message_link && (
                                <Image
                                    className="mt-3 mb-2"
                                    src={encodeQRC(message_link)}
                                />
                            )}
                            <p>联系方式</p>
                        </div>
                        <div className="col-10 my-4">{summary}</div>
                    </header>
                    {programs.length > 0 ? (
                        <>
                            <h2 className="text-center">精彩内容</h2>
                            <section className="my-5">
                                {programs.map(this.renderProgram)}
                            </section>
                        </>
                    ) : null}
                    {mentors.length > 0 ? (
                        <>
                            <h2 className="text-center">参会大咖</h2>
                            <section className="my-5">
                                {mentors.map(this.renderMentor)}
                            </section>
                        </>
                    ) : null}
                </div>
            </SpinnerBox>
        );
    }
}
