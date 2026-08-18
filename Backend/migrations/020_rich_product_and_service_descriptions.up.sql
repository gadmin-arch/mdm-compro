-- 020_rich_product_and_service_descriptions.up.sql
-- Rich technical content, official specifications, and high-res image paths for Products & Services

-- 1. UPDATE RITTAL PRODUCTS
UPDATE products SET
  image_url = '/uploads/products-rittal-enclosures.jpg',
  summary = 'Official Rittal bayed large enclosure system (VX25), compact enclosures (AX), small terminal boxes (KX), and outdoor IT server racks.',
  specs = '{
    "Series": "VX25, AX, KX, CS Toptec, IT Network Racks",
    "Frame Pitch": "25 mm DIN standard symmetrical grid",
    "Protection Rating": "IP55 / IP66 / NEMA 4X / NEMA 12",
    "Material & Finish": "Sheet steel dipcoat-primed RAL 7035 / Stainless steel AISI 304 & 316L",
    "Certifications": "IEC 62208, UL 508A, DNV-GL, CE, RoHS",
    "Target Applications": "LV Switchboards, MCC Panels, Automation Control, IT Server Racks"
  }'::jsonb,
  content = '{
    "blocks": [
      {
        "type": "paragraph",
        "data": {
          "text": "Rittal modular enclosure systems are the global gold standard for low-voltage switchgear, motor control centers (MCC), industrial automation control cabinets, and enterprise IT server infrastructure. Engineered with a symmetrical 25 mm DIN pitch pattern, the VX25 frame eliminates drilling and enables rapid, tool-free interior installation across two mounting levels."
        }
      },
      {
        "type": "header",
        "data": {
          "level": 3,
          "text": "VX25 Large Baying Enclosure Systems"
        }
      },
      {
        "type": "paragraph",
        "data": {
          "text": "The flagship VX25 provides full 4-sided baying capability, maximum internal usable space, and robust load-bearing capacity up to 15,000 N. Perfectly compatible with automated laser machining and digital twin engineering via Eplan software."
        }
      },
      {
        "type": "header",
        "data": {
          "level": 3,
          "text": "AX Compact Enclosures & KX Small Enclosures"
        }
      },
      {
        "type": "paragraph",
        "data": {
          "text": "The AX series incorporates the VX25 system logic into compact wall-mounted enclosures with toolless door reversal and integrated locator rails. The KX terminal boxes offer quick-release 180° mini cam locks for space-saving field sensor and bus distribution."
        }
      }
    ]
  }'::jsonb
WHERE slug = 'enclosures';

UPDATE products SET
  image_url = '/uploads/products-rittal-cooling.jpg',
  summary = 'Innovative hybrid cooling units, thermoelectric coolers, and air-to-water heat exchangers providing up to 75% energy savings and digital IoT monitoring.',
  specs = '{
    "Cooling Capacity": "300 W to 5,500 W (Blue e+ & Blue e+ S)",
    "Energy Savings": "Up to 75% via patented hybrid heat pipe technology",
    "Refrigerant": "Eco-friendly R-513A / R-134a (GWP compliant)",
    "Operating Temp": "-20°C to +60°C ambient",
    "IoT Protocols": "Modbus TCP, SNMP, OPC-UA, Profinet, Ethernet/IP",
    "Mounting Options": "Wall-mounted, roof-mounted, partial or full internal"
  }'::jsonb,
  content = '{
    "blocks": [
      {
        "type": "paragraph",
        "data": {
          "text": "Rittal Blue e+ cooling units represent a revolutionary leap in industrial enclosure climate control. Utilizing patented hybrid technology that pairs an active inverter-driven vapor compression circuit with a passive heat pipe, Blue e+ achieves an average of 75% energy reduction compared to conventional cooling units."
        }
      },
      {
        "type": "header",
        "data": {
          "level": 3,
          "text": "Speed-Regulated Hybrid Cooling Technology"
        }
      },
      {
        "type": "paragraph",
        "data": {
          "text": "Inverter-driven DC compressors and EC fans dynamically adapt cooling output to match exact thermal loads. This guarantees a steady internal temperature and prevents thermal shock on sensitive PLC, VSD, and microprocessor electronics."
        }
      },
      {
        "type": "header",
        "data": {
          "level": 3,
          "text": "Smart IoT & Industry 4.0 Integration"
        }
      },
      {
        "type": "paragraph",
        "data": {
          "text": "Equipped with multi-lingual touch display, NFC wireless diagnostics, and IoT interface for continuous remote condition monitoring, automated fault alerts, and predictive filter mat maintenance."
        }
      }
    ]
  }'::jsonb
