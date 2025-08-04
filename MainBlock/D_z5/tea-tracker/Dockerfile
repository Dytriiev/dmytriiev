# Стадия сборки
FROM node:20-alpine AS builder

WORKDIR /app

# 1. Копируем только файлы зависимостей
COPY package.json package-lock.json ./

# 2. Чистая установка зависимостей
RUN npm ci

# 3. Копируем только исходный код и конфиги
COPY src/ src/
COPY tsconfig*.json ./
COPY nest-cli.json ./

# 4. Собираем проект
RUN npm run build

# Финальный образ
FROM gcr.io/distroless/nodejs20-debian11:nonroot

WORKDIR /app

# 5. Копируем только необходимое
COPY --from=builder --chown=nonroot:nonroot /app/package*.json ./
COPY --from=builder --chown=nonroot:nonroot /app/node_modules ./node_modules
COPY --from=builder --chown=nonroot:nonroot /app/dist ./dist

# 6. Запускаем приложение
ENTRYPOINT ["/nodejs/bin/node"]
CMD ["dist/main.js"]