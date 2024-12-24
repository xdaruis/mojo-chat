export default class ChatController {
  async onMessage(ctx) {
    ctx.on('connection', (ws) => {
      ws.send('Connected to the chat');
    });

    ctx.json(async (ws) => {
      for await (const message of ws) {
        ws.send(`Echo: ${message}`);
      }
    });
  }
}
