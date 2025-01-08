import { MojoContext } from '@mojojs/core';
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

declare global {
  type MojoWs = WebSocket;
  type MojoCtx = MojoContext & {
    /**
     * TODO: Find a way to not log the assertion error
     *
     * Renders a JSON response with a 400 status code and an error message.
     * Throws an error if the condition is not met.
     * @throws {AssertionError}
     */
    validate(condition: boolean, message: string): Promise<void>;
    parsedJsonRequest<T>(schema: z.ZodSchema<T>): Promise<T> | null;
  };
  type ChatMessage = {
    user: 'system' | string;
    content: string;
  };
  type Clients = Map<MojoWs, string>;
}
