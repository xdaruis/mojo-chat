/**
 * @param {Clients} clients
 * @param {WebSocketMessage} message
 * @returns {void}
 */
export function broadcastToClients(clients, message) {
  const serializedMessage = JSON.stringify(message);
  for (const [client] of clients) {
    client.send(serializedMessage);
  }
}
