FROM node:20-alpine AS dev-deps
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=dev-deps /app/node_modules ./node_modules
COPY .  .
RUN npm run build

FROM nginx:1.23.3 as prod
EXPOSE 80
COPY --from=build /app/dist/frontend-clinica/browser/* /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]