WHERE slug = 'climate-control-cooling';

UPDATE products SET
  image_url = '/uploads/products-rittal-power.jpg',
  summary = 'Type-tested low-voltage busbar and switchgear power distribution systems up to 6300A compliant with IEC 61439-1/-2.',
  specs = '{
    "Rated Current (In)": "Up to 6,300 A (Ri4Power) / 2,100 A (RiLine)",
    "Short-Circuit Rating (Icw)": "Up to 120 kA (1s withstand)",
    "Internal Separation": "Form 1, Form 2b, Form 3b, Form 4a, Form 4b",
    "Busbar Centers": "60 mm & 185 mm drill-free mounting systems",
    "Standards": "IEC 61439-1, IEC 61439-2, DIN EN 61439"
  }'::jsonb,
  content = '{
    "blocks": [
      {
        "type": "paragraph",
        "data": {
          "text": "Rittal Ri4Power and RiLine modular power distribution platforms allow panel builders and system integrators to build fully type-tested low voltage switchgear assemblies up to 6300A with Form 1 to Form 4b internal separation in accordance with IEC 61439-1/-2."
        }
      },
      {
        "type": "header",
        "data": {
          "level": 3,
          "text": "Ri4Power Modular LV Switchgear"
        }
      },
      {
        "type": "paragraph",
        "data": {
          "text": "Engineered specifically for VX25 enclosures, supporting top-tier Air Circuit Breakers (ACB) and Moulded Case Circuit Breakers (MCCB) with optimized copper busbar holders, arc fault containment, and standardized cable entry sections."
        }
      },
      {
        "type": "header",
        "data": {
          "level": 3,
          "text": "RiLine Drill-Free Busbar System"
        }
      },
      {
        "type": "paragraph",
        "data": {
          "text": "Fast, drill-free 60 mm and 185 mm center-to-center busbar systems up to 2100A with touch-safe shrouding, snap-on component adapters, and NH fuse-switch disconnectors for safe, organized assembly."
        }
      }
    ]
  }'::jsonb
WHERE slug = 'power-distribution';

-- 2. UPDATE SCHNEIDER PRODUCTS
UPDATE products SET
  image_url = '/uploads/products-schneider-automation.jpg',
  summary = 'Complete PLC/PAC automation systems featuring Schneider Modicon M340, M580 ePAC, Magelis HMI, and EcoStruxure Plant architecture.',
  specs = '{
    "PLC Families": "Modicon M580 ePAC, Modicon M340, Modicon M241/M251",
    "Cybersecurity": "Achilles Level 2 & ISA/IEC 62443 certified embedded security",
    "Architecture": "Schneider EcoStruxure Plant & Machine Expert",
    "Communication": "Ethernet/IP, Modbus TCP, Profinet, CANopen, OPC-UA",
    "High Availability": "Hot-standby redundant CPU architectures (M580)"
  }'::jsonb,
  content = '{
    "blocks": [
      {
        "type": "paragraph",
        "data": {
          "text": "As a certified Schneider Electric System Integrator, PT Multi Daya Mitra designs and commissions high-reliability industrial automation architectures utilizing Modicon M340 PAC and Modicon M580 Ethernet Programmable Automation Controllers (ePAC)."
        }
      },
      {
        "type": "header",
        "data": {
          "level": 3,
          "text": "Modicon M580 ePAC & Hot-Standby Redundancy"
        }
      },
      {
        "type": "paragraph",
        "data": {
          "text": "Native Ethernet backbone integration directly on the backplane delivers high-speed deterministic control, seamless fieldbus communication, and zero-downtime hot-standby redundancy for critical continuous manufacturing processes."
        }
      },
      {
        "type": "header",
        "data": {
          "level": 3,
          "text": "EcoStruxure Software & Machine Integration"
        }
      },
      {
        "type": "paragraph",
        "data": {
          "text": "Comprehensive engineering using EcoStruxure Control Expert (formerly Unity Pro), Magelis / Harmony HMI panels, and remote telemetry units (RTU) for water, power, chemical, and F&B processing."
        }
      }
    ]
  }'::jsonb
WHERE slug = 'industrial-automation';

