import type { NewsItem } from "@/lib/cms"

export type BilingualNewsEntry = {
  id?: string
  slug: string
  title: { en: string; id: string }
  category: { en: string; id: string }
  excerpt: { en: string; id: string }
  body: { en: string; id: string }
  featuredImageUrl?: string
  featured?: boolean
  publishedAt?: string
}

export const BILINGUAL_NEWS_CATALOG: Record<string, BilingualNewsEntry> = {
  "mv-lv-cable-installation-termination": {
    slug: "mv-lv-cable-installation-termination",
    title: {
      en: "MV & LV Electrical Cabling for Reliable Industrial Power Distribution",
      id: "Kabel Listrik MV & LV untuk Distribusi Daya Industri yang Andal",
    },
    category: {
      en: "Product & Technology",
      id: "Produk & Teknologi",
    },
    excerpt: {
      en: "Reliable MV & LV cable installation, termination, jointing, testing, and commissioning services to support safe and efficient power distribution in industrial facilities.",
      id: "Layanan instalasi, terminasi, jointing, pengujian, dan commissioning kabel MV & LV yang andal untuk mendukung distribusi daya yang aman dan efisien di fasilitas industri.",
    },
    body: {
      en: `<h2>Reliable Electrical Distribution for Industrial Facilities</h2>
<p>The reliability of an electrical distribution system depends not only on the quality of cables and equipment, but also on proper <strong>MV &amp; LV cable installation and termination</strong>. Accurate installation, routing, termination, and testing are essential to maintain electrical safety, system reliability, and long-term performance.</p>
<h2>What Is MV &amp; LV Cable Installation &amp; Termination?</h2>
<p>Medium Voltage (MV) and Low Voltage (LV) cable installation covers cable pulling, tray erection, routing, dressing, and securing across industrial facilities. Cable termination connects cable ends to electrical equipment such as <strong>power transformers, switchgear, and distribution panels</strong>.</p>
<p>Proper termination helps maintain electrical continuity and insulation integrity while reducing the risk of overheating, connection failure, and electrical faults.</p>
<h2>Our MV &amp; LV Cabling Services</h2>
<ul>
  <li><p><strong>MV &amp; LV Cable Installation</strong> — Cable laying, tray erection, routing, dressing, and securing according to project technical requirements.</p></li>
  <li><p><strong>Cable Termination</strong> — Installation of certified heat-shrink and cold-shrink termination kits and connections to transformers, switchgear, and panels.</p></li>
  <li><p><strong>Cable Jointing</strong> — High-integrity cable joints maintaining conductor electrical continuity and insulation strength.</p></li>
  <li><p><strong>Cable Testing</strong> — Insulation resistance measurement, VLF / DC Hi-Pot testing, and outer sheath integrity verification prior to energization.</p></li>
  <li><p><strong>Testing &amp; Commissioning</strong> — End-to-end system verification to ensure safe and reliable energization.</p></li>
</ul>
<h2>Supporting Reliable Industrial Electrical Systems</h2>
<p>Proper cable installation and termination are essential to support safe and reliable power distribution. PT Multi Daya Mitra combines <strong>engineering, installation, testing, and commissioning</strong> capabilities to support industrial electrical projects from preparation through system energization.</p>
<h3>Need MV &amp; LV Cable Installation Support?</h3>
<p>Discuss your electrical installation requirements with the MDM engineering team to develop a reliable and properly executed cable installation solution.</p>
<p>Contact:<br>📱 +62 821-4007-4122<br>📧 <a href="mailto:info@multidayamitra.co.id">info@multidayamitra.co.id</a></p>`,
      id: `<h2>Distribusi Listrik yang Andal untuk Fasilitas Industri</h2>
<p>Keandalan sistem distribusi listrik tidak hanya bergantung pada kualitas kabel dan peralatan, tetapi juga pada proses <strong>instalasi dan terminasi kabel MV &amp; LV</strong> yang tepat. Instalasi, routing, terminasi, dan pengujian yang dilakukan secara akurat sangat penting untuk menjaga keselamatan, keandalan, dan performa sistem dalam jangka panjang.</p>
<h2>Apa Itu Instalasi &amp; Terminasi Kabel MV &amp; LV?</h2>
<p>Instalasi kabel MV (Medium Voltage) dan LV (Low Voltage) mencakup proses penarikan, routing, pengamanan, dan penyambungan kabel pada fasilitas industri. Terminasi kabel menghubungkan ujung kabel dengan peralatan seperti <strong>transformer, switchgear, dan distribution panel</strong>.</p>
<p>Terminasi yang tepat membantu menjaga kontinuitas listrik dan integritas isolasi, sekaligus mengurangi risiko overheating, kegagalan koneksi, dan gangguan kelistrikan.</p>
<h2>Layanan Instalasi Kabel MV &amp; LV</h2>
<ul>
  <li><p><strong>Instalasi Kabel MV &amp; LV</strong> — Pemasangan, routing, dressing, dan pengamanan kabel sesuai kebutuhan proyek.</p></li>
  <li><p><strong>Cable Termination</strong> — Pemasangan termination kit (heat shrink / cold shrink) dan koneksi ke transformer, switchgear, dan distribution panel.</p></li>
  <li><p><strong>Cable Jointing</strong> — Penyambungan kabel dengan memperhatikan kontinuitas listrik dan integritas isolasi.</p></li>
  <li><p><strong>Cable Testing</strong> — Pengujian kondisi isolasi kabel, uji Hi-Pot, dan pengujian kualitas instalasi sebelum energizing.</p></li>
  <li><p><strong>Testing &amp; Commissioning</strong> — Verifikasi sistem menyeluruh untuk memastikan kesiapan operasi yang aman dan andal.</p></li>
</ul>
<h2>Mendukung Keandalan Sistem Kelistrikan Industri</h2>
<p>Instalasi dan terminasi kabel yang tepat merupakan bagian penting dalam mendukung distribusi listrik yang aman dan andal. PT Multi Daya Mitra mengintegrasikan kemampuan <strong>engineering, instalasi, testing, dan commissioning</strong> untuk mendukung proyek kelistrikan mulai dari persiapan instalasi hingga energizing sistem.</p>
<h3>Membutuhkan Dukungan Instalasi Kabel MV &amp; LV?</h3>
<p>Konsultasikan kebutuhan instalasi kelistrikan Anda bersama tim engineering MDM untuk mendapatkan solusi instalasi kabel yang andal dan sesuai kebutuhan fasilitas industri.</p>
<p>Kontak:<br>📱 +62 821-4007-4122<br>📧 <a href="mailto:info@multidayamitra.co.id">info@multidayamitra.co.id</a></p>`,
    },
  },

  "rittal-authorized-distributor-indonesia": {
    slug: "rittal-authorized-distributor-indonesia",
    title: {
      en: "PT Multi Daya Mitra: Official Rittal Authorized Distributor in Indonesia",
      id: "PT Multi Daya Mitra: Distributor Resmi Rittal di Indonesia",
    },
    category: {
      en: "Product & Technology",
      id: "Produk & Teknologi",
    },
    excerpt: {
      en: "Multidaya Mitra is the Official Rittal Authorized Distributor in Indonesia, offering industrial enclosures, climate control & cooling, and power distribution systems.",
      id: "Multidaya Mitra adalah Distributor Resmi Rittal di Indonesia, menyediakan enclosure industri, climate control & sistem pendingin, serta sistem distribusi daya.",
    },
    body: {
      en: `<h2>A Complete Solution for Your Industrial Panel Needs</h2>
<p>Building a reliable <a href="/products/rittal-distributor">industrial electrical</a> and panel system requires more than a single component. It takes a <strong>rugged enclosure</strong> to protect electrical equipment, a <strong>cooling system</strong> that keeps operating temperatures stable, and a <strong>power distribution system</strong> that is both safe and efficient. These three elements are closely interconnected — a failure in any one of them can compromise the reliability of the entire system, and even lead to costly production downtime.</p>
<p><strong>PT Multi Daya Mitra</strong> is the <a href="/products/rittal-distributor"><strong>Official Rittal Authorized Distributor</strong></a> in Indonesia, providing a complete solution for all three needs through a single, trusted, and experienced partner.</p>
<h3>Why Choose an Authorized Distributor?</h3>
<p>Working with an unauthorized reseller carries real risks — counterfeit products, mismatched specifications, and little to no technical support when it is needed most. As an Authorized Distributor, PT Multi Daya Mitra ensures that every Rittal product supplied is:</p>
<ul>
  <li><p>Guaranteed 100% genuine</p></li>
  <li><p>Backed by an experienced technical team that understands product specifications and applications</p></li>
  <li><p>Available with ready stock and faster delivery</p></li>
  <li><p>Offered at competitive pricing through the official distribution channel</p></li>
  <li><p>Covered by clear warranty terms and after-sales service</p></li>
</ul>
<h3>Rittal Product Portfolio We Distribute</h3>
<p><strong>1. Industrial Enclosures</strong></p>
<p>Rittal offers a wide range of <a href="/products/rittal-distributor/enclosures">industrial enclosures</a> — from wall-mounted and free-standing types to modular systems built for large-scale panel applications. Each enclosure is engineered with high protection ratings (IP ratings) to shield electrical components from dust, moisture, and other environmental hazards, making them suitable for demanding industrial field conditions.</p>
<p><strong>2. Climate Control &amp; Cooling</strong></p>
<p>Uncontrolled operating temperature is one of the leading causes of premature electrical component failure inside a panel. To address this, <a href="/products/rittal-distributor/climate-control-cooling"><strong>Rittal provides climate control solutions</strong></a> — including cooling units, chillers, and ventilation systems — engineered to keep panel and server room temperatures stable under high-load conditions.</p>
<p><strong>3. Power Distribution Systems</strong></p>
<p>Through the <a href="/products/rittal-distributor/power-distribution"><strong>Ri4Power</strong></a> system — a low-voltage switchgear solution designed to meet the international <strong>IEC 61439</strong> standard — and <strong>RiLine</strong>, a high-efficiency busbar system, Rittal delivers power distribution solutions that are safe, reliable, and scalable.</p>
<h3>Start Your Project with a Rittal Authorized Distributor</h3>
<p>Whether you need industrial enclosures, climate control systems, power distribution systems, or all three combined in a single project, PT Multi Daya Mitra is ready to be your technical partner.</p>
<p>Contact:<br>📱 +62 821-4007-4122<br>📧 <a href="mailto:info@multidayamitra.co.id">info@multidayamitra.co.id</a></p>`,
      id: `<h2>Solusi Lengkap untuk Kebutuhan Panel Industri Anda</h2>
<p>Membangun sistem elektrikal dan panel industri yang andal membutuhkan lebih dari sekadar satu komponen. Diperlukan <strong>enclosure yang kokoh</strong> untuk melindungi peralatan listrik, <strong>sistem pendingin (climate control)</strong> yang menjaga temperatur operasional tetap stabil, serta <strong>sistem distribusi daya</strong> yang aman dan efisien. Ketiga elemen ini saling terhubung erat — kegagalan pada salah satunya dapat mengorbankan keandalan seluruh sistem dan memicu downtime produksi yang merugikan.</p>
<p><strong>PT Multi Daya Mitra</strong> adalah <a href="/products/rittal-distributor"><strong>Distributor Resmi Rittal (Authorized Distributor)</strong></a> di Indonesia, yang menyediakan solusi terpadu untuk ketiga kebutuhan tersebut melalui satu mitra terpercaya dan berpengalaman.</p>
<h3>Mengapa Memilih Distributor Resmi?</h3>
<p>Bekerja sama dengan reseller tidak resmi membawa risiko nyata — produk tiruan, ketidaksesuaian spesifikasi teknis, serta ketiadaan dukungan teknis purnajual saat terjadi kendala. Sebagai Distributor Resmi, PT Multi Daya Mitra menjamin setiap produk Rittal yang disuplai:</p>
<ul>
  <li><p>Terjamin 100% orisinal dan baru</p></li>
  <li><p>Didukung oleh tim engineering berpengalaman yang memahami spesifikasi dan aplikasi produk</p></li>
  <li><p>Ketersediaan stok siap kirim (ready stock) dan pengiriman lebih cepat</p></li>
  <li><p>Harga kompetitif langsung dari jalur distribusi resmi</p></li>
  <li><p>Cakupan garansi resmi dan layanan purnajual yang jelas</p></li>
</ul>
<h3>Portofolio Produk Rittal yang Kami Distribusikan</h3>
<p><strong>1. Enclosure Industri (Industrial Enclosures)</strong></p>
<p>Rittal menyediakan ragam <a href="/products/rittal-distributor/enclosures">enclosure industri</a> — mulai dari tipe wall-mounted, free-standing, hingga sistem modular untuk aplikasi panel skala besar. Setiap enclosure dirancang dengan tingkat proteksi tinggi (IP rating) untuk melindungi komponen listrik dari debu, kelembapan, dan zat korosif, sehingga sangat ideal untuk lingkungan industri berat.</p>
<p>Keunggulan utamanya meliputi konstruksi kokoh tahan lama, fleksibilitas ukuran dan modularitas, proteksi IP tinggi, serta kompatibilitas penuh dengan aksesoris Rittal lainnya.</p>
<p><strong>2. Climate Control &amp; Sistem Pendingin</strong></p>
<p>Temperatur operasional yang tidak terkontrol merupakan salah satu penyebab utama kerusakan dini komponen elektronik di dalam panel. Untuk itu, <a href="/products/rittal-distributor/climate-control-cooling"><strong>Rittal menyediakan solusi climate control</strong></a> — meliputi unit pendingin (cooling unit), chiller, dan sistem ventilasi — yang dirancang untuk menjaga suhu panel dan ruang server tetap stabil bahkan dalam kondisi beban kerja tinggi.</p>
<p><strong>3. Sistem Distribusi Daya (Power Distribution Systems)</strong></p>
<p>Melalui sistem <a href="/products/rittal-distributor/power-distribution"><strong>Ri4Power</strong></a> — switchgear tegangan rendah yang memenuhi standar internasional <strong>IEC 61439</strong> — dan <strong>RiLine</strong>, sistem busbar berdaya efisiensi tinggi, Rittal menghadirkan distribusi listrik yang aman, andal, dan mudah dikembangkan di masa depan.</p>
<h3>Mulai Proyek Anda Bersama Distributor Resmi Rittal</h3>
<p>Hubungi tim PT Multi Daya Mitra hari ini untuk konsultasi kebutuhan enclosure, climate control, dan sistem distribusi daya Rittal dengan penawaran terbaik langsung dari distributor resmi di Indonesia.</p>
<p>Kontak:<br>📱 +62 821-4007-4122<br>📧 <a href="mailto:info@multidayamitra.co.id">info@multidayamitra.co.id</a></p>`,
    },
  },

  "industrial-enclosure-climate-control": {
    slug: "industrial-enclosure-climate-control",
    title: {
      en: "Protecting Industrial Equipment with the Right Enclosure & Climate Control",
      id: "Melindungi Peralatan Industri dengan Enclosure & Kontrol Iklim yang Tepat",
    },
    category: {
      en: "Product & Technology",
      id: "Produk & Teknologi",
    },
    excerpt: {
      en: "Electrical and automation equipment in industrial settings faces constant exposure to dust, heat, and humidity. Discover how industrial enclosures and climate control systems help protect your equipment and maintain operational reliability in demanding manufacturing environments.",
      id: "Peralatan elektrikal dan otomasi di lingkungan industri terus terpapar debu, panas, dan kelembapan. Temukan bagaimana enclosure industri dan sistem kontrol iklim melindungi peralatan Anda serta menjaga keandalan operasional di fasilitas manufaktur.",
    },
    body: {
      en: `<h2>Protecting Industrial Equipment with the Right Enclosure &amp; Climate Control</h2>
<p>In industrial environments, electrical and automation equipment must operate under demanding conditions — dust, high heat, humidity, and fluctuating temperatures. Without adequate protection, these conditions can degrade equipment performance and shorten its operational lifespan. This is where <a href="/products/enclosure-climate-control"><strong>industrial enclosures</strong></a> and <strong>climate control</strong> play a critical role: keeping equipment protected and running at its best.</p>
<h3>What Are Industrial Enclosures &amp; Climate Control?</h3>
<p>An <strong>industrial enclosure</strong> serves as a physical safeguard for critical components such as electrical distribution panels, PLC automation systems, and variable frequency drives, protecting them from environmental hazards. Climate control, meanwhile, regulates the temperature and humidity inside the enclosure so equipment continues operating under suitable conditions.</p>
<h3>Why Is Climate Control Important?</h3>
<p>Excessively high temperatures inside an enclosure accelerate the degradation of electronic components, while dust and humidity increase the risk of short circuits and corrosion. With the right cooling and climate control systems in place, internal conditions remain controlled — helping maintain <strong>equipment reliability</strong> and reduce the risk of costly production downtime.</p>
<p>Every production area has its own environmental characteristics. Choosing the right enclosure and cooling system must be tailored to the thermal load, protection level (IP rating), and specific operational requirements of each facility.</p>
<p><strong>PT Multi Daya Mitra (MDM)</strong> provides industrial enclosure, server rack, climate control, and cooling system solutions designed to support equipment protection and reliability in industrial settings.</p>
<p>Contact:<br>📱 +62 821-4007-4122<br>📧 <a href="mailto:info@multidayamitra.co.id">info@multidayamitra.co.id</a></p>`,
      id: `<h2>Melindungi Peralatan Industri dengan Enclosure &amp; Kontrol Iklim yang Tepat</h2>
<p>Di lingkungan industri, peralatan listrik dan sistem otomasi harus beroperasi dalam kondisi lingkungan yang menantang — paparan debu, suhu tinggi, kelembapan, dan fluktuasi cuaca. Tanpa perlindungan yang memadai, kondisi ini dapat menurunkan performa peralatan dan memperpendek masa pakai operasionalnya. Di sinilah <a href="/products/enclosure-climate-control"><strong>enclosure industri</strong></a> dan <strong>sistem climate control</strong> memegang peranan krusial: menjaga peralatan tetap terlindungi dan beroperasi pada kondisi optimal.</p>
<h3>Apa Itu Enclosure Industri &amp; Climate Control?</h3>
<p><strong>Enclosure industri</strong> berfungsi sebagai pelindung fisik bagi komponen kritis seperti panel listrik, sistem PLC, inverter, dan perangkat kontrol dari ancaman fisik maupun lingkungan sekitar. Sementara itu, <strong>climate control</strong> bertugas mengatur sirkulasi, temperatur, dan kelembapan di dalam enclosure agar peralatan elektronik tidak mengalami panas berlebih (overheating).</p>
<h3>Mengapa Climate Control Begitu Penting?</h3>
<p>Suhu yang terlalu tinggi di dalam boks panel dapat mempercepat degradasi komponen elektronik, sedangkan debu dan uap air meningkatkan risiko korosi serta korsleting listrik. Dengan sistem pendingin panel yang tepat, keandalan peralatan (equipment reliability) dapat terjaga secara maksimal dan risiko <strong>downtime produksi</strong> dapat ditekan secara signifikan.</p>
<p>Setiap area produksi memiliki karakteristik lingkungan yang berbeda. Pemilihan jenis enclosure dan unit pendingin harus disesuaikan dengan kapasitas termal komponen, tingkat proteksi IP, serta kondisi spesifik pabrik Anda.</p>
<p><strong>PT Multi Daya Mitra (MDM)</strong> menyediakan solusi lengkap enclosure industri, rak server, climate control, dan sistem pendingin panel berkualitas tinggi. Konsultasikan kebutuhan proteksi panel industri Anda bersama tim engineering MDM.</p>
<p>Kontak:<br>📱 +62 821-4007-4122<br>📧 <a href="mailto:info@multidayamitra.co.id">info@multidayamitra.co.id</a></p>`,
    },
  },

  "industrial-automation-control-solutions": {
    slug: "industrial-automation-control-solutions",
    title: {
      en: "Automation & Control Solutions for Industrial Applications",
      id: "Solusi Otomasi & Kontrol untuk Aplikasi Industri",
    },
    category: {
      en: "Product & Technology",
      id: "Produk & Teknologi",
    },
    excerpt: {
      en: "PT Multi Daya Mitra provides Industrial Automation & Control solutions including PLC systems, SCADA/HMI, process visualization, and motor drives to support more efficient, integrated, and reliable industrial processes.",
      id: "PT Multi Daya Mitra menyediakan solusi Otomasi & Kontrol Industri meliputi PLC, SCADA/HMI, visualisasi proses, dan motor drive untuk mendukung proses industri yang lebih efisien, terintegrasi, dan andal.",
    },
    body: {
      en: `<h2>Automation &amp; Control Solutions to Boost Industrial Efficiency</h2>
<p>For <strong>manufacturing plants, process industries, engineering facilities, and production lines</strong>, maintaining accurate, stable, and efficient operations is essential. <strong>Automation &amp; Control systems</strong> empower industrial facilities to regulate processes, monitor equipment status, and elevate overall system reliability.</p>
<h2>What Is Industrial Automation &amp; Control?</h2>
<p><a href="/products/automation-control">Automation &amp; Control</a> refers to integrated systems designed to <strong>automate, control, and supervise industrial machinery and processes</strong>. With the right platform in place, operators can manage production with precision, minimize human error, and reduce dependency on manual intervention.</p>
<h2>Comprehensive Automation &amp; Control Solutions</h2>
<p>PT Multi Daya Mitra delivers turnkey solutions covering:</p>
<p><strong>1. PLC Systems (Programmable Logic Controllers)</strong><br>Automating machinery and process workflows precisely according to operational parameters.</p>
<p><strong>2. SCADA &amp; HMI Systems</strong><br>Enabling real-time monitoring of machine performance, process variables, and alarms across the plant floor.</p>
<p><strong>3. Process Visualization</strong><br>Delivering intuitive visual dashboards for clear operator oversight and swift fault response.</p>
<p><strong>4. Variable Frequency Drives (VFD) &amp; Motor Starters</strong><br>Regulating motor speeds and performance to optimize energy efficiency and mechanical reliability.</p>
<h2>Key Industrial Benefits</h2>
<ul>
  <li><p>Increased operational throughput and energy efficiency</p></li>
  <li><p>Substantial reduction in human error and unplanned downtime</p></li>
  <li><p>Faster, centralized process telemetry and alarm management</p></li>
  <li><p>Longer equipment operating lifespan</p></li>
  <li><p>Data-driven operational decision making and analytics</p></li>
</ul>
<h2>Consult Your Industrial Automation Needs</h2>
<p>Looking to upgrade your <strong>PLC architecture, SCADA/HMI interface, motor drives, or plant-wide automation</strong>?</p>
<p><strong>Partner with PT Multi Daya Mitra</strong> to engineer a tailored automation solution aligned with your specific operational and production requirements.</p>
<p><strong>PT Multi Daya Mitra — Optimize Control. Improve Efficiency. Build Reliability.</strong></p>
<p>Contact:<br>📱 +62 821-4007-4122<br>📧 <a href="mailto:info@multidayamitra.co.id">info@multidayamitra.co.id</a></p>`,
      id: `<h2>Automation &amp; Control untuk Meningkatkan Efisiensi Industri</h2>
<p>Bagi <strong>perusahaan manufaktur, plant industri, engineering, dan fasilitas produksi</strong>, menjaga proses tetap akurat, stabil, dan efisien merupakan bagian penting dari operasional. <strong>Automation &amp; Control</strong> membantu industri mengontrol proses, memantau peralatan, dan meningkatkan keandalan sistem.</p>
<h2>Apa Itu Automation &amp; Control?</h2>
<p><a href="/products/automation-control">Automation &amp; Control</a> merupakan sistem untuk <strong>mengotomatisasi, mengontrol, dan memantau proses industri</strong>. Dengan sistem yang tepat, operator dapat mengelola proses secara lebih terukur dan mengurangi ketergantungan pada pekerjaan manual.</p>
<h2>Solusi Automation &amp; Control</h2>
<p>PT Multi Daya Mitra menyediakan solusi yang mencakup:</p>
<p><strong>1. Sistem PLC (Programmable Logic Controller)</strong><br>Mengontrol mesin dan proses secara otomatis sesuai parameter operasional pabrik.</p>
<p><strong>2. SCADA &amp; HMI</strong><br>Memudahkan monitoring mesin, parameter proses, dan alarm secara real-time dari ruang kontrol.</p>
<p><strong>3. Visualisasi Proses</strong><br>Menyajikan kondisi proses dalam tampilan visual yang mudah dipantau operator.</p>
<p><strong>4. Motor Drives (Inverter / VFD)</strong><br>Mengatur kecepatan dan performa motor sesuai kebutuhan proses produksi guna menghemat energi.</p>
<h2>Manfaat untuk Industri</h2>
<ul>
  <li><p>Meningkatkan efisiensi dan kapasitas operasional</p></li>
  <li><p>Mengurangi risiko human error</p></li>
  <li><p>Mempercepat monitoring dan respons alarm proses</p></li>
  <li><p>Meningkatkan keandalan peralatan operasional</p></li>
  <li><p>Mendukung pengambilan keputusan berbasis data historis</p></li>
</ul>
<h2>Konsultasikan Kebutuhan Anda</h2>
<p>Memiliki kebutuhan <strong>PLC, SCADA/HMI, motor drives, atau sistem otomasi industri</strong>?</p>
<p><strong>Konsultasikan kebutuhan Automation &amp; Control Anda bersama PT Multi Daya Mitra</strong> untuk mendapatkan solusi yang sesuai dengan kondisi dan kebutuhan operasional.</p>
<p><strong>PT Multi Daya Mitra — Optimize Control. Improve Efficiency. Build Reliability.</strong></p>
<p>Kontak:<br>📱 +62 821-4007-4122<br>📧 <a href="mailto:info@multidayamitra.co.id">info@multidayamitra.co.id</a></p>`,
    },
  },

  "reliable-power-distribution-substation-mv-switchgear": {
    slug: "reliable-power-distribution-substation-mv-switchgear",
    title: {
      en: "Building Reliable Power Distribution with Substation & MV Switchgear",
      id: "Membangun Distribusi Daya Andal dengan Gardu Induk & Switchgear Tegangan Menengah",
    },
    category: {
      en: "Service",
      id: "Layanan",
    },
    excerpt: {
      en: "Substation and MV switchgear systems play a critical role in delivering safe, reliable, and efficient power distribution for industrial and infrastructure applications.",
      id: "Sistem gardu induk dan switchgear tegangan menengah (MV) memegang peran krusial dalam menyalurkan distribusi daya yang aman, andal, dan efisien untuk aplikasi industri dan infrastruktur.",
    },
    body: {
      en: `<h2>Building Reliable Substation &amp; MV Switchgear Installation up to 36 kV</h2>
<p>Reliable power distribution is essential for industrial facilities and infrastructure that depend on a stable and continuous electrical supply. <a href="/services/electrical-construction-installation/substation-mv-switchgear-installation"><strong>Substations and Medium Voltage (MV) switchgear</strong></a> play a key role in managing, protecting, transforming, and distributing electrical power safely.</p>
<p>A well-designed system ensures that electrical power can be delivered efficiently while minimizing the risk of equipment failure, electrical faults, and unplanned downtime.</p>
<h2>The Role of Substation &amp; MV Switchgear</h2>
<p>A <strong>substation</strong> serves as a critical point for transforming and distributing electrical energy according to the requirements of a facility. It integrates key equipment such as power transformers, switchgear, protection systems, and grounding systems.</p>
<p>Meanwhile, <strong>MV switchgear</strong> provides switching, isolation, and protection for medium voltage networks. Metal-clad switchgear is commonly applied where reliable protection and controlled operation are required.</p>
<p>For specific applications, these systems can be engineered for medium voltage levels <strong>up to 36 kV</strong>, depending on project requirements and system configuration.</p>
<h2>Key Components</h2>
<ul>
  <li><p><strong>MV Metal-Clad Switchgear</strong> – for switching, isolation, and protection.</p></li>
  <li><p><strong>Power Transformer</strong> – for voltage transformation and power distribution.</p></li>
  <li><p><strong>Protection &amp; Control System</strong> – for monitoring and fault protection.</p></li>
  <li><p><strong>Grounding System</strong> – supporting electrical safety and fault-current management.</p></li>
  <li><p><strong>Oil Containment</strong> – helping control potential oil spills from oil-filled transformers.</p></li>
</ul>
<h2>Installation &amp; Integration</h2>
<p>Successful installation requires coordination between <strong>engineering, civil, and electrical works</strong>. Equipment foundations, cable trenches, grounding infrastructure, cable routing, and equipment positioning must be properly coordinated with the electrical installation.</p>
<p>The typical process includes <strong>engineering and planning, site preparation, equipment installation, electrical connection, inspection, testing, and commissioning</strong>.</p>
<h2>Safety, Quality &amp; Reliability</h2>
<p>Medium voltage installations require strict attention to <strong>safety, quality, and technical compliance</strong>. Proper equipment installation, cable termination, grounding, protection testing, and pre-energization inspection are essential before the system is placed into operation.</p>
<p>Contact Us:<br>📱 +62 821-4007-4122<br>📧 <a href="mailto:info@multidayamitra.co.id">info@multidayamitra.co.id</a></p>`,
      id: `<h2>Membangun Instalasi Gardu Induk &amp; Switchgear MV Andal hingga 36 kV</h2>
<p>Distribusi daya listrik yang andal adalah pondasi utama bagi fasilitas industri dan infrastruktur yang mengandalkan pasokan listrik kontinu tanpa henti. <a href="/services/electrical-construction-installation/substation-mv-switchgear-installation"><strong>Gardu induk (substation) dan switchgear tegangan menengah (MV)</strong></a> memegang peran vital dalam mengelola, melindungi, mentransformasikan, dan mendistribusikan energi listrik secara aman.</p>
<p>Sistem yang dirancang dengan baik memastikan pasokan daya tersalurkan secara efisien sekaligus meminimalkan risiko kegagalan peralatan, korsleting listrik, dan downtime tak terencana.</p>
<h2>Peran Gardu Induk &amp; Switchgear MV</h2>
<p><strong>Gardu induk</strong> berfungsi sebagai titik sentral untuk menurunkan atau menaikkan tegangan dan mendistribusikan daya sesuai kebutuhan pabrik. Gardu induk mengintegrasikan komponen utama seperti transformator daya, switchgear, sistem proteksi relay, dan sistem pembumian (grounding).</p>
<p>Sementara itu, <strong>switchgear MV</strong> menyediakan fungsi switching, isolasi, dan proteksi untuk jaringan tegangan menengah. Switchgear bertipe metal-clad umum digunakan di industri karena menawarkan keamanan tinggi dan pengoperasian yang terlindung.</p>
<p>Sistem ini dapat dirancang untuk level tegangan menengah <strong>hingga 36 kV</strong> sesuai dengan kebutuhan konfigurasi kelistrikan fasilitas Anda.</p>
<h2>Komponen Kunci Sistem</h2>
<ul>
  <li><p><strong>MV Metal-Clad Switchgear</strong> — Untuk switching, isolasi aman, dan proteksi arus gangguan.</p></li>
  <li><p><strong>Transformator Daya (Power Transformer)</strong> — Untuk transformasi tegangan dan penyaluran daya utama.</p></li>
  <li><p><strong>Sistem Proteksi &amp; Kontrol</strong> — Relay proteksi numerik untuk monitoring dan pemutusan arus gangguan seketika.</p></li>
  <li><p><strong>Sistem Grounding</strong> — Menjamin keselamatan operator dan pelepasan arus gangguan ke tanah.</p></li>
  <li><p><strong>Bak Penampung Minyak (Oil Containment)</strong> — Mencegah risiko kebocoran oli trafo ke lingkungan.</p></li>
</ul>
<h2>Instalasi &amp; Integrasi Terpadu</h2>
<p>Keberhasilan proyek membutuhkan koordinasi matang antara <strong>pekerjaan teknik sipil, mekanikal, dan elektrikal</strong>. Pondasi trafo, parit kabel (trench), grounding grid, penarikan kabel, serta penempatan switchgear harus terintegrasi dengan sempurna.</p>
<p>Tahapan pengerjaan mencakup <strong>perencanaan teknik (engineering), persiapan lokasi, perakitan peralatan, penarikan &amp; terminasi kabel, inspeksi teknis, hingga pengujian dan commissioning</strong>.</p>
<h2>Keselamatan, Kualitas &amp; Keandalan</h2>
<p>Instalasi tegangan menengah menuntut kepatuhan ketat terhadap standar keselamatan kerja dan standar teknis (IEC/IEEE/SNI). PT Multi Daya Mitra memastikan seluruh tahapan mulai dari instalasi fisik, terminasi kabel, uji proteksi relay, hingga energizing terlaksana dengan standar mutu tertinggi.</p>
<p>Kontak Kami:<br>📱 +62 821-4007-4122<br>📧 <a href="mailto:info@multidayamitra.co.id">info@multidayamitra.co.id</a></p>`,
    },
  },

  "mechanical-services-general-supplies": {
    slug: "mechanical-services-general-supplies",
    title: {
      en: "Mechanical Services & General Supplies | MDM",
      id: "Layanan Mekanikal & Suplai Umum | MDM",
    },
    category: {
      en: "Company News",
      id: "Berita Perusahaan",
    },
    excerpt: {
      en: "Comprehensive mechanical solutions for industry, from maintenance and conveyor systems to magnetic separators, high-speed doors, vacuum lifters, and motor/generator servicing for reliable and efficient plant operations.",
      id: "Solusi kebutuhan mekanikal industri, mulai dari pemeliharaan, sistem konveyor, magnetic separator, pintu berkecepatan tinggi, vacuum lifter, hingga servis motor dan generator untuk operasional yang andal dan efisien.",
    },
    body: {
      en: `<h2>Mechanical Services &amp; General Supplies</h2>
<p>In modern manufacturing, <strong>equipment and machinery reliability</strong> is critical to maintaining smooth production. Failure of a single mechanical component can trigger plant downtime, disrupt supply chains, and increase operational costs.</p>
<p><strong>Mechanical Services &amp; General Supplies</strong> by PT Multi Daya Mitra delivers complete solutions for <strong>maintenance, servicing, material handling equipment, and general industrial supplies</strong> to ensure peak plant availability.</p>
<h2>Industrial Mechanical Maintenance</h2>
<p>Routine mechanical maintenance keeps industrial equipment running in peak condition and mitigates the risk of catastrophic breakdowns.</p>
<p>Our <strong>industrial mechanical maintenance services</strong> include:</p>
<ul>
  <li><p>Comprehensive equipment condition assessments</p></li>
  <li><p>Preventive maintenance programs</p></li>
  <li><p>Mechanical troubleshooting and diagnostics</p></li>
  <li><p>Precision component repair and replacement</p></li>
  <li><p>Operating performance and vibration inspection</p></li>
</ul>
<h2>Conveyor Systems</h2>
<p><strong>Conveyor systems</strong> are the backbone of bulk material handling and production workflows. Our turnkey conveyor services cover design, installation, belt replacement, roller maintenance, drive servicing, and safety alignment.</p>
<h2>Magnetic Separators</h2>
<p>Protecting product purity and machinery from tramp metal contamination is vital in food, pharmaceutical, chemical, and mineral plants. We supply and service high-gradient <strong>magnetic separators</strong> that isolate ferrous impurities effectively.</p>
<h2>High-Speed Industrial Doors</h2>
<p>Fast-acting <strong>high-speed doors</strong> minimize cycle times between production halls, warehouses, and cleanrooms while preventing dust, air leakage, and temperature disruption.</p>
<h2>Vacuum Lifters</h2>
<p>Ergonomic <strong>vacuum lifting systems</strong> facilitate safe, rapid handling of heavy bags, cartons, glass, and metal sheets, significantly reducing worker fatigue and improving handling efficiency.</p>
<h2>Motor &amp; Generator Servicing</h2>
<p>Industrial motors and generators demand systematic servicing. We provide on-site inspection, dynamic balancing, stator rewinding, bearing replacement, and insulation resistance verification to uphold operating continuity.</p>
<h2>General Industrial Supplies</h2>
<p>Beyond engineering services, we provide a broad range of <strong>industrial spare parts, fasteners, bearings, pneumatic fittings, and consumable supplies</strong> through our streamlined procurement channel.</p>
<h2>Supporting Reliable Industrial Operations</h2>
<p>PT Multi Daya Mitra helps facilities maintain equipment uptime through the combined strength of <strong>mechanical engineering, dedicated servicing, material handling automation, and dependable supply chains</strong>.</p>
<h3>Reliable Equipment. Smoother Operation. Better Performance.</h3>
<p><strong>Need mechanical engineering services or industrial equipment supply? Let us discuss your requirements.</strong></p>
<p>Contact:<br>📱 +62 821-4007-4122<br>📧 <a href="mailto:info@multidayamitra.co.id">info@multidayamitra.co.id</a></p>`,
      id: `<h2>Mechanical Services &amp; General Supplies</h2>
<p>Dalam dunia industri, <strong>keandalan mesin dan equipment</strong> sangat penting untuk menjaga proses operasional tetap berjalan. Kerusakan pada satu equipment dapat menyebabkan downtime, menghambat produksi, dan meningkatkan biaya operasional.</p>
<p><strong>Mechanical Services &amp; General Supplies</strong> menyediakan solusi untuk mendukung kebutuhan <strong>maintenance, servicing, equipment, dan general supplies</strong> di lingkungan industri. Layanan mencakup berbagai kebutuhan mekanikal, mulai dari perawatan equipment hingga penyediaan peralatan pendukung.</p>
<h2>Industrial Mechanical Maintenance</h2>
<p>Perawatan mekanikal secara rutin membantu menjaga equipment tetap bekerja dengan baik dan mengurangi risiko kerusakan mendadak.</p>
<p>Layanan <strong>industrial mechanical maintenance</strong> meliputi:</p>
<ul>
  <li><p>Pemeriksaan kondisi equipment</p></li>
  <li><p>Preventive maintenance</p></li>
  <li><p>Troubleshooting</p></li>
  <li><p>Perbaikan dan penggantian komponen</p></li>
  <li><p>Pemeriksaan performa equipment</p></li>
</ul>
<h2>Conveyor Systems</h2>
<p><strong>Conveyor systems</strong> digunakan untuk memindahkan material dari satu area ke area lainnya dalam proses produksi maupun material handling. Solusi conveyor mencakup instalasi, inspeksi, pemeliharaan rutin, dan penggantian komponen.</p>
<h2>Magnetic Separators</h2>
<p>Dalam proses produksi, material logam yang tercampur dengan bahan produksi dapat memengaruhi kualitas produk dan merusak mesin. <strong>Magnetic separators</strong> digunakan untuk memisahkan kontaminasi logam dari material secara efektif.</p>
<h2>High-Speed Doors</h2>
<p>Pada fasilitas industri dan gudang, <strong>high-speed doors</strong> membantu mempercepat proses keluar-masuk barang sekaligus menahan debu dan menjaga stabilitas suhu ruangan.</p>
<h2>Vacuum Lifters</h2>
<p>Pemindahan material berat membutuhkan peralatan yang aman dan ergonomis. <strong>Vacuum lifters</strong> membantu mengangkat dan memindahkan muatan secara efisien tanpa membebani fisik pekerja.</p>
<h2>Motor &amp; Generator Servicing</h2>
<p>Motor dan generator merupakan penggerak utama kegiatan industri. Layanan kami mencakup inspeksi, servicing, balancing, perbaikan belitan (rewinding), dan penggantian bearing berkala.</p>
<h2>General Industrial Supplies</h2>
<p>Kami menyediakan berbagai <strong>material, spare part, dan komponen pendukung industri</strong> untuk kelancaran pemeliharaan fasilitas Anda secara praktis dan terintegrasi.</p>
<h3>Peralatan Andal. Operasi Lebih Lancar. Kinerja Lebih Baik.</h3>
<p><strong>Butuh dukungan layanan mekanikal atau suplai peralatan industri? Hubungi kami untuk konsultasi.</strong></p>
<p>Kontak:<br>📱 +62 821-4007-4122<br>📧 <a href="mailto:info@multidayamitra.co.id">info@multidayamitra.co.id</a></p>`,
    },
  },

  "scada-systems-hmi-centralized-telemetry": {
    slug: "scada-systems-hmi-centralized-telemetry",
    title: {
      en: "SCADA Systems, HMI, Centralized Telemetry, Industrial Monitoring, System Integration",
      id: "Sistem SCADA, HMI, Telemetri Terpusat, Monitoring Industri & Integrasi Sistem",
    },
    category: {
      en: "Company News",
      id: "Berita Perusahaan",
    },
    excerpt: {
      en: "SCADA, HMI, and Centralized Telemetry help industrial operations monitor equipment in real time, manage centralized data, and boost operational efficiency and reliability.",
      id: "SCADA, HMI, dan telemetri terpusat membantu industri melakukan monitoring peralatan secara real-time, mengelola data terpusat, serta meningkatkan efisiensi dan keandalan operasional.",
    },
    body: {
      en: `<h2>What Are SCADA, HMI &amp; Centralized Telemetry?</h2>
<p>In modern industrial operations, rapid and precise equipment monitoring is essential to productivity and safety. <a href="/services/automation-solutions-services"><strong>SCADA, HMI, and Centralized Telemetry</strong></a> provide manufacturing and utility companies with an integrated platform to monitor, control, and analyze plant operations in real time.</p>
<h3>SCADA Systems</h3>
<p><strong>SCADA (Supervisory Control and Data Acquisition)</strong> collects and visualizes operational telemetry across distributed equipment in real time — including pressures, temperatures, flow rates, motor statuses, and alarms.</p>
<h3>HMI (Human-Machine Interface)</h3>
<p><strong>HMI</strong> interfaces provide operators with intuitive touchscreens and graphical dashboards to control machinery, observe setpoints, and interact with the automation system easily on the factory floor.</p>
<h3>Centralized Telemetry</h3>
<p><strong>Centralized Telemetry</strong> networks multiple production facilities, pump stations, or utility zones into a unified centralized control center via industrial communication protocols (Modbus, Profinet, IEC 60870-5-104, OPC-UA).</p>
<h2>Key Industrial Benefits</h2>
<ul>
  <li><p><strong>Real-Time Monitoring</strong> — Immediate visibility into plant machinery status and production metrics.</p></li>
  <li><p><strong>Early Anomaly Detection</strong> — Automated alarms flag parameter deviations before failures escalate.</p></li>
  <li><p><strong>Centralized Data Repository</strong> — Historical trends, production logs, and compliance audits stored securely in one platform.</p></li>
  <li><p><strong>Predictive Maintenance Support</strong> — Real-time performance tracking guides proactive maintenance scheduling.</p></li>
  <li><p><strong>Better Decision Making</strong> — Transparent data dashboards empower plant managers and engineers with actionable insights.</p></li>
  <li><p><strong>Operational Efficiency</strong> — Streamlined workflows reduce manual data collection and enhance workforce productivity.</p></li>
</ul>
<h2>How Does the Architecture Work?</h2>
<p><strong>Equipment → Sensors &amp; Transmitters → PLC/RTU Controller → Industrial Communication Network → SCADA Server → HMI &amp; Management Dashboard</strong></p>
<p>Field data is acquired, securely transmitted, processed, and displayed in intuitive graphical formats accessible to operators and executives alike.</p>
<h2>MDM Supporting Industrial Solutions</h2>
<p><strong>PT Multi Daya Mitra (MDM)</strong> delivers end-to-end <strong>engineering design, system integration, PLC programming, SCADA development, and industrial telemetry</strong> tailored to your unique facility requirements.</p>
<p><strong>Accuracy • Reliability • Efficiency • Documentation</strong></p>
<h3>Looking for an Industrial Monitoring Solution?</h3>
<p>Discuss your SCADA, HMI, Telemetry, and System Integration goals with our engineering experts.</p>
<p><strong>MDM — Engineering Solutions for Better Industrial Performance.</strong></p>
<p>Contact:<br>📱 +62 821-4007-4122<br>📧 <a href="mailto:info@multidayamitra.co.id">info@multidayamitra.co.id</a></p>`,
      id: `<h2>Apa Itu SCADA, HMI &amp; Centralized Telemetry?</h2>
<p>Dalam operasional industri, monitoring kondisi equipment secara cepat dan akurat sangat penting. <a href="/services/automation-solutions-services"><strong>SCADA, HMI, dan Centralized Telemetry</strong></a> membantu perusahaan mengelola informasi tersebut dalam satu sistem yang lebih terintegrasi.</p>
<h3>SCADA Systems</h3>
<p><strong>SCADA (Supervisory Control and Data Acquisition)</strong> berfungsi mengumpulkan dan memantau data dari berbagai equipment secara real-time, seperti pressure, temperature, flow, status mesin, dan alarm.</p>
<h3>HMI</h3>
<p><strong>HMI (Human Machine Interface)</strong> merupakan tampilan yang membantu operator melihat kondisi equipment dan berinteraksi dengan sistem secara lebih mudah melalui dashboard visual.</p>
<h3>Centralized Telemetry</h3>
<p><strong>Centralized Telemetry</strong> memungkinkan data dari berbagai equipment atau lokasi dikirim dan dipantau melalui satu pusat monitoring.</p>
<h2>Manfaat Utama</h2>
<ul>
  <li><p><strong>Real-Time Monitoring</strong> — kondisi equipment dapat dipantau dengan cepat.</p></li>
  <li><p><strong>Early Detection</strong> — membantu mengetahui kondisi abnormal lebih awal.</p></li>
  <li><p><strong>Centralized Data</strong> — data dari berbagai lokasi dapat dikelola dalam satu sistem.</p></li>
  <li><p><strong>Maintenance Support</strong> — membantu monitoring kondisi dan performa equipment.</p></li>
  <li><p><strong>Better Decision Making</strong> — menyediakan data sebagai dasar evaluasi dan pengambilan keputusan.</p></li>
  <li><p><strong>Operational Efficiency</strong> — membuat proses monitoring lebih efektif dan terkoordinasi.</p></li>
</ul>
<h2>Bagaimana Sistem Bekerja?</h2>
<p><strong>Equipment → Sensor → PLC/Controller → Communication Network → SCADA → HMI/Dashboard</strong></p>
<p>Data dari equipment dikumpulkan, diproses, kemudian ditampilkan dalam bentuk informasi yang mudah dipahami oleh operator maupun management.</p>
<h2>MDM Supporting Industrial Solutions</h2>
<p><strong>PT Multi Daya Mitra (MDM)</strong> mendukung kebutuhan <strong>engineering, system integration, dan industrial monitoring</strong> dengan solusi yang disesuaikan dengan kebutuhan operasional.</p>
<p><strong>Accuracy • Reliability • Efficiency • Documentation</strong></p>
<h3>Butuh Solusi Monitoring Industri?</h3>
<p>Diskusikan kebutuhan SCADA, HMI, Centralized Telemetry, dan System Integration bersama tim kami.</p>
<p><strong>MDM — Engineering Solutions for Better Industrial Performance.</strong></p>
<p>Kontak:<br>📱 +62 821-4007-4122<br>📧 <a href="mailto:info@multidayamitra.co.id">info@multidayamitra.co.id</a></p>`,
    },
  },

  "centralized-fire-alarm-monitoring": {
    slug: "centralized-fire-alarm-monitoring",
    title: {
      en: "Centralized Fire Alarm Monitoring Systems for Multi-Building Facilities",
      id: "Sistem Monitoring Fire Alarm Terpusat untuk Fasilitas Multi-Gedung",
    },
    category: {
      en: "Company News",
      id: "Berita Perusahaan",
    },
    excerpt: {
      en: "Centralized fire alarm monitoring integrates multiple fire detection panels into a single command center for faster response, regulatory compliance, and operational efficiency.",
      id: "Monitoring fire alarm terpusat mengintegrasikan banyak panel deteksi kebakaran ke dalam satu pusat komando untuk respons darurat lebih cepat, kepatuhan regulasi, dan efisiensi operasional.",
    },
    body: {
      en: `<h2>Centralized Fire Alarm Monitoring Systems for Multi-Building Facilities</h2>
<p>For facilities with multiple buildings, production zones, or campus-wide operations, managing individual fire alarm panels in isolation creates response delays and oversight gaps. <strong>Centralized fire alarm monitoring systems</strong> integrate all detection zones into a unified command interface, enabling faster incident response and streamlined compliance documentation.</p>
<h2>Key Benefits</h2>
<ul>
  <li><p><strong>Single Command Center Visibility</strong> — Comprehensive real-time status across all buildings, zones, and suppression panels.</p></li>
  <li><p><strong>Faster Alarm Acknowledgment &amp; Dispatch</strong> — Instant automated notifications for immediate emergency response coordination.</p></li>
  <li><p><strong>Automated Event Logging</strong> — Complete audit trails and event records compliant with life-safety regulations.</p></li>
  <li><p><strong>Integration with Building Management Systems</strong> — Seamless interlock with HVAC ventilation, elevators, and access control for safe evacuation.</p></li>
  <li><p><strong>Remote Monitoring Capability</strong> — 24/7 centralized surveillance accessible across security control rooms.</p></li>
</ul>
<h2>Implementation &amp; Engineering Scope</h2>
<p><strong>PT Multi Daya Mitra</strong> designs and implements centralized fire alarm monitoring solutions using leading addressable and networkable platforms (including Bosch Security, Honeywell, and Notifier). Our scope covers system architecture engineering, network infrastructure, panel integration, workstation graphic software configuration, and comprehensive operator training.</p>
<p>Contact:<br>📱 +62 821-4007-4122<br>📧 <a href="mailto:info@multidayamitra.co.id">info@multidayamitra.co.id</a></p>`,
      id: `<h2>Sistem Monitoring Fire Alarm Terpusat untuk Fasilitas Multi-Gedung</h2>
<p>Bagi fasilitas dengan banyak gedung, area produksi terpisah, atau kompleks pergudangan yang luas, mengelola panel fire alarm secara terisolasi dapat menimbulkan keterlambatan respons darurat dan celah pengawasan keselamatan. <strong>Sistem monitoring fire alarm terpusat</strong> mengintegrasikan seluruh zona deteksi dan panel kontrol ke dalam satu antarmuka komando terpadu, memungkinkan respons insiden yang lebih cepat dan dokumentasi kepatuhan regulasi yang lebih akurat.</p>
<h2>Manfaat Utama</h2>
<ul>
  <li><p><strong>Pusat Komando Tunggal (Single Command Center)</strong> — Visibilitas menyeluruh atas status kebakaran di seluruh gedung dan zona produksi dalam satu layar.</p></li>
  <li><p><strong>Respons Darurat Lebih Cepat</strong> — Notifikasi alarm instan dan koordinasi tanggap darurat yang terkoordinasi secara otomatis.</p></li>
  <li><p><strong>Pencatatan Event Otomatis</strong> — Dokumentasi riwayat alarm dan uji sistem secara otomatis untuk memenuhi audit kepatuhan regulasi keselamatan kerja.</p></li>
  <li><p><strong>Integrasi Sistem Gedung</strong> — Terkoneksi dengan Building Automation System (BAS), HVAC, elevator, dan sistem access control untuk evakuasi aman.</p></li>
  <li><p><strong>Kapabilitas Monitoring Jarak Jauh</strong> — Pemantauan operasional 24/7 melalui jaringan pusat kontrol keamanan.</p></li>
</ul>
<h2>Implementasi &amp; Layanan MDM</h2>
<p><strong>PT Multi Daya Mitra</strong> merancang dan mengimplementasikan solusi monitoring fire alarm terpusat menggunakan platform terkemuka (seperti Bosch Security, Honeywell, dan Notifier). Cakupan layanan kami meliputi perancangan arsitektur jaringan, integrasi panel deteksi konvensional &amp; addressable, konfigurasi workstation operator, hingga pelatihan komprehensif bagi tim keselamatan fasilitas Anda.</p>
<p>Kontak:<br>📱 +62 821-4007-4122<br>📧 <a href="mailto:info@multidayamitra.co.id">info@multidayamitra.co.id</a></p>`,
    },
  },

  "transformer-testing-maintenance": {
    slug: "transformer-testing-maintenance",
    title: {
      en: "Transformer Testing and Maintenance: Protecting Your Most Valuable Network Assets",
      id: "Pengujian dan Pemeliharaan Transformator: Melindungi Aset Vital Jaringan Listrik",
    },
    category: {
      en: "Insight",
      id: "Wawasan & Edukasi",
    },
    excerpt: {
      en: "Power transformers represent critical investments in electrical networks. Routine health assessments detect incipient faults and extend asset service life.",
      id: "Transformator daya merupakan investasi vital dalam jaringan listrik. Penilaian kesehatan rutin mendeteksi anomali sejak dini dan memperpanjang usia pakai aset.",
    },
    body: {
      en: `<h2>Transformer Testing and Maintenance: Protecting Your Most Valuable Network Assets</h2>
<p>Power transformers represent one of the largest capital investments in any electrical distribution network. Because replacement costs are substantial and lead times can exceed a year, a proactive diagnostic testing and maintenance program is critical for maximizing transformer longevity and preventing catastrophic power failures.</p>
<h3>Why Is Transformer Diagnostic Testing Critical?</h3>
<p>Transformers operate under continuous electrical, thermal, and mechanical stresses. Over years of service, oil insulation breaks down, winding insulation paper deteriorates, and mechanical clamps may loosen. Without routine diagnostic testing, incipient faults can progress undetected until a catastrophic flashover or unplanned plant blackout occurs.</p>
<h3>Key Diagnostic Tests</h3>
<ul>
  <li><p><strong>Winding Resistance Testing</strong> — Verifies internal connection integrity, detects loose joints, and checks tap-changer contact resistance.</p></li>
  <li><p><strong>Insulation Resistance &amp; Polarization Index (PI)</strong> — Assesses the condition and dryness of primary and secondary winding insulation.</p></li>
  <li><p><strong>Transformer Turns Ratio (TTR)</strong> — Identifies shorted turns, open circuits, and confirms correct phase displacement across all tap positions.</p></li>
  <li><p><strong>Dissolved Gas Analysis (DGA)</strong> — Analyzes gases dissolved in transformer oil to identify overheating, arcing, and partial discharge early.</p></li>
  <li><p><strong>Oil Breakdown Voltage (BDV) &amp; Moisture Testing</strong> — Checks dielectric withstand strength and water content in insulating oil.</p></li>
  <li><p><strong>Sweep Frequency Response Analysis (SFRA)</strong> — Detects mechanical winding deformation and core displacement following transport or short-circuit events.</p></li>
</ul>
<h3>PT Multi Daya Mitra Transformer Services</h3>
<p>PT Multi Daya Mitra provides comprehensive on-site transformer testing, oil purification (vacuum dehydration and degasification), gasket replacement, and preventive maintenance using calibrated high-precision instruments. Our engineers deliver actionable condition assessment reports with prioritized recommendations.</p>
<p>Contact:<br>📱 +62 821-4007-4122<br>📧 <a href="mailto:info@multidayamitra.co.id">info@multidayamitra.co.id</a></p>`,
      id: `<h2>Pengujian dan Pemeliharaan Transformator: Melindungi Aset Vital Jaringan Listrik</h2>
<p>Transformator daya merupakan salah satu investasi modal terbesar dalam jaringan distribusi listrik industri. Biaya penggantian trafo sangat besar dan masa inden pengadaan unit baru dapat memakan waktu berbulan-bulan. Oleh karena itu, program pengujian diagnostik dan pemeliharaan proaktif sangat krusial untuk memperpanjang usia pakai transformator serta mencegah kegagalan fatal yang melumpuhkan pabrik.</p>
<h3>Mengapa Pengujian Diagnostik Trafo Sangat Penting?</h3>
<p>Transformator beroperasi di bawah tekanan termal, elektrikal, dan mekanikal secara berkelanjutan. Seiring berjalannya waktu, minyak trafo dapat teroksidasi, kertas isolasi belitan mengalami penuaan, dan baut pengikat busbar dapat mengalami pengenduran. Tanpa pengujian rutin, potensi kerusakan tersembunyi dapat berkembang tanpa disadari hingga menyebabkan ledakan trafo atau padam listrik total.</p>
<h3>Pengujian Diagnostik Utama</h3>
<ul>
  <li><p><strong>Uji Resistansi Belitan (Winding Resistance)</strong> — Memeriksa kontinuitas belitan, mendeteksi kelonggaran sambungan internal, dan memeriksa kontak On-Load Tap Changer (OLTC).</p></li>
  <li><p><strong>Uji Tahanan Isolasi &amp; Polarization Index (Megger / PI)</strong> — Mengukur tingkat kebersihan dan kelembapan sistem isolasi belitan primer dan sekunder.</p></li>
  <li><p><strong>Uji Rasio Transformasi (TTR Test)</strong> — Mengonfirmasi perbandingan lilitan, mendeteksi lilitan hubung singkat, serta memverifikasi tap changer di seluruh posisi.</p></li>
  <li><p><strong>Dissolved Gas Analysis (DGA)</strong> — Menganalisis kandungan gas terlarut dalam minyak trafo untuk mendeteksi gejala overheating, corona, dan arcing sejak dini.</p></li>
  <li><p><strong>Uji Tegangan Tembus Minyak (BDV Test)</strong> — Memastikan kekuatan dielektrik minyak isolasi terhadap tegangan tinggi.</p></li>
  <li><p><strong>Sweep Frequency Response Analysis (SFRA)</strong> — Mendeteksi pergeseran fisik atau deformasi mekanis pada inti dan belitan akibat gaya hubung singkat.</p></li>
</ul>
<h3>Layanan Pemeliharaan Trafo oleh PT Multi Daya Mitra</h3>
<p>PT Multi Daya Mitra melayani pengujian trafo on-site, purifikasi dan filtrasi minyak trafo (vacuum dehydration), penggantian gasket, serta pemeliharaan menyeluruh dengan instrumen uji presisi terkalibrasi. Tim engineer kami menyajikan laporan kesehatan trafo lengkap disertai rekomendasi tindakan teknis terukur.</p>
<p>Kontak:<br>📱 +62 821-4007-4122<br>📧 <a href="mailto:info@multidayamitra.co.id">info@multidayamitra.co.id</a></p>`,
    },
  },

  "partial-discharge-analyzer": {
    slug: "partial-discharge-analyzer",
    title: {
      en: "Partial Discharge Analyzer for Predictive Maintenance of MV/HV Equipment",
      id: "Alat Analisis Partial Discharge untuk Pemeliharaan Prediktif Peralatan MV/HV",
    },
    category: {
      en: "Insight",
      id: "Wawasan & Edukasi",
    },
    excerpt: {
      en: "Online partial discharge analysis enables early detection of insulation defects in medium and high voltage switchgear, transformers, and cable systems without service interruption.",
      id: "Analisis partial discharge (PD Scan) secara online mendeteksi kerusakan isolasi pada switchgear, transformator, dan kabel tegangan menengah tanpa memutus aliran listrik.",
    },
    body: {
      en: `<h2>Partial Discharge Analyzer for Predictive Maintenance of MV/HV Equipment</h2>
<p>Partial Discharge (PD) is a localized electrical breakdown that does not completely bridge the space between conductors within an insulation system. If left unaddressed, partial discharge activity progressively erodes dielectric materials until a catastrophic flashover or complete insulation failure occurs. Online PD scanning provides an indispensable early-warning capability for electrical assets.</p>
<h3>What Can Partial Discharge Testing Detect?</h3>
<p>Modern non-intrusive partial discharge testing identifies insulation vulnerabilities while equipment remains fully energized under normal operational load:</p>
<ul>
  <li><p><strong>MV Switchgear &amp; Busbars</strong> — Internal voids, tracking across cast-resin insulators, and surface contamination.</p></li>
  <li><p><strong>Cable Terminations &amp; Joints</strong> — Inadequate stress control, moisture ingress, or workmanship defects in MV/HV cable kits.</p></li>
  <li><p><strong>Power Transformers</strong> — Internal insulation degradation, bushing deterioration, and discharge activity inside oil barriers.</p></li>
  <li><p><strong>Outdoor HV Substations</strong> — Corona and surface discharge on disconnectors, insulators, and surge arresters.</p></li>
</ul>
<h3>Multi-Sensor Detection Technologies</h3>
<p>Our PD diagnostic methodology incorporates multiple complementary sensor types for comprehensive asset coverage:</p>
<ul>
  <li><p><strong>Transient Earth Voltage (TEV) Sensors</strong> — Detects electromagnetic pulses induced on the outer metal cladding of switchgear cabinets.</p></li>
  <li><p><strong>Acoustic Contact Sensors</strong> — Measures high-frequency acoustic waves emitted by discharge events inside transformers and cable terminations.</p></li>
  <li><p><strong>High Frequency Current Transformers (HFCT)</strong> — Clamped around cable earth sheaths to detect discharge pulses traveling to ground.</p></li>
  <li><p><strong>Airborne Ultrasonic Receivers</strong> — Pinpoints surface discharge and corona in open-terminal substations.</p></li>
</ul>
<h3>Partner with PT Multi Daya Mitra for Predictive Electrical Asset Health</h3>
<p>PT Multi Daya Mitra conducts professional on-site PD testing and baseline condition profiling, empowering asset managers to schedule targeted repairs before unplanned catastrophic failures occur.</p>
<p>Contact:<br>📱 +62 821-4007-4122<br>📧 <a href="mailto:info@multidayamitra.co.id">info@multidayamitra.co.id</a></p>`,
      id: `<h2>Alat Analisis Partial Discharge untuk Pemeliharaan Prediktif Peralatan MV/HV</h2>
<p>Partial Discharge (peluahan parsial) adalah fenomena loncatan listrik terlokalisasi yang terjadi di dalam atau pada permukaan bahan isolasi tegangan menengah hingga tinggi. Jika tidak terdeteksi, aktivitas partial discharge akan terus mengikis dan merusak material dielektrik hingga terjadi kegagalan isolasi total (flashover) yang memicu ledakan dan pemadaman pabrik. Pengujian PD Scan online menghadirkan sistem deteksi dini paling efektif untuk mencegah kerusakan fatal tersebut.</p>
<h3>Apa Saja yang Dapat Dideteksi oleh Uji Partial Discharge?</h3>
<p>Pengujian PD non-intrusif dapat dilakukan secara online saat peralatan sedang beroperasi penuh tanpa perlu memadamkan aliran listrik:</p>
<ul>
  <li><p><strong>Kubikel MV Switchgear &amp; Busbar</strong> — Rongga udara (void) di dalam resin isolator, retakan isolasi, dan kontaminasi permukaan busbar.</p></li>
  <li><p><strong>Terminasi &amp; Jointing Kabel Tegangan Menengah</strong> — Kegagalan stress control, kelembapan yang masuk, atau ketidaksempurnaan pemasangan termination kit.</p></li>
  <li><p><strong>Transformator Daya</strong> — Degradasi isolasi internal belitan, pemburukan kondisi bushing, serta peluahan di dalam tangki oli.</p></li>
  <li><p><strong>Gardu Induk Outdoor</strong> — Gejala korona dan surface tracking pada pemutus (disconnector), isolator keramik, dan arrester.</p></li>
</ul>
<h3>Teknologi Sensor Deteksi Multi-Metode</h3>
<p>Metode diagnostik kami mengombinasikan beragam sensor terkalibrasi untuk cakupan analisis komprehensif:</p>
<ul>
  <li><p><strong>Sensor Transient Earth Voltage (TEV)</strong> — Menangkap denyut elektromagnetik frekuensi tinggi pada dinding logam kubikel switchgear.</p></li>
  <li><p><strong>Sensor Kontak Akustik (Acoustic Contact)</strong> — Menangkap gelombang ultrasonik yang dihasilkan dari pelepasan muatan listrik di dalam tangki trafo dan terminasi kabel.</p></li>
  <li><p><strong>High Frequency Current Transformer (HFCT)</strong> — Diklem pada kabel grounding untuk mendeteksi pulsa arus frekuensi tinggi akibat partial discharge.</p></li>
  <li><p><strong>Parabolic Airborne Ultrasonic Dish</strong> — Menemukan titik persis korona dan peluahan di area gardu terbuka dari jarak aman.</p></li>
</ul>
<h3>Konsultasikan Pemeliharaan Prediktif Bersama PT Multi Daya Mitra</h3>
<p>PT Multi Daya Mitra melayani jasa inspeksi Partial Discharge online dan audit kondisi kesehatan aset kelistrikan industri di seluruh Indonesia, membantu Anda menjadwalkan perbaikan terencana sebelum terjadi pemadaman darurat.</p>
<p>Kontak:<br>📱 +62 821-4007-4122<br>📧 <a href="mailto:info@multidayamitra.co.id">info@multidayamitra.co.id</a></p>`,
    },
  },

  "20mw-substation-commissioning-east-java": {
    slug: "20mw-substation-commissioning-east-java",
    id: "00000000-0000-0000-0000-000000000802",
    title: {
      en: "Preventive Maintenance of Medium Voltage (MV) Switchgear",
      id: "Pemeliharaan Preventif Switchgear Tegangan Menengah (MV)",
    },
    category: {
      en: "Industrial Projects",
      id: "Proyek Industri",
    },
    excerpt: {
      en: "Comprehensive preventive maintenance and diagnostic testing for Medium Voltage (MV) switchgear to ensure operational safety, minimize downtime, and extend electrical asset longevity.",
      id: "Pemeliharaan preventif komprehensif dan pengujian diagnostik untuk switchgear tegangan menengah (MV) guna menjamin keselamatan operasional, meminimalkan downtime, dan memperpanjang usia pakai aset kelistrikan.",
    },
    featuredImageUrl: "/uploads/hero-project.jpg",
    featured: false,
    publishedAt: "2020-06-25T00:00:00Z",
    body: {
      en: `<h2>Ensuring Reliability, Safety, and Asset Longevity</h2>
<p>Medium Voltage (MV) switchgear forms the backbone of industrial power distribution networks, responsible for switching, isolating, and protecting electrical circuits under both normal and fault conditions. Over time, environmental factors such as dust, humidity, thermal expansion, and mechanical wear degrade insulation and contact surfaces. A structured <strong>preventive maintenance program</strong> detects incipient anomalies before they escalate into catastrophic flashovers or unplanned plant blackouts.</p>
<h3>Key Objectives of MV Switchgear Preventive Maintenance</h3>
<ul>
  <li><p><strong>System Reliability:</strong> Minimize sudden trip events and maintain uninterrupted power supply to continuous industrial processes.</p></li>
  <li><p><strong>Personnel and Asset Safety:</strong> Mitigate arc-flash hazards, internal arcing risks, and catastrophic explosive failures.</p></li>
  <li><p><strong>Extended Asset Lifespan:</strong> Prevent premature degradation of vacuum interrupters, SF6 compartments, busbar insulation, and operating mechanisms.</p></li>
  <li><p><strong>Compliance &amp; Documentation:</strong> Adhere to IEC 62271, IEEE standards, and insurance regulatory safety requirements.</p></li>
</ul>
<h3>Core Inspection and Diagnostic Scope</h3>
<p>Our comprehensive MV switchgear maintenance procedure covers every critical component:</p>
<ol>
  <li><p><strong>Visual Inspection &amp; Mechanical Servicing:</strong> Cleaning cubicle compartments, checking door interlocks, inspecting racking mechanisms, and lubricating moving mechanical linkages.</p></li>
  <li><p><strong>Contact Resistance (Ductor / Micro-Ohm) Testing:</strong> Measuring main circuit contact resistance across vacuum / SF6 circuit breaker poles and tulip finger clusters to eliminate hot-spot risks.</p></li>
  <li><p><strong>Insulation Resistance (Megger) &amp; Hi-Pot Testing:</strong> Verifying dielectric integrity of busbars, post insulators, current transformers (CT), and potential transformers (PT) phase-to-phase and phase-to-earth.</p></li>
  <li><p><strong>Circuit Breaker Timing &amp; Motion Analysis:</strong> Measuring opening, closing, and trip-free operational times to ensure strict synchronization within manufacturer tolerances.</p></li>
  <li><p><strong>Protection Relay Secondary Injection Testing:</strong> Calibrating overcurrent (50/51), earth-fault (50N/51N), undervoltage (27), and directional relays to confirm protection coordination integrity.</p></li>
  <li><p><strong>Infrared Thermography Inspection:</strong> Scanning busbar joints, terminations, and breaker connections under load to detect abnormal thermal signatures prior to planned shutdown.</p></li>
</ol>
<h3>Partner with PT Multi Daya Mitra for Switchgear Maintenance</h3>
<p>PT Multi Daya Mitra provides certified electrical testing engineers equipped with calibrated testing equipment (Omicron, Megger, Fluke) to execute turnkey preventive maintenance during planned shutdowns or turnaround periods. We provide detailed condition assessment reports with actionable recommendations.</p>
<p>Contact our engineering specialists:<br>📱 +62 821-4007-4122<br>📧 <a href="mailto:info@multidayamitra.co.id">info@multidayamitra.co.id</a></p>`,
      id: `<h2>Menjamin Keandalan, Keselamatan, dan Usia Pakai Aset Kelistrikan</h2>
<p>Switchgear tegangan menengah (Medium Voltage / MV Switchgear) merupakan tulang punggung distribusi daya fasilitas industri, yang berfungsi melakukan switching, isolasi, dan proteksi jaringan listrik baik saat kondisi normal maupun saat terjadi gangguan arus hubung singkat. Seiring waktu, faktor lingkungan seperti debu, kelembapan, ekspansi termal, dan keausan mekanis dapat menurunkan kualitas isolasi dan kontak listrik. Program <strong>pemeliharaan preventif (preventive maintenance) terstruktur</strong> mampu mendeteksi potensi kerusakan sebelum berkembang menjadi ledakan busur api (arc-flash) atau pemadaman total pabrik.</p>
<h3>Tujuan Utama Pemeliharaan Preventif Switchgear MV</h3>
<ul>
  <li><p><strong>Keandalan Sistem Distribusi:</strong> Mencegah trip mendadak dan menjaga pasokan listrik kontinu untuk lini produksi dan utilitas penting.</p></li>
  <li><p><strong>Keselamatan Personel &amp; Fasilitas:</strong> Mereduksi bahaya arc-flash, percikan api internal, dan risiko ledakan kubikel.</p></li>
  <li><p><strong>Memperpanjang Usia Pakai Peralatan:</strong> Mencegah degradasi dini pada vacuum interrupter, kompartemen SF6, isolator busbar, dan mekanisme pegas penggerak.</p></li>
  <li><p><strong>Kepatuhan Regulasi &amp; Standar:</strong> Memenuhi standar internasional IEC 62271, IEEE, PUIL/SNI, serta audit kelayakan asuransi industri.</p></li>
</ul>
<h3>Ruang Lingkup Inspeksi &amp; Pengujian Diagnostik</h3>
<p>Prosedur pemeliharaan switchgear MV oleh tim ahli kami mencakup seluruh komponen vital:</p>
<ol>
  <li><p><strong>Inspeksi Visual &amp; Pembersihan Mekanikal:</strong> Pembersihan kompartemen kubikel dari debu dan partikel konduktif, pemeriksaan interlock pintu, pelumasan mekanisme racking, dan verifikasi shutter otomatis.</p></li>
  <li><p><strong>Uji Resistansi Kontak (Micro-Ohm / Ductor Test):</strong> Mengukur tahanan kontak utama pada pole circuit breaker (VCB/SF6) dan kluster tulip kontak untuk mencegah titik panas (hot-spot).</p></li>
  <li><p><strong>Uji Tahanan Isolasi (Megger) &amp; Uji Tegangan Tinggi (Hi-Pot):</strong> Memeriksa kekuatan dielektrik isolasi busbar, trafo arus (CT), dan trafo tegangan (PT) antar-fasa dan fasa-ke-ground.</p></li>
  <li><p><strong>Analisis Waktu Kerja Breaker (Timing Test):</strong> Mengukur waktu buka (opening time), waktu tutup (closing time), dan sinkronisasi tiga fasa sesuai spesifikasi pabrikan.</p></li>
  <li><p><strong>Uji Injeksi Sekunder Relay Proteksi:</strong> Menguji keandalan dan waktu kerja relay proteksi arus lebih (50/51), gangguan tanah (50N/51N), dan tegangan kurang (27) untuk memastikan koordinasi proteksi bekerja tepat.</p></li>
  <li><p><strong>Inspeksi Termografi Inframerah:</strong> Pemindaian termal pada sambungan busbar dan terminasi kabel saat berbeban guna mendeteksi panas abnormal sebelum shutdown terencana.</p></li>
</ol>
<h3>Layanan Pemeliharaan Switchgear oleh PT Multi Daya Mitra</h3>
<p>PT Multi Daya Mitra didukung oleh tim engineer berpengalaman dan instrumen uji presisi terkalibrasi (Omicron, Megger, Fluke) siap menangani pemeliharaan switchgear MV saat shutdown atau turnaround period secara tepat waktu dan aman.</p>
<p>Konsultasikan jadwal pemeliharaan switchgear fasilitas Anda:<br>📱 +62 821-4007-4122<br>📧 <a href="mailto:info@multidayamitra.co.id">info@multidayamitra.co.id</a></p>`,
    },
  },

  "effects-of-harmonic-distortion": {
    slug: "effects-of-harmonic-distortion",
    id: "00000000-0000-0000-0000-000000000804",
    title: {
      en: "Effects of Harmonics – Resonance in Industrial Electrical Systems",
      id: "Pengaruh Harmonisa – Resonansi pada Sistem Distribusi Listrik Industri",
    },
    category: {
      en: "Engineering Insights",
      id: "Wawasan Teknik & Analisis",
    },
    excerpt: {
      en: "Understanding how harmonic currents, voltage distortion, and electrical resonance impact industrial power distribution, leading to transformer overheating, capacitor failure, and equipment malfunction.",
      id: "Memahami bagaimana arus harmonisa, distorsi tegangan, dan resonansi kelistrikan memengaruhi sistem distribusi daya industri, memicu panas berlebih pada transformator, kerusakan kapasitor, dan malfungsi peralatan.",
    },
    featuredImageUrl: "/uploads/Relay-Protection-Study.jpg",
    featured: false,
    publishedAt: "2020-05-12T00:00:00Z",
    body: {
      en: `<h2>Definition and Origin of Harmonics in Electrical Distribution</h2>
<p>In modern industrial facilities, the widespread adoption of power electronic devices has fundamentally changed the nature of electrical loads. While traditional loads are linear (drawing sinusoidal current proportional to applied voltage), modern equipment utilizes <strong>non-linear loads</strong>. These non-linear loads draw current in abrupt pulses, injecting harmonic currents that distort the fundamental 50 Hz sinusoidal waveform across the power distribution network.</p>
<h3>Common Sources of Harmonic Distortion</h3>
<p>Harmonics are primarily generated by non-linear electronic equipment, including:</p>
<ul>
  <li><p><strong>Variable Speed Drives (VSD / VFD) and Inverters:</strong> 6-pulse and 12-pulse rectifiers driving induction motors.</p></li>
  <li><p><strong>Uninterruptible Power Supplies (UPS):</strong> Double-conversion rectifier and battery-charging stages.</p></li>
  <li><p><strong>Arc Furnaces &amp; Welding Equipment:</strong> Erratic arc dynamics creating broadband harmonic spectrums.</p></li>
  <li><p><strong>Switching Power Supplies (SMPS) &amp; Industrial LED Lighting:</strong> Generating significant 3rd, 5th, and 7th harmonic orders.</p></li>
</ul>
<h3>The Phenomenon of Electrical Resonance</h3>
<p>One of the most dangerous side effects of harmonic currents is <strong>harmonic resonance</strong>, which occurs when the inductive reactance of power transformers equals the capacitive reactance of Power Factor Correction (PFC) capacitor banks at a particular harmonic frequency:</p>
<ul>
  <li><p><strong>Parallel Resonance:</strong> Occurs when the transformer inductance and capacitor bank form a parallel resonant circuit. Harmonic currents matching this resonant frequency are magnified multiple times, generating extreme voltage distortion (THD-V) across switchgear and panels.</p></li>
  <li><p><strong>Series Resonance:</strong> Occurs when the supply inductance and capacitor bank form a low-impedance path to ground, causing excessive harmonic currents to flow into the capacitor units, leading to blown fuses or ruptured casings.</p></li>
</ul>
<h3>Consequences on Industrial Equipment</h3>
<p>If harmonic distortion exceeds recommended IEEE 519 standards, industrial operations face severe risks:</p>
<ol>
  <li><p><strong>Transformer Overheating:</strong> Increased eddy current and stray load losses dramatically elevate winding temperatures, demanding derating or causing insulation failure.</p></li>
  <li><p><strong>Capacitor Bank Destruction:</strong> Overvoltage stress and excessive harmonic currents lead to capacitor bulging, dielectric breakdown, and fire hazards.</p></li>
  <li><p><strong>Nuisance Tripping:</strong> Protection relays, circuit breakers, and sensitive PLC controllers malfunction due to zero-crossing distortion.</p></li>
  <li><p><strong>Neutral Conductor Overloading:</strong> Triplen harmonics (3rd, 9th, 15th) accumulate in neutral conductors, causing neutral current to exceed phase current.</p></li>
</ol>
<h3>Harmonic Mitigation Solutions by PT Multi Daya Mitra</h3>
<p>PT Multi Daya Mitra provides comprehensive power quality engineering services to diagnose and eliminate harmonic problems:</p>
<ul>
  <li><p><strong>Power Quality Audit:</strong> On-site measurement and class-A logging of THD-V, THD-I, and individual harmonic spectrums up to the 50th order.</p></li>
  <li><p><strong>Detuned Filter Reactors:</strong> Installing detuned harmonic reactors (7%, 14%) in series with capacitor banks to shift resonance frequencies below the dominant harmonic orders.</p></li>
  <li><p><strong>Active Harmonic Filters (AHF):</strong> Deploying dynamic IGBT-based active filters that inject canceling harmonic currents in real time, reducing THD-I below 5%.</p></li>
</ul>
<p>Protect your industrial network against harmonic resonance. Consult our power quality team:<br>📱 +62 821-4007-4122<br>📧 <a href="mailto:info@multidayamitra.co.id">info@multidayamitra.co.id</a></p>`,
      id: `<h2>Definisi dan Asal Muasal Harmonisa pada Distribusi Listrik</h2>
<p>Dalam fasilitas industri modern, penggunaan perangkat elektronika daya telah mengubah karakteristik beban kelistrikan secara mendasar. Berbeda dengan beban linier konvensional yang menyerap arus sinusoidal murni sebanding dengan tegangan, peralatan modern merupakan <strong>beban non-linier</strong>. Beban ini menyerap arus dalam bentuk pulsa-pulsa tajam, yang menginjeksikan arus harmonisa dan mendistorsi gelombang sinusoidal fundamental 50 Hz pada jaringan distribusi listrik pabrik.</p>
<h3>Sumber Utama Distorsi Harmonisa</h3>
<p>Harmonisa terutama dihasilkan oleh peralatan industri berbasis konverter daya, seperti:</p>
<ul>
  <li><p><strong>Variable Speed Drive (VSD / Inverter Motor):</strong> Rangkaian rectifier 6-pulsa dan 12-pulsa pengatur putaran motor.</p></li>
  <li><p><strong>Uninterruptible Power Supply (UPS):</strong> Rangkaian penyearah dan sistem pengisian baterai berkapasitas besar.</p></li>
  <li><p><strong>Mesin Las Busur Listrik (Welder) &amp; Arc Furnace:</strong> Beban dinamis berfluktuasi tinggi yang menghasilkan spektrum harmonisa luas.</p></li>
  <li><p><strong>Switching Power Supply (SMPS) &amp; Pencahayaan LED Industri:</strong> Menyumbang harmonisa orde ke-3, ke-5, dan ke-7 secara signifikan.</p></li>
</ul>
<h3>Fenomena Resonansi Harmonisa</h3>
<p>Dampak paling berbahaya dari distorsi harmonisa adalah timbulnya <strong>resonansi kelistrikan</strong>. Resonansi terjadi ketika reaktansi induktif dari transformator daya berinteraksi sama besar dengan reaktansi kapasitif dari Bank Kapasitor (Power Factor Correction / PFC) pada frekuensi harmonisa tertentu:</p>
<ul>
  <li><p><strong>Resonansi Paralel:</strong> Terbentuk dari kombinasi induktansi transformator dan bank kapasitor. Arus harmonisa pada frekuensi resonansi ini akan diamplifikasi berkali-kali lipat, memicu lonjakan tegangan harmonisa tinggi (THD-V ekstrem) di busbar panel.</p></li>
  <li><p><strong>Resonansi Seri:</strong> Menciptakan jalur impedansi sangat rendah menuju ground pada frekuensi tertentu, menarik arus harmonisa sangat besar melewati bank kapasitor hingga sekring putus atau modul kapasitor meledak.</p></li>
</ul>
<h3>Dampak Buruk pada Peralatan Pabrik</h3>
<p>Bila total harmonic distortion melebihi ambang batas standar IEEE 519 atau regulasi PLN, berbagai dampak kerugian akan dialami:</p>
<ol>
  <li><p><strong>Overheating Transformator:</strong> Kerugian arus eddy dan kerugian stray load meningkat drastis, menyebabkan trafo cepat panas dan kapasitas daya efektifnya menurun (derating).</p></li>
  <li><p><strong>Kerusakan Kapasitor Bank:</strong> Tegangan berlebih dan arus harmonisa tinggi menyebabkan kapasitor menggelembung (bulging), rusak isolasi dielektriknya, hingga memicu bahaya kebakaran.</p></li>
  <li><p><strong>Malfungsi Relay &amp; PLC (Nuisance Tripping):</strong> Gelombang yang terdistorsi mengganggu deteksi zero-crossing pada perangkat elektronik sensitif, memicu trip palsu.</p></li>
  <li><p><strong>Overload Penghantar Netral:</strong> Harmonisa urutan ke-3 (triplen harmonics) saling menjumlahkan diri pada kabel netral, membuat arus kabel netral melampaui kapasitas fasa.</p></li>
</ol>
<h3>Solusi Mitigasi Harmonisa oleh PT Multi Daya Mitra</h3>
<p>PT Multi Daya Mitra menyediakan solusi menyeluruh untuk audit dan mitigasi harmonisa di fasilitas industri:</p>
<ul>
  <li><p><strong>Audit Kualitas Daya (Power Quality Audit):</strong> Pengukuran dan perekaman komprehensif THD-V, THD-I, dan spektrum orde harmonisa hingga orde ke-50 menggunakan power quality analyzer terkalibrasi.</p></li>
  <li><p><strong>Detuned Reactor pada Kapasitor:</strong> Pemasangan reaktor harmonisa (detuned reactor 7% atau 14%) secara seri dengan kapasitor untuk menggeser titik resonansi jauh di bawah orde harmonisa utama.</p></li>
  <li><p><strong>Active Harmonic Filter (AHF):</strong> Instalasi filter aktif berbasis IGBT cerdas yang menginjeksikan arus balik secara real-time guna menekan THD-I di bawah 5%.</p></li>
</ul>
<p>Lindungi sistem kelistrikan pabrik Anda dari risiko resonansi harmonisa. Hubungi tim engineering kami:<br>📱 +62 821-4007-4122<br>📧 <a href="mailto:info@multidayamitra.co.id">info@multidayamitra.co.id</a></p>`,
    },
  },

  "energy-monitoring-system-launch": {
    slug: "energy-monitoring-system-launch",
    id: "00000000-0000-0000-0000-000000000801",
    title: {
      en: "Energy Monitoring System for Sustainability & ESG Reporting",
      id: "Sistem Monitoring Energi Cerdas untuk Keberlanjutan & Pelaporan ESG",
    },
    category: {
      en: "Company News",
      id: "Berita Perusahaan",
    },
    excerpt: {
      en: "PT Multi Daya Mitra deploys smart energy monitoring systems integrated with industrial IoT and SCADA, enabling real-time energy intelligence, cost reduction, and automated ESG carbon-emission reporting.",
      id: "PT Multi Daya Mitra menghadirkan sistem monitoring energi cerdas terintegrasi IoT dan SCADA industri untuk pemantauan konsumsi daya real-time, efisiensi biaya operasional, dan pelaporan emisi karbon ESG otomatis.",
    },
    featuredImageUrl: "/uploads/M2.jpeg",
    featured: true,
    publishedAt: "2020-04-18T00:00:00Z",
    body: {
      en: `<h2>Turning Energy Data into Measurable Business Impact</h2>
<p>As modern manufacturing industries advance toward net-zero targets and cost optimization, energy management has transitioned from a routine facility task into a strategic operational priority. PT Multi Daya Mitra deploys industrial-grade <strong>Smart Energy Monitoring Systems (SEMS)</strong> integrated with SCADA and IoT platforms, transforming raw power measurements into actionable intelligence for plant managers, utility supervisors, and corporate sustainability executives.</p>
<h3>Core Architecture of the Smart Energy Monitoring Platform</h3>
<p>Our solution links physical electrical assets to an intuitive centralized visualization platform through four robust architectural layers:</p>
<ol>
  <li><p><strong>Measurement Layer:</strong> High-precision digital power meters (Class 0.2S / 0.5S) installed across Main Distribution Panels (MDP), Sub-Distribution Panels (SDP), transformer secondaries, chillers, and critical motor control centers (MCC).</p></li>
  <li><p><strong>Edge Connectivity &amp; Telemetry:</strong> Industrial IoT gateways acquiring data via Modbus RTU/TCP, BACnet, and OPC-UA over secure Ethernet, fiber-optic, and wireless telemetry networks.</p></li>
  <li><p><strong>Analytics &amp; Processing Engine:</strong> Automated aggregation of voltage, current, active power (kW), apparent power (kVA), power factor (PF), peak demand, and total harmonic distortion (THD).</p></li>
  <li><p><strong>Visualization &amp; ESG Reporting Dashboard:</strong> Cloud or on-premise SCADA dashboards offering customizable KPI widgets, automated alerts, and exportable regulatory reporting modules.</p></li>
</ol>
<h3>Key Features &amp; Capabilities</h3>
<ul>
  <li><p><strong>120+ Electrical &amp; Utility Measurement Points:</strong> Unified dashboard tracking power, water, steam, and compressed air across distributed facilities.</p></li>
  <li><p><strong>Sub-Metering Granularity:</strong> Departmental, machine-level, and production-line cost allocation to identify inefficient production cycles and idle equipment losses.</p></li>
  <li><p><strong>Peak Demand Management:</strong> Automated threshold alerts preventing costly maximum demand penalties from utility providers (PLN kVA limits).</p></li>
  <li><p><strong>Automated Scope 2 Carbon Emission Tracking:</strong> Real-time conversion of kWh consumption into GHG Protocol compliant CO₂ equivalent (tCO₂e) metrics for ESG corporate sustainability audits.</p></li>
  <li><p><strong>Predictive Anomaly Detection:</strong> Early warning notifications for phase imbalance, power factor drops below 0.85, and voltage sag/swell occurrences.</p></li>
</ul>
<h3>Measurable ROI for Industrial Operations</h3>
<p>Facilities implementing our Smart Energy Monitoring System typically experience <strong>8% to 15% reductions in overall electrical utility expenditure</strong> within the first year by eliminating baseline leakage, optimizing chiller schedules, and avoiding utility penalty tariffs. Furthermore, automated reporting saves hundreds of engineering hours during annual ISO 50001 and ESG compliance audits.</p>
<h3>End-to-End Implementation by PT Multi Daya Mitra</h3>
<p>PT Multi Daya Mitra provides complete turnkey engineering — including energy auditing, meter sizing, panel retrofit, gateway installation, software commissioning, and staff training. Connect with our engineering experts to modernize your plant's energy intelligence.</p>
<p>Contact:<br>📱 +62 821-4007-4122<br>📧 <a href="mailto:info@multidayamitra.co.id">info@multidayamitra.co.id</a></p>`,
      id: `<h2>Mengubah Data Energi Menjadi Dampak Bisnis yang Terukur</h2>
<p>Di tengah tuntutan efisiensi operasional dan target dekarbonisasi industri global, manajemen energi telah bergeser dari sekadar tugas utilitas rutin menjadi prioritas strategis perusahaan. PT Multi Daya Mitra menghadirkan <strong>Sistem Monitoring Energi Cerdas (Smart Energy Monitoring System - SEMS)</strong> berstandar industri yang terintegrasi dengan platform SCADA dan IoT, mengubah pembacaan parameter kelistrikan menjadi wawasan analitik mendalam bagi manajemen pabrik, tim engineering, dan divisi pelaporan ESG.</p>
<h3>Arsitektur Sistem Monitoring Energi Terintegrasi</h3>
<p>Solusi kami menghubungkan aset kelistrikan fisik ke antarmuka visualisasi terpusat melalui empat lapisan arsitektur andal:</p>
<ol>
  <li><p><strong>Lapisan Pengukuran (Measurement Layer):</strong> Pemasangan digital power meter berpresisi tinggi (Class 0.2S / 0.5S) pada Main Distribution Panel (MDP), Sub-Distribution Panel (SDP), trafo distribusi, sistem chiller, dan Motor Control Center (MCC).</p></li>
  <li><p><strong>Konektivitas Edge &amp; Telemetri:</strong> Gateway IoT industri yang mengumpulkan data secara kontinu melalui protokol Modbus RTU/TCP, BACnet, dan OPC-UA menggunakan jaringan kabel optik atau nirkabel yang aman.</p></li>
  <li><p><strong>Mesin Analitik &amp; Komputasi:</strong> Pengolahan otomatis parameter tegangan, arus, daya aktif (kW), daya semu (kVA), faktor daya (cos phi), konsumsi kWh, beban puncak, dan distorsi harmonisa (THD).</p></li>
  <li><p><strong>Dashboard Visualisasi &amp; Laporan ESG:</strong> Tampilan SCADA visual on-premise maupun cloud yang menyajikan grafik tren real-time, perbandingan konsumsi antar-shift, serta ekspor laporan kepatuhan otomatis.</p></li>
</ol>
<h3>Fitur Unggulan Sistem</h3>
<ul>
  <li><p><strong>120+ Titik Pengukuran Terpadu:</strong> Monitoring menyeluruh pemakaian listrik, air, gas, dan udara bertekanan (compressed air) dalam satu antarmuka tunggal.</p></li>
  <li><p><strong>Sub-Metering per Lini Produksi:</strong> Alokasi biaya energi yang presisi per mesin atau per batch produksi untuk mendeteksi pemborosan saat mesin dalam kondisi stand-by.</p></li>
  <li><p><strong>Manajemen Beban Puncak (Peak Demand):</strong> Notifikasi peringatan dini sebelum batas daya kontrak (kVA) terlampaui guna menghindari denda kelebihan beban dari PLN.</p></li>
  <li><p><strong>Kalkulasi Emisi Karbon Scope 2 Otomatis:</strong> Konversi langsung konsumsi listrik (kWh) menjadi metrik emisi gas rumah kaca (tCO₂e) sesuai standar GHG Protocol untuk kebutuhan audit ESG dan sertifikasi ISO 50001.</p></li>
  <li><p><strong>Deteksi Dini Gangguan Listrik:</strong> Alarm instan untuk ketidakseimbangan fasa (phase unbalance), penurunan faktor daya di bawah 0.85, serta indikasi distorsi tegangan.</p></li>
</ul>
<h3>Efisiensi Nyata untuk Fasilitas Industri</h3>
<p>Pabrik dan gedung komersial yang mengadopsi sistem monitoring energi kami mencatatkan <strong>penghematan biaya listrik rata-rata 8% hingga 15%</strong> pada tahun pertama implementasi, sekaligus menghemat ratusan jam kerja staf teknis dalam pengumpulan data manual.</p>
<h3>Layanan Turnkey oleh PT Multi Daya Mitra</h3>
<p>PT Multi Daya Mitra melayani implementasi end-to-end: mulai dari audit kelayakan, suplai power meter, retrofit panel, pemrograman gateway dan SCADA, hingga pelatihan komprehensif bagi operator dan tim manajemen fasilitas Anda.</p>
<p>Konsultasikan kebutuhan smart energy monitoring bersama kami:<br>📱 +62 821-4007-4122<br>📧 <a href="mailto:info@multidayamitra.co.id">info@multidayamitra.co.id</a></p>`,
    },
  },
}

