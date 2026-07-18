<?php
// Pengecek arsitektur server — pengganti `uname -m` tanpa Terminal.
// Cara pakai:
//   1. Upload file ini ke folder public_html lewat File Manager.
//   2. Buka https://multidayamitra.co.id/cek-server.php di browser.
//   3. Lihat baris "Arsitektur".
//      x86_64  -> binary mdm-api yang sudah dibuat SUDAH PAS (amd64).
//      aarch64 -> server ARM, minta Claude build ulang untuk arm64.
//   4. HAPUS file ini setelah selesai (jangan dibiarkan online).
header('Content-Type: text/plain; charset=utf-8');
echo "Arsitektur : " . php_uname('m') . "\n";
echo "OS         : " . php_uname('s') . " " . php_uname('r') . "\n";
echo "PHP        : " . PHP_VERSION . "\n";
