import { component, mixin, createCell, watch, attribute } from 'web-cell';
import { Embed } from 'boot-cell/source/Media/Embed';
import { Image } from 'boot-cell/source/Media/Image';

import style from './Partner.module.less';
import { service, Editor, MediaData } from '../model/service';

export interface Organization {
    id: string;
    name: string;
    slogan: string;
    logo: string; // logo?: MediaData;
    link: string;
    summary: string;
    video: string; // video?: MediaData;
    message_link: string;
    created_by?: Editor;
    updated_by?: Editor;
}

export enum PartnerShipTypes {
    sponsor = 'sponsor',
    place = 'place',
    media = 'media',
    community = 'community',
    device = 'device',
    travel = 'travel',
    vendor = 'vendor'
}

export interface PartnerShip {
    id: string;
    title: string;
    // activity?:	Activity;
    level: number;
    organization: Organization;
    type: string;
    accounts: [];
    verified: boolean;
    default: false;
    created_by?: Editor;
    updated_by?: Editor;
}

@component({
    tagName: 'partner-logo',
    renderTarget: 'children'
})
export class Partner extends mixin() {
    @attribute
    @watch
    id = '';
    partnerData: PartnerShip;

    connectedCallback() {
        // this.getOrganizationById(this.id);
        let org = {
            id: '1',
            name: 'freeCodeCamp 成都社区',
            slogan: '家门口的 IT 社区',
            logo:
                'https://ows.blob.core.chinacloudapi.cn/files/assets/FCC_CDC_v1_0_efd3f88541.png',
            link: 'https://fcc-cd.dev/',
            summary:
                'freeCodeCamp 成都社区成立于 2016 年，是中国大陆最早一批 FCC 城市线下社区，目前会员千余人，也是最大的 FCC 城市社区。在核心团队 20 余人两年的努力下，FCC 成都已覆盖 编程教育、技术招聘、行业大会等程序员全职业生涯的公益服务。',
            video:
                '//player.bilibili.com/player.html?aid=754280090&bvid=BV1Dk4y117oW&cid=226560058&page=1',
            message_link: 'https://jq.qq.com/?_wv=1027&k=54DSeNz'
        };
        this.partnerData = {
            id: '1',
            title: '成都分会场',
            level: 1,
            organization: org,
            type: PartnerShipTypes.community,
            accounts: [],
            verified: true,
            default: false
        };
        super.connectedCallback();
    }

    async getOrganizationById(id: string) {
        const { body } = await service.get<PartnerShip>('partner-ships/', {
            id: id
        });
        return (this.partnerData = body);
    }

    render() {
        let framestyle, upperTagstyle, tag;
        if (this.partnerData.type === 'community') {
            framestyle = style.communityframe;
            upperTagstyle = style.communityTag;
            tag = '首席独家赞助商';
        }
        if (this.partnerData.type === 'sponsor') {
            framestyle = style.sponsorframe;
            upperTagstyle = style.sponsorTag;
            tag = '品牌赞助商';
        }
        return (
            <div className={framestyle}>
                <div className={upperTagstyle}>{tag}</div>
                <h5 style={{ fontSize: '16px' }}>
                    {this.partnerData.organization.slogan}
                </h5>
                <Embed is="iframe" src={this.partnerData.organization.video} />
                <p style={{ fontSize: '13px' }}>
                    {this.partnerData.organization.summary}
                </p>
                <Image
                    className={style.logoTag}
                    thumbnail
                    src={this.partnerData.organization.logo}
                />
            </div>
        );
    }
}