/**
 * Enriches a NewsItem fetched from the API with verified, complete bilingual content
 * ensuring title, category, excerpt, and body are 100% complete and accurate in both ID and EN.
 */
export function enrichNewsWithBilingual(item: NewsItem | null | undefined, slug: string): NewsItem | null {
  if (!item && !BILINGUAL_NEWS_CATALOG[slug]) return null

  const catalogEntry = BILINGUAL_NEWS_CATALOG[slug]
  if (!catalogEntry) {
    return item ?? null
  }

  const baseItem = item ?? {
    id: catalogEntry.id ?? `news-${slug}`,
    slug,
    title: "",
    excerpt: "",
    category: "",
    status: "published",
    featured: catalogEntry.featured ?? false,
    featuredImageUrl: catalogEntry.featuredImageUrl ?? "/placeholder.jpg",
    publishedAt: catalogEntry.publishedAt ?? "2026-03-01T00:00:00Z",
  }

  const titleString = `EN: ${catalogEntry.title.en}\nID: ${catalogEntry.title.id}`
  const categoryString = `EN: ${catalogEntry.category.en}\nID: ${catalogEntry.category.id}`
  const excerptString = `EN: ${catalogEntry.excerpt.en}\nID: ${catalogEntry.excerpt.id}`

  return {
    ...baseItem,
    title: titleString,
    category: categoryString,
    excerpt: excerptString,
    featuredImageUrl: baseItem.featuredImageUrl || catalogEntry.featuredImageUrl || "/placeholder.jpg",
    body: {
      bilingual: true,
      id: {
        blocks: [{ type: "html", html: catalogEntry.body.id }],
      },
      en: {
        blocks: [{ type: "html", html: catalogEntry.body.en }],
      },
      blocks: [
        {
          type: "html",
          html: catalogEntry.body.id,
        },
      ],
    },
  }
}
