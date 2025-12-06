# 🔧 Интеграция с telegram-bots-platform - Решение проблем

## 📊 Анализ ошибок

### Проблема 1: SSL сертификат не найден ❌
```
cannot load certificate "/etc/letsencrypt/live/bg.app-studio.online/fullchain.pem"
nginx: configuration file /etc/nginx/nginx.conf test failed
```

**Причина**: Платформа `telegram-bots-platform` пытается сразу создать Nginx конфигурацию с SSL, но сертификат еще не получен.

**Решение**: Нужно получить сертификат ДО создания Nginx конфигурации.

### Проблема 2: .env.example не найден ⚠️
```
⚠️  .env.example не найден, используется базовый шаблон
```

**Причина**: Платформа ищет `.env.example` для создания `.env` файла.

**Решение**: ✅ **ИСПРАВЛЕНО** - создан `.env.example`

### Проблема 3: docker compose.yml несовместим ⚠️

**Причина**: Платформа ожидает определенную структуру docker compose.yml.

**Решение**: ✅ **ИСПРАВЛЕНО** - обновлен `docker compose.yml`

---

## ✅ Исправления в bg-remove-site (УЖЕ СДЕЛАНО)

Следующие файлы уже исправлены в репозитории:

1. ✅ Создан `.env.example` - платформа теперь найдет его
2. ✅ Обновлен `docker compose.yml` - совместим с платформой
3. ✅ Настроен `next.config.mjs` - standalone режим для Docker

---

## 🔨 Исправления для telegram-bots-platform

### Вариант 1: Временный обход (БЫСТРО) ⚡

Добавьте в скрипт `add-bot.sh` проверку существования сертификата ПЕРЕД созданием Nginx конфигурации.

**Где**: `/opt/telegram-bots-platform/add-bot.sh`

**Найдите секцию создания Nginx конфигурации и добавьте:**

```bash
# Проверка существования SSL сертификата
if [ ! -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
    echo "⚠️  SSL сертификат не найден, создается временная HTTP конфигурация..."
    USE_SSL=false
else
    echo "✅ SSL сертификат найден"
    USE_SSL=true
fi
```

### Вариант 2: Патч для add-bot.sh (РЕКОМЕНДУЕТСЯ) 🎯

Создайте патч файл:

```bash
cd /opt/telegram-bots-platform
nano ssl-fix.patch
```

Вставьте:

```patch
--- a/add-bot.sh
+++ b/add-bot.sh
@@ -XXX,YY +XXX,YY @@
 # Nginx configuration section
+# Check if SSL certificate exists
+SSL_EXISTS=false
+if [ -f "/etc/letsencrypt/live/$DOMAIN/fullchain.pem" ]; then
+    SSL_EXISTS=true
+fi
+
+# Create HTTP-only config if SSL doesn't exist
+if [ "$SSL_EXISTS" = false ]; then
+    cat > "/etc/nginx/sites-available/${BOT_NAME}.conf" <<EOF
+server {
+    listen 80;
+    server_name ${DOMAIN};
+
+    location / {
+        proxy_pass http://localhost:${BACKEND_PORT};
+        proxy_set_header Host \$host;
+        proxy_set_header X-Real-IP \$remote_addr;
+    }
+}
+EOF
+else
+    # Create HTTPS config (existing code)
+    ...
+fi
```

### Вариант 3: Ручное исправление (ТЕКУЩИЙ ОБХОД) 🛠️

Следуйте инструкциям ниже в разделе "Пошаговое решение".

---

## 📝 Пошаговое решение для текущей ситуации

### Шаг 1: Удалите неудачное развертывание

```bash
cd /opt/telegram-bots-platform/bots
sudo rm -rf bg-site
sudo -u postgres psql -c "DROP DATABASE IF EXISTS bg_site_db;"
sudo -u postgres psql -c "DROP USER IF EXISTS bg_site_user;"
```

### Шаг 2: Обновите репозиторий bg-remove-site

```bash
cd /tmp
git clone https://github.com/f2re/bg-remove-site.git
cd bg-remove-site
git pull origin main  # Убедитесь что последняя версия с исправлениями
```

Проверьте наличие файлов:
```bash
ls -la .env.example        # Должен существовать
cat docker compose.yml     # Должен содержать 'bot:' вместо 'website:'
```

### Шаг 3: Запустите add-bot.sh БЕЗ получения SSL

Временно отредактируйте `/opt/telegram-bots-platform/add-bot.sh`:

