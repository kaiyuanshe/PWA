import { auto } from 'browser-unhandled-rejection';
import { DOMRenderer } from 'dom-renderer';
import { HTTPError } from 'koajax';
import { documentReady, serviceWorkerUpdate } from 'web-utility';

import { session } from './model';
import { PageFrame } from './page';

auto();

self.addEventListener('unhandledrejection', event => {
    const { message, response } = event.reason as HTTPError;
    const { body } = response || {};

    if (!message) return;

    const text =
        body &&
        [
            body.message,
            body.data?.errors &&
                Object.entries(body.data.errors)
                    .map(([key, value]) => `${key}: ${value}`)
                    .flat()
                    .join('\n')
        ]
            .filter(Boolean)
            .join('\n\n');

    self.alert(text || message);
});

const { serviceWorker } = window.navigator;

if (process.env.NODE_ENV !== 'development')
    serviceWorker
        ?.register('sw.js')
        .then(serviceWorkerUpdate)
        .then(worker => {
            if (window.confirm('检测到新版本，是否立即启用？'))
                worker.postMessage({ type: 'SKIP_WAITING' });
        });

serviceWorker?.addEventListener('controllerchange', () =>
    window.location.reload()
);

documentReady.then(async () => {
    const token = new URLSearchParams(self.location.search).get('access_token');

    new DOMRenderer().render(<PageFrame />);

    if (!token) return session.getProfile();

    const { name, avatar } = await session.signIn(token);

    history.replaceState(null, document.title, '/');
    self.location.replace(!name || !avatar ? '#profile' : '');
});
