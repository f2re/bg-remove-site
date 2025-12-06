# 🚀 BG Remove Website - Руководство по развертыванию

Полное руководство по развертыванию веб-сайта BG Remove на платформе [telegram-bots-platform](https://github.com/f2re/telegram-bots-platform).

## 📋 Содержание

- [Требования](#требования)
- [Быстрый старт](#быстрый-старт)
- [Пошаговое развертывание](#пошаговое-развертывание)
- [Конфигурация](#конфигурация)
- [Управление](#управление)
- [Мониторинг](#мониторинг)
- [Обновление](#обновление)
- [Решение проблем](#решение-проблем)

---

## 🎯 Требования

### Сервер

- **ОС**: Debian 12 (чистая установка)
- **RAM**: Минимум 2GB (рекомендуется 4GB)
- **Диск**: 20GB свободного места
- **Доступ**: Root или sudo
- **Сеть**: Публичный IP адрес

### Программное обеспечение

Если вы используете [telegram-bots-platform](https://github.com/f2re/telegram-bots-platform), все зависимости уже установлены:

- ✅ Docker & Docker Compose
- ✅ Nginx
- ✅ Certbot (Let's Encrypt)
- ✅ UFW (Firewall)
- ✅ PostgreSQL (опционально)

### Домен

- Зарегистрированный домен
- A-запись, указывающая на IP вашего сервера
- Доступ к DNS настройкам

---

## ⚡ Быстрый старт

### Вариант 1: Автоматическое развертывание (рекомендуется)

```bash
# 1. Клонировать репозиторий
cd /tmp
git clone https://github.com/f2re/bg-remove-site.git
cd bg-remove-site

# 2. Запустить скрипт развертывания
chmod +x deploy.sh
sudo ./deploy.sh
```

Скрипт запросит:
- Домен (например: bgremove.ru)
- Telegram Bot Username (без @)
- Yandex Metrika ID
- Порт (по умолчанию 3000)
- Email для SSL сертификата

**Готово!** Сайт будет доступен через 5-10 минут.

### Вариант 2: Ручное развертывание

См. раздел [Пошаговое развертывание](#пошаговое-развертывание)

---

## 📝 Пошаговое развертывание

### Шаг 1: Подготовка сервера

Если платформа не установлена:

```bash
# Клонировать платформу
cd /opt
git clone https://github.com/f2re/telegram-bots-platform.git
cd telegram-bots-platform

# Запустить настройку сервера
chmod +x setup-server.sh
sudo ./setup-server.sh
```

⚠️ **Важно**: Сохраните SSH ключ после установки!

### Шаг 2: Настройка DNS

Создайте A-записи для вашего домена:

```
Тип: A
Имя: @
Значение: [IP_ВАШЕГО_СЕРВЕРА]
TTL: 3600

Тип: A
Имя: www
Значение: [IP_ВАШЕГО_СЕРВЕРА]
TTL: 3600
```

Проверьте DNS:
```bash
dig bgremove.ru +short
# Должен вернуть IP вашего сервера
```

### Шаг 3: Клонирование проекта

```bash
# Создать директорию для сайтов
mkdir -p /opt/telegram-bots-platform/websites

# Клонировать проект
cd /opt/telegram-bots-platform/websites
git clone https://github.com/f2re/bg-remove-site.git bg-remove
cd bg-remove
```

### Шаг 4: Конфигурация переменных окружения

```bash
# Создать .env.production из примера
cp .env.production.example .env.production

# Редактировать конфигурацию
nano .env.production
```

Минимально необходимые параметры:

```env
NODE_ENV=production
BOT_USERNAME=your_bot_username
NEXT_PUBLIC_YANDEX_METRIKA_ID=12345678
WEBSITE_PORT=3000
```

### Шаг 5: Сборка Docker образа

```bash
# Собрать образ
docker compose build --no-cache

# Запустить контейнер
docker compose up -d

# Проверить статус
docker ps | grep bg-remove
docker compose logs -f
```

### Шаг 6: Настройка Nginx

```bash
# Создать конфигурацию Nginx
sudo nano /etc/nginx/sites-available/bg-remove-website.conf
```

Вставить конфигурацию из `nginx.conf.example` (замените `your-domain.com` на ваш домен).

```bash
# Активировать конфигурацию
sudo ln -s /etc/nginx/sites-available/bg-remove-website.conf /etc/nginx/sites-enabled/

# Проверить конфигурацию
sudo nginx -t

# Перезапустить Nginx
sudo systemctl reload nginx
```

### Шаг 7: Получение SSL сертификата

```bash
# Автоматическое получение SSL от Let's Encrypt
sudo certbot --nginx -d bgremove.ru -d www.bgremove.ru \
    --non-interactive \
    --agree-tos \
    --email your-email@example.com \
    --redirect
```

### Шаг 8: Настройка файрвола

```bash
# Открыть необходимые порты
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Проверить статус
sudo ufw status
```

### Шаг 9: Проверка развертывания

```bash
# Проверить Docker контейнер
docker ps | grep bg-remove-website

# Проверить логи
docker compose logs -f

# Проверить доступность сайта
curl -I http://localhost:3000
curl -I https://bgremove.ru

# Проверить SSL сертификат
sudo certbot certificates
```

---

## ⚙️ Конфигурация

### Переменные окружения

Все переменные находятся в `.env.production`:

```env
# Обязательные
NODE_ENV=production
BOT_USERNAME=your_bot_username
NEXT_PUBLIC_YANDEX_METRIKA_ID=12345678

# Опциональные
WEBSITE_PORT=3000
```

### Изменение конфигурации

После изменения `.env.production`:

```bash
cd /opt/telegram-bots-platform/websites/bg-remove
docker compose down
docker compose up -d --build
```

### Настройка Yandex Metrika

1. Создайте счетчик на https://metrica.yandex.ru
2. Скопируйте ID счетчика
3. Укажите в `.env.production`:
   ```env
   NEXT_PUBLIC_YANDEX_METRIKA_ID=ваш_id
   ```
4. Перезапустите контейнер

### Цели Яндекс.Метрики

Автоматически отслеживаются:
- `start_bot` - клик на кнопку "Открыть Telegram бот"
- `first_image` - первая обработка изображения
- `purchase` - покупка пакета

---

## 🔧 Управление

### Основные команды

```bash
# Переход в директорию проекта
cd /opt/telegram-bots-platform/websites/bg-remove

# Просмотр логов
docker compose logs -f

# Просмотр логов за последний час
docker compose logs --since 1h

# Перезапуск
docker compose restart

# Остановка
docker compose down

# Запуск
docker compose up -d

# Пересборка и запуск
docker compose up -d --build

# Проверка статуса
docker compose ps
```

### Логи Nginx

```bash
# Access log
sudo tail -f /var/log/nginx/bg-remove-website-access.log

# Error log
sudo tail -f /var/log/nginx/bg-remove-website-error.log
```

### Перезапуск сервисов

```bash
# Перезапуск Nginx
sudo systemctl restart nginx

# Перезапуск Docker
sudo systemctl restart docker

# Перезапуск контейнера
cd /opt/telegram-bots-platform/websites/bg-remove
docker compose restart
```

---

## 📊 Мониторинг

### Проверка работоспособности

```bash
# Health check контейнера
docker inspect bg-remove-website | grep Health -A 10

# Проверка доступности сайта
curl -I http://localhost:3000
curl -I https://bgremove.ru

# Проверка использования ресурсов
docker stats bg-remove-website
```

### Интеграция с Grafana

Если используется telegram-bots-platform:

1. Открыть Grafana: `http://YOUR_SERVER_IP:3000`
2. Логин: `admin`
3. Пароль: см. `/root/.platform/monitoring_credentials`
4. Добавить Docker dashboard

### Метрики для мониторинга

- CPU usage контейнера
- Memory usage контейнера
- Network I/O
- Количество запросов (Nginx logs)
- Время ответа сервера
- SSL сертификат expiry

---

## 🔄 Обновление

### Обновление кода

```bash
cd /opt/telegram-bots-platform/websites/bg-remove

# Забэкапить .env
cp .env.production .env.production.backup

# Получить обновления
git pull origin main

# Пересобрать и перезапустить
docker compose down
docker compose up -d --build

# Проверить логи
docker compose logs -f
```

### Обновление зависимостей

```bash
cd /opt/telegram-bots-platform/websites/bg-remove

# Обновить package.json
nano package.json

# Пересобрать образ
docker compose build --no-cache
docker compose up -d
```

### Откат к предыдущей версии

```bash
cd /opt/telegram-bots-platform/websites/bg-remove

# Откатить к предыдущему коммиту
git log --oneline
git reset --hard COMMIT_HASH

# Пересобрать
docker compose down
docker compose up -d --build
```

---

## 🔒 Безопасность

### SSL/TLS

```bash
# Проверка сертификата
sudo certbot certificates

# Ручное обновление
sudo certbot renew

# Тест обновления
sudo certbot renew --dry-run
```

### Файрвол

```bash
# Проверка открытых портов
sudo ufw status numbered

# Закрыть ненужные порты
sudo ufw deny 8080/tcp

# Разрешить с определенного IP
sudo ufw allow from 192.168.1.100 to any port 22
```

### Security Headers

Nginx автоматически добавляет:
- Strict-Transport-Security (HSTS)
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer-Policy

### Обновления безопасности

```bash
# Обновить систему
sudo apt update && sudo apt upgrade -y

# Обновить Docker
sudo apt install docker-ce docker-ce-cli containerd.io

# Перезапустить сервисы
sudo systemctl restart docker nginx
```

---

## 🐛 Решение проблем

### Сайт не открывается

```bash
# 1. Проверить контейнер
docker ps | grep bg-remove
docker compose logs

# 2. Проверить Nginx
sudo nginx -t
sudo systemctl status nginx

# 3. Проверить порты
sudo netstat -tulpn | grep 3000
sudo netstat -tulpn | grep 80

# 4. Проверить файрвол
sudo ufw status
```

### Ошибка SSL сертификата

```bash
# Проверить сертификаты
sudo certbot certificates

# Удалить и переполучить
sudo certbot delete --cert-name bgremove.ru
sudo certbot --nginx -d bgremove.ru -d www.bgremove.ru

# Проверить конфигурацию Nginx
sudo nginx -t
```

### Контейнер не запускается

```bash
# Посмотреть логи
docker compose logs

# Проверить .env файл
cat .env.production

# Пересобрать образ
docker compose down
docker compose build --no-cache
docker compose up -d
```

### Высокое использование памяти

```bash
# Проверить использование
docker stats bg-remove-website

# Ограничить память в docker compose.yml
services:
  website:
    mem_limit: 512m
    mem_reservation: 256m

# Перезапустить
docker compose down
docker compose up -d
```

### 502 Bad Gateway

```bash
# 1. Проверить работает ли контейнер
docker ps | grep bg-remove

# 2. Проверить логи контейнера
docker compose logs -f

# 3. Проверить порт в Nginx конфигурации
sudo nano /etc/nginx/sites-available/bg-remove-website.conf
# proxy_pass должен соответствовать WEBSITE_PORT

# 4. Перезапустить Nginx
sudo systemctl restart nginx
```

### Медленная загрузка сайта

```bash
# 1. Проверить логи Next.js
docker compose logs -f

# 2. Проверить ресурсы сервера
htop
df -h

# 3. Включить кеширование в Nginx
# См. nginx.conf.example

# 4. Оптимизировать сборку Next.js
# Добавить в next.config.js:
module.exports = {
  compress: true,
  swcMinify: true,
}
```

---

## 📚 Дополнительные ресурсы

### Документация

- [Next.js Documentation](https://nextjs.org/docs)
- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/ru/docs/)
- [Let's Encrypt](https://letsencrypt.org/docs/)

### Платформа

- [telegram-bots-platform](https://github.com/f2re/telegram-bots-platform)
- [bg-remove-bot](https://github.com/f2re/bg-remove-bot)

### Поддержка

- GitHub Issues: https://github.com/f2re/bg-remove-site/issues
- Telegram: @your_support_channel

---

## ✅ Чеклист развертывания

- [ ] Сервер настроен (telegram-bots-platform установлен)
- [ ] DNS настроен (A-запись указывает на сервер)
- [ ] Проект склонирован в `/opt/telegram-bots-platform/websites/bg-remove`
- [ ] `.env.production` создан и настроен
- [ ] Docker образ собран
- [ ] Контейнер запущен
- [ ] Nginx настроен
- [ ] SSL сертификат получен
- [ ] Файрвол настроен (порты 80, 443 открыты)
- [ ] Сайт доступен по HTTP
- [ ] Сайт доступен по HTTPS
- [ ] Yandex Metrika настроена
- [ ] Bot Username обновлен
- [ ] Мониторинг настроен
- [ ] Backup настроен

---

## 🎉 Готово!

Ваш сайт BG Remove успешно развернут и готов к работе!

Если у вас возникли вопросы или проблемы, создайте Issue в репозитории.

**Удачи!** 🚀
