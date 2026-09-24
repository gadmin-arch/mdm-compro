-- 026_bilingual_services_seed.down.sql
-- Rollback bilingual services changes (restore English-only titles and summaries)

BEGIN;


UPDATE services SET
  title = 'Electrical Construction & Installation',
  summary = 'Turnkey medium & low voltage substation installation, switchgear, distribution panels, transformer erection, and cable terminations.',
  updated_at = now()
WHERE full_path = 'electrical-construction-installation' OR slug = 'electrical-construction-installation';

UPDATE services SET
  title = 'Substation & MV Switchgear Installation',
  summary = 'Medium voltage metal-clad switchgear, power transformers, oil containment, and civil-electrical integration up to 36kV.',
  updated_at = now()
WHERE full_path = 'electrical-construction-installation/substation-mv-switchgear-installation' OR slug = 'substation-mv-switchgear-installation';

UPDATE services SET
  title = 'LV Panels Assembly (MDP, SDP, ATS & Sync)',
  summary = 'Main Distribution Panels (MDP), Sub-Distribution Panels, ATS/AMF sync boards, and Motor Control Centers (MCC).',
  updated_at = now()
WHERE full_path = 'electrical-construction-installation/lv-distribution-panels-assembly' OR slug = 'lv-distribution-panels-assembly';

UPDATE services SET
  title = 'MV & LV Cable Installation & Termination',
  summary = 'Certified cable pulling, tray erection, heat-shrink/cold-shrink terminations, and high-potential (Hi-Pot) insulation testing.',
  updated_at = now()
WHERE full_path = 'electrical-construction-installation/mv-lv-cable-installation-termination' OR slug = 'mv-lv-cable-installation-termination';

UPDATE services SET
  title = 'Fire Alarm System Engineering & Installation',
  summary = 'Turnkey addressable fire alarm networks, multi-sensor detectors, aspirating smoke detection, and clean agent suppression.',
  updated_at = now()
WHERE full_path = 'electrical-construction-installation/fire-alarm-system-installation' OR slug = 'fire-alarm-system-installation';

UPDATE services SET
  title = 'Electrical Maintenance & Servicing',
  summary = 'Comprehensive preventive, predictive, and corrective maintenance for transformers, MV cubicles, switchboards, and circuit breakers.',
  updated_at = now()
WHERE full_path = 'electrical-maintenance-service' OR slug = 'electrical-maintenance-service';

UPDATE services SET
  title = 'Transformer Oil Treatment, BDV & DGA',
  summary = 'On-site oil purification, vacuum degassing, breakdown voltage (BDV) dielectric testing, and Dissolved Gas Analysis (DGA).',
  updated_at = now()
WHERE full_path = 'electrical-maintenance-service/transformer-oil-treatment-dga' OR slug = 'transformer-oil-treatment-dga';

UPDATE services SET
  title = 'MV Cubicle & ACB Maintenance (Trip Testing)',
  summary = 'Preventive servicing for medium voltage switchgear, contact resistance (Ductor), insulation testing, and ACB secondary injection.',
  updated_at = now()
WHERE full_path = 'electrical-maintenance-service/mv-cubicle-acb-maintenance' OR slug = 'mv-cubicle-acb-maintenance';

UPDATE services SET
  title = 'Infrared Thermography & Predictive Maintenance',
  summary = 'Non-contact FLIR thermal imaging to detect hot spots, loose busbar joints, overloaded phases, and deteriorating contacts under full load.',
  updated_at = now()
WHERE full_path = 'electrical-maintenance-service/thermography-predictive-maintenance' OR slug = 'thermography-predictive-maintenance';

UPDATE services SET
  title = 'Annual Maintenance Contracts (AMC) & 24/7 SLA',
  summary = 'Customized long-term service level agreements providing scheduled plant shutdowns, emergency call-outs, and spare parts management.',
  updated_at = now()
WHERE full_path = 'electrical-maintenance-service/annual-maintenance-contracts' OR slug = 'annual-maintenance-contracts';

