-- 008_enrich_content.up.sql
-- Enriches CMS content using verified data from multidayamitra.co.id.
-- Safe to re-run: uses UPDATE ... WHERE id for existing rows and
-- INSERT ... ON CONFLICT DO NOTHING for new rows.

BEGIN;

-- ============================================================================
-- 1. SITE SETTINGS — Add social media & WhatsApp contacts
-- ============================================================================
UPDATE settings
SET value = jsonb_build_object(
    'email',    'info@multidayamitra.co.id',
    'phone',    '+62 31 592 1256',
    'fax',      '+62 31 591 7845',
    'address',  'Ruko Klampis Megah D-12, Klampis Ngasem, Sukolilo, Surabaya 60117, East Java, Indonesia',
    'tagline',  'Electrical · Automation · Fire System',
    'footerDescription', 'Indonesian electrical, industrial automation, and fire alarm services company — delivering reliable engineering across power, oil & gas, manufacturing, and infrastructure since 2013.',
    'socials', jsonb_build_array(
        jsonb_build_object('platform', 'facebook',  'url', 'https://www.facebook.com/multidayamitra/',        'label', 'Facebook'),
        jsonb_build_object('platform', 'instagram', 'url', 'https://www.instagram.com/multidayamitra/',       'label', 'Instagram'),
        jsonb_build_object('platform', 'linkedin',  'url', 'https://id.linkedin.com/company/pt-multi-daya-mitra', 'label', 'LinkedIn'),
        jsonb_build_object('platform', 'whatsapp',  'url', 'https://wa.me/628113461666',                      'label', 'WhatsApp Sales'),
        jsonb_build_object('platform', 'whatsapp',  'url', 'https://wa.me/628118303250',                      'label', 'WhatsApp Technical Support')
    ),
    'salesEmail',   'sales@multidayamitra.co.id',
    'salesPhone',   '+62 81332415692',
    'hotlinePhone', '+62 8118303250'
),
    updated_at = now()
WHERE key = 'site';

-- ============================================================================
-- 2. CONTACT PAGE — Complete office & contact data
-- ============================================================================
UPDATE pages
SET content = jsonb_build_object(
    'offices', jsonb_build_array(
        jsonb_build_object(
            'name',        'Head Office',
            'address',     'Ruko Klampis Megah D-12, Klampis Ngasem, Sukolilo, Surabaya 60117, East Java, Indonesia',
            'phone',       '+62 31 592 1256',
            'fax',         '+62 31 591 7845',
            'email',       'info@multidayamitra.co.id',
            'mapEmbedUrl', ''
        ),
        jsonb_build_object(
            'name',        'Project & Engineering Office',
            'address',     'Ruko Jati Kepuh Indah F-26, Sidoarjo 61271, East Java, Indonesia',
            'mapEmbedUrl', ''
        ),
        jsonb_build_object(
            'name',        'Workshop',
            'address',     'Ruko Jati Kepuh Indah E-21, Sidoarjo 61271, East Java, Indonesia',
            'mapEmbedUrl', ''
        )
    ),
    'email',       'info@multidayamitra.co.id',
    'phone',       '+62 31 592 1256',
    'fax',         '+62 31 591 7845',
    'salesEmail',  'sales@multidayamitra.co.id',
    'salesPhone',  '+62 81332415692',
    'hotlinePhone','+62 8118303250'
),
    updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000402';

-- ============================================================================
-- 3. ABOUT PAGE — Enriched company profile
-- ============================================================================
UPDATE pages
SET content = jsonb_build_object(
    'overview', 'PT Multi Daya Mitra was established in 2013 as a multidisciplinary engineering company specializing in electrical systems, industrial automation, and fire alarm solutions. Founded by professionals with extensive industry experience, the company serves clients across power generation, oil and gas, petrochemicals, manufacturing, food and beverage, pharmaceuticals, cement, infrastructure, and commercial building sectors. From its base in East Java, PT Multi Daya Mitra has grown into one of the region''s leading electrical services partners, delivering projects throughout Indonesia and undertaking select international engagements.',
    'vision',  'To become a global electrical, automation, and fire alarm services company.',
    'mission', 'To build mutual partnerships and deliver every engagement with professional excellence.',
    'values',  jsonb_build_array('Safety', 'Reliability', 'Professionalism', 'Partnership', 'Quality'),
    'leadership', '[]'::jsonb,
    'timeline', '[]'::jsonb,
    'certifications', jsonb_build_array('ISO 9001:2015'),
    'culture', 'A culture of professional discipline drives the company forward at every step toward its vision. PT Multi Daya Mitra has earned ISO 9001:2015 certification for its quality management system, reflecting the team''s commitment to consistent, high-standard delivery.',
    'industries', jsonb_build_array(
        'Industrial Plants', 'Buildings', 'Petrochemical', 'Oil & Gas',
        'Power Plants', 'Infrastructure', 'Food & Beverage', 'Manufacturing',
        'Cement', 'Pharmaceuticals', 'Natural Gas', 'Agro-Industry'
    )
),
    updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000401';

-- ============================================================================
-- 4. SERVICES — Update 3 existing
-- ============================================================================

-- 4a. Electrical Engineering
UPDATE services
SET summary = 'Comprehensive electrical engineering services including panel assembly, installation, testing and commissioning, construction, and engineering design for industrial and infrastructure facilities.',
    content = '{
  "blocks": [
    {"type": "paragraph", "text": "PT Multi Daya Mitra provides end-to-end electrical engineering services for industrial, commercial, and infrastructure projects. Our licensed engineering team handles everything from initial design through construction, testing, commissioning, and ongoing support."},
    {"type": "heading", "level": 2, "text": "Core Services"},
    {"type": "list", "items": [
      "Panel Build & Assembly — LVMDP, MCC, VFD/VSD panels, capacitor banks, ATS/AMF, generator control panels",
      "Installation & Construction — Licensed for electrical and mechanical construction up to medium voltage",
      "Testing & Commissioning — Secondary injection testing (3-phase and 6-phase), relay protection testing, circuit breaker analysis, contact resistance measurement",
      "Engineering Design — Protection coordination studies, power system analysis, lightning protection design (IEEE 998, NFPA 780, IEC 62305)"
    ]},
    {"type": "heading", "level": 2, "text": "Engineering Solutions"},
    {"type": "list", "items": [
      "Lightning Protection System — Detail design and assessment based on IEEE Std. 998, NFPA 780, API 545, IEC-EN 62305, and SNI standards",
      "Power Monitoring System — Energy management system implementation aligned with ISO 50001 for real-time monitoring, logging, and consumption transparency",
      "Active Harmonic Filter — Parallel-connected active harmonic filters for non-linear loads, installed at LV main distribution panels"
    ]},
    {"type": "heading", "level": 2, "text": "Relay Protection Testing"},
    {"type": "paragraph", "text": "Our relay testing capability covers major brands including ABB (REF, REM, REC, REX, SPAJ), Schneider (SEPAM, MICOM, VAMP), Siemens (SIPROTEC, Reyrolle), GE Multilin, Toshiba, and analog protection relays. We test across ANSI codes 87, 50, 51, 32, 27, 59, 60, 64, 67, 78, 81, and 25."}
  ]
}'::jsonb,
    updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000501';

