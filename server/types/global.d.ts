import { MojoContext } from '@mojojs/core';
import { WebSocket } from '@mojojs/core/lib/websocket';

declare module '@mojojs/core/lib/app' {
  interface App {
    clients: Set<MojoWs>;
  }
}

declare global {
  type MojoWs = WebSocket;
  type MojoCtx = MojoContext;
}
