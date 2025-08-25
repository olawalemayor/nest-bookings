FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN npm ci || npm install
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=base /app .
ENV NODE_ENV=production
EXPOSE 3000 9229
CMD [ "sh", "-c", "npm run migrate:run && node dist/main.js" ]
