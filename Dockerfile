FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine

COPY nginx.conf.template /etc/nginx/templates/default.conf.template

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# nginx:alpine image automatically runs envsubst on /etc/nginx/templates/*.template
# and outputs to /etc/nginx/conf.d/ — so API keys from env vars are injected at startup.
# See: https://hub.docker.com/_/nginx ("Using environment variables in nginx configuration")
CMD ["nginx", "-g", "daemon off;"]
