-- 012_complete_source_catalog.up.sql
-- Complete the visible service/product hierarchy from multidayamitra.co.id
-- and use a distinct local source image wherever the source page provides one.

BEGIN;

INSERT INTO media (id, file_name, object_key, url, mime_type, size_bytes, alt_text, status, metadata) VALUES
('00000000-0000-0000-0000-000000001201', 'electrical-services.jpg', 'seed/multidayamitra/electrical-services.jpg', '/uploads/mdm/electrical-services.jpg', 'image/jpeg', 130884, 'Dry transformer maintenance', 'ready', '{"seed":true,"source":"https://multidayamitra.co.id/services/electrical-services/"}'),
('00000000-0000-0000-0000-000000001202', 'testing-measurement.jpg', 'seed/multidayamitra/testing-measurement.jpg', '/uploads/mdm/testing-measurement.jpg', 'image/jpeg', 8651, 'Partial discharge analyzer', 'ready', '{"seed":true,"source":"https://multidayamitra.co.id/services/electrical-services/testing-measurement/"}'),
('00000000-0000-0000-0000-000000001203', 'secondary-injector.jpg', 'seed/multidayamitra/secondary-injector.jpg', '/uploads/mdm/secondary-injector.jpg', 'image/jpeg', 86075, 'Secondary injection testing', 'ready', '{"seed":true,"source":"https://multidayamitra.co.id/services/electrical-services/testing-measurement/secondary-injector-3-and-6-phase-current-voltage/"}'),
('00000000-0000-0000-0000-000000001204', 'partial-discharge.jpg', 'seed/multidayamitra/partial-discharge.jpg', '/uploads/mdm/partial-discharge.jpg', 'image/jpeg', 172754, 'Partial discharge scan', 'ready', '{"seed":true,"source":"https://multidayamitra.co.id/services/electrical-services/testing-measurement/partial-discharge-analyzer-pd-scan/"}'),
('00000000-0000-0000-0000-000000001205', 'contact-resistance.jpg', 'seed/multidayamitra/contact-resistance.jpg', '/uploads/mdm/contact-resistance.jpg', 'image/jpeg', 13129, 'Contact resistance measurement', 'ready', '{"seed":true,"source":"https://multidayamitra.co.id/services/electrical-services/testing-measurement/contact-resistance-low-ohm-measurement/"}'),
('00000000-0000-0000-0000-000000001206', 'micrologic-test.jpg', 'seed/multidayamitra/micrologic-test.jpg', '/uploads/mdm/micrologic-test.jpg', 'image/jpeg', 62213, 'Schneider Micrologic test kit', 'ready', '{"seed":true,"source":"https://multidayamitra.co.id/services/electrical-services/testing-measurement/micrologic-test-kit-fftk-schneider/"}'),
('00000000-0000-0000-0000-000000001207', 'power-quality.jpg', 'seed/multidayamitra/power-quality.jpg', '/uploads/mdm/power-quality.jpg', 'image/jpeg', 72136, 'Power quality analyzer', 'ready', '{"seed":true,"source":"https://multidayamitra.co.id/services/electrical-services/testing-measurement/power-quality-analyzer/"}'),
('00000000-0000-0000-0000-000000001208', 'circuit-breaker.jpg', 'seed/multidayamitra/circuit-breaker.jpg', '/uploads/mdm/circuit-breaker.jpg', 'image/jpeg', 80783, 'Circuit breaker analyzer', 'ready', '{"seed":true,"source":"https://multidayamitra.co.id/services/electrical-services/testing-measurement/circuit-breaker-analyzer/"}'),
('00000000-0000-0000-0000-000000001209', 'infrared-thermograph.jpg', 'seed/multidayamitra/infrared-thermograph.jpg', '/uploads/mdm/infrared-thermograph.jpg', 'image/jpeg', 55194, 'Infrared thermography inspection', 'ready', '{"seed":true,"source":"https://multidayamitra.co.id/services/electrical-services/testing-measurement/infrared-thermal-imaging-thermograph/"}'),
('00000000-0000-0000-0000-000000001210', 'maintenance.jpg', 'seed/multidayamitra/maintenance.jpg', '/uploads/mdm/maintenance.jpg', 'image/jpeg', 11740, 'Electrical inspection and troubleshooting', 'ready', '{"seed":true,"source":"https://multidayamitra.co.id/services/electrical-services/maintenance/"}'),
('00000000-0000-0000-0000-000000001211', 'predictive-maintenance.jpg', 'seed/multidayamitra/predictive-maintenance.jpg', '/uploads/mdm/predictive-maintenance.jpg', 'image/jpeg', 60728, 'Predictive maintenance partial discharge scan', 'ready', '{"seed":true,"source":"https://multidayamitra.co.id/services/electrical-services/maintenance/predictive-maintenance/"}'),
('00000000-0000-0000-0000-000000001212', 'preventive-maintenance.jpg', 'seed/multidayamitra/preventive-maintenance.jpg', '/uploads/mdm/preventive-maintenance.jpg', 'image/jpeg', 78327, 'Circuit breaker preventive maintenance', 'ready', '{"seed":true,"source":"https://multidayamitra.co.id/services/electrical-services/maintenance/preventive-maintenance/"}'),
('00000000-0000-0000-0000-000000001213', 'maintenance-contract.jpg', 'seed/multidayamitra/maintenance-contract.jpg', '/uploads/mdm/maintenance-contract.jpg', 'image/jpeg', 60619, 'Variable speed drive maintenance', 'ready', '{"seed":true,"source":"https://multidayamitra.co.id/services/electrical-services/maintenance/maintenance-contract/"}'),
('00000000-0000-0000-0000-000000001214', 'construction-installation.jpg', 'seed/multidayamitra/construction-installation.jpg', '/uploads/mdm/construction-installation.jpg', 'image/jpeg', 90184, 'Medium-voltage cable installation', 'ready', '{"seed":true,"source":"https://multidayamitra.co.id/services/electrical-services/construction-installation/"}'),
('00000000-0000-0000-0000-000000001215', 'lightning-protection.png', 'seed/multidayamitra/lightning-protection.png', '/uploads/mdm/lightning-protection.png', 'image/png', 51809, 'Lightning protection level diagram', 'ready', '{"seed":true,"source":"https://multidayamitra.co.id/services/electrical-services/engineering-solution/lightning-protection-system/"}'),
('00000000-0000-0000-0000-000000001216', 'power-monitoring.jpg', 'seed/multidayamitra/power-monitoring.jpg', '/uploads/mdm/power-monitoring.jpg', 'image/jpeg', 62551, 'Power monitoring system trend', 'ready', '{"seed":true,"source":"https://multidayamitra.co.id/services/electrical-services/engineering-solution/power-monitoring-system/"}'),
('00000000-0000-0000-0000-000000001217', 'active-harmonic-filter.jpg', 'seed/multidayamitra/active-harmonic-filter.jpg', '/uploads/mdm/active-harmonic-filter.jpg', 'image/jpeg', 52527, 'Active harmonic filter installation', 'ready', '{"seed":true,"source":"https://multidayamitra.co.id/services/electrical-services/engineering-solution/active-harmonic-filter/"}'),
('00000000-0000-0000-0000-000000001218', 'industrial-automation.jpg', 'seed/multidayamitra/industrial-automation.jpg', '/uploads/mdm/industrial-automation.jpg', 'image/jpeg', 76584, 'Industrial automation monitoring network', 'ready', '{"seed":true,"source":"https://multidayamitra.co.id/services/industrial-automation/"}'),
('00000000-0000-0000-0000-000000001219', 'testing-tools.jpg', 'seed/multidayamitra/testing-tools.jpg', '/uploads/mdm/testing-tools.jpg', 'image/jpeg', 26856, 'TRAX 280 electrical test set', 'ready', '{"seed":true,"source":"https://multidayamitra.co.id/services/tools/"}'),
('00000000-0000-0000-0000-000000001220', 'fire-alarm.jpg', 'seed/multidayamitra/fire-alarm.jpg', '/uploads/mdm/fire-alarm.jpg', 'image/jpeg', 4446, 'Fire alarm installation', 'ready', '{"seed":true,"source":"https://multidayamitra.co.id/services/fire-alarm/"}'),
('00000000-0000-0000-0000-000000001221', 'medium-voltage-equipment.jpg', 'seed/multidayamitra/medium-voltage-equipment.jpg', '/uploads/mdm/medium-voltage-equipment.jpg', 'image/jpeg', 44605, 'Medium voltage switchgear', 'ready', '{"seed":true,"source":"https://multidayamitra.co.id/products/electrical-equipment/medium-voltage-equipment/"}')
ON CONFLICT DO NOTHING;

