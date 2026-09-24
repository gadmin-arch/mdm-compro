-- 025_bilingual_products_seed.down.sql
-- Rollback bilingual products changes (restore English-only titles)

BEGIN;


UPDATE products SET
  title = 'Rittal Authorized Distributor',
  summary = 'Official Authorized Distributor for Rittal industrial enclosures, climate control & cooling, and power distribution systems.',
  updated_at = now()
WHERE full_path = 'rittal-distributor' OR slug = 'rittal-distributor';

UPDATE products SET
  title = 'Schneider Electric System Integrator',
  summary = 'Certified System Integrator & Solutions Partner delivering industrial automation, energy monitoring, and electrical distribution.',
  updated_at = now()
WHERE full_path = 'schneider-integrator' OR slug = 'schneider-integrator';

UPDATE products SET
  title = 'Electrical Distribution',
  summary = 'Medium & Low Voltage electrical distribution equipment, switchboards, transformers, and protection systems.',
  updated_at = now()
WHERE full_path = 'electrical-distribution' OR slug = 'electrical-distribution';

UPDATE products SET
  title = 'Automation & Control',
  summary = 'Industrial automation, PLC systems, SCADA / HMI process visualization, and motor drives.',
  updated_at = now()
WHERE full_path = 'automation-control' OR slug = 'automation-control';

UPDATE products SET
  title = 'Enclosure & Climate Control',
  summary = 'Industrial enclosures, server racks, climate control, and cooling systems for harsh manufacturing environments.',
  updated_at = now()
WHERE full_path = 'enclosure-climate-control' OR slug = 'enclosure-climate-control';

UPDATE products SET
  title = 'Power Quality',
  summary = 'Active harmonic filters, power factor correction, capacitor banks, and power quality analyzers.',
  updated_at = now()
WHERE full_path = 'power-quality' OR slug = 'power-quality';

UPDATE products SET
  title = 'Fire Alarm Products',
  summary = 'Industrial addressable fire alarm panels, detectors, notification appliances, and suppression solutions.',
  updated_at = now()
WHERE full_path = 'fire-alarm-products' OR slug = 'fire-alarm-products';

UPDATE products SET
  title = 'Rittal Enclosure Systems (VX25, AX, KX)',
  summary = 'Official Rittal bayed large enclosure system (VX25), compact enclosures (AX), small terminal boxes (KX), and outdoor IT server racks.',
  updated_at = now()
WHERE full_path = 'rittal-distributor/enclosures' OR slug = 'enclosures';

UPDATE products SET
  title = 'Rittal Climate Control & Cooling (Blue e+)',
  summary = 'Innovative hybrid cooling units, thermoelectric coolers, and air-to-water heat exchangers providing up to 75% energy savings and digital IoT monitoring.',
  updated_at = now()
WHERE full_path = 'rittal-distributor/climate-control-cooling' OR slug = 'climate-control-cooling';

UPDATE products SET
  title = 'Rittal Power Distribution (Ri4Power & RiLine)',
  summary = 'Type-tested low-voltage busbar and switchgear power distribution systems up to 6300A compliant with IEC 61439-1/-2.',
  updated_at = now()
WHERE full_path = 'rittal-distributor/power-distribution' OR slug = 'power-distribution';

UPDATE products SET
  title = 'Schneider Industrial Automation (Modicon & EcoStruxure)',
  summary = 'Complete PLC/PAC automation systems featuring Schneider Modicon M340, M580 ePAC, Magelis HMI, and EcoStruxure Plant architecture.',
  updated_at = now()
WHERE full_path = 'schneider-integrator/industrial-automation' OR slug = 'industrial-automation';

UPDATE products SET
  title = 'Power & Energy Monitoring (PME & PowerLogic)',
  summary = 'Schneider PowerLogic digital power meters, ION meters, and EcoStruxure Power Monitoring Expert (PME) software.',
  updated_at = now()
WHERE full_path = 'schneider-integrator/power-energy-monitoring' OR slug = 'power-energy-monitoring';

UPDATE products SET
  title = 'Electrical Distribution Integration (MasterPact & Prisma)',
  summary = 'MasterPact MTZ/NW air circuit breakers, Compact NSX molded case breakers, and Prisma type-tested switchboard integration.',
  updated_at = now()
WHERE full_path = 'schneider-integrator/electrical-distribution-integration' OR slug = 'electrical-distribution-integration';

UPDATE products SET
  title = 'Schneider Engineering, FAT/SAT & Commissioning Support',
  summary = 'Schneider factory acceptance testing (FAT), site acceptance testing (SAT), relay protection coordination, and energized commissioning.',
  updated_at = now()
WHERE full_path = 'schneider-integrator/engineering-commissioning' OR slug = 'engineering-commissioning';

UPDATE products SET
  title = 'Medium Voltage Substation & Transformers',
  summary = 'MV Metal-Clad Switchgear up to 24kV/36kV, Oil-Immersed & Cast Resin Dry-Type Transformers, and Vacuum Circuit Breakers.',
  updated_at = now()
WHERE full_path = 'electrical-distribution/medium-voltage-substation' OR slug = 'medium-voltage-substation';

UPDATE products SET
  title = 'Low Voltage Panels (MDP, SDP, ATS & Sync)',
  summary = 'Main Distribution Panels (MDP), Sub-Distribution Panels (SDP), ATS/AMF Generator Sync Panels, and Motor Control Centers (MCC).',
  updated_at = now()
WHERE full_path = 'electrical-distribution/low-voltage-distribution-panels' OR slug = 'low-voltage-distribution-panels';

UPDATE products SET
  title = 'SCADA Systems & Process Monitoring (xArrow)',
  summary = 'High-performance SCADA software, real-time telemetry, alarm management, historical trending, and industrial IoT dashboards.',
  updated_at = now()
WHERE full_path = 'automation-control/scada-xarrow-telemetry' OR slug = 'scada-xarrow-telemetry';

UPDATE products SET
  title = 'Variable Speed Drive (VSD) & Inverter Panels',
  summary = 'Custom engineered VSD and soft starter panels for pumps, compressors, blowers, extruders, and conveying machinery.',
  updated_at = now()
WHERE full_path = 'automation-control/vsd-inverter-panels' OR slug = 'vsd-inverter-panels';

UPDATE products SET
  title = 'Active Harmonic Filters (AHF) & SVG',
  summary = 'Dynamic active harmonic compensation up to the 50th harmonic order with stepless reactive power factor correction.',
  updated_at = now()
WHERE full_path = 'power-quality/active-harmonic-filters' OR slug = 'active-harmonic-filters';

UPDATE products SET
  title = 'Addressable Fire Alarm Panels & Detectors',
  summary = 'Intelligent addressable fire alarm control panels, multi-criteria optical smoke & heat detectors, and suppression triggers.',
  updated_at = now()
WHERE full_path = 'fire-alarm-products/addressable-fire-alarm-systems' OR slug = 'addressable-fire-alarm-systems';

COMMIT;