-- 4b. Automation
UPDATE services
SET summary = 'Industrial automation services including PLC and DCS programming, HMI/SCADA design, remote monitoring systems, database connectivity, and plant information management.',
    content = '{
  "blocks": [
    {"type": "paragraph", "text": "Our automation team delivers complete control system solutions from design through commissioning and long-term support. We integrate PLC, DCS, HMI, and SCADA platforms to create reliable, maintainable automation architectures for process and discrete manufacturing environments."},
    {"type": "heading", "level": 2, "text": "Engineering Services"},
    {"type": "list", "items": [
      "HMI & SCADA design and development",
      "Remote monitoring and control system integration",
      "Database connectivity and reporting solutions",
      "Plant Information Management System (PIMS) implementation",
      "Switchgear automation systems",
      "PLC & DCS programming and commissioning"
    ]},
    {"type": "heading", "level": 2, "text": "Platforms & Protocols"},
    {"type": "paragraph", "text": "We work with major automation platforms including Siemens, Schneider Electric, GE, Mitsubishi, Omron, and Delta. Our systems support Modbus/Modbus TCP, BACnet/IP, OPC, DDE, and IEC 61850 communication protocols."}
  ]
}'::jsonb,
    updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000502';

-- 4c. Maintenance
UPDATE services
SET summary = 'Predictive, preventive, and contract-based maintenance services for medium and low voltage switchgear, transformers, and industrial electrical systems.',
    content = '{
  "blocks": [
    {"type": "paragraph", "text": "PT Multi Daya Mitra provides comprehensive maintenance programs designed to maximize equipment reliability, extend asset life, and minimize unplanned downtime. Our services cover medium and low voltage switchgear, power transformers, protection systems, and critical electrical infrastructure."},
    {"type": "heading", "level": 2, "text": "Predictive Maintenance"},
    {"type": "paragraph", "text": "Condition-based maintenance using advanced diagnostic tools to identify developing faults before they cause failures. Key techniques include partial discharge analysis, infrared thermography, and power quality analysis."},
    {"type": "heading", "level": 2, "text": "Preventive Maintenance"},
    {"type": "paragraph", "text": "Scheduled shutdown maintenance for MV/LV switchgear and transformers. Our programs focus on safety compliance, maximizing continuity and availability, managing aging asset performance, and optimizing capital and operating expenditure."},
    {"type": "heading", "level": 2, "text": "Maintenance Contracts"},
    {"type": "paragraph", "text": "Service-level agreement contracts that include regular checklists and site visits, call-out service, emergency response, scheduled predictive and preventive maintenance, replacement parts, minor repairs, and MTBF/MTTR performance reporting."}
  ]
}'::jsonb,
    updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000503';

-- 4d. NEW: Fire Alarm Systems
INSERT INTO services (id, slug, full_path, title, summary, content, image_url, status, published_at, sort_order, depth) VALUES
('00000000-0000-0000-0000-000000000504', 'fire-alarm', 'fire-alarm', 'Fire Alarm Systems',
 'Design, installation, testing, commissioning, and maintenance of conventional and addressable fire alarm systems.',
 '{
  "blocks": [
    {"type": "paragraph", "text": "PT Multi Daya Mitra provides full-cycle fire alarm services, from initial system design to installation, testing, commissioning, and ongoing maintenance contracts. Our certified team works with leading fire detection technologies to protect industrial, commercial, and infrastructure facilities."},
    {"type": "heading", "level": 2, "text": "Services"},
    {"type": "list", "items": [
      "Fire alarm system design and engineering",
      "Installation of conventional and addressable systems",
      "Testing & commissioning with full documentation",
      "Preventive maintenance and repair contracts",
      "System improvement and centralized monitoring integration"
    ]},
    {"type": "paragraph", "text": "All fire alarm work is carried out by certified technicians in compliance with applicable Indonesian and international fire safety standards."}
  ]
}'::jsonb,
 '/placeholder.jpg', 'published', now(), 4, 0)
ON CONFLICT DO NOTHING;

-- 4e. NEW: Testing & Measurement
INSERT INTO services (id, slug, full_path, title, summary, content, image_url, status, published_at, sort_order, depth) VALUES
('00000000-0000-0000-0000-000000000505', 'testing-measurement', 'testing-measurement', 'Testing & Measurement',
 'Specialized electrical testing and measurement services using professional-grade instruments for power systems diagnostics.',
 '{
  "blocks": [
    {"type": "paragraph", "text": "Our testing and measurement division operates a comprehensive inventory of professional-grade instruments for diagnosing, verifying, and certifying electrical systems. These tools support both our project delivery and standalone testing engagements."},
    {"type": "heading", "level": 2, "text": "Equipment Inventory"},
    {"type": "list", "items": [
      "Secondary Injection Tester — Megger Sverker 900, Kingsine K3166i (3-phase and 6-phase)",
      "Partial Discharge Analyzer — Megger PD Scan (TEV, acoustic, HFCT sensors)",
      "Micro Ohm Meter — Megger DLRO10, MOM 200A",
      "Battery & Load Bank Tester — Torkel",
      "Power Quality Analyzer — Fluke 435 II",
      "Thermal Imager — Infrared thermography for predictive diagnostics",
      "Geo Earth Ground Tester — Fluke 1623",
      "Circuit Breaker Analyzer — Timing, motion, and dynamic characteristics analysis",
      "Relay Test Set — Megger TRAX 280, Vebko",
      "Micrologic Test Kit (FFTK) — Schneider ACB Micrologic testing"
    ]}
  ]
}'::jsonb,
 '/placeholder.jpg', 'published', now(), 5, 0)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 5. PRODUCTS — Update 3 existing
-- ============================================================================

