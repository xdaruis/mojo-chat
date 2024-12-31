/**
 * @param {MojoCtx} ctx
 * @param {ChatMessage} message
 */
export function broadcastToClients(ctx, message) {
  const serializedMessage = JSON.stringify(message);
  for (const [client] of ctx.app.clients) {
    client.send(serializedMessage);
  }
}
