LABEL authors="abbzew"

FROM docker.io/node:18-alpine as deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /usr/src/app
COPY dist/libs/db/prisma ./
COPY dist/src/package*.json ./
RUN npm install --omit=dev
RUN npx prisma generate --generator client

FROM docker.io/node:18-alpine as runner
RUN apk add --no-cache \
      libc6-compat \
      openssl \
      curl \
      dumb-init \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      dbus \
      openrc && rc-update add dbus

ENV PORT 3000
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=deps /usr/src/app/package.json ./package.json
COPY dist/src .
RUN chown -R node:node .
USER node
EXPOSE 3000

CMD npx prisma migrate deploy && dumb-init node main.js
