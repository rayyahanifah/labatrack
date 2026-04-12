# 💰 LabaTrack

> Aplikasi Fullstack Web untuk tracking laba dan manajemen keuangan UMKM secara praktis, otomatis, dan berbasis Cloud.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

---

## 📖 Deskripsi

**LabaTrack** adalah solusi digital yang membantu pemilik UMKM memantau dan menganalisis keuntungan usaha mereka secara *real-time*. Dikembangkan dengan arsitektur **Modern Web**, LabaTrack mengubah pencatatan manual yang berisiko menjadi sistem otomatis yang akurat guna mendukung skalabilitas bisnis UMKM Indonesia.

---

## ✨ Fitur Utama

- 📊 **Dashboard Finansial:** Ringkasan laba harian dan riwayat transaksi terbaru yang terupdate secara instan.
- 🛒 **Smart Cashier:** Sistem penjumlahan transaksi otomatis untuk efisiensi di titik penjualan.
- 📈 **Kalkulator HPP:** Penghitungan Harga Pokok Penjualan otomatis untuk menentukan margin keuntungan yang tepat.
- 📦 **Manajemen Produk:** Pengelolaan data inventaris (CRUD) yang terintegrasi langsung dengan database cloud.
- 🔐 **Autentikasi JWT:** Sistem Login & Register yang aman untuk melindungi data finansial toko.
- ☁️ **Cloud Infrastructure:** Data tersimpan secara aman di database PostgreSQL melalui layanan Supabase.

---

## 🛠️ Teknologi yang Digunakan

| Layer | Teknologi |
|-------|-----------|
| **Frontend** | React.js (Vite) |
| **Backend** | Node.js & Express.js |
| **Database** | Supabase (PostgreSQL) |
| **Deployment** | Vercel (Production Ready) |

---

## 🚀 Dokumentasi & Langkah Replikasi (Local Setup)

Ikuti langkah berikut untuk menjalankan LabaTrack di lingkungan lokal Anda menggunakan database Supabase yang sudah ada:

### 1. Clone Repositori
# Clone Frontend
git clone https://github.com/rayyahanifah/labatrack.git

# Clone Backend
git clone https://github.com/rayyahanifah/labatrack-backend.git

### 2. Konfigurasi Backend (Express.js)
Masuk ke folder backend untuk mengatur koneksi server dan database:

1. `cd labatrack-backend`
2. `npm install`
3. Buat file **.env** dan masukkan konfigurasi berikut:

```env
# API Key dari Supabase Dashboard (Settings > API)
SUPABASE_URL=link_url_supabase_anda
SUPABASE_ANON_KEY=key_anon_supabase_anda

# Rahasia untuk enkripsi Token Login
JWT_SECRET=kode_rahasia_jwt_anda

# Port server lokal
PORT=3000
```

3. Konfigurasi Frontend (React)
Buka terminal baru untuk menjalankan antarmuka aplikasi:

1. `cd labatrack`
2. `npm install`
3. Buat file .env di root folder frontend agar bisa terhubung ke backend:

```env
VITE_API_URL=http://localhost:3000
```
Jalankan aplikasi: `npm run dev`

### 👥 Tim Pengembang (Fullstack Squad)
Proyek ini dikembangkan oleh:
Rayyah Anifah - Project Manager & Backend
Dimas Putra Madiadipura - Frontend Developer
Reza Aditya Shaputra - Backend Developer
Muhammad Azzam Wahyudin - Frontend Developer & Mockup
Raja Adi Fahrezi - Frontend Developer

### 📄 Lisensi
Proyek ini dibuat untuk keperluan Capstone Project (Dicoding). Bebas digunakan dan dimodifikasi untuk tujuan pembelajaran.
