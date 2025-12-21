FROM node:18-alpine

WORKDIR /app

# Package dosyalarını kopyala
COPY package*.json ./

# Dependencies yükle
RUN npm install --production

# Tüm dosyaları kopyala
COPY . .

# Uploads klasörünü oluştur
RUN mkdir -p uploads

# Port
EXPOSE 3001

# Başlat
CMD ["npm", "start"]