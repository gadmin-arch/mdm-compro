-- 018_products_and_partners_hierarchy.up.sql
-- Synchronize Products & Partners hierarchy with official 2026 Company Profile:
-- 1. Rittal Authorized Distributor (Enclosures, Climate Control & Cooling, Power Distribution)
-- 2. Schneider Electric System Integrator (Industrial Automation, Power & Energy Monitoring, Electrical Distribution Integration, Engineering & Commissioning)
-- 3. Product Categories (Electrical Distribution, Automation & Control, Enclosure & Climate Control, Power Quality, Fire Alarm Products)
-- 4. Brand Experience ecosystem data

BEGIN;

-- Clean existing products to rebuild clean, standardized hierarchy
DELETE FROM products WHERE id IS NOT NULL;

-- Root Categories (Depth 0)
INSERT INTO products (id, slug, full_path, title, summary, content, specs, image_url, status, published_at, sort_order, depth) VALUES
(
    '00000000-0000-0000-0000-000000000701',
    'rittal-distributor',
    'rittal-distributor',
    'Rittal Authorized Distributor',
    'Official Authorized Distributor for Rittal industrial enclosures, climate control & cooling, and power distribution systems.',
    '{"blocks":[{"type":"paragraph","data":{"text":"PT Multi Daya Mitra is the official Authorized Distributor for Rittal in Indonesia. We provide genuine Rittal enclosure systems, climate control units, and low-voltage power distribution equipment with certified engineering support, stock availability, and manufacturer warranty."}}]}',
    '{"partnerType":"Authorized Distributor","brand":"Rittal","origin":"Germany","warranty":"Official Manufacturer Warranty"}',
    '/uploads/products-rittal.jpg',
    'published',
    now(),
    1,
    0
),
(
    '00000000-0000-0000-0000-000000000702',
    'schneider-integrator',
    'schneider-integrator',
    'Schneider Electric System Integrator',
    'Certified System Integrator & Solutions Partner delivering industrial automation, energy monitoring, and electrical distribution.',
    '{"blocks":[{"type":"paragraph","data":{"text":"As a certified Schneider Electric System Integrator, PT Multi Daya Mitra delivers integrated automation, power monitoring (PME), and electrical distribution architectures. We combine world-class hardware with custom engineering, programming, FAT/SAT, and plant commissioning."}}]}',
    '{"partnerType":"Certified System Integrator","brand":"Schneider Electric","origin":"France / Global","ecosystem":"EcoStruxure Partner"}',
    '/uploads/automation-project.jpg',
    'published',
    now(),
    2,
    0
),
(
    '00000000-0000-0000-0000-000000000703',
    'electrical-distribution',
    'electrical-distribution',
    'Electrical Distribution',
    'Medium & Low Voltage electrical distribution equipment, switchboards, transformers, and protection systems.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Comprehensive electrical distribution solutions for industrial plants, power stations, and commercial infrastructure. Covering MV/LV switchgear, distribution transformers, motor control centers, and protection relays."}}]}',
    '{"category":"Electrical Distribution","voltageLevels":"MV up to 36kV, LV up to 1000V"}',
    '/uploads/hero-project.jpg',
    'published',
    now(),
    3,
    0
),
(
    '00000000-0000-0000-0000-000000000704',
    'automation-control',
    'automation-control',
    'Automation & Control',
    'Industrial automation, PLC systems, SCADA / HMI process visualization, and motor drives.',
    '{"blocks":[{"type":"paragraph","data":{"text":"State-of-the-art automation and control solutions designed to optimize production throughput, energy efficiency, and operational safety. From individual machine control to plant-wide centralized SCADA."}}]}',
    '{"category":"Automation & Control","platforms":"EcoStruxure, xArrow, Siemens, Rockwell"}',
    '/uploads/M2.jpeg',
    'published',
    now(),
    4,
    0
),
(
    '00000000-0000-0000-0000-000000000705',
    'enclosure-climate-control',
    'enclosure-climate-control',
    'Enclosure & Climate Control',
    'Industrial enclosures, server racks, climate control, and cooling systems for harsh manufacturing environments.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Heavy-duty industrial enclosure and climate control products engineered to protect sensitive electrical and automation equipment against heat, dust, corrosive chemicals, and outdoor elements."}}]}',
    '{"category":"Enclosure & Climate Control","protection":"IP55 - IP66 / NEMA 4X"}',
    '/uploads/products-rittal.jpg',
    'published',
    now(),
    5,
    0
),
(
    '00000000-0000-0000-0000-000000000706',
    'power-quality',
    'power-quality',
    'Power Quality',
    'Active harmonic filters, power factor correction, capacitor banks, and power quality analyzers.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Advanced power quality management products that eliminate harmonics, correct power factor to near-unity, suppress voltage fluctuations, and prevent costly equipment tripping."}}]}',
    '{"category":"Power Quality","mitigation":"THDi < 3%, Stepless Cos Phi 1.0"}',
    '/uploads/news-1.jpg',
    'published',
    now(),
    6,
    0
),
(
    '00000000-0000-0000-0000-000000000707',
    'fire-alarm-products',
    'fire-alarm-products',
    'Fire Alarm Products',
    'Industrial addressable fire alarm panels, detectors, notification appliances, and suppression solutions.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Certified fire detection and suppression products designed for industrial facilities, power plants, control rooms, and commercial high-rises in accordance with NFPA standards."}}]}',
    '{"category":"Fire Alarm Products","standards":"NFPA 72, NFPA 2001, EN54, UL/FM"}',
    '/uploads/testing-commissioning-project.jpg',
    'published',
    now(),
    7,
    0
);

