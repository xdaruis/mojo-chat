import { MojoContext } from '@mojojs/core';
import { App } from '@mojojs/core/lib/app';
import { SessionData } from '@mojojs/core/lib/types.js';
import { WebSocket } from '@mojojs/core/lib/websocket';
import { AssertionError } from 'node:assert';
import { z } from 'zod';

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

declare global {
  type MojoContext = import('@mojojs/core').MojoContext;
  type MojoWs = WebSocket;

  type ChatMessage = {
    user: 'system' | string;
    content: string;
  };
  type Clients = Map<MojoWs, string>;
}
