# Webhook на локалке: ngrok

Платёжные системы шлют уведомления на публичный URL. `localhost` им недоступен — пробрось туннель.

## 1. Установка

- Сайт: https://ngrok.com/
- Или: `winget install ngrok` / скачай бинарь.

Авторизуйся токеном из кабинета ngrok (один раз).

## 2. Запуск

Терминал 1:

```bash
pnpm dev
```

Терминал 2:

```bash
ngrok http 3000
```

Скопируй HTTPS-адрес вида `https://xxxx.ngrok-free.app`.

## 3. Обнови `.env`

```env
NEXT_PUBLIC_APP_URL=https://xxxx.ngrok-free.app
```

Для ЮKassa:

```env
YOOKASSA_RETURN_URL=https://xxxx.ngrok-free.app/payments/success
```

Webhook в кабинете ЮKassa:

```text
https://xxxx.ngrok-free.app/api/webhooks/yookassa
```

Для Robokassa:

```env
ROBOKASSA_RESULT_URL=https://xxxx.ngrok-free.app/api/webhooks/robokassa
ROBOKASSA_SUCCESS_URL=https://xxxx.ngrok-free.app/payments/success
ROBOKASSA_FAIL_URL=https://xxxx.ngrok-free.app/payments/fail
```

И те же URL в кабинете Robokassa.

Перезапусти `pnpm dev` после смены `.env`.

## 4. OAuth при ngrok

Redirect URI Яндекс / VK тоже должны указывать на ngrok-домен, иначе после оплаты/логина будет ошибка callback.

## 5. На проде

ngrok не нужен: ставь реальный HTTPS-домен в `.env` и в кабинетах провайдеров.
