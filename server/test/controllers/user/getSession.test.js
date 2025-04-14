import nock from 'nock';
import t from 'tap';

import app from '../../main.js';

await app.prisma.users.create({
  data: {
    username: 'test123',
    email: 'test@test.com',
    provider: 'GOOGLE',
    uuid: '123',
  },
});

const ua = await app.newTestUserAgent({ tap: t });

await t.test('should start with empty session', async (t) => {
  const res = await ua.post('/api/user/session', { json: {} });
  t.equal(res.statusCode, 200, 'returns 200');
  t.strictSame(await res.json(), { session: {} });
});

await t.test('should create session on login', async (t) => {
  nock('https://oauth2.googleapis.com')
    .get('/tokeninfo')
    .query({ access_token: 'test' })
    .reply(200, { email: 'test@test.com', sub: '123' });

  const login = await ua.post('/api/user/login', {
    json: { authCredentials: { provider: 'GOOGLE', token: 'test' } },
  });

  t.equal(login.statusCode, 200, 'returns 200');
  t.strictSame(await login.json(), { session: { username: 'test123' } });
});

await t.test('should maintain session after login', async (t) => {
  const session = await ua.post('/api/user/session', { json: {} });
  t.strictSame(await session.json(), { session: { username: 'test123' } });
});

await t.test('should clear session on logout', async (t) => {
  const logout = await ua.post('/api/user/logout', { json: {} });
  t.strictSame(await logout.json(), { message: 'Logout successful' });

  const after = await ua.post('/api/user/session', { json: {} });
  t.strictSame(await after.json(), { session: {} });
});

await ua.stop();
