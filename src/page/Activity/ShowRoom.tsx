import { Button, ButtonGroup, Embed, Image, SpinnerBox } from 'boot-cell';
import classNames from 'classnames';
import { observable } from 'mobx';
import { attribute, component, observer } from 'web-cell';

import { activity, Partnership } from '../../model';
import { PartnerMap } from './constants';
import * as styles from './ShowRoom.module.less';

// const buttons = ['直播日程表', '云端展厅', '大会讲师', '官方社群'];

@component({ tagName: 'main-playroom' })
@observer
export class ShowRoom extends HTMLElement {
    @attribute
    @observable
    accessor aid = '';

    connectedCallback() {
        if (this.aid !== activity.currentOne.id) activity.getOne(+this.aid);
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
                {video && <Embed is="video" hoverPlay src={video.url} />}
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
                    <Embed
                        is="iframe"
                        className={styles['main-video']}
                        src="//player.bilibili.com/player.html?aid=676457093&bvid=BV1PU4y1g7Gd&cid=435097919&page=1"
                        allowFullscreen
                    />
                    <div className={styles.buttonsTray}>
                        {/*                         <ButtonGroup>

                            {buttons.map(text => (
                                <Button
                                    className={styles.buttons}
                                    color="secondary"
                                >
                                    {text}
                                </Button>
                            ))}
                        </ButtonGroup> */}
                    </div>

                    <section className="row mt-5">
                        {partnerships?.map(this.renderPartner)}
                    </section>
                </div>
            </SpinnerBox>
        );
    }
}
