import { MojoContext } from '@mojojs/core';
import { WebSocket } from '@mojojs/core/lib/websocket';

declare module '@mojojs/core/lib/app' {
  interface App {
    clients: Map<WebSocket, number>;
    idCounter: number;
  }
}

declare global {
  type MojoWs = WebSocket;
  type MojoCtx = MojoContext;
  type ChatMessage = {
    user: 'system' | string;
    content: string;
  };
}
