# RAB S-Curve Progress App

Aplikasi custom MVP untuk monitoring progres proyek berdasarkan RAB/BOQ:

- Data sumber RAB/target berasal dari **Google Sheet → Supabase**.
- Koordinator teknik login ke aplikasi dan **input progress aktual** tanpa akses ke Google Sheet.
- Dashboard menampilkan **Target Kumulatif, Aktual Kumulatif, Deviasi, SPI, dan Grafik Kurva S**.
- Deploy: **Cloudflare Pages + Functions**.
- Repo: siap dipush ke GitHub.

## Pendapat arsitektur

Arsitektur yang Anda pilih sudah tepat untuk MVP:

```text
Google Sheet  →  Supabase tables  →  Cloudflare Pages app
                                  ↘ progress_entries dari aplikasi
```

Rekomendasi pembagian tanggung jawab:

1. **Google Sheet** hanya untuk admin/estimator/planner mengelola RAB dan target baseline.
2. **Supabase** menjadi database utama, auth, RLS, dan API.
3. **Aplikasi Cloudflare** hanya digunakan koordinator untuk melihat dashboard dan input aktual.
4. **progress_entries** jangan ditulis balik ke Google Sheet dulu, agar aktual lapangan punya audit trail sendiri di database.

Untuk MVP, frontend langsung membaca/menulis Supabase menggunakan anon key + RLS. Cloudflare Pages Functions disiapkan untuk `/api/health` dan bisa dikembangkan nanti untuk export PDF/Excel, webhook, atau validasi server-side.

## Stack

- React + Vite
- Supabase JS
- Cloudflare Pages + Functions
- SVG native untuk grafik Kurva S

## Struktur folder

```text
src/                  React app
functions/api/         Cloudflare Pages Functions
supabase/schema.sql    Skema database dan RLS
.env.example           Contoh env
wrangler.toml          Konfigurasi Cloudflare
```

## Setup lokal

```bash
npm install
cp .env.example .env.local
npm run dev
```

Isi `.env.local`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Jika env belum diisi, app otomatis memakai **mode demo** dengan contoh data dari RAB lampiran.

## Setup Supabase

1. Buka Supabase → SQL Editor.
2. Jalankan file `supabase/schema.sql`.
3. Buat user koordinator di Authentication → Users.
4. Pastikan Google Sheet sync data ke table:
   - `projects`
   - `boq_items`
   - `progress_targets`
5. Aplikasi akan menulis aktual ke:
   - `progress_entries`

## Skema data minimal

### `projects`

| Kolom | Fungsi |
|---|---|
| `id` | UUID project |
| `name` | Nama project |
| `owner` | Owner/pemberi kerja |
| `location` | Lokasi |
| `contract_value` | Nilai kontrak/RAB total |
| `start_date`, `end_date` | Periode proyek |

### `boq_items`

| Kolom | Fungsi |
|---|---|
| `project_id` | Relasi project |
| `area` | Contoh: OK 1, OK 2 |
| `code` | Nomor item |
| `description` | Uraian pekerjaan |
| `unit` | Satuan |
| `volume` | Volume kontrak |
| `unit_price` | Harga satuan |
| `total_price` | Jumlah harga |
| `weight_percent` | Bobot item. Rumus: `total_price / contract_value x 100` |

### `progress_targets`

Target baseline kumulatif per periode.

| Kolom | Fungsi |
|---|---|
| `project_id` | Relasi project |
| `period_date` | Tanggal/minggu laporan |
| `planned_percent` | Target kumulatif 0-100 |

### `progress_entries`

Input aktual dari koordinator teknik.

| Kolom | Fungsi |
|---|---|
| `boq_item_id` | Item pekerjaan |
| `entry_date` | Tanggal opname |
| `actual_volume` | Volume aktual terpasang |
| `actual_percent` | Persentase aktual item 0-100 |
| `notes` | Catatan lapangan |
| `created_by` | User koordinator |

## Rumus yang dipakai

### Bobot item

```text
Bobot item (%) = Nilai item / Nilai total project x 100
```

### Aktual berbobot per item

```text
Aktual berbobot = Bobot item x Progress aktual item / 100
```

### Aktual kumulatif project

