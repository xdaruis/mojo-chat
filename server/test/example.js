import {app} from '../index.js';
import t from 'tap';

app.log.level = 'debug';

t.test('welcome method', async t => {
  const ua = await app.newTestUserAgent({tap: t});

  await t.test('should get ok', async () => {
    (await ua.getOk('/')).statusIs(200).jsonIs({message: 'Hello'});
  });

  await ua.stop();
});
