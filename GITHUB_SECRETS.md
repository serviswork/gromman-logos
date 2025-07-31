# 🔐 Настройка GitHub Secrets для деплоя

## Проблема
GitHub Actions workflow показывает ошибки:
- `Context access might be invalid: RAILWAY_TOKEN`
- `Context access might be invalid: RENDER_SERVICE_ID`
- `Context access might be invalid: RENDER_API_KEY`
- `Context access might be invalid: FLY_API_TOKEN`

## Решение

### Вариант 1: Настройка секретов (если планируете деплой)

1. Перейдите в репозиторий: https://github.com/serviswork/gromman-logos
2. Нажмите **Settings** → **Secrets and variables** → **Actions**
3. Нажмите **New repository secret**
4. Добавьте секреты:

```
RAILWAY_TOKEN=your_railway_token
RENDER_SERVICE_ID=your_render_service_id
RENDER_API_KEY=your_render_api_key
FLY_API_TOKEN=your_fly_api_token
```

### Вариант 2: Использование только тестирования (рекомендуется)

Текущий workflow `deploy.yml` настроен только на тестирование и не требует секретов.

## Текущий статус

✅ **Основной workflow работает без секретов:**
- Тестирование на Node.js 18.x и 20.x
- Проверка зависимостей
- Проверка запуска сервера
- Аудит безопасности
- Проверка на утечку секретов

❌ **Деплой на внешние платформы отключен:**
- Railway
- Render
- Fly.io

## Ручной деплой

Для деплоя используйте инструкцию в `DEPLOYMENT.md`:

```bash
# Railway
npm install -g @railway/cli
railway login
railway init
railway up

# Render
# Создайте Web Service на render.com

# Fly.io
curl -L https://fly.io/install.sh | sh
fly auth login
fly launch
fly deploy
```

## Проверка workflow

После push в `main` или `developer-max`:
1. Перейдите в **Actions** в GitHub
2. Убедитесь, что workflow `Test and Build` проходит успешно
3. Проверьте логи на наличие ошибок 