import { component, mixin, watch, attribute, createCell } from 'web-cell';
import { observer } from 'mobx-web-cell';
import classNames from 'classnames';
import { SpinnerBox } from 'boot-cell/source/Prompt/Spinner';
import { ButtonGroup } from 'boot-cell/source/Form/ButtonGroup';
import { Button } from 'boot-cell/source/Form/Button';
import { Embed } from 'boot-cell/source/Media/Embed';
import { Image } from 'boot-cell/source/Media/Image';

import style from './ShowRoom.module.less';
import { PartnerMap } from './constants';
import { Partnership, activity } from '../../model';

const buttons = ['直播日程表', '云端展厅', '大会讲师', '官方社群'];

@observer
@component({
    tagName: 'main-playroom',
    renderTarget: 'children'
})
export class ShowRoom extends mixin() {
    @attribute
    @watch
    aid = 0;

    connectedCallback() {
        if (this.aid !== activity.current.id) activity.getOne(this.aid);

        super.connectedCallback();
    }

    renderPartner({
        organization: { id, slogan, video, summary, logo },
        type,
        level
    }: Partnership) {
        return (
            <div className="col-12 col-sm-6 col-md-3 my-4">
                <a
                    className={classNames(
                        style.frame,
                        level > 1 && style.VIP,
                        'text-decoration-none',
                        'text-white'
                    )}
                    href={'activity/partner?oid=' + id}
                >
                    <div className={style.tag}>{PartnerMap[type]}</div>
                    {slogan && (
                        <h5 style={{ fontSize: '16px', fontWeight: 'bold' }}>
                            {slogan}
                        </h5>
                    )}
                    {video && <Embed is="video" hoverPlay src={video.url} />}
                    <p style={{ fontSize: '13px' }}>{summary}</p>
                    <Image className={style.logoTag} thumbnail src={logo.url} />
                </a>
            </div>
        );
    }

    render() {
        const {
            loading,
            current: { name, slogan, partner_ships }
        } = activity;

        return (
            <SpinnerBox className={style.ground} cover={loading}>
                <div className="container overflow-auto text-white">
                    <h1 className="mt-5 text-center">{name}</h1>
                    <p className="h4 my-4 text-center">{slogan}</p>
                    <Embed
                        is="iframe"
                        className={style['main-video']}
                        src="//player.bilibili.com/player.html?aid=838735500&amp;bvid=BV1Sg4y1v7EX&amp;cid=207306433&amp;page=1"
                        framespacing="0"
                        allowfullscreen="true"
                    />
                    <div className={style.buttonsTray}>
                        <ButtonGroup>
                            {buttons.map(text => (
                                <Button
                                    className={style.buttons}
                                    color="secondary"
                                >
                                    {text}
                                </Button>
                            ))}
                        </ButtonGroup>
                    </div>

                    <section className="row mt-5">
                        {partner_ships?.map(this.renderPartner)}
                    </section>
                </div>
            </SpinnerBox>
        );
    }
}
