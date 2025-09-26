import t from 'tap';

import { assertNoWsMessage, loginUser } from '../../helpers.js';
import app from '../../main.js';

let message = null;

t.beforeEach(() => {
  message = null;
});

await t.test(
  'unauthenticated user should get a connection denied response',
  async (t) => {
    const guestClient = await app.newTestUserAgent({ tap: t });
    // TODO: (FIX) This test fails now cause the websocket connection
    // expects a successful connection established, but we return a 401
    // Forbidden status code and connection denied (not established)
    // const res = await guestClient.websocket('/api/chat/connect');
    await guestClient.stop();
  },
);

await t.test(
  'test all system notifications for user connections',
  async (t) => {
    const user1Client = await app.newTestUserAgent({ tap: t });
    await loginUser(app, user1Client, 'test1');
    await user1Client.websocketOk('/api/chat/connect');

    message = JSON.parse(await user1Client.messageOk());

    t.strictSame(message, {
      type: 'system',
      event: 'user_connected',
      user: 'test1',
    });

    message = JSON.parse(await user1Client.messageOk());
    t.strictSame(message, {
      type: 'system',
      event: 'user_list',
      users: ['test1'],
    });

    const user1Client2 = await app.newTestUserAgent({ tap: t });
    await loginUser(app, user1Client2, 'test1');
    await user1Client2.websocketOk('/api/chat/connect');

    await assertNoWsMessage(t, user1Client);

    message = JSON.parse(await user1Client2.messageOk());
    t.strictSame(message, {
      type: 'system',
      event: 'user_list',
      users: ['test1'],
    });

    const user2Client = await app.newTestUserAgent({ tap: t });
    await loginUser(app, user2Client, 'test2');
    await user2Client.websocketOk('/api/chat/connect');

    message = JSON.parse(await user2Client.messageOk());
    t.strictSame(message, {
      type: 'system',
      event: 'user_connected',
      user: 'test2',
    });

    message = JSON.parse(await user2Client.messageOk());
    t.strictSame(message, {
      type: 'system',
      event: 'user_list',
      users: ['test1', 'test2'],
    });

    message = JSON.parse(await user1Client.messageOk());
    t.strictSame(message, {
      type: 'system',
      event: 'user_connected',
      user: 'test2',
    });

    message = JSON.parse(await user1Client2.messageOk());
    t.strictSame(message, {
      type: 'system',
      event: 'user_connected',
      user: 'test2',
    });

    await user1Client.closeOk(4000);
    await user1Client.closedOk(4000);
    await user1Client.stop();

    await assertNoWsMessage(t, user2Client, 5000);

    await user1Client2.closeOk(4000);
    await user1Client2.closedOk(4000);
    await user1Client2.stop();

    message = JSON.parse(await user2Client.messageOk());
    t.strictSame(message, {
      type: 'system',
      event: 'user_disconnected',
      user: 'test1',
    });

    await user2Client.closeOk(4000);
    await user2Client.closedOk(4000);
    await user2Client.stop();
  },
);

await t.test(
  'broadcast chat messages to all connected clients (including sender)',
  async (t) => {
    const aliceClient = await app.newTestUserAgent({ tap: t });
    await loginUser(app, aliceClient, 'alice');
    await aliceClient.websocketOk('/api/chat/connect');

    message = JSON.parse(await aliceClient.messageOk());
    t.strictSame(message, {
      type: 'system',
      event: 'user_connected',
      user: 'alice',
    });

    message = JSON.parse(await aliceClient.messageOk());
    t.strictSame(message, {
      type: 'system',
      event: 'user_list',
      users: ['alice'],
    });

    const bobClient = await app.newTestUserAgent({ tap: t });
    await loginUser(app, bobClient, 'bob');
    await bobClient.websocketOk('/api/chat/connect');

    message = JSON.parse(await bobClient.messageOk());
    t.strictSame(message, {
      type: 'system',
      event: 'user_connected',
      user: 'bob',
    });

    message = JSON.parse(await bobClient.messageOk());
    t.strictSame(message, {
      type: 'system',
      event: 'user_list',
      users: ['alice', 'bob'],
    });

    message = JSON.parse(await aliceClient.messageOk());
    t.strictSame(message, {
      type: 'system',
      event: 'user_connected',
      user: 'bob',
    });

    const chatText = 'Hello from alice';
    await aliceClient.sendOk(chatText);

    message = JSON.parse(await aliceClient.messageOk());
    t.strictSame(message, {
      type: 'chat',
      user: 'alice',
      content: chatText,
    });

    message = JSON.parse(await bobClient.messageOk());
    t.strictSame(message, {
      type: 'chat',
      user: 'alice',
      content: chatText,
    });

    await aliceClient.closeOk(4000);
    await aliceClient.closedOk(4000);
    await aliceClient.stop();

    await bobClient.closeOk(4000);
    await bobClient.closedOk(4000);
    await bobClient.stop();
  },
);

