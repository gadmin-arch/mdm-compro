-- 019_services_and_solutions_2026.up.sql
-- Synchronize Services hierarchy with official 2026 Company Profile:
-- 1. Electrical Construction & Installation
-- 2. Electrical Maintenance & Servicing
-- 3. Automation Solutions & Services
-- 4. Inspection, Testing & Commissioning
-- 5. Mechanical Services & Supplies

BEGIN;

-- Clean existing services to rebuild clean, standardized hierarchy
DELETE FROM services WHERE id IS NOT NULL;

-- Root Services (Depth 0)
INSERT INTO services (id, slug, full_path, title, summary, content, image_url, gallery, status, published_at, sort_order, depth) VALUES
(
    '00000000-0000-0000-0000-000000000801',
    'electrical-construction-installation',
    'electrical-construction-installation',
    'Electrical Construction & Installation',
    'Turnkey medium & low voltage substation installation, switchgear, distribution panels, transformer erection, and cable terminations.',
    '{"blocks":[{"type":"paragraph","data":{"text":"End-to-end electrical construction and installation services for manufacturing plants, substations, and industrial infrastructure. Our certified engineers deliver precision panel assembly, busbar erection, MV/LV cabling, and transformer installation adhering to SPLN and IEC standards."}}]}',
    '/uploads/hero-project.jpg',
    '[]',
    'published',
    now(),
    1,
    0
),
(
    '00000000-0000-0000-0000-000000000802',
    'electrical-maintenance-service',
    'electrical-maintenance-service',
    'Electrical Maintenance & Servicing',
    'Comprehensive preventive, predictive, and corrective maintenance for transformers, MV cubicles, switchboards, and circuit breakers.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Proactive lifecycle maintenance programs designed to prevent unexpected plant downtime. Scope includes transformer oil treatment (BDV & DGA), MV cubicle servicing, ACB trip testing, contact resistance, and thermal imaging diagnostics."}}]}',
    '/uploads/testing-commissioning-project.jpg',
    '[]',
    'published',
    now(),
    2,
    0
),
(
    '00000000-0000-0000-0000-000000000803',
    'automation-solutions-services',
    'automation-solutions-services',
    'Automation Solutions & Services',
    'Industrial automation, SCADA systems (xArrow & EcoStruxure), PLC programming, Energy Monitoring (PME), and process optimization.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Turnkey industrial automation engineering combining PLC programming, SCADA telemetry, centralized process monitoring, Building Automation Systems (BAS), and ISO 50001 energy management architectures."}}]}',
    '/uploads/M2.jpeg',
    '[]',
    'published',
    now(),
    3,
    0
),
(
    '00000000-0000-0000-0000-000000000804',
    'inspection-testing-commissioning',
    'inspection-testing-commissioning',
    'Inspection, Testing & Commissioning',
    'Specialized testing with calibrated instruments: power quality, partial discharge (PD scan), secondary injection, and relay coordination.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Advanced testing and commissioning backed by calibrated Omicron, Megger, and Fluke test sets. We conduct Power System Studies, Arc Flash analysis, Partial Discharge scanning, relay injection testing, and formal FAT/SAT."}}]}',
    '/uploads/automation-project.jpg',
    '[]',
    'published',
    now(),
    4,
    0
),
(
    '00000000-0000-0000-0000-000000000805',
    'mechanical-services-supplies',
    'mechanical-services-supplies',
    'Mechanical Services & General Supplies',
    'Industrial mechanical maintenance, conveyor systems, magnetic separators, high-speed doors, vacuum lifters, and motor/generator servicing.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Total mechanical engineering support covering conveyor systems, magnetic separators, gearbox & mixer overhauls, boiler HTO maintenance, pneumatic supplies, motor winding insulation recoating, and rotor dynamic balancing."}}]}',
    '/uploads/news-1.jpg',
    '[]',
    'published',
    now(),
    5,
    0
);

