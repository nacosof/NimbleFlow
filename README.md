<div align="center">

# NimbleFlow

*в разработке*

</div>

# Сэкономьте часы на написании повторяющегося кода, выпускайте продукты быстро и получайте прибыль!

Готовый каркас сайта на Next.js: лендинг, вход, кабинет, оплату и AI.

Клонируешь репозиторий, заполняешь ключи — получаешь связанный проект. Это не облачный сервис и не набор кнопок. Это **исходный код твоего проекта**, который можно менять и деплоить куда угодно.

<div align="center">

![Next.js, React, Tailwind, TypeScript, Node.js, PostgreSQL, MySQL, pnpm](https://skillicons.dev/icons?i=nextjs,react,tailwind,ts,nodejs,postgres,mysql,pnpm)

![Auth.js](https://img.shields.io/badge/Auth.js-v5-black?style=flat-square)
![Drizzle](https://img.shields.io/badge/Drizzle-0.45-C5F74F?style=flat-square)
![Zod](https://img.shields.io/badge/Zod-4.4-3E67B1?style=flat-square)
![ЮKassa](https://img.shields.io/badge/ЮKassa-ready-7B61FF?style=flat-square)
![Robokassa](https://img.shields.io/badge/Robokassa-ready-2E7D32?style=flat-square)

</div>

---

## Стек

| Слой | Выбор |
|------|--------|
| Framework | Next.js **16.2**, React **19.2** |
| Language | TypeScript **5.9** |
| UI | Tailwind CSS **4.3** |
| Auth | Auth.js **v5** — Яндекс, VK ID|
| Database | Drizzle ORM **0.45** — PostgreSQL или MySQL (`DB_PROVIDER`) |
| Payments | ЮKassa / Robokassa |
| AI | OpenRouter / OpenAI / Mistral / GenAPI / DeepSeek / Anthropic / Gemini / Grok (`AI_PROVIDER` + `AI_API_KEY`) |
| Email | SMTP или Unisender |
| SMS | SMS.ru |
| Validation | Zod **4.4** |
| Package manager | pnpm **10** |

---

## Быстрый старт

```bash
git clone https://github.com/nacosof/NimbleFlow.git
cd NimbleFlow
pnpm install
cp .env.example .env
```

Все переменные и подсказки «где взять» — в [`.env.example`](.env.example). Скопируй его в `.env` и заполни то, что нужно для работы:

- база данных: `DATABASE_URL`, `DB_PROVIDER`
- auth: `AUTH_SECRET`, `AUTH_YANDEX_*` / `AUTH_VK_*`
- оплата: `PAYMENT_PROVIDER` + ключи ЮKassa (`YOOKASSA_*`) или Robokassa (`ROBOKASSA_*`)
- нейросеть: `AI_PROVIDER`, `AI_API_KEY` (опционально `AI_MODEL`) — [`docs/setup-ai.md`](docs/setup-ai.md)
- почта / SMS: `EMAIL_PROVIDER` + SMTP/Unisender, `SMS_PROVIDER` + SMS.ru

```bash
pnpm db:push
pnpm dev
```

Открой http://localhost:3000

---

## Dev Login

Удобно при разработке: можно править кабинет и страницы без живой БД и OAuth.

1. В `.env` поставь `AUTH_DEV_LOGIN=true`
2. Запусти `pnpm dev`
3. Открой `/login` → **«Войти как Dev (локально)»**

Кнопка есть только при `AUTH_DEV_LOGIN=true` и только вне production. Сессия без базы. Подтверждение email/телефона и оплата в этом режиме не работают. Чат с AI работает, если задан `AI_API_KEY`.

---

## Что уже есть

Лендинг (`/`), вход OAuth (`/login`), профиль с подтверждением email/телефона, оплатой Pro и чатом нейросети (`/profile`), webhooks ЮKassa/Robokassa, тарифы (`/pricing`).
