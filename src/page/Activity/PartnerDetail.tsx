import { Image, Ratio, SpinnerBox } from 'boot-cell';
import { observable } from 'mobx';
import { attribute, component, observer } from 'web-cell';

import { TimeRange } from '../../component/TimeRange';
import { t } from '../../i18n';
import { organization, Program, User } from '../../model';
import * as styles from './ShowRoom.module.less';

@component({ tagName: 'partner-detail' })
@observer
export class PartnerDetail extends HTMLElement {
    @attribute
    @observable
    accessor oid = 0;

    connectedCallback() {
        organization.getOne(this.oid);
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

    renderMentor = ({ avatar, username, summary }: User) => (
        <div className={`row px-2 ${styles.card}`}>
            <div className="col-2 my-4">
                {avatar && <Image thumbnail src={avatar.url} />}
            </div>
            <div className="col-10 my-4">
                <h5>{username}</h5>
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
                        <Ratio aspectRatio="4x3">
                            <video
                                className={styles['main-video']}
                                src={video.url}
                                controls
                                autoplay
                            />
                        </Ratio>
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
                            <p>{t('contact')}</p>
                        </div>
                        <div className="col-10 my-4">{summary}</div>
                    </header>
                    {programs.length > 0 ? (
                        <>
                            <h2 className="text-center">{t('highlights')}</h2>
                            <section className="my-5">
                                {programs.map(this.renderProgram)}
                            </section>
                        </>
                    ) : null}
                    {mentors.length > 0 ? (
                        <>
                            <h2 className="text-center">{t('guests')}</h2>
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
