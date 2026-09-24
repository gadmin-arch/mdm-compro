-- 024_bilingual_careers_seed.down.sql
-- Rollback bilingual careers changes (restore monolingual titles)

BEGIN;


UPDATE careers SET
  title = 'Safety Officer (K3)',
  department = 'Eksekusi Proyek - Tim K3',
  location = 'Gresik, Jawa Timur',
  summary = 'Memastikan seluruh aktivitas pekerjaan yang dilakukan tenaga kerja di lapangan berjalan sesuai dengan standar Keselamatan dan Kesehatan Kerja (K3) yang ditetapkan oleh perusahaan dan regulasi ketenagakerjaan.',
  updated_at = now()
WHERE slug = 'safety-officer-gresik';

UPDATE careers SET
  title = 'Project Support Admin (Magang)',
  department = 'Administrasi Proyek',
  location = 'Gresik, Jawa Timur',
  summary = 'Membantu pengelolaan dan monitoring administrasi proyek, mulai dari rekapitulasi data, pengarsipan dokumen teknis, hingga penyusunan Berita Acara Serah Terima (BAST).',
  updated_at = now()
WHERE slug = 'project-support-admin';

UPDATE careers SET
  title = 'Arsiparis & Tata Kelola Dokumen',
  department = 'Business Support & Development',
  location = 'Surabaya, Jawa Timur',
  summary = 'Mengelola, merapikan, dan mendigitalisasi arsip dokumen perusahaan agar tersimpan aman, sistematis, dan mudah diakses saat dibutuhkan.',
  updated_at = now()
WHERE slug = 'arsiparis';

UPDATE careers SET
  title = 'IT Web Developer (Magang)',
  department = 'Business Support & Development',
  location = 'Surabaya, Jawa Timur',
  summary = 'Mendukung pelaksanaan pengembangan aplikasi berbasis web secara menyeluruh, mulai dari front-end, back-end API, hingga pengelolaan database.',
  updated_at = now()
WHERE slug = 'it-intern';

UPDATE careers SET
  title = 'Project Administrator',
  department = 'Administrasi Proyek',
  location = 'Gresik, Jawa Timur',
  summary = 'Mengelola dan memonitor administrasi proyek, mulai dari awal hingga proyek dinyatakan selesai secara administratif.',
  updated_at = now()
WHERE slug = 'project-admin-gresik';

UPDATE careers SET
  title = 'Operator Kelistrikan & Pemeliharaan',
  department = 'Eksekusi Proyek - Operasi & Pemeliharaan',
  location = 'Surabaya, Jawa Timur',
  summary = 'Menjamin ketersediaan dan keandalan sistem kelistrikan melalui pengoperasian, inspeksi, dan pemeliharaan rutin peralatan elektrikal, dengan tetap mengutamakan aspek keselamatan kerja dan efisiensi pekerjaan.',
  updated_at = now()
WHERE slug = 'electrical-operator-surabaya';

UPDATE careers SET
  title = 'Sales Engineer - Segmen Retail & Integrator',
  department = 'Sales & Marketing',
  location = 'Sidoarjo, Jawa Timur',
  summary = 'Meningkatkan penjualan produk elektrikal melalui pemasaran aktif dan perluasan customer base di segmen Retail and Integrator, dengan pelaporan kinerja yang terukur serta dukungan penuh terhadap kegiatan Sales and Marketing perusahaan.',
  updated_at = now()
WHERE slug = 'retail-sales-engineer';

UPDATE careers SET
  title = 'Junior Estimator Kelistrikan',
  department = 'Engineering',
  location = 'Sidoarjo, Jawa Timur',
  summary = 'Menyediakan estimasi biaya yang akurat untuk proyek kontraktor listrik guna optimasi layanan yang berkualitas tinggi dengan proses efektif dan efisien.',
  updated_at = now()
WHERE slug = 'junior-estimator';

COMMIT;
