import type { Career } from "@/lib/cms"

export type BilingualCareerEntry = {
  id?: string
  slug: string
  title: { en: string; id: string }
  department: { en: string; id: string }
  location: { en: string; id: string }
  employmentType: string
  summary: { en: string; id: string }
  description: { en: string; id: string }
  applyUrl?: string
  deadline?: string
  publishedAt?: string
}

export const BILINGUAL_CAREER_CATALOG: Record<string, BilingualCareerEntry> = {
  "safety-officer-gresik": {
    id: "cffc54d6-fb14-4546-a68e-570cc900129d",
    slug: "safety-officer-gresik",
    title: {
      en: "Safety Officer (HSE)",
      id: "Safety Officer (K3)",
    },
    department: {
      en: "Project Execution - HSE Team",
      id: "Eksekusi Proyek - Tim K3",
    },
    location: {
      en: "Gresik, East Java",
      id: "Gresik, Jawa Timur",
    },
    employmentType: "contract",
    summary: {
      en: "Ensure all on-site contractor and manpower activities strictly adhere to Occupational Health, Safety, and Environment (HSE) standards established by company policy and statutory regulations.",
      id: "Memastikan seluruh aktivitas pekerjaan yang dilakukan tenaga kerja di lapangan berjalan sesuai dengan standar Keselamatan dan Kesehatan Kerja (K3) yang ditetapkan oleh perusahaan dan regulasi ketenagakerjaan.",
    },
    description: {
      id: `<h2>Kualifikasi</h2>
<ul>
  <li><p>Lulusan Sarjana (S1/D4) jurusan Kesehatan Masyarakat (peminatan K3), Teknik Industri, Keselamatan &amp; Kesehatan Kerja, atau bidang teknik terkait. Fresh graduate dipersilakan melamar.</p></li>
  <li><p>Memiliki sertifikasi Ahli K3 Umum dari Kemnaker RI yang masih berlaku.</p></li>
  <li><p>Berpengalaman magang atau bekerja di proyek industri manufaktur, kelistrikan, atau konstruksi sipil/elektrikal.</p></li>
  <li><p>Memahami Job Safety Analysis (JSA), Hazard Identification Risk Assessment &amp; Determining Control (HIRADC), dan Permit to Work (PTW).</p></li>
  <li><p>Mampu berkomunikasi secara tegas, adaptif, solutif, serta memiliki inisiatif tinggi dalam pencegahan insiden kerja.</p></li>
</ul>
<h2>Deskripsi Pekerjaan</h2>
<ol>
  <li><p>Melakukan pengawasan, inspeksi keselamatan harian, dan patroli K3 di area kerja proyek guna memastikan kepatuhan APD dan SOP.</p></li>
  <li><p>Memimpin pelaksanaan Safety Induction bagi pekerja baru dan memandu Tool Box Meeting (TBM) harian sebelum pekerjaan dimulai.</p></li>
  <li><p>Menyusun dan melengkapi administrasi dokumen HSE, laporan harian/mingguan K3, serta audit keselamatan kerja.</p></li>
  <li><p>Melakukan investigasi insiden, pelaporan near-miss, serta memastikan tindakan korektif dan preventif (CAPA) dijalankan dengan efektif.</p></li>
</ol>`,
      en: `<h2>Qualifications</h2>
<ul>
  <li><p>Bachelor's Degree (S1/D4) in Public Health (Occupational Health &amp; Safety), Industrial Engineering, Environmental Safety, or relevant technical engineering. Fresh graduates are welcome to apply.</p></li>
  <li><p>Holds a valid General OHS Expert (Ahli K3 Umum) certification issued by the Ministry of Manpower (Kemnaker RI).</p></li>
  <li><p>Prior internship or working experience in industrial manufacturing, electrical construction, or infrastructure projects.</p></li>
  <li><p>Proficient in Job Safety Analysis (JSA), HIRADC, and Permit to Work (PTW) procedures.</p></li>
  <li><p>Strong verbal communication, proactive leadership, decisiveness, and risk prevention mindset.</p></li>
</ul>
<h2>Job Description</h2>
<ol>
  <li><p>Conduct daily on-site safety inspections, hazard observations, and PPE compliance audits across project zones.</p></li>
  <li><p>Lead safety inductions for newly onboarded technicians and conduct daily pre-job Tool Box Meetings (TBM).</p></li>
  <li><p>Maintain HSE documentation, daily/weekly safety logs, accident registers, and regulatory compliance records.</p></li>
  <li><p>Investigate incidents and near-misses, formulate root-cause analyses, and implement corrective and preventive action plans (CAPA).</p></li>
</ol>`,
    },
    applyUrl: "https://forms.gle/UyEz7fK458QGhJ6r5",
    deadline: "2026-08-28T16:59:00Z",
    publishedAt: "2026-08-18T09:00:00Z",
  },

  "project-support-admin": {
    id: "ef32daaf-4f50-4f3f-9ae2-a58a02c07bfa",
    slug: "project-support-admin",
    title: {
      en: "Project Support Admin (Internship)",
      id: "Project Support Admin (Magang)",
    },
    department: {
      en: "Project Administration",
      id: "Administrasi Proyek",
    },
    location: {
      en: "Gresik, East Java",
      id: "Gresik, Jawa Timur",
    },
    employmentType: "internship",
    summary: {
      en: "Assist in managing and tracking project documentation from initiation through administrative project handover under the supervision of the project administration team.",
      id: "Membantu pengelolaan dan monitoring administrasi proyek, mulai dari rekapitulasi data, pengarsipan dokumen teknis, hingga penyusunan Berita Acara Serah Terima (BAST).",
    },
    description: {
      id: `<h2>Kualifikasi</h2>
<ul>
  <li><p>Mahasiswa tingkat akhir atau lulusan Diploma / Sarjana jurusan Teknik Elektro, Teknik Industri, Manajemen Bisnis, atau Administrasi Perkantoran. Terbuka untuk fresh graduate.</p></li>
  <li><p>Diutamakan memiliki pengalaman organisasi atau magang di bidang administrasi operasional / proyek.</p></li>
  <li><p>Memahami alur dasar manajemen proyek teknik dan siklus administrasi pengadaan.</p></li>
  <li><p>Terampil mengoperasikan Microsoft Office (khususnya Excel dan Word) serta Google Workspace.</p></li>
  <li><p>Memiliki kemampuan komunikasi yang baik, inisiatif tinggi, teliti, dan terstruktur dalam bekerja.</p></li>
  <li><p>Bersedia menjalani program magang selama 3 hingga 6 bulan di lokasi proyek Gresik.</p></li>
</ul>
<h2>Deskripsi Pekerjaan</h2>
<ol>
  <li><p>Mengumpulkan, merapikan, dan memverifikasi data operasional untuk penyusunan laporan kemajuan pekerjaan proyek.</p></li>
  <li><p>Melakukan monitoring dan pengarsipan dokumen Berita Acara Serah Terima (BAST) dan kelengkapan penagihan proyek.</p></li>
  <li><p>Membantu koordinasi pengadaan material lapangan dan pencatatan surat masuk-keluar proyek.</p></li>
</ol>`,
      en: `<h2>Qualifications</h2>
<ul>
  <li><p>Final-year student or recent graduate with a Diploma or Bachelor's degree in Electrical Engineering, Industrial Engineering, Business Administration, or Office Administration.</p></li>
  <li><p>Prior organizational or internship experience in project/operational administration is advantageous.</p></li>
  <li><p>Familiarity with basic project management lifecycle and documentation procedures.</p></li>
  <li><p>Proficient in Microsoft Office (especially Excel and Word) and Google Workspace tools.</p></li>
  <li><p>Strong attention to detail, proactive mindset, and systematic work organization.</p></li>
  <li><p>Available for a 3 to 6-month internship on-site in Gresik.</p></li>
</ul>
<h2>Job Description</h2>
<ol>
  <li><p>Gather, verify, and organize operational field data for project progress milestone reporting.</p></li>
  <li><p>Track and maintain project handover certificates (BAST) and billing administrative archives.</p></li>
  <li><p>Assist in coordinating field material purchase requests and project correspondence filing.</p></li>
</ol>`,
    },
    applyUrl: "https://forms.gle/UyEz7fK458QGhJ6r5",
    deadline: "2026-08-28T16:59:00Z",
    publishedAt: "2026-08-18T09:00:00Z",
  },

  "arsiparis": {
    id: "45e8dc69-b7c8-4224-931f-92ebcf5b914d",
    slug: "arsiparis",
    title: {
      en: "Records & Document Controller (Archivist)",
      id: "Arsiparis & Tata Kelola Dokumen",
    },
    department: {
      en: "Business Support & Development",
      id: "Business Support & Development",
    },
    location: {
      en: "Surabaya, East Java",
      id: "Surabaya, Jawa Timur",
    },
    employmentType: "part_time",
    summary: {
      en: "Organize, catalog, and digitize corporate archives to ensure confidential records are safely preserved, neatly indexed, and readily retrievable.",
      id: "Mengelola, merapikan, dan mendigitalisasi arsip dokumen perusahaan agar tersimpan aman, sistematis, dan mudah diakses saat dibutuhkan.",
    },
    description: {
      id: `<h2>Kualifikasi</h2>
<ul>
  <li><p>Minimal siswa SMK jurusan Administrasi Perkantoran / Kearsipan, atau mahasiswa (Diploma / Sarjana) semester akhir di bidang terkait.</p></li>
  <li><p>Memiliki pengetahuan tentang sistem kearsipan fisik dan tata kelola dokumen digital (electronic filing system).</p></li>
  <li><p>Mampu bekerja secara teliti, rapi, terstruktur, serta menjaga kerahasiaan data perusahaan.</p></li>
  <li><p>Familiar menggunakan scanner, Google Drive, dan Microsoft Excel untuk inventarisasi dokumen.</p></li>
</ul>
<h2>Deskripsi Pekerjaan</h2>
<ol>
  <li><p>Menginventarisasi, menata, dan mengarsipkan dokumen keuangan, faktur pembayaran, dan berkas pengadaan barang/jasa.</p></li>
  <li><p>Melakukan digitalisasi (scanning &amp; indexing) berkas legalitas, data SDM, dan kontrak kerja sama perusahaan.</p></li>
  <li><p>Mencatat dan mengontrol alur surat masuk dan keluar di Departemen Business Support &amp; Development.</p></li>
  <li><p>Memastikan sistem peminjaman dan pengembalian dokumen arsip berjalan tertib dan terdokumentasi.</p></li>
</ol>`,
      en: `<h2>Qualifications</h2>
<ul>
  <li><p>Vocational High School (SMK) graduate or final-year student (Diploma/Bachelor's) majoring in Archival Science, Office Administration, or Information Management.</p></li>
  <li><p>Foundational knowledge of physical indexing systems and digital document management.</p></li>
  <li><p>High meticulousness, neat organizational habits, and strict adherence to corporate confidentiality.</p></li>
  <li><p>Familiar with document scanning, cloud file repositories (Google Drive), and spreadsheet inventory indexing.</p></li>
</ul>
<h2>Job Description</h2>
<ol>
  <li><p>Catalog, index, and securely store financial records, vendor invoices, and procurement files.</p></li>
  <li><p>Digitize, OCR-scan, and classify corporate agreements, HR dossiers, and compliance filings.</p></li>
  <li><p>Log incoming and outgoing corporate correspondence for the Business Support &amp; Development department.</p></li>
  <li><p>Maintain document checkout logs and facilitate quick retrieval for internal stakeholders and auditors.</p></li>
</ol>`,
    },
    applyUrl: "https://forms.gle/UyEz7fK458QGhJ6r5",
    deadline: "2026-08-28T16:59:00Z",
    publishedAt: "2026-08-18T09:00:00Z",
  },

  "it-intern": {
    id: "d9ddbf90-7067-4a0e-8bce-7d41cbc56e3a",
    slug: "it-intern",
    title: {
      en: "IT Web Developer Intern",
      id: "IT Web Developer (Magang)",
    },
    department: {
      en: "Business Support & Development",
      id: "Business Support & Development",
    },
    location: {
      en: "Surabaya, East Java",
      id: "Surabaya, Jawa Timur",
    },
    employmentType: "internship",
    summary: {
      en: "Support end-to-end internal web application development and maintenance, spanning front-end UI, back-end APIs, and database management.",
      id: "Mendukung pelaksanaan pengembangan aplikasi berbasis web secara menyeluruh, mulai dari front-end, back-end API, hingga pengelolaan database.",
    },
    description: {
      id: `<h2>Kualifikasi</h2>
<ul>
  <li><p>Mahasiswa Sarjana (S1) semester akhir atau lulusan baru jurusan Teknik Informatika, Sistem Informasi, Ilmu Komputer, atau bidang terkait.</p></li>
  <li><p>Memahami konsep pengembangan web modern (HTML, CSS/Tailwind, JavaScript/TypeScript, RESTful API).</p></li>
  <li><p>Familiar dengan framework front-end (React/Next.js/Vue) dan bahasa back-end (Node.js/Go/PHP) serta relational database (PostgreSQL/MySQL).</p></li>
  <li><p>Memiliki portofolio atau pengalaman proyek pengembangan aplikasi web yang dapat ditunjukkan.</p></li>
  <li><p>Mampu menggunakan Git untuk version control dan kolaborasi tim.</p></li>
  <li><p>Memiliki kemampuan problem-solving, kemauan belajar tinggi, dan bersedia magang selama 3 - 6 bulan.</p></li>
</ul>
<h2>Deskripsi Pekerjaan</h2>
<ol>
  <li><p>Membantu perancangan antarmuka pengguna (UI/UX) dan pengembangan fitur aplikasi internal perusahaan.</p></li>
  <li><p>Membangun dan mengintegrasikan RESTful API untuk menghubungkan antarmuka web dengan database.</p></li>
  <li><p>Melakukan pengujian fitur, debugging bug, dan troubleshooting isu teknis pada aplikasi.</p></li>
  <li><p>Mengelola skema database dan alur branching repository menggunakan Git.</p></li>
  <li><p>Menyusun dokumentasi teknis dan panduan penggunaan sistem untuk pengguna internal.</p></li>
</ol>`,
      en: `<h2>Qualifications</h2>
<ul>
  <li><p>Final-year undergraduate student or fresh graduate majoring in Computer Science, Informatics, Information Systems, or related software engineering fields.</p></li>
  <li><p>Solid grasp of modern web fundamentals (HTML, CSS/Tailwind, JavaScript/TypeScript, RESTful architecture).</p></li>
  <li><p>Familiar with modern frontend frameworks (React/Next.js/Vue), backend technologies (Node.js/Go/PHP), and relational databases (PostgreSQL/MySQL).</p></li>
  <li><p>Showcaseable portfolio or past project repository demonstrating web development competence.</p></li>
  <li><p>Proficient in version control workflows using Git.</p></li>
  <li><p>Strong problem-solving capability, eager to learn new tech stacks, and committed to a 3 to 6-month internship.</p></li>
</ul>
<h2>Job Description</h2>
<ol>
  <li><p>Assist in developing responsive frontend interfaces and implementing new features for internal enterprise tools.</p></li>
  <li><p>Develop and integrate REST API endpoints linking frontend clients with backend databases.</p></li>
  <li><p>Perform unit testing, code debugging, and issue reproduction for continuous stability.</p></li>
  <li><p>Support database schema maintenance, migrations, and Git branch management.</p></li>
  <li><p>Author technical documentation, API specifications, and end-user system manuals.</p></li>
</ol>`,
    },
    applyUrl: "https://forms.gle/UyEz7fK458QGhJ6r5",
    deadline: "2026-08-28T16:59:00Z",
    publishedAt: "2026-08-18T09:00:00Z",
  },

  "project-admin-gresik": {
    id: "5971bb76-59a5-482d-9701-ed9913267894",
    slug: "project-admin-gresik",
    title: {
      en: "Project Administrator",
      id: "Project Administrator",
    },
    department: {
      en: "Project Administration",
      id: "Administrasi Proyek",
    },
    location: {
      en: "Gresik, East Java",
      id: "Gresik, Jawa Timur",
    },
    employmentType: "contract",
    summary: {
      en: "Manage, monitor, and audit turnkey project administration from site mobilization through final contractual closure and project sign-off.",
      id: "Mengelola dan memonitor administrasi proyek, mulai dari awal hingga proyek dinyatakan selesai secara administratif.",
    },
    description: {
      id: `<h2>Kualifikasi</h2>
<ul>
  <li><p>Pendidikan Diploma atau Sarjana (D3/S1) bidang Teknik Elektro, Teknik Industri, Automasi, atau Manajemen Bisnis / Administrasi.</p></li>
  <li><p>Diutamakan memiliki pengalaman kerja 1–2 tahun sebagai Project Admin di proyek kontraktor elektrikal, mekanikal, atau konstruksi.</p></li>
  <li><p>Memahami siklus administrasi proyek: Purchase Order (PO), Work Order (SPK), Berita Acara (BAST), dan penagihan progress (invoicing).</p></li>
  <li><p>Sangat mahir mengoperasikan Microsoft Excel (VLOOKUP, Pivot, fungsi data), Word, dan Google Workspace.</p></li>
  <li><p>Memiliki kemampuan komunikasi profesional, teliti, disiplin tenggat waktu, dan terbiasa bekerja secara terstruktur.</p></li>
  <li><p>Bersedia ditempatkan di lokasi proyek di wilayah Gresik dan sekitarnya.</p></li>
</ul>
<h2>Deskripsi Pekerjaan</h2>
<ol>
  <li><p>Menyiapkan, merekap, dan mengontrol kelengkapan dokumen administrasi penagihan dan laporan pekerjaan berkala.</p></li>
  <li><p>Memantau dan memperbarui progress Berita Acara Serah Terima (BAST) dan persetujuan pengawas proyek.</p></li>
  <li><p>Berkoordinasi dengan Project Manager dan tim purchasing terkait pengadaan material serta surat jalan lapangan.</p></li>
  <li><p>Memastikan pencatatan jam kerja manpower, timesheet teknisi, dan biaya operasional proyek tercatat rapi.</p></li>
</ol>`,
      en: `<h2>Qualifications</h2>
<ul>
  <li><p>Diploma or Bachelor's Degree (D3/S1) in Electrical Engineering, Industrial Engineering, Automation, or Business/Office Administration.</p></li>
  <li><p>1-2 years of proven experience as a Project Administrator in electrical contracting, MEP, or industrial construction.</p></li>
  <li><p>Comprehensive understanding of project cycles: Purchase Orders (PO), Work Orders (SPK), Milestones, and Progress Billing.</p></li>
  <li><p>Advanced proficiency in Microsoft Excel (formulas, data modeling, pivot tables) and Google Workspace.</p></li>
  <li><p>Excellent cross-departmental communication skills, detail-oriented execution, and deadline management.</p></li>
  <li><p>Willing to be stationed on-site at project facilities in Gresik and surrounding areas.</p></li>
</ul>
<h2>Job Description</h2>
<ol>
  <li><p>Compile, verify, and monitor project invoicing dossiers, milestone accomplishment reports, and client endorsements.</p></li>
  <li><p>Manage and track issuance of Project Handover Certificates (BAST) with client engineering representatives.</p></li>
  <li><p>Coordinate closely with Project Managers and procurement teams for on-site material dispatch and logistics documentation.</p></li>
  <li><p>Administer site manpower timesheets, equipment logs, and field petty cash reconciliations.</p></li>
</ol>`,
    },
    applyUrl: "https://forms.gle/h7nR7q4FAByDKjPj9",
    deadline: "2026-08-28T16:59:00Z",
    publishedAt: "2026-08-18T09:00:00Z",
  },

  "electrical-operator-surabaya": {
    id: "9385d819-7da5-48a6-a2ac-57c8ca0a34bd",
    slug: "electrical-operator-surabaya",
    title: {
      en: "Electrical Operations & Maintenance Technician",
      id: "Operator Kelistrikan & Pemeliharaan",
    },
    department: {
      en: "Project Execution - Operations & Maintenance",
      id: "Eksekusi Proyek - Operasi & Pemeliharaan",
    },
    location: {
      en: "Surabaya, East Java",
      id: "Surabaya, Jawa Timur",
    },
    employmentType: "contract",
    summary: {
      en: "Ensure continuous availability and reliability of industrial electrical systems through operation, daily inspection, and routine preventive servicing of panels, switchgear, and transformers.",
      id: "Menjamin ketersediaan dan keandalan sistem kelistrikan melalui pengoperasian, inspeksi, dan pemeliharaan rutin peralatan elektrikal, dengan tetap mengutamakan aspek keselamatan kerja dan efisiensi pekerjaan.",
    },
    description: {
      id: `<h2>Kualifikasi</h2>
<ul>
  <li><p>Minimal lulusan SMK Jurusan Teknik Ketenagalistrikan / Teknik Elektro atau Diploma (D3) Teknik Listrik.</p></li>
  <li><p>Berpengalaman minimal 1 tahun di bidang instalasi kelistrikan industri, panel tegangan rendah/menengah, atau teknisi maintenance pabrik.</p></li>
  <li><p>Diutamakan memiliki sertifikasi kompetensi kelistrikan (K3 Listrik Kemnaker atau sertifikat kompetensi BNSP).</p></li>
  <li><p>Mampu membaca single line diagram (SLD), wiring diagram, dan menggunakan instrumen ukur (Multimeter, Megger, Clamp Meter).</p></li>
  <li><p>Bersedia bekerja secara shift dan siap bekerja di area ketinggian dengan mematuhi SOP keselamatan kerja.</p></li>
  <li><p>Berdomisili di wilayah Surabaya, Sidoarjo, Gresik, atau sekitarnya.</p></li>
</ul>
<h2>Deskripsi Pekerjaan</h2>
<ol>
  <li><p>Melaksanakan pengoperasian, pengecekan berkala, dan pencatatan parameter kelistrikan pada panel MDP, SDP, dan kubikel MV.</p></li>
  <li><p>Melakukan tindakan pemeliharaan preventif, pembersihan busbar, uji resistansi isolasi, dan pengetatan sambungan baut.</p></li>
  <li><p>Melakukan penanganan pertama (troubleshooting) saat terjadi gangguan trip atau anomali parameter daya.</p></li>
  <li><p>Membuat pelaporan logbook harian, dokumentasi kondisi visual peralatan, dan penggunaan spare part secara sistematis.</p></li>
</ol>`,
      en: `<h2>Qualifications</h2>
<ul>
  <li><p>Vocational High School (SMK) graduate in Electrical Power Engineering or Diploma (D3) in Electrical Engineering.</p></li>
  <li><p>Minimum 1 year hands-on experience in industrial electrical maintenance, switchgear operation, or industrial panel servicing.</p></li>
  <li><p>Certification in Electrical Safety (K3 Listrik) or BNSP electrical competency certification is strongly preferred.</p></li>
  <li><p>Proficient in reading Single Line Diagrams (SLD), schematic drawings, and operating electrical test tools (Megger, Multimeter, Clamp Meter).</p></li>
  <li><p>Willing to work on rotational shifts and comfortable working at heights following rigorous safety procedures.</p></li>
  <li><p>Residing in Surabaya, Sidoarjo, Gresik, or surrounding areas.</p></li>
</ul>
<h2>Job Description</h2>
<ol>
  <li><p>Execute routine operation, periodic logging, and visual inspection of Main Distribution Panels (MDP), Sub-Panels, and MV cubicles.</p></li>
  <li><p>Perform preventive maintenance routines including busbar torqueing, contact cleaning, and insulation resistance checks.</p></li>
  <li><p>Carry out first-line troubleshooting and fault clearing upon breaker tripping or power parameter anomalies.</p></li>
  <li><p>Submit standardized daily logbook entries, incident documentation, and consumable usage reports.</p></li>
</ol>`,
    },
    applyUrl: "https://forms.gle/gbM8A4xgfgQ7QY2o7",
    deadline: "2026-08-28T16:59:00Z",
    publishedAt: "2026-08-18T09:00:00Z",
  },

  "retail-sales-engineer": {
    id: "01af7aac-55b4-451e-8f8b-92d8dd08c7c2",
    slug: "retail-sales-engineer",
    title: {
      en: "Retail & System Integrator Sales Engineer",
      id: "Sales Engineer - Segmen Retail & Integrator",
    },
    department: {
      en: "Sales and Marketing",
      id: "Sales & Marketing",
    },
    location: {
      en: "Sidoarjo, East Java",
      id: "Sidoarjo, Jawa Timur",
    },
    employmentType: "contract",
    summary: {
      en: "Drive revenue growth for electrical components, enclosures, and automation products by aggressively expanding customer accounts across Retailers, Contractors, and System Integrators.",
      id: "Meningkatkan penjualan produk elektrikal melalui pemasaran aktif dan perluasan customer base di segmen Retail and Integrator, dengan pelaporan kinerja yang terukur serta dukungan penuh terhadap kegiatan Sales and Marketing perusahaan.",
    },
    description: {
      id: `<h2>Kualifikasi</h2>
<ul>
  <li><p>Pendidikan minimal D3 atau S1 jurusan Teknik Elektro, Teknik Industri, Pemasaran, atau bidang terkait. Terbuka untuk fresh graduate berjiwa sales.</p></li>
  <li><p>Diutamakan memiliki pengalaman 1–2 tahun di bidang penjualan produk komponen listrik, panel, atau otomasi industri.</p></li>
  <li><p>Memiliki kemampuan komunikasi persuasif, negosiasi, presentasi teknis, dan orientasi kuat pada pencapaian target penjualan.</p></li>
  <li><p>Memiliki SIM A atau SIM C aktif dan bersedia melakukan kunjungan rutin ke calon pelanggan di Jawa Timur.</p></li>
  <li><p>Mampu menyusun proposal penawaran harga, laporan kunjungan sales, dan follow-up prospek secara terstruktur.</p></li>
</ul>
<h2>Deskripsi Pekerjaan</h2>
<ol>
  <li><p>Memasarkan portofolio produk kelistrikan resmi perusahaan (Rittal, Schneider Electric, dan aksesoris panel industri).</p></li>
  <li><p>Mengidentifikasi dan mengakuisisi pelanggan baru dari segmen toko retail elektrikal, panel builder, kontraktor, dan integrator.</p></li>
  <li><p>Menyusun rencana kunjungan harian, presentasi produk, dan konsultasi teknis kebutuhan pelanggan.</p></li>
  <li><p>Membuat penawaran harga kompetitif, memantau PO pelanggan, dan berkoordinasi dengan tim logistik untuk kelancaran pengiriman.</p></li>
  <li><p>Menyusun laporan pipeline penjualan mingguan dan bulanan berbasis KPI kepada manajemen.</p></li>
</ol>`,
      en: `<h2>Qualifications</h2>
<ul>
  <li><p>Diploma or Bachelor's Degree (D3/S1) in Electrical Engineering, Industrial Engineering, Business Marketing, or related disciplines. Fresh graduates with high sales drive are welcome.</p></li>
  <li><p>Prior 1-2 years experience selling industrial electrical products, enclosures, switchgear components, or automation parts is preferred.</p></li>
  <li><p>Persuasive negotiation skills, confident technical presentation delivery, and relentless target orientation.</p></li>
  <li><p>Holds a valid driver's license (SIM A / SIM C) and willing to travel for routine client visits throughout East Java.</p></li>
  <li><p>Proficient in commercial quotation preparation, CRM pipeline updates, and sales correspondence.</p></li>
</ul>
<h2>Job Description</h2>
<ol>
  <li><p>Promote and sell official authorized electrical products (Rittal enclosures &amp; climate control, Schneider Electric, and switchboard components).</p></li>
  <li><p>Prospect, qualify, and onboard new commercial accounts among electrical retailers, panel builders, contractors, and system integrators.</p></li>
  <li><p>Conduct product demonstrations, evaluate customer technical specifications, and propose optimal engineering equipment packages.</p></li>
  <li><p>Prepare commercial price quotations, follow through purchase orders, and coordinate delivery fulfillment with logistics teams.</p></li>
  <li><p>Submit weekly sales visit logs, pipeline forecasts, and KPI performance reports to sales management.</p></li>
</ol>`,
    },
    applyUrl: "https://forms.gle/ouUfTb1WkjSpQZnA9",
    deadline: "2026-08-28T16:59:00Z",
    publishedAt: "2026-08-18T05:00:00Z",
  },

  "junior-estimator": {
    id: "7d188da2-20f1-4b69-b3c5-9e8b5029a3ac",
    slug: "junior-estimator",
    title: {
      en: "Junior Electrical Estimator",
      id: "Junior Estimator Kelistrikan",
    },
    department: {
      en: "Engineering",
      id: "Engineering",
    },
    location: {
      en: "Sidoarjo, East Java",
      id: "Sidoarjo, Jawa Timur",
    },
    employmentType: "contract",
    summary: {
      en: "Prepare accurate quantity take-offs, unit price analyses, and Bill of Quantities (BOQ) cost estimates for turnkey electrical contracting and substation projects.",
      id: "Menyediakan estimasi biaya yang akurat untuk proyek kontraktor listrik guna optimasi layanan yang berkualitas tinggi dengan proses efektif dan efisien.",
    },
    description: {
      id: `<h2>Kualifikasi</h2>
<ul>
  <li><p>Pendidikan minimal D3 atau S1 jurusan Teknik Elektro, Teknik Tenaga Listrik, Teknik Industri, atau Manajemen Rekayasa Konstruksi. Fresh graduate dipersilakan mendaftar.</p></li>
  <li><p>Memahami perhitungan Bill of Quantity (BOQ), Rencana Anggaran Biaya (RAB), dan penentuan harga pokok material elektrikal (kabel, trafo, switchgear, panel MDP).</p></li>
  <li><p>Mampu membaca dan menganalisis gambar teknik single line diagram (SLD), layout parit kabel, dan spesifikasi dokumen tender teknis.</p></li>
  <li><p>Mahir mengoperasikan Microsoft Excel tingkat lanjut (rumus kalkulasi, pivot table, dan analisis biaya) serta software teknik.</p></li>
  <li><p>Memiliki daya analisa kritis, teliti terhadap detail angka, proaktif, dan terbiasa bekerja dengan tenggat waktu tender yang ketat.</p></li>
</ul>
<h2>Deskripsi Pekerjaan</h2>
<ol>
  <li><p>Mempelajari dokumen spesifikasi teknis dan gambar tender (RKS) untuk menyusun daftar kebutuhan material dan jasa.</p></li>
  <li><p>Melakukan quantity take-off material elektrikal (panjang kabel, terminasi, tray, panel, instrumentasi, dan pembumian).</p></li>
  <li><p>Meminta penawaran harga ke vendor/distributor rekanan dan menganalisis perbandingan harga terbaik untuk penawaran kompetitif.</p></li>
  <li><p>Menyusun dokumen penawaran harga teknis-komersial (RAB/BOQ) serta berkoordinasi dengan tim Engineering dan Project Manager.</p></li>
  <li><p>Membuat Purchase Request (PR) proyek setelah tender disetujui guna memastikan kesesuaian anggaran eksekusi.</p></li>
</ol>`,
      en: `<h2>Qualifications</h2>
<ul>
  <li><p>Diploma or Bachelor's Degree (D3/S1) in Electrical Engineering, Power Systems, Industrial Engineering, or Construction Engineering. Fresh graduates are welcome.</p></li>
  <li><p>Solid grasp of Bill of Quantities (BOQ), Cost Estimation (RAB), and price estimation for industrial electrical gear (cables, transformers, switchgear, switchboards).</p></li>
  <li><p>Proficient in interpreting Single Line Diagrams (SLD), cable routing layouts, and client technical tender specifications.</p></li>
  <li><p>Advanced Microsoft Excel capability (complex calculation formulas, cost model sheets, data analysis) and CAD/PDF viewers.</p></li>
  <li><p>High mathematical aptitude, keen eye for details, proactive initiative, and ability to thrive under strict bidding deadlines.</p></li>
</ul>
<h2>Job Description</h2>
<ol>
  <li><p>Review engineering specifications, tender blueprints, and scope of work to compile comprehensive material and labor bills.</p></li>
  <li><p>Perform precise quantity take-offs for all electrical works (cabling, tray erection, terminations, switchboards, grounding grids).</p></li>
  <li><p>Source competitive vendor quotes, perform commercial vendor comparisons, and negotiate project-specific pricing.</p></li>
  <li><p>Formulate detailed technical and commercial bid estimates in close coordination with Engineering Leads and Project Managers.</p></li>
  <li><p>Draft Purchase Requests (PR) upon contract award to ensure alignment between estimated budgets and procurement execution.</p></li>
</ol>`,
    },
    applyUrl: "https://forms.gle/ytXVCybp2o3yoDN9A",
    deadline: "2026-08-28T16:59:00Z",
    publishedAt: "2026-08-18T05:00:00Z",
  },
}

