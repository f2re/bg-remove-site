# Dockerfile для BG Remove Website (Next.js)
# Оптимизирован для production развертывания

# Этап 1: Установка зависимостей
FROM node:20-alpine AS deps

# Установка libc6-compat для совместимости
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Копируем файлы зависимостей
COPY package.json package-lock.json* ./

# Устанавливаем все зависимости (включая dev для сборки)
RUN npm ci

# Этап 2: Сборка приложения
FROM node:20-alpine AS builder

WORKDIR /app

# Копируем node_modules из предыдущего этапа
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Переменные окружения для сборки
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Сборка Next.js приложения
RUN npm run build

# Этап 3: Production образ
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Создаем пользователя nextjs
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копируем публичные файлы
COPY --from=builder /app/public ./public

# Создаем директорию .next и устанавливаем права
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Копируем standalone сборку
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Переключаемся на пользователя nextjs
USER nextjs

# Открываем порт
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Запускаем приложение
CMD ["node", "server.js"]
