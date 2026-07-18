#!/usr/bin/env bash
# Cross-compile backend Go jadi binary Linux statis untuk cPanel.
# Jalankan DARI LAPTOP (butuh Go 1.26+). Hasil: deploy/cpanel/mdm-api
#
#   bash deploy/cpanel/build-backend.sh            # default: linux/amd64
#   ARCH=arm64 bash deploy/cpanel/build-backend.sh # kalau server cPanel ARM
#
# Cek arsitektur server cPanel dengan `uname -m` di Terminal:
#   x86_64  → amd64 (default)
#   aarch64 → arm64
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ARCH="${ARCH:-amd64}"

echo "▸ Cross-compile backend → linux/$ARCH ..."
cd "$ROOT/Backend"
CGO_ENABLED=0 GOOS=linux GOARCH="$ARCH" \
  go build -trimpath -ldflags="-s -w" -o "$ROOT/deploy/cpanel/mdm-api" ./cmd/api

echo "✓ Selesai:"
file "$ROOT/deploy/cpanel/mdm-api"
ls -lh "$ROOT/deploy/cpanel/mdm-api"
