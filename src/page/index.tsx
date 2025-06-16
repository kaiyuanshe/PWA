import { Button, DropMenu, DropMenuItem, Navbar, NavLink } from 'boot-cell';
import { CellRouter } from 'cell-router';
import { observer } from 'web-cell';

import { service, session } from '../model';
import { AgendaPage } from './Activity';
import { AgendaDetail } from './Activity/AgendaDetail';
import { ExhibitionApply } from './Activity/ExhibitionApply';
import { PartnerDetail } from './Activity/PartnerDetail';
import { ShowRoom } from './Activity/ShowRoom';
import { SpeechEditPage } from './Activity/SpeechEdit';
import { ProfilePage } from './Profile';
import UserInfo from './userInfo';

const menu = [
        {
            title: '开放源码',
            href: 'https://github.com/kaiyuanshe/PWA'
        }
    ],
    routes = [
        { path: '', component: AgendaPage },
        { path: 'profile', component: ProfilePage },
        {
            path: 'activity/speech/edit',
            component: SpeechEditPage
        },
        {
            path: 'activity/exhibition/apply',
            component: ExhibitionApply
        },
        { path: 'activity/showroom', component: ShowRoom },
        { path: 'activity/partner', component: PartnerDetail },
        { path: 'activity/agenda', component: AgendaDetail },
        { path: 'userInfo', component: UserInfo }
    ];

export const PageFrame = observer(() => (
    <div>
        <Navbar
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
        </Navbar>

        <CellRouter style={{ minHeight: '60vh' }} routes={routes} />

        <footer className="text-center bg-light py-5">
            Proudly developed with
            <a
                className="mx-1"
                target="_blank"
                href="https://web-cell.dev/"
                rel="noreferrer"
            >
                WebCell v3
            </a>
            &amp;
            <a
                className="mx-1"
                target="_blank"
                href="https://web-cell.dev/BootCell/"
                rel="noreferrer"
            >
                BootCell v2
            </a>
        </footer>
    </div>
));
