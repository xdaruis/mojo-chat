import { PrismaClient } from '@prisma/client';

import { app } from '../index.js';

const mainAppURL = process.env.DATABASE_URL;
process.env.DATABASE_URL = `${mainAppURL}_test`;
const tables = ['users'];

async function _setupFreshDatabase() {
  app.prisma = new PrismaClient({ datasourceUrl: `${mainAppURL}_test` });
  await app.prisma.$executeRawUnsafe(`
    TRUNCATE TABLE ${tables.join(', ')}
    RESTART IDENTITY 
    CASCADE
  `);
}

await _setupFreshDatabase();

export default app;
