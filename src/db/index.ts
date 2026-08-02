export { getDb, getSchema, type Database, type DbSchema } from "./client";

import type * as postgresSchema from "./schema/postgres";

export type User = typeof postgresSchema.users.$inferSelect;
export type NewUser = typeof postgresSchema.users.$inferInsert;
export type Payment = typeof postgresSchema.payments.$inferSelect;
export type NewPayment = typeof postgresSchema.payments.$inferInsert;
export type Account = typeof postgresSchema.accounts.$inferSelect;
export type Session = typeof postgresSchema.sessions.$inferSelect;
