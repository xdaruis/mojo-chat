import t from 'tap';

import { app } from '../index.js';

app.log.level = 'debug';

await t.test('onConnect', async (t) => {
  let msg = null;

  await t.test('should notify when a user connects', async (t) => {
    const ws1 = await app.newTestUserAgent({ tap: t });
    await ws1.websocketOk('/api/chat/connect');

    msg = JSON.parse(await ws1.messageOk());
    t.strictSame(msg, {
      user: 'system',
      content: 'User 1 connected to the chat. 1 users connected.',
    });

    await ws1.closeOk(4000);
    await ws1.closedOk(4000);
    await ws1.stop();
  });

  await t.test('should notify user 2 connected', async (t) => {
    const ws2 = await app.newTestUserAgent({ tap: t });
    await ws2.websocketOk('/api/chat/connect');

    msg = JSON.parse(await ws2.messageOk());
    t.strictSame(msg, {
      user: 'system',
      content: 'User 2 connected to the chat. 1 users connected.',
    });

    await ws2.closeOk(4000);
    await ws2.closedOk(4000);
    await ws2.stop();
  });

  await t.test(
    'should broadcast messages between multiple clients',
    async (t) => {
      const ws3 = await app.newTestUserAgent({ tap: t });
      await ws3.websocketOk('/api/chat/connect');

      msg = JSON.parse(await ws3.messageOk());
      t.strictSame(msg, {
        user: 'system',
        content: 'User 3 connected to the chat. 1 users connected.',
      });

      const ws4 = await app.newTestUserAgent({ tap: t });
      await ws4.websocketOk('/api/chat/connect');

      msg = JSON.parse(await ws3.messageOk());
      t.strictSame(msg, {
        user: 'system',
        content: 'User 4 connected to the chat. 2 users connected.',
      });

      msg = JSON.parse(await ws4.messageOk());
      t.strictSame(msg, {
        user: 'system',
        content: 'User 4 connected to the chat. 2 users connected.',
      });

      const user4Message = 'Hello World!';
      await ws4.sendOk(user4Message);

      msg = JSON.parse(await ws3.messageOk());

      t.strictSame(msg, {
        user: '4',
        content: user4Message,
      });

      msg = JSON.parse(await ws4.messageOk());
      t.strictSame(msg, {
        user: '4',
        content: user4Message,
      });

      const user3Message = 'Hey User 4!';
      await ws3.sendOk(user3Message);

      msg = JSON.parse(await ws3.messageOk());
      t.strictSame(msg, {
        user: '3',
        content: user3Message,
      });

      msg = JSON.parse(await ws4.messageOk());
      t.strictSame(msg, {
        user: '3',
        content: user3Message,
      });

      await ws3.closeOk(4000);
      await ws3.closedOk(4000);

      msg = JSON.parse(await ws4.messageOk());
      t.strictSame(msg, {
        user: 'system',
        content: 'User 3 disconnected from the chat. 1 users connected.',
      });

      await ws4.closeOk(4000);
      await ws4.closedOk(4000);
      await ws3.stop();
      await ws4.stop();
    },
  );
});

await t.test('healthCheck', async (t) => {
  const ua = await app.newTestUserAgent({ tap: t });
  await t.test('Should show status 204 and empty body', async () => {
    (await ua.getOk('/api/chat/healthcheck')).statusIs(204).bodyIs('');
  });
  await ua.stop();
});