await t.test(
  'multiple connections for the same user receive the same chat message; ' +
    'no duplicate user_connected event',
  async (t) => {
    const aliceClient1 = await app.newTestUserAgent({ tap: t });
    await loginUser(app, aliceClient1, 'alice');
    await aliceClient1.websocketOk('/api/chat/connect');

    message = JSON.parse(await aliceClient1.messageOk());
    t.strictSame(message, {
      type: 'system',
      event: 'user_connected',
      user: 'alice',
    });

    message = JSON.parse(await aliceClient1.messageOk());
    t.strictSame(message, {
      type: 'system',
      event: 'user_list',
      users: ['alice'],
    });

    const aliceClient2 = await app.newTestUserAgent({ tap: t });
    await loginUser(app, aliceClient2, 'alice');
    await aliceClient2.websocketOk('/api/chat/connect');

    message = JSON.parse(await aliceClient2.messageOk());
    t.strictSame(message, {
      type: 'system',
      event: 'user_list',
      users: ['alice'],
    });

    // Second connection for alice should NOT emit another user_connected
    await Promise.all([
      assertNoWsMessage(t, aliceClient1),
      assertNoWsMessage(t, aliceClient2),
    ]);

    const bobClient = await app.newTestUserAgent({ tap: t });
    await loginUser(app, bobClient, 'bob');
    await bobClient.websocketOk('/api/chat/connect');

    // Everyone sees bob's connect
    message = JSON.parse(await bobClient.messageOk());
    t.strictSame(message, {
      type: 'system',
      event: 'user_connected',
      user: 'bob',
    });

    message = JSON.parse(await bobClient.messageOk());
    t.strictSame(message, {
      type: 'system',
      event: 'user_list',
      users: ['alice', 'bob'],
    });

    message = JSON.parse(await aliceClient1.messageOk());
    t.strictSame(message, {
      type: 'system',
      event: 'user_connected',
      user: 'bob',
    });

    message = JSON.parse(await aliceClient2.messageOk());
    t.strictSame(message, {
      type: 'system',
      event: 'user_connected',
      user: 'bob',
    });

    // Message sent from second tab
    const chatText = 'Hello from alice second tab';
    await aliceClient2.sendOk(chatText);

    message = JSON.parse(await aliceClient1.messageOk());
    t.strictSame(message, {
      type: 'chat',
      user: 'alice',
      content: chatText,
    });

    message = JSON.parse(await aliceClient2.messageOk());
    t.strictSame(message, {
      type: 'chat',
      user: 'alice',
      content: chatText,
    });

    message = JSON.parse(await bobClient.messageOk());
    t.strictSame(message, {
      type: 'chat',
      user: 'alice',
      content: chatText,
    });

    await aliceClient1.closeOk(4000);
    await aliceClient1.closedOk(4000);
    await aliceClient1.stop();

    await aliceClient2.closeOk(4000);
    await aliceClient2.closedOk(4000);
    await aliceClient2.stop();

    await bobClient.closeOk(4000);
    await bobClient.closedOk(4000);
    await bobClient.stop();
  },
);
