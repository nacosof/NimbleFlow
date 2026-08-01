# NimbleFlow | В разработке

**Готовый каркас сайта на Next.js с авторизацией, личным кабинетом и приёмом оплаты.**

Клонируешь репозиторий, заполняешь ключи — получаешь связанный проект: лендинг, вход, кабинет и оплату.

Это не облачный сервис и не набор кнопок. Это **исходный код твоего проекта**, который можно менять и деплоить куда угодно.

---

## Стек

| Слой | Выбор |
|------|--------|
| Framework | Next.js **16.2**, React **19.2** |
| Language | TypeScript **5.9** |
| UI | Tailwind CSS **4.3** |
| Auth | Auth.js **v5** — Яндекс ID, VK ID, Mail.ru |
| Database | Drizzle ORM — PostgreSQL или MySQL (`DB_PROVIDER`) |
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
pnpm dev
```

Открой http://localhost:3000

Сейчас: лендинг (`/`), профиль (`/profile`), конфиг окружения (`.env.example`). Auth, БД и оплата — дальше по разработке.
