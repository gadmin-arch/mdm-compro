-- 022_bilingual_services_products_seed.down.sql
-- Revert services and products back to mono-lingual English

BEGIN;

-- 1. REVERT SERVICES
UPDATE services SET
  title = 'Electrical Construction & Installation',
  summary = 'Turnkey medium & low voltage substation installation, switchgear, distribution panels, transformer erection, and cable terminations.'
WHERE slug = 'electrical-construction-installation';

UPDATE services SET
  title = 'Substation & Transformer Installation',
  summary = 'Turnkey construction of medium voltage (up to 36kV) outdoor/indoor substations, transformer placement, oil filtration, and busduct installation.'
WHERE slug = 'substation-transformer-installation' OR slug = 'substation-mv-switchgear-installation';

UPDATE services SET
  title = 'MV & LV Switchboard Panel Assembly',
  summary = 'Fabrication and integration of Medium Voltage cubicles, Main Distribution Panels (MDP), Sub-Distribution Panels (SDP), and MCC.'
WHERE slug = 'mv-lv-switchboard-assembly' OR slug = 'lv-distribution-panels-assembly';

UPDATE services SET
  title = 'MV & LV Cable Installation & Termination',
  summary = 'Certified cable pulling, tray erection, heat-shrink/cold-shrink terminations, and high-potential (Hi-Pot) insulation testing.'
WHERE slug = 'cable-pulling-termination' OR slug = 'mv-lv-cable-installation-termination';

UPDATE services SET
  title = 'Grounding & Lightning Protection System',
  summary = 'Deep well grounding installation, exothermic CAD welding, copper tape routing, and early streamer emission (ESE) lightning protection.'
WHERE slug = 'grounding-lightning-protection';

UPDATE services SET
  title = 'Busduct & Canalis Trunking Installation',
  summary = 'High-amperage sandwich busduct feeder erection, tap-off unit installation, and torque-checked jointing for industrial plants.'
WHERE slug = 'busduct-canalis-installation';

UPDATE services SET
  title = 'Electrical Maintenance & Servicing',
  summary = 'Comprehensive preventive, predictive, and corrective maintenance for transformers, MV cubicles, switchboards, and circuit breakers.'
WHERE slug = 'electrical-maintenance-service';

UPDATE services SET
  title = 'Transformer Maintenance & Oil Purification',
  summary = 'On-site transformer oil purification, vacuum dehydration, BDV breakdown testing, DGA gas analysis, and silica gel replacement.'
WHERE slug = 'transformer-maintenance-purification' OR slug = 'transformer-oil-treatment-dga';

UPDATE services SET
  title = 'MV Cubicle & Switchgear Servicing',
  summary = 'Mechanism lubrication, contact resistance (Ductor), vacuum bottle integrity, and secondary protection relay testing.'
WHERE slug = 'mv-cubicle-switchgear-servicing' OR slug = 'mv-cubicle-acb-maintenance';

UPDATE services SET
  title = 'Annual Plant Shutdown Maintenance',
  summary = 'Total electrical system overhaul during planned facility shutdowns: busbar torque checks, insulation resistance, and contact cleaning.'
WHERE slug = 'annual-shutdown-maintenance' OR slug = 'annual-maintenance-contracts';

UPDATE services SET
  title = 'Low Voltage Switchboard Maintenance',
  summary = 'ACB/MCCB servicing, cradle mechanism testing, thermal scanning, and digital trip unit secondary injection calibration.'
WHERE slug = 'low-voltage-switchboard-maintenance';

UPDATE services SET
  title = 'Industrial UPS & Battery Bank Maintenance',
  summary = 'Impedance testing, conductance measurement, cell equalization, and autonomy discharge runtime testing for critical power UPS.'
WHERE slug = 'ups-battery-bank-maintenance';

UPDATE services SET
  title = 'Automation Solutions & Services',
  summary = 'Industrial automation, SCADA systems (xArrow & EcoStruxure), PLC programming, Energy Monitoring (PME), and process optimization.'
WHERE slug = 'automation-solutions-services';

