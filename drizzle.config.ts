import "dotenv/config";

import { defineConfig } from "drizzle-kit";

const provider = process.env.DB_PROVIDER === "mysql" ? "mysql" : "postgres";
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is required for drizzle-kit. Set it in .env before running db commands.",
  );
}

export default defineConfig({
  schema:
    provider === "mysql"
      ? "./src/db/schema/mysql.ts"
      : "./src/db/schema/postgres.ts",
  out: "./drizzle",
  dialect: provider === "mysql" ? "mysql" : "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
  strict: true,
  verbose: true,
});
