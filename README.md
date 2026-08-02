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
| Auth | Auth.js **v5** — Яндекс, VK, Mail.ru, телефон |
| Database | Drizzle ORM **0.45** — PostgreSQL или MySQL (`DB_PROVIDER`) |
| Payments | ЮKassa / Robokassa |
| AI | подключение ИИ (`AI_PROVIDER`) |
| Email | SMTP или Unisender |
| Validation | Zod **4.4** |
| Package manager | pnpm **10** |

---

## Быстрый старт (каркас)

```bash
git clone https://github.com/nacosof/NimbleFlow.git
cd NimbleFlow
pnpm install
cp .env.example .env
```

В `.env` укажи `DATABASE_URL`, `AUTH_SECRET` и ключи OAuth (`AUTH_YANDEX_*` / `AUTH_VK_*` / `AUTH_MAILRU_*`).

```bash
pnpm db:push
pnpm dev
```

Открой http://localhost:3000

Сейчас: лендинг (`/`), вход (`/login`), профиль (`/profile`, нужен логин), схема БД. Оплата и форма телефон/email — дальше.
