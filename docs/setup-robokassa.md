# Robokassa

Оплата тарифа Pro через Robokassa.

Официально: [partner.robokassa.ru](https://partner.robokassa.ru/), [документация](https://docs.robokassa.ru/ru/quick-start).

## 1. Магазин и пароли

1. Создай магазин в Robokassa.
2. Возьми **MerchantLogin**, **Password1** (платежи), **Password2** (ResultURL).
3. В `.env`:

```env
PAYMENT_PROVIDER=robokassa
ROBOKASSA_MERCHANT_LOGIN=...
ROBOKASSA_PASSWORD1=...
ROBOKASSA_PASSWORD2=...
ROBOKASSA_IS_TEST=1
ROBOKASSA_RESULT_URL=http://localhost:3000/api/webhooks/robokassa
ROBOKASSA_SUCCESS_URL=http://localhost:3000/payments/success
ROBOKASSA_FAIL_URL=http://localhost:3000/payments/fail
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

На проде: `ROBOKASSA_IS_TEST=0` и URL на свой домен.

## 2. URL в кабинете Robokassa

В настройках магазина укажи:

| Назначение | URL |
|------------|-----|
| ResultURL | `{APP}/api/webhooks/robokassa` |
| SuccessURL | `{APP}/payments/success` |
| FailURL | `{APP}/payments/fail` |

Локально для ResultURL нужен публичный HTTPS — см. [ngrok](./setup-webhooks-ngrok.md).

ResultURL должен отвечать `OK{InvId}` после успешной обработки (так и сделано в коде).

## 3. Проверка сценария

1. Живая БД + OAuth-вход (не Dev Login).
2. Оплата Pro из кабинета / `/pricing`.
3. После ResultURL webhook план в профиле = **Pro**.
4. Пользователь видит Success/Fail страницу.

## Частые ошибки

- Перепутаны Password1 и Password2.
- ResultURL недоступен снаружи → Pro не обновится.
- Забыли `PAYMENT_PROVIDER=robokassa`.
