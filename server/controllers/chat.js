import assert from 'node:assert';

import * as ChatHelper from '../helpers/chat.js';

/** @type {Clients} */
const clients = new Map();
const usernames = new Map();

export default class ChatController {
  /**
   * @param {MojoContext} ctx
   * @returns {Promise<void>}
   */
  async onConnect(ctx) {
    const session = await ctx.session();
    assert(session.username, 'Session username is required');
    // console.log('session:::', JSON.stringify(session, null, 2));

    ctx.on('connection', (/** @type {MojoWs} */ ws) => {
      clients.set(ws, session.username ?? 'Unknown');
      usernames.set(
        session.username,
        (usernames.get(session.username) ?? 0) + 1,
      );

      if (usernames.get(session.username) === 1) {
        ChatHelper.broadcastToClients(clients, {
          type: 'system',
          event: 'user_connected',
          user: session.username ?? 'Unknown',
        });
      }

      ws.on('message', (/** @type {string} */ msg) => {
        // DEVNOTE: In the future we might wanna send a JSON string
        // instead of a string
        assert(
          typeof msg === 'string',
          'ws on message data should be a string',
        );
        const userId = clients.get(ws);
        ChatHelper.broadcastToClients(clients, {
          type: 'chat',
          user: userId ?? 'Unknown',
          content: msg,
        });
      });

      ws.on('close', async () => {
        const username = clients.get(ws);
        usernames.set(username, (usernames.get(username) ?? 0) - 1);
        clients.delete(ws);

        if (usernames.get(username) > 0) return;

        usernames.delete(username);

        ChatHelper.broadcastToClients(clients, {
          type: 'system',
          event: 'user_disconnected',
          user: username ?? 'Unknown',
        });
      });
    });
  }

  /**
   * @param {MojoContext} ctx
   * @returns {Promise<void>}
   */
  healthCheck(ctx) {
    return ctx.res.status(204).send();
  }
}
