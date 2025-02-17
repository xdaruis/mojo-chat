import { PrismaClient } from '@prisma/client';
import { execSync } from 'node:child_process';

const mainAppURL = process.env.DATABASE_URL;
process.env.DATABASE_URL = `${mainAppURL}_test`;

const dbName = process.env.DATABASE_NAME;

async function _populateTestDatabase() {
  const prisma = new PrismaClient({ datasourceUrl: mainAppURL });
  await prisma.$executeRawUnsafe(
    `DROP DATABASE IF EXISTS "${dbName}_test" WITH (FORCE)`,
  );
  await prisma.$executeRawUnsafe(`CREATE DATABASE ${dbName}_test`);
  process.env.DATABASE_URL = `${mainAppURL}_test`;
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  await prisma.$disconnect();
}

await _populateTestDatabase();
