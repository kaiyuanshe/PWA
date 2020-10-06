import { component, mixin, watch, attribute, createCell } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { formatDate } from 'web-utility/source/date';
import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { Embed } from 'boot-cell/source/Media/Embed';
import { Image } from 'boot-cell/source/Media/Image';
import { encodeQRC } from 'boot-cell/source/utility/QRCode';

import style from './MainShowRoom.module.less';
import { Program, organization } from '../model';

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
        this.oid = '2';
        organization.getOne(this.oid);

        super.connectedCallback();
    }

    renderProgram({
        title,
        start_time,
        end_time,
        place,
        summary,
        mentors
    }: Program) {
        return (
            <div className="text-left">
                <div>
                    <h4>讲题介绍</h4>
                    <div
                        className="row mb-5 px-2"
                        style={{ backgroundColor: '#745491' }}
                    >
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
                </div>

                {mentors.map(mentor => (
                    <div>
                        <h4>讲师介绍</h4>
                        <div
                            className="row px-2"
                            style={{ backgroundColor: '#745491' }}
                        >
                            <div className="col-2 my-4">
                                {mentor.avatar ? (
                                    <Image thumbnail src={mentor.avatar.url} />
                                ) : (
                                    <div />
                                )}
                            </div>
                            <div className="col-10 my-4">
                                <h5>{mentor.name}</h5>
                                <p>研究生在读</p> {/* 讲师职业 */}
                                <p>
                                    华东师范大学研二在读，XLab实验室的一员，从19年开始在导师王伟老师的引领下慢慢接触开源社区。在这之前，“开源”两个字对我来说仅仅意味着源代码的开放，去年的开源年会包括后来一系列对其他社区的接触让我意识到这是一个更宽广也更深刻的命题。今年也是以实验室为契机，我接触到了CHAOSS项目，这算是我真正意义上去“混”的第一个社区，非常幸运，它足够成熟，也足够开放包容，7月份的Google
                                    Season of
                                    Docs我毫不犹豫的申请了CHAOSS项目，社区也对我表现出的热忱给予了回应，现在的我正在体会与CHAOSS，与社区一起协作的乐趣～
                                </p>{' '}
                                {/* 讲师个人简介 */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    render() {
        const {
            loading,
            current: { name, slogan, logo, summary, message_link },
            program
        } = organization;
        return (
            <SpinnerBox className={style.ground} cover={loading}>
                <div className="container overflow-auto">
                    <h1 className="mt-5">{name}</h1>
                    <p className="h4 my-4">{slogan}</p>
                    <Embed
                        is="iframe"
                        className={style['main-video']}
                        src="//player.bilibili.com/player.html?aid=754280090&amp;bvid=BV1Dk4y117oW&amp;cid=226560058&amp;page=1"
                        framespacing="0"
                        allowfullscreen="true"
                    />
                    <div
                        className="row mt-5 mb-5 px-2"
                        style={{ backgroundColor: '#745491' }}
                    >
                        <div className="col-2 my-4">
                            <Image thumbnail src={logo.url} />
                            <Image
                                className="mt-3 mb-2"
                                src={encodeQRC(message_link)}
                            />
                            <p>联系方式</p>
                        </div>
                        <div className="col-10 my-4 text-left">{summary}</div>
                    </div>
                    <div className="row mt-5">
                        {program?.map(this.renderProgram)}
                    </div>
                </div>
            </SpinnerBox>
        );
    }
}