-- 5a. Testing Equipment
UPDATE products
SET summary = 'Professional-grade electrical testing and commissioning instruments from Megger, Fluke, Kingsine, and other leading manufacturers.',
    content = '{
  "blocks": [
    {"type": "paragraph", "text": "We supply and support a comprehensive range of electrical testing equipment for relay protection testing, insulation diagnostics, power quality analysis, and commissioning verification. Our product portfolio covers instruments from industry-leading manufacturers."},
    {"type": "heading", "level": 2, "text": "Product Range"},
    {"type": "list", "items": [
      "Megger Sverker 900 — Secondary injection tester for protection relay verification",
      "Kingsine K3166i — 6-phase relay test system with IEC 61850 support",
      "Megger TRAX 280 — Multi-function relay test set for commissioning",
      "Fluke 435 II — Three-phase power quality and energy analyzer",
      "Megger PD Scan — Partial discharge analyzer with TEV, acoustic, and HFCT sensors",
      "Megger DLRO10 / MOM 200A — Micro-ohm meters for contact resistance measurement",
      "Fluke 1623 — Geo earth ground tester",
      "Torkel — Battery and load bank test system",
      "Infrared thermal imaging cameras for predictive maintenance"
    ]}
  ]
}'::jsonb,
    specs = '{"category": "Testing", "brands": "Megger, Fluke, Kingsine, Vebko"}'::jsonb,
    updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000601';

-- 5b. Protection Relay
UPDATE products
SET summary = 'Protection relay devices and testing services covering ABB, Schneider, Siemens, GE Multilin, and Toshiba platforms for medium-voltage power systems.',
    content = '{
  "blocks": [
    {"type": "paragraph", "text": "We provide protection relay products, testing, and engineering support for medium-voltage power distribution systems. Our team has hands-on experience with all major relay platforms and can perform secondary injection testing, configuration, and coordination studies."},
    {"type": "heading", "level": 2, "text": "Supported Relay Platforms"},
    {"type": "list", "items": [
      "ABB — REF, REM, REC, REX, SPAJ series",
      "Schneider Electric — SEPAM, MICOM, VAMP series",
      "Siemens — SIPROTEC, Reyrolle series",
      "GE Multilin — Digital protection relays",
      "Toshiba — Protection and control relays",
      "Analog/electromechanical relay protection"
    ]},
    {"type": "heading", "level": 2, "text": "Testing Capabilities"},
    {"type": "paragraph", "text": "6 current outputs, 6 voltage outputs, low-ampere output capability, and IEC 61850 communication testing. ANSI protection functions tested include 87 (differential), 50/51 (overcurrent), 32 (directional power), 27/59 (under/overvoltage), 60 (voltage balance), 64 (ground fault), 67 (directional overcurrent), 78 (out of step), 81 (frequency), and 25 (synch check)."}
  ]
}'::jsonb,
    specs = '{"category": "Protection", "brands": "ABB, Schneider, Siemens, GE Multilin, Toshiba", "ansiCodes": "25, 27, 32, 50, 51, 59, 60, 64, 67, 78, 81, 87"}'::jsonb,
    updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000602';

-- 5c. Instrumentation
UPDATE products
SET summary = 'Industrial instrumentation products including power quality analyzers, partial discharge scanners, thermal imaging, and contact resistance measurement devices.',
    content = '{
  "blocks": [
    {"type": "paragraph", "text": "Our instrumentation product line covers diagnostic and monitoring devices for industrial electrical systems. These instruments support predictive maintenance programs, commissioning verification, and ongoing power quality management."},
    {"type": "heading", "level": 2, "text": "Key Products"},
    {"type": "list", "items": [
      "Power Quality Analyzer — Real-time logging and reporting of voltage, frequency, waveform quality, dips/sags, swells, flicker, spikes, harmonics, and total harmonic distortion (THD)",
      "Partial Discharge Analyzer — Online predictive maintenance for MV switchgear, bus bars, bushings, cables, transformers, and outdoor HV components using TEV, acoustic contact, HFCT, and parabolic acoustic sensors",
      "Infrared Thermal Imager — Identifies abnormal thermal patterns caused by loose connections, overloaded circuits, deteriorated insulation, or three-phase imbalances",
      "Contact Resistance Meter — Precision low-ohm measurement for circuit breaker contacts, busbar connections, cable terminations, and busduct installations",
      "Circuit Breaker Analyzer — Open/close timing, motion analysis, dynamic bounce characteristics, and coil current waveform recording"
    ]}
  ]
}'::jsonb,
    specs = '{"category": "Instrumentation", "applications": "Predictive Maintenance, Commissioning, Power Quality"}'::jsonb,
    updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000603';

-- 5d. NEW: SCADA – xArrow
INSERT INTO products (id, slug, full_path, title, summary, content, specs, image_url, status, published_at, sort_order, depth) VALUES
('00000000-0000-0000-0000-000000000604', 'scada-xarrow', 'scada-xarrow', 'SCADA – xArrow',
 'Versatile SCADA platform with distributed data acquisition, redundant database support, and native PLC connectivity for industrial monitoring and control.',
 '{
  "blocks": [
    {"type": "paragraph", "text": "xArrow is a full-featured SCADA platform designed for industrial monitoring and control applications. It provides real-time data acquisition, alarm management, historical trending, and a powerful graphical interface — all within a scalable client/server architecture."},
    {"type": "heading", "level": 2, "text": "System Architecture"},
    {"type": "list", "items": [
      "Client/server architecture with distributed data acquisition",
      "Real-time multi-tasking kernel",
      "Redundant database support — SQL Server, Oracle, MySQL, PostgreSQL, Access",
      "OPC Client connectivity and project-level encryption"
    ]},
    {"type": "heading", "level": 2, "text": "Data Acquisition"},
    {"type": "list", "items": [
      "Native drivers for Siemens, GE, Schneider, Mitsubishi, Omron, Delta PLCs",
      "Modbus RTU/TCP, BACnet/IP, DDE, and OPC protocol support"
    ]},
    {"type": "heading", "level": 2, "text": "Key Features"},
    {"type": "list", "items": [
      "WYSIWYG development without compilation",
      "Real-time database with hash-based algorithms",
      "5 analog and 3 digital alarm types with voice alerts and audit trails",
      "Historical data archive with graphical trending",
      "Built-in HTTP server for web-based access",
      "CFR Part 11 compliance support",
      "I/O server, database, and network redundancy"
    ]}
  ]
}'::jsonb,
 '{"category": "Automation", "type": "SCADA", "protocols": "Modbus, BACnet/IP, OPC, DDE"}'::jsonb,
 '/placeholder.jpg', 'published', now(), 4, 0)
ON CONFLICT DO NOTHING;