UPDATE products SET
  image_url = '/uploads/products-schneider-pme.jpg',
  summary = 'Schneider PowerLogic digital power meters, ION meters, and EcoStruxure Power Monitoring Expert (PME) software.',
  specs = '{
    "Platform": "EcoStruxure Power Monitoring Expert (PME) / Power Operation (PO)",
    "Power Meters": "PowerLogic PM8000, PM5000 series, ION9000, ION7400",
    "Compliance": "IEC 61000-4-30 Class A precision power quality compliance",
    "Analytics": "Harmonic analysis, voltage sag/swell capture, EN 50160 compliance",
    "Reporting": "Automated energy billing, cost allocation, carbon footprint tracking"
  }'::jsonb,
  content = '{
    "blocks": [
      {
        "type": "paragraph",
        "data": {
          "text": "EcoStruxure Power Monitoring Expert (PME) is an enterprise-grade power management software that collects data from smart power meters, circuit breakers, and protection relays across your electrical network to optimize energy efficiency and power reliability."
        }
      },
      {
        "type": "header",
        "data": {
          "level": 3,
          "text": "Power Quality Disturbance Analysis"
        }
      },
      {
        "type": "paragraph",
        "data": {
          "text": "Captures microsecond transients, voltage sags, swells, and harmonic distorsions (THD up to 63rd harmonic) using high-precision PowerLogic ION9000 and PM8000 meters to prevent premature equipment failure."
        }
      },
      {
        "type": "header",
        "data": {
          "level": 3,
          "text": "Energy Accounting & Baseline Tracking"
        }
      },
      {
        "type": "paragraph",
        "data": {
          "text": "Automated WAGES (Water, Air, Gas, Electricity, Steam) monitoring, sub-billing, ISO 50001 energy compliance dashboards, and automated ESG carbon emissions reporting."
        }
      }
    ]
  }'::jsonb
WHERE slug = 'power-energy-monitoring';

UPDATE products SET
  image_url = '/uploads/products-schneider-distribution.jpg',
  summary = 'MasterPact MTZ/NW air circuit breakers, Compact NSX molded case breakers, and Prisma type-tested switchboard integration.',
  specs = '{
    "Circuit Breakers": "MasterPact MTZ (up to 6300A), Compact NSX/NSXm (16-630A)",
    "Trip Units": "MicroLogic X with integrated Class 1 active energy measurement",
    "Enclosure System": "Schneider PrismaSeT G & P type-tested modular switchboards",
    "Connectivity": "Embedded Bluetooth, NFC, Ethernet Modbus TCP communications",
    "Standards": "IEC 60947-2, IEC 61439-1/-2, UL 489"
  }'::jsonb,
  content = '{
    "blocks": [
      {
        "type": "paragraph",
        "data": {
          "text": "PT Multi Daya Mitra integrates Schneider Electric MasterPact MTZ air circuit breakers and Compact NSX MCCBs into modular Prisma switchboard systems, delivering state-of-the-art power distribution and digital connectivity."
        }
      },
      {
        "type": "header",
        "data": {
          "level": 3,
          "text": "MasterPact MTZ with MicroLogic X Control Units"
        }
      },
      {
        "type": "paragraph",
        "data": {
          "text": "Features embedded Class 1 power & energy measurement, real-time wireless smartphone diagnostics via Bluetooth/NFC, and dual-Ethernet communication for direct connection into SCADA/PME without external transducers."
        }
      },
      {
        "type": "header",
        "data": {
          "level": 3,
          "text": "Prisma Type-Tested Switchboard Architecture"
        }
      },
      {
        "type": "paragraph",
        "data": {
          "text": "IEC 61439 certified modular architecture ensuring maximum safety against arc faults, optimized thermal dissipation, and easy future capacity expansion."
        }
      }
    ]
  }'::jsonb
WHERE slug = 'electrical-distribution-integration';

UPDATE products SET
  image_url = '/uploads/products-schneider-commissioning.jpg',
  summary = 'Schneider factory acceptance testing (FAT), site acceptance testing (SAT), relay protection coordination, and energized commissioning.',
  specs = '{
    "Testing Fleet": "Omicron CMC 356, Megger S1-568, Fluke 1777, FLIR E76",
    "Scope": "FAT & SAT verification, relay parameterization, breaker trip testing",
    "Certification": "Certified Schneider System Integrator & ESDM Level 6 accredited",
    "Standards": "IEEE 1584 Arc Flash, IEC 60255 Protection Relays, NETA Acceptance"
  }'::jsonb,
  content = '{
    "blocks": [
      {
        "type": "paragraph",
        "data": {
          "text": "Our certified engineering team provides comprehensive engineering, Factory Acceptance Testing (FAT), Site Acceptance Testing (SAT), protection relay parameterization, and energized commissioning support for Schneider Electric automation and power distribution systems."
        }
      },
      {
        "type": "header",
        "data": {
          "level": 3,
          "text": "Protection Relay Parameterization & Primary Injection"
        }
      },
      {
        "type": "paragraph",
        "data": {
          "text": "Configuration and testing of Schneider Sepam, Easergy P3, and Easergy P5 protection relays using calibrated Omicron secondary injection test sets to guarantee discrimination and fast arc clearing times."
        }
      },
      {
        "type": "header",
        "data": {
          "level": 3,
          "text": "Energization & SAT Site Handover"
        }
      },
      {
        "type": "paragraph",
        "data": {
          "text": "Rigorous pre-commissioning checks, insulation resistance, contact resistance (Ductor), functional interlock verification, and full handover documentation with client operations training."
        }
      }
    ]
  }'::jsonb