-- Child Products (Depth 1) - Under Rittal Authorized Distributor
INSERT INTO products (id, parent_id, slug, full_path, title, summary, content, specs, image_url, status, published_at, sort_order, depth) VALUES
(
    '00000000-0000-0000-0000-000000000711',
    '00000000-0000-0000-0000-000000000701',
    'enclosures',
    'rittal-distributor/enclosures',
    'Rittal Enclosure Systems (VX25, AX, KX)',
    'Modular baying enclosure systems (VX25), compact enclosures (AX), small enclosures (KX), and outdoor IT racks.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Rittal enclosure systems provide unmatched modularity, IP66 protection, and mechanical strength. Suitable for control panels, switchgear, automation assemblies, and outdoor cabinets in industrial environments."}}]}',
    '{"Series":"VX25, AX, KX, CS Toptec","Protection Rating":"IP55 / IP66 / NEMA 4X","Material":"Sheet steel / Stainless steel AISI 304 & 316L","Approvals":"IEC 62208, UL 508A, DNV-GL"}',
    '/uploads/products-rittal.jpg',
    'published',
    now(),
    1,
    1
),
(
    '00000000-0000-0000-0000-000000000712',
    '00000000-0000-0000-0000-000000000701',
    'climate-control-cooling',
    'rittal-distributor/climate-control-cooling',
    'Rittal Climate Control & Cooling (Blue e+)',
    'Energy-efficient Blue e+ cooling units, industrial chillers, and air-to-water heat exchangers providing up to 75% energy savings.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Rittal Blue e+ cooling technology utilizes hybrid heat pipe and inverter-driven compressor systems, significantly reducing carbon footprint and energy consumption while ensuring stable temperatures for sensitive electronics."}}]}',
    '{"Technology":"Hybrid Heat Pipe + Inverter Compressor","Energy Saving":"Up to 75% vs standard cooling","Cooling Output":"300 W to 6000 W","Connectivity":"IoT Interface / Modbus / SNMP"}',
    '/uploads/automation-project.jpg',
    'published',
    now(),
    2,
    1
),
(
    '00000000-0000-0000-0000-000000000713',
    '00000000-0000-0000-0000-000000000701',
    'power-distribution',
    'rittal-distributor/power-distribution',
    'Rittal Power Distribution (Ri4Power & RiLine)',
    'Type-tested low-voltage switchgear system up to 6300A with modular RiLine compact busbar power distribution.',
    '{"blocks":[{"type":"paragraph","data":{"text":"The Ri4Power modular power distribution system allows type-tested assembly according to IEC 61439-1/-2 up to 6300A, featuring Form 1 to Form 4b internal separation and compact RiLine busbar technology."}}]}',
    '{"System":"Ri4Power & RiLine60","Rated Current":"Up to 6300 A","Form of Separation":"Form 1 to 4b","Standard":"IEC 61439-1/-2, IEC 60947"}',
    '/uploads/hero-project.jpg',
    'published',
    now(),
    3,
    1
);

