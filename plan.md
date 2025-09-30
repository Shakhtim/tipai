# План разработки проекта "AI Multi-Search"

## Описание проекта
Веб-приложение для одновременного получения ответов от нескольких AI моделей. Пользователь вводит запрос, и различные AI (OpenAI, Claude, Gemini и др.) параллельно выдают свои ответы.

## Технологический стек

### Frontend
- **React 18+** с TypeScript
- **Redux Toolkit** для state management
- **RTK Query** или createAsyncThunk для API calls
- **Axios** для HTTP запросов
- **Vite** как build tool
- **Tailwind CSS** или **Material-UI** для стилизации
- **React Router** для навигации (если потребуется)

### Backend
- **Express.js** с TypeScript
- **Axios** для запросов к AI APIs
- **Cors** для обработки cross-origin requests
- **Dotenv** для переменных окружения
- **Helmet** для безопасности
- **Node.js 18+**

### AI APIs для интеграции
- OpenAI GPT (GPT-4, GPT-3.5)
- Anthropic Claude
- Google Gemini
- (опционально) Mistral AI, Cohere, Perplexity

---

## Структура проекта

```
react-ai-searching/
├── client/                      # Frontend приложение
│   ├── public/
│   ├── src/
│   │   ├── components/         # React компоненты
│   │   │   ├── SearchInput.tsx
│   │   │   ├── AIResponseCard.tsx
│   │   │   ├── ResponsesGrid.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── store/              # Redux store
│   │   │   ├── index.ts
│   │   │   └── slices/
│   │   │       ├── aiSlice.ts
│   │   │       └── uiSlice.ts
│   │   ├── services/           # API services
│   │   │   └── aiService.ts
│   │   ├── types/              # TypeScript типы
│   │   │   └── index.ts
│   │   ├── hooks/              # Custom hooks
│   │   ├── utils/              # Утилиты
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── vite-env.d.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── server/                      # Backend приложение
│   ├── src/
│   │   ├── routes/             # API routes
│   │   │   └── ai.routes.ts
│   │   ├── controllers/        # Controllers
│   │   │   └── ai.controller.ts
│   │   ├── services/           # Business logic
│   │   │   ├── openai.service.ts
│   │   │   ├── claude.service.ts
│   │   │   └── gemini.service.ts
│   │   ├── middleware/         # Middleware
│   │   │   ├── errorHandler.ts
│   │   │   └── rateLimiter.ts
│   │   ├── types/              # TypeScript типы
│   │   │   └── index.ts
│   │   ├── config/             # Конфигурация
│   │   │   └── aiProviders.ts
│   │   └── index.ts            # Entry point
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
├── package.json                 # Root package.json для workspace
├── plan.md                      # Этот файл
└── README.md

```

---

## Этапы разработки

### Этап 1: Инициализация проекта (Foundation)
**Цель:** Создать базовую структуру проекта

#### Задачи:
1. ✅ Создать `plan.md` с планом разработки
2. Создать корневой `package.json` для управления workspace
3. Создать папки `client/` и `server/`
4. Настроить `.gitignore`
5. Инициализировать git репозиторий

**Результат:** Готовая структура проекта для дальнейшей разработки

---

### Этап 2: Настройка Backend (Express API)
**Цель:** Создать REST API для взаимодействия с AI моделями

#### Задачи:
1. Инициализировать Node.js проект в `server/`
   ```bash
   cd server
   npm init -y
   ```

2. Установить зависимости:
   ```bash
   npm install express cors dotenv helmet axios
   npm install -D typescript @types/express @types/cors @types/node ts-node nodemon
   ```

3. Настроить TypeScript (`tsconfig.json`)

4. Создать базовую структуру:
   - `src/index.ts` - entry point с Express сервером
   - `src/routes/ai.routes.ts` - маршруты API
   - `src/controllers/ai.controller.ts` - обработчики запросов
   - `src/services/` - сервисы для каждого AI провайдера
   - `src/middleware/` - middleware (CORS, error handling, rate limiting)

5. Реализовать endpoints:
   - `POST /api/query` - основной endpoint для запросов к AI
     ```typescript
     // Request body:
     {
       "query": "Что такое TypeScript?",
       "providers": ["openai", "claude", "gemini"] // optional
     }

     // Response:
     {
       "results": [
         {
           "provider": "openai",
           "response": "...",
           "status": "success",
           "executionTime": 1234
         },
         // ...
       ]
     }
     ```
   - `GET /api/providers` - список доступных AI провайдеров
   - `GET /api/health` - health check

6. Интегрировать AI APIs:
   - OpenAI API (с использованием официального SDK или axios)
   - Anthropic Claude API
   - Google Gemini API
   - Реализовать параллельные запросы с `Promise.all()`

7. Настроить `.env` файл:
   ```env
   PORT=5000
   OPENAI_API_KEY=your_key
   ANTHROPIC_API_KEY=your_key
   GOOGLE_API_KEY=your_key
   ```

