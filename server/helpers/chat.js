/**
 * @param {Clients} clients
 * @param {ChatMessage} message
 */
export function broadcastToClients(clients, message) {
  const serializedMessage = JSON.stringify(message);
  for (const [client] of clients) {
    client.send(serializedMessage);
  }
}
