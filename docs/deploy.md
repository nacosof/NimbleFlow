# Деплой

Выложи Next.js-приложение на любой сервер или PaaS, где есть Node.js и HTTPS. Конкретный хостер не важен — важны домен, переменные окружения и БД.

## Перед выкладкой

1. Заполни прод-`.env` (или переменные окружения панели хостинга).
2. `NEXT_PUBLIC_APP_URL=https://your-domain.ru` (без `/` в конце).
3. Redirect URI OAuth и URL webhook платежей — на этот же домен.
4. `AUTH_SECRET` — новый секрет, не коммить в git.
5. `AUTH_DEV_LOGIN=false` (в production кнопка Dev и так отключена).
6. БД Postgres или MySQL доступна с приложения; схема через `pnpm db:push` / миграции.
7. Опционально: `NEXT_PUBLIC_YANDEX_METRIKA_ID` — см. [setup-yandex-metrika.md](./setup-yandex-metrika.md).

---

## Сборка и запуск (Node)

На машине с Node 20+ и pnpm:

```bash
git clone https://github.com/nacosof/NimbleFlow.git
cd NimbleFlow
pnpm install
cp .env.example .env
# отредактируй .env под прод
pnpm db:push
pnpm build
pnpm start
```

По умолчанию приложение слушает порт **3000**. Перед ним обычно ставят reverse-proxy (Nginx, Caddy и т.п.) с HTTPS и проксированием на этот порт.

### systemd (набросок)

```ini
[Unit]
Description=NimbleFlow
After=network.target

[Service]
Type=simple
WorkingDirectory=/var/www/nimbleflow
ExecStart=/usr/bin/pnpm start
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Открой 80/443, привяжи DNS A/AAAA-запись домена к IP сервера.

---

## PaaS / панель хостинга

Если деплоишь через панель («Git → Build → Start»), укажи примерно:

| Шаг | Команда / значение |
|-----|--------------------|
| Install | `pnpm install` |
| Build | `pnpm build` |
| Start | `pnpm start` |
| Env | все нужные из `.env.example` |

После появления публичного HTTPS-URL пропиши его в OAuth и платёжках (см. ниже).

---

## После выкладки — обязательно

В кабинетах провайдеров замени localhost на прод-домен:

- Яндекс / VK — Redirect URI
- ЮKassa / Robokassa — webhook и return/fail URL

И то же в `.env` (`NEXT_PUBLIC_APP_URL`, `YOOKASSA_*` / `ROBOKASSA_*`).

---

## Чеклист

- [ ] `/` открывается по HTTPS
- [ ] `/login` → Яндекс и/или VK
- [ ] `/profile` после входа
- [ ] Оплата Pro + webhook → план Pro
- [ ] `/legal/*` доступны
- [ ] `/sitemap.xml` и `/robots.txt` отдают 200
