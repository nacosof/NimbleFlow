# ЮKassa

Оплата тарифа Pro через ЮKassa.

Официально: [yookassa.ru/my](https://yookassa.ru/my), [документация](https://yookassa.ru/developers).

## 1. Магазин и ключи

1. Зарегистрируй магазин в ЮKassa.
2. Возьми **shopId** и **секретный ключ**.
3. В `.env`:

```env
PAYMENT_PROVIDER=yookassa
YOOKASSA_SHOP_ID=...
YOOKASSA_SECRET_KEY=...
YOOKASSA_RETURN_URL=http://localhost:3000/payments/success
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

На проде подставь свой домен в `NEXT_PUBLIC_APP_URL` и `YOOKASSA_RETURN_URL`.

## 2. HTTP-уведомления (webhook)

В кабинете ЮKassa укажи URL уведомлений:

```text
{NEXT_PUBLIC_APP_URL}/api/webhooks/yookassa
```

Локально ЮKassa не достучится до `localhost` — используй [ngrok](./setup-webhooks-ngrok.md).

На проде в webhook проверяются IP ЮKassa; статус платежа дополнительно перепроверяется через API.

## 3. Проверка сценария

1. Живая БД + обычный OAuth-вход (не Dev Login).
2. `/pricing` или кабинет → **Оплатить Pro**.
3. Оплата в тестовом/боевом режиме ЮKassa.
4. Возврат на `/payments/success`.
5. После webhook в `/profile` план становится **Pro**.

## Частые ошибки

- Dev Login: оплата намеренно недоступна (нет БД).
- Webhook не настроен → оплата прошла, Pro не появился.
- Неверный `YOOKASSA_RETURN_URL` / `NEXT_PUBLIC_APP_URL`.
