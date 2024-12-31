import assert from 'node:assert';
import * as ChatHelper from '../helpers/chat.js';

export default class ChatController {
  /**
   * @param {MojoCtx} ctx
   */
  async onConnect(ctx) {
    ctx.on('connection', (/** @type {MojoWs} */ ws) => {
      ++ctx.app.idCounter;
      ctx.app.clients.set(ws, ctx.app.idCounter);

      ChatHelper.broadcastToClients(ctx, {
        user: 'system',
        content:
          `User ${ctx.app.idCounter} connected to the chat. ` +
          `${ctx.app.clients.size} users connected.`,
      });

      ws.on('close', async () => {
        const session = await ctx.session();
        console.log(`----------session: ${session}`);
        const userId = ctx.app.clients.get(ws);
        ctx.app.clients.delete(ws);

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
    ctx.res.status(204).send();
  }
}
