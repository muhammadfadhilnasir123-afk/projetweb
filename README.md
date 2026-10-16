# FadhilStore - E-Commerce & Katalog Produk Digital & Fisik

Aplikasi web modern untuk katalog dan e-commerce produk digital (E-Book, Template UI, Preset, Source Code) serta produk fisik (Apparel, Gadget, Aksesoris) yang dibangun menggunakan **Next.js (App Router)**, **Tailwind CSS**, **TypeScript**, dan terintegrasi dengan **Supabase** (Database PostgreSQL & Autentikasi).

---

## 🌟 Fitur Utama

### 1. Autentikasi & Otorisasi Pengguna (Supabase Auth)
- **Login, Register, dan Logout** terintegrasi dengan Supabase Auth.
- **Proteksi Halaman Transaksi**: Halaman keranjang belanja dan checkout diproteksi dan mewajibkan pengguna login sebelum memproses pesanan.
- **Demo Mode Switcher**: Tombol cepat 1-klik di header untuk beralih antara akun *Pembeli* dan *Admin* untuk kemudahan demonstrasi tanpa konfigurasi manual.
- **Role-Based Access**: Role `admin` dan `customer` untuk pemisahan hak akses dashboard manajemen toko.

### 2. Katalog & Etalase Produk Interaktif (`/`)
- **Dukungan Produk Ganda**:
  - ⚡ **Produk Digital**: Akses unduhan instan langsung pada faktur (E-Book, Figma Kit, Preset, Source Code).
  - 📦 **Produk Fisik**: Membutuhkan alamat pengiriman lengkap, pemilihan kurir, dan pelacakan status gudang.
- **Pencarian Instan (Instant Search)**: Cari produk langsung berdasarkan judul atau deskripsi tanpa reload halaman.
- **Filter Kategori Dinamis**: Filter cepat *Semua, Produk Digital, Produk Fisik*, serta kategori khusus (*E-Book, Template UI, Preset, Source Code, Merchandise, Aksesoris*).
- **Pengurutan (Sort)**: Berdasarkan popularitas, harga terendah, harga tertinggi, dan rating bintang.
- **Modal Detail Cepat (Quick View Modal)**: Pratinjau spesifikasi dan fitur produk tanpa meninggalkan etalase.

### 3. Keranjang Belanja (Cart) & Checkout (`/cart`, `/checkout`)
- **Cart Slide-Over Drawer & Halaman Keranjang Penuh**: Tambah kuantitas, kurangi, atau hapus item.
- **Kalkulasi Biaya Cerdas**:
  - Gratis ongkir otomatis untuk produk digital.
  - Perhitungan ongkir ekspedisi untuk produk fisik.
- **Formulir Checkout Lengkap**:
  - Data diri pembeli (Nama, Email, WhatsApp).
  - Alamat pengiriman fisik (opsional jika hanya membeli produk digital).
  - Pilihan metode pembayaran: **QRIS Instan**, **Virtual Account BCA/Mandiri**, dan **Transfer Bank**.
- **Penyimpanan Transaksi ke Supabase**: Menyimpan data pemesanan ke tabel `orders` dan item rincian ke `order_items`.
- **Halaman Faktur & Unduhan (`/orders/[id]`)**: Rincian bukti transaksi, status terkini, dan tombol **"Unduh Berkas Digital"** langsung.

### 4. Dashboard Manajemen Admin (`/admin`)
- **Metrik Bisnis Real-time**: Total omset pendapatan, pesanan menunggu pembayaran, pesanan diproses, dan total katalog aktif.
- **Manajemen Pesanan Masuk**:
  - Filter pesanan berdasarkan status (*Menunggu Pembayaran, Diproses, Selesai, Dibatalkan*).
  - Ubah status pesanan secara langsung dengan pembaruan otomatis ke database Supabase.
  - Lihat detail lengkap pesanan, kurir, dan alamat pemesan.
- **Manajemen Katalog Produk (CRUD)**:
  - Tambah produk baru (digital / fisik) lengkap dengan link download, foto, harga, dan stok.
  - Edit dan hapus produk.
- **Tab Panduan Supabase**: Menampilkan panduan setup database dan skrip SQL yang siap dijalankan.

---

## 🗄️ Struktur Database Supabase & Skrip SQL

Skrip SQL lengkap tersedia di file [supabase-schema.sql](file:///d:/project%20fadhil/supabase-schema.sql) pada root proyek. Berisi:
- Tabel `products`
- Tabel `orders`
- Tabel `order_items`
- Tabel `profiles` (terhubung ke `auth.users`)
- Trigger otomatis pembuatan profil saat registrasi pengguna
- Konfigurasi **Row Level Security (RLS)** untuk proteksi pembacaan dan penulisan data
- Data benih (*seed data*) 8 produk digital & fisik siap pakai

### Langkah Menghubungkan Supabase:

1. Buka [Supabase Dashboard](https://supabase.com) dan buat proyek baru.
2. Buka menu **SQL Editor**, salin seluruh isi berkas [supabase-schema.sql](file:///d:/project%20fadhil/supabase-schema.sql), lalu klik **Run**.
3. Buka **Project Settings -> API**, salin **Project URL** dan **anon public key**.
4. Isi pada file `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```
5. Jalankan aplikasi, database Anda langsung terhubung!

---

## 🚀 Cara Menjalankan Proyek

```bash
# 1. Masuk ke direktori proyek
cd "d:\project fadhil"

# 2. Instal dependensi (jika belum)
npm install

# 3. Jalankan server pengembangan
npm run dev

# 4. Buka di browser
# http://localhost:3000
```
