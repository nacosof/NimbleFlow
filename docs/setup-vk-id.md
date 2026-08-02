# VK ID

Вход через VK ID. В NimbleFlow свой OAuth-flow (не встроенный провайдер Auth.js): старт `/api/auth/vk/start`, callback `/api/auth/callback/vk`.

Официально: [id.vk.com](https://id.vk.com/about/business/go).

## 1. Создай приложение VK ID

1. Зайди в кабинет VK ID: https://id.vk.com/about/business/go
2. Создай приложение / подключи VK ID для сайта.
3. В настройках укажи **Redirect URL**:

```text
{NEXT_PUBLIC_APP_URL}/api/auth/callback/vk
```

Примеры:

- локально: `http://localhost:3000/api/auth/callback/vk`
- прод: `https://your-domain.ru/api/auth/callback/vk`

4. Скопируй **App ID** и **защищённый ключ** (secure key).

## 2. Пропиши в `.env`

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
AUTH_SECRET=...
AUTH_TRUST_HOST=true
AUTH_VK_ID=...
AUTH_VK_SECRET=...
```

## 3. Проверка

```bash
pnpm dev
```

Открой `/login` → **Войти через VK**. Успешный вход ведёт в `/profile` (или в `callbackUrl`).

## Частые ошибки

- Redirect URL в кабинете VK ≠ фактический callback.
- Перепутали App ID и secure key.
- Для локалки нужен именно `http://localhost:3000/...`, если так открываешь сайт.
