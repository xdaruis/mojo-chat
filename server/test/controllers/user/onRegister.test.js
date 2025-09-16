import nock from 'nock';
import t from 'tap';

import app from '../../main.js';

const ua = await app.newTestUserAgent({ tap: t });
let idCounter = 0;

await t.test('successful registration', async (t) => {
  nock('https://oauth2.googleapis.com')
    .get('/tokeninfo')
    .query({ access_token: 'valid_token' })
    .reply(200, {
      email: `test${++idCounter}@example.com`,
      sub: `${idCounter}`,
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
    email: 'test1@example.com',
    provider: 'GOOGLE',
    uuid: '1',
    createdAt: user.createdAt,
  });
});

await t.test('duplicate registration attempts should fail', async (t) => {
  nock('https://oauth2.googleapis.com')
    .get('/tokeninfo')
    .query({ access_token: 'valid_token' })
    .times(2)
    .reply(200, {
      email: `test${++idCounter}@example.com`,
      sub: `${idCounter}`,
    });

  // First registration
  await ua.post('/api/user/register', {
    json: {
      username: 'org_username',
      authCredentials: {
        provider: 'GOOGLE',
        token: 'valid_token',
      },
    },
  });

  // Attempt duplicate google account
  const resDuplicateGoogleAccount = await ua.post('/api/user/register', {
    json: {
      username: 'diff_username',
      authCredentials: {
        provider: 'GOOGLE',
        token: 'valid_token',
      },
    },
  });

  t.equal(
    resDuplicateGoogleAccount.statusCode,
    400,
  );
  t.strictSame(
    await resDuplicateGoogleAccount.json(),
    { error: 'Username or account already registered' },
  );

  // Set another gmail response to test duplicate username
  nock('https://oauth2.googleapis.com')
    .get('/tokeninfo')
    .query({ access_token: 'another_valid_token' })
    .times(1)
    .reply(200, {
      email: `test${++idCounter}@example.com`,
      sub: `${idCounter}`,
    });

  // Attempt duplicate username (case insensitive)
  const resDuplicateUsername = await ua.post('/api/user/register', {
    json: {
      username: 'OrG_UsErNaMe',
      authCredentials: {
        provider: 'GOOGLE',
        token: 'another_valid_token',
      },
    },
  });

  t.equal(
    resDuplicateUsername.statusCode,
    400,
  );
  t.strictSame(
    await resDuplicateUsername.json(),
    { error: 'Username or account already registered' },
  );
});

await t.test('invalid token should fail', async (t) => {
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
  );
});

await t.test('invalid requests should fail', async (t) => {
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
  );
});

await ua.stop();
