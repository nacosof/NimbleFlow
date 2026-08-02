import { drizzle as drizzleMysql } from "drizzle-orm/mysql2";
import { drizzle as drizzlePostgres } from "drizzle-orm/postgres-js";
import mysql from "mysql2/promise";
import postgres from "postgres";

import { getEnv } from "@/config/env";

import * as mysqlSchema from "./schema/mysql";
import * as postgresSchema from "./schema/postgres";

type PostgresDb = ReturnType<typeof createPostgresDb>;
type MysqlDb = ReturnType<typeof createMysqlDb>;

export type Database = PostgresDb | MysqlDb;
export type DbSchema = typeof postgresSchema | typeof mysqlSchema;

type GlobalDbState = typeof globalThis & {
  __nimbleflowDb?: Database;
  __nimbleflowPostgres?: ReturnType<typeof postgres>;
  __nimbleflowMysql?: mysql.Pool;
};

const globalDb = globalThis as GlobalDbState;

function requireDatabaseUrl(): string {
  const databaseUrl = getEnv().DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is required. Copy .env.example to .env and set a connection string.",
    );
  }

  return databaseUrl;
}

function createPostgresDb() {
  const url = requireDatabaseUrl();

  const client =
    globalDb.__nimbleflowPostgres ??
    postgres(url, {
      max: 10,
      prepare: false,
    });

  if (getEnv().NODE_ENV !== "production") {
    globalDb.__nimbleflowPostgres = client;
  }

  return drizzlePostgres(client, { schema: postgresSchema });
}

function createMysqlDb() {
  const url = requireDatabaseUrl();

  const pool =
    globalDb.__nimbleflowMysql ??
    mysql.createPool({
      uri: url,
      connectionLimit: 10,
    });

  if (getEnv().NODE_ENV !== "production") {
    globalDb.__nimbleflowMysql = pool;
  }

  return drizzleMysql(pool, { schema: mysqlSchema, mode: "default" });
}

export function getSchema(): DbSchema {
  return getEnv().DB_PROVIDER === "mysql" ? mysqlSchema : postgresSchema;
}

export function getDb(): Database {
  if (globalDb.__nimbleflowDb) {
    return globalDb.__nimbleflowDb;
  }

  const db =
    getEnv().DB_PROVIDER === "mysql" ? createMysqlDb() : createPostgresDb();

  if (getEnv().NODE_ENV !== "production") {
    globalDb.__nimbleflowDb = db;
  }

  return db;
}
