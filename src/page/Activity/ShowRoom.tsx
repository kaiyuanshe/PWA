import { Button, ButtonGroup, Image, Ratio, SpinnerBox } from 'boot-cell';
import classNames from 'classnames';
import { observable } from 'mobx';
import { attribute, component, observer } from 'web-cell';

import { t } from '../../i18n';
import { activity, Partnership } from '../../model';
import { PartnerMap } from './constants';
import * as styles from './ShowRoom.module.less';

const buttons = () => [
    t('liveSchedule'),
    t('cloudShowroom'),
    t('conferenceLecturer'),
    t('officialCommunity')
];

@component({ tagName: 'main-playroom' })
@observer
export class ShowRoom extends HTMLElement {
    @attribute
    @observable
    accessor aid = 0;

    connectedCallback() {
        if (this.aid !== activity.currentOne.id) activity.getOne(this.aid);
    }

    renderPartner = ({
        organization: { id, slogan, video, summary, logo },
        type,
        level
    }: Partnership) => (
        <div className="col-12 col-sm-6 col-md-3 my-4">
            <a
                className={classNames(
                    styles.frame,
                    level > 1 && styles.VIP,
                    'text-decoration-none',
                    'text-white'
                )}
                href={'activity/partner?oid=' + id}
            >
                <div className={styles.tag}>{PartnerMap[type]}</div>
                {slogan && <h5 className="fs-6 fw-bold">{slogan}</h5>}
                {video && (
                    <Ratio aspectRatio="16x9">
                        <video hoverPlay src={video.url} />
                    </Ratio>
                )}
                <p style={{ fontSize: '13px' }}>{summary}</p>
                <Image className={styles.logoTag} thumbnail src={logo?.url} />
            </a>
        </div>
    );

    render() {
        const { downloading, currentOne } = activity;
        const { name, slogan, partnerships } = currentOne;

        return (
            <SpinnerBox className={styles.ground} cover={downloading > 0}>
                <div className="container overflow-auto text-white">
                    <h1 className="mt-5 text-center">{name}</h1>
                    <p className="h4 my-4 text-center">{slogan}</p>

                    <Ratio aspectRatio="16x9">
                        <iframe
                            className={styles['main-video']}
                            src="//player.bilibili.com/player.html?aid=676457093&bvid=BV1PU4y1g7Gd&cid=435097919&page=1"
                            allowFullscreen
                        />
                    </Ratio>
                    <div className={styles.buttonsTray}>
                        <ButtonGroup>
                            {buttons().map(text => (
                                <Button
                                    key={text}
                                    className={styles.buttons}
                                    variant="secondary"
                                >
                                    {text}
                                </Button>
                            ))}
                        </ButtonGroup>
                    </div>

                    <section className="row mt-5">
                        {partnerships?.map(this.renderPartner)}
                    </section>
                </div>
            </SpinnerBox>
        );
    }
}