8. Добавить обработку ошибок и rate limiting

**Результат:** Полностью рабочий backend API

---

### Этап 3: Настройка Frontend (React Application)
**Цель:** Создать пользовательский интерфейс

#### Задачи:
1. Инициализировать React проект с Vite:
   ```bash
   npm create vite@latest client -- --template react-ts
   cd client
   ```

2. Установить зависимости:
   ```bash
   npm install @reduxjs/toolkit react-redux axios
   npm install -D tailwindcss postcss autoprefixer
   # или
   npm install @mui/material @emotion/react @emotion/styled
   ```

3. Настроить Tailwind CSS (или Material-UI)

4. Настроить Redux Toolkit:
   - Создать store (`src/store/index.ts`)
   - Создать slices:
     - `aiSlice.ts` - для хранения запросов и ответов AI
     - `uiSlice.ts` - для UI состояний (loading, errors)

5. Настроить Axios:
   - Создать `src/services/aiService.ts`
   - Настроить base URL и interceptors
   - Создать методы для API вызовов

6. Создать типы TypeScript (`src/types/index.ts`):
   ```typescript
   interface AIResponse {
     provider: string;
     response: string;
     status: 'success' | 'error';
     executionTime: number;
   }

   interface QueryRequest {
     query: string;
     providers?: string[];
   }
   ```

**Результат:** Настроенное React приложение с Redux и Axios

---

### Этап 4: Разработка UI компонентов
**Цель:** Создать интерфейс для взаимодействия с пользователем

#### Задачи:
1. **SearchInput компонент**
   - Поле ввода для запроса
   - Кнопка отправки
   - Валидация (минимальная длина запроса)
   - Чекбоксы для выбора AI провайдеров

2. **AIResponseCard компонент**
   - Отображение логотипа/названия AI
   - Текст ответа
   - Время выполнения
   - Состояния: loading, success, error
   - Возможность копирования ответа

3. **ResponsesGrid компонент**
   - Grid/Flex layout для карточек ответов
   - Адаптивный дизайн (desktop/tablet/mobile)
   - Анимации появления карточек

4. **LoadingSpinner компонент**
   - Индикатор загрузки для каждого AI
   - Skeleton loader (опционально)

5. **Дополнительные компоненты**:
   - Header с названием проекта
   - History sidebar - история запросов (localStorage)
   - Settings modal - настройки (температура, max tokens)
   - ErrorBoundary для обработки ошибок

**Результат:** Полный набор UI компонентов

---

### Этап 5: Интеграция Frontend + Backend
**Цель:** Связать клиент и сервер

#### Задачи:
1. Настроить CORS в Express:
   ```typescript
   app.use(cors({
     origin: 'http://localhost:5173' // Vite dev server
   }));
   ```

2. Настроить proxy в Vite (опционально):
   ```typescript
   // vite.config.ts
   server: {
     proxy: {
       '/api': 'http://localhost:5000'
     }
   }
   ```

3. Реализовать Redux Thunk для API вызовов:
   ```typescript
   export const fetchAIResponses = createAsyncThunk(
     'ai/fetchResponses',
     async (query: QueryRequest) => {
       const response = await aiService.query(query);
       return response.data;
     }
   );
   ```

4. Подключить компоненты к Redux store
   - useSelector для чтения state
   - useDispatch для dispatch actions

5. Обработка состояний:
   - Показать loading spinner во время запроса
   - Отобразить ответы по мере получения
   - Показать ошибки если запрос не удался

6. Добавить обработку параллельных запросов:
   - Отображать loading для каждого AI отдельно
   - Показывать ответы по мере готовности (не ждать всех)

**Результат:** Полностью рабочее приложение с интеграцией

---

### Этап 6: Дополнительные фичи
**Цель:** Улучшить пользовательский опыт

#### Задачи:
1. **История запросов**
   - Сохранение в localStorage
   - Список предыдущих запросов
   - Возможность повторить запрос

2. **Экспорт результатов**
   - Экспорт в JSON
   - Экспорт в текстовый файл
   - Копирование всех ответов

3. **Настройки**
   - Выбор конкретных AI провайдеров
   - Параметры генерации (temperature, max_tokens)
   - Темная/светлая тема

4. **Streaming responses** (advanced)
   - Server-Sent Events (SSE) для real-time ответов
   - Постепенное отображение текста

5. **Сравнение ответов**
   - Side-by-side view
   - Highlight различий

**Результат:** Богатый функционал приложения

---

### Этап 7: Оптимизация и тестирование
**Цель:** Улучшить производительность и стабильность

#### Задачи:
1. **Оптимизация производительности**
   - React.memo для компонентов
   - useMemo/useCallback где необходимо
   - Lazy loading компонентов
   - Debounce для поиска

2. **Error handling**
   - Graceful degradation если AI недоступен
   - Retry механизм
   - Информативные сообщения об ошибках

