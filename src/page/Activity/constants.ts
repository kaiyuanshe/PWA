import { PartnershipTypes } from '../../model';

export const ProgramMap = {
    lecture: '演讲',
    workshop: '动手训练营',
    exhibition: '展位'
};

export const PartnerMap = {
    [PartnershipTypes.community]: '社区伙伴',
    [PartnershipTypes.media]: '直播媒体伙伴',
    [PartnershipTypes.sponsor]: '赞助伙伴'
};
