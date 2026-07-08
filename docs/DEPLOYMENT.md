# Deployment Guide

## Production Checklist
- Set `APP_ENV=production` — the API **refuses to boot** with a default/short `JWT_SECRET` (generate: `openssl rand -base64 48`).
- Change the seeded owner password immediately after first login (Settings → Change password), or reset it via forgot-password.
- Revoke any SMTP app password that was ever committed to git, and set fresh SMTP credentials only via environment variables / untracked `.env`.
- Use managed PostgreSQL (Neon, Supabase, or a hardened server) with TLS (`sslmode=require`).
- Media storage: `STORAGE_DRIVER=s3` (MinIO/S3/R2) **or** `STORAGE_DRIVER=local` + `MEDIA_DIR` on shared hosting.
- Configure HTTPS at the proxy; set `CMS_COOKIE_SECURE=true` for the frontend.
- Run migrations `001 → 003` before starting the API.
- Built-in protections you get out of the box: per-IP rate limits on auth endpoints, database-backed account lockout (5 failed logins → 15 min), verification-code attempt caps (5 → 30 min lock), invite-only registration (owner account only), password policy (10+ chars, letters + numbers), auth audit logging in `audit_logs`.

## Runtime Environment
API:

```bash
APP_ENV=production
HTTP_ADDR=127.0.0.1:8081        # bind locally when Next.js proxies to it
DATABASE_URL=postgres://...?sslmode=require
JWT_SECRET=<random 32+ chars>
FRONTEND_ORIGINS=https://www.domainanda.co.id
SITE_URL=https://www.domainanda.co.id
STORAGE_DRIVER=local            # or s3
MEDIA_DIR=/home/USER/apps/mdm-api/data/media
SMTP_HOST=mail.domainanda.co.id
SMTP_PORT=587
SMTP_USER=cms@domainanda.co.id
SMTP_PASSWORD=<from cPanel Email Accounts>
EMAIL_FROM=MDM CMS <cms@domainanda.co.id>
```

Frontend (Next.js):

```bash
CMS_API_BASE_URL=http://127.0.0.1:8081/api/v1/public   # server-side, internal
NEXT_PUBLIC_CMS_API_BASE_URL=/api/v1/public            # relative → works on any domain
NEXT_PUBLIC_SITE_URL=https://www.domainanda.co.id
CMS_COOKIE_SECURE=true
```

`NEXT_PUBLIC_*` values are baked in at build time — using the **relative** public API path means you can move the app from the test subdomain to the main domain without rebuilding.

---

# Panduan Deploy ke cPanel (Bahasa Indonesia)

Aplikasi ini terdiri dari **3 bagian**: API (binary Go), website (Next.js/Node), dan database (PostgreSQL). Skenario yang dipakai: **WordPress tetap jalan di domain utama**, aplikasi baru dites di **subdomain**, lalu ditukar setelah kamu yakin — WordPress disimpan sebagai cadangan.

## 0. Cek dulu kemampuan hosting kamu

Buka cPanel dan pastikan ada:

| Fitur cPanel | Untuk apa | Wajib? |
|---|---|---|
| **Setup Node.js App** (Application Manager) | Menjalankan Next.js | Wajib |
| **SSH Access / Terminal** | Upload & menjalankan API Go | Wajib |
| **Cron Jobs** | Auto-start API saat server restart | Wajib |
| PostgreSQL | Database | Opsional — kalau tidak ada, pakai Neon/Supabase (gratis) |

> **Kalau "Setup Node.js App" atau SSH tidak ada** di hosting kamu, shared hosting itu tidak bisa menjalankan stack ini. Lompat ke bagian **Alternatif: VPS + Docker** di bawah — cPanel tetap dipakai untuk DNS, WordPress tidak terganggu sama sekali.

## 1. Siapkan database (sekali saja)

Paling gampang pakai **Neon.tech** (PostgreSQL gratis, managed):

1. Daftar di neon.tech → Create project → salin connection string (`postgres://...sslmode=require`).
2. Dari laptop, jalankan migrasi:
   ```bash
   psql "postgres://...connection-string..." -f Backend/migrations/001_init.up.sql
   psql "postgres://...connection-string..." -f Backend/migrations/002_user_access.up.sql
   psql "postgres://...connection-string..." -f Backend/migrations/003_security.up.sql
   ```

## 2. Build di laptop

```bash
# API — binary Linux
cd Backend
GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -o mdm-api ./cmd/api

# Frontend — Next.js standalone
cd ../FrontEnd
npx -y pnpm@10.11.0 install
CMS_API_BASE_URL=http://127.0.0.1:8081/api/v1/public \
NEXT_PUBLIC_CMS_API_BASE_URL=/api/v1/public \
NEXT_PUBLIC_SITE_URL=https://baru.domainanda.co.id \
npx -y pnpm@10.11.0 build
```

Hasil frontend yang di-upload: folder `.next/standalone` (berisi `server.js`), ditambah `.next/static` dan `public`.

## 3. Buat subdomain untuk testing

cPanel → **Domains → Create a New Domain** → `baru.domainanda.co.id` (WordPress di domain utama tidak tersentuh). Aktifkan **AutoSSL** untuk subdomain ini (SSL/TLS Status → Run AutoSSL).

## 4. Upload & jalankan API Go

Lewat SSH / File Manager, buat struktur:

