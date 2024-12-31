import { readFileSync } from 'node:fs';
import t from 'tap';

import { app } from '../index.js';

app.log.level = 'debug';

await t.test('serveClient', async (t) => {
  const ua = await app.newTestUserAgent({ tap: t });

  // Read and parse index.html to get current asset filenames
  const indexHtml = readFileSync(
    app.home.child('../client/dist/index.html').toString(),
    'utf-8',
  );
  const cssFile = indexHtml.match(/href="\/assets\/(index-.*?\.css)"/)?.[1];
  const jsFile = indexHtml.match(/src="\/assets\/(index-.*?\.js)"/)?.[1];

  // Read the actual files
  const expectedCss = readFileSync(
    app.home.child('../client/dist/assets', cssFile).toString(),
    'utf-8',
  );
  const expectedJs = readFileSync(
    app.home.child('../client/dist/assets', jsFile).toString(),
    'utf-8',
  );

  await t.test('should serve CSS file from assets', async () => {
    const response = await ua.get(`/assets/${cssFile}`);
    t.equal(response.statusCode, 200);
    t.equal(response.type, 'text/css');
    t.equal(await response.text(), expectedCss);
  });

  await t.test('should serve JS file from assets', async () => {
    const response = await ua.get(`/assets/${jsFile}`);
    t.equal(response.statusCode, 200);
    t.equal(response.type, 'application/javascript');
    t.equal(await response.text(), expectedJs);
  });

  await t.test('should serve index.html', async () => {
    const response = await ua.get('/');
    t.equal(response.statusCode, 200);
    t.equal(response.type, 'text/html; charset=utf-8');
    t.equal(await response.text(), indexHtml);

    const response2 = await ua.get('/?test=123');
    t.equal(response2.statusCode, 200);
    t.equal(response2.type, 'text/html; charset=utf-8');
    t.equal(await response2.text(), indexHtml);

    const response3 = await ua.get('/.');
    t.equal(response3.statusCode, 200);
    t.equal(response3.type, 'text/html; charset=utf-8');
    t.equal(await response3.text(), indexHtml);

    const response4 = await ua.get('');
    t.equal(response4.statusCode, 200);
    t.equal(response4.type, 'text/html; charset=utf-8');
    t.equal(await response4.text(), indexHtml);
  });

  await t.test(
    'should block traversal attempts to sensitive files',
    async () => {
      // Test .env file access
      const envResponse = await ua.get('/../.env');
      t.equal(envResponse.statusCode, 200);
      t.equal(envResponse.type, 'text/html; charset=utf-8');
      t.equal(await envResponse.text(), indexHtml);

      const envResponse2 = await ua.get('/../server/.env');
      t.equal(envResponse2.statusCode, 200);
      t.equal(envResponse2.type, 'text/html; charset=utf-8');
      t.equal(await envResponse2.text(), indexHtml);

      // Test package.json access
      const pkgResponse = await ua.get('/../package.json');
      t.equal(pkgResponse.statusCode, 200);
      t.equal(pkgResponse.type, 'text/html; charset=utf-8');
      t.equal(await pkgResponse.text(), indexHtml);

      // Test deep traversal attempt
      const deepResponse = await ua.get('/../../../../../../etc/passwd');
      t.equal(deepResponse.statusCode, 200);
      t.equal(deepResponse.type, 'text/html; charset=utf-8');
      t.equal(await deepResponse.text(), indexHtml);
    },
  );

  await ua.stop();
});