UPDATE services SET
  title = 'SCADA & Industrial Process Automation',
  summary = 'High-performance HMI/SCADA design, telemetry, alarm management, historical trending, and batch control integration.'
WHERE slug = 'scada-process-automation' OR slug = 'scada-hmi-process-monitoring';

UPDATE services SET
  title = 'PLC & Distributed Control Systems (DCS)',
  summary = 'Architecture design, logic programming, and commissioning for Schneider Modicon, Siemens S7, Rockwell, and Omron.'
WHERE slug = 'plc-dcs-programming' OR slug = 'plc-vsd-system-integration';

UPDATE services SET
  title = 'Power Management System (Schneider PME)',
  summary = 'Real-time energy baseline tracking, power quality event capture, peak demand shaving, and ISO 50001 compliance dashboards.'
WHERE slug = 'power-management-system-pme' OR slug = 'energy-management-iso50001';

UPDATE services SET
  title = 'Building Automation & HVAC Control (BAS)',
  summary = 'Centralized HVAC chiller plant optimization, AHU VAV control, lighting automation, and Modbus/BACnet integration.'
WHERE slug = 'building-automation-system-bas';

UPDATE services SET
  title = 'Variable Speed Drive (VFD) Solutions',
  summary = 'Energy-saving variable torque pump/fan control, harmonic mitigation, dynamic braking, and drive panel engineering.'
WHERE slug = 'variable-speed-drive-vfd-solutions';

UPDATE services SET
  title = 'Inspection, Testing & Commissioning',
  summary = 'Specialized testing with calibrated instruments: power quality, partial discharge (PD scan), secondary injection, and relay coordination.'
WHERE slug = 'inspection-testing-commissioning';

UPDATE services SET
  title = 'Relay Protection Calibration & Coordination',
  summary = 'Secondary injection testing (Omicron CMC), relay tripping curves, overcurrent, earth fault, differential, and distance protection.'
WHERE slug = 'relay-protection-calibration' OR slug = 'relay-protection-testing-commissioning';

UPDATE services SET
  title = 'Transformer Oil BDV & DGA Laboratory Testing',
  summary = 'Dielectric breakdown voltage testing (IEC 60156), Karl Fischer moisture analysis, and Dissolved Gas Analysis (DGA).'
WHERE slug = 'transformer-oil-bdv-dga-testing';

UPDATE services SET
  title = 'Infrared Thermography Electrical Audit',
  summary = 'Calibrated FLIR thermal imaging to locate high-resistance contact joints, loose terminal bolts, and unbalanced line loading.'
WHERE slug = 'infrared-thermography-inspection' OR slug = 'thermography-predictive-maintenance';

UPDATE services SET
  title = 'Hi-Pot & Insulation Resistance Diagnostics',
  summary = 'VLF 0.1Hz AC / DC High-Potential testing up to 80kV, polarization index (PI), and dielectric absorption ratio (DAR).'
WHERE slug = 'hi-pot-insulation-resistance-test';

UPDATE services SET
  title = 'Breaker Timing & Contact Resistance (Ductor)',
  summary = 'Micro-ohm contact resistance measurement, breaker opening/closing speed, pole synchronization, and auxiliary contact check.'
WHERE slug = 'breaker-timing-contact-resistance';

UPDATE services SET
  title = 'Mechanical Services & Supplies',
  summary = 'Industrial piping, chiller plant installation, pump overhaul, dynamic balancing, and air handling equipment.'
WHERE slug = 'mechanical-services-supplies';

UPDATE services SET
  title = 'Chiller Plant & HVAC Mechanical Piping',
  summary = 'Chilled water headers, condenser loops, pump skids, balancing valves, and polyurethane insulation cladding.'
WHERE slug = 'chiller-hvac-mechanical-piping';

UPDATE services SET
  title = 'Industrial Pump & Valve Overhaul',
  summary = 'Impeller balancing, mechanical seal replacement, laser shaft alignment, and hydro-static pressure testing.'
WHERE slug = 'pump-valve-overhaul-alignment';

UPDATE services SET
  title = 'Compressed Air Ring Main Installation',
  summary = 'Aluminum / stainless steel compressed air distribution loops, receiver tank placement, air dryers, and filtration manifolds.'
