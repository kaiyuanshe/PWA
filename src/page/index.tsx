import { createCell, Fragment } from 'web-cell';
import { CellRouter } from 'cell-router/source';
import { NavBar } from 'boot-cell/source/Navigator/NavBar';
import { NavLink } from 'boot-cell/source/Navigator/Nav';
import { Button } from 'boot-cell/source/Form/Button';

import { history, service } from '../model';
import { MainShowRoom } from './MainShowRoom';

const menu = [
    {
        title: '中国开源年会',
        href: 'showroom?aid=1'
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
                <Button href={service.baseURI + 'connect/github/'}>登录</Button>
            </NavBar>

            <CellRouter
                style={{ minHeight: '60vh' }}
                history={history}
                routes={[{ paths: ['showroom'], component: MainShowRoom }]}
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