-- Align the pre-existing category records with the site's actual hierarchy.
UPDATE services
SET summary = 'Electrical study, engineering, installation, commissioning, maintenance, and energy-management support for industrial distribution systems.',
    content = '{"blocks":[{"type":"heading","text":"Electrical Study and Engineering"},{"type":"list","items":["Electrical distribution system design and engineering","Power quality and protection studies using supporting tools and software","System quality audits","Start-up, commissioning, and training","Energy-efficiency and power-monitoring solutions","Centralized electrical distribution monitoring","Expansion and upgrading"]}]}'::jsonb,
    image_url = '/uploads/mdm/electrical-services.jpg', gallery = '[]'::jsonb, updated_at = now()
WHERE slug = 'electrical-services';

UPDATE services
SET parent_id = (SELECT id FROM services WHERE slug = 'electrical-services'),
    full_path = 'electrical-services/testing-measurement', depth = 1,
    title = 'Testing & Measurement',
    summary = 'Electrical testing and measurement using specialized professional instruments.',
    content = '{"blocks":[{"type":"paragraph","text":"Professional equipment and field services for relay testing, partial discharge scanning, contact-resistance measurement, power-quality analysis, circuit-breaker analysis, and infrared thermography."},{"type":"list","items":["Secondary injection testing","Partial discharge analysis","Contact resistance measurement","Micrologic protection testing","Power quality analysis","Circuit breaker analysis","Infrared thermal imaging"]}]}'::jsonb,
    image_url = '/uploads/mdm/testing-measurement.jpg', gallery = '[]'::jsonb, updated_at = now()
