import {
    Button,
    DropdownButton,
    DropdownItem,
    Navbar,
    NavLink
} from 'boot-cell';
import { CellRouter } from 'cell-router';
import { observer } from 'web-cell';

import { t } from '../i18n';
import { session } from '../model';
import { AgendaPage } from './Activity';
import { AgendaDetail } from './Activity/AgendaDetail';
import { ExhibitionApply } from './Activity/ExhibitionApply';
import { PartnerDetail } from './Activity/PartnerDetail';
import { ShowRoom } from './Activity/ShowRoom';
import { SpeechEditPage } from './Activity/SpeechEdit';
import { ProfilePage } from './Profile';
import UserInfo from './userInfo';

const menu = () => [
        {
            title: t('openSource'),
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
                        alt={t('kaiyuanshe')}
                        src="https://kaiyuanshe.cn/image/KaiYuanShe-logo.png"
                        style={{ width: '2rem', marginRight: '0.5rem' }}
                    />
                    {t('kaiyuanshe')}
                </>
            }
        >
            {menu().map(({ title, ...props }) => (
                <NavLink {...props}>{title}</NavLink>
            ))}
            {!session.user ? (
                <Button color="primary" href={session.oAuthLinkOf('github')}>
                    {t('signIn')}
                </Button>
            ) : (
                <DropdownButton
                    variant="primary"
                    caption={session.user.username}
                >
                    <DropdownItem href="profile">
                        {t('editProfile')}
                    </DropdownItem>
                    <DropdownItem href={`userInfo?uid=${session.user.id}`}>
                        {t('userInfo')}
                    </DropdownItem>
                    <DropdownItem onClick={() => session.signOut()}>
                        {t('signOut')}
                    </DropdownItem>
                </DropdownButton>
            )}
        </Navbar>

        <CellRouter style={{ minHeight: '60vh' }} routes={routes} />

        <footer className="text-center bg-light py-5">
            {t('proudlyDevelopedWith')}
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