-- Child Products (Depth 1) - Under Schneider Electric System Integrator
INSERT INTO products (id, parent_id, slug, full_path, title, summary, content, specs, image_url, status, published_at, sort_order, depth) VALUES
(
    '00000000-0000-0000-0000-000000000721',
    '00000000-0000-0000-0000-000000000702',
    'industrial-automation',
    'schneider-integrator/industrial-automation',
    'Schneider Industrial Automation (Modicon & EcoStruxure)',
    'Next-generation universal automation, Modicon M221/M241/M251/M580 PLCs, Altivar VSD drives, and Magelis HMI.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Complete industrial automation integration using Schneider Electric EcoStruxure™ architecture, Modicon PLCs, and Altivar variable speed drives for precise motion, pump, fan, and manufacturing process control."}}]}',
    '{"PLC Family":"Modicon M221, M241, M251, M580 ePAC","Drives":"Altivar Process ATV600 / ATV900 / ATV320","Software":"EcoStruxure Control Expert, Machine Expert","Protocols":"Modbus TCP, Ethernet/IP, Profinet, OPC UA"}',
    '/uploads/M2.jpeg',
    'published',
    now(),
    1,
    1
),
(
    '00000000-0000-0000-0000-000000000722',
    '00000000-0000-0000-0000-000000000702',
    'power-energy-monitoring',
    'schneider-integrator/power-energy-monitoring',
    'Power & Energy Monitoring (PME & PowerLogic)',
    'Real-time power monitoring with EcoStruxure Power Monitoring Expert (PME) and PowerLogic PM5000/PM8000 smart power meters.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Turnkey energy management and electrical network monitoring. Delivers real-time telemetry, power quality event capture, energy baseline auditing, and automated ESG carbon accounting reports."}}]}',
    '{"Software Platform":"EcoStruxure Power Monitoring Expert (PME)","Hardware":"PowerLogic PM5000, PM8000, ION9000","Capabilities":"Harmonics, Sag/Swell, Transient Logging, ESG Reporting","Compliance":"ISO 50001, IEC 61000-4-30 Class A"}',
    '/uploads/news-1.jpg',
    'published',
    now(),
    2,
    1
),
(
    '00000000-0000-0000-0000-000000000723',
    '00000000-0000-0000-0000-000000000702',
    'electrical-distribution-integration',
    'schneider-integrator/electrical-distribution-integration',
    'Electrical Distribution Integration (MasterPact & Prisma)',
    'Integrated low and medium voltage electrical distribution with MasterPact MTZ/NT/NW ACBs, Compact NSX, and Prisma switchboards.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Engineered switchboard solutions combining Schneider Electric Prisma iPM structures with smart MasterPact MTZ circuit breakers featuring embedded Class 1 power metering and remote diagnostics."}}]}',
    '{"Air Circuit Breakers":"MasterPact MTZ1 / MTZ2 / MTZ3 (up to 6300A)","MCCB":"Compact NSX & NSXm with MicroLogic","Switchboard System":"Prisma iPM / PrismaSeT G & P","Intelligence":"Embedded Power Metering & Health Analytics"}',
    '/uploads/hero-project.jpg',
    'published',
    now(),
    3,
    1
),
(
    '00000000-0000-0000-0000-000000000724',
    '00000000-0000-0000-0000-000000000702',
    'engineering-commissioning',
    'schneider-integrator/engineering-commissioning',
    'Schneider Engineering, FAT/SAT & Commissioning Support',
    'Full lifecycle engineering support from CAD panel schematics and PLC logic to Factory Acceptance Testing (FAT) and site commissioning.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Certified engineering teams provide end-to-end support including electrical design, control panel fabrication, software engineering, Factory Acceptance Testing (FAT), Site Acceptance Testing (SAT), and 24/7 service contracts."}}]}',
    '{"Services":"Panel Design, PLC/SCADA Programming, FAT & SAT, On-Site Testing","Testing Gear":"Secondary Injection Sets, Omicron Relay Test, Cable Analyzers","Response":"24/7 Emergency Support SLA Available"}',
    '/uploads/testing-commissioning-project.jpg',
    'published',
    now(),
    4,
    1
);

