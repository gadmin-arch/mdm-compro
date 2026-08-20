-- Updates sales and WhatsApp phone to +62 811-8303-250

UPDATE site_settings
SET
  content = jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          COALESCE(content, '{}'::jsonb),
          '{socials}',
          jsonb_build_array(
            jsonb_build_object('platform', 'facebook',  'url', 'https://www.facebook.com/multidayamitra/',        'label', 'Facebook'),
            jsonb_build_object('platform', 'instagram', 'url', 'https://www.instagram.com/multidayamitra/',       'label', 'Instagram'),
            jsonb_build_object('platform', 'linkedin',  'url', 'https://id.linkedin.com/company/pt-multi-daya-mitra', 'label', 'LinkedIn'),
            jsonb_build_object('platform', 'whatsapp',  'url', 'https://wa.me/628118303250',                      'label', 'WhatsApp Sales')
          )
        ),
        '{salesPhone}', '"+62 811-8303-250"'::jsonb
      ),
      '{whatsappPhone}', '"+62 811-8303-250"'::jsonb
    ),
    '{hotlinePhone}', '"+62 811-8303-250"'::jsonb
  ),
  updated_at = NOW()
WHERE key = 'site';

UPDATE pages
SET
  content = jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          COALESCE(content, '{}'::jsonb),
          '{offices}',
          jsonb_build_array(
            jsonb_build_object(
              'name', 'Head Office (Surabaya)',
              'address', 'Ruko Klampis Megah D-12, Klampis Ngasem, Sukolilo, Surabaya 60117, East Java, Indonesia',
              'phone', '+62 31 592 1256',
              'fax', '+62 31 591 7845',
              'email', 'info@multidayamitra.co.id',
              'mapEmbedUrl', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.6974775466453!2d112.77587847427672!3d-7.275217492731802!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7fa6ab5480eb1%3A0xe54df63b8274305c!2sRuko%20Klampis%20Megah%20Surabaya!5e0!3m2!1sen!2sid!4v1710000000000!5m2!1sen!2sid'
            ),
            jsonb_build_object(
              'name', 'Engineering Office & Workshop',
              'address', 'Ruko Jati Kepuh Indah F-26 & E-21, Sidoarjo 61271, East Java, Indonesia',
              'phone', '+62 811-8303-250',
              'email', 'sales@multidayamitra.co.id',
              'mapEmbedUrl', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3956.4005934522964!2d112.72146907427909!3d-7.420845992589574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7e42d7cd58117%3A0xc3fec86c4293f0b4!2sRuko%20Jati%20Kepuh%20Indah!5e0!3m2!1sen!2sid!4v1710000000000!5m2!1sen!2sid'
            )
          )
        ),
        '{salesPhone}', '"+62 811-8303-250"'::jsonb
      ),
      '{whatsappPhone}', '"+62 811-8303-250"'::jsonb
    ),
    '{hotlinePhone}', '"+62 811-8303-250"'::jsonb
  ),
  updated_at = NOW()
WHERE slug = 'contact';