WHERE slug = 'air-compressor-piping-installation';

UPDATE services SET
  title = 'Fire Protection Sprinkler & Hydrant System',
  summary = 'Fire pump room installation (NFPA 20), wet pipe sprinkler grids, outdoor pillar hydrants, and Siamese connections.'
WHERE slug = 'fire-protection-sprinkler-hydrant' OR slug = 'fire-alarm-system-installation';

UPDATE services SET
  title = 'Industrial Ventilation & Exhaust Ductwork',
  summary = 'Centrifugal exhaust blowers, spiral galvanized ducting, kitchen hood hoods, and hazardous fume extraction.'
WHERE slug = 'exhaust-ventilation-ductwork';

-- 2. REVERT PRODUCTS
UPDATE products SET
  title = 'Rittal Authorized Distributor',
  summary = 'Official Authorized Distributor for Rittal industrial enclosures, climate control & cooling, power distribution, and IT infrastructure systems.'
WHERE slug = 'rittal-distributor';

UPDATE products SET
  title = 'Rittal Enclosure Systems (VX25, AX, KX)',
  summary = 'Official Rittal bayed large enclosure system (VX25), compact enclosures (AX), small terminal boxes (KX), and outdoor IT server racks.'
WHERE slug = 'enclosures';

UPDATE products SET
  title = 'Rittal Climate Control & Cooling (Blue e+)',
  summary = 'Innovative hybrid cooling units, thermoelectric coolers, and air-to-water heat exchangers providing up to 75% energy savings and digital IoT monitoring.'
WHERE slug = 'climate-control-cooling';

UPDATE products SET
  title = 'Rittal Power Distribution (Ri4Power & RiLine)',
  summary = 'Type-tested low-voltage busbar and switchgear power distribution systems up to 6300A compliant with IEC 61439-1/-2.'
WHERE slug = 'power-distribution';

UPDATE products SET
  title = 'Schneider Electric System Integrator',
  summary = 'Certified System Integrator & Solutions Partner delivering industrial automation, energy monitoring, and electrical distribution.'
WHERE slug = 'schneider-integrator';

UPDATE products SET
  title = 'Schneider Industrial Automation (Modicon & EcoStruxure)',
  summary = 'Complete PLC/PAC automation systems featuring Schneider Modicon M340, M580 ePAC, Magelis HMI, and EcoStruxure Plant architecture.'
WHERE slug = 'industrial-automation';

UPDATE products SET
  title = 'Power & Energy Monitoring (PME & PowerLogic)',
  summary = 'Schneider PowerLogic digital power meters, ION meters, and EcoStruxure Power Monitoring Expert (PME) software.'
WHERE slug = 'power-energy-monitoring';

UPDATE products SET
  title = 'Electrical Distribution Integration (MasterPact & Prisma)',
  summary = 'MasterPact MTZ/NW air circuit breakers, Compact NSX molded case breakers, and Prisma type-tested switchboard integration.'
WHERE slug = 'electrical-distribution-integration';

UPDATE products SET
  title = 'Schneider Engineering, FAT/SAT & Commissioning Support',
  summary = 'Schneider factory acceptance testing (FAT), site acceptance testing (SAT), relay protection coordination, and energized commissioning.'
WHERE slug = 'engineering-commissioning';

UPDATE products SET
  title = 'Electrical Distribution',
  summary = 'Medium & Low Voltage electrical distribution equipment, switchboards, transformers, and protection systems.'
WHERE slug = 'electrical-distribution';

UPDATE products SET
  title = 'Automation & Control',
  summary = 'Industrial automation, PLC systems, SCADA / HMI process visualization, and motor drives.'
WHERE slug = 'automation-control';

UPDATE products SET
  title = 'Enclosure & Climate Control',
  summary = 'Industrial enclosures, server racks, climate control, and cooling systems for harsh manufacturing environments.'
WHERE slug = 'enclosure-climate-control';

UPDATE products SET
  title = 'Power Quality',
  summary = 'Active harmonic filters, power factor correction, capacitor banks, and power quality analyzers.'
WHERE slug = 'power-quality';

COMMIT;