-- 5e. NEW: Electrical Panel Assembly
INSERT INTO products (id, slug, full_path, title, summary, content, specs, image_url, status, published_at, sort_order, depth) VALUES
('00000000-0000-0000-0000-000000000605', 'electrical-panels', 'electrical-panels', 'Electrical Panel Assembly',
 'Custom-engineered low and medium voltage electrical panels including LVMDP, MCC, VFD/VSD, ATS/AMF, capacitor banks, and generator control panels.',
 '{
  "blocks": [
    {"type": "paragraph", "text": "We design and assemble electrical panels to international standards for industrial, commercial, and infrastructure applications. Each panel is engineered to site-specific requirements and undergoes comprehensive factory acceptance testing before delivery."},
    {"type": "heading", "level": 2, "text": "Low Voltage Panels"},
    {"type": "list", "items": [
      "Low Voltage Main Distribution Panel (LVMDP)",
      "Motor Control Center (MCC)",
      "Motor Starter — Direct On Line, Star-Delta, Soft Starter",
      "Variable Frequency Drive (VFD) / Variable Speed Drive (VSD) panels",
      "Capacitor Bank panels",
      "Automatic Transfer Switch (ATS) and Automatic Main Failure (AMF)",
      "Automatic Load Shedding panels",
      "Generator Control Panel — Synchronous or load sharing configurations",
      "Switchgear Automation System panels"
    ]},
    {"type": "heading", "level": 2, "text": "Medium Voltage Equipment"},
    {"type": "list", "items": [
      "Medium Voltage Distribution Panel — supply, installation, testing & commissioning",
      "Schneider SM6 metalclad switchgear — LBS (IM), CB (DM1-A) with OCR/DGR 50/51 and 67 relay protection",
      "Active Harmonic Filter, Anti-Flicker/Sag devices, and Load Bank equipment"
    ]}
  ]
}'::jsonb,
 '{"category": "Electrical", "voltageClass": "Low Voltage, Medium Voltage", "brands": "Schneider Electric"}'::jsonb,
 '/placeholder.jpg', 'published', now(), 5, 0)
ON CONFLICT DO NOTHING;

-- 5f. NEW: Bosch Fire Alarm System
INSERT INTO products (id, slug, full_path, title, summary, content, specs, image_url, status, published_at, sort_order, depth) VALUES
('00000000-0000-0000-0000-000000000606', 'bosch-fire-alarm', 'bosch-fire-alarm', 'Bosch Fire Alarm System',
 'Bosch Security fire detection solutions including AVENAR addressable panels, conventional panels, automatic detectors, manual call points, and video-based fire detection.',
 '{
  "blocks": [
    {"type": "paragraph", "text": "As a Bosch Security partner, we supply and install comprehensive fire alarm systems for industrial, commercial, and critical infrastructure applications. The Bosch product portfolio covers everything from compact conventional panels to fully addressable networked systems."},
    {"type": "heading", "level": 2, "text": "Product Range"},
    {"type": "list", "items": [
      "AVENAR Panel — Addressable fire detection system with modular setup for scalable installations",
      "Conventional Fire Panel — Compact, cost-efficient solution for small to medium applications",
      "Automatic Fire Detectors — Optical smoke, heat, multi-criteria, and specialty detectors",
      "Manual Call Points — Addressable and conventional models",
      "Interface Modules — Integration with technical alarms and extinguishing systems",
      "Notification Appliances — Audible sirens and visible beacon notifications",
      "Video-based Fire Detection — AI-powered smoke and flame identification",
      "Accessories — Detector testers, test gases, and removal tools"
    ]}
  ]
}'::jsonb,
 '{"category": "Fire Alarm", "brand": "Bosch Security", "types": "Addressable, Conventional"}'::jsonb,
 '/placeholder.jpg', 'published', now(), 6, 0)
ON CONFLICT DO NOTHING;

-- 5g. NEW: Rittal Enclosure Systems
INSERT INTO products (id, slug, full_path, title, summary, content, specs, image_url, status, published_at, sort_order, depth) VALUES
('00000000-0000-0000-0000-000000000607', 'rittal-enclosures', 'rittal-enclosures', 'Rittal Enclosure Systems',
 'Authorized Rittal distributor for industrial enclosures, climate control solutions, and system accessories.',
 '{
  "blocks": [
    {"type": "paragraph", "text": "As an authorized Rittal distributor, we provide a complete range of industrial enclosure solutions, climate control equipment, and system accessories for power distribution, automation, and IT infrastructure applications."},
    {"type": "heading", "level": 2, "text": "Enclosures"},
    {"type": "list", "items": [
      "Small enclosures and wall-mounted boxes",
      "IT rack systems",
      "Stainless steel and hygienic design enclosures",
      "Outdoor-rated enclosures",
      "Support arm systems"
    ]},
    {"type": "heading", "level": 2, "text": "Climate Control"},
    {"type": "list", "items": [
      "Fans and filter fans",
      "Air-to-air and air-to-water heat exchangers",
      "Cooling units for enclosures",
      "IT cooling solutions",
      "Enclosure heaters"
    ]},
    {"type": "heading", "level": 2, "text": "Accessories"},
    {"type": "list", "items": [
      "Base and plinth systems",
      "Cable routing and management",
      "HMI mounting solutions",
      "Earthing and grounding components",
      "Interior lighting"
    ]}
  ]
}'::jsonb,
 '{"category": "Enclosures", "brand": "Rittal", "role": "Authorized Distributor"}'::jsonb,
 '/placeholder.jpg', 'published', now(), 7, 0)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 6. NEWS — Update 2 existing + add 4 new
-- ============================================================================

-- 6a. Energy Monitoring System (existing)
UPDATE news
SET body = '{
  "blocks": [
    {"type": "paragraph", "text": "Smart Energy Monitoring Systems are transforming how manufacturing facilities track, analyze, and optimize their energy consumption. By turning raw energy data into measurable business impact, these systems help plants reduce costs, improve operational efficiency, and support sustainability objectives."},
    {"type": "heading", "level": 2, "text": "Why Energy Monitoring Matters"},
    {"type": "paragraph", "text": "As ESG (Environmental, Social, and Governance) reporting becomes a standard expectation for industrial operations, having accurate, real-time energy data is no longer optional. Our Energy Monitoring System provides the foundation for transparent energy reporting, consumption benchmarking, and actionable efficiency improvements."},
    {"type": "heading", "level": 2, "text": "Key Benefits"},
    {"type": "list", "items": [
      "Real-time visibility into energy consumption across all facility zones",
      "Automated data logging and trend analysis for ESG-grade reporting",
      "Identification of waste patterns and peak demand optimization opportunities",
      "Support for ISO 50001 energy management system compliance",
      "Integration with existing SCADA and building management systems"
    ]},
    {"type": "paragraph", "text": "PT Multi Daya Mitra delivers turnkey energy monitoring solutions — from metering hardware installation through SCADA integration, dashboard configuration, and ongoing support — tailored to each facility''s operational requirements."}
  ]
}'::jsonb,
    excerpt = 'Smart energy monitoring systems help manufacturing facilities track real-time consumption, reduce costs, and produce ESG-grade sustainability reports.',
    updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000801';

