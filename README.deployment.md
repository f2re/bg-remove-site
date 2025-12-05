# 🚀 BG Remove Website - Быстрое развертывание

## ⚡ Автоматическое развертывание (1 команда)

```bash
git clone https://github.com/f2re/bg-remove-site.git
cd bg-remove-site
chmod +x deploy.sh
sudo ./deploy.sh
```

Скрипт запросит:
- 🌐 Домен (например: bgremove.ru)
- 🤖 Telegram Bot Username (без @)
- 📊 Yandex Metrika ID
- 🔌 Порт (по умолчанию 3000)
- 📧 Email для SSL

**Готово!** Сайт будет доступен через 5-10 минут.

---

## 📋 Требования

- Debian 12 с установленной [telegram-bots-platform](https://github.com/f2re/telegram-bots-platform)
- Домен с настроенной A-записью
- Root доступ

---

## 📖 Документация

Полная документация: [DEPLOYMENT.md](./DEPLOYMENT.md)

### Основные файлы:

- `deploy.sh` - автоматический скрипт развертывания
- `Dockerfile` - Docker образ для Next.js
- `docker-compose.yml` - конфигурация Docker Compose
- `.env.production.example` - пример переменных окружения
- `nginx.conf.example` - пример конфигурации Nginx
- `DEPLOYMENT.md` - полное руководство

---

## 🔧 Управление

```bash
# Директория проекта
cd /opt/telegram-bots-platform/websites/bg-remove

# Логи
docker-compose logs -f

# Перезапуск
docker-compose restart

# Обновление
git pull && docker-compose up -d --build
```

---

## 🆘 Поддержка

- Документация: [DEPLOYMENT.md](./DEPLOYMENT.md)
- GitHub: https://github.com/f2re/bg-remove-site/issues
- Platform: https://github.com/f2re/telegram-bots-platform

---

**Сделано с ❤️ для BG Remove**
