import mojo, { yamlConfigPlugin } from '@mojojs/core';

export const app = mojo({ exceptionFormat: 'json' });

app.plugin(yamlConfigPlugin);
app.secrets = app.config.secrets;
app.clients = new Map();
app.idCounter = 0;

// == Chat Routes ==
app.websocket('/api/chat/connect').to('chat#onConnect');
app.get('/api/chat/healthcheck').to('chat#healthCheck');

// == Download Routes ==
app.get('/*').to('download#serveClient');

app
  .start()
  .then(() => {
    app.log.info('Server successfully started!');
  })
  .catch((error) => {
    app.log.error(`Server failed to start: ${error.message}\n${error.stack}`);
  });