-- 6b. Substation Commissioning (existing)
UPDATE news
SET body = '{
  "blocks": [
    {"type": "paragraph", "text": "Preventive maintenance of medium voltage (MV) switchgear is essential for ensuring the reliability, safety, and longevity of electrical distribution assets. Regular maintenance programs identify developing issues before they escalate into costly failures or safety incidents."},
    {"type": "heading", "level": 2, "text": "Maintenance Scope"},
    {"type": "paragraph", "text": "A comprehensive substation maintenance program covers visual inspection, cleaning, mechanical operation testing, insulation resistance measurement, contact resistance verification, protection relay testing, and thermal imaging. Each activity is documented and benchmarked against manufacturer specifications and industry standards."},
    {"type": "heading", "level": 2, "text": "Our Approach"},
    {"type": "list", "items": [
      "End-to-end protection coordination review and verification",
      "Secondary injection testing of all protection relays",
      "Circuit breaker timing and motion analysis",
      "Partial discharge scanning for early fault detection",
      "Complete test documentation and energization support"
    ]},
    {"type": "paragraph", "text": "Our commissioning team has successfully delivered testing and energization support for industrial substations across East Java, covering both greenfield installations and aging asset refurbishment projects."}
  ]
}'::jsonb,
    excerpt = 'Preventive maintenance of MV switchgear ensures reliability, safety, and asset longevity through systematic testing, inspection, and protection coordination.',
    updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000802';

-- 6c. NEW: Transformer Testing and Maintenance
INSERT INTO news (id, category_id, slug, title, excerpt, body, featured_image_url, featured, status, published_at) VALUES
('00000000-0000-0000-0000-000000000803', '00000000-0000-0000-0000-000000000703', 'transformer-testing-maintenance',
 'Transformer Testing and Maintenance: Protecting Your Most Valuable Network Assets',
 'Power transformers are among the most expensive components in any electrical network. Routine health assessments help detect incipient faults and extend asset service life.',
 '{
  "blocks": [
    {"type": "paragraph", "text": "Power transformers represent one of the largest capital investments in any electrical distribution network. Because replacement costs are substantial and lead times are long, a proactive testing and maintenance program is critical for maximizing transformer service life and preventing catastrophic failures."},
    {"type": "heading", "level": 2, "text": "Why Transformer Testing Is Important"},
    {"type": "paragraph", "text": "Transformers operate under continuous electrical, thermal, and mechanical stress. Over time, insulation degrades, oil quality deteriorates, and mechanical components wear. Without regular diagnostic testing, developing faults can go undetected until they cause unplanned outages or irreversible damage."},
    {"type": "heading", "level": 2, "text": "Common Diagnostic Tests"},
    {"type": "list", "items": [
      "Insulation resistance and polarization index measurement",
      "Transformer turns ratio (TTR) verification",
      "Winding resistance measurement",
      "Dissolved gas analysis (DGA) of insulating oil",
      "Power factor / dissipation factor testing",
      "Sweep frequency response analysis (SFRA)",
      "Thermal imaging for hotspot detection"
    ]},
    {"type": "paragraph", "text": "PT Multi Daya Mitra provides comprehensive transformer health assessment services using calibrated, professional-grade instruments. Our reports include condition ratings, trend analysis, and prioritized maintenance recommendations."}
  ]
}'::jsonb,
 '/placeholder.jpg', false, 'published', now())
ON CONFLICT DO NOTHING;

-- 6d. NEW: Effects of Harmonic Distortion
INSERT INTO news (id, category_id, slug, title, excerpt, body, featured_image_url, featured, status, published_at) VALUES
('00000000-0000-0000-0000-000000000804', '00000000-0000-0000-0000-000000000703', 'effects-of-harmonic-distortion',
 'Effects of Harmonic Distortion on Electrical Systems',
 'Harmonic distortion in power systems causes current and voltage waveform degradation, leading to overheating, equipment malfunction, and reduced power quality.',
 '{
  "blocks": [
    {"type": "paragraph", "text": "Harmonic distortion occurs when non-linear loads — such as variable frequency drives, UPS systems, LED lighting, and power electronics — introduce current and voltage waveform distortions into the electrical network. These harmonics can cause a range of operational and equipment problems if left unmanaged."},
    {"type": "heading", "level": 2, "text": "Common Effects of Harmonics"},
    {"type": "list", "items": [
      "Overheating of transformers, cables, and motors due to increased RMS current",
      "Nuisance tripping of circuit breakers and protection relays",
      "Premature failure of capacitor banks from harmonic resonance",
      "Interference with sensitive electronic equipment and communication systems",
      "Increased neutral conductor loading in three-phase systems",
      "Reduced power factor and higher utility penalty charges"
    ]},
    {"type": "heading", "level": 2, "text": "Mitigation Solutions"},
    {"type": "paragraph", "text": "PT Multi Daya Mitra offers harmonic measurement, analysis, and mitigation services. Solutions include active harmonic filters (AHF) installed in parallel with main distribution panels, passive harmonic filters, and system design modifications to minimize harmonic generation at the source."}
  ]
}'::jsonb,
 '/placeholder.jpg', false, 'published', now())
ON CONFLICT DO NOTHING;

-- 6e. NEW: Partial Discharge Analyzer
INSERT INTO news (id, category_id, slug, title, excerpt, body, featured_image_url, featured, status, published_at) VALUES
('00000000-0000-0000-0000-000000000805', '00000000-0000-0000-0000-000000000703', 'partial-discharge-analyzer',
 'Partial Discharge Analyzer for Predictive Maintenance of MV/HV Equipment',
 'Online partial discharge analysis enables early detection of insulation defects in medium and high voltage switchgear, transformers, and cable systems without service interruption.',
 '{
  "blocks": [
    {"type": "paragraph", "text": "Partial discharge (PD) is a localized electrical breakdown within the insulation system of medium and high voltage equipment. Left undetected, partial discharge activity progressively damages insulation until a complete flashover or failure occurs. PD scanning provides an early warning system for developing insulation faults."},
    {"type": "heading", "level": 2, "text": "What We Can Detect"},
    {"type": "list", "items": [
      "Insulation defects in MV switchgear and bus bars",
      "Degradation in cable terminations and bushings",
      "Developing faults in power transformers",
      "Surface tracking on outdoor HV components",
      "Void discharges within solid insulation systems"
    ]},
    {"type": "heading", "level": 2, "text": "Sensing Technologies"},
    {"type": "paragraph", "text": "Our PD analysis combines multiple sensing techniques for comprehensive coverage: Transient Earth Voltage (TEV) sensors for metalclad switchgear, acoustic contact sensors for transformers and bushings, High Frequency Current Transformer (HFCT) sensors for cable systems, and parabolic acoustic receivers for outdoor equipment. This multi-sensor approach ensures no developing fault goes undetected."}
  ]
}'::jsonb,
 '/placeholder.jpg', false, 'published', now())
ON CONFLICT DO NOTHING;

