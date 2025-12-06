#!/bin/bash

# ============================================================================
# BG Remove Website - Automated SSL Setup Script
# ============================================================================
#
# Этот скрипт автоматизирует настройку nginx с SSL сертификатом
# Использование: sudo ./setup-ssl.sh
#
# ============================================================================

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функции для цветного вывода
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Проверка root прав
if [ "$EUID" -ne 0 ]; then
    print_error "Пожалуйста, запустите скрипт с sudo"
    exit 1
fi

print_info "🚀 Начинаем настройку nginx с SSL для BG Remove Website"
echo ""

# ============================================================================
# Шаг 1: Запрос данных
# ============================================================================

print_info "Введите данные для настройки:"
echo ""

read -p "Домен (например, bg-remove.com): " DOMAIN
read -p "Email для Let's Encrypt: " EMAIL
read -p "Порт приложения в .env (по умолчанию 3000): " APP_PORT
APP_PORT=${APP_PORT:-3000}

# Валидация
if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
    print_error "Домен и email обязательны!"
    exit 1
fi

echo ""
print_info "Настройки:"
echo "  Домен: $DOMAIN"
echo "  WWW: www.$DOMAIN"
echo "  Email: $EMAIL"
echo "  Порт приложения: $APP_PORT"
echo ""

read -p "Продолжить? (y/n): " CONFIRM
if [ "$CONFIRM" != "y" ]; then
    print_warning "Отменено пользователем"
    exit 0
fi

# ============================================================================
# Шаг 2: Проверка предварительных требований
# ============================================================================

print_info "Проверка DNS записей..."

DOMAIN_IP=$(dig +short $DOMAIN | tail -n1)
SERVER_IP=$(curl -s ifconfig.me)

if [ -z "$DOMAIN_IP" ]; then
    print_error "Домен $DOMAIN не разрешается в IP!"
    print_warning "Пожалуйста, настройте A-запись для домена"
    exit 1
fi

print_info "Домен $DOMAIN → $DOMAIN_IP"
print_info "Сервер IP: $SERVER_IP"

if [ "$DOMAIN_IP" != "$SERVER_IP" ]; then
    print_warning "IP домена ($DOMAIN_IP) не совпадает с IP сервера ($SERVER_IP)"
    read -p "Продолжить всё равно? (y/n): " CONTINUE
    if [ "$CONTINUE" != "y" ]; then
        exit 0
    fi
fi

# ============================================================================
# Шаг 3: Установка зависимостей
# ============================================================================

print_info "Установка зависимостей..."

apt update -qq

# Проверяем что установлено
command -v nginx >/dev/null 2>&1 || apt install -y nginx
command -v certbot >/dev/null 2>&1 || apt install -y certbot python3-certbot-nginx
command -v ufw >/dev/null 2>&1 || apt install -y ufw

print_success "Зависимости установлены"

# ============================================================================
# Шаг 4: Настройка Firewall
# ============================================================================

print_info "Настройка firewall..."

# Проверяем статус UFW
if ! ufw status | grep -q "Status: active"; then
    print_warning "UFW не активен. Настраиваем..."

    # Разрешаем SSH ПЕРВЫМ (критически важно!)
    ufw allow 22/tcp

    # Разрешаем HTTP и HTTPS
    ufw allow 80/tcp
    ufw allow 443/tcp

    # Включаем UFW
    yes | ufw enable

    print_success "Firewall настроен"
else
    # UFW уже активен, просто добавляем правила
    ufw allow 80/tcp 2>/dev/null || true
    ufw allow 443/tcp 2>/dev/null || true
    print_success "Firewall правила обновлены"
fi

ufw status

# ============================================================================
# Шаг 5: Проверка Docker контейнера
# ============================================================================

print_info "Проверка Docker контейнера..."

if ! curl -s http://localhost:$APP_PORT > /dev/null; then
    print_error "Приложение не доступно на localhost:$APP_PORT"
    print_info "Пожалуйста, запустите: docker-compose up -d"
    exit 1
fi

print_success "Приложение запущено на порту $APP_PORT"

# ============================================================================
# Шаг 6: Создание временной HTTP конфигурации nginx
# ============================================================================

print_info "Создание временной HTTP конфигурации nginx..."

NGINX_CONFIG="/etc/nginx/sites-available/bg-remove-site"

