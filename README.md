# AI Multi-Search 🤖

Веб-приложение для одновременного получения ответов от нескольких AI моделей (OpenAI, Claude, Gemini).

## 🚀 Технологии

### Backend
- Express.js + TypeScript
- Axios для запросов к AI APIs
- CORS, Helmet, Dotenv

### Frontend
- React 18 + TypeScript
- Redux Toolkit для state management
- Axios для HTTP запросов
- Vite как build tool

## 📦 Установка

### 1. Установить зависимости

В корневой директории:
```bash
npm install
```

Затем установить зависимости для клиента и сервера:
```bash
npm run install:all
```

Или по отдельности:
```bash
cd server && npm install
cd ../client && npm install
```

### 2. Настроить API ключи

Создайте файл `.env` в папке `server/`:

```bash
cd server
cp .env.example .env
```

Отредактируйте `server/.env` и добавьте ваши API ключи:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# AI API Keys
OPENAI_API_KEY=sk-your-openai-key-here
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here
GOOGLE_API_KEY=your-google-api-key-here
```

### 3. Настроить клиент (опционально)

Файл `client/.env` уже создан с настройками по умолчанию. При необходимости измените:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## ▶️ Запуск

### Запустить оба приложения одновременно (рекомендуется):

```bash
npm run dev
```

Это запустит:
- Backend на http://localhost:5000
- Frontend на http://localhost:5173

### Или запустить раздельно:

**Backend:**
```bash
npm run dev:server
# или
cd server && npm run dev
```

**Frontend:**
```bash
npm run dev:client
# или
cd client && npm run dev
```

## 🏗️ Структура проекта

```
react-ai-searching/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/    # React компоненты
│   │   ├── store/        # Redux store & slices
│   │   ├── services/     # API services
│   │   ├── types/        # TypeScript типы
│   │   ├── hooks/        # Custom hooks
│   │   └── App.tsx
│   └── package.json
│
├── server/                 # Express Backend
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── controllers/  # Controllers
│   │   ├── services/     # AI services
│   │   ├── middleware/   # Middleware
│   │   ├── config/       # Configuration
│   │   └── types/        # TypeScript типы
│   └── package.json
│
├── plan.md                # План разработки
└── README.md             # Этот файл
```

## 📡 API Endpoints

### POST `/api/query`
Отправить запрос к AI моделям

**Request:**
```json
{
  "query": "Что такое TypeScript?",
  "providers": ["openai", "claude", "gemini"]
}
```

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "provider": "openai",
      "model": "gpt-3.5-turbo",
      "response": "TypeScript это...",
      "status": "success",
      "executionTime": 1234
    }
  ],
  "totalExecutionTime": 2456
}
```

### GET `/api/providers`
Получить список доступных AI провайдеров

### GET `/api/health`
Health check endpoint

## 🎯 Функционал

- ✅ Одновременный запрос к нескольким AI моделям
- ✅ Выбор конкретных AI провайдеров
- ✅ Отображение времени выполнения для каждого ответа
- ✅ Копирование ответов в буфер обмена
- ✅ Обработка ошибок для каждого провайдера отдельно
- ✅ Адаптивный дизайн

## 🔧 Сборка для продакшена

### Backend:
```bash
cd server
npm run build
npm start
```

### Frontend:
```bash
cd client
npm run build
```

Собранные файлы будут в `client/dist/`

## 📝 Получение API ключей

### OpenAI
1. Зарегистрируйтесь на https://platform.openai.com/
2. Создайте API ключ в разделе API Keys
3. Добавьте в `.env` как `OPENAI_API_KEY`

### Anthropic Claude
1. Зарегистрируйтесь на https://console.anthropic.com/
2. Создайте API ключ
3. Добавьте в `.env` как `ANTHROPIC_API_KEY`

### Google Gemini
1. Зарегистрируйтесь на https://makersuite.google.com/
2. Создайте API ключ
3. Добавьте в `.env` как `GOOGLE_API_KEY`

## ⚠️ Примечание

Не забудьте добавить `.env` файлы в `.gitignore` (уже добавлено). Никогда не коммитьте API ключи в репозиторий!

## 📄 Лицензия

MIT# tipai
