BEGIN;

-- 1. Fix Career Deadlines
-- Since the current year is 2026, setting the deadline to 2025 ensures they appear closed.
UPDATE careers 
SET deadline = '2025-12-31T23:59:59Z',
    published_at = '2023-01-15T00:00:00Z'
WHERE slug = 'electrical-team-leader';

UPDATE careers 
SET deadline = '2025-12-31T23:59:59Z',
    published_at = '2023-01-15T00:00:00Z'
WHERE slug = 'electrical-operator';

UPDATE careers 
SET deadline = '2025-12-31T23:59:59Z',
    published_at = '2023-02-10T00:00:00Z'
WHERE slug = 'automation-engineer-plc-scada';

UPDATE careers 
SET deadline = '2025-12-31T23:59:59Z',
    published_at = '2023-03-05T00:00:00Z'
WHERE slug = 'fire-alarm-technician';

UPDATE careers 
SET deadline = '2025-12-31T23:59:59Z',
    published_at = '2023-03-15T00:00:00Z'
WHERE slug = 'site-manager';

UPDATE careers 
SET deadline = '2025-12-31T23:59:59Z',
    published_at = '2023-01-15T00:00:00Z'
WHERE slug = 'senior-electrical-engineer';

-- 2. Fix News Dates
UPDATE news 
SET published_at = '2020-05-12T00:00:00Z' 
WHERE slug = 'effects-of-harmonic-distortion';

UPDATE news 
SET published_at = '2020-07-08T00:00:00Z' 
WHERE slug = 'partial-discharge-analyzer';

UPDATE news 
SET published_at = '2020-09-15T00:00:00Z' 
WHERE slug = 'centralized-fire-alarm-monitoring';

-- 3. Synchronize Services Details
UPDATE services
SET summary = 'Comprehensive electrical design, installation, and commissioning for industrial facilities.',
    content = '{"blocks": [{"type": "paragraph", "data": {"text": "PT Multi Daya Mitra provides complete electrical engineering services covering MV/LV distribution systems, protection relay coordination, and power quality analysis. We handle greenfield installations and brownfield upgrades."}}, {"type": "list", "data": {"style": "unordered", "items": ["MV & LV Switchgear Installation", "Transformer Testing & Commissioning", "Power Quality Analysis", "Protection Relay Calibration"]}}]}'
WHERE slug = 'electrical-engineering';

UPDATE services
SET summary = 'Advanced PLC, HMI, and SCADA control system development and integration.',
    content = '{"blocks": [{"type": "paragraph", "data": {"text": "We deliver robust industrial automation solutions designed to optimize plant operations, improve reliability, and minimize downtime. Our engineers are certified in multiple platforms including Schneider Electric, Siemens, and Allen Bradley."}}, {"type": "list", "data": {"style": "unordered", "items": ["PLC & RTU Programming", "SCADA / HMI Development", "Industrial Network Integration", "Drive & Motor Control Center"]}}]}'
WHERE slug = 'automation';

UPDATE services
SET summary = 'Preventive and corrective maintenance programs for critical electrical assets.',
    content = '{"blocks": [{"type": "paragraph", "data": {"text": "Our maintenance services ensure maximum uptime for your critical infrastructure. We provide routine inspections, corrective actions, and condition-based monitoring to prevent catastrophic failures."}}, {"type": "list", "data": {"style": "unordered", "items": ["Thermography Inspections", "Switchgear Cleaning & Torquing", "Transformer Oil Purification", "Battery Bank Testing"]}}]}'
WHERE slug = 'maintenance';

UPDATE services
SET summary = 'Design, supply, and maintenance of addressable and conventional fire alarm systems.',
    content = '{"blocks": [{"type": "paragraph", "data": {"text": "Protect your assets with our comprehensive fire alarm services. We offer everything from conceptual design to installation and statutory maintenance of fire detection systems in industrial and commercial environments."}}, {"type": "list", "data": {"style": "unordered", "items": ["System Design & Engineering", "Installation & Commissioning", "Integration with HVAC & Access Control", "Routine Maintenance & Certification"]}}]}'
WHERE slug = 'fire-alarm';

UPDATE services
SET summary = 'Advanced diagnostic tools and measurement services for electrical assets.',
    content = '{"blocks": [{"type": "paragraph", "data": {"text": "We utilize state-of-the-art testing equipment to provide precise measurements and diagnostics. Our condition monitoring services help identify potential faults before they escalate into costly outages."}}, {"type": "list", "data": {"style": "unordered", "items": ["Partial Discharge (PD) Measurement", "Contact Resistance Testing", "Insulation Resistance & HI-POT", "Earth Resistance Measurement"]}}]}'
WHERE slug = 'testing-measurement';

-- 4. Synchronize Products Details
UPDATE products
SET summary = 'Precision testing instruments for electrical substations and industrial networks.',
    content = '{"blocks": [{"type": "paragraph", "data": {"text": "We supply a wide range of electrical testing equipment from global leading manufacturers. Our portfolio includes specialized tools for relay testing, transformer diagnostics, and power quality analysis."}}]}'
WHERE slug = 'testing-equipment';

UPDATE products
SET summary = 'Reliable digital protection relays for MV and LV electrical distribution.',
    content = '{"blocks": [{"type": "paragraph", "data": {"text": "Our selection of protection relays ensures the safety and stability of your electrical network. We offer products suitable for feeder, motor, transformer, and generator protection applications."}}]}'
WHERE slug = 'protection-relay';

UPDATE products
SET summary = 'Process instrumentation for measuring pressure, temperature, flow, and level.',
    content = '{"blocks": [{"type": "paragraph", "data": {"text": "High-accuracy field instruments designed for harsh industrial environments. Our products provide reliable data acquisition for your control systems."}}]}'
WHERE slug = 'instrumentation';

UPDATE products
SET summary = 'xArrow SCADA software for intuitive and scalable industrial monitoring.',
    content = '{"blocks": [{"type": "paragraph", "data": {"text": "xArrow is a powerful SCADA platform offering seamless integration with various PLCs and RTUs. It provides real-time data visualization, alarming, and historical reporting to empower operational decisions."}}]}'
WHERE slug = 'scada-xarrow';

UPDATE products
SET summary = 'Custom-built LV switchboards, motor control centers (MCC), and control panels.',
    content = '{"blocks": [{"type": "paragraph", "data": {"text": "We manufacture and assemble fully type-tested electrical panels according to IEC standards. Each panel is custom-engineered to meet specific project requirements with uncompromising quality."}}]}'
WHERE slug = 'electrical-panels';

UPDATE products
SET summary = 'Bosch intelligent fire detection and voice evacuation systems.',
    content = '{"blocks": [{"type": "paragraph", "data": {"text": "As an authorized provider of Bosch Security Systems, we supply cutting-edge addressable fire alarm panels, detectors, and public address solutions for comprehensive life safety."}}]}'
WHERE slug = 'bosch-fire-alarm';

UPDATE products
SET summary = 'Rittal industrial enclosures and climate control solutions.',
    content = '{"blocks": [{"type": "paragraph", "data": {"text": "Protect your sensitive control equipment with Rittal’s premium enclosures. We supply standard and customized Rittal cabinets complete with thermal management solutions for any industrial setting."}}]}'
WHERE slug = 'rittal-enclosures';

COMMIT;
