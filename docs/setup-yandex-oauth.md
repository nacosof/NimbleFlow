# Яндекс OAuth

Вход через Яндекс ID (Auth.js).

Официально: [oauth.yandex.ru](https://oauth.yandex.ru/), [документация Яндекс ID](https://yandex.ru/dev/id/doc/ru/).

## 1. Создай приложение

1. Зайди на https://oauth.yandex.ru/
2. Создай приложение.
3. В **Redirect URI** укажи:

```text
{NEXT_PUBLIC_APP_URL}/api/auth/callback/yandex
```

Примеры:

- локально: `http://localhost:3000/api/auth/callback/yandex`
- прод: `https://your-domain.ru/api/auth/callback/yandex`

4. Скопируй **ClientID** и **Client secret**.

## 2. Пропиши в `.env`

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
AUTH_SECRET=...   # openssl rand -base64 32
AUTH_TRUST_HOST=true
AUTH_YANDEX_ID=...
AUTH_YANDEX_SECRET=...
```

`NEXT_PUBLIC_APP_URL` должен совпадать с тем доменом/портом, который указан в Redirect URI (без слэша в конце).

## 3. Проверка

```bash
pnpm dev
```

Открой `/login` → **Войти через Яндекс**. После успеха должен открыться `/profile` (или `callbackUrl` из query).

## Частые ошибки

- Redirect URI не совпадает с фактическим URL (http/https, порт, путь).
- Забыли перезапустить `pnpm dev` после правки `.env`.
- `AUTH_SECRET` пустой.
