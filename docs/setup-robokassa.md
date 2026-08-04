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

## 3. Чеки 54-ФЗ (фискализация)

Для облачной кассы / Робочеков передавай номенклатуру в `Receipt` ([дока](https://docs.robokassa.ru/ru/fiscalization)):

```env
RECEIPT_ENABLED=true
RECEIPT_SNO=usn_income
RECEIPT_VAT=none
```

`Receipt` входит в подпись: `MerchantLogin:OutSum:InvId:Receipt:Password1` (Receipt URL-encoded).  
Email покупателя берётся из профиля (`Email` в запросе). Без email/телефона при `RECEIPT_ENABLED=true` оплата не стартует.

Без фискализации в ЛК — `RECEIPT_ENABLED=false`.

## 4. Проверка сценария

1. Живая БД + OAuth-вход (не Dev Login).
2. Оплата Pro из кабинета / `/pricing`.
3. После ResultURL webhook план в профиле = **Pro**.
4. Пользователь видит Success/Fail страницу.

## Частые ошибки

- Перепутаны Password1 и Password2.
- ResultURL недоступен снаружи → Pro не обновится.
- Забыли `PAYMENT_PROVIDER=robokassa`.
- `RECEIPT_ENABLED=true` без email/телефона в профиле → ошибка до редиректа.
- Фискализация включена в коде, но не в ЛК Robokassa → чек не сформируется / способы оплаты пропадут.
