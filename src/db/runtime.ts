import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";

import { getDb, getSchema } from "@/db";
import type * as postgresSchema from "@/db/schema/postgres";

export function db() {
  return getDb() as unknown as PostgresJsDatabase<typeof postgresSchema>;
}

export function tables() {
  return getSchema() as unknown as typeof postgresSchema;
}