-- 6f. NEW: Centralized Fire Alarm Monitoring
INSERT INTO news (id, category_id, slug, title, excerpt, body, featured_image_url, featured, status, published_at) VALUES
('00000000-0000-0000-0000-000000000806', '00000000-0000-0000-0000-000000000703', 'centralized-fire-alarm-monitoring',
 'Centralized Fire Alarm Monitoring Systems for Multi-Building Facilities',
 'Centralized fire alarm monitoring integrates multiple fire detection panels into a single command center for faster response, regulatory compliance, and operational efficiency.',
 '{
  "blocks": [
    {"type": "paragraph", "text": "For facilities with multiple buildings, production zones, or campus-wide operations, managing individual fire alarm panels in isolation creates response delays and oversight gaps. Centralized fire alarm monitoring systems integrate all detection zones into a unified command interface, enabling faster incident response and streamlined compliance documentation."},
    {"type": "heading", "level": 2, "text": "Key Benefits"},
    {"type": "list", "items": [
      "Single command center visibility across all buildings and zones",
      "Faster alarm acknowledgment and emergency response coordination",
      "Automated event logging for regulatory compliance and audit trails",
      "Integration with building management and access control systems",
      "Remote monitoring capability for 24/7 surveillance"
    ]},
    {"type": "heading", "level": 2, "text": "Implementation"},
    {"type": "paragraph", "text": "PT Multi Daya Mitra designs and implements centralized fire alarm monitoring solutions using Bosch Security and other leading platforms. Our scope covers system architecture design, network infrastructure, panel integration, operator workstation configuration, and comprehensive training for facility management teams."}
  ]
}'::jsonb,
 '/placeholder.jpg', false, 'published', now())
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 7. CAREERS — Update 2 existing + add 4 new
-- ============================================================================

-- 7a. Senior Electrical Engineer (existing)
UPDATE careers
SET description = '{
  "blocks": [
    {"type": "paragraph", "text": "We are looking for a Senior Electrical Engineer to lead medium-voltage system design, protection coordination, and commissioning activities for industrial and infrastructure clients across Indonesia."},
    {"type": "heading", "level": 2, "text": "Responsibilities"},
    {"type": "list", "items": [
      "Lead electrical design and engineering for MV/LV power distribution projects",
      "Perform protection coordination studies and relay setting calculations",
      "Supervise testing and commissioning of switchgear, transformers, and protection systems",
      "Prepare technical documentation, single-line diagrams, and project reports",
      "Coordinate with project managers, clients, and subcontractors on site"
    ]},
    {"type": "heading", "level": 2, "text": "Requirements"},
    {"type": "list", "items": [
      "Bachelor''s degree in Electrical Engineering or related field",
      "Minimum 5 years of experience in electrical power systems",
      "Strong knowledge of protection relay testing (ABB, Schneider, Siemens)",
      "Experience with medium-voltage switchgear commissioning",
      "Familiarity with relevant standards (IEC, IEEE, SNI)",
      "Willing to travel to project sites across Indonesia"
    ]}
  ]
}'::jsonb,
    summary = 'Lead medium-voltage system design, protection coordination studies, and commissioning for industrial and infrastructure projects.',
    updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000901';

-- 7b. Automation Engineer (existing)
UPDATE careers
SET description = '{
  "blocks": [
    {"type": "paragraph", "text": "We are hiring an Automation Engineer to design, program, and commission PLC, HMI, and SCADA systems for power, oil and gas, manufacturing, and industrial process clients."},
    {"type": "heading", "level": 2, "text": "Responsibilities"},
    {"type": "list", "items": [
      "Design and develop HMI/SCADA applications for plant monitoring and control",
      "Program and configure PLC and DCS control systems",
      "Integrate communication protocols (Modbus, OPC, BACnet, IEC 61850)",
      "Perform factory acceptance testing (FAT) and site acceptance testing (SAT)",
      "Commission automation systems and provide operator training",
      "Develop technical documentation and system operation manuals"
    ]},
    {"type": "heading", "level": 2, "text": "Requirements"},
    {"type": "list", "items": [
      "Bachelor''s degree in Electrical, Instrumentation, or Control Engineering",
      "Minimum 3 years of experience in industrial automation",
      "Proficiency with at least one major PLC platform (Siemens, Schneider, Mitsubishi, Omron)",
      "Experience with SCADA software development and database connectivity",
      "Understanding of industrial communication protocols and networking",
      "Willing to travel for commissioning and project support"
    ]}
  ]
}'::jsonb,
    summary = 'Design, program, and commission PLC, HMI, and SCADA systems for industrial process control applications.',
    updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000902';

-- 7c. NEW: Electrical Team Leader
INSERT INTO careers (id, slug, title, summary, description, department, location, employment_type, apply_url, deadline, status, published_at) VALUES
('00000000-0000-0000-0000-000000000903', 'electrical-team-leader', 'Electrical Team Leader',
 'Supervise electrical maintenance and project execution teams at industrial client sites.',
 '{
  "blocks": [
    {"type": "paragraph", "text": "We are seeking an experienced Electrical Team Leader to supervise field teams during electrical maintenance, testing, and commissioning activities at client sites."},
    {"type": "heading", "level": 2, "text": "Responsibilities"},
    {"type": "list", "items": [
      "Lead and coordinate electrical field technician teams",
      "Supervise maintenance, testing, and commissioning activities on site",
      "Ensure compliance with safety procedures and work permits",
      "Prepare daily work reports and progress updates",
      "Coordinate with project managers and client representatives"
    ]},
    {"type": "heading", "level": 2, "text": "Requirements"},
    {"type": "list", "items": [
      "Diploma or Bachelor''s degree in Electrical Engineering",
      "Minimum 3 years of supervisory experience in electrical field work",
      "Hands-on experience with MV/LV switchgear and transformer maintenance",
      "Strong understanding of workplace safety and hazard identification",
      "Willing to be stationed at project sites in Gresik, Malang, or other locations"
    ]}
  ]
}'::jsonb,
 'Engineering', 'Gresik, East Java', 'full_time', 'mailto:hr@multidayamitra.co.id', now() + interval '60 days', 'published', now())
ON CONFLICT DO NOTHING;

