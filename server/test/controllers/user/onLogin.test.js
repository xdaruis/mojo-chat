import nock from 'nock';
import t from 'tap';

import app from '../../main.js';

const ua = await app.newTestUserAgent({ tap: t });

t.afterEach(async () => {
  await ua.post('/api/user/logout', { json: {} });
  t.equal(app.users.size, 0, 'should remove all users from active users');
});

await t.test('guest login is disabled', async (t) => {
  const response = await ua.post('/api/user/login', {
    json: { username: 'test123' },
  });

  t.equal(response.statusCode, 400, 'should return 400 status');
  const responseBody = await response.json();

  t.strictSame(responseBody, {
    error: 'Authentication credentials are required',
  });
});

await t.test('should not allow invalid auth credentials', async (t) => {
  await t.test('wrong provider', async (t) => {
    const response = await ua.post('/api/user/login', {
      json: { authCredentials: { provider: 'GOOGLEG', token: 'test' } },
    });

    t.equal(response.statusCode, 400, 'should return 400 status');
    const responseBody = await response.json();
    t.strictSame(responseBody, {
      error: "Invalid enum value. Expected 'GOOGLE', received 'GOOGLEG'",
    });
  });

  await t.test('missing provider', async (t) => {
    const response = await ua.post('/api/user/login', {
      json: { authCredentials: { token: 'test' } },
    });

    t.equal(response.statusCode, 400, 'should return 400 status');
    const responseBody = await response.json();
    t.strictSame(responseBody, {
      error: 'Authentication provider is required',
    });
  });

  await t.test('missing authCredentials', async (t) => {
    const response = await ua.post('/api/user/login', {
      json: {},
    });

    t.equal(response.statusCode, 400, 'should return 400 status');
    const responseBody = await response.json();
    t.strictSame(responseBody, {
      error: 'Authentication credentials are required',
    });
  });

  await t.test('extra fields', async (t) => {
    const response = await ua.post('/api/user/login', {
      json: {
        authCredentials: { provider: 'GOOGLE', token: 'test' },
        extra: 'extra',
      },
    });

    t.equal(response.statusCode, 400, 'should return 400 status');
    const responseBody = await response.json();
    t.strictSame(responseBody, {
      error: "Unrecognized key(s) in object: 'extra'",
    });
  });
});

await t.test('should return 404 if user does not exist', async (t) => {
  nock('https://oauth2.googleapis.com')
    .get('/tokeninfo')
    .query({ access_token: 'test' })
    .reply(200, { email: 'test@test.com', sub: '123' });

  const response = await ua.post('/api/user/login', {
    json: { authCredentials: { provider: 'GOOGLE', token: 'test' } },
  });

  t.equal(response.statusCode, 404);

  const responseBody = await response.json();
  t.strictSame(responseBody, {
    error: 'User not found',
  });
});

await t.test('should return 200 if user exists', async (t) => {
  nock('https://oauth2.googleapis.com')
    .get('/tokeninfo')
    .query({ access_token: 'test' })
    .reply(200, { email: 'test@test.com', sub: '123' });

  await app.prisma.users.create({
    data: {
      username: 'test-username',
      email: 'test@test.com',
      provider: 'GOOGLE',
      uuid: '123',
    },
  });

  const response = await ua.post('/api/user/login', {
    json: { authCredentials: { provider: 'GOOGLE', token: 'test' } },
  });

  t.equal(response.statusCode, 200);

  const responseBody = await response.json();
  t.strictSame(responseBody, {
    session: { username: 'test-username' },
  });
});

await ua.stop();
