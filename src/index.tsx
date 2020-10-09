import 'regenerator-runtime/runtime';
import { auto } from 'browser-unhandled-rejection';
import { serviceWorkerUpdate } from 'web-utility';
import { documentReady, render, createCell } from 'web-cell';

import { PageFrame } from './page';
import { APIError, session } from './model';

auto();

self.addEventListener('unhandledrejection', event => {
    const { message, body } = event.reason as APIError;

    if (!message) return;

    event.preventDefault();

    const text =
        body &&
        `${body.message}

${Object.values(body.data.errors).flat().join('\n')}`;

    self.alert(text || message);
});

const { serviceWorker } = window.navigator;

serviceWorker
    ?.register('sw.js')
    .then(serviceWorkerUpdate)
    .then(worker => {
        if (window.confirm('New version of this Web App detected, update now?'))
            worker.postMessage({ type: 'SKIP_WAITING' });
    });

serviceWorker?.addEventListener('controllerchange', () =>
    window.location.reload()
);

documentReady.then(async () => {
    const token = new URLSearchParams(self.location.search).get('access_token');

    render(<PageFrame />);

    if (!token) return session.getProfile();

    await session.signIn(token);

    history.replaceState(null, document.title, '/');
    self.location.replace('');
});