-- 7d. NEW: Electrical Operator
INSERT INTO careers (id, slug, title, summary, description, department, location, employment_type, apply_url, deadline, status, published_at) VALUES
('00000000-0000-0000-0000-000000000904', 'electrical-operator', 'Electrical Operator',
 'Perform routine electrical operation and maintenance tasks at industrial facilities.',
 '{
  "blocks": [
    {"type": "paragraph", "text": "We are looking for Electrical Operators to perform daily electrical operation, monitoring, and basic maintenance tasks at client industrial facilities."},
    {"type": "heading", "level": 2, "text": "Responsibilities"},
    {"type": "list", "items": [
      "Operate and monitor electrical distribution systems",
      "Perform routine inspections and basic maintenance of MV/LV equipment",
      "Record operational data and report abnormalities",
      "Assist commissioning and testing teams during project activities",
      "Follow safety procedures and emergency response protocols"
    ]},
    {"type": "heading", "level": 2, "text": "Requirements"},
    {"type": "list", "items": [
      "Vocational diploma (D3) in Electrical Engineering or equivalent",
      "Minimum 1 year of experience in electrical operations",
      "Basic knowledge of MV/LV switchgear operation",
      "Ability to work in shift-based schedules",
      "Willing to be assigned to project sites in Surabaya, Bali, or other locations"
    ]}
  ]
}'::jsonb,
 'Operations', 'Surabaya, East Java', 'full_time', 'mailto:hr@multidayamitra.co.id', now() + interval '60 days', 'published', now())
ON CONFLICT DO NOTHING;

-- 7e. NEW: Fire Alarm Technician
INSERT INTO careers (id, slug, title, summary, description, department, location, employment_type, apply_url, deadline, status, published_at) VALUES
('00000000-0000-0000-0000-000000000905', 'fire-alarm-technician', 'Fire Alarm Technician',
 'Install, test, and maintain conventional and addressable fire alarm systems.',
 '{
  "blocks": [
    {"type": "paragraph", "text": "We are hiring Fire Alarm Technicians to support our growing fire protection services division. The role involves installation, testing, commissioning, and maintenance of fire alarm systems at client sites."},
    {"type": "heading", "level": 2, "text": "Responsibilities"},
    {"type": "list", "items": [
      "Install fire alarm panels, detectors, manual call points, and notification devices",
      "Perform system testing, loop verification, and commissioning",
      "Execute preventive maintenance and troubleshooting of fire alarm systems",
      "Prepare technical reports and maintenance records",
      "Coordinate with clients on maintenance schedules and emergency repairs"
    ]},
    {"type": "heading", "level": 2, "text": "Requirements"},
    {"type": "list", "items": [
      "Vocational diploma (D3) in Electrical Engineering or related field",
      "Minimum 1 year of experience with fire alarm system installation or maintenance",
      "Familiarity with Bosch or equivalent fire detection platforms",
      "Fire safety certification is a plus",
      "Willing to be assigned to project sites across East Java"
    ]}
  ]
}'::jsonb,
 'Engineering', 'Gresik, East Java', 'full_time', 'mailto:hr@multidayamitra.co.id', now() + interval '60 days', 'published', now())
ON CONFLICT DO NOTHING;

-- 7f. NEW: Site Manager
INSERT INTO careers (id, slug, title, summary, description, department, location, employment_type, apply_url, deadline, status, published_at) VALUES
('00000000-0000-0000-0000-000000000906', 'site-manager', 'Site Manager',
 'Manage project execution, client coordination, and team supervision at industrial project sites.',
 '{
  "blocks": [
    {"type": "paragraph", "text": "We are seeking a Site Manager to oversee electrical and automation project execution at client sites. The role requires strong leadership, technical knowledge, and the ability to manage multiple work fronts simultaneously."},
    {"type": "heading", "level": 2, "text": "Responsibilities"},
    {"type": "list", "items": [
      "Manage overall project execution at client sites",
      "Coordinate project teams, subcontractors, and client representatives",
      "Monitor project schedule, budget, and quality milestones",
      "Ensure compliance with safety, health, and environmental regulations",
      "Prepare progress reports and participate in project review meetings"
    ]},
    {"type": "heading", "level": 2, "text": "Requirements"},
    {"type": "list", "items": [
      "Bachelor''s degree in Electrical Engineering or related field",
      "Minimum 5 years of experience in project management or site supervision",
      "Strong knowledge of electrical installation and commissioning processes",
      "Experience managing teams of 10+ technicians and engineers",
      "Excellent communication and stakeholder management skills",
      "Willing to be stationed at project sites in Gresik or other locations"
    ]}
  ]
}'::jsonb,
 'Project Management', 'Gresik, East Java', 'full_time', 'mailto:hr@multidayamitra.co.id', now() + interval '60 days', 'published', now())
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 8. SEO METADATA — All records
-- ============================================================================

-- Pages
INSERT INTO seo_meta (entity_type, entity_id, title, description) VALUES
('page', '00000000-0000-0000-0000-000000000401', 'About PT Multi Daya Mitra | Electrical, Automation & Fire Alarm Services', 'PT Multi Daya Mitra is an Indonesian engineering company established in 2013, specializing in electrical systems, industrial automation, and fire alarm solutions for power, oil & gas, manufacturing, and infrastructure sectors.'),
('page', '00000000-0000-0000-0000-000000000402', 'Contact PT Multi Daya Mitra | Offices in Surabaya & Sidoarjo', 'Contact PT Multi Daya Mitra for electrical engineering, automation, and fire alarm services. Head office in Surabaya, project office and workshop in Sidoarjo, East Java.'),
('page', '00000000-0000-0000-0000-000000000403', 'PT Multi Daya Mitra | Electrical · Automation · Fire System', 'Indonesian electrical, industrial automation, and fire alarm services company delivering reliable engineering across power, oil & gas, manufacturing, and infrastructure since 2013.'),
('page', '00000000-0000-0000-0000-000000000404', 'Our Services | PT Multi Daya Mitra', 'Electrical engineering, industrial automation, fire alarm, testing & measurement, and maintenance services for industrial and infrastructure projects across Indonesia.'),
('page', '00000000-0000-0000-0000-000000000405', 'Our Products | PT Multi Daya Mitra', 'Testing equipment, protection relays, instrumentation, SCADA systems, electrical panels, fire alarm systems, and Rittal enclosures from PT Multi Daya Mitra.'),
('page', '00000000-0000-0000-0000-000000000406', 'News & Insights | PT Multi Daya Mitra', 'Industry insights, project updates, and technical articles from PT Multi Daya Mitra on electrical engineering, automation, and fire protection.'),
('page', '00000000-0000-0000-0000-000000000407', 'Careers at PT Multi Daya Mitra | Join Our Engineering Team', 'Explore career opportunities at PT Multi Daya Mitra. We are hiring electrical engineers, automation engineers, technicians, and project managers across East Java.')
ON CONFLICT DO NOTHING;