Найдите секцию настройки Nginx (обычно строка ~400-500) и ЗАКОММЕНТИРУЙТЕ код получения SSL:

```bash
sudo nano /opt/telegram-bots-platform/add-bot.sh
```

Найдите и закомментируйте (добавьте # в начало строк):

```bash
# # Получение SSL сертификата
# certbot --nginx -d $DOMAIN \
#     --non-interactive \
#     --agree-tos \
#     --email $SSL_EMAIL \
#     --redirect
```

### Шаг 4: Создайте простую Nginx конфигурацию

Создайте `/etc/nginx/sites-available/bg-site.conf`:

```bash
sudo nano /etc/nginx/sites-available/bg-site.conf
```

Вставьте:

```nginx
server {
    listen 80;
    server_name bg.app-studio.online;

    location / {
        proxy_pass http://localhost:3841;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Let's Encrypt validation
    location ~ /.well-known/acme-challenge {
        allow all;
        root /var/www/html;
    }
}
```

Активируйте конфигурацию:

```bash
sudo ln -s /etc/nginx/sites-available/bg-site.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Шаг 5: Запустите add-bot.sh снова

```bash
cd /opt/telegram-bots-platform
sudo ./add-bot.sh
```

Введите:
- Название: `bg-site`
- Token: оставьте пустым (сайт, не бот)
- Домен: `bg.app-studio.online`
- Порт: `3841` (или автоматически)
- Repository: `https://github.com/f2re/bg-remove-site`

Скрипт должен успешно:
- ✅ Создать БД
- ✅ Клонировать репозиторий
- ✅ Найти `.env.example`
- ✅ Создать `docker compose.yml`
- ✅ Собрать Docker образ

### Шаг 6: Настройте .env файл

```bash
cd /opt/telegram-bots-platform/bots/bg-site
sudo nano .env
```

Обязательно укажите:

```env
NODE_ENV=production
PORT=3841
BOT_USERNAME=your_actual_bot_username
NEXT_PUBLIC_YANDEX_METRIKA_ID=your_metrika_id
```

### Шаг 7: Запустите контейнер

```bash
cd /opt/telegram-bots-platform/bots/bg-site
sudo docker compose up -d --build
```

Проверьте логи:

```bash
docker compose logs -f
```

Должны увидеть:
```
▲ Next.js 14.x.x
- Local: http://localhost:3000
✓ Ready in XXXms
```

### Шаг 8: Проверьте доступность

```bash
curl -I http://localhost:3841
curl -I http://bg.app-studio.online
```

Оба должны вернуть `200 OK`.

### Шаг 9: Получите SSL сертификат

Теперь когда сайт работает на HTTP, получите SSL:

```bash
sudo certbot --nginx -d bg.app-studio.online \
    --non-interactive \
    --agree-tos \
    --email your-email@example.com \
    --redirect
```

Certbot автоматически:
- ✅ Обновит Nginx конфигурацию
- ✅ Получит SSL сертификат
- ✅ Настроит редирект HTTP → HTTPS

### Шаг 10: Проверьте HTTPS

```bash
curl -I https://bg.app-studio.online
```

Должен вернуть `200 OK`.

---

## 🎯 Постоянное решение для telegram-bots-platform

Создайте улучшенную версию скрипта `add-bot.sh`:

### 1. Создайте бэкап

```bash
cd /opt/telegram-bots-platform
sudo cp add-bot.sh add-bot.sh.backup
```

### 2. Исправьте логику SSL

Найдите секцию Nginx (используйте `grep -n "nginx" add-bot.sh`):

```bash
sudo nano add-bot.sh
```

Замените секцию создания Nginx конфигурации на:

```bash
# ============================================================================
# Setup Nginx (IMPROVED VERSION)
# ============================================================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔹 Настройка Nginx"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Проверка существования SSL сертификата
SSL_CERT_PATH="/etc/letsencrypt/live/${DOMAIN}/fullchain.pem"

if [ -f "$SSL_CERT_PATH" ]; then
    echo "✅ SSL сертификат найден, создаем HTTPS конфигурацию"
    SSL_MODE="https"
else
    echo "⚠️  SSL сертификат не найден, создаем HTTP конфигурацию"
    echo "ℹ️  Получите SSL позже командой:"
    echo "    sudo certbot --nginx -d ${DOMAIN}"
    SSL_MODE="http"
fi

# Создание конфигурации
if [ "$SSL_MODE" = "http" ]; then
    # HTTP-only конфигурация
    cat > "/etc/nginx/sites-available/${BOT_NAME}.conf" <<EOF
server {
    listen 80;
    server_name ${DOMAIN};

    location / {
        proxy_pass http://localhost:${BACKEND_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    location ~ /.well-known/acme-challenge {
        allow all;
        root /var/www/html;
    }
}
EOF
else
    # Существующий код для HTTPS
    # ... (оставить как есть)
fi

# Активация конфигурации
ln -sf "/etc/nginx/sites-available/${BOT_NAME}.conf" "/etc/nginx/sites-enabled/"

# Проверка конфигурации
if nginx -t 2>/dev/null; then
    echo "✅ Nginx конфигурация валидна"
    systemctl reload nginx
    echo "✅ Nginx перезагружен"
else
    echo "❌ Ошибка в конфигурации Nginx!"
    nginx -t
    exit 1
fi

if [ "$SSL_MODE" = "http" ]; then
    echo ""
    echo "⚠️  ВАЖНО: Сайт работает только по HTTP!"
    echo "Для получения SSL сертификата выполните:"
    echo "    sudo certbot --nginx -d ${DOMAIN}"
    echo ""
fi
```

---

## 🔍 Диагностика проблем

### Проверка Docker контейнера

```bash
cd /opt/telegram-bots-platform/bots/bg-site
docker compose ps
docker compose logs --tail=50
```

### Проверка Nginx

```bash
sudo nginx -t
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

### Проверка портов

```bash
sudo netstat -tulpn | grep 3841
sudo netstat -tulpn | grep 80
sudo netstat -tulpn | grep 443
```

### Проверка сети Docker

```bash
docker network ls
docker network inspect bot-network
```

---

## 📋 Чеклист после исправления

- [ ] `.env.example` существует в репозитории
- [ ] `docker compose.yml` использует `bot:` вместо `website:`
- [ ] `docker compose.yml` использует `bot-network` (external)
- [ ] Nginx конфигурация создана (HTTP или HTTPS)
- [ ] Docker контейнер запущен
- [ ] Порт доступен (`netstat -tulpn | grep 3841`)
- [ ] Сайт доступен по HTTP
- [ ] SSL сертификат получен (если нужен HTTPS)
- [ ] Сайт доступен по HTTPS
- [ ] `.env` файл настроен с правильным `BOT_USERNAME`

---

## 🆘 Частые проблемы

### Контейнер не запускается

```bash
cd /opt/telegram-bots-platform/bots/bg-site
docker compose logs
```

Возможные причины:
- Ошибка сборки Next.js
- Отсутствующие переменные окружения
- Проблемы с сетью Docker

**Решение**:
```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

### 502 Bad Gateway

Проверьте что:
1. Контейнер запущен: `docker ps | grep bg-site`
2. Порт правильный в Nginx: `sudo nano /etc/nginx/sites-available/bg-site.conf`
3. Next.js запустился: `docker compose logs | grep "Ready"`

### Permission denied в логах PostgreSQL

Это нормально, если не используется PostgreSQL. Можно игнорировать.

Если нужна БД:
```bash
# В .env добавьте правильные данные:
DB_HOST=postgres  # или IP БД
DB_PORT=5432
DB_NAME=bg_site_db
DB_USER=bg_site_user
DB_PASSWORD=generated_password
```

---

## 📞 Поддержка

- **Репозиторий сайта**: https://github.com/f2re/bg-remove-site/issues
- **Платформа**: https://github.com/f2re/telegram-bots-platform/issues

---

## ✅ Итоговая команда для быстрого исправления

Если вы торопитесь, выполните это:

```bash
# 1. Удалите старое развертывание
cd /opt/telegram-bots-platform/bots
sudo rm -rf bg-site
sudo -u postgres psql -c "DROP DATABASE IF EXISTS bg_site_db;"
sudo -u postgres psql -c "DROP USER IF EXISTS bg_site_user;"

# 2. Создайте HTTP Nginx конфигурацию
sudo tee /etc/nginx/sites-available/bg-site.conf > /dev/null <<'EOF'
server {
    listen 80;
    server_name bg.app-studio.online;

    location / {
        proxy_pass http://localhost:3841;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location ~ /.well-known/acme-challenge {
        allow all;
        root /var/www/html;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/bg-site.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# 3. Запустите add-bot.sh снова
cd /opt/telegram-bots-platform
sudo ./add-bot.sh

# 4. После успешного запуска получите SSL
sudo certbot --nginx -d bg.app-studio.online --email your@email.com --agree-tos --non-interactive --redirect
```

**Готово!** Сайт должен работать.
