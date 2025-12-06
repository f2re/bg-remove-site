# Nginx + SSL Certificate Setup Guide

Пошаговая инструкция по развертыванию BG Remove Website с nginx и SSL сертификатом.

## Предварительные требования

- Ubuntu/Debian сервер с root доступом
- Домен настроен на IP сервера (A-запись)
- Открыты порты: 22 (SSH), 80 (HTTP), 443 (HTTPS)

## Шаг 1: Подготовка сервера

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка необходимых пакетов
sudo apt install -y docker.io docker-compose nginx certbot python3-certbot-nginx ufw git

# Запуск Docker
sudo systemctl start docker
sudo systemctl enable docker

# Добавление пользователя в группу docker (опционально)
sudo usermod -aG docker $USER
# После этого нужно выйти и зайти снова
```

## Шаг 2: Настройка Firewall (UFW)

```bash
# Разрешаем SSH (важно сделать первым!)
sudo ufw allow 22/tcp

# Разрешаем HTTP и HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Включаем firewall
sudo ufw enable

# Проверяем статус
sudo ufw status
```

## Шаг 3: Клонирование и настройка проекта

```bash
# Клонируем репозиторий
cd /opt
sudo git clone <your-repo-url> bg-remove-site
cd bg-remove-site

# Создаем .env файл
sudo cp .env.example .env

# Редактируем .env
sudo nano .env
```

### Настройка .env файла:

```env
NODE_ENV=production
PORT=3000
BOT_USERNAME=your_bot_username
NEXT_PUBLIC_YANDEX_METRIKA_ID=12345678

# Если используете базу данных
DB_HOST=postgres
DB_PORT=5432
DB_NAME=bg_site_db
DB_USER=bg_site_user
DB_PASSWORD=your_secure_password
```

**Сохраните файл:** `Ctrl+X`, затем `Y`, затем `Enter`

## Шаг 4: Сборка Docker образа

```bash
# Создаем сеть (если используете telegram-bots-platform)
sudo docker network create bot-network 2>/dev/null || true

# Собираем образ
sudo docker-compose build

# Проверяем что образ создан
sudo docker images | grep bg-site
```

## Шаг 5: Запуск приложения

```bash
# Запускаем контейнер
sudo docker-compose up -d

# Проверяем статус
sudo docker-compose ps

# Проверяем логи
sudo docker-compose logs -f --tail=50

# Проверяем что приложение доступно локально
curl http://localhost:3000
```

**Вы должны увидеть HTML код страницы.**

## Шаг 6: Настройка Nginx (HTTP - временная)

Сначала создадим временную HTTP конфигурацию для получения SSL сертификата.

```bash
# Создаем конфигурацию nginx
sudo nano /etc/nginx/sites-available/bg-remove-site
```

### Временная HTTP конфигурация:

```nginx
# Временная конфигурация для получения SSL сертификата
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;

    # Директория для Let's Encrypt ACME Challenge
    location ~ /.well-known/acme-challenge {
        allow all;
        root /var/www/html;
    }

    # Временно проксируем на приложение
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Замените `your-domain.com` на ваш реальный домен!**

### Активируем конфигурацию:

```bash
# Создаем симлинк
sudo ln -sf /etc/nginx/sites-available/bg-remove-site /etc/nginx/sites-enabled/

# Удаляем дефолтную конфигурацию (опционально)
sudo rm -f /etc/nginx/sites-enabled/default

# Проверяем конфигурацию nginx
sudo nginx -t

# Если всё OK, перезапускаем nginx
sudo systemctl restart nginx
sudo systemctl enable nginx

# Проверяем статус
sudo systemctl status nginx
```

### Проверка доступности:

Откройте в браузере: `http://your-domain.com`

Вы должны увидеть ваш сайт (без HTTPS).

## Шаг 7: Получение SSL сертификата (Let's Encrypt)

```bash
# Останавливаем nginx временно
sudo systemctl stop nginx

# Получаем сертификат (standalone режим)
sudo certbot certonly --standalone \
  -d your-domain.com \
  -d www.your-domain.com \
  --agree-tos \
  --email your-email@example.com \
  --non-interactive

# Запускаем nginx обратно
sudo systemctl start nginx
```

