# TipAI.ru Deployment Guide

Автоматические скрипты для деплоя проекта на production сервер.

## 📁 Скрипты деплоя

### 🎨 Frontend Only (`front-deploy.sh`)
Деплоит только фронтенд (React приложение):
```bash
./front-deploy.sh
```

**Что делает:**
- Подтягивает изменения из GitHub
- Устанавливает зависимости (`npm install`)
- Собирает production build (`npm run build`)
- Перезагружает Nginx

**Когда использовать:**
- Изменения только в UI/UX
- Правки стилей, компонентов, страниц
- Не требуется перезапуск backend

---

### 🔧 Backend Only (`back-deploy.sh`)
Деплоит только бэкенд (Node.js API):
```bash
./back-deploy.sh
```

**Что делает:**
- Подтягивает изменения из GitHub
- Устанавливает зависимости (`npm install`)
- Собирает TypeScript (`npm run build`)
- Перезапускает PM2 процесс с обновлением env
- Показывает статус и последние логи

**Когда использовать:**
- Изменения в API endpoints
- Обновление сервисов (YandexGPT, GigaChat и т.д.)
- Изменения в бизнес-логике
- Обновление .env переменных

---

### 🚀 Full Deploy (`deploy.sh`)
Полный деплой frontend + backend:
```bash
./deploy.sh
```

**Что делает:**
- Подтягивает изменения из GitHub
- Деплоит backend (build + PM2 restart)
- Деплоит frontend (build + Nginx reload)
- Показывает финальный статус обоих сервисов

**Когда использовать:**
- Большие обновления с изменениями в frontend и backend
- После крупных feature релизов
- Когда не уверены что именно изменилось

---

## 🔧 Первоначальная настройка

### 1. Сделать скрипты исполняемыми
На сервере выполните:
```bash
cd /var/www/tipai
chmod +x front-deploy.sh back-deploy.sh deploy.sh
```

### 2. Проверить наличие необходимых инструментов
```bash
# Node.js и npm
node --version  # должно быть v20+
npm --version

# PM2
pm2 --version

# Nginx
nginx -v

# Git
git --version
```

### 3. Убедиться что PM2 процесс называется tipai-backend
```bash
pm2 list
# Должно быть: tipai-backend
```

Если процесс называется по-другому, обновите название в `back-deploy.sh` и `deploy.sh`.

---

## 📋 Примеры использования

### Сценарий 1: Правки в UI (только стили/компоненты)
```bash
cd /var/www/tipai
./front-deploy.sh
```

### Сценарий 2: Обновление API логики
```bash
cd /var/www/tipai
./back-deploy.sh
```

### Сценарий 3: Комплексное обновление
```bash
cd /var/www/tipai
./deploy.sh
```

---

## 🐛 Troubleshooting

### Ошибка: "Permission denied"
```bash
chmod +x *.sh
```

### Ошибка: PM2 процесс не найден
```bash
# Проверить имя процесса
pm2 list

# Если нужно, обновить имя в скриптах
nano back-deploy.sh  # изменить tipai-backend на правильное имя
```

### Ошибка: Nginx reload failed
```bash
# Проверить конфигурацию
sudo nginx -t

# Посмотреть логи
sudo tail -f /var/log/nginx/error.log
```

### Ошибка: npm install failed
```bash
# Очистить кеш и node_modules
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 Мониторинг после деплоя

### Логи Backend
```bash
# Смотреть в реальном времени
pm2 logs tipai-backend

# Последние 50 строк
pm2 logs tipai-backend --lines 50

# Только ошибки
pm2 logs tipai-backend --err
```

### Статус сервисов
```bash
# PM2
pm2 status

# Nginx
sudo systemctl status nginx

# Использование ресурсов
pm2 monit
```

### Проверка работоспособности
```bash
# Проверить backend API
curl http://localhost:5000/api/health

# Проверить frontend
curl -I https://tipai.ru
```

---

## 🔐 Безопасность

⚠️ **Важно:**
- Скрипты используют `sudo` для Nginx - убедитесь что у пользователя есть права
- `authorized_key.json` должен быть в `.gitignore` (уже добавлен)
- `.env` файлы не попадают в git (уже в `.gitignore`)

---

## 📝 Структура проекта

```
/var/www/tipai/
├── front-deploy.sh      # Деплой фронтенда
├── back-deploy.sh       # Деплой бэкенда
├── deploy.sh            # Полный деплой
├── DEPLOY.md            # Эта документация
├── client/              # React приложение
│   ├── src/
│   ├── dist/            # Production build
│   └── package.json
└── server/              # Node.js API
    ├── src/
    ├── dist/            # Compiled TypeScript
    ├── .env             # Environment variables
    └── package.json
```

---

## 🎯 Best Practices

1. **Всегда делайте git pull перед изменениями на сервере**
2. **Проверяйте логи после деплоя** (`pm2 logs`)
3. **Тестируйте на localhost перед деплоем на production**
4. **Делайте резервные копии .env файлов**
5. **Используйте `front-deploy.sh` для быстрых UI правок**

---

## 🆘 Помощь

Если что-то пошло не так:

1. Проверьте логи: `pm2 logs tipai-backend`
2. Проверьте статус: `pm2 status`
3. Проверьте Nginx: `sudo nginx -t`
4. Откатитесь на предыдущий коммит: `git reset --hard HEAD~1`
5. Перезапустите все: `./deploy.sh`

---

**Последнее обновление:** 2025-10-02
**Версия:** 1.0.0
