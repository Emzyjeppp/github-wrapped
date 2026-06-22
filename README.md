# 🎁 GitHub Wrapped — Your Year in Code

Aplikasi web interaktif satu halaman (SPA) bergaya **Spotify Wrapped** untuk melihat rangkuman kontribusi, aktivitas coding harian, statistik utama, dan kepribadian coding (*coding persona*) dari akun GitHub publik Anda. 

Dibangun secara premium dengan **React 19 + TypeScript + Vite + Tailwind CSS v4** dan didukung melodi latar belakang ambient yang dihasilkan secara dinamis menggunakan **Web Audio API** (tanpa dependensi audio eksternal!).

---

## ✨ Fitur Utama

- 🔍 **Instan Tanpa Login**: Cukup masukkan username GitHub publik Anda untuk melihat Wrapped.
- 🎭 **5 Slide Interaktif + Ringkasan**:
  - **Slide 1: Intro** – Sambutan interaktif dengan avatar profil Anda.
  - **Slide 2: Language Kingdom** – Visualisasi 5 bahasa pemrograman yang paling sering Anda gunakan dalam repositori publik.
  - **Slide 3: Pola Aktivitas** – Menganalisis waktu produktif Anda (Pagi, Siang, Sore, Malam).
  - **Slide 4: Angka & Kontribusi** – Jumlah repositori, bintang (*stars*), *forks*, dan estimasi total commit.
  - **Slide 5: Coding Persona** – Penentuan karakter developer secara otomatis (misal: *The Midnight Sorcerer*, *The Polyglot Architect*, *The Sunrise Champion*).
  - **Slide 6: Poster Rangkuman** – Kartu poster ringkasan yang menggabungkan seluruh statistik.
- 💾 **Download Poster HD**: Rancang kartu Wrapped Anda dan unduh langsung sebagai gambar PNG dengan kualitas tinggi (3x pixel ratio) yang siap dibagikan ke media sosial.
- ⚡ **Caching Cerdas**: Data profil disimpan di `localStorage` selama 1 jam untuk menghindari batas batas request API (*rate limits*) dari GitHub API publik.
- 🎵 **Ambient Synth Music**: Dilengkapi musik latar belakang lo-fi ambient buatan synthesizer internal yang menenangkan.
- 🎮 **Demo Mode**: Mencoba web secara instan dengan profil contoh tanpa memakan kuota API key.

---

## 🛠️ Stack Teknologi

- **Framework**: React 19 & TypeScript
- **Build Tool**: Vite (Super Cepat)
- **Styling**: Tailwind CSS v4 (CSS-first configuration)
- **Ikon**: Lucide React
- **Ekspor Gambar**: `html-to-image` (menggunakan pixel ratio tinggi untuk gambar HD)
- **Audio**: Web Audio API (Synthesizer Oscillator internal)

---

## 🚀 Memulai Proyek

### Prasyarat
Pastikan Anda telah menginstal [Node.js](https://nodejs.org/).

### Jalankan secara Lokal
1. Klon repositori ini atau masuk ke folder proyek:
   ```bash
   cd github-wrapped
   ```
2. Instal semua dependensi:
   ```bash
   npm install
   ```
3. Jalankan server pengembang lokal:
   ```bash
   npm run dev
   ```
4. Buka tautan lokal di browser Anda (biasanya `http://localhost:5173`).

### Build untuk Produksi
Gunakan perintah berikut untuk mengompilasi dan mengoptimalkan aplikasi untuk hosting statis (Vercel, GitHub Pages, Netlify):
```bash
npm run build
```

---

## 🌐 Panduan Deploy ke GitHub Pages

Proyek ini telah dikonfigurasi menggunakan relative paths (`base: "./"`), sehingga siap dihosting di subfolder repositori Anda tanpa perlu konfigurasi tambahan.

1. Buat repositori baru di GitHub dengan nama, contoh: `github-wrapped`.
2. Hubungkan git lokal dan push kode Anda ke GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: inisialisasi github-wrapped dengan ekspor poster hd"
   git branch -M main
   git remote add origin https://github.com/username/github-wrapped.git
   git push -u origin main
   ```
3. Aktifkan **GitHub Pages** di tab `Settings -> Pages` repositori Anda. Pilih sumber deployment dari branch `main` atau gunakan GitHub Actions (misal lewat action default Vite deployment).
