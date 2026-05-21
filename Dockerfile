# --- build stage ---
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- runtime stage ---
FROM nginx:1.27-alpine AS runtime

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

ENV PORT=10000
EXPOSE 10000

# nginx:alpine auto-runs envsubst on /etc/nginx/templates/*.template at startup
CMD ["nginx", "-g", "daemon off;"]