WHERE slug = 'testing-measurement';

UPDATE services
SET summary = 'Predictive, preventive, and contract maintenance for industrial electrical assets.',
    content = '{"blocks":[{"type":"paragraph","text":"Maintenance programs combine routine checks, condition-based diagnostics, planned shutdown work, and service-level agreement support to protect electrical assets and reduce unplanned downtime."},{"type":"list","items":["Predictive maintenance","Preventive maintenance","Maintenance contracts"]}]}'::jsonb,
    image_url = '/uploads/mdm/maintenance.jpg', gallery = '[]'::jsonb, updated_at = now()
WHERE slug = 'maintenance';

UPDATE services
SET title = 'Industrial Automation',
    summary = 'Engineering, implementation, and application of industrial monitoring and control systems.',
    content = '{"blocks":[{"type":"heading","text":"Engineering Services"},{"type":"list","items":["HMI, SCADA, remote monitoring, and reporting design","Programmable Logic Controller and Distribution Control Systems","Data acquisition","Remote monitoring and controlling","Web client and database connection","Plant Information Management System","Switchgear automation systems"]}]}'::jsonb,
    image_url = '/uploads/mdm/industrial-automation.jpg', gallery = '[]'::jsonb, updated_at = now()
WHERE slug = 'industrial-automation';

UPDATE services
SET slug = 'tools', full_path = 'tools', title = 'Tools for Testing & Measurement',
    summary = 'Professional test instruments available for electrical testing and measurement.',
    content = '{"blocks":[{"type":"paragraph","text":"Specialized electrical testing equipment supporting commissioning, condition monitoring, and diagnostic work."},{"type":"list","items":["TRAX 280 test set","Power quality analyzer","Full Function Test Kit (FFTK)"]}]}'::jsonb,
    image_url = '/uploads/mdm/testing-tools.jpg', gallery = '[]'::jsonb, updated_at = now()
WHERE slug = 'tools-testing-measurement';

UPDATE services
SET parent_id = NULL, full_path = 'fire-alarm', depth = 0, title = 'Fire Alarm',
    summary = 'Fire-alarm design, installation, testing, commissioning, maintenance, and centralization.',
    content = '{"blocks":[{"type":"paragraph","text":"PT Multi Daya Mitra delivers fire-alarm implementation with certified personnel and support for system design through ongoing maintenance."},{"type":"list","items":["Design","Installation","Testing and commissioning","Preventive and repair maintenance contracts","Improvement and centralization"]}]}'::jsonb,
    image_url = '/uploads/mdm/fire-alarm.jpg', gallery = '[]'::jsonb, updated_at = now()
