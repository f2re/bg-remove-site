#!/bin/bash

# ============================================================================
# BG Remove Website - Скрипт развертывания для telegram-bots-platform
# ============================================================================
#
# Этот скрипт автоматически развертывает веб-сайт BG Remove на платформе
# https://github.com/f2re/telegram-bots-platform
#
# Использование:
#   chmod +x deploy.sh
#   sudo ./deploy.sh
#
# ============================================================================

set -e  # Остановка при ошибке

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функции для красивого вывода
print_header() {
    echo -e "\n${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

# Проверка прав root
if [[ $EUID -ne 0 ]]; then
   print_error "Этот скрипт должен быть запущен с правами root (sudo)"
   exit 1
fi

print_header "🚀 BG Remove Website - Развертывание"

# ============================================================================
# Шаг 1: Сбор информации
# ============================================================================

print_info "Сбор информации для развертывания..."

# Домен
read -p "Введите домен для сайта (например: bgremove.ru): " DOMAIN
if [[ -z "$DOMAIN" ]]; then
    print_error "Домен обязателен"
    exit 1
fi

# Bot Username
read -p "Введите Telegram Bot Username (без @): " BOT_USERNAME
if [[ -z "$BOT_USERNAME" ]]; then
    print_error "Bot Username обязателен"
    exit 1
fi

# Yandex Metrika ID
read -p "Введите Yandex Metrika ID (или оставьте пустым): " METRIKA_ID

# Порт (по умолчанию 3000)
read -p "Введите порт для веб-сайта [3000]: " WEBSITE_PORT
WEBSITE_PORT=${WEBSITE_PORT:-3000}

# Email для Let's Encrypt
read -p "Введите email для SSL сертификата: " SSL_EMAIL
if [[ -z "$SSL_EMAIL" ]]; then
    print_error "Email обязателен для получения SSL сертификата"
    exit 1
fi

# ============================================================================
# Шаг 2: Определение путей
# ============================================================================

PLATFORM_DIR="/opt/telegram-bots-platform"
WEBSITE_DIR="$PLATFORM_DIR/websites/bg-remove"
NGINX_CONFIG="/etc/nginx/sites-available/bg-remove-website.conf"
NGINX_ENABLED="/etc/nginx/sites-enabled/bg-remove-website.conf"

print_success "Конфигурация собрана"

# ============================================================================
# Шаг 3: Проверка зависимостей
# ============================================================================

print_header "📦 Проверка зависимостей"

# Проверка Docker
if ! command -v docker &> /dev/null; then
    print_error "Docker не установлен. Установите платформу: https://github.com/f2re/telegram-bots-platform"
    exit 1
fi
print_success "Docker установлен"

# Проверка Docker Compose
if ! command -v docker compose &> /dev/null && ! docker compose version &> /dev/null; then
    print_error "Docker Compose не установлен"
    exit 1
fi
print_success "Docker Compose установлен"

# Проверка Nginx
if ! command -v nginx &> /dev/null; then
    print_error "Nginx не установлен"
    exit 1
fi
print_success "Nginx установлен"

# Проверка Certbot
if ! command -v certbot &> /dev/null; then
    print_warning "Certbot не установлен. SSL сертификат не будет получен автоматически"
    SKIP_SSL=true
else
    print_success "Certbot установлен"
    SKIP_SSL=false
fi

# ============================================================================
# Шаг 4: Создание директории проекта
# ============================================================================

print_header "📁 Создание структуры проекта"

# Создаем директорию платформы если не существует
mkdir -p "$PLATFORM_DIR/websites"

# Создаем директорию для сайта
if [ -d "$WEBSITE_DIR" ]; then
    print_warning "Директория $WEBSITE_DIR уже существует"
    read -p "Удалить и создать заново? (y/N): " RECREATE
    if [[ "$RECREATE" =~ ^[Yy]$ ]]; then
        rm -rf "$WEBSITE_DIR"
        print_success "Старая директория удалена"
    else
        print_info "Используем существующую директорию"
    fi
fi

mkdir -p "$WEBSITE_DIR"
print_success "Директория проекта создана: $WEBSITE_DIR"

# ============================================================================
# Шаг 5: Копирование файлов
# ============================================================================

print_header "📋 Копирование файлов проекта"

# Определяем текущую директорию скрипта
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Копируем все файлы кроме node_modules, .next, .git
rsync -av --exclude='node_modules' \
          --exclude='.next' \
          --exclude='.git' \
          --exclude='*.log' \
          "$SCRIPT_DIR/" "$WEBSITE_DIR/"

print_success "Файлы проекта скопированы"

# ============================================================================
# Шаг 6: Создание .env файла
# ============================================================================

print_header "⚙️  Создание конфигурации"

cat > "$WEBSITE_DIR/.env.production" <<EOF
# Production Environment Variables
# Сгенерировано автоматически: $(date)

NODE_ENV=production
BOT_USERNAME=$BOT_USERNAME
NEXT_PUBLIC_YANDEX_METRIKA_ID=$METRIKA_ID
WEBSITE_PORT=$WEBSITE_PORT
EOF

print_success ".env.production создан"

# ============================================================================
# Шаг 7: Настройка Nginx
# ============================================================================

print_header "🌐 Настройка Nginx"

# Создаем конфигурацию Nginx
cat > "$NGINX_CONFIG" <<EOF
# BG Remove Website - Nginx Configuration
# Domain: $DOMAIN

server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;

    # Редирект на HTTPS (будет активирован после получения SSL)
    # location / {
    #     return 301 https://\$server_name\$request_uri;
    # }

    # Временная конфигурация для получения SSL
    location / {
        proxy_pass http://localhost:$WEBSITE_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;

        # Таймауты
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Let's Encrypt validation
    location ~ /.well-known/acme-challenge {
        allow all;
        root /var/www/html;
    }
}

# HTTPS конфигурация (будет настроена автоматически Certbot)
EOF

print_success "Nginx конфигурация создана"

# Создаем симлинк
ln -sf "$NGINX_CONFIG" "$NGINX_ENABLED"
print_success "Nginx конфигурация активирована"

# Проверяем конфигурацию Nginx
if nginx -t 2>/dev/null; then
    print_success "Nginx конфигурация валидна"
    systemctl reload nginx
    print_success "Nginx перезагружен"
else
    print_error "Ошибка в конфигурации Nginx"
    nginx -t
    exit 1
fi

# ============================================================================
# Шаг 8: Сборка и запуск Docker контейнера
# ============================================================================

print_header "🐳 Сборка и запуск Docker контейнера"

cd "$WEBSITE_DIR"

# Останавливаем старый контейнер если существует
if docker ps -a | grep -q bg-remove-website; then
    print_info "Остановка старого контейнера..."
    docker compose down
    print_success "Старый контейнер остановлен"
fi

# Собираем и запускаем
print_info "Сборка Docker образа (это может занять несколько минут)..."
docker compose build --no-cache

print_info "Запуск контейнера..."
docker compose up -d

# Ждем запуска
print_info "Ожидание запуска сервиса..."
sleep 10

# Проверяем статус
if docker ps | grep -q bg-remove-website; then
    print_success "Контейнер успешно запущен"
else
    print_error "Контейнер не запустился. Проверьте логи: docker compose logs"
    exit 1
fi

# ============================================================================
# Шаг 9: Получение SSL сертификата
# ============================================================================

if [ "$SKIP_SSL" = false ]; then
    print_header "🔒 Получение SSL сертификата"

    print_info "Получение сертификата Let's Encrypt..."

    # Проверяем доступность домена
    print_info "Проверка DNS записи для $DOMAIN..."
    if host $DOMAIN > /dev/null 2>&1; then
        print_success "DNS запись найдена"

        # Получаем сертификат
        certbot --nginx -d $DOMAIN -d www.$DOMAIN \
                --non-interactive \
                --agree-tos \
                --email $SSL_EMAIL \
                --redirect

        if [ $? -eq 0 ]; then
            print_success "SSL сертификат успешно получен и настроен"
            systemctl reload nginx
        else
            print_warning "Не удалось получить SSL сертификат автоматически"
            print_info "Вы можете получить его позже командой:"
            print_info "sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
        fi
    else
        print_warning "DNS запись не найдена для $DOMAIN"
        print_info "Убедитесь, что A-запись домена указывает на IP сервера"
        print_info "После настройки DNS выполните:"
        print_info "sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
    fi
else
    print_warning "Certbot не установлен. SSL сертификат пропущен"
fi

# ============================================================================
# Шаг 10: Настройка файрвола
# ============================================================================

print_header "🔥 Настройка файрвола"

if command -v ufw &> /dev/null; then
    # Проверяем статус UFW
    if ufw status | grep -q "Status: active"; then
        # Открываем порты
        ufw allow 80/tcp comment 'HTTP for BG Remove Website' > /dev/null 2>&1
        ufw allow 443/tcp comment 'HTTPS for BG Remove Website' > /dev/null 2>&1
        print_success "Порты 80 и 443 открыты в UFW"
    else
        print_info "UFW не активен"
    fi
else
    print_info "UFW не установлен"
fi

# ============================================================================
# Завершение
# ============================================================================

print_header "✅ Развертывание завершено успешно!"

echo ""
print_success "Веб-сайт BG Remove развернут и запущен"
echo ""
print_info "📍 Информация о развертывании:"
echo "   - Домен: http://$DOMAIN"
if [ "$SKIP_SSL" = false ]; then
    echo "   - HTTPS: https://$DOMAIN"
fi
echo "   - Директория: $WEBSITE_DIR"
echo "   - Порт: $WEBSITE_PORT"
echo "   - Bot Username: @$BOT_USERNAME"
echo ""
print_info "🔧 Полезные команды:"
echo "   - Логи: cd $WEBSITE_DIR && docker compose logs -f"
echo "   - Перезапуск: cd $WEBSITE_DIR && docker compose restart"
echo "   - Остановка: cd $WEBSITE_DIR && docker compose down"
echo "   - Обновление: cd $WEBSITE_DIR && git pull && docker compose up -d --build"
echo ""
print_info "📊 Проверка статуса:"
echo "   - Docker: docker ps | grep bg-remove-website"
echo "   - Nginx: sudo systemctl status nginx"
echo "   - Сайт: curl -I http://localhost:$WEBSITE_PORT"
echo ""

if [ "$SKIP_SSL" = false ]; then
    print_info "🔒 SSL сертификат:"
    echo "   - Автообновление настроено через certbot"
    echo "   - Проверка: sudo certbot certificates"
fi

echo ""
print_warning "⚠️  Не забудьте:"
echo "   1. Настроить Яндекс.Метрику (ID: $METRIKA_ID)"
echo "   2. Обновить BOT_USERNAME в Telegram боте"
echo "   3. Проверить работу сайта: http://$DOMAIN"
echo ""

print_success "🎉 Готово! Ваш сайт доступен по адресу: http://$DOMAIN"