-- Services
INSERT INTO seo_meta (entity_type, entity_id, title, description) VALUES
('service', '00000000-0000-0000-0000-000000000501', 'Electrical Engineering Services | PT Multi Daya Mitra', 'Comprehensive electrical engineering including panel assembly, installation, testing & commissioning, construction, and engineering design for industrial and infrastructure facilities.'),
('service', '00000000-0000-0000-0000-000000000502', 'Industrial Automation Services | PLC, SCADA, HMI | PT Multi Daya Mitra', 'Industrial automation services including PLC/DCS programming, HMI/SCADA design, remote monitoring, database integration, and plant information management systems.'),
('service', '00000000-0000-0000-0000-000000000503', 'Electrical Maintenance Services | Predictive & Preventive | PT Multi Daya Mitra', 'Predictive, preventive, and contract-based maintenance for MV/LV switchgear, transformers, and industrial electrical systems with SLA-backed performance reporting.'),
('service', '00000000-0000-0000-0000-000000000504', 'Fire Alarm System Services | Design, Install & Maintain | PT Multi Daya Mitra', 'Full-cycle fire alarm services: design, installation, testing, commissioning, and maintenance contracts for conventional and addressable fire detection systems.'),
('service', '00000000-0000-0000-0000-000000000505', 'Testing & Measurement Services | PT Multi Daya Mitra', 'Specialized electrical testing and measurement services using professional-grade instruments from Megger, Fluke, and Kingsine for power system diagnostics.')
ON CONFLICT DO NOTHING;

-- Products
INSERT INTO seo_meta (entity_type, entity_id, title, description) VALUES
('product', '00000000-0000-0000-0000-000000000601', 'Testing Equipment | Megger, Fluke, Kingsine | PT Multi Daya Mitra', 'Professional-grade electrical testing instruments including relay test sets, power quality analyzers, partial discharge scanners, and insulation testers from leading manufacturers.'),
('product', '00000000-0000-0000-0000-000000000602', 'Protection Relay Products & Testing | PT Multi Daya Mitra', 'Protection relay devices and testing services for ABB, Schneider, Siemens, GE Multilin, and Toshiba platforms in medium-voltage power distribution systems.'),
('product', '00000000-0000-0000-0000-000000000603', 'Industrial Instrumentation | Power Quality & Diagnostics | PT Multi Daya Mitra', 'Industrial instrumentation including power quality analyzers, partial discharge scanners, thermal imagers, and contact resistance meters for predictive maintenance.'),
('product', '00000000-0000-0000-0000-000000000604', 'SCADA xArrow Platform | Industrial Monitoring & Control | PT Multi Daya Mitra', 'xArrow SCADA platform with distributed data acquisition, native PLC connectivity, redundant databases, and real-time alarm management for industrial process control.'),
('product', '00000000-0000-0000-0000-000000000605', 'Electrical Panel Assembly | LVMDP, MCC, VFD, ATS | PT Multi Daya Mitra', 'Custom-engineered LV and MV electrical panels including LVMDP, motor control centers, VFD/VSD panels, ATS/AMF, and Schneider SM6 medium-voltage switchgear.'),
('product', '00000000-0000-0000-0000-000000000606', 'Bosch Fire Alarm System | AVENAR, Detectors, Panels | PT Multi Daya Mitra', 'Bosch Security fire detection solutions including AVENAR addressable panels, conventional panels, optical/heat detectors, manual call points, and video-based fire detection.'),
('product', '00000000-0000-0000-0000-000000000607', 'Rittal Enclosures & Climate Control | Authorized Distributor | PT Multi Daya Mitra', 'Authorized Rittal distributor offering industrial enclosures, climate control solutions, IT rack systems, and accessories for power distribution and automation.')
ON CONFLICT DO NOTHING;

-- News
INSERT INTO seo_meta (entity_type, entity_id, title, description) VALUES
('news', '00000000-0000-0000-0000-000000000801', 'Energy Monitoring System for ESG Reporting | PT Multi Daya Mitra', 'Smart energy monitoring systems that help manufacturing facilities track real-time consumption, reduce costs, and produce ESG-grade sustainability reports.'),
('news', '00000000-0000-0000-0000-000000000802', 'Substation Testing & Commissioning | PT Multi Daya Mitra', 'Preventive maintenance of MV switchgear ensures reliability, safety, and asset longevity through systematic testing, inspection, and protection coordination.'),
('news', '00000000-0000-0000-0000-000000000803', 'Transformer Testing & Maintenance Guide | PT Multi Daya Mitra', 'Comprehensive guide to power transformer health assessments including insulation testing, dissolved gas analysis, and frequency response diagnostics.'),
('news', '00000000-0000-0000-0000-000000000804', 'Effects of Harmonic Distortion on Electrical Systems | PT Multi Daya Mitra', 'Understanding how harmonic distortion from non-linear loads affects transformers, cables, and power quality — and practical mitigation solutions.'),
('news', '00000000-0000-0000-0000-000000000805', 'Partial Discharge Analysis for MV/HV Equipment | PT Multi Daya Mitra', 'Online partial discharge analysis enables early insulation fault detection in medium and high voltage switchgear, transformers, and cable systems.'),
('news', '00000000-0000-0000-0000-000000000806', 'Centralized Fire Alarm Monitoring Systems | PT Multi Daya Mitra', 'How centralized fire alarm monitoring integrates multiple detection zones for faster response, regulatory compliance, and operational efficiency.')
ON CONFLICT DO NOTHING;

-- Careers
INSERT INTO seo_meta (entity_type, entity_id, title, description) VALUES
('career', '00000000-0000-0000-0000-000000000901', 'Senior Electrical Engineer Job | PT Multi Daya Mitra Careers', 'Join PT Multi Daya Mitra as a Senior Electrical Engineer. Lead MV system design, protection coordination, and commissioning for industrial clients in Surabaya.'),
('career', '00000000-0000-0000-0000-000000000902', 'Automation Engineer (PLC & SCADA) Job | PT Multi Daya Mitra Careers', 'Join PT Multi Daya Mitra as an Automation Engineer. Design, program, and commission PLC, HMI, and SCADA systems for industrial process control.'),
('career', '00000000-0000-0000-0000-000000000903', 'Electrical Team Leader Job | PT Multi Daya Mitra Careers', 'Join PT Multi Daya Mitra as an Electrical Team Leader. Supervise field teams during maintenance, testing, and commissioning activities in Gresik.'),
('career', '00000000-0000-0000-0000-000000000904', 'Electrical Operator Job | PT Multi Daya Mitra Careers', 'Join PT Multi Daya Mitra as an Electrical Operator. Perform daily electrical operation and monitoring at industrial facilities in Surabaya.'),
('career', '00000000-0000-0000-0000-000000000905', 'Fire Alarm Technician Job | PT Multi Daya Mitra Careers', 'Join PT Multi Daya Mitra as a Fire Alarm Technician. Install, test, and maintain fire alarm systems at industrial sites across East Java.'),
('career', '00000000-0000-0000-0000-000000000906', 'Site Manager Job | PT Multi Daya Mitra Careers', 'Join PT Multi Daya Mitra as a Site Manager. Manage electrical and automation project execution at industrial client sites in Gresik.')
ON CONFLICT DO NOTHING;

COMMIT;
