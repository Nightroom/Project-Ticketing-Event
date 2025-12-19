# Gunakan node versi terbaru sesuai yang Anda instal tadi
FROM node:24-alpine

# Tentukan direktori kerja di dalam container
WORKDIR /app

# Salin package.json dan install dependensi
COPY package*.json ./
RUN npm install

# Salin semua file kode program
COPY . .

# Ekspos port sesuai .env (port 3000)
EXPOSE 3000

# Jalankan aplikasi
CMD ["node", "index.js"]