FROM node:20-alpine AS builder

WORKDIR /app
COPY . .


RUN npm install && npm run build


FROM gcr.io/distroless/nodejs20-debian11:nonroot
COPY --from=builder --chown=nonroot:nonroot /app/dist ./dist

ENTRYPOINT ["/nodejs/bin/node"]
CMD ["dist/server.mjs"]