```
~/apps/mdm-api/
  mdm-api          (binary hasil build, chmod +x)
  .env             (isi variabel API — lihat Runtime Environment di atas)
  data/media/      (folder upload, STORAGE_DRIVER=local)
  run.sh
```

`run.sh`:

```bash
#!/bin/sh
cd "$HOME/apps/mdm-api"
if pgrep -f "mdm-api" > /dev/null; then exit 0; fi
set -a; . ./.env; set +a
nohup ./mdm-api >> api.log 2>&1 &
```

`chmod +x run.sh mdm-api`, jalankan `./run.sh`, lalu tes: `curl http://127.0.0.1:8081/healthz` → harus `{"status":"ok"}`.

cPanel → **Cron Jobs**, tambah dua entri:
- `@reboot /home/USER/apps/mdm-api/run.sh`
- `*/5 * * * * /home/USER/apps/mdm-api/run.sh` (penjaga: hidupkan lagi kalau mati)

> API sengaja di-bind ke `127.0.0.1:8081` — tidak bisa diakses dari internet langsung; semua lalu lintas lewat Next.js. Ini mengecilkan permukaan serangan.

## 5. Pasang frontend Next.js

1. Upload isi `.next/standalone` ke `~/apps/mdm-frontend/` (termasuk `server.js`), lalu `.next/static` → `~/apps/mdm-frontend/.next/static`, dan `public/` → `~/apps/mdm-frontend/public/`.
2. cPanel → **Setup Node.js App → Create Application**:
   - Node.js version: 20 atau lebih baru
   - Application mode: Production
   - Application root: `apps/mdm-frontend`
   - Application URL: `baru.domainanda.co.id`
   - Application startup file: `server.js`
3. Di halaman aplikasi yang sama, tambahkan **Environment Variables** frontend (lihat Runtime Environment; `CMS_COOKIE_SECURE=true`, `PORT` diisi otomatis oleh Passenger).
4. Restart App.

## 6. Uji keamanan sebelum go-live (checklist)

- [ ] `https://baru.domainanda.co.id` tampil, halaman CMS jalan.
- [ ] Login `/admin/login` → **langsung ganti password akun owner** (password seed tidak boleh dipakai di produksi).
- [ ] Lupa password: minta kode → email masuk → reset sukses.
- [ ] Salah password 5× → akun terkunci 15 menit (pesan "Too many attempts").
- [ ] Salah kode verifikasi 5× → terkunci 30 menit.
- [ ] Buka `Users` → undang user baru (hanya owner yang bisa) → email undangan masuk → aktivasi dengan password 10+ karakter.
- [ ] Upload gambar di page builder → file muncul di `data/media/`.
- [ ] `curl -I http://IP-server:8081` dari luar → **tidak bisa diakses** (connection refused).

## 7. Cutover — tukar WordPress dengan situs baru (WordPress jadi cadangan)

1. **Backup WordPress dulu**: File Manager → compress folder `public_html` → simpan zip; phpMyAdmin → Export database WP. Simpan keduanya di tempat aman.
2. Buat subdomain `lama.domainanda.co.id` dengan document root folder WordPress, lalu update Site URL WP (wp-config: `WP_HOME`/`WP_SITEURL` → `https://lama.domainanda.co.id`). WordPress tetap hidup di sana sebagai cadangan — **tidak dihapus**.
3. cPanel → Setup Node.js App → edit aplikasi → **Application URL** ganti ke domain utama (`www.domainanda.co.id`).
4. Update env: `FRONTEND_ORIGINS` + `SITE_URL` (API) dan `NEXT_PUBLIC_SITE_URL` (frontend) ke domain utama → restart API + App. (Karena `NEXT_PUBLIC_CMS_API_BASE_URL` relative, **tidak perlu build ulang**; kalau kamu ganti `NEXT_PUBLIC_SITE_URL`, build ulang hanya memengaruhi metadata URL — boleh dijadwalkan belakangan.)
5. Jalankan AutoSSL untuk domain utama, tes ulang checklist di atas.
6. Kalau ada masalah darurat: kembalikan Application URL Node ke subdomain dan arahkan domain utama kembali ke folder WordPress — WordPress kamu masih utuh.

## Alternatif: VPS + Docker (kalau shared hosting tidak mendukung)

Repo ini sudah punya `docker-compose.yml`. Sewa VPS kecil (mis. 1–2 GB RAM), lalu:

```bash
git clone <repo> && cd mdm-compro
cp .env.example .env   # isi JWT_SECRET, SMTP, dsb.
docker compose up -d --build
```

Di cPanel cukup tambah **DNS A record**: `baru.domainanda.co.id → IP VPS`. WordPress tidak tersentuh. Cutover = ganti A record domain utama ke IP VPS (dan WP dipindah ke subdomain seperti langkah 7). Pasang HTTPS di VPS dengan Caddy/Traefik/certbot.

## CI/CD Recommendation
GitHub Actions should run:
1. Frontend install, lint, typecheck, build.
2. Backend `go test ./...` and `go vet ./...`.
3. Migration up/down test against disposable PostgreSQL.
4. Docker image build.
5. Deployment after image and migration checks pass.

## Rollback
- Roll back application image first.
- Roll back database only with reviewed down migrations.
- Never run destructive rollback against production without a snapshot.