cat > $NGINX_CONFIG << EOF
# Временная HTTP конфигурация для получения SSL сертификата
server {
    listen 80;
    listen [::]:80;
    server_name $DOMAIN www.$DOMAIN;

    # Директория для Let's Encrypt ACME Challenge
    location ~ /.well-known/acme-challenge {
        allow all;
        root /var/www/html;
    }

    # Временно проксируем на приложение
    location / {
        proxy_pass http://localhost:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Активируем конфигурацию
ln -sf $NGINX_CONFIG /etc/nginx/sites-enabled/bg-remove-site

# Удаляем дефолтную конфигурацию
rm -f /etc/nginx/sites-enabled/default

# Проверяем конфигурацию
if ! nginx -t; then
    print_error "Ошибка в конфигурации nginx!"
    exit 1
fi

# Перезапускаем nginx
systemctl restart nginx
systemctl enable nginx

print_success "Nginx временная конфигурация создана"

# Проверяем доступность
sleep 2
if curl -s http://$DOMAIN > /dev/null; then
    print_success "Сайт доступен по HTTP: http://$DOMAIN"
else
    print_warning "Сайт не доступен по HTTP (это может быть нормально)"
fi

# ============================================================================
# Шаг 7: Получение SSL сертификата
# ============================================================================

print_info "Получение SSL сертификата от Let's Encrypt..."

# Проверяем существует ли сертификат
if [ -d "/etc/letsencrypt/live/$DOMAIN" ]; then
    print_warning "Сертификат для $DOMAIN уже существует"
    read -p "Переиздать сертификат? (y/n): " RENEW

    if [ "$RENEW" = "y" ]; then
        certbot delete --cert-name $DOMAIN --non-interactive
    else
        print_info "Используем существующий сертификат"
    fi
fi

# Получаем сертификат
if [ ! -d "/etc/letsencrypt/live/$DOMAIN" ]; then
    certbot --nginx \
        -d $DOMAIN \
        -d www.$DOMAIN \
        --agree-tos \
        --email $EMAIL \
        --non-interactive \
        --redirect

    if [ $? -eq 0 ]; then
        print_success "SSL сертификат успешно получен!"
    else
        print_error "Не удалось получить SSL сертификат"
        print_info "Попробуйте вручную: sudo certbot --nginx -d $DOMAIN"
        exit 1
    fi
fi

# Проверяем что сертификат получен
if [ ! -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    print_error "Сертификат не найден!"
    exit 1
fi

print_success "Сертификат находится в /etc/letsencrypt/live/$DOMAIN/"

# ============================================================================
# Шаг 8: Создание финальной production конфигурации
# ============================================================================

print_info "Создание production конфигурации nginx с SSL..."

cat > $NGINX_CONFIG << 'NGINX_EOF'
# ============================================================================
# BG Remove Website - Production Nginx Configuration with SSL
# ============================================================================

# HTTP Server - редирект на HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name DOMAIN_PLACEHOLDER www.DOMAIN_PLACEHOLDER;

    # Let's Encrypt ACME Challenge
    location ~ /.well-known/acme-challenge {
        allow all;
        root /var/www/html;
    }

    # Редирект всего трафика на HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS Server - основная конфигурация
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name DOMAIN_PLACEHOLDER www.DOMAIN_PLACEHOLDER;

    # SSL сертификаты
    ssl_certificate /etc/letsencrypt/live/DOMAIN_PLACEHOLDER/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/DOMAIN_PLACEHOLDER/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/DOMAIN_PLACEHOLDER/chain.pem;

    # SSL настройки
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384';
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_session_tickets off;

    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 8.8.8.8 8.8.4.4 valid=300s;
    resolver_timeout 5s;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Логи
    access_log /var/log/nginx/bg-remove-site-access.log;
    error_log /var/log/nginx/bg-remove-site-error.log warn;

    # Максимальный размер загружаемых файлов
    client_max_body_size 50M;

    # Прокси на Next.js приложение
    location / {
        proxy_pass http://localhost:APP_PORT_PLACEHOLDER;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Статические файлы Next.js
    location /_next/static/ {
        proxy_pass http://localhost:APP_PORT_PLACEHOLDER;
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss;
}
NGINX_EOF

# Заменяем плейсхолдеры
sed -i "s/DOMAIN_PLACEHOLDER/$DOMAIN/g" $NGINX_CONFIG
sed -i "s/APP_PORT_PLACEHOLDER/$APP_PORT/g" $NGINX_CONFIG

print_success "Production конфигурация создана"

# Проверяем конфигурацию
if ! nginx -t; then
    print_error "Ошибка в конфигурации nginx!"
    cat $NGINX_CONFIG
    exit 1
fi

# Применяем конфигурацию
systemctl reload nginx

print_success "Nginx конфигурация применена"

# ============================================================================
# Шаг 9: Настройка автообновления сертификата
# ============================================================================

print_info "Настройка автообновления SSL сертификата..."

# Включаем и запускаем certbot timer
systemctl enable certbot.timer
systemctl start certbot.timer

# Тестируем автообновление
if certbot renew --dry-run > /dev/null 2>&1; then
    print_success "Автообновление сертификата настроено"
else
    print_warning "Проблема с автообновлением, но сертификат работает"
fi

# ============================================================================
# Шаг 10: Финальные проверки
# ============================================================================

print_info "Финальные проверки..."

# Проверка HTTPS
sleep 3
if curl -s https://$DOMAIN > /dev/null; then
    print_success "✅ HTTPS работает: https://$DOMAIN"
else
    print_warning "⚠️  HTTPS может быть не доступен (возможно нужно подождать)"
fi

# Проверка редиректа
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://$DOMAIN)
if [ "$HTTP_STATUS" = "301" ] || [ "$HTTP_STATUS" = "302" ]; then
    print_success "✅ HTTP → HTTPS редирект работает"
else
    print_warning "⚠️  Редирект не настроен (код: $HTTP_STATUS)"
fi

# ============================================================================
# Готово!
# ============================================================================

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
print_success "🎉 Установка завершена успешно!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
print_info "📋 Информация:"
echo "  🌐 Сайт: https://$DOMAIN"
echo "  🌐 WWW: https://www.$DOMAIN"
echo "  🔒 SSL: Let's Encrypt"
echo "  📁 Конфигурация: $NGINX_CONFIG"
echo "  📁 Сертификат: /etc/letsencrypt/live/$DOMAIN/"
echo ""
print_info "📝 Следующие шаги:"
echo "  1. Откройте https://$DOMAIN в браузере"
echo "  2. Проверьте SSL сертификат (зеленый замочек)"
echo "  3. Проверьте SSL рейтинг: https://www.ssllabs.com/ssltest/analyze.html?d=$DOMAIN"
echo ""
print_info "🔧 Полезные команды:"
echo "  Логи nginx:       sudo tail -f /var/log/nginx/bg-remove-site-*.log"
echo "  Логи приложения:  docker-compose logs -f"
echo "  Перезапуск nginx: sudo systemctl reload nginx"
echo "  Статус SSL:       sudo certbot certificates"
echo "  Тест обновления:  sudo certbot renew --dry-run"
echo ""
print_success "Готово! 🚀"
echo ""
