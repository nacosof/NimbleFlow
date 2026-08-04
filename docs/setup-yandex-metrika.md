# Яндекс Метрика

Аналитика для инстанса после деплоя. Документация: [справка Метрики](https://yandex.ru/support/metrica/ru/), [API](https://yandex.ru/dev/metrika).

## 1. Создай счётчик

1. Открой [metrika.yandex.ru](https://metrika.yandex.ru/) → добавь счётчик.
2. Укажи адрес сайта = `NEXT_PUBLIC_APP_URL` (без `/` в конце).
3. Скопируй **номер счётчика** (только цифры).

## 2. Env

В `.env`:

```bash
NEXT_PUBLIC_YANDEX_METRIKA_ID=12345678
```

Переменная публичная (`NEXT_PUBLIC_`) — попадает в клиентский бандл. Секретов в ней нет.

После изменения перезапусти `pnpm dev` / пересобери прод (`pnpm build`).

## 3. Что уже встроено

- Загрузка `tag.js` и `ym(id, "init", { defer: true, … })` в корневом layout.
- Первый `hit` при загрузке скрипта; далее `hit` при смене маршрута (App Router).
- Карта кликов, внешние ссылки, точный отказ, Вебвизор.
- Хелпер целей: `metrikaReachGoal("goal_name")` из `src/lib/analytics/metrika.ts`.

Если `NEXT_PUBLIC_YANDEX_METRIKA_ID` пустой — код Метрики не подключается.

## 4. Цели (по желанию)

В интерфейсе Метрики создай JavaScript-цель, например `payment_success`. В коде после успешного действия:

```ts
import { metrikaReachGoal } from "@/lib/analytics/metrika";

metrikaReachGoal("payment_success");
```

## 5. Проверка

1. Открой сайт с заполненным ID.
2. В Метрике → отчёт «Онлайн» / проверка счётчика.
3. Убедись, что домен в настройках счётчика совпадает с прод-доменом.
