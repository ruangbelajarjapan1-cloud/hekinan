# Masjid As-Sunnah Hekinan — Website

Website statis (HTML + Tailwind CDN + JS module). Cocok untuk GitHub Pages.

## Mode Admin (untuk membuka tombol ⚙️ Data)

Tombol **⚙️ Data** disembunyikan default. Akan muncul hanya jika:

1) URL mengandung `?admin=1`, atau  
2) Tekan **Ctrl + Alt + A** lalu masukkan kode: `as-sunnah-2025`

Sumber data yang Anda simpan lewat ⚙️ Data akan tersimpan di **localStorage** browser, dan berlaku untuk semua halaman.

## Google Sheet (CSV) — Pengumuman, Artikel, Kajian, Kegiatan

Prinsipnya sama:
1) Siapkan Google Sheet (tab) sesuai jenis data
2) **File → Share → Publish to the web**
3) Pilih tab yang tepat
4) Format: **CSV**
5) Copy link `.../pub?...&output=csv`
6) Tempel ke ⚙️ Data

### 1) Pengumuman (tab: `pengumuman`)
Kolom minimal:
- `title`, `date`, `desc`, `link`

### 2) Artikel (tab: `artikel`)
Kolom minimal:
- `title`, `tag`, `excerpt`, `link`

### 3) Kajian (tab: `kajian`)
Kolom minimal:
- `tanggal` (YYYY-MM-DD)
- `waktu` (HH:MM, opsional)
- `judul`
- `pemateri`
- `platform` (YouTube / Zoom / Google Drive / Offline)
- `link` (opsional)
- `poster` (opsional)
- `catatan` (opsional)
- `status` (`aktif` atau `arsip`)

### 4) Kegiatan (Agenda) (tab: `kegiatan`) — opsional
Kolom minimal:
- `tanggal` (YYYY-MM-DD)
- `waktu` (HH:MM, opsional)
- `title`
- `lokasi`
- `pemateri` (opsional)
- `desc` (opsional)
- `poster` (opsional)
- `link` (opsional)
- `status` (`aktif` atau `arsip`)

## Cara upload poster / foto / gambar

Karena website Anda statis, gambar harus punya **URL** publik. Ada 2 cara termudah:

### Opsi A (paling mudah & rapi): simpan gambar di repo (GitHub Pages)
1) Buat folder: `assets/posters/` dan `assets/foto/`
2) Upload file gambar ke folder itu
3) Di Google Sheet, isi kolom `poster` dengan path relatif:
   - `assets/posters/kajian-2026-01-10.jpg`

### Opsi B: Google Drive (tanpa edit repo)
1) Upload gambar ke Drive
2) Share → **Anyone with the link**
3) Ubah jadi direct link:
   - `https://drive.google.com/uc?export=view&id=FILE_ID`
