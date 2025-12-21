# Build aşaması
FROM node:18-alpine as build

WORKDIR /app

# Dependencies
COPY package*.json ./
RUN npm install

# Kaynak kodları kopyala
COPY . .

# Build argument - API URL
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

# Build
RUN npm run build

# Production aşaması
FROM nginx:alpine

# Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Build dosyalarını kopyala
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]