-- Child Services (Depth 1) - Under Electrical Construction & Installation
INSERT INTO services (id, parent_id, slug, full_path, title, summary, content, image_url, gallery, status, published_at, sort_order, depth) VALUES
(
    '00000000-0000-0000-0000-000000000811',
    '00000000-0000-0000-0000-000000000801',
    'substation-mv-switchgear-installation',
    'electrical-construction-installation/substation-mv-switchgear-installation',
    'Substation & MV Switchgear Installation',
    'Medium voltage metal-clad switchgear, power transformers, oil containment, and civil-electrical integration up to 36kV.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Complete engineering, procurement, and construction for medium voltage substations, including vacuum circuit breakers, protection panels, and transformer placement."}}]}',
    '/uploads/hero-project.jpg',
    '[]',
    'published',
    now(),
    1,
    1
),
(
    '00000000-0000-0000-0000-000000000812',
    '00000000-0000-0000-0000-000000000801',
    'lv-distribution-panels-assembly',
    'electrical-construction-installation/lv-distribution-panels-assembly',
    'LV Panels Assembly (MDP, SDP, ATS & Sync)',
    'Main Distribution Panels (MDP), Sub-Distribution Panels, ATS/AMF sync boards, and Motor Control Centers (MCC).',
    '{"blocks":[{"type":"paragraph","data":{"text":"Custom panel design and fabrication using high-purity copper busbars, type-tested enclosure structures, and intelligent circuit breakers."}}]}',
    '/uploads/testing-commissioning-project.jpg',
    '[]',
    'published',
    now(),
    2,
    1
),
(
    '00000000-0000-0000-0000-000000000813',
    '00000000-0000-0000-0000-000000000801',
    'mv-lv-cable-installation-termination',
    'electrical-construction-installation/mv-lv-cable-installation-termination',
    'MV & LV Cable Installation & Termination',
    'Certified cable pulling, tray erection, heat-shrink/cold-shrink terminations, and high-potential (Hi-Pot) insulation testing.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Certified cable jointing and termination specialists using 3M and Raychem kits, followed by VLF / DC Hi-Pot and sheath integrity testing."}}]}',
    '/uploads/products-rittal.jpg',
    '[]',
    'published',
    now(),
    3,
    1
),
(
    '00000000-0000-0000-0000-000000000814',
    '00000000-0000-0000-0000-000000000801',
    'fire-alarm-system-installation',
    'electrical-construction-installation/fire-alarm-system-installation',
    'Fire Alarm System Engineering & Installation',
    'Turnkey addressable fire alarm networks, multi-sensor detectors, aspirating smoke detection, and clean agent suppression.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Complete fire safety engineering compliant with NFPA 72 & NFPA 2001 standards, including smoke control, audible/visual alarms, and BMS integration."}}]}',
    '/uploads/testing-commissioning-project.jpg',
    '[]',
    'published',
    now(),
    4,
    1
);