**Или используйте nginx плагин (рекомендуется):**

```bash
# С работающим nginx
sudo certbot --nginx \
  -d your-domain.com \
  -d www.your-domain.com \
  --agree-tos \
  --email your-email@example.com \
  --non-interactive \
  --redirect
```

### Проверка сертификата:

```bash
# Проверяем что сертификат получен
sudo ls -la /etc/letsencrypt/live/your-domain.com/

# Должны быть файлы:
# - cert.pem
# - chain.pem
# - fullchain.pem
# - privkey.pem
```

## Шаг 8: Финальная конфигурация Nginx с SSL

```bash
# Редактируем конфигурацию
sudo nano /etc/nginx/sites-available/bg-remove-site
```

### Полная production конфигурация:

```nginx
# ============================================================================
# BG Remove Website - Production Nginx Configuration with SSL
# ============================================================================

# HTTP Server - редирект на HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;

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
    server_name your-domain.com www.your-domain.com;

    # SSL сертификаты
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_trusted_certificate /etc/letsencrypt/live/your-domain.com/chain.pem;

    # SSL настройки (современные и безопасные)
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';

    # SSL Session
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
    add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;

    # Логи
    access_log /var/log/nginx/bg-remove-site-access.log;
    error_log /var/log/nginx/bg-remove-site-error.log warn;

    # Максимальный размер загружаемых файлов
    client_max_body_size 50M;
    client_body_timeout 60s;

    # Прокси на Next.js приложение
    # ВАЖНО: Порт должен совпадать с PORT в .env
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;

        # WebSocket поддержка (для Hot Reload в development)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';

        # Заголовки
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $server_name;

        # Отключаем кеширование для прокси
        proxy_cache_bypass $http_upgrade;

        # Таймауты
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;

        # Буферизация
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 4k;
        proxy_busy_buffers_size 8k;
    }

    # Статические файлы Next.js
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
    }

    # Favicon и другие статические файлы
    location ~* \.(ico|css|js|gif|jpeg|jpg|png|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://localhost:3000;
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/rss+xml
        application/atom+xml
        image/svg+xml
        text/x-component
        text/x-cross-domain-policy;

    # Защита от ботов (опционально)
    location ~ /(wp-admin|wp-login|xmlrpc.php) {
        deny all;
        return 404;
    }
}
```

**Не забудьте заменить `your-domain.com` на ваш домен!**

### Проверка и применение:

```bash
# Проверяем конфигурацию
sudo nginx -t

# Если всё OK:
sudo systemctl reload nginx

# Проверяем статус
sudo systemctl status nginx
```

## Шаг 9: Автоматическое обновление сертификата

Certbot автоматически создает cron задачу, но проверим:

```bash
# Проверяем автообновление
sudo certbot renew --dry-run

# Проверяем systemd timer
sudo systemctl status certbot.timer

# Если timer не активен, включаем:
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

## Шаг 10: Проверка и тестирование

### Проверка SSL:

```bash
# Проверка сертификата
openssl s_client -connect your-domain.com:443 -servername your-domain.com < /dev/null

# Проверка SSL рейтинга (онлайн)
# Откройте: https://www.ssllabs.com/ssltest/analyze.html?d=your-domain.com
```

### Проверка редиректа HTTP → HTTPS:

```bash
curl -I http://your-domain.com
# Должно быть: 301 Moved Permanently
# Location: https://your-domain.com/
```

### Проверка сайта в браузере:

Откройте: `https://your-domain.com`

Проверьте:
- ✅ Зеленый замочек в адресной строке
- ✅ Валидный SSL сертификат
- ✅ Все ресурсы загружаются по HTTPS
- ✅ Сайт работает корректно

## Шаг 11: Мониторинг и логи

