#!/bin/bash

# ============================================================================
# Yandex Metrika Troubleshooting Script
# ============================================================================
# This script helps diagnose why Metrika ID is not loading in the container
#
# Usage: sudo ./check-metrika.sh
# ============================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }

echo ""
print_info "🔍 Проверка Yandex Metrika ID в контейнере"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Определяем директорию проекта
if [ -d "/opt/telegram-bots-platform/bots/bg-site" ]; then
    PROJECT_DIR="/opt/telegram-bots-platform/bots/bg-site"
elif [ -d "/opt/bg-remove-site" ]; then
    PROJECT_DIR="/opt/bg-remove-site"
else
    PROJECT_DIR=$(pwd)
fi

print_info "Директория проекта: $PROJECT_DIR"
cd "$PROJECT_DIR"

echo ""
print_info "1️⃣  Проверка .env файла"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f ".env" ]; then
    print_success ".env файл найден"

    # Проверяем наличие Metrika ID в .env
    if grep -q "NEXT_PUBLIC_YANDEX_METRIKA_ID" .env; then
        METRIKA_VALUE=$(grep "NEXT_PUBLIC_YANDEX_METRIKA_ID" .env | cut -d'=' -f2)

        if [ -z "$METRIKA_VALUE" ]; then
            print_error "NEXT_PUBLIC_YANDEX_METRIKA_ID найден, но значение пустое!"
            echo "  Файл: .env"
            echo "  Строка: $(grep "NEXT_PUBLIC_YANDEX_METRIKA_ID" .env)"
        else
            print_success "NEXT_PUBLIC_YANDEX_METRIKA_ID = $METRIKA_VALUE"
        fi
    else
        print_error "NEXT_PUBLIC_YANDEX_METRIKA_ID не найден в .env!"
        echo ""
        print_info "Содержимое .env:"
        cat .env
    fi
else
    print_error ".env файл не найден в $PROJECT_DIR"
    exit 1
fi

echo ""
print_info "2️⃣  Проверка переменной окружения в контейнере"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Находим имя контейнера
CONTAINER_NAME=$(docker-compose ps -q 2>/dev/null | head -n1)

if [ -z "$CONTAINER_NAME" ]; then
    print_error "Контейнер не запущен!"
    print_info "Запустите контейнер: docker-compose up -d"
    exit 1
fi

CONTAINER_NAME=$(docker ps --format "{{.Names}}" | grep -E "(bg-site|bg_site)" | head -n1)
print_info "Контейнер: $CONTAINER_NAME"

# Проверяем переменную в контейнере
CONTAINER_METRIKA=$(docker exec "$CONTAINER_NAME" printenv NEXT_PUBLIC_YANDEX_METRIKA_ID 2>/dev/null || echo "")

if [ -z "$CONTAINER_METRIKA" ]; then
    print_error "NEXT_PUBLIC_YANDEX_METRIKA_ID НЕ НАЙДЕНА в контейнере!"
    echo ""
    print_warning "Проблема: Переменная не передана в контейнер"
    echo ""
    print_info "Решение:"
    echo "  1. Проверьте docker-compose.yml:"
    echo "     environment:"
    echo "       - NEXT_PUBLIC_YANDEX_METRIKA_ID=\${NEXT_PUBLIC_YANDEX_METRIKA_ID}"
    echo ""
    echo "  2. Перезапустите контейнер:"
    echo "     cd $PROJECT_DIR"
    echo "     docker-compose down"
    echo "     docker-compose up -d"
    echo ""
else
    print_success "NEXT_PUBLIC_YANDEX_METRIKA_ID в контейнере = $CONTAINER_METRIKA"
fi

echo ""
print_info "3️⃣  Проверка всех переменных окружения в контейнере"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

print_info "Все NEXT_PUBLIC_* переменные:"
docker exec "$CONTAINER_NAME" printenv | grep "NEXT_PUBLIC" || print_warning "Нет NEXT_PUBLIC_* переменных!"

echo ""
print_info "4️⃣  Сравнение значений"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "  .env файл:  $METRIKA_VALUE"
echo "  Контейнер:  $CONTAINER_METRIKA"

if [ "$METRIKA_VALUE" = "$CONTAINER_METRIKA" ]; then
    print_success "Значения совпадают!"
else
    print_error "Значения НЕ совпадают!"
    echo ""
    print_warning "Необходимо перезапустить контейнер:"
    echo "  cd $PROJECT_DIR"
    echo "  docker-compose restart"
fi

echo ""
print_info "5️⃣  Проверка логов контейнера"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

print_info "Последние 20 строк логов:"
docker logs "$CONTAINER_NAME" --tail=20

echo ""
print_info "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
print_info "📋 Резюме"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ ! -z "$CONTAINER_METRIKA" ] && [ "$METRIKA_VALUE" = "$CONTAINER_METRIKA" ]; then
    print_success "✅ Всё настроено правильно!"
    echo ""
    print_info "Если в браузере всё ещё не работает:"
    echo "  1. Очистите кеш браузера (Ctrl+F5)"
    echo "  2. Откройте консоль браузера (F12)"
    echo "  3. Проверьте переменную: window.__METRIKA_ID__"
    echo "  4. Проверьте что Metrika загрузилась: window.ym"
else
    print_error "❌ Требуется исправление!"
    echo ""
    print_info "🔧 Быстрое исправление:"
    echo ""
    echo "cd $PROJECT_DIR"
    echo "docker-compose down"
    echo "docker-compose up -d"
    echo ""
    print_info "После перезапуска запустите этот скрипт снова"
fi

echo ""
