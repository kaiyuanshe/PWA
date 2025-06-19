import { Embed, encodeQRC, Image, SpinnerBox } from 'boot-cell';
import { observable } from 'mobx';
import { NestedData } from 'mobx-strapi';
import { attribute, component, observer } from 'web-cell';

import { TimeRange } from '../../component/TimeRange';
import { organization, Program, User } from '../../model';
import * as styles from './ShowRoom.module.less';

@component({ tagName: 'partner-detail' })
@observer
export class PartnerDetail extends HTMLElement {
    @attribute
    @observable
    accessor oid = '';

    connectedCallback() {
        organization.getOne(+this.oid);
    }

    renderProgram = ({
        title,
        start_time,
        end_time,
        place,
        summary
    }: Program) => (
        <div className={`row mb-5 px-2 ${styles.card}`}>
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
        const { downloading, currentOne, programs } = organization;
        const { name, slogan, video, logo, summary, messageLink } = currentOne;

        const mentors = programs.map(({ mentors }) => mentors).flat();

        return (
            <SpinnerBox className={styles.ground} cover={downloading > 0}>
                <div className="container overflow-auto text-white">
                    <h1 className="mt-5 text-center">{name}</h1>
                    <p className="h4 my-4 text-center">{slogan}</p>
                    {video && (
                        <Embed
                            is="video"
                            className={styles['main-video']}
                            src={video.url}
                            controls
                            autoplay
                        />
                    )}
                    <header className={`row mt-5 mb-5 px-2 ${styles.card}`}>
                        <div className="col-2 my-4 text-center">
                            <Image thumbnail src={logo?.url} />
                            {messageLink && (
                                <Image
                                    className="mt-3 mb-2"
                                    src={encodeQRC(messageLink)}
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
