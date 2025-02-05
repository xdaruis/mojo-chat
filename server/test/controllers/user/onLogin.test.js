import t from 'tap';

import app from '../../main.js';

const ua = await app.newTestUserAgent({ tap: t });

t.afterEach(async () => {
  await ua.post('/api/user/logout', { json: {} });
  t.equal(app.users.size, 0, 'should remove all users from active users');
});

await t.test('successful login', async (t) => {
  const res = await ua.post('/api/user/login', {
    json: { username: 'test123' },
  });

  t.equal(res.statusCode, 200, 'should return 200 status');
  const resJson = await res.json();

  t.ok(resJson.session, 'should return session object');
  t.strictSame(
    resJson,
    {
      session: {
        username: 'test123',
      },
    },
    'should set username in session',
  );
  t.ok(app.users.has('test123'), 'should add user to active users');
});

await t.test('invalid requests', async (t) => {
  // Missing username
  const resNoUsername = await ua.post('/api/user/login', {
    json: {},
  });
  let resJson = await resNoUsername.json();
  t.equal(
    resNoUsername.statusCode,
    400,
    'should fail when username is missing',
  );
  t.strictSame(
    resJson,
    { error: 'Username is required' },
    'should return correct error message',
  );

  // Non-string username
  const resNonString = await ua.post('/api/user/login', {
    json: { username: 123 },
  });
  resJson = await resNonString.json();
  t.equal(
    resNonString.statusCode,
    400,
    'should fail when username is not a string',
  );
  t.strictSame(
    resJson,
    { error: 'Username must be a string' },
    'should return correct error message',
  );

  // Invalid username format
  const resInvalidFormat = await ua.post('/api/user/login', {
    json: { username: 'a b a b' }, // contains space
  });
  t.equal(
    resInvalidFormat.statusCode,
    400,
    'should fail with invalid username format',
  );
  resJson = await resInvalidFormat.json();
  t.strictSame(resJson, {
    error:
      'Username can only contain letters, numbers, underscores, ' +
      'and dashes',
  });

  // Username too short
  const resTooShort = await ua.post('/api/user/login', {
    json: { username: 'ab' },
  });
  t.equal(resTooShort.statusCode, 400);
  resJson = await resTooShort.json();
  t.strictSame(resJson, { error: 'Username must be at least 4 characters' });

  // username too long
  const resTooLong = await ua.post('/api/user/login', {
    json: { username: '1234567891011121' },
  });
  resJson = await resTooLong.json();
  t.equal(resTooLong.statusCode, 400, 'should fail when username is too long');
  t.strictSame(resJson, { error: 'Username must be at most 15 characters' });

  // username contains cyrilic characters
  const resCyrilic = await ua.post('/api/user/login', {
    json: { username: 'привет123' },
  });
  t.equal(resCyrilic.statusCode, 400);
  resJson = await resCyrilic.json();
  t.strictSame(resJson, {
    error:
      'Username can only contain letters, numbers, underscores, ' +
      'and dashes',
  });
});

await t.test('duplicate username', async (t) => {
  // First login should succeed
  await ua.post('/api/user/login', {
    json: { username: 'duplicate' },
  });

  // Second attempt with same username should fail
  const res = await ua.post('/api/user/login', {
    json: { username: 'duplicate' },
  });

  t.equal(res.statusCode, 400, 'should fail for duplicate username');
  const resJson = await res.json();
  t.strictSame(
    resJson,
    { error: 'User already connected' },
    'should return correct error message',
  );
});

await t.test('user already connected', async (t) => {
  const res1 = await ua.post('/api/user/login', {
    json: { username: 'connected' },
  });
  t.equal(res1.statusCode, 200, 'should succeed for first login');

  const res2 = await ua.post('/api/user/login', {
    json: { username: 'connected2' },
  });

  t.equal(res2.statusCode, 400, 'should fail for duplicate username');
  const resJson = await res2.json();
  t.strictSame(
    resJson,
    { error: 'User already connected' },
    'should return correct error message',
  );
});

await t.test('should not allow extra fields in request', async (t) => {
  const res = await ua.post('/api/user/login', {
    json: { username: 'test123', extra: 'extra' },
  });

  t.equal(res.statusCode, 400, 'should return 400 status');
  const resJson = await res.json();
  t.strictSame(resJson, {
    error: "Unrecognized key(s) in object: 'extra'",
  });
});

await ua.stop();
