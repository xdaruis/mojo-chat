import { WebSocket } from '@mojojs/core/lib/websocket';
import { MojoContext } from '@mojojs/core';

declare module '@mojojs/core/lib/app' {
  interface App {
    clients: Set<MojoWs>;
  }
}

declare global {
  type MojoWs = WebSocket;
  type MojoCtx = MojoContext;
}
