// TODO: Fix JSDoc types in testing files
import nock from 'nock';
import assert from 'node:assert';

let id = 0;

/**
 * Asserts that no WebSocket message is received for a given duration.
 * This is a non-consuming check.
 * @param {import('tap').Test} t The tap test instance.
 * @param {import('@mojojs/core/lib/user-agent/test').TestUserAgent} ws The WebSocket test user agent.
 * @param {number} [duration=500] The duration to wait in milliseconds.
 * @param {string} [message='Should not receive a message'] The assertion message.
 */
export function assertNoWsMessage(
  t,
  ua,
  duration = 500,
  message = 'Should not receive a message',
) {
  return new Promise((resolve) => {
    const onMessage = (msg) => {
      clearTimeout(timeoutId);
      t.fail(message, { received: JSON.parse(msg.toString()) });
      resolve();
    };

    ua.ws.on('message', onMessage);

    const timeoutId = setTimeout(() => {
      ua.ws.off('message', onMessage);
      t.pass(message);
      resolve();
    }, duration);
  });
}

/**
 * Logs in a user and returns the user object.
 * @param {import('@mojojs/core/lib/app').App} app The Mojo app instance.
 * @param {import('@mojojs/core/lib/user-agent/test').TestUserAgent} ua The test user agent.
 * @param {string} username The username to login.
 */
export async function loginUser(app, ua, username) {
  // Find or create the user
  let user = await app.prisma.users.findFirst({
    where: { username: { equals: username, mode: 'insensitive' } },
  });

  if (!user) {
    user = await app.prisma.users.create({
      data: {
        username: username,
        email: `test${++id}@test.com`,
        provider: 'GOOGLE',
        uuid: `${id}`,
      },
    });
  }

  nock('https://oauth2.googleapis.com')
    .get('/tokeninfo')
    .query({ access_token: 'valid_token' })
    .times(1)
    .reply(200, {
      email: user.email,
      sub: user.uuid,
    });

  // Login the user
  const res = await ua.post('/api/user/login', {
    json: { authCredentials: { provider: 'GOOGLE', token: 'valid_token' } },
  });

  assert.strictEqual(res.statusCode, 200);
}
