import { z } from "zod";

const emptyToUndefined = (value: unknown) =>
  value === "" || value === undefined ? undefined : value;

const optionalString = z.preprocess(emptyToUndefined, z.string().min(1).optional());

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.preprocess(
    emptyToUndefined,
    z.string().url().default("http://localhost:3000"),
  ),
  NEXT_PUBLIC_YANDEX_METRIKA_ID: optionalString,
  AUTH_SECRET: optionalString,
  AUTH_TRUST_HOST: z
    .preprocess(emptyToUndefined, z.enum(["true", "false"]).optional())
    .transform((value) => value !== "false"),
  DB_PROVIDER: z.enum(["postgres", "mysql"]).default("postgres"),
  DATABASE_URL: optionalString,
  DATABASE_URL_UNPOOLED: optionalString,
  AUTH_YANDEX_ID: optionalString,
  AUTH_YANDEX_SECRET: optionalString,
  AUTH_VK_ID: optionalString,
  AUTH_VK_SECRET: optionalString,
  AUTH_DEV_LOGIN: z
    .preprocess(emptyToUndefined, z.enum(["true", "false"]).optional())
    .transform((value) => value === "true"),
  SMS_PROVIDER: z.enum(["smsru", "console"]).default("console"),
  SMSRU_API_ID: optionalString,
  SMSRU_FROM: optionalString,
  PAYMENT_PROVIDER: z.enum(["yookassa", "robokassa"]).default("yookassa"),
  YOOKASSA_SHOP_ID: optionalString,
  YOOKASSA_SECRET_KEY: optionalString,
  YOOKASSA_RETURN_URL: optionalString,
  ROBOKASSA_MERCHANT_LOGIN: optionalString,
  ROBOKASSA_PASSWORD1: optionalString,
  ROBOKASSA_PASSWORD2: optionalString,
  ROBOKASSA_IS_TEST: z
    .preprocess(emptyToUndefined, z.enum(["0", "1"]).default("1"))
    .transform((value) => value === "1"),
  ROBOKASSA_RESULT_URL: optionalString,
  ROBOKASSA_SUCCESS_URL: optionalString,
  ROBOKASSA_FAIL_URL: optionalString,
  EMAIL_PROVIDER: z.enum(["smtp", "unisender"]).default("smtp"),
  SMTP_HOST: optionalString,
  SMTP_PORT: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().positive().default(587),
  ),
  SMTP_USER: optionalString,
  SMTP_PASS: optionalString,
  EMAIL_FROM: optionalString,
  UNISENDER_API_KEY: optionalString,
  UNISENDER_SENDER_EMAIL: optionalString,
  AI_PROVIDER: z
    .enum([
      "openai",
      "openrouter",
      "mistral",
      "genapi",
      "deepseek",
      "anthropic",
      "gemini",
      "grok",
      "gigachat",
      "openai_compatible",
    ])
    .default("openrouter"),
  AI_API_KEY: optionalString,
  AI_BASE_URL: optionalString,
  AI_MODEL: optionalString,
  GIGACHAT_SCOPE: z
    .enum(["GIGACHAT_API_PERS", "GIGACHAT_API_B2B", "GIGACHAT_API_CORP"])
    .default("GIGACHAT_API_PERS"),
  GIGACHAT_AUTH_URL: optionalString,
});

export type Env = z.infer<typeof envSchema>;

function formatEnvError(error: z.ZodError): string {
  return error.issues
    .map((issue) => `  - ${issue.path.join(".") || "env"}: ${issue.message}`)
    .join("\n");
}

function parseEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    throw new Error(
      `Invalid environment variables:\n${formatEnvError(parsed.error)}`,
    );
  }

  return parsed.data;
}

let cachedEnv: Env | undefined;

export function getEnv(): Env {
  if (!cachedEnv) {
    cachedEnv = parseEnv();
  }

  return cachedEnv;
}

export const env: Env = new Proxy({} as Env, {
  get(_target, property) {
    const value = getEnv()[property as keyof Env];
    return value;
  },
});
