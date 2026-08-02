# AI setup

Нейросеть в кабинете работает через переменные окружения. Ключ не хранится в БД и не вводится в UI.

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
| `openai_compatible` | любой OpenAI-compatible base URL |

Для `openai_compatible` обязателен `AI_BASE_URL` (без хвоста `/chat/completions`).

`AI_MODEL` опционален: если пусто — берётся модель по умолчанию для провайдера.

## Проверка

1. Заполни `AI_PROVIDER` и `AI_API_KEY` в `.env`.
2. Перезапусти `pnpm dev`.
3. Войди в `/profile` → блок «Нейросеть» → отправь сообщение.

Эндпоинт: `POST /api/ai/chat` (нужна сессия).
