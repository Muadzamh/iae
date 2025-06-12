# Gunakan base image Node.js yang ringan
FROM node:18-alpine

# Tetapkan direktori kerja di dalam container
WORKDIR /app

# Salin file package.json dan package-lock.json terlebih dahulu
# Ini memanfaatkan cache Docker, sehingga 'npm install' tidak selalu dijalankan jika tidak ada perubahan
COPY package*.json ./

# Install semua dependencies
RUN npm install

# Salin SEMUA file dari context (misal: dari ./backend/member-service) ke WORKDIR (/app)
# Perintah ini menggantikan semua 'COPY' yang salah sebelumnya.
COPY . .

# Perintah untuk menjalankan aplikasi saat container dimulai
CMD [ "node", "app.js" ]