UPDATE services SET
  title = 'Automation Solutions & Services',
  summary = 'Industrial automation, SCADA systems (xArrow & EcoStruxure), PLC programming, Energy Monitoring (PME), and process optimization.',
  updated_at = now()
WHERE full_path = 'automation-solutions-services' OR slug = 'automation-solutions-services';

UPDATE services SET
  title = 'SCADA Systems, HMI & Centralized Telemetry',
  summary = 'Plant-wide supervisory control, dynamic mimic screens, alarm logging, historical trending, and multi-protocol industrial telemetry.',
  updated_at = now()
WHERE full_path = 'automation-solutions-services/scada-hmi-process-monitoring' OR slug = 'scada-hmi-process-monitoring';

UPDATE services SET
  title = 'Energy Management Systems (EMS & ISO 50001)',
  summary = 'Real-time power monitoring, automated energy baselines, peak demand tracking, and ESG sustainability compliance reporting.',
  updated_at = now()
WHERE full_path = 'automation-solutions-services/energy-management-iso50001' OR slug = 'energy-management-iso50001';

UPDATE services SET
  title = 'PLC Programming & Variable Speed Drive (VSD) Integration',
  summary = 'Custom PLC logic engineering, control panel assembly, Altivar/Danfoss/ABB inverter tuning, and motion control.',
  updated_at = now()
WHERE full_path = 'automation-solutions-services/plc-vsd-system-integration' OR slug = 'plc-vsd-system-integration';

UPDATE services SET
  title = 'Inspection, Testing & Commissioning',
  summary = 'Specialized testing with calibrated instruments: power quality, partial discharge (PD scan), secondary injection, and relay coordination.',
  updated_at = now()
WHERE full_path = 'inspection-testing-commissioning' OR slug = 'inspection-testing-commissioning';

UPDATE services SET
  title = 'Power Quality Analysis & Harmonics Study',
  summary = 'Class A power quality logging, harmonic distortion (THD) auditing, voltage sags/swells, transient detection, and mitigation design.',
  updated_at = now()
WHERE full_path = 'inspection-testing-commissioning/power-quality-analysis-study' OR slug = 'power-quality-analysis-study';

UPDATE services SET
  title = 'Partial Discharge (PD) Scan & Insulation Diagnostics',
  summary = 'Non-invasive TEV (Transient Earth Voltage), acoustic ultrasonic, and HFCT sensors for live switchgear and cable PD scanning.',
  updated_at = now()
WHERE full_path = 'inspection-testing-commissioning/partial-discharge-pd-scan' OR slug = 'partial-discharge-pd-scan';

UPDATE services SET
  title = 'Protection Relay Testing (Secondary Injection)',
  summary = '3-phase & 6-phase secondary injection testing using Omicron CMC sets for overcurrent, differential, and distance relays.',
  updated_at = now()
WHERE full_path = 'inspection-testing-commissioning/relay-protection-testing-commissioning' OR slug = 'relay-protection-testing-commissioning';

UPDATE services SET
  title = 'Mechanical Services & General Supplies',
  summary = 'Industrial mechanical maintenance, conveyor systems, magnetic separators, high-speed doors, vacuum lifters, and motor/generator servicing.',
  updated_at = now()
WHERE full_path = 'mechanical-services-supplies' OR slug = 'mechanical-services-supplies';

UPDATE services SET
  title = 'Conveyor Systems, Magnetic Separators & Industrial Supplies',
  summary = 'Supply, installation, and servicing of conveyor lines, magnetic metal separators, sectional doors, and vacuum lifters.',
  updated_at = now()
WHERE full_path = 'mechanical-services-supplies/industrial-mechanical-supplies-services' OR slug = 'industrial-mechanical-supplies-services';

UPDATE services SET
  title = 'Motor & Generator Overhaul (Insulation Recoating & Dynamic Balancing)',
  summary = 'Electro-motor, MV motor, generator servicing, winding insulation recoating, vibration analysis, and rotor reconditioning.',
  updated_at = now()
WHERE full_path = 'mechanical-services-supplies/motor-generator-servicing-overhaul' OR slug = 'motor-generator-servicing-overhaul';

COMMIT;
