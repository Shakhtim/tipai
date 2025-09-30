# TipAI.ru 🤖

Веб-платформа для одновременного сравнения ответов от нескольких AI моделей. Получите ответы от YandexGPT, GigaChat, Kandinsky и других AI сервисов в одном месте.

## 🌟 Особенности

- **Мультизапрос**: Отправьте один запрос сразу к нескольким AI моделям
- **Контекстный диалог**: Продолжайте беседу, задавая уточняющие вопросы
- **Темная/светлая тема**: Переключение темы с плавной анимацией
- **Сравнение производительности**: Время выполнения каждого запроса
- **Адаптивный дизайн**: Компактные карточки с результатами

## 🚀 Технологический стек

### Backend
- Express.js + TypeScript
- Yandex Cloud IAM аутентификация
- REST API
- CORS, Helmet, Dotenv

### Frontend
- React 18 + TypeScript + Vite
- React Router для навигации
- Redux Toolkit (state management)
- CSS Variables для тем

## 📦 Установка

### 1. Клонировать репозиторий
```bash
git clone https://github.com/Shakhtim/tipai.git
cd tipai
```

### 2. Установить зависимости

В корневой директории:
```bash
npm install
```

Установить для клиента и сервера:
```bash
npm run install:all
```

Или по отдельности:
```bash
cd server && npm install
cd ../client && npm install
```

### 3. Настроить переменные окружения

Создайте файл `.env` в папке `server/`:

```bash
cd server
cp .env.example .env
```

Отредактируйте `server/.env`:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Yandex Cloud
YANDEX_IAM_TOKEN=your-iam-token-here
YANDEX_FOLDER_ID=your-folder-id-here

# Другие AI провайдеры (опционально)
GIGACHAT_API_KEY=your-gigachat-key
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
```

### 4. Получение Yandex Cloud IAM токена

Для работы с YandexGPT необходим IAM токен. Используйте скрипт:

```bash
cd server
node get-iam-token.js
```

Скрипт требует:
- Service Account ID
- Key ID
- Private Key (из authorized_key.json)

IAM токен действителен 12 часов.

## ▶️ Запуск

### Запустить оба сервиса:

```bash
npm run dev
```

Это запустит:
- Backend: http://localhost:5000
- Frontend: http://localhost:5173

### Или раздельно:

**Backend:**
```bash
npm run dev:server
```

**Frontend:**
```bash
npm run dev:client
```

## 🏗️ Структура проекта

```
tipai/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/    # ThemeToggle
│   │   ├── pages/        # HomePage, ResultsPage
│   │   ├── styles/       # CSS модули
│   │   ├── store/        # Redux store
│   │   └── App.tsx
│   └── package.json
│
├── server/                 # Express Backend
│   ├── src/
│   │   ├── routes/       # API маршруты
│   │   ├── controllers/  # Логика обработки
│   │   ├── services/     # AI сервисы
│   │   │   ├── yandexgpt.service.ts
│   │   │   ├── gigachat.service.ts
│   │   │   ├── kandinsky.service.ts
│   │   │   ├── openai.service.ts
│   │   │   └── claude.service.ts
│   │   ├── config/       # Конфигурация
│   │   └── types/        # TypeScript типы
│   ├── get-iam-token.js  # Скрипт для получения IAM
│   └── package.json
│
└── README.md
```

## 📡 API Endpoints

### `POST /api/query`
Отправить запрос к AI моделям

**Request:**
```json
{
  "query": "Напиши функцию на Python для сортировки массива",
  "providers": ["yandexgpt", "gigachat", "openai"]
}
```

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "provider": "YandexGPT",
      "model": "yandexgpt-lite",
      "response": "def sort_array(arr):\n    return sorted(arr)",
      "status": "success",
      "executionTime": 1234
    }
  ]
}
```

### `GET /api/providers`
Получить список доступных AI провайдеров и их статус

### `GET /api/health`
Health check endpoint

## 🎯 Поддерживаемые AI сервисы

- ✅ **YandexGPT** - yandexgpt-lite, yandexgpt
- ⏳ **GigaChat** - русскоязычная модель от Sber
- ⏳ **Kandinsky** - генерация изображений
- ⏳ **ChatGPT RU** - локализованная версия
- ⏳ **OpenAI** - GPT-4, GPT-3.5
- ⏳ **Claude** - Claude 3 Sonnet

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

## 🔐 Настройка Yandex Cloud

### Создание Service Account

1. Перейдите в [Yandex Cloud Console](https://console.cloud.yandex.ru/)
2. Выберите облако и создайте Service Account
3. Назначьте роль `ai.languageModels.user` на уровне **организации**
4. Создайте Authorized Key (JSON)
5. Используйте `get-iam-token.js` для генерации IAM токена

### Важно
- Роль должна быть назначена на уровне **организации**, а не облака/каталога
- API ключи "запоминают" права на момент создания - используйте IAM токены
- IAM токен действителен 12 часов, после нужно обновить

## ⚠️ Безопасность

- ✅ `.env` файлы в `.gitignore`
- ✅ Никогда не коммитьте API ключи
- ✅ IAM токены имеют ограниченный срок действия
- ✅ CORS настроен только для localhost

## 📄 Лицензия

MIT

---

**TipAI.ru** © 2025 | Лучшие AI модели для ваших задач