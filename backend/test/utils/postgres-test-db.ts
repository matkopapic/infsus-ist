import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Client, ClientConfig } from 'pg';

type TestDatabaseConfig = {
  host: string;
  port: number;
  user: string;
  password?: string;
  database: string;
};

const schemaPath = resolve(__dirname, '../../src/database/schema/database.sql');
const seedPath = resolve(__dirname, '../../src/database/schema/seed.sql');

function getTestDatabaseConfig(): TestDatabaseConfig {
  return {
    host: process.env.TEST_DB_HOST!!,
    port: Number(process.env.TEST_DB_PORT!!),
    user: process.env.TEST_DB_USERNAME!!,
    password: process.env.TEST_DB_PASSWORD!!,
    database: process.env.TEST_DB_NAME!!,
  };
}

function getMaintenanceConfig(config: TestDatabaseConfig): ClientConfig {
  return {
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: 'postgres',
  };
}

function quoteIdentifier(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

export function applyTestDatabaseEnv() {
  const config = getTestDatabaseConfig();

  process.env.DB_HOST = config.host;
  process.env.DB_PORT = String(config.port);
  process.env.DB_USERNAME = config.user;
  process.env.DB_PASSWORD = config.password ?? '';
  process.env.DB_NAME = config.database;
  process.env.DB_SSL = 'false';
  process.env.DB_SSL_REJECT_UNAUTHORIZED = 'false';
}

export async function ensureTestDatabaseExists() {
  const config = getTestDatabaseConfig();
  const client = new Client(getMaintenanceConfig(config));

  await client.connect();

  const result = await client.query<{ exists: boolean }>(
    'SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname = $1) AS exists',
    [config.database],
  );

  if (!result.rows[0]?.exists) {
    await client.query(`CREATE DATABASE ${quoteIdentifier(config.database)}`);
  }

  await client.end();
}

export async function resetTestDatabase() {
  const config = getTestDatabaseConfig();
  const client = new Client({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
  });

  const [schemaSql, seedSql] = await Promise.all([
    readFile(schemaPath, 'utf8'),
    readFile(seedPath, 'utf8'),
  ]);

  await client.connect();
  await client.query(schemaSql);
  await client.query(seedSql);
  await client.end();
}
