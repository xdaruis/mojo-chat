import t from 'tap';

import { app } from '../../../index.js';

const ua = await app.newTestUserAgent({ tap: t });

await t.test('should start with empty session', async (t) => {
  const res = await ua.post('/api/user/session', { json: {} });
  t.equal(res.statusCode, 200, 'returns 200');
  t.strictSame(await res.json(), { session: {} });
});

await t.test('should create session on login', async (t) => {
  const login = await ua.post('/api/user/login', {
    json: { username: 'test123' },
  });
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