-- Child Services (Depth 1) - Under Electrical Maintenance & Servicing
INSERT INTO services (id, parent_id, slug, full_path, title, summary, content, image_url, gallery, status, published_at, sort_order, depth) VALUES
(
    '00000000-0000-0000-0000-000000000821',
    '00000000-0000-0000-0000-000000000802',
    'transformer-oil-treatment-dga',
    'electrical-maintenance-service/transformer-oil-treatment-dga',
    'Transformer Oil Treatment, BDV & DGA',
    'On-site oil purification, vacuum degassing, breakdown voltage (BDV) dielectric testing, and Dissolved Gas Analysis (DGA).',
    '{"blocks":[{"type":"paragraph","data":{"text":"High-vacuum oil filtration and regeneration restoring insulation properties, removing moisture, gas, and particulate contamination to extend transformer life."}}]}',
    '/uploads/news-1.jpg',
    '[]',
    'published',
    now(),
    1,
    1
),
(
    '00000000-0000-0000-0000-000000000822',
    '00000000-0000-0000-0000-000000000802',
    'mv-cubicle-acb-maintenance',
    'electrical-maintenance-service/mv-cubicle-acb-maintenance',
    'MV Cubicle & ACB Maintenance (Trip Testing)',
    'Preventive servicing for medium voltage switchgear, contact resistance (Ductor), insulation testing, and ACB secondary injection.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Systematic overhaul including contact alignment, lubrication, vacuum bottle integrity tests, breaker timing analysis, and secondary injection testing on Micrologic and digital trip units."}}]}',
    '/uploads/hero-project.jpg',
    '[]',
    'published',
    now(),
    2,
    1
),
(
    '00000000-0000-0000-0000-000000000823',
    '00000000-0000-0000-0000-000000000802',
    'thermography-predictive-maintenance',
    'electrical-maintenance-service/thermography-predictive-maintenance',
    'Infrared Thermography & Predictive Maintenance',
    'Non-contact FLIR thermal imaging to detect hot spots, loose busbar joints, overloaded phases, and deteriorating contacts under full load.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Certified Level II thermographers inspect live electrical distribution boards to detect thermal anomalies before insulation breakdown or catastrophic flashovers occur."}}]}',
    '/uploads/automation-project.jpg',
    '[]',
    'published',
    now(),
    3,
    1
),
(
    '00000000-0000-0000-0000-000000000824',
    '00000000-0000-0000-0000-000000000802',
    'annual-maintenance-contracts',
    'electrical-maintenance-service/annual-maintenance-contracts',
    'Annual Maintenance Contracts (AMC) & 24/7 SLA',
    'Customized long-term service level agreements providing scheduled plant shutdowns, emergency call-outs, and spare parts management.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Comprehensive maintenance contracts tailored to manufacturing plants and critical facilities, guaranteeing rapid SLA response times and dedicated engineering support."}}]}',
    '/uploads/testing-commissioning-project.jpg',
    '[]',
    'published',
    now(),
    4,
    1
);

-- Child Services (Depth 1) - Under Automation Solutions & Services
INSERT INTO services (id, parent_id, slug, full_path, title, summary, content, image_url, gallery, status, published_at, sort_order, depth) VALUES
(
    '00000000-0000-0000-0000-000000000831',
    '00000000-0000-0000-0000-000000000803',
    'scada-hmi-process-monitoring',
    'automation-solutions-services/scada-hmi-process-monitoring',
    'SCADA Systems, HMI & Centralized Telemetry',
    'Plant-wide supervisory control, dynamic mimic screens, alarm logging, historical trending, and multi-protocol industrial telemetry.',
    '{"blocks":[{"type":"paragraph","data":{"text":"End-to-end SCADA development using xArrow, EcoStruxure, Wonderware, and WinCC platforms for real-time visualization and supervisory control of manufacturing plants."}}]}',
    '/uploads/M2.jpeg',
    '[]',
    'published',
    now(),
    1,
    1
),
(
    '00000000-0000-0000-0000-000000000832',
    '00000000-0000-0000-0000-000000000803',
    'energy-management-iso50001',
    'automation-solutions-services/energy-management-iso50001',
    'Energy Management Systems (EMS & ISO 50001)',
    'Real-time power monitoring, automated energy baselines, peak demand tracking, and ESG sustainability compliance reporting.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Power Monitoring Expert (PME) implementation delivering actionable energy insights, cost-center allocation, harmonic tracking, and automated ISO 50001 reporting."}}]}',
    '/uploads/news-1.jpg',
    '[]',
    'published',
    now(),
    2,
    1
),
(
    '00000000-0000-0000-0000-000000000833',
    '00000000-0000-0000-0000-000000000803',
    'plc-vsd-system-integration',
    'automation-solutions-services/plc-vsd-system-integration',
    'PLC Programming & Variable Speed Drive (VSD) Integration',
    'Custom PLC logic engineering, control panel assembly, Altivar/Danfoss/ABB inverter tuning, and motion control.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Comprehensive automation integration covering Modicon, Siemens S7, and Allen-Bradley PLCs paired with variable speed drives for pumps, fans, conveyors, and extruders."}}]}',
    '/uploads/automation-project.jpg',
    '[]',
    'published',
    now(),
    3,
    1
);

-- Child Services (Depth 1) - Under Inspection, Testing & Commissioning
INSERT INTO services (id, parent_id, slug, full_path, title, summary, content, image_url, gallery, status, published_at, sort_order, depth) VALUES
(
    '00000000-0000-0000-0000-000000000841',
    '00000000-0000-0000-0000-000000000804',
    'power-quality-analysis-study',
    'inspection-testing-commissioning/power-quality-analysis-study',
    'Power Quality Analysis & Harmonics Study',
    'Class A power quality logging, harmonic distortion (THD) auditing, voltage sags/swells, transient detection, and mitigation design.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Detailed electrical audits using Fluke 435-II Class A analyzers to measure IEEE 519 compliance, identify resonance risks, and engineer Active Harmonic Filter solutions."}}]}',
    '/uploads/news-1.jpg',
    '[]',
    'published',
    now(),
    1,
    1
),
(
    '00000000-0000-0000-0000-000000000842',
    '00000000-0000-0000-0000-000000000804',
    'partial-discharge-pd-scan',
    'inspection-testing-commissioning/partial-discharge-pd-scan',
    'Partial Discharge (PD) Scan & Insulation Diagnostics',
    'Non-invasive TEV (Transient Earth Voltage), acoustic ultrasonic, and HFCT sensors for live switchgear and cable PD scanning.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Early detection of electrical insulation breakdown in MV switchgear, cables, and transformers without requiring system shutdown."}}]}',
    '/uploads/hero-project.jpg',
    '[]',
    'published',
    now(),
    2,
    1
),
(
    '00000000-0000-0000-0000-000000000843',
    '00000000-0000-0000-0000-000000000804',
    'relay-protection-testing-commissioning',
    'inspection-testing-commissioning/relay-protection-testing-commissioning',
    'Protection Relay Testing (Secondary Injection)',
    '3-phase & 6-phase secondary injection testing using Omicron CMC 356/256 sets for overcurrent, earth fault, differential, and distance relays.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Comprehensive protection coordination verification, timing curves check, and scheme testing compliant with IEC 60255 and IEEE standards."}}]}',
    '/uploads/testing-commissioning-project.jpg',
    '[]',
    'published',
    now(),
    3,
    1
);

-- Child Services (Depth 1) - Under Mechanical Services & Supplies
INSERT INTO services (id, parent_id, slug, full_path, title, summary, content, image_url, gallery, status, published_at, sort_order, depth) VALUES
(
    '00000000-0000-0000-0000-000000000851',
    '00000000-0000-0000-0000-000000000805',
    'industrial-mechanical-supplies-services',
    'mechanical-services-supplies/industrial-mechanical-supplies-services',
    'Conveyor Systems, Magnetic Separators & Industrial Supplies',
    'Supply, installation, and servicing of conveyor lines, magnetic metal separators, sectional doors, vacuum lifters, and pneumatic parts.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Industrial mechanical equipment supplies and maintenance services ensuring seamless plant material handling and operational throughput."}}]}',
    '/uploads/products-rittal.jpg',
    '[]',
    'published',
    now(),
    1,
    1
),
(
    '00000000-0000-0000-0000-000000000852',
    '00000000-0000-0000-0000-000000000805',
    'motor-generator-servicing-overhaul',
    'mechanical-services-supplies/motor-generator-servicing-overhaul',
    'Motor & Generator Overhaul (Insulation Recoating & Dynamic Balancing)',
    'Electro-motor, MV motor, generator servicing, winding insulation recoating, vibration analysis, and rotor reconditioning.',
    '{"blocks":[{"type":"paragraph","data":{"text":"Comprehensive motor and generator maintenance including visual inspection, vibration baseline, winding recoating, and dynamic rotor balancing."}}]}',
    '/uploads/automation-project.jpg',
    '[]',
    'published',
    now(),
    2,
    1
);

COMMIT;
