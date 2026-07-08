# Multi-stage Dockerfile для монорепозитория
# Этап 1: Сборка статических файлов
FROM node:20-alpine AS builder
WORKDIR /app

# Копируем файлы описания зависимостей для эффективного кэширования Docker слоев
COPY package.json ./
COPY packages/document-core/package.json ./packages/document-core/
COPY packages/project-codec/package.json ./packages/project-codec/
COPY apps/web/package.json ./apps/web/

# Устанавливаем зависимости монорепозитория
RUN npm ci

# Копируем исходный код
COPY tsconfig.base.json eslint.config.js ./
COPY packages/document-core ./packages/document-core
COPY packages/project-codec ./packages/project-codec
COPY apps/web ./apps/web

# Собираем все пакеты и SPA приложение
RUN npm run build

# Этап 2: Запуск легковесного веб-сервера Nginx
FROM nginx:alpine
COPY ops/docker/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]