WHERE slug = 'engineering-commissioning';

-- 3. UPDATE PRODUCT CATEGORIES
UPDATE products SET
  image_url = '/uploads/mdm/active-harmonic-filter.jpg'
WHERE slug = 'active-harmonic-filters';

UPDATE products SET
  image_url = '/uploads/PM-Fire-Alarm-1.jpg'
WHERE slug = 'addressable-fire-alarm-systems';

UPDATE products SET
  image_url = '/uploads/mdm/circuit-breaker.jpg'
WHERE slug = 'low-voltage-distribution-panels';

UPDATE products SET
  image_url = '/uploads/mdm/medium-voltage-equipment.jpg'
WHERE slug = 'medium-voltage-substation';

UPDATE products SET
  image_url = '/uploads/xarrow.jpg'
WHERE slug = 'scada-xarrow-telemetry';

UPDATE products SET
  image_url = '/uploads/products-schneider-distribution.jpg'
WHERE slug = 'vsd-inverter-panels';

-- 4. UPDATE SERVICES WITH AUTHENTIC MDM PHOTOS
UPDATE services SET
  image_url = '/uploads/mdm/construction-installation.jpg'
WHERE slug = 'electrical-construction-installation';

UPDATE services SET
  image_url = '/uploads/mdm/medium-voltage-equipment.jpg'
WHERE slug = 'substation-mv-switchgear-installation';

UPDATE services SET
  image_url = '/uploads/mdm/circuit-breaker.jpg'
WHERE slug = 'lv-distribution-panels-assembly';

UPDATE services SET
  image_url = '/uploads/mdm/electrical-equipment.jpg'
WHERE slug = 'mv-lv-cable-installation-termination';

UPDATE services SET
  image_url = '/uploads/PM-Fire-Alarm-1.jpg'
WHERE slug = 'fire-alarm-system-installation';

UPDATE services SET
  image_url = '/uploads/mdm/maintenance-contract.jpg'
WHERE slug = 'electrical-maintenance-service';

UPDATE services SET
  image_url = '/uploads/mdm/micrologic-test.jpg'
WHERE slug = 'transformer-oil-treatment-dga';

UPDATE services SET
  image_url = '/uploads/mdm/preventive-maintenance.jpg'
WHERE slug = 'mv-cubicle-acb-maintenance';

UPDATE services SET
  image_url = '/uploads/mdm/infrared-thermograph.jpg'
WHERE slug = 'thermography-predictive-maintenance';

UPDATE services SET
  image_url = '/uploads/mdm/maintenance-contract.jpg'
WHERE slug = 'annual-maintenance-contracts';

UPDATE services SET
  image_url = '/uploads/mdm/industrial-automation.jpg'
WHERE slug = 'automation-solutions-services';

UPDATE services SET
  image_url = '/uploads/xarrow.jpg'
WHERE slug = 'scada-hmi-process-monitoring';

UPDATE services SET
  image_url = '/uploads/PMS-Network_001.jpg'
WHERE slug = 'energy-management-iso50001';

UPDATE services SET
  image_url = '/uploads/products-schneider-automation.jpg'
WHERE slug = 'plc-vsd-system-integration';

UPDATE services SET
  image_url = '/uploads/mdm/testing-measurement.jpg'
WHERE slug = 'inspection-testing-commissioning';

UPDATE services SET
  image_url = '/uploads/mdm/power-quality.jpg'
WHERE slug = 'power-quality-analysis-study';

UPDATE services SET
  image_url = '/uploads/mdm/partial-discharge.jpg'
WHERE slug = 'partial-discharge-pd-scan';

UPDATE services SET
  image_url = '/uploads/mdm/secondary-injector.jpg'
WHERE slug = 'relay-protection-testing-commissioning';

UPDATE services SET
  image_url = '/uploads/mdm/electrical-services.jpg'
WHERE slug = 'mechanical-services-supplies';

UPDATE services SET
  image_url = '/uploads/products-rittal-cooling.jpg'
WHERE slug = 'industrial-mechanical-supplies-services';

UPDATE services SET
  image_url = '/uploads/mdm/electrical-services.jpg'
WHERE slug = 'motor-generator-servicing-overhaul';
