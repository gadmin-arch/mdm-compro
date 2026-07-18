-- 008_enrich_content.down.sql
-- Reverts the content enrichment. Deletes newly added records and restores
-- original seed content for updated records.

BEGIN;

-- Remove SEO metadata added by this migration
DELETE FROM seo_meta WHERE entity_type = 'page'    AND entity_id IN ('00000000-0000-0000-0000-000000000401','00000000-0000-0000-0000-000000000402','00000000-0000-0000-0000-000000000403','00000000-0000-0000-0000-000000000404','00000000-0000-0000-0000-000000000405','00000000-0000-0000-0000-000000000406','00000000-0000-0000-0000-000000000407');
DELETE FROM seo_meta WHERE entity_type = 'service'  AND entity_id IN ('00000000-0000-0000-0000-000000000501','00000000-0000-0000-0000-000000000502','00000000-0000-0000-0000-000000000503','00000000-0000-0000-0000-000000000504','00000000-0000-0000-0000-000000000505');
DELETE FROM seo_meta WHERE entity_type = 'product'  AND entity_id IN ('00000000-0000-0000-0000-000000000601','00000000-0000-0000-0000-000000000602','00000000-0000-0000-0000-000000000603','00000000-0000-0000-0000-000000000604','00000000-0000-0000-0000-000000000605','00000000-0000-0000-0000-000000000606','00000000-0000-0000-0000-000000000607');
DELETE FROM seo_meta WHERE entity_type = 'news'     AND entity_id IN ('00000000-0000-0000-0000-000000000801','00000000-0000-0000-0000-000000000802','00000000-0000-0000-0000-000000000803','00000000-0000-0000-0000-000000000804','00000000-0000-0000-0000-000000000805','00000000-0000-0000-0000-000000000806');
DELETE FROM seo_meta WHERE entity_type = 'career'   AND entity_id IN ('00000000-0000-0000-0000-000000000901','00000000-0000-0000-0000-000000000902','00000000-0000-0000-0000-000000000903','00000000-0000-0000-0000-000000000904','00000000-0000-0000-0000-000000000905','00000000-0000-0000-0000-000000000906');

-- Remove newly added careers
DELETE FROM careers WHERE id IN ('00000000-0000-0000-0000-000000000903','00000000-0000-0000-0000-000000000904','00000000-0000-0000-0000-000000000905','00000000-0000-0000-0000-000000000906');

-- Remove newly added news
DELETE FROM news WHERE id IN ('00000000-0000-0000-0000-000000000803','00000000-0000-0000-0000-000000000804','00000000-0000-0000-0000-000000000805','00000000-0000-0000-0000-000000000806');

-- Remove newly added products
DELETE FROM products WHERE id IN ('00000000-0000-0000-0000-000000000604','00000000-0000-0000-0000-000000000605','00000000-0000-0000-0000-000000000606','00000000-0000-0000-0000-000000000607');

-- Remove newly added services
DELETE FROM services WHERE id IN ('00000000-0000-0000-0000-000000000504','00000000-0000-0000-0000-000000000505');

-- Restore original seed content for updated records (services)
UPDATE services SET
  summary = 'End-to-end electrical engineering, installation, testing, and commissioning.',
  content = '{"blocks":[{"type":"paragraph","text":"Complete electrical lifecycle support for industrial and infrastructure facilities."}]}'::jsonb,
  updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000501';

UPDATE services SET
  summary = 'PLC, HMI, SCADA, monitoring, and control system integration.',
  content = '{"blocks":[{"type":"paragraph","text":"Engineering, programming, and integration of monitoring and control systems."}]}'::jsonb,
  updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000502';

UPDATE services SET
  summary = 'Predictive, preventive, and operational maintenance services.',
  content = '{"blocks":[{"type":"paragraph","text":"Long-term reliability programs for critical electrical systems."}]}'::jsonb,
  updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000503';

-- Restore original seed content for updated records (products)
UPDATE products SET
  summary = 'Electrical testing equipment and commissioning tools.',
  content = '{"blocks":[{"type":"paragraph","text":"Reliable test equipment for industrial electrical projects."}]}'::jsonb,
  specs = '{"category":"Testing"}'::jsonb,
  updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000601';

UPDATE products SET
  summary = 'Protection relay devices and related engineering support.',
  content = '{"blocks":[{"type":"paragraph","text":"Protection relay products for medium-voltage systems."}]}'::jsonb,
  specs = '{"category":"Protection"}'::jsonb,
  updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000602';

UPDATE products SET
  summary = 'Instrumentation devices for monitoring and control.',
  content = '{"blocks":[{"type":"paragraph","text":"Instrumentation products for industrial automation."}]}'::jsonb,
  specs = '{"category":"Instrumentation"}'::jsonb,
  updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000603';

-- Restore original pages
UPDATE pages SET
  content = '{"overview":"Established in 2013, PT Multi Daya Mitra delivers electrical, automation, and fire alarm solutions across Indonesia.","vision":"To become a global electrical, automation, and fire alarm services company.","mission":"Build mutual partnerships and deliver every engagement with professional excellence.","values":["Safety","Reliability","Professionalism","Partnership"],"leadership":[],"timeline":[],"certifications":["ISO 9001:2015"]}'::jsonb,
  updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000401';

UPDATE pages SET
  content = '{"offices":[{"name":"Head Office","address":"East Java, Indonesia","mapEmbedUrl":""}],"email":"info@multidayamitra.co.id","phone":"+62"}'::jsonb,
  updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000402';

-- Restore original site settings
UPDATE settings SET
  value = '{"email":"info@multidayamitra.co.id","phone":"+62 31 592 1256","fax":"+62 31 591 7845","address":"Ruko Klampis Megah D-12, Klampis Ngasem, Sukolilo, Surabaya 60117, East Java, Indonesia","socials":[],"tagline":"Electrical · Automation · Fire System","footerDescription":"Indonesian electrical, industrial automation, and fire alarm services company — delivering reliable engineering across power, oil & gas, manufacturing, and infrastructure since 2013."}'::jsonb,
  updated_at = now()
WHERE key = 'site';

-- Restore original news
UPDATE news SET
  excerpt = 'A turnkey solution helps plants track real-time consumption and produce ESG-grade reports.',
  body = '{"blocks":[{"type":"paragraph","text":"Our Energy Monitoring System helps facilities understand usage patterns and reduce waste."}]}'::jsonb,
  updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000801';

UPDATE news SET
  excerpt = 'Our team completed end-to-end testing and commissioning for an industrial client.',
  body = '{"blocks":[{"type":"paragraph","text":"The commissioning scope covered protection coordination, testing, and energization support."}]}'::jsonb,
  updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000802';

-- Restore original careers
UPDATE careers SET
  summary = 'Lead medium-voltage system design, protection coordination, and commissioning.',
  description = '{"blocks":[{"type":"paragraph","text":"Lead electrical design and commissioning work for industrial clients."}]}'::jsonb,
  updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000901';

UPDATE careers SET
  summary = 'Design, program, and integrate PLC, HMI, and SCADA systems.',
  description = '{"blocks":[{"type":"paragraph","text":"Build reliable automation systems for power, oil and gas, and manufacturing clients."}]}'::jsonb,
  updated_at = now()
WHERE id = '00000000-0000-0000-0000-000000000902';

COMMIT;
