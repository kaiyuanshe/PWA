import { component, mixin, watch, attribute, createCell } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { formatDate } from 'web-utility/source/date';
import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { Embed } from 'boot-cell/source/Media/Embed';
import { Image } from 'boot-cell/source/Media/Image';
import { encodeQRC } from 'boot-cell/source/utility/QRCode';

import style from './MainShowRoom.module.less';
import { Program, organization, User } from '../model';

@observer
@component({
    tagName: 'partner-detail',
    renderTarget: 'children'
})
export class PartnerDetail extends mixin() {
    @attribute
    @watch
    oid = 0;

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
        <div className="row mb-5 px-2" style={{ backgroundColor: '#745491' }}>
            <div
                className="col-5 my-4"
                style={{ borderRight: '1px dashed white' }}
            >
                <p>{title}</p>
                <p>
                    {start_time.split('T')[0]}&nbsp;&nbsp;
                    {formatDate(start_time, 'HH:mm') +
                        ' ~ ' +
                        formatDate(end_time, 'HH:mm')}
                </p>
                <p>{place}</p>
            </div>
            <div className="col-7 my-4">{summary}</div>
        </div>
    );

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
            current: { name, slogan, video, logo, summary, message_link },
            programs
        } = organization;

        const mentors = programs.map(({ mentors }) => mentors).flat();

        return (
            <SpinnerBox className={style.ground} cover={loading}>
                <div className="container overflow-auto">
                    <h1 className="mt-5 text-center">{name}</h1>
                    <p className="h4 my-4 text-center">{slogan}</p>
                    {video && (
                        <Embed
                            is="iframe"
                            className={style['main-video']}
                            src={video.url}
                            framespacing="0"
                            allowfullscreen="true"
                        />
                    )}
                    <header
                        className="row mt-5 mb-5 px-2"
                        style={{ backgroundColor: '#745491' }}
                    >
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

                    <h2 className="text-center">精彩内容</h2>
                    <section className="my-5">
                        {programs.map(this.renderProgram)}
                    </section>

                    <h2 className="text-center">参会大咖</h2>
                    <section className="my-5">
                        {mentors.map(this.renderMentor)}
                    </section>
                </div>
            </SpinnerBox>
        );
    }
}