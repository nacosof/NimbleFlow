# NimbleFlow | В разработке

**Готовый каркас сайта на Next.js**

Клонируешь репозиторий, заполняешь ключи — получаешь связанный проект: лендинг, вход, кабинет, оплату и AI.

Это не облачный сервис и не набор кнопок. Это **исходный код твоего проекта**, который можно менять и деплоить куда угодно.

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

В `.env` укажи `DATABASE_URL` и при необходимости `DB_PROVIDER=postgres|mysql`.

```bash
pnpm db:push
pnpm dev
```

Открой http://localhost:3000

Сейчас: лендинг (`/`), профиль (`/profile`), env-конфиг, схема БД (Drizzle). Auth и оплата — дальше.
