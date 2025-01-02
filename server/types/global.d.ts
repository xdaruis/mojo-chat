import { MojoContext } from '@mojojs/core';
import { SessionData } from '@mojojs/core/lib/types.js';
import { WebSocket } from '@mojojs/core/lib/websocket';
import { AssertionError } from 'node:assert';

declare module '@mojojs/core/lib/types' {
  interface SessionData {
    username?: string;
  }
}

declare module '@mojojs/core/lib/app' {
  interface App {
    clients: Map<WebSocket, string>;
    idCounter: number;
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
  };
  type ChatMessage = {
    user: 'system' | string;
    content: string;
  };
}
