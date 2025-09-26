import t from 'tap';

import app from '../../main.js';

const ua = await app.newTestUserAgent({ tap: t });

t.afterEach(async () => {
  await ua.post('/api/user/logout', { json: {} });
});

await ua.post('/api/user/login', {
  json: { username: 'logoutTest' },
});

const res = await ua.post('/api/user/logout', { json: {} });

t.equal(res.statusCode, 200, 'should return 200 status');
const resJson = await res.json();
t.strictSame(
  resJson,
  { message: 'Logout successful' },
  'should return success message',
);

await ua.stop();
