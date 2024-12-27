import mojo, { yamlConfigPlugin } from '@mojojs/core';

export const app = mojo();

app.plugin(yamlConfigPlugin);
app.secrets = app.config.secrets;
app.clients = new Map();
app.idCounter = 0;

// == Chat Routes ==
app.websocket('/api/chat/connect').to('chat#onConnect');
app.get('/api/chat/health').to('chat#healthCheck');

app.start();
