import { bootI18n } from 'web-utility';

import { zh_CN } from './zh-CN';
import { zh_TW } from './zh-TW';
import { en_US } from './en-US';
import { ja_JP } from './ja-JP';
import { ko_KR } from './ko-KR';

export const { words } = bootI18n({
    'zh-CN': zh_CN,
    'zh-SG': zh_CN,
    'zh-TW': zh_TW,
    'zh-HK': zh_TW,
    'zh-MO': zh_TW,
    'en-US': en_US,
    'ja-JP': ja_JP,
    'ko-KR': ko_KR
});

self.addEventListener('languagechange', () => self.location.reload());
