import assert from 'node:assert';

export default class ChatController {
  /**
   * @param {MojoCtx} ctx
   * @param {ChatMessage} message
   */
  _broadcast(ctx, message) {
    const serializedMessage = JSON.stringify(message);
    for (const [client] of ctx.app.clients) {
      client.send(serializedMessage);
    }
  }

  /**
   * @param {MojoCtx} ctx
   */
  async onConnect(ctx) {
    ctx.on('connection', (/** @type {MojoWs} */ ws) => {
      ++ctx.app.idCounter;
      ctx.app.clients.set(ws, ctx.app.idCounter);
      this._broadcast(ctx, {
        user: 'system',
        content:
          `User ${ctx.app.idCounter} connected to the chat. ` +
          `${ctx.app.clients.size} users connected.`,
      });

      ws.on('close', () => {
        const userId = ctx.app.clients.get(ws);
        ctx.app.clients.delete(ws);
        this._broadcast(ctx, {
          user: 'system',
          content:
            `User ${userId} disconnected from the chat. ` +
            `${ctx.app.clients.size} users connected.`,
        });
      });

      ws.on('message', (/** @type {string} */ data) => {
        // TODO: Add ability for each user to set a unique nickname
        assert(typeof data === 'string', 'data should be a string');
        const userId = ctx.app.clients.get(ws);
        this._broadcast(ctx, {
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
