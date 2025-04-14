import nock from 'nock';
import t from 'tap';

import app from '../../main.js';

const ua = await app.newTestUserAgent({ tap: t });

await t.test('successful registration', async (t) => {
  nock('https://oauth2.googleapis.com')
    .get('/tokeninfo')
    .query({ access_token: 'valid_token' })
    .reply(200, {
      email: 'test@example.com',
      sub: '123456789',
    });

  const res = await ua.post('/api/user/register', {
    json: {
      username: 'testuser',
      authCredentials: {
        provider: 'GOOGLE',
        token: 'valid_token',
      },
    },
  });

  t.equal(res.statusCode, 200);
  const resJson = await res.json();
  t.strictSame(resJson, {
    session: {
      username: 'testuser',
    },
  });

  const user = await app.prisma.users.findUnique({
    where: { username: 'testuser' },
  });

  t.ok(user, 'should create user in database');
  t.strictSame(user, {
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    provider: 'GOOGLE',
    uuid: '123456789',
    createdAt: user.createdAt,
  });
});

await t.test('duplicate registration attempts', async (t) => {
  nock('https://oauth2.googleapis.com')
    .get('/tokeninfo')
    .query({ access_token: 'valid_token' })
    .times(2)
    .reply(200, {
      email: 'test@example.com',
      sub: '123456789',
    });

  // First registration
  await ua.post('/api/user/register', {
    json: {
      username: 'duplicate',
      authCredentials: {
        provider: 'GOOGLE',
        token: 'valid_token',
      },
    },
  });

  // Attempt duplicate username
  const resDuplicateUsername = await ua.post('/api/user/register', {
    json: {
      username: 'duplicate',
      authCredentials: {
        provider: 'GOOGLE',
        token: 'valid_token',
      },
    },
  });

  t.equal(
    resDuplicateUsername.statusCode,
    400,
    'should reject duplicate username',
  );
  t.strictSame(
    await resDuplicateUsername.json(),
    { error: 'Username or account already registered' },
    'should return correct error message',
  );
});

await t.test('duplicate Google account', async (t) => {
  nock('https://oauth2.googleapis.com')
    .get('/tokeninfo')
    .query({ access_token: 'valid_token' })
    .times(2)
    .reply(200, {
      email: 'test@example.com',
      sub: '123456789',
    });

  // First registration
  await ua.post('/api/user/register', {
    json: {
      username: 'user1',
      authCredentials: {
        provider: 'GOOGLE',
        token: 'valid_token',
      },
    },
  });

  // Attempt registration with same Google account (same email and uuid)
  const resDuplicateAccount = await ua.post('/api/user/register', {
    json: {
      username: 'user2',
      authCredentials: {
        provider: 'GOOGLE',
        token: 'valid_token',
      },
    },
  });

  t.equal(
    resDuplicateAccount.statusCode,
    400,
    'should reject duplicate Google account',
  );
  t.strictSame(
    await resDuplicateAccount.json(),
    { error: 'Username or account already registered' },
    'should return correct error message',
  );
});

await t.test('invalid token', async (t) => {
  nock('https://oauth2.googleapis.com')
    .get('/tokeninfo')
    .query({ access_token: 'invalid_token' })
    .reply(401, {
      error: 'invalid_token',
    });

  const res = await ua.post('/api/user/register', {
    json: {
      username: 'testuser',
      authCredentials: {
        provider: 'GOOGLE',
        token: 'invalid_token',
      },
    },
  });

  t.equal(res.statusCode, 401);
  t.strictSame(
    await res.json(),
    { error: 'Invalid credentials' },
    'should return correct error message',
  );
});

await t.test('invalid requests', async (t) => {
  // Missing username
  const resNoUsername = await ua.post('/api/user/register', {
    json: {
      authCredentials: {
        provider: 'GOOGLE',
        token: 'mock_token',
      },
    },
  });
  t.equal(
    resNoUsername.statusCode,
    400,
    'should fail when username is missing',
  );
  t.strictSame(await resNoUsername.json(), { error: 'Username is required' });

  // Missing auth credentials
  const resNoAuth = await ua.post('/api/user/register', {
    json: {
      username: 'testuser',
    },
  });
  t.equal(
    resNoAuth.statusCode,
    400,
    'should fail when auth credentials are missing',
  );
  t.strictSame(await resNoAuth.json(), {
    error: 'Authentication credentials are required',
  });

  // Missing provider
  const resMissingProvider = await ua.post('/api/user/register', {
    json: {
      username: 'testuser',
      authCredentials: {
        token: 'mock_token',
      },
    },
  });
  t.equal(
    resMissingProvider.statusCode,
    400,
    'should fail when auth credentials are missing',
  );
  t.strictSame(await resMissingProvider.json(), {
    error: 'Authentication provider is required',
  });

  // Missing token
  const resMissingToken = await ua.post('/api/user/register', {
    json: {
      username: 'testuser',
      authCredentials: {
        provider: 'GOOGLE',
      },
    },
  });
  t.equal(
    resMissingToken.statusCode,
    400,
    'should fail when auth credentials are missing',
  );
  t.strictSame(await resMissingToken.json(), {
    error: 'Authentication token is required',
  });

  // Invalid provider
  const resInvalidProvider = await ua.post('/api/user/register', {
    json: {
      username: 'testuser',
      authCredentials: {
        provider: 'INVALID',
        token: 'mock_token',
      },
    },
  });
  t.equal(
    resInvalidProvider.statusCode,
    400,
    'should fail with invalid provider',
  );
});

await ua.stop();