WHERE slug = 'fire-alarm';

UPDATE services SET status = 'archived', updated_at = now() WHERE slug IN ('fire-alarm-services', 'automation');

-- Child services visible in the source navigation.
INSERT INTO services (id, parent_id, slug, full_path, title, summary, content, image_url, status, published_at, sort_order, depth) VALUES
('00000000-0000-0000-0000-000000001301', (SELECT id FROM services WHERE slug = 'testing-measurement'), 'secondary-injector-3-and-6-phase-current-voltage', 'electrical-services/testing-measurement/secondary-injector-3-and-6-phase-current-voltage', 'Secondary Injector 3 and 6 Phase (Current & Voltage)', 'Secondary-injection testing for relay protection, metering, generator control, and electrical parameter devices.', '{"blocks":[{"type":"paragraph","text":"Secondary injection testing supports relay-protection, metering, and generator-control verification across ABB, Schneider, Siemens, GE Multilin, Toshiba, and analogue relay platforms."},{"type":"list","items":["Six current outputs and six voltage outputs","Low-ampere output and IEC 61850 communication testing","ANSI functions including 87, 50, 51, 32, 27, 59, 60, 64, 67, and 78"]}]}'::jsonb, '/uploads/mdm/secondary-injector.jpg', 'published', now(), 1, 2),
('00000000-0000-0000-0000-000000001302', (SELECT id FROM services WHERE slug = 'testing-measurement'), 'partial-discharge-analyzer-pd-scan', 'electrical-services/testing-measurement/partial-discharge-analyzer-pd-scan', 'Partial Discharge Analyzer (PD Scan)', 'Portable partial-discharge scanning for early fault detection in medium- and high-voltage equipment.', '{"blocks":[{"type":"paragraph","text":"PD Scan identifies partial-discharge signals before defects become costly failures, helping operators prioritize corrective action."},{"type":"list","items":["MV switchgear, bus bars, and bushings","MV cable pre-screening using HFCT sensors","Transformer and outdoor equipment inspection","TEV, acoustic contact, flexible acoustic, and parabolic receiver methods"]}]}'::jsonb, '/uploads/mdm/partial-discharge.jpg', 'published', now(), 2, 2),
('00000000-0000-0000-0000-000000001303', (SELECT id FROM services WHERE slug = 'testing-measurement'), 'contact-resistance-low-ohm-measurement', 'electrical-services/testing-measurement/contact-resistance-low-ohm-measurement', 'Contact Resistance (Low Ohm) Measurement', 'Low-ohm measurement for circuit-breaker contacts, busbar connections, cable terminations, and busducts.', '{"blocks":[{"type":"list","items":["Circuit breaker or switch contacts","Busbar connections","Cable terminations","Busduct installations"]}]}'::jsonb, '/uploads/mdm/contact-resistance.jpg', 'published', now(), 3, 2),
('00000000-0000-0000-0000-000000001304', (SELECT id FROM services WHERE slug = 'testing-measurement'), 'micrologic-test-kit-fftk-schneider', 'electrical-services/testing-measurement/micrologic-test-kit-fftk-schneider', 'Micrologic Test Kit (FFTK) Schneider', 'Testing of Schneider low-voltage circuit-breaker Micrologic protection and measurement units.', '{"blocks":[{"type":"paragraph","text":"The Full Function Test Kit verifies mechanical and electrical operation of Schneider ACB Micrologic control units."},{"type":"list","items":["LI, LSI, LSIG, and LSIV protection levels","Ammeter, energy, power, and harmonics measurement types","Control-unit setting display and protection-function tests"]}]}'::jsonb, '/uploads/mdm/micrologic-test.jpg', 'published', now(), 4, 2),
('00000000-0000-0000-0000-000000001305', (SELECT id FROM services WHERE slug = 'testing-measurement'), 'power-quality-analyzer', 'electrical-services/testing-measurement/power-quality-analyzer', 'Power Quality Analyzer', 'Analysis of voltage, frequency, waveform, continuity, transients, and harmonics in electrical distribution systems.', '{"blocks":[{"type":"paragraph","text":"Power-quality measurement evaluates whether supply conditions and connected loads remain compatible and reliable."},{"type":"list","items":["Continuity of service","Voltage magnitude variation","Transient voltage and current events","AC waveform harmonic content"]}]}'::jsonb, '/uploads/mdm/power-quality.jpg', 'published', now(), 5, 2),
('00000000-0000-0000-0000-000000001306', (SELECT id FROM services WHERE slug = 'testing-measurement'), 'circuit-breaker-analyzer', 'electrical-services/testing-measurement/circuit-breaker-analyzer', 'Circuit Breaker Analyzer', 'Circuit-breaker timing, motion, dynamic characteristic, and coil-current analysis.', '{"blocks":[{"type":"list","items":["Open and close timing measurement","Motion measurement","Dynamic characteristics and bouncing analysis","Opening and closing coil-current waveform diagrams"]}]}'::jsonb, '/uploads/mdm/circuit-breaker.jpg', 'published', now(), 6, 2),
('00000000-0000-0000-0000-000000001307', (SELECT id FROM services WHERE slug = 'testing-measurement'), 'infrared-thermal-imaging-thermograph', 'electrical-services/testing-measurement/infrared-thermal-imaging-thermograph', 'Infrared Thermal Imaging (Thermograph)', 'Infrared surveys that identify abnormal heat patterns before they become equipment failures or fire risks.', '{"blocks":[{"type":"paragraph","text":"Infrared cameras visualize thermal signatures so developing electrical and mechanical issues can be found during planned inspections."},{"type":"list","items":["Loose electrical connections","Overloaded circuits or phases","Deteriorated or damaged insulation","Three-phase imbalance"]}]}'::jsonb, '/uploads/mdm/infrared-thermograph.jpg', 'published', now(), 7, 2),
('00000000-0000-0000-0000-000000001308', (SELECT id FROM services WHERE slug = 'maintenance'), 'predictive-maintenance', 'electrical-services/maintenance/predictive-maintenance', 'Predictive Maintenance', 'Condition-based maintenance using online or periodic equipment monitoring.', '{"blocks":[{"type":"paragraph","text":"Predictive-maintenance technologies monitor in-service equipment continuously or at intervals so work can be performed before performance declines."}]}'::jsonb, '/uploads/mdm/predictive-maintenance.jpg', 'published', now(), 1, 2),
('00000000-0000-0000-0000-000000001309', (SELECT id FROM services WHERE slug = 'maintenance'), 'preventive-maintenance', 'electrical-services/maintenance/preventive-maintenance', 'Preventive Maintenance', 'Scheduled shutdown maintenance that supports safety, uptime, and asset longevity.', '{"blocks":[{"type":"paragraph","text":"Preventive maintenance uses field checks and predictive findings to plan effective shutdown work for electrical distribution equipment."},{"type":"list","items":["Increased safety for people, equipment, and goods","Availability and service-continuity enhancement","Aging-asset performance and CapEx optimization","Operational-cost and OpEx optimization"]}]}'::jsonb, '/uploads/mdm/preventive-maintenance.jpg', 'published', now(), 2, 2),
('00000000-0000-0000-0000-000000001310', (SELECT id FROM services WHERE slug = 'maintenance'), 'maintenance-contract', 'electrical-services/maintenance/maintenance-contract', 'Maintenance Contract', 'Electrical maintenance contracts based on an agreed service level.', '{"blocks":[{"type":"list","items":["Regular checklist or visit","Call-out and emergency service","Regular predictive and preventive maintenance","Equipment operation","Replacement spare parts and minor repair","MTBF and MTTR reporting"]}]}'::jsonb, '/uploads/mdm/maintenance-contract.jpg', 'published', now(), 3, 2),
('00000000-0000-0000-0000-000000001311', (SELECT id FROM services WHERE slug = 'electrical-services'), 'construction-installation', 'electrical-services/construction-installation', 'Construction & Installation', 'Licensed electrical and mechanical construction and installation through medium-voltage equipment.', '{"blocks":[{"type":"paragraph","text":"Experienced site managers and project engineers support safe, efficient, and professional project execution, including medium-voltage electrical installation."}]}'::jsonb, '/uploads/mdm/construction-installation.jpg', 'published', now(), 3, 1),
('00000000-0000-0000-0000-000000001312', (SELECT id FROM services WHERE slug = 'electrical-services'), 'engineering-solution', 'electrical-services/engineering-solution', 'Engineering Solution', 'Specialist electrical engineering solutions for plant reliability and power quality.', '{"blocks":[{"type":"list","items":["Lightning protection system","Power monitoring system","Active harmonic filter"]}]}'::jsonb, NULL, 'published', now(), 4, 1),
('00000000-0000-0000-0000-000000001313', (SELECT id FROM services WHERE slug = 'engineering-solution'), 'lightning-protection-system', 'electrical-services/engineering-solution/lightning-protection-system', 'Lightning Protection System', 'Detailed lightning-protection design and assessment for industrial plants.', '{"blocks":[{"type":"paragraph","text":"Design and assessment are prepared against applicable national and international requirements."},{"type":"list","items":["IEEE Std. 998","NFPA 780","API 545","IEC/EN 62305","Indonesian Ministry of Manpower Regulation PER.02/MEN/1989","SNI 03-7014.1-2004"]}]}'::jsonb, '/uploads/mdm/lightning-protection.png', 'published', now(), 1, 2),
('00000000-0000-0000-0000-000000001314', (SELECT id FROM services WHERE slug = 'engineering-solution'), 'power-monitoring-system', 'electrical-services/engineering-solution/power-monitoring-system', 'Power Monitoring System', 'Energy-management monitoring for continuous improvement in accordance with ISO 50001.', '{"blocks":[{"type":"list","items":["Real-time monitoring","Precise time-stamped logging","Transparent energy-consumption data capture","Optimization measures","Energy and cost reduction"]}]}'::jsonb, '/uploads/mdm/power-monitoring.jpg', 'published', now(), 2, 2),
('00000000-0000-0000-0000-000000001315', (SELECT id FROM services WHERE slug = 'engineering-solution'), 'active-harmonic-filter', 'electrical-services/engineering-solution/active-harmonic-filter', 'Active Harmonic Filter', 'Harmonic-mitigation solution for installations with variable and non-linear loads.', '{"blocks":[{"type":"paragraph","text":"Active Harmonic Filters mitigate harmonic currents and voltage disturbance, helping protect equipment, improve power quality, and reduce energy cost."},{"type":"paragraph","text":"They are suited to large installations with numerous variable-speed drives and can also support power-factor correction."}]}'::jsonb, '/uploads/mdm/active-harmonic-filter.jpg', 'published', now(), 3, 2)
ON CONFLICT DO NOTHING;