```text
Aktual kumulatif = SUM(Aktual berbobot semua item)
```

### Deviasi

```text
Deviasi = Aktual kumulatif - Target kumulatif
```

### SPI

```text
SPI = Aktual kumulatif / Target kumulatif
```

Interpretasi:

```text
SPI > 1  = lebih cepat dari rencana
SPI = 1  = sesuai rencana
SPI < 1  = terlambat
```

## Deploy ke Cloudflare Pages

### Opsi via dashboard Cloudflare

1. Push repo ke GitHub.
2. Cloudflare Dashboard → Workers & Pages → Create application → Pages.
3. Connect GitHub repository.
4. Build command:

```bash
npm run build
```

5. Build output directory:

```text
dist
```

6. Tambahkan environment variables:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

7. Deploy.

### Opsi CLI

```bash
npm run build
npx wrangler pages deploy dist
```

## Catatan integrasi Google Sheet → Supabase

Agar sinkronisasi stabil, setiap baris Google Sheet sebaiknya punya kolom unik, misalnya:

```text
source_row_id
```

Contoh format `source_row_id`:

```text
RSIBUNDA-OK1-001
RSIBUNDA-OK1-002
RSIBUNDA-OK2-001
```

Dengan begitu proses sync bisa `upsert`, bukan insert ulang.

Kolom minimal Google Sheet untuk BOQ:

```text
project_id atau project_code
area
code
description
unit
volume
unit_price
total_price
weight_percent
source_row_id
```

Kolom minimal Google Sheet untuk target:

```text
project_id atau project_code
period_date
planned_percent
```

## Roadmap setelah MVP

1. Approval progress: submit → approve/reject PM/QS.
2. Upload foto progres ke Supabase Storage.
3. Export laporan mingguan/bulanan PDF dan Excel.
4. Role `admin`, `koordinator`, `pm`, `qs`.
5. Project member per proyek agar koordinator hanya melihat proyeknya.
6. Import/parser RAB langsung dari Excel.
7. Forecast Kurva S berdasarkan trend aktual.

## Fitur tambahan: upload RAB dan export laporan

MVP sekarang sudah memiliki panel **File RAB Proyek**:

- Upload file `.xlsx`, `.xls`, `.csv`, atau `.pdf` untuk project yang sedang dipilih.
- Di produksi, file disimpan ke Supabase Storage bucket `rab-files`.
- Metadata file disimpan ke table `rab_uploads`.
- Export **Excel (.xls)** untuk data Kurva S, rekap item target/aktual, dan histori input koordinator.
- Export **PDF** melalui halaman printable: klik Export PDF lalu `Print / Save as PDF`.

Catatan implementasi:

1. Upload file saat ini adalah upload/arsip per proyek. Untuk parsing otomatis Excel/PDF menjadi `boq_items`, saya sarankan dibuat tahap berikutnya dengan worker/parser terpisah.
2. Excel lebih direkomendasikan untuk import data RAB karena struktur tabelnya stabil. PDF sebaiknya dianggap dokumen pendukung/arsip, karena hasil parsing PDF RAB sering tidak konsisten.
3. Untuk >100 project aktif, sebaiknya daftar project tetap disinkronkan dari Google Sheet ke table `projects`, lalu app hanya membaca dari Supabase.

### Format export Excel

File export berisi section:

```text
Header project
Data Kurva S: tanggal, target kumulatif, aktual kumulatif, deviasi
Rekap Item: area, kode, uraian, volume, nilai, bobot, aktual item, aktual berbobot
Histori Input Koordinator: tanggal, item, volume aktual, progress aktual, catatan
```

### Catatan untuk produksi

Agar upload berjalan, pastikan sudah menjalankan schema terbaru atau buat bucket manual:

```text
Supabase Dashboard → Storage → New bucket → rab-files → Private bucket
```

## Penyesuaian dengan Google Sheet PROJECT MONITORING

Aplikasi sudah disesuaikan dengan struktur sheet pada screenshot Anda. Table `projects` sekarang mendukung kolom monitoring berikut:

