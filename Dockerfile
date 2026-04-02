FROM node:22-bookworm-slim

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci

COPY . .

RUN chmod +x scripts/start-web.sh && npm run prisma:generate && npm run build

EXPOSE 3000

CMD ["./scripts/start-web.sh"]
