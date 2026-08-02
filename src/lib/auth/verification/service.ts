import { and, eq, ne } from "drizzle-orm";

import { db, tables } from "@/db/runtime";
import {
  detectChannel,
  generateVerificationCode,
  normalizeIdentifier,
  type IdentifierChannel,
} from "@/lib/auth/identifier";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import {
  getDevProfileContact,
  isDevUserId,
} from "@/lib/auth/dev-login";
import { sendEmail } from "@/lib/email";
import { sendSms } from "@/lib/sms";

const CODE_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export async function getProfileContact(userId: string) {
  if (isDevUserId(userId)) {
    return getDevProfileContact();
  }

  const database = db();
  const schema = tables();
  const rows = await database
    .select({
      email: schema.users.email,
      emailVerified: schema.users.emailVerified,
      phone: schema.users.phone,
      phoneVerifiedAt: schema.users.phoneVerifiedAt,
      name: schema.users.name,
      plan: schema.users.plan,
    })
    .from(schema.users)
    .where(eq(schema.users.id, userId))
    .limit(1);

  return rows[0] ?? null;
}

function assertNotDevUser(userId: string) {
  if (isDevUserId(userId)) {
    throw new Error(
      "Dev-вход без БД: подтверждение email/телефона недоступно. Поднимите Postgres для полного сценария.",
    );
  }
}

async function assertIdentifierAvailable(
  userId: string,
  channel: IdentifierChannel,
  identifier: string,
) {
  const database = db();
  const schema = tables();
  const column =
    channel === "email" ? schema.users.email : schema.users.phone;

  const rows = await database
    .select({ id: schema.users.id })
    .from(schema.users)
    .where(and(eq(column, identifier), ne(schema.users.id, userId)))
    .limit(1);

  if (rows[0]) {
    throw new Error(
      channel === "email"
        ? "Этот email уже занят другим аккаунтом"
        : "Этот телефон уже занят другим аккаунтом",
    );
  }
}

export async function sendContactVerificationCode(input: {
  userId: string;
  channel: IdentifierChannel;
  identifier: string;
}) {
  assertNotDevUser(input.userId);

  if (detectChannel(input.identifier) !== input.channel) {
    throw new Error(
      input.channel === "email"
        ? "Укажите корректный email"
        : "Укажите корректный телефон",
    );
  }

  const channel = input.channel;
  const identifier = normalizeIdentifier(input.identifier, channel);
  await assertIdentifierAvailable(input.userId, channel, identifier);

  const code = generateVerificationCode();
  const codeHash = await hashPassword(code);
  const expiresAt = new Date(Date.now() + CODE_TTL_MS);
  const database = db();
  const schema = tables();

  await database
    .delete(schema.verificationChallenges)
    .where(
      and(
        eq(schema.verificationChallenges.userId, input.userId),
        eq(schema.verificationChallenges.channel, channel),
      ),
    );

  await database.insert(schema.verificationChallenges).values({
    userId: input.userId,
    identifier,
    channel,
    codeHash,
    expiresAt,
  });

  if (channel === "email") {
    await sendEmail({
      to: identifier,
      subject: "Код подтверждения NimbleFlow",
      text: `Ваш код: ${code}`,
      html: `<p>Ваш код подтверждения: <strong>${code}</strong></p>`,
    });
  } else {
    await sendSms(identifier, `NimbleFlow: код ${code}`);
  }

  return { channel, identifier };
}

export async function confirmContactVerificationCode(input: {
  userId: string;
  channel: IdentifierChannel;
  identifier: string;
  code: string;
}) {
  assertNotDevUser(input.userId);

  const identifier = normalizeIdentifier(input.identifier, input.channel);
  const database = db();
  const schema = tables();

  const rows = await database
    .select()
    .from(schema.verificationChallenges)
    .where(
      and(
        eq(schema.verificationChallenges.userId, input.userId),
        eq(schema.verificationChallenges.channel, input.channel),
        eq(schema.verificationChallenges.identifier, identifier),
      ),
    )
    .limit(1);

  const challenge = rows[0];
  if (!challenge) {
    throw new Error("Код не найден. Запросите новый.");
  }

  if (challenge.expiresAt.getTime() < Date.now()) {
    await database
      .delete(schema.verificationChallenges)
      .where(eq(schema.verificationChallenges.id, challenge.id));
    throw new Error("Код истёк. Запросите новый.");
  }

  if (challenge.attempts >= MAX_ATTEMPTS) {
    throw new Error("Слишком много попыток. Запросите новый код.");
  }

  const valid = await verifyPassword(input.code.trim(), challenge.codeHash);
  if (!valid) {
    await database
      .update(schema.verificationChallenges)
      .set({ attempts: challenge.attempts + 1 })
      .where(eq(schema.verificationChallenges.id, challenge.id));
    throw new Error("Неверный код");
  }

  await assertIdentifierAvailable(input.userId, input.channel, identifier);

  const now = new Date();
  if (input.channel === "email") {
    await database
      .update(schema.users)
      .set({ email: identifier, emailVerified: now })
      .where(eq(schema.users.id, input.userId));
  } else {
    await database
      .update(schema.users)
      .set({ phone: identifier, phoneVerifiedAt: now })
      .where(eq(schema.users.id, input.userId));
  }

  await database
    .delete(schema.verificationChallenges)
    .where(eq(schema.verificationChallenges.id, challenge.id));

  return { channel: input.channel, identifier };
}