-- Child Products (Depth 1) - Under Core Categories
INSERT INTO products (id, parent_id, slug, full_path, title, summary, content, specs, image_url, status, published_at, sort_order, depth) VALUES
(
    '00000000-0000-0000-0000-000000000731',
    '00000000-0000-0000-0000-000000000703',
    'medium-voltage-substation',
    'electrical-distribution/medium-voltage-substation',
    'Medium Voltage Substation & Transformers',
    'MV Metal-Clad Switchgear up to 24kV/36kV, Oil-Immersed & Cast Resin Dry-Type Transformers, and Vacuum Circuit Breakers.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Turnkey medium voltage substation equipment engineered for utility substations, heavy industrial plants, and captive power plants."}}]}',
    '{"Voltage Level":"Up to 36 kV","Transformer Capacity":"Up to 20 MVA","Insulation":"Oil-Immersed / Cast Resin Dry Type","Standard":"IEC 62271-200, SPLN"}',
    '/uploads/hero-project.jpg',
    'published',
    now(),
    1,
    1
),
(
    '00000000-0000-0000-0000-000000000732',
    '00000000-0000-0000-0000-000000000703',
    'low-voltage-distribution-panels',
    'electrical-distribution/low-voltage-distribution-panels',
    'Low Voltage Panels (MDP, SDP, ATS & Sync)',
    'Main Distribution Panels (MDP), Sub-Distribution Panels (SDP), ATS/AMF Generator Sync Panels, and Motor Control Centers (MCC).',
    '{"blocks":[{"type":"paragraph","data":{"text":"Custom assembled low voltage distribution boards built with premium copper busbars, type-tested enclosures, and intelligent circuit breakers for seamless power routing."}}]}',
    '{"Rated Voltage":"380V / 400V / 690V","Busbar Rating":"Up to 6300A (99.9% Cu-ETP)","Enclosure IP":"IP42 to IP65","Operation":"Manual / Auto Sync ATS"}',
    '/uploads/testing-commissioning-project.jpg',
    'published',
    now(),
    2,
    1
),
(
    '00000000-0000-0000-0000-000000000741',
    '00000000-0000-0000-0000-000000000704',
    'scada-xarrow-telemetry',
    'automation-control/scada-xarrow-telemetry',
    'SCADA Systems & Process Monitoring (xArrow)',
    'High-performance SCADA software, real-time telemetry, alarm management, historical trending, and industrial IoT dashboards.',
    '{"blocks":[{"type":"paragraph","data":{"text":"xArrow SCADA and centralized process monitoring solutions allow plant managers to visualize machinery status, record production metrics, and receive instant alert dispatches."}}]}',
    '{"Software":"xArrow SCADA Industrial Edition","Tags":"Unlimited I/O Tag Packages","Protocols":"OPC UA, Modbus TCP/RTU, MQTT, REST API","Architecture":"Client-Server / Web-Based"}',
    '/uploads/M2.jpeg',
    'published',
    now(),
    1,
    1
),
(
    '00000000-0000-0000-0000-000000000742',
    '00000000-0000-0000-0000-000000000704',
    'vsd-inverter-panels',
    'automation-control/vsd-inverter-panels',
    'Variable Speed Drive (VSD) & Inverter Panels',
    'Custom engineered VSD and soft starter panels for pumps, compressors, blowers, extruders, and conveying machinery.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Enclosed drive panels engineered with proper thermal dissipation, line reactors, harmonic mitigation, and bypass contactors for reliable speed and torque regulation."}}]}',
    '{"Power Range":"0.75 kW to 1200 kW","Control Modes":"V/f, Vector Control, Torque Control","Brands":"Schneider, Danfoss, ABB, Siemens","Enclosure":"Rittal Industrial IP55"}',
    '/uploads/automation-project.jpg',
    'published',
    now(),
    2,
    1
),
(
    '00000000-0000-0000-0000-000000000751',
    '00000000-0000-0000-0000-000000000706',
    'active-harmonic-filters',
    'power-quality/active-harmonic-filters',
    'Active Harmonic Filters (AHF) & SVG',
    'Dynamic active harmonic compensation up to the 50th harmonic order with stepless reactive power factor correction.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Active Harmonic Filters dynamically inject counter-phase currents to cancel harmonic distortions generated by non-linear loads such as VFDs, rectifiers, and UPS systems."}}]}',
    '{"Harmonic Range":"2nd to 50th Order","Target THDi":"< 3% at rated capacity","Response Time":"< 5 milliseconds","Modular Capacity":"50A to 600A modular"}',
    '/uploads/news-1.jpg',
    'published',
    now(),
    1,
    1
),
(
    '00000000-0000-0000-0000-000000000761',
    '00000000-0000-0000-0000-000000000707',
    'addressable-fire-alarm-systems',
    'fire-alarm-products/addressable-fire-alarm-systems',
    'Addressable Fire Alarm Panels & Detectors',
    'Intelligent addressable fire alarm control panels, multi-criteria optical smoke & heat detectors, and suppression triggers.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Fully addressable fire detection networks providing precise point-by-point device identification, automatic sensitivity drift compensation, and BMS system integration."}}]}',
    '{"Standards":"NFPA 72, EN54, UL Listed, FM Approved","Capacity":"1 to 8 Loops (up to 2000+ points)","Detectors":"Optical Smoke, Thermal, Multi-Criteria, Flame"}',
    '/uploads/testing-commissioning-project.jpg',
    'published',
    now(),
    1,
    1
);

COMMIT;
