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

### Руководства по развертыванию:

1. **[NGINX-SSL-SETUP.md](./NGINX-SSL-SETUP.md)** - 📖 Подробное руководство по nginx + SSL
   - Пошаговая установка с нуля
   - Настройка Let's Encrypt SSL
   - Безопасность и firewall
   - **Рекомендуется для изучения**

2. **[setup-ssl.sh](./setup-ssl.sh)** - 🚀 Автоматическая установка nginx + SSL
   - Один скрипт для всей настройки
   - **Рекомендуется для быстрой установки**

3. **[DEPLOYMENT.md](./DEPLOYMENT.md)** - 📋 Полное руководство по развертыванию
4. **[PLATFORM_INTEGRATION.md](./PLATFORM_INTEGRATION.md)** - 🔧 Интеграция с telegram-bots-platform
5. **[QUICKFIX.md](./QUICKFIX.md)** - ⚡ Быстрое развертывание (5 минут)

### Основные файлы:

- `deploy.sh` - автоматический скрипт развертывания
- `setup-ssl.sh` - автоматическая настройка nginx + SSL
- `Dockerfile` - Docker образ для Next.js
- `docker compose.yml` - конфигурация Docker Compose
- `.env.production.example` - пример переменных окружения
- `nginx.conf.example` - пример конфигурации Nginx

---

## 🔧 Управление

```bash
# Директория проекта
cd /opt/telegram-bots-platform/websites/bg-remove

# Логи
docker compose logs -f

# Перезапуск
docker compose restart

# Обновление
git pull && docker compose up -d --build
```

---

## 🆘 Поддержка

- Документация: [DEPLOYMENT.md](./DEPLOYMENT.md)
- GitHub: https://github.com/f2re/bg-remove-site/issues
- Platform: https://github.com/f2re/telegram-bots-platform

---

**Сделано с ❤️ для BG Remove**
