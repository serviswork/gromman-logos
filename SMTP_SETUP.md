# Настройка SMTP Zoho для формы Groman Concierge

## 📋 Требования

- Node.js 16+ 
- Zoho Mail аккаунт (info@gromman.com)
- App Password для Zoho

## 🔧 Настройка Zoho App Password

1. Войдите в [Zoho Mail](https://mail.zoho.com)
2. Перейдите в **Settings** → **Mail Accounts**
3. Выберите аккаунт info@gromman.com
4. Перейдите в **Security** → **App Passwords**
5. Создайте новый App Password:
   - Название: `Gromman Concierge Form`
   - Скопируйте сгенерированный пароль

## ⚙️ Настройка переменных окружения

1. Скопируйте `env.example` в `.env`:
```bash
cp env.example .env
```

2. Отредактируйте `.env`:
```env
# SMTP Configuration for Zoho
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_USER=info@gromman.com
SMTP_PASSWORD=your_app_password_here
EMAIL_RECEIVER=info@gromman.com

# Server Configuration
PORT=3000
NODE_ENV=development
```

3. Замените `your_app_password_here` на реальный App Password из Zoho

## 🚀 Запуск сервера

1. Установите зависимости:
```bash
npm install
```

2. Запустите сервер:
```bash
# Development
npm run dev

# Production
npm start
```

## 📧 Тестирование отправки

1. Откройте http://localhost:3000/join
2. Заполните форму
3. Отправьте заявку
4. Проверьте почту info@gromman.com

## 🔍 Логирование

Сервер выводит подробные логи:

- `[CONFIG OK]` - конфигурация загружена
- `[SMTP OK]` - SMTP подключение успешно
- `[EMAIL OK]` - письмо отправлено
- `[EMAIL ERROR]` - ошибка отправки
- `[VALIDATION ERROR]` - ошибка валидации

## 🛡️ Безопасность

- Пароль никогда не логируется
- Rate limiting: 5 запросов за 15 минут
- Валидация всех полей формы
- CORS настроен только для разрешенных доменов

## 📁 Структура проекта

```
├── server.js          # Основной сервер
├── form_handler.js    # Обработчик формы
├── join.html          # Страница формы
├── package.json       # Зависимости
├── .env              # Переменные окружения
└── SMTP_SETUP.md     # Эта инструкция
```

## 🚨 Устранение неполадок

### Ошибка "Missing required environment variables"
- Проверьте файл `.env`
- Убедитесь, что все переменные заполнены

### Ошибка "Authentication failed"
- Проверьте App Password в Zoho
- Убедитесь, что используется App Password, а не основной пароль

### Ошибка "Connection timeout"
- Проверьте интернет-соединение
- Убедитесь, что порт 587 не заблокирован

### Письма не приходят
- Проверьте папку Spam
- Убедитесь, что SMTP_USER и EMAIL_RECEIVER совпадают
- Проверьте логи сервера на ошибки 