-- Product catalog entries and details from the current source navigation.
UPDATE products
SET title = 'Automation', summary = 'Industrial automation software and control-system products.',
    content = '{"blocks":[{"type":"paragraph","text":"Automation solutions for industrial monitoring, control, and digital transformation."},{"type":"list","items":["SCADA – xArrow","EcoStruxure Automation Expert"]}]}'::jsonb,
    image_url = '/uploads/M2.jpeg', gallery = '[]'::jsonb, updated_at = now()
WHERE slug = 'automation-products';

UPDATE products
SET title = 'SCADA – xArrow',
    summary = 'SCADA platform with distributed acquisition, alarm processing, historical data, and multi-platform support.',
    content = '{"blocks":[{"type":"paragraph","text":"xArrow supports Windows XP/2003/Vista/7/8/10, remains compatible with earlier versions, and can be expanded with protocol drivers, script commands, and widgets."},{"type":"list","items":["Alarm processing and preservation","Client/server mode with distributed data acquisition","Real-time and multi-tasking kernel","Redundant acquisition and historical-data processing","Historical database support for Oracle, SQL Server, MySQL, Access, and PostgreSQL","OPC Client and popular communication protocols"]}]}'::jsonb,
    specs = '{"category":"Automation","product":"SCADA – xArrow"}'::jsonb,
    image_url = '/uploads/xarrow.jpg', gallery = '[]'::jsonb, updated_at = now()
WHERE slug = 'scada-xarrow';

UPDATE products
SET title = 'Electrical Equipment', summary = 'Electrical distribution panels, motor-control equipment, and medium-voltage solutions.',
    content = '{"blocks":[{"type":"paragraph","text":"Electrical equipment is supplied and assembled to international electrical standards with attention to design and safety."},{"type":"list","items":["Low-voltage distribution panel","Capacitor bank","Motor control center","Motor starters and VFD/VSD panels","ATS, AMF, and automatic load shedding","Generator control panels","Switchgear automation","Medium-voltage distribution panels","Active harmonic filters and load banks"]}]}'::jsonb,
    image_url = NULL, gallery = '[]'::jsonb, updated_at = now()
WHERE slug = 'electrical-equipment';

UPDATE products
SET title = 'Fire Alarm System', summary = 'Fire-detection products for industrial and commercial applications.',
    content = '{"blocks":[{"type":"list","items":["Bosch Security fire-detection solutions"]}]}'::jsonb,
    image_url = NULL, gallery = '[]'::jsonb, updated_at = now()
WHERE slug = 'fire-alarm-systems';

UPDATE products
SET title = 'Rittal – The System.', summary = 'Authorized Rittal enclosure, climate-control, and accessory solutions.',
    content = '{"blocks":[{"type":"paragraph","text":"Genuine Rittal enclosure solutions backed by technical expertise, project support, local service, system integration, and consistent quality."},{"type":"list","items":["Enclosures","Climate control","Accessories"]}]}'::jsonb,
    specs = '{"brand":"Rittal","role":"Authorized Distributor"}'::jsonb,
    image_url = '/uploads/Rittal.png', gallery = '[]'::jsonb, updated_at = now()
