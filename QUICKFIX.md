# ⚡ Быстрое исправление для telegram-bots-platform

## 🔴 Проблема

При запуске `add-bot.sh` возникает ошибка:
```
nginx: configuration file /etc/nginx/nginx.conf test failed
cannot load certificate "/etc/letsencrypt/live/bg.app-studio.online/fullchain.pem"
```

## ✅ Быстрое решение (5 минут)

### Шаг 1: Очистка

```bash
cd /opt/telegram-bots-platform/bots
sudo rm -rf bg-site
sudo -u postgres psql -c "DROP DATABASE IF EXISTS bg_site_db;" 2>/dev/null
sudo -u postgres psql -c "DROP USER IF EXISTS bg_site_user;" 2>/dev/null
sudo rm -f /etc/nginx/sites-enabled/bg-site.conf
sudo rm -f /etc/nginx/sites-available/bg-site.conf
```

### Шаг 2: Создайте HTTP конфигурацию Nginx

```bash
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
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location ~ /.well-known/acme-challenge {
        allow all;
        root /var/www/html;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/bg-site.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Шаг 3: Ручное развертывание

```bash
cd /opt/telegram-bots-platform/bots
sudo mkdir -p bg-site
cd bg-site

# Клонировать репозиторий
sudo git clone https://github.com/f2re/bg-remove-site.git app
cd app

# Создать .env
sudo cp .env.example .env
sudo nano .env
```

В `.env` укажите:
```env
NODE_ENV=production
PORT=3841
BOT_USERNAME=your_bot_username
NEXT_PUBLIC_YANDEX_METRIKA_ID=your_id
```

### Шаг 4: Запустить Docker

```bash
cd /opt/telegram-bots-platform/bots/bg-site/app
sudo docker-compose up -d --build
```

### Шаг 5: Проверка

```bash
# Проверить контейнер
docker ps | grep bg-site

# Проверить логи
docker-compose logs -f

# Проверить сайт
curl -I http://localhost:3841
curl -I http://bg.app-studio.online
```

### Шаг 6: Получить SSL (опционально)

```bash
sudo certbot --nginx -d bg.app-studio.online \
    --email your@email.com \
    --agree-tos \
    --non-interactive \
    --redirect
```

## ✅ Готово!

Сайт должен быть доступен:
- HTTP: http://bg.app-studio.online
- HTTPS: https://bg.app-studio.online (после certbot)

---

## 🔧 Управление

```bash
cd /opt/telegram-bots-platform/bots/bg-site/app

# Логи
docker-compose logs -f

# Перезапуск
docker-compose restart

# Остановка
docker-compose down

# Обновление
git pull && docker-compose up -d --build
```

---

## 📚 Подробная документация

См. [PLATFORM_INTEGRATION.md](./PLATFORM_INTEGRATION.md)
