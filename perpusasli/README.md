# Library Management System - Microservices

Sistem Manajemen Perpustakaan berbasis microservices untuk mata kuliah Enterprise Application Integration (EAI).

## Struktur Proyek

Proyek ini terdiri dari tiga microservice dan satu frontend sederhana:

1. **Member Service** - Mengelola data anggota perpustakaan
2. **Book Service** - Mengelola data buku
3. **Loan Service** - Mengelola peminjaman buku
4. **Frontend** - Antarmuka pengguna sederhana menggunakan HTML, Tailwind CSS, dan JavaScript

## Teknologi yang Digunakan

- **Backend**: Node.js, Express.js, Axios
- **Frontend**: HTML, Tailwind CSS, JavaScript

## Cara Menjalankan Aplikasi

### Prasyarat

- Node.js (versi 14 atau lebih tinggi)
- npm (package manager)

### Langkah-langkah

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Jalankan semua services sekaligus**

   ```bash
   npm start
   ```

   Ini akan menjalankan semua microservices secara bersamaan menggunakan concurrently.

3. **Atau, jalankan services satu per satu**

   Jalankan Member Service:
   ```bash
   npm run start:member
   ```

   Jalankan Book Service:
   ```bash
   npm run start:book
   ```

   Jalankan Loan Service:
   ```bash
   npm run start:loan
   ```

4. **Buka frontend**

   Buka file `index.html` di browser Anda.

## Port Services

- Member Service: http://localhost:3001
- Book Service: http://localhost:3002
- Loan Service: http://localhost:3003

## API Endpoints

### Member Service

- `GET /members` - Mendapatkan daftar semua anggota
- `GET /members/:id` - Mendapatkan detail anggota berdasarkan ID
- `POST /members` - Membuat anggota baru
- `PUT /members/:id` - Memperbarui data anggota
- `DELETE /members/:id` - Menghapus anggota

### Book Service

- `GET /books` - Mendapatkan daftar semua buku
- `GET /books/:id` - Mendapatkan detail buku berdasarkan ID
- `POST /books` - Menambahkan buku baru
- `PUT /books/:id` - Memperbarui data buku
- `PUT /books/:id/loan-status` - Memperbarui status peminjaman buku
- `DELETE /books/:id` - Menghapus buku

### Loan Service

- `GET /loans` - Mendapatkan daftar semua peminjaman
- `GET /loans/:id` - Mendapatkan detail peminjaman berdasarkan ID
- `GET /loans/member/:memberId` - Mendapatkan peminjaman berdasarkan ID anggota
- `GET /loans/book/:bookId` - Mendapatkan peminjaman berdasarkan ID buku
- `GET /loans/status/overdue` - Mendapatkan daftar peminjaman yang terlambat
- `POST /loans` - Membuat peminjaman baru
- `PUT /loans/:id/return` - Mengembalikan buku
- `DELETE /loans/:id` - Menghapus data peminjaman

## Komunikasi Antar Service

Sistem ini menggunakan pola komunikasi synchronous HTTP menggunakan Axios. Terdapat dua pola komunikasi utama:

1. **Frontend ke Services** - Frontend memanggil API dari ketiga microservices
2. **Loan Service ke Services lain** - Loan Service memanggil API dari Member Service dan Book Service untuk memverifikasi data saat membuat peminjaman atau mengembalikan buku 