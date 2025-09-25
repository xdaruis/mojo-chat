import { PrismaClient } from '@prisma/client';
import nock from 'nock';

import { app } from '../index.js';

const mainAppURL = process.env.DATABASE_URL;
process.env.DATABASE_URL = `${mainAppURL}_test`;
const tables = ['users']; // TODO: Find a better way to get the DB tables

async function _resetDbTables() {
  app.prisma = new PrismaClient({ datasourceUrl: `${mainAppURL}_test` });
  await app.prisma.$executeRawUnsafe(`
    TRUNCATE TABLE ${tables.join(', ')}
    RESTART IDENTITY 
    CASCADE
  `);
}

await _resetDbTables();

// Keep only localhost requests, used to suppress external requests if any
nock.disableNetConnect();
nock.enableNetConnect('0.0.0.0');

export default app;
