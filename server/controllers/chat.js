import assert from 'node:assert';

import * as ChatHelper from '../helpers/chat.js';

/** @type {Clients} */
const clients = new Map();

/** @type {Map<string, number>} */
const usernames = new Map();

export default class ChatController {
  /**
   * @param {MojoContext} ctx
   * @returns {Promise<void>}
   */
  async onConnect(ctx) {
    const username = (await ctx.session()).username;

    assert(typeof username === 'string', 'Session username is required');

    ctx.on('connection', (/** @type {MojoWs} */ ws) => {
      clients.set(ws, username);
      usernames.set(username, (usernames.get(username) ?? 0) + 1);

      if (usernames.get(username) === 1) {
        ChatHelper.broadcastToClients(clients, {
          type: 'system',
          event: 'user_connected',
          user: username,
        });
      }

      ws.send(
        JSON.stringify({
          type: 'system',
          event: 'user_list',
          users: Array.from(usernames.keys()),
        }),
      );

      ws.on('message', (msg) => {
        // DEVNOTE: In the future we might wanna receive a JSON string
        // instead of a normal string
        assert(
          typeof msg === 'string',
          'ws on message data should be a string',
        );
        ChatHelper.broadcastToClients(clients, {
          type: 'chat',
          user: username,
          content: msg,
        });
      });

      ws.on('close', async () => {
        usernames.set(username, (usernames.get(username) ?? 0) - 1);
        clients.delete(ws);

        if (usernames.get(username) ?? 0 > 0) return;

        usernames.delete(username);

        ChatHelper.broadcastToClients(clients, {
          type: 'system',
          event: 'user_disconnected',
          user: username,
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
