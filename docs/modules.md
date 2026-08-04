# Модули

Карта фич шаблона: где лежит код, какие env, от чего зависит, как выключить или вырезать.  
Пошаговые гайды по ключам — в [README docs](./README.md).

← [Документация](./README.md)

## Быстрый указатель

| Модуль | Код | Выкл. без удаления |
|--------|-----|---------------------|
| Auth (Яндекс / VK / Dev) | `lib/auth`, `api/auth` | не задавать ключи провайдера |
| OTP email/телефон | `lib/auth/verification`, `components/profile` | убрать карточку с `/profile` |
| Платежи | `lib/payments`, `api/payments` | убрать CTA оплаты |
| ЮKassa | `lib/yookassa` | `PAYMENT_PROVIDER=robokassa` |
| Robokassa | `lib/robokassa` | `PAYMENT_PROVIDER=yookassa` |
| Чеки 54‑ФЗ | `lib/payments/receipt.ts` | `RECEIPT_ENABLED=false` |
| Подписка Free/Pro | `lib/subscription`, `config/plans.ts` | — |
| Email | `lib/email` | не настраивать SMTP (в dev → лог) |
| SMS | `lib/sms` | `SMS_PROVIDER=console` |
| AI | `lib/ai`, `api/ai` | не задавать `AI_API_KEY` |
| Метрика | `lib/analytics`, `components/analytics` | пустой `NEXT_PUBLIC_YANDEX_METRIKA_ID` |
| SEO | `lib/seo`, `sitemap.ts`, `robots.ts` | — |
| Legal | `(marketing)/legal`, `config/legal.ts` | удалить страницы + ссылки |
| Лендинг | `components/marketing` | заменить `/` |
| Кабинет | `(app)/profile` | — |
| UI | `components/ui` | — |
| БД | `db/` | ядро |

---

## Ядро

### Config
`src/config/` — `env.ts` (Zod), `site.ts`, `plans.ts`, `legal.ts`.

### База (Drizzle)
`src/db/` — Postgres или MySQL (`DB_PROVIDER`).

Таблицы: `user`, `account`, `session`, `verificationToken`, `payment`, `verificationChallenge`.

Env: `DATABASE_URL`, `DB_PROVIDER`.

---

## Auth

Вход через Яндекс ID и/или VK ID; Dev Login только локально.

| | |
|--|--|
| Код | `src/lib/auth/` · `src/app/api/auth/` · `/login` · защита в `src/proxy.ts` |
| Env | `AUTH_SECRET`, `AUTH_YANDEX_*`, `AUTH_VK_*`, `AUTH_DEV_LOGIN` |
| Зависит | БД (`user`, `account`, `session`), email (welcome) |
| Гайды | [Яндекс](./setup-yandex-oauth.md), [VK ID](./setup-vk-id.md) |

**Вырезать:** `lib/auth`, `api/auth/*`, `/login`, `src/types/next-auth.d.ts` — и всё, что зовёт `requireUser` / сессию.

---

## Подтверждение контактов (OTP)

В кабинете: код на email / SMS.

| | |
|--|--|
| Код | `src/lib/auth/verification/` · `components/profile/contact-verify-card.tsx` |
| Env | через Email и SMS |
| Зависит | Auth, `verificationChallenge`, Email, SMS |

**Вырезать:** verification + карточку с профиля; таблицу `verificationChallenge` из схемы.

---

## Платежи

Общий слой → ЮKassa или Robokassa → webhook → Pro.

| | |
|--|--|
| Код | `src/lib/payments/` · `components/payments/` · `api/payments/create` · `/payments/success\|fail` |
| Env | `PAYMENT_PROVIDER` |
| Зависит | Auth, подписка, email (письмо об оплате), БД `payment` |

### ЮKassa
`src/lib/yookassa/` · `api/webhooks/yookassa` · [setup](./setup-yookassa.md) · `YOOKASSA_*`

### Robokassa
`src/lib/robokassa/` · `api/webhooks/robokassa` · [setup](./setup-robokassa.md) · `ROBOKASSA_*`

### Чеки 54‑ФЗ
`src/lib/payments/receipt.ts` — объект `receipt` / параметр `Receipt`.

Env: `RECEIPT_ENABLED`, `RECEIPT_SNO`, `RECEIPT_VAT`.  
Нужен email или телефон в профиле. Без кассы в ЛК провайдера — оставь `false`.

Локальные webhook: [ngrok](./setup-webhooks-ngrok.md).

---

## Подписка

| | |
|--|--|
| Код | `src/lib/subscription/` · `config/plans.ts` · UI плана в `components/app/` |
| Env | цена/срок — в `plans.ts` |
| Зависит | поле `user.plan` / `planExpiresAt`; grant из `payments/finalize` |

---

## Email и SMS

**Email** — `src/lib/email/`: welcome, payment-succeeded, OTP.  
Env: `EMAIL_PROVIDER`, `SMTP_*` / `UNISENDER_*`, `EMAIL_FROM`.

**SMS** — `src/lib/sms/`: OTP.  
Env: `SMS_PROVIDER`, `SMSRU_*`.

---

## AI

Чат в кабинете. Провайдеры: OpenRouter, OpenAI, Mistral, GenAPI, DeepSeek, Anthropic, Gemini, Grok, **GigaChat**, openai_compatible.

| | |
|--|--|
| Код | `src/lib/ai/` · `api/ai/chat` · `components/profile/ai-chat-card.tsx` |
| Env | `AI_PROVIDER`, `AI_API_KEY`, опц. `AI_MODEL`, `AI_BASE_URL`, `GIGACHAT_*` |
| Гайд | [setup-ai](./setup-ai.md) |

**Вырезать:** `lib/ai`, `api/ai`, `AiChatCard`.

---

## Яндекс Метрика

| | |
|--|--|
| Код | `src/lib/analytics/` · `components/analytics/` · root `layout.tsx` |
| Env | `NEXT_PUBLIC_YANDEX_METRIKA_ID` |
| Гайд | [setup-yandex-metrika](./setup-yandex-metrika.md) |

---

## SEO, Legal, Лендинг, Кабинет, UI

| Модуль | Код |
|--------|-----|
| SEO | `src/lib/seo/`, `app/sitemap.ts`, `app/robots.ts` |
| Legal | `/legal/*`, `config/legal.ts`, `components/legal/` |
| Лендинг | `/`, `components/marketing/` |
| Кабинет | `/profile`, `components/app/`, `components/profile/` |
| UI | `components/ui/`, `lib/cn.ts`, `globals.css` |

---

## Зависимости (схема)

```text
config/env
  └─ db, auth, payments, email, sms, ai, analytics

auth ──► email (welcome)
verification ──► email + sms
payments ──► yookassa | robokassa
         ──► receipt? (54-ФЗ)
         ──► subscription.grant + email
profile ──► auth + subscription + OTP + payments UI + ai
marketing / legal / seo ──► почти автономны
```

---

## Типичные «вырезать X»

| Хочу | Делай |
|------|--------|
| Без AI | убери ключ **или** удали `lib/ai` + `api/ai` + карточку |
| Без Метрики | не задавай ID |
| Без чеков | `RECEIPT_ENABLED=false` |
| Только ЮKassa | `PAYMENT_PROVIDER=yookassa`, можно удалить `lib/robokassa` |
| Без OTP | убери verification + карточку; SMS можно не трогать |
| Свой лендинг | перепиши `(marketing)/page.tsx` и секции |

После удаления папок проверь импорты (`pnpm build`) и таблицу sitemap/footer.