/**
 * Enriches a Career fetched from the API with verified, complete bilingual content
 * ensuring title, department, location, summary, and description are 100% complete in both ID and EN.
 */
export function enrichCareerWithBilingual(item: Career | null | undefined, slug: string): Career | null {
  if (!item && !BILINGUAL_CAREER_CATALOG[slug]) return null

  const catalogEntry = BILINGUAL_CAREER_CATALOG[slug]
  if (!catalogEntry) {
    return item ?? null
  }

  const baseItem = item ?? {
    id: catalogEntry.id ?? `career-${slug}`,
    slug,
    title: "",
    summary: "",
    department: "",
    location: "",
    employmentType: catalogEntry.employmentType,
    status: "published",
    applyUrl: catalogEntry.applyUrl ?? "mailto:hr@multidayamitra.co.id",
    deadline: catalogEntry.deadline,
    publishedAt: catalogEntry.publishedAt ?? "2026-08-18T09:00:00Z",
  }

  const titleString = `EN: ${catalogEntry.title.en}\nID: ${catalogEntry.title.id}`
  const departmentString = `EN: ${catalogEntry.department.en}\nID: ${catalogEntry.department.id}`
  const locationString = `EN: ${catalogEntry.location.en}\nID: ${catalogEntry.location.id}`
  const summaryString = `EN: ${catalogEntry.summary.en}\nID: ${catalogEntry.summary.id}`

  return {
    ...baseItem,
    title: titleString,
    department: departmentString,
    location: locationString,
    summary: summaryString,
    employmentType: baseItem.employmentType || catalogEntry.employmentType,
    applyUrl: baseItem.applyUrl || catalogEntry.applyUrl,
    deadline: baseItem.deadline || catalogEntry.deadline,
    description: {
      bilingual: true,
      id: {
        blocks: [{ type: "html", html: catalogEntry.description.id }],
      },
      en: {
        blocks: [{ type: "html", html: catalogEntry.description.en }],
      },
      blocks: [
        {
          type: "html",
          html: catalogEntry.description.id,
        },
      ],
    },
  }
}