```bash
# Логи Docker контейнера
sudo docker-compose logs -f bg-site_bot

# Логи nginx (access)
sudo tail -f /var/log/nginx/bg-remove-site-access.log

# Логи nginx (errors)
sudo tail -f /var/log/nginx/bg-remove-site-error.log

# Проверка использования ресурсов
sudo docker stats

# Проверка портов
sudo netstat -tulpn | grep -E ':(80|443|3000)'
```

## Управление сервисом

### Перезапуск приложения:

```bash
cd /opt/bg-remove-site

# Перезапуск с пересборкой
sudo docker-compose down
sudo docker-compose up -d --build

# Просто перезапуск
sudo docker-compose restart

# Обновление из git
sudo git pull
sudo docker-compose up -d --build
```

### Перезапуск nginx:

```bash
# Проверка конфигурации
sudo nginx -t

# Reload (без остановки)
sudo systemctl reload nginx

# Полный перезапуск
sudo systemctl restart nginx
```

## Troubleshooting

### Проблема: "Connection refused" на порту 3000

```bash
# Проверяем что контейнер запущен
sudo docker-compose ps

# Проверяем логи
sudo docker-compose logs -f

# Проверяем порт
sudo netstat -tulpn | grep 3000

# Перезапускаем
sudo docker-compose restart
```

### Проблема: Nginx не может получить сертификат

```bash
# Проверяем что домен настроен правильно
nslookup your-domain.com

# Проверяем что порт 80 открыт
sudo ufw status | grep 80

# Проверяем логи certbot
sudo journalctl -u certbot -n 50

# Ручной режим
sudo certbot certonly --standalone --preferred-challenges http -d your-domain.com
```

### Проблема: SSL работает, но страница не загружается

```bash
# Проверяем логи nginx
sudo tail -f /var/log/nginx/bg-remove-site-error.log

# Проверяем что приложение доступно локально
curl http://localhost:3000

# Проверяем конфигурацию nginx
sudo nginx -t

# Проверяем SELinux (если используется)
sudo getenforce
```

### Проблема: "Mixed Content" ошибки

Добавьте в nginx конфигурацию:

```nginx
add_header Content-Security-Policy "upgrade-insecure-requests" always;
```

## Полезные команды

```bash
# Проверка всех docker контейнеров
sudo docker ps -a

# Очистка неиспользуемых образов
sudo docker system prune -a

# Просмотр использования диска
df -h

# Просмотр использования памяти
free -h

# Тест производительности nginx
ab -n 1000 -c 10 https://your-domain.com/

# Проверка DNS
dig your-domain.com
```

## Чеклист готовности к production

- [ ] Домен настроен (A-запись на IP сервера)
- [ ] Firewall настроен (UFW разрешает 80, 443)
- [ ] Docker контейнер запущен и работает
- [ ] .env файл настроен с правильными значениями
- [ ] BOT_USERNAME указан
- [ ] NEXT_PUBLIC_YANDEX_METRIKA_ID указан
- [ ] Nginx установлен и запущен
- [ ] SSL сертификат получен от Let's Encrypt
- [ ] HTTP → HTTPS редирект работает
- [ ] Сайт доступен по HTTPS
- [ ] Проверка SSL на ssllabs.com (рейтинг A или A+)
- [ ] Автообновление сертификата настроено
- [ ] Логи настроены и доступны
- [ ] Backup настроен (опционально)
- [ ] Мониторинг настроен (опционально)

## Безопасность

### Дополнительные меры:

```bash
# Настройка fail2ban (защита от брутфорса SSH)
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Отключение root логина по SSH
sudo nano /etc/ssh/sshd_config
# Установите: PermitRootLogin no
sudo systemctl restart sshd

# Настройка автообновлений безопасности
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure -plow unattended-upgrades
```

## Контакты и поддержка

При возникновении проблем:

1. Проверьте логи: `sudo docker-compose logs -f`
2. Проверьте nginx логи: `sudo tail -f /var/log/nginx/*.log`
3. Проверьте статус сервисов: `sudo systemctl status nginx docker`
4. Проверьте открытые порты: `sudo netstat -tulpn`

---

**Успешного деплоя! 🚀**
