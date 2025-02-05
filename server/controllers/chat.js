import assert from 'node:assert';

import * as ChatHelper from '../helpers/chat.js';
import { deleteSession } from '../helpers/user.js';

/** @type {Clients} */
const clients = new Map();

let idCounter = 0;

export default class ChatController {
  /**
   * @param {MojoContext} ctx
   */
  async onConnect(ctx) {
    const session = await ctx.session();

    ctx.on('connection', (/** @type {MojoWs} */ ws) => {
      ++idCounter;
      clients.set(ws, session.username || String(idCounter));

      ChatHelper.broadcastToClients(clients, {
        user: 'system',
        content:
          `User ${idCounter} connected to the chat. ` +
          `${clients.size} users connected.`,
      });

      ws.on('close', async () => {
        const userId = clients.get(ws);
        clients.delete(ws);
        await deleteSession(ctx);

        ChatHelper.broadcastToClients(clients, {
          user: 'system',
          content:
            `User ${userId} disconnected from the chat. ` +
            `${clients.size} users connected.`,
        });
      });

      ws.on('message', (/** @type {string} */ data) => {
        // TODO: Add ability for each user to set a unique nickname
        assert(
          typeof data === 'string',
          'ws on message data should be a string',
        );
        const userId = clients.get(ws);
        ChatHelper.broadcastToClients(clients, {
          user: userId ?? 'Unknown',
          content: data,
        });
      });
    });
  }

  /**
   * @param {MojoContext} ctx
   */
  healthCheck(ctx) {
    return ctx.res.status(204).send();
  }
}
