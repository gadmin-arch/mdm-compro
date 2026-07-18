#!/bin/bash
# Watchdog + starter untuk backend Go (mdm-api) di cPanel.
#
# Fungsi: kalau mdm-api belum jalan, jalankan; kalau sudah jalan, diam.
# Dipanggil oleh cron tiap beberapa menit + saat @reboot, jadi backend otomatis
# hidup kembali setelah server restart atau kalau proses mati.
#
# SETUP:
#   1. Letakkan file ini, binary `mdm-api`, dan `.env` dalam satu folder,
#      mis. /home/CPANELUSER/mdm-api/
#   2. Edit APP_DIR di bawah agar sesuai path absolutnya.
#   3. chmod +x start-api.sh mdm-api
#   4. Tambah cron (cPanel → Cron Jobs):
#        @reboot           /home/CPANELUSER/mdm-api/start-api.sh
#        */3 * * * *       /home/CPANELUSER/mdm-api/start-api.sh
#
# Cek log: tail -f /home/CPANELUSER/mdm-api/api.log

APP_DIR="/home/CPANELUSER/mdm-api"     # <-- GANTI ke path absolut folder ini
BIN="$APP_DIR/mdm-api"
ENV_FILE="$APP_DIR/.env"
LOG="$APP_DIR/api.log"
PIDFILE="$APP_DIR/api.pid"

cd "$APP_DIR" || exit 1

# Sudah jalan? (cek PID di pidfile masih hidup)
if [ -f "$PIDFILE" ] && kill -0 "$(cat "$PIDFILE")" 2>/dev/null; then
    exit 0
fi

# Muat environment dari .env
if [ -f "$ENV_FILE" ]; then
    set -a
    # shellcheck disable=SC1090
    . "$ENV_FILE"
    set +a
fi

# Jalankan di background, lepas dari terminal, tulis log & pidfile
nohup "$BIN" >> "$LOG" 2>&1 &
echo $! > "$PIDFILE"
