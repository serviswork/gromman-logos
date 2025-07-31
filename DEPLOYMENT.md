# 🚀 Инструкция по деплою SMTP-сервера

## Платформы для деплоя

### 1. Railway (Рекомендуется)
```bash
# Установка Railway CLI
npm install -g @railway/cli

# Логин
railway login

# Инициализация проекта
railway init

# Настройка переменных окружения
railway variables set SMTP_HOST=smtp.zoho.com
railway variables set SMTP_PORT=587
railway variables set SMTP_USER=info@gromman.com
railway variables set SMTP_PASSWORD=your_app_password
railway variables set EMAIL_RECEIVER=info@gromman.com

# Деплой
railway up
```

### 2. Render
1. Создайте аккаунт на [render.com](https://render.com)
2. Подключите GitHub репозиторий
3. Создайте Web Service
4. Настройте переменные окружения в Dashboard
5. Деплой произойдет автоматически

### 3. Fly.io
```bash
# Установка Fly CLI
curl -L https://fly.io/install.sh | sh

# Логин
fly auth login

# Создание приложения
fly launch

# Настройка переменных
fly secrets set SMTP_HOST=smtp.zoho.com
fly secrets set SMTP_PORT=587
fly secrets set SMTP_USER=info@gromman.com
fly secrets set SMTP_PASSWORD=your_app_password
fly secrets set EMAIL_RECEIVER=info@gromman.com

# Деплой
fly deploy
```

### 4. Heroku
```bash
# Установка Heroku CLI
# Создание приложения
heroku create gromman-smtp

# Настройка переменных
heroku config:set SMTP_HOST=smtp.zoho.com
heroku config:set SMTP_PORT=587
heroku config:set SMTP_USER=info@gromman.com
heroku config:set SMTP_PASSWORD=your_app_password
heroku config:set EMAIL_RECEIVER=info@gromman.com

# Деплой
git push heroku main
```

## Переменные окружения

Обязательные переменные для всех платформ:
- `SMTP_HOST=smtp.zoho.com`
- `SMTP_PORT=587`
- `SMTP_USER=info@gromman.com`
- `SMTP_PASSWORD=your_app_password`
- `EMAIL_RECEIVER=info@gromman.com`
- `NODE_ENV=production`

## Проверка работы

После деплоя проверьте:
1. `https://your-app.railway.app/api/health` - статус сервера
2. `https://your-app.railway.app/test-smtp` - тестовая страница
3. Отправка тестового письма через форму

## Мониторинг

- Логи: `railway logs` / `fly logs` / `heroku logs --tail`
- Статус: `railway status` / `fly status` / `heroku ps`
- Перезапуск: `railway restart` / `fly restart` / `heroku restart` 