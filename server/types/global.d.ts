import { MojoContext as BaseMojoContext } from '@mojojs/core';
import { WebSocket } from '@mojojs/core/lib/websocket';
import { z } from 'zod';

declare global {
  type MojoContext = BaseMojoContext;
  type MojoWs = WebSocket;

  type ChatMessage = {
    user: 'system' | string;
    content: string;
  };

  type Clients = Map<MojoWs, string>;
}

declare module '@mojojs/core/lib/types' {
  interface SessionData {
    username?: string;
  }
}

declare module '@mojojs/core/lib/app' {
  interface App {
    users: Set<string>;
  }
}

declare module '@mojojs/core' {
  interface MojoContext {
    validate(condition: boolean, message: string): Promise<boolean>;
    parsedJsonRequest<T>(schema: z.ZodSchema<T>): Promise<T> | null;
  }
}
