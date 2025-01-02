import assert from 'node:assert';

import * as ChatHelper from '../helpers/chat.js';
import { deleteSession } from '../helpers/user.js';

export default class ChatController {
  /**
   * @param {MojoCtx} ctx
   */
  async onConnect(ctx) {
    const session = await ctx.session();

    ctx.on('connection', (/** @type {MojoWs} */ ws) => {
      ++ctx.app.idCounter;
      ctx.app.clients.set(ws, session.username || String(ctx.app.idCounter));

      ChatHelper.broadcastToClients(ctx, {
        user: 'system',
        content:
          `User ${ctx.app.idCounter} connected to the chat. ` +
          `${ctx.app.clients.size} users connected.`,
      });

      ws.on('close', async () => {
        const userId = ctx.app.clients.get(ws);
        ctx.app.clients.delete(ws);
        await deleteSession(ctx);

        ChatHelper.broadcastToClients(ctx, {
          user: 'system',
          content:
            `User ${userId} disconnected from the chat. ` +
            `${ctx.app.clients.size} users connected.`,
        });
      });

      ws.on('message', (/** @type {string} */ data) => {
        // TODO: Add ability for each user to set a unique nickname
        assert(
          typeof data === 'string',
          'ws on message data should be a string',
        );
        const userId = ctx.app.clients.get(ws);
        ChatHelper.broadcastToClients(ctx, {
          user: userId?.toString() ?? 'Unknown',
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
