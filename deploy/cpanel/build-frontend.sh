#!/usr/bin/env bash
# Build & package frontend Next.js jadi satu folder siap-upload ke cPanel.
# Jalankan DARI LAPTOP (butuh Node 20+ & pnpm). Hasil: deploy/cpanel/frontend-dist/
#
#   bash deploy/cpanel/build-frontend.sh
#
# Lalu upload seluruh isi frontend-dist/ ke Application Root di cPanel.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
FE="$ROOT/FrontEnd"
OUT="$ROOT/deploy/cpanel/frontend-dist"

# Deteksi cara memanggil pnpm: pnpm langsung > corepack > npx corepack.
if command -v pnpm >/dev/null 2>&1; then
  PNPM="pnpm"
elif command -v corepack >/dev/null 2>&1; then
  PNPM="corepack pnpm"
else
  PNPM="npx -y corepack pnpm"
fi
echo "▸ Build Next.js (standalone) via: $PNPM"
cd "$FE"
$PNPM install --frozen-lockfile
$PNPM build

echo "▸ Merakit bundle standalone ke $OUT ..."
rm -rf "$OUT"
mkdir -p "$OUT"

# server.js + node_modules minimal + .next server chunks
cp -R "$FE/.next/standalone/." "$OUT/"
# aset statis (JS/CSS) — standalone tidak menyalin ini otomatis
mkdir -p "$OUT/.next/static"
cp -R "$FE/.next/static/." "$OUT/.next/static/"
# file publik (gambar, logo, favicon)
if [ -d "$FE/public" ]; then
  mkdir -p "$OUT/public"
  cp -R "$FE/public/." "$OUT/public/"
fi

# Startup file untuk Passenger cPanel (lihat komentar di dalamnya)
cp "$ROOT/deploy/cpanel/passenger-app.js" "$OUT/passenger-app.js"

echo "✓ Selesai. Upload seluruh isi folder ini ke cPanel:"
echo "  $OUT"
du -sh "$OUT"
