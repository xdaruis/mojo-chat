import t from 'tap';

import { app } from '../../../index.js';

const ua = await app.newTestUserAgent({ tap: t });

await t.test('Should show status 204 and empty body', async () => {
  (await ua.getOk('/api/chat/healthcheck')).statusIs(204).bodyIs('');
});

await ua.stop();