WHERE slug = 'rittal-products';

UPDATE products
SET title = 'Bosch Security', summary = 'Bosch fire-detection solutions for addressable and conventional applications.',
    content = '{"blocks":[{"type":"paragraph","text":"Bosch provides modular addressable systems and cost-efficient conventional fire technology for different application sizes."},{"type":"list","items":["Optical, heat, multi-criteria, and specialty detectors","Addressable and conventional technology","Technical alarm and extinguishing-system integration","Audible and visible notification appliances","Video-based smoke and flame detection","Detector test and removal accessories"]}]}'::jsonb,
    specs = '{"brand":"Bosch Security","category":"Fire Alarm"}'::jsonb,
    image_url = '/uploads/BOSCH.png', gallery = '[]'::jsonb, updated_at = now()
WHERE slug = 'bosch-fire-alarm';

-- These older editorial entries do not have a corresponding source product page;
-- leave their image blank rather than show an unrelated repeated asset.
UPDATE products SET image_url = NULL, gallery = '[]'::jsonb, updated_at = now()
WHERE slug IN ('instrumentation', 'testing-equipment', 'protection-relay', 'electrical-panels', 'rittal-enclosures');

INSERT INTO products (id, parent_id, slug, full_path, title, summary, content, specs, image_url, gallery, status, published_at, sort_order, depth) VALUES
('00000000-0000-0000-0000-000000001401', (SELECT id FROM products WHERE slug = 'automation-products'), 'ecostruxure-automation-expert', 'automation-products/ecostruxure-automation-expert', 'EcoStruxure™ Automation Expert', 'Plant-automation software for digital control systems in discrete, hybrid, and continuous industrial processes.', '{"blocks":[{"type":"paragraph","text":"EcoStruxure Automation Expert is an integrated automation solution designed to improve flexibility, efficiency, and scalability."}]}'::jsonb, '{"brand":"Schneider Electric","category":"Automation"}'::jsonb, NULL, '[]'::jsonb, 'published', now(), 2, 1),
('00000000-0000-0000-0000-000000001402', (SELECT id FROM products WHERE slug = 'electrical-equipment'), 'electrical-distribution-equipment', 'electrical-equipment/electrical-distribution-equipment', 'Electrical Distribution Equipment', 'Electrical distribution equipment supplied and assembled to international standards.', '{"blocks":[{"type":"list","items":["Medium-voltage distribution panel","Low-voltage distribution panel","Capacitor bank","Motor control center","Motor starters including VFD/VSD","ATS and AMF","Synchronous panel","Switchgear automation","Load-sharing panel","PV/solar panel","Power transformer, CT, and VT","Neutral grounding resistor","Active and passive harmonic filter"]}]}'::jsonb, '{"category":"Electrical Distribution"}'::jsonb, NULL, '[]'::jsonb, 'published', now(), 1, 1),
('00000000-0000-0000-0000-000000001403', (SELECT id FROM products WHERE slug = 'electrical-equipment'), 'medium-voltage-equipment', 'electrical-equipment/medium-voltage-equipment', 'Medium Voltage Equipment', 'Medium-voltage electrical distribution equipment.', '{"blocks":[{"type":"paragraph","text":"Medium-voltage equipment for electrical distribution applications."}]}'::jsonb, '{"category":"Medium Voltage"}'::jsonb, '/uploads/mdm/medium-voltage-equipment.jpg', '[]'::jsonb, 'published', now(), 2, 1)
ON CONFLICT DO NOTHING;

