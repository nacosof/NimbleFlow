import { relations } from "drizzle-orm";
import {
  int,
  json,
  mysqlTable,
  primaryKey,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("user", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).unique(),
  emailVerified: timestamp("emailVerified", { mode: "date", fsp: 3 }),
  image: varchar("image", { length: 2048 }),
  yandexId: varchar("yandexId", { length: 255 }).unique(),
  vkId: varchar("vkId", { length: 255 }).unique(),
  mailruId: varchar("mailruId", { length: 255 }).unique(),
  passwordHash: varchar("passwordHash", { length: 255 }),
  phone: varchar("phone", { length: 32 }).unique(),
  phoneVerifiedAt: timestamp("phoneVerifiedAt", { mode: "date", fsp: 3 }),
  plan: varchar("plan", { length: 32 }).notNull().default("free"),
  planExpiresAt: timestamp("planExpiresAt", { mode: "date", fsp: 3 }),
  createdAt: timestamp("createdAt", { mode: "date", fsp: 3 })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date", fsp: 3 })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const accounts = mysqlTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 }).notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: varchar("refresh_token", { length: 2048 }),
    access_token: varchar("access_token", { length: 2048 }),
    expires_at: int("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 2048 }),
    id_token: varchar("id_token", { length: 2048 }),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => [
    primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  ],
);

export const sessions = mysqlTable("session", {
  sessionToken: varchar("sessionToken", { length: 255 }).primaryKey(),
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date", fsp: 3 }).notNull(),
});

export const verificationTokens = mysqlTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date", fsp: 3 }).notNull(),
  },
  (verificationToken) => [
    primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  ],
);

export const payments = mysqlTable("payment", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: varchar("userId", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  provider: varchar("provider", { length: 32 }).notNull(),
  status: varchar("status", { length: 32 }).notNull().default("pending"),
  amountKopeks: int("amountKopeks").notNull(),
  currency: varchar("currency", { length: 8 }).notNull().default("RUB"),
  plan: varchar("plan", { length: 32 }).notNull(),
  externalId: varchar("externalId", { length: 255 }).notNull().unique(),
  yookassaPaymentId: varchar("yookassaPaymentId", { length: 255 }).unique(),
  robokassaInvId: varchar("robokassaInvId", { length: 255 }).unique(),
  raw: json("raw"),
  createdAt: timestamp("createdAt", { mode: "date", fsp: 3 })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date", fsp: 3 })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  payments: many(payments),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
}));
