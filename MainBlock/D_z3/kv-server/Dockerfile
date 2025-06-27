###############################################################################
# ---------- 1-ша стадія: builder (тільки install + optional tests) ----------
###############################################################################
FROM node:20-alpine AS builder

WORKDIR /app

# кешується, поки package*.json не зміниться
COPY package*.json ./
RUN npm ci --omit=dev           # production-only deps

# додамо код і (опційно) запустимо тести/lint
COPY src ./src
# RUN npm test && npm run lint  # ← раптом потрібні тести

###############################################################################
# ---------- 2-га стадія: runtime (мінімальний образ) ------------------------
###############################################################################
FROM alpine:3.19

# 1) системні бібліотеки, 2) non-root user
RUN apk add --no-cache nodejs tini \
    && adduser -D -h /home/node node

WORKDIR /home/node
USER node

# копіюємо node_modules з builder-шару (≈ 30–40 МБ)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./

EXPOSE 3000

# tini = правильний PID 1, forward signals
ENTRYPOINT ["/sbin/tini","--"]
CMD [ "node", "src/index.js"]