-- Keep existing news records aligned with their current source articles. Where the
-- original article has no featured image, an empty value is more accurate than a repeated image.
UPDATE news
SET title = 'Energy Monitoring System for Sustainability & ESG Reporting',
    excerpt = 'Smart energy monitoring that improves efficiency, reduces cost, and supports sustainability and ESG reporting.',
    body = '{"blocks":[{"type":"heading","text":"Turning Energy Data into Measurable Business Impact"},{"type":"paragraph","text":"PT Multi Daya Mitra implemented a Smart Energy Monitoring System integrated with an industrial-grade SCADA platform to give production lines, utilities, and distribution systems real-time energy intelligence."},{"type":"list","items":["120+ electrical and utility measurement points in one dashboard","Energy transparency for machines, HVAC, compressors, and distribution","Visibility of energy losses and peak-demand drivers","Automated management, audit, and sustainability reporting","Scope 2 carbon-emission insight"]}]}'::jsonb,
    featured_image_url = '/uploads/M2.jpeg', updated_at = now()
WHERE slug = 'energy-monitoring-system-launch';

UPDATE news
SET title = 'Preventive Maintenance of Medium Voltage (MV) Switchgear',
    excerpt = 'Preventive maintenance improves MV switchgear reliability, safety, and operational life.',
    body = '{"blocks":[{"type":"heading","text":"Ensuring Reliability, Safety, and Asset Longevity"},{"type":"paragraph","text":"MV switchgear protects equipment and continuity of supply. Preventive maintenance detects potential issues early and supports optimal performance."},{"type":"list","items":["Improved system reliability","Enhanced safety for personnel and assets","Extended equipment lifespan through early fault detection"]}]}'::jsonb,
    featured_image_url = '/uploads/hero-project.jpg', updated_at = now()
WHERE slug = '20mw-substation-commissioning-east-java';

UPDATE news
SET title = 'Transformer Testing and Maintenance',
    excerpt = 'Transformer health assessments including winding-resistance testing and routine field diagnostics.',
    body = '{"blocks":[{"type":"heading","text":"Power Transformer Health Assessments"},{"type":"paragraph","text":"Winding-resistance testing supports manufacturing quality assurance, type testing, regular field maintenance, and detection of connection or tap-changer issues."}]}'::jsonb,
    featured_image_url = '/uploads/automation-project.jpg', updated_at = now()
WHERE slug = 'transformer-testing-maintenance';

UPDATE news
SET title = 'Effects of Harmonics – Resonance',
    excerpt = 'How harmonic currents and voltage distortion affect electrical distribution systems.',
    body = '{"blocks":[{"type":"heading","text":"Definition of Harmonic"},{"type":"paragraph","text":"Harmonics distort current and voltage away from sinusoidal waveforms. They are created by non-linear loads and can affect distribution-system performance."}]}'::jsonb,
    featured_image_url = NULL, updated_at = now()
WHERE slug = 'effects-of-harmonic-distortion';

UPDATE news
SET title = 'Partial Discharge Analyzer',
    excerpt = 'PD Scan for predictive maintenance of MV switchgear, transformers, and medium-voltage cable.',
    body = '{"blocks":[{"type":"paragraph","text":"Partial Discharge Analyzer or PD Scan supports online predictive maintenance of medium-voltage switchgear, transformers, and medium-voltage cable."}]}'::jsonb,
    featured_image_url = NULL, updated_at = now()
WHERE slug = 'partial-discharge-analyzer';

COMMIT;
