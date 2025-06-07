FROM node:18-alpine

WORKDIR /app

# Copy package.json dari root project
COPY package*.json ./

# Install dependensi
RUN npm install

# Copy konfigurasi database
COPY config ./config

# Copy kode admin-service
COPY admin-service ./admin-service

# Expose port yang digunakan oleh admin-service
EXPOSE 3004

# Command untuk menjalankan aplikasi
CMD ["node", "admin-service/app.js"]