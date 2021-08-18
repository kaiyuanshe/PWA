import { createCell, Fragment } from 'web-cell';
import { CellRouter } from 'cell-router/source';
import { observer } from 'mobx-web-cell';
import { service } from 'mobx-strapi';

import { NavBar } from 'boot-cell/source/Navigator/NavBar';
import { NavLink } from 'boot-cell/source/Navigator/Nav';
import { Button } from 'boot-cell/source/Form/Button';
import { DropMenu, DropMenuItem } from 'boot-cell/source/Navigator/DropMenu';

import { history, session } from '../model';
import { ProfilePage } from './Profile';
import { AgendaPage } from './Activity';
import { SpeechEditPage } from './Activity/SpeechEdit';
import { ExhibitionApply } from './Activity/ExhibitionApply';
import { ShowRoom } from './Activity/ShowRoom';
import { PartnerDetail } from './Activity/PartnerDetail';
import { AgendaDetail } from './Activity/AgendaDetail';
import UserInfo from './userInfo';

const menu = [
        {
            title: '开放源码',
            href: 'https://github.com/kaiyuanshe/PWA'
        }
    ],
    routes = [
        { paths: [''], component: AgendaPage },
        { paths: ['profile'], component: ProfilePage },
        {
            paths: ['activity/speech/edit'],
            component: SpeechEditPage
        },
        {
            paths: ['activity/exhibition/apply'],
            component: ExhibitionApply
        },
        { paths: ['activity/showroom'], component: ShowRoom },
        { paths: ['activity/partner'], component: PartnerDetail },
        { paths: ['activity/agenda'], component: AgendaDetail },
        { paths: ['userInfo'], component: UserInfo }
    ];

export const PageFrame = observer(() => (
    <div>
        <NavBar
            narrow
            expand="md"
            fixed="top"
            theme="dark"
            background="dark"
            brand={
                <>
                    <img
                        alt="WebCell scaffold"
                        src="https://kaiyuanshe.cn/image/KaiYuanShe-logo.png"
                        style={{ width: '2rem', marginRight: '0.5rem' }}
                    />
                    开源社
                </>
            }
        >
            {menu.map(({ title, ...props }) => (
                <NavLink {...props}>{title}</NavLink>
            ))}
            {!session.user ? (
                <Button
                    color="primary"
                    href={service.baseURI + 'connect/github/'}
                >
                    登录
                </Button>
            ) : (
                <DropMenu buttonColor="primary" caption={session.user.username}>
                    <DropMenuItem href="profile">基本信息</DropMenuItem>
                    <DropMenuItem href={`userInfo?uid=${session.user.id}`}>
                        个人主页
                    </DropMenuItem>
                    <DropMenuItem onClick={() => session.signOut()}>
                        退出
                    </DropMenuItem>
                </DropMenu>
            )}
        </NavBar>

        <CellRouter
            style={{ minHeight: '60vh' }}
            history={history}
            routes={routes}
        />
        <footer className="text-center bg-light py-5">
            Proudly developed with
            <a className="mx-1" target="_blank" href="https://web-cell.dev/">
                WebCell v2
            </a>
            &amp;
            <a
                className="mx-1"
                target="_blank"
                href="https://web-cell.dev/BootCell/"
            >
                BootCell v1
            </a>
        </footer>
    </div>
));
