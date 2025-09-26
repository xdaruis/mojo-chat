import { MojoContext as BaseMojoContext } from '@mojojs/core';
import { WebSocket } from '@mojojs/core/lib/websocket';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

type ChatMessage = {
  type: 'chat';
  user: string;
  content: string;
};

type SystemMessage = {
  type: 'system';
  event: 'user_connected' | 'user_disconnected';
  user: string;
};

declare global {
  type MojoContext = BaseMojoContext;
  type MojoWs = WebSocket;

  type WebSocketMessage = ChatMessage | SystemMessage;

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
    prisma: PrismaClient;
  }
}

declare module '@mojojs/core' {
  interface MojoContext {
    parsedJsonRequest<T>(schema: z.ZodSchema<T>): Promise<T> | null;
  }
}
