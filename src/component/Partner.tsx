import { component, mixin, createCell, watch, attribute } from 'web-cell';
import { observer } from 'mobx-web-cell';
import { Embed } from 'boot-cell/source/Media/Embed';
import { Image } from 'boot-cell/source/Media/Image';

import style from './Partner.module.less';
import { partnership } from '../model';

@observer
@component({
    tagName: 'partner-logo',
    renderTarget: 'children'
})
export class Partner extends mixin() {
    @attribute
    @watch
    id = '';

    connectedCallback() {
        partnership.getOne(this.id);

        super.connectedCallback();
    }

    render() {
        const { type, organization } = partnership.current;

        let framestyle, upperTagstyle, tag;
        if (type === 'community') {
            framestyle = style.communityframe;
            upperTagstyle = style.communityTag;
            tag = '首席独家赞助商';
        }
        if (type === 'sponsor') {
            framestyle = style.sponsorframe;
            upperTagstyle = style.sponsorTag;
            tag = '品牌赞助商';
        }
        return (
            <div className={framestyle}>
                <div className={upperTagstyle}>{tag}</div>
                <h5 style={{ fontSize: '16px' }}>{organization.slogan}</h5>
                <Embed is="iframe" src={organization.video.url} />
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