| Google Sheet | Supabase `projects` |
|---|---|
| KODE | `kode` |
| NO. SPI | `no_spi` |
| BULAN SPI | `bulan_spi` |
| TAHUN SP | `tahun_sp` |
| NAMA PROYEK | `nama_proyek` dan/atau `name` |
| PEKERJAAN | `pekerjaan` |
| JENIS | `jenis` |
| JENIS2 | `jenis2` |
| WILAYAH | `wilayah` |
| AREA | `project_area` |
| REKAN KERJA | `rekan_kerja` |
| DOK SPK/TERM PAYMENT | `dok_spk_term_payment` |
| STATUS | `status` |
| % PROGRESS | `sheet_progress_percent` |
| TGL BA/BAST | `tgl_ba_bast` |
| START | `start_date` |
| END | `end_date` |
| DURASI | `duration_days` |
| DELAY | `delay_days` |
| Tgl RETENSI | `tgl_retensi` |
| NAMA RELASI | `nama_relasi` |
| PIC SALES | `pic_sales` |
| PIC TEKNIK | `pic_teknik` |
| NILAI KONTRAK | `nilai_kontrak` dan/atau `contract_value` |

Di UI sekarang ada:

- Search proyek berdasarkan No SPI, nama proyek, rekan kerja, PIC, dll.
- Filter status proyek dari sheet: `PROGRESS`, `FINISH`, dll.
- Filter wilayah: `BARAT`, `TIMUR`, dll.
- Ringkasan proyek sesuai kolom sheet: Kode, No SPI, Nama Proyek, Status Sheet, Progress Sheet, Jenis, Wilayah/Area, Rekan Kerja, PIC Sales, PIC Teknik, Start-End, Delay, Nilai Kontrak.

Catatan: kolom `AREA` dari Google Sheet disimpan sebagai `project_area` agar tidak bentrok dengan `area` pada item RAB/BOQ, misalnya OK 1, OK 2, pekerjaan lantai, zona, dan sejenisnya.

Saya juga tambahkan contoh Google Apps Script:

```text
google-sheets/sync-project-monitoring-to-supabase.gs
```

Script ini membaca sheet `DB`, mapping kolom persis seperti screenshot, lalu `upsert` ke Supabase `projects` berdasarkan `source_row_id`.

## Template Excel RAB + Kurva S

Saya siapkan file template:

```text
Template_RAB_Kurva_S_Project_Monitoring.xlsx
```

Isi sheet:

1. `INFO_PROJECT` — metadata project sesuai Google Sheet PROJECT MONITORING.
2. `RAB_BOQ` — detail item RAB/BOQ, termasuk formula `total_price` dan `weight_percent`.
3. `TARGET_KURVA_S` — target progress periode dan kumulatif.
4. `PREVIEW_KURVA_S` — preview chart target Kurva S.
5. `INSTRUKSI` — panduan pengisian.

Kolom import utama:

- `INFO_PROJECT` → table `projects`
- `RAB_BOQ` → table `boq_items`
- `TARGET_KURVA_S` → table `progress_targets`


## Template RAB disesuaikan dengan file `Template_RAB.pdf`

Saya juga membuat template baru yang mengikuti layout PDF RAB Anda:

```text
Template_RAB_Sandana_Adjusted.xlsx
```

Struktur sheet utama `RAB` mengikuti format:

```text
Nama Proyek    :
No. SPI        :
Area / Wilayah :
Tanggal RAB    :

No | Uraian Pekerjaan | Volume | Satuan | Harga Satuan (Rp) | Jumlah Harga (Rp) | Bobot (%) | Keterangan
I   PEKERJAAN SIPIL
II  PEKERJAAN MEKANIKAL & ELEKTRIKAL
III PEKERJAAN INTERIOR & FINISHING
GRAND TOTAL
```

Tambahan agar siap import ke Supabase:

- Kolom `source_row_id` di sisi kanan untuk upsert item RAB.
- Sheet `TARGET_KURVA_S` untuk baseline target.
- Sheet `IMPORT_MAPPING` untuk mapping kolom ke Supabase.
- Sheet `INSTRUKSI` untuk panduan pengisian.

Aplikasi dan schema juga disiapkan untuk section bertingkat:

```text
boq_items.section_code
boq_items.section_name
boq_items.sort_order
```
