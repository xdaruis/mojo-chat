import mojo, { yamlConfigPlugin } from '@mojojs/core';

import * as AppHelpers from './helpers/index.js';

export const app = mojo({ exceptionFormat: 'json' });

app.plugin(yamlConfigPlugin);
app.secrets = app.config.secrets;
app.clients = new Map();
app.users = new Set();
app.idCounter = 0;

app.addHelper('validate', AppHelpers.validate);

// == User Routes ==
app.post('/api/user/login').to('user#onLogin');
app.post('/api/user/logout').to('user#onLogout');
app.post('/api/user/session').to('user#getSession');

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
