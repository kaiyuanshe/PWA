import { createCell, Fragment } from 'web-cell';
import { CellRouter } from 'cell-router/source';
import { NavBar } from 'boot-cell/source/Navigator/NavBar';
import { NavLink } from 'boot-cell/source/Navigator/Nav';

import { history } from '../model';
import { MainShowRoom } from './MainShowRoom';
import { PartnerDetail } from './PartnerDetail';

const menu = [
    {
        title: '中国开源年会',
        href: 'showroom?id=1'
    },
    {
        title: '开放源码',
        href: 'https://github.com/kaiyuanshe/PWA'
    }
];

export function PageFrame() {
    return (
        <>
            <NavBar
                narrow
                brand={
                    <img
                        alt="WebCell scaffold"
                        src="https://kaiyuanshe.cn/image/KaiYuanShe-logo.png"
                        style={{ width: '2rem' }}
                    />
                }
            >
                {menu.map(({ title, ...props }) => (
                    <NavLink {...props}>{title}</NavLink>
                ))}
            </NavBar>

            <CellRouter
                style={{ minHeight: '60vh' }}
                history={history}
                routes={[
                    { paths: ['showroom'], component: MainShowRoom },
                    { paths: ['org?id=2'], component: PartnerDetail }
                ]}
            />
            <footer className="text-center bg-light py-5">
                Proudly developed with
                <a
                    className="mx-1"
                    target="_blank"
                    href="https://web-cell.dev/"
                >
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
        </>
    );
}
