import { createCell, Fragment } from 'web-cell';
import { CellRouter } from 'cell-router/source';
import { observer } from 'mobx-web-cell';

import { NavBar } from 'boot-cell/source/Navigator/NavBar';
import { NavLink } from 'boot-cell/source/Navigator/Nav';
import { Button } from 'boot-cell/source/Form/Button';
import { DropMenu, DropMenuItem } from 'boot-cell/source/Navigator/DropMenu';

import { history, service, session } from '../model';
import { ProfilePage } from './Profile';
import { AgendaPage } from './Activity';
import { ExhibitionApply } from './Activity/ExhibitionApply';
import { ShowRoom } from './Activity/ShowRoom';
import { PartnerDetail } from './Activity/PartnerDetail';
import { AgendaDetail } from './Activity/AgendaDetail';

const menu = [
    {
        title: '开放源码',
        href: 'https://github.com/kaiyuanshe/PWA'
    }
];

export const PageFrame = observer(() => (
    <div>
        <NavBar
            narrow
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
                <Button href={service.baseURI + 'connect/github/'}>登录</Button>
            ) : (
                <DropMenu caption={session.user.username}>
                    <DropMenuItem href="profile">基本信息</DropMenuItem>
                    <DropMenuItem onClick={() => session.signOut()}>
                        退出
                    </DropMenuItem>
                </DropMenu>
            )}
        </NavBar>

        <CellRouter
            style={{ minHeight: '60vh' }}
            history={history}
            routes={[
                { paths: [''], component: AgendaPage },
                { paths: ['profile'], component: ProfilePage },
                {
                    paths: ['activity/exhibition/apply'],
                    component: ExhibitionApply
                },
                { paths: ['activity/showroom'], component: ShowRoom },
                { paths: ['activity/partner'], component: PartnerDetail },
                { paths: ['activity/agenda'], component: AgendaDetail }
            ]}
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
