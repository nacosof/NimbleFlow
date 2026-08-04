# AI setup

Нейросеть в кабинете работает через переменные окружения. Ключ не хранится в БД и не вводится в UI.

← [Все гайды](./README.md)

## Переменные

```env
AI_PROVIDER=openrouter
AI_API_KEY=
# AI_BASE_URL=
# AI_MODEL=
```

`AI_PROVIDER`:

| Значение | API |
|----------|-----|
| `openrouter` | OpenRouter |
| `openai` | OpenAI |
| `mistral` | Mistral |
| `genapi` | GenAPI |
| `deepseek` | DeepSeek |
| `anthropic` | Anthropic Messages |
| `gemini` | Gemini (OpenAI-compatible endpoint) |
| `grok` | xAI Grok |
| `gigachat` | GigaChat (Сбер) |
| `openai_compatible` | любой OpenAI-compatible base URL |

Для `openai_compatible` обязателен `AI_BASE_URL` (без хвоста `/chat/completions`).

`AI_MODEL` опционален: если пусто — берётся модель по умолчанию для провайдера.

## GigaChat

[GigaChat API](https://developers.sber.ru/portal/products/gigachat-api) · [документация](https://developers.sber.ru/docs/ru/gigachat/guides/main)

```env
AI_PROVIDER=gigachat
AI_API_KEY=          # ключ авторизации из кабинета (не access token)
# GIGACHAT_SCOPE=GIGACHAT_API_PERS
# AI_MODEL=GigaChat-2
# AI_BASE_URL=https://api.giga.chat/v1
# GIGACHAT_AUTH_URL=https://ngw.devices.sberbank.ru:9443/api/v2/oauth
```

| Переменная | Значение |
|------------|----------|
| `AI_API_KEY` | **Ключ авторизации** из [Studio](https://developers.sber.ru/studio/) |
| `GIGACHAT_SCOPE` | `GIGACHAT_API_PERS` (физлица), `GIGACHAT_API_B2B` или `GIGACHAT_API_CORP` |
| `AI_MODEL` | например `GigaChat-2`, `GigaChat-2-Pro`, `GigaChat-2-Max` |
| `AI_BASE_URL` | по умолчанию `https://api.giga.chat/v1` |

1. Создай проект GigaChat API ([быстрый старт](https://developers.sber.ru/docs/ru/gigachat/individuals-quickstart)).
2. Скопируй ключ авторизации → `AI_API_KEY`.
3. Выбери `GIGACHAT_SCOPE` под тип аккаунта.

Приложение само получает access token (~30 мин) и кэширует его.

Если Node ругается на SSL — нужен [сертификат НУЦ Минцифры](https://developers.sber.ru/docs/ru/gigachat/certificates) или `NODE_EXTRA_CA_CERTS`.

## Проверка

1. Заполни `AI_PROVIDER` и `AI_API_KEY` в `.env`.
2. Перезапусти `pnpm dev`.
3. Войди в `/profile` → блок «Нейросеть» → отправь сообщение.

Эндпоинт: `POST /api/ai/chat` (нужна сессия).
