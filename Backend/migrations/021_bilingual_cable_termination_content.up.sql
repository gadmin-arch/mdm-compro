-- 021_bilingual_cable_termination_content.up.sql
-- Update MV & LV Cable Installation & Termination with rich bilingual content (ID & EN)

UPDATE services
SET content = '{
  "bilingual": true,
  "id": {
    "blocks": [
      {
        "type": "heading",
        "data": {
          "level": 3,
          "text": "Distribusi Listrik yang Andal untuk Fasilitas Industri"
        }
      },
      {
        "type": "paragraph",
        "data": {
          "text": "Keandalan sistem distribusi listrik tidak hanya bergantung pada kualitas kabel dan peralatan, tetapi juga pada proses instalasi dan terminasi kabel MV & LV yang tepat. Instalasi, routing, terminasi, dan pengujian yang dilakukan secara akurat sangat penting untuk menjaga keselamatan, keandalan, dan performa sistem dalam jangka panjang."
        }
      }
    ]
  },
  "en": {
    "blocks": [
      {
        "type": "heading",
        "data": {
          "level": 3,
          "text": "Reliable Power Distribution for Industrial Facilities"
        }
      },
      {
        "type": "html",
        "html": "<p>Reliable electrical distribution depends not only on cable quality and equipment, but also on proper <a href=\"/services/electrical-construction-installation/mv-lv-cable-installation-termination\">MV & LV cable installation and termination.</a> Accurate installation, routing, termination, and testing are essential to maintain electrical safety, system reliability, and long-term performance.</p>"
      }
    ]
  },
  "blocks": [
    {
      "type": "paragraph",
      "data": {
        "text": "Keandalan sistem distribusi listrik tidak hanya bergantung pada kualitas kabel dan peralatan, tetapi juga pada proses instalasi dan terminasi kabel MV & LV yang tepat."
      }
    }
  ]
}'::jsonb
WHERE slug = 'mv-lv-cable-installation-termination';
