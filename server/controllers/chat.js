import assert from 'node:assert';

import * as ChatHelper from '../helpers/chat.js';
import { deleteSession } from '../helpers/user.js';

/** @type {Clients} */
const _clients = new Map();
let _idCounter = 0;

export default class ChatController {
  /**
   * @param {MojoCtx} ctx
   */
  async onConnect(ctx) {
    const session = await ctx.session();

    ctx.on('connection', (/** @type {MojoWs} */ ws) => {
      ++_idCounter;
      _clients.set(ws, session.username || String(_idCounter));

      ChatHelper.broadcastToClients(_clients, {
        user: 'system',
        content:
          `User ${_idCounter} connected to the chat. ` +
          `${_clients.size} users connected.`,
      });

      ws.on('close', async () => {
        const userId = _clients.get(ws);
        _clients.delete(ws);
        await deleteSession(ctx);

        ChatHelper.broadcastToClients(_clients, {
          user: 'system',
          content:
            `User ${userId} disconnected from the chat. ` +
            `${_clients.size} users connected.`,
        });
      });

      ws.on('message', (/** @type {string} */ data) => {
        // TODO: Add ability for each user to set a unique nickname
        assert(
          typeof data === 'string',
          'ws on message data should be a string',
        );
        const userId = _clients.get(ws);
        ChatHelper.broadcastToClients(_clients, {
          user: userId ?? 'Unknown',
          content: data,
        });
      });
    });
  }

  /**
   * @param {MojoCtx} ctx
   */
  healthCheck(ctx) {
    return ctx.res.status(204).send();
  }
}
