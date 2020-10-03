import { component, mixin, createCell, watch, attribute } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { Embed } from 'boot-cell/source/Media/Embed';
import { Image } from 'boot-cell/source/Media/Image';

import style from './Partner.module.less';
import { Partnership } from '../model';

@observer
@component({
    tagName: 'partner-logo',
    renderTarget: 'children'
})
export class Partner extends mixin() {
    @attribute
    @watch
    partnership: Partnership;

    render() {
        const organization = this.partnership.organization,
            type = this.partnership.type,
            level = this.partnership.level;

        let framestyle, upperTagstyle, tag;
        switch (type) {
            case 'community':
                tag = '社区合作伙伴';
                break;
            case 'media':
                tag = '直播媒体合作伙伴';
                break;
            default:
                break;
        }
        switch (level) {
            case 1:
                framestyle = style.frame_1;
                upperTagstyle = style.tag_1;
                break;
            case 2:
                framestyle = style.frame_2;
                upperTagstyle = style.tag_2;
                break;
            default:
                break;
        }

        return (
            <div className={framestyle}>
                <div className={upperTagstyle}>{tag}</div>
                {organization.slogan ? (
                    <h5 style={{ fontSize: '16px', fontWeight: 'bold' }}>
                        {organization.slogan}
                    </h5>
                ) : (
                    <div />
                )}
                {organization.video ? (
                    <Embed is="iframe" src={organization.video.url} />
                ) : (
                    <div />
                )}
                <p style={{ fontSize: '13px' }}>{organization.summary}</p>
                <Image
                    className={style.logoTag}
                    thumbnail
                    src={organization.logo.url}
                />
            </div>
        );
    }
}