3. **Безопасность**
   - Rate limiting на backend
   - Input sanitization
   - HTTPS в продакшене

4. **Тестирование** (опционально)
   - Unit тесты для utils
   - Integration тесты для API
   - E2E тесты с Playwright/Cypress

**Результат:** Оптимизированное и стабильное приложение

---

### Этап 8: Деплой
**Цель:** Развернуть приложение в продакшене

#### Задачи:
1. **Backend деплой**
   - Railway / Render / Heroku
   - Настроить environment variables
   - Настроить logging (Winston/Morgan)

2. **Frontend деплой**
   - Vercel / Netlify
   - Настроить build scripts
   - Настроить environment variables для API URL

3. **Дополнительно**
   - Настроить custom domain
   - SSL сертификаты
   - Monitoring (Sentry, LogRocket)

**Результат:** Развернутое приложение доступное онлайн

---

## Скрипты для разработки

### Root package.json scripts:
```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:server\" \"npm run dev:client\"",
    "dev:server": "cd server && npm run dev",
    "dev:client": "cd client && npm run dev",
    "install:all": "npm install && cd server && npm install && cd ../client && npm install"
  }
}
```

### Server package.json scripts:
```json
{
  "scripts": {
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

### Client package.json scripts:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

---

## API Endpoints Specification

### POST /api/query
Отправляет запрос к выбранным AI провайдерам

**Request:**
```json
{
  "query": "Объясни квантовую физику простыми словами",
  "providers": ["openai", "claude", "gemini"],
  "options": {
    "temperature": 0.7,
    "maxTokens": 500
  }
}
```

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "provider": "openai",
      "model": "gpt-4",
      "response": "Квантовая физика - это...",
      "status": "success",
      "executionTime": 1234,
      "tokensUsed": 150
    },
    {
      "provider": "claude",
      "model": "claude-3-sonnet",
      "response": "Квантовая физика изучает...",
      "status": "success",
      "executionTime": 1456,
      "tokensUsed": 180
    },
    {
      "provider": "gemini",
      "model": "gemini-pro",
      "response": null,
      "status": "error",
      "error": "API rate limit exceeded",
      "executionTime": 234
    }
  ],
  "totalExecutionTime": 2924
}
```

### GET /api/providers
Получает список доступных AI провайдеров

**Response:**
```json
{
  "providers": [
    {
      "id": "openai",
      "name": "OpenAI GPT",
      "models": ["gpt-4", "gpt-3.5-turbo"],
      "available": true
    },
    {
      "id": "claude",
      "name": "Anthropic Claude",
      "models": ["claude-3-opus", "claude-3-sonnet"],
      "available": true
    },
    {
      "id": "gemini",
      "name": "Google Gemini",
      "models": ["gemini-pro", "gemini-pro-vision"],
      "available": false,
      "reason": "API key not configured"
    }
  ]
}
```

### GET /api/health
Health check endpoint

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-09-30T10:54:00Z",
  "uptime": 3600
}
```

---

## Environment Variables

### Server (.env)
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# AI API Keys
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=AIza...

# Optional
MISTRAL_API_KEY=...
COHERE_API_KEY=...

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Client (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## Потенциальные улучшения

### Фаза 1 (MVP+)
- ✅ Базовый функционал поиска
- ✅ Несколько AI провайдеров
- История запросов
- Экспорт результатов

### Фаза 2 (Advanced)
- Streaming responses в реальном времени
- Аутентификация пользователей
- Персональные настройки
- Сохранение избранных ответов
- Статистика использования

### Фаза 3 (Pro)
- Сравнение качества ответов AI
- Voting система (какой ответ лучше)
- Collaborative features (шаринг результатов)
- Расширенная аналитика
- Кастомные AI модели (fine-tuned)

---

## Примерные сроки разработки

| Этап | Время | Описание |
|------|-------|----------|
| Этап 1 | 1-2 часа | Инициализация проекта |
| Этап 2 | 4-6 часов | Backend разработка |
| Этап 3 | 2-3 часа | Frontend setup |
| Этап 4 | 6-8 часов | UI компоненты |
| Этап 5 | 3-4 часа | Интеграция |
| Этап 6 | 4-6 часов | Дополнительные фичи |
| Этап 7 | 3-5 часов | Оптимизация |
| Этап 8 | 2-3 часа | Деплой |
| **Всего** | **25-37 часов** | Полный MVP |

---

## Полезные ресурсы

### Документация API
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Anthropic Claude API](https://docs.anthropic.com/)
- [Google Gemini API](https://ai.google.dev/docs)

### Технологии
- [Express.js](https://expressjs.com/)
- [React](https://react.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Axios](https://axios-http.com/)

---

## Примечания
- Все API ключи должны храниться в `.env` файлах и НЕ коммититься в git
- Рекомендуется использовать TypeScript для type safety
- Следует реализовать rate limiting чтобы избежать превышения лимитов AI APIs
- Рассмотреть кэширование частых запросов для оптимизации