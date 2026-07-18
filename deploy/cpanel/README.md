# Deploy MDM Compro (v2) ke cPanel

Panduan menjalankan aplikasi ini di cPanel sebagai **`v2.multidayamitra.co.id`**,
tanpa mengganggu website lama di `multidayamitra.co.id`.

---

## 0. Kenapa subdomain, bukan `/v2`?

Pakai **subdomain** (`v2.multidayamitra.co.id`), jangan path `/v2`. Di cPanel,
subdomain = situs terpisah total, jadi website Softaculous lama tidak tersentuh.
Path `/v2` mengharuskan Next.js di-`basePath`-kan + aturan proxy `.htaccess` yang
gampang bentrok dengan situs lama. Subdomain jauh lebih aman & tanpa utak-atik.

## Arsitektur di cPanel

Aplikasi ini 3 komponen, tapi hanya **1 yang diekspos ke internet**:

```
Browser ──HTTPS──► v2.multidayamitra.co.id  (Next.js via "Setup Node.js App")
                          │
                          │ Next mem-proxy /api/v1/public/* (rewrite bawaan)
                          ▼
                   127.0.0.1:8080  (backend Go "mdm-api", lokal saja)
                          │
                          ▼
                   PostgreSQL cPanel (localhost:5432)

   Media (gambar upload) → disimpan sebagai file di folder data/media
   (STORAGE_DRIVER=local — tidak perlu MinIO/S3)
```

Tidak butuh nginx, MinIO, maupun MailHog di cPanel.

## Yang harus tersedia di cPanel (kamu sudah punya ✓)

- **Setup Node.js App** (Node 20+). Cek versi maksimal saat buat app.
- **PostgreSQL** (phpPgAdmin ✓).
- **Cron Jobs** (untuk menjaga backend Go tetap hidup).
- Idealnya **Terminal/SSH** (mempermudah, tapi tidak wajib — bisa lewat cron).

---

## LANGKAH 1 — Buat subdomain

cPanel → **Domains** / **Subdomains** → buat `v2`. Catat **Document Root**-nya,
mis. `/home/CPANELUSER/v2.multidayamitra.co.id`.
Aktifkan SSL: cPanel → **SSL/TLS Status** → jalankan **AutoSSL** untuk subdomain v2.

## LANGKAH 2 — Buat database PostgreSQL

cPanel → **PostgreSQL Databases** (atau Database Wizard):
1. Buat database, mis. `mdm` → jadi `CPANELUSER_mdm`.
2. Buat user, mis. `mdm` → jadi `CPANELUSER_mdm`, beri password kuat.
3. **Add user to database** dengan **ALL PRIVILEGES**.

Catat 3 nilai ini untuk `DATABASE_URL` nanti: **nama db**, **user**, **password**.

## LANGKAH 3 — Import skema database

cPanel → **phpPgAdmin** → pilih database `CPANELUSER_mdm` → tab **SQL** →
buka file [`schema-all.sql`](schema-all.sql), salin seluruh isinya, tempel, **Execute**.

> ⚠️ Jika baris pertama `CREATE EXTENSION ... pgcrypto` error "permission denied":
> PostgreSQL 13+ sudah punya `gen_random_uuid()` bawaan. Hapus/beri komentar
> baris itu lalu jalankan ulang. (pgcrypto di skema ini hanya dipakai untuk UUID.)

Skema ini sekaligus membuat **admin bawaan**:
- Email: `irfanzuhdiabdillah@gmail.com`
- Password: yang kamu pakai saat development.
- Kalau lupa password → lihat bagian **Reset password admin** di bawah.

## LANGKAH 4 — Upload & jalankan backend Go

1. Buat folder, mis. lewat File Manager: `/home/CPANELUSER/mdm-api/`
2. Upload ke folder itu:
   - `mdm-api`         (binary Linux — sudah ikut di folder deploy ini)
   - `start-api.sh`    (watchdog)
   - `.env`            (salin dari [`backend.env.example`](backend.env.example), isi nilainya)
3. Edit `.env`:
   - `DATABASE_URL` → isi user/password/nama db dari Langkah 2.
   - `JWT_SECRET`   → buat acak: `openssl rand -base64 48`
   - `MEDIA_DIR`    → `/home/CPANELUSER/mdm-api/data/media`
   - Ganti semua `CPANELUSER` dengan username cPanel-mu.
4. Edit `start-api.sh`: ubah `APP_DIR` ke `/home/CPANELUSER/mdm-api`.
5. Beri izin eksekusi (Terminal, atau File Manager → Permissions → 0755):
   ```
   chmod +x /home/CPANELUSER/mdm-api/mdm-api /home/CPANELUSER/mdm-api/start-api.sh
   ```
6. cPanel → **Cron Jobs**, tambahkan dua baris:
   ```
   @reboot        /home/CPANELUSER/mdm-api/start-api.sh
   */3 * * * *    /home/CPANELUSER/mdm-api/start-api.sh
   ```
   Cron `*/3` = watchdog: kalau backend mati, dihidupkan lagi dalam ≤3 menit.
7. Jalankan sekali manual untuk start langsung (Terminal):
   ```
   /home/CPANELUSER/mdm-api/start-api.sh
   tail -f /home/CPANELUSER/mdm-api/api.log     # cek "api listening"
   ```
   Tanpa Terminal: tunggu maksimal 3 menit, cron akan menjalankannya.

**Uji backend hidup** (dari Terminal):
```
curl -s http://127.0.0.1:8080/api/v1/public/navigation | head -c 200
```
Harus keluar JSON, bukan error koneksi.

## LANGKAH 5 — Build & upload frontend

**Di laptop** (butuh Node 20+ & pnpm):
```
bash deploy/cpanel/build-frontend.sh
```
Hasilnya folder `deploy/cpanel/frontend-dist/`. Upload **seluruh isinya** ke
Application Root subdomain v2 (Langkah 6). Cara upload: zip folder itu →
upload via File Manager → Extract di server (jauh lebih cepat dari upload per-file).

## LANGKAH 6 — Setup Node.js App (frontend)

cPanel → **Setup Node.js App** → **Create Application**:
- **Node.js version**: 20 atau lebih tinggi.
- **Application mode**: Production.
- **Application root**: folder tempat kamu extract `frontend-dist`,
  mis. `v2.multidayamitra.co.id` (samakan dengan Document Root subdomain).
- **Application URL**: `v2.multidayamitra.co.id`.
- **Application startup file**: `passenger-app.js`.

Lalu di bagian **Environment variables**, tambahkan semua var dari
[`frontend.env.example`](frontend.env.example) (satu per satu, nama & nilai).

Klik **Create**, lalu **Restart**. Kalau frontend-dist sudah lengkap, tidak perlu
"Run NPM Install" (node_modules minimal sudah dibundel oleh mode standalone).

## LANGKAH 7 — Uji

Buka `https://v2.multidayamitra.co.id`:
- Homepage tampil + menu dropdown jalan → frontend OK.
- Gambar/logo muncul → media (proxy ke backend) OK.
- Buka `https://v2.multidayamitra.co.id/admin` → login dengan admin bawaan →
  backend + database OK.

---

## Reset password admin (kalau lupa)

Butuh hash bcrypt dari password baru. Minta saya generate-kan (paling gampang),
atau kalau punya Terminal dengan Go/htpasswd. Lalu di phpPgAdmin → SQL:
```sql
UPDATE users
SET password_hash = '<HASH_BCRYPT_BARU>'
WHERE email = 'irfanzuhdiabdillah@gmail.com';
```

## Update aplikasi ke versi baru nanti

- **Frontend**: jalankan ulang `build-frontend.sh` di laptop → upload ulang isi
  `frontend-dist` (timpa) → **Restart** app. (Wajib build ulang kalau mengubah
  var `NEXT_PUBLIC_*`.)
- **Backend**: cross-compile ulang (lihat `build-backend.sh`) → upload timpa
  `mdm-api` → hentikan proses lama: `kill $(cat mdm-api/api.pid)` → cron/`start-api.sh`
  akan menghidupkan versi baru.

## Troubleshooting

| Gejala | Kemungkinan sebab & solusi |
|---|---|
| Halaman 502 / "App failed" | Startup file salah, atau var env kurang. Cek log di panel Node.js App. |
| Konten kosong / "gagal memuat" | Backend Go mati. `tail api.log`, cek `DATABASE_URL`, jalankan `start-api.sh`. |
| Gambar tidak muncul | `NEXT_PUBLIC_CMS_API_BASE_URL` harus `/api/v1/public` (path relatif), lalu build ulang frontend. |
| Login admin gagal terus | Cek backend hidup & `JWT_SECRET` ≥ 32 karakter (produksi menolak start kalau pendek). |
| `curl :8080` connection refused | Binary tidak jalan. Cek izin eksekusi & arsitektur server (`uname -m` harus `x86_64`). |
| Server pakai ARM (`aarch64`) | Minta saya build ulang binary untuk `arm64`. |

## Kalau cPanel tidak sanggup

Kalau ternyata Node terlalu tua, PostgreSQL dibatasi, atau proses Go terus dimatikan
oleh host: sewa **VPS kecil**. Project ini punya `docker-compose.yml`, jadi di VPS
cukup `make dev` dan semua jalan. DNS subdomain v2 tinggal diarahkan (A record) ke IP VPS.
