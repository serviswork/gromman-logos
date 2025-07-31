# 🔧 Настройка Cloudflare Tunnel для Production

## Проблема
Форма на сайте `https://gromman.com/join.html` не может отправить данные, потому что backend-сервер работает локально, а не доступен из интернета.

## Решение: Cloudflare Tunnel

### 1. Создание именованного туннеля

```bash
# Создать туннель
cloudflared tunnel create gromman-api

# Настроить DNS
cloudflared tunnel route dns gromman-api api.gromman.com
```

### 2. Конфигурация туннеля

Создать файл `~/.cloudflared/config.yml`:

```yaml
tunnel: 3ceffad9-bfcc-471c-864b-8e36a1dac6ca
credentials-file: /Users/gennadii/.cloudflared/3ceffad9-bfcc-471c-864b-8e36a1dac6ca.json

ingress:
  - hostname: api.gromman.com
    service: http://localhost:3000
  - service: http_status:404
```

### 3. Запуск туннеля

```bash
# Запустить туннель
cloudflared tunnel run gromman-api

# Проверить статус
cloudflared tunnel list
```

### 4. Обновление формы

В файле `join.html` изменить URL:

```javascript
// Заменить:
const response = await fetch('http://localhost:3000/api/submit-form', {

// На:
const response = await fetch('https://api.gromman.com/api/submit-form', {
```

### 5. Проверка работы

```bash
# Проверить API
curl -s https://api.gromman.com/api/health

# Протестировать форму
curl -X POST https://api.gromman.com/api/submit-form \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","role":"cto","message":"Test"}'
```

## Текущий статус

- ✅ **Backend сервер:** Работает на localhost:3000
- ✅ **PM2:** Настроен для автозапуска
- ✅ **SMTP:** Настроен для отправки писем
- ❌ **Cloudflare Tunnel:** Требует настройки DNS
- ❌ **Production API:** Не доступен из интернета

## Временное решение

Для тестирования на iPhone можно:

1. Использовать временный туннель:
   ```bash
   cloudflared tunnel --url http://localhost:3000
   ```

2. Получить URL и обновить форму:
   ```javascript
   const response = await fetch('https://temporary-url.trycloudflare.com/api/submit-form', {
   ```

## Следующие шаги

1. Настроить DNS запись для `api.gromman.com`
2. Запустить именованный туннель
3. Обновить форму с production URL
4. Протестировать на iPhone 