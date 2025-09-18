FROM node:20 AS builder

ARG VITE_SYNC_LABEL
ARG VITE_SYNC_POLL_MS

ENV VITE_SYNC_LABEL=$VITE_SYNC_LABEL
ENV VITE_SYNC_POLL_MS=$VITE_SYNC_POLL_MS
ENV NODE_ENV=development

WORKDIR /builder

COPY . /builder

RUN npm install --include=dev \
    && npm run build

FROM node:20

ENV NODE_ENV=production
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /builder/dist/apps/web ./public
COPY apps/server ./apps/server

EXPOSE 38080

CMD ["node", "apps/server/index.js"]
