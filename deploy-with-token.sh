#!/bin/bash

# 🚀 Скрипт автоматизации GitHub-деплоя с токеном
# Автор: Groman Concierge
# Версия: 1.0.0

set -e  # Остановка при ошибке

# Цвета для логирования
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция логирования
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Функция очистки при выходе
cleanup() {
    log "Очистка временных данных..."
    if [ -n "$ORIGINAL_ORIGIN" ]; then
        git remote set-url origin "$ORIGINAL_ORIGIN" 2>/dev/null || true
        log "Origin восстановлен"
    fi
}

# Установка обработчика сигналов
trap cleanup EXIT INT TERM

# 1. Проверка токена
log "Проверка токена GitHub..."
TOKEN_FILE="$HOME/.gh_token_cursor.txt"

if [ ! -f "$TOKEN_FILE" ]; then
    error "Файл токена не найден: $TOKEN_FILE"
    error "Создайте файл с токеном GitHub: echo 'your_token' > $TOKEN_FILE"
    exit 1
fi

TOKEN=$(cat "$TOKEN_FILE" | tr -d '\n\r')
if [ -z "$TOKEN" ]; then
    error "Токен пустой или нечитаемый"
    exit 1
fi

success "Токен найден и валиден"

# 2. Конфигурация Git
log "Настройка Git конфигурации..."
git config --global user.name "Groman Concierge" 2>/dev/null || warning "Не удалось установить user.name"
git config --global user.email "info@gromman.com" 2>/dev/null || warning "Не удалось установить user.email"

success "Git конфигурация настроена"

# 3. Сохранение оригинального origin
ORIGINAL_ORIGIN=$(git remote get-url origin 2>/dev/null || echo "")
log "Текущий origin: $ORIGINAL_ORIGIN"

# 4. Подключение токена
log "Подключение токена к origin..."
git remote set-url origin "https://${TOKEN}@github.com/serviswork/gromman-logos.git"
success "Токен подключен к origin"

# 5. Проверка статуса репозитория
log "Проверка статуса репозитория..."
if [ -n "$(git status --porcelain)" ]; then
    warning "Есть незакоммиченные изменения"
    git status --short
fi

# 6. Создание/переключение на ветку developer-max
log "Работа с веткой developer-max..."
if git show-ref --verify --quiet refs/heads/developer-max; then
    log "Ветка developer-max существует, переключаемся..."
    git checkout developer-max
else
    log "Создание новой ветки developer-max..."
    git checkout -b developer-max
fi

# 7. Push в ветку developer-max
log "Push в ветку developer-max..."
if git push origin developer-max; then
    success "Ветка developer-max успешно запушена"
else
    error "Ошибка при push в developer-max"
    exit 1
fi

# 8. Очистка токена (выполнится автоматически через trap)
log "Деплой завершен успешно!"
success "Все операции выполнены без ошибок"

# 9. Информация о созданной ветке
log "Информация о ветке:"
echo "  - Ветка: developer-max"
echo "  - URL: https://github.com/serviswork/gromman-logos/tree/developer-max"
echo "  - Pull Request: https://github.com/serviswork/gromman-logos/pull/new/developer-max" 