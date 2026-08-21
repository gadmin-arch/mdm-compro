export function JsonLdSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["Organization", "LocalBusiness", "ProfessionalService"],
        "@id": "https://multidayamitra.co.id/#organization",
        "name": "PT Multi Daya Mitra",
        "alternateName": ["PT MDM", "Multi Daya Mitra", "PT. Multi Daya Mitra"],
        "url": "https://multidayamitra.co.id",
        "logo": "https://multidayamitra.co.id/Logo%20PT%20MDM.png",
        "image": "https://multidayamitra.co.id/uploads/hero-project.jpg",
        "description":
          "Kontraktor rekayasa elektrik, otomasi industri PLC SCADA, panel maker MV LV, testing & commissioning, serta sistem alarm proteksi kebakaran di Indonesia sejak 2012.",
        "foundingDate": "2012",
        "telephone": "+62-31-592-1256",
        "email": "info@multidayamitra.co.id",
        "priceRange": "$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Ruko Klampis Megah D-12, Klampis Ngasem, Sukolilo",
          "addressLocality": "Surabaya",
          "addressRegion": "Jawa Timur",
          "postalCode": "60117",
          "addressCountry": "ID"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": -7.2854787,
          "longitude": 112.7773328
        },
        "hasMap": "https://www.google.com/maps/place/Multi+Daya+Mitra+PT./@-7.2854787,112.7747579,17z",
        "sameAs": [
          "https://id.linkedin.com/company/pt-multi-daya-mitra",
          "https://www.instagram.com/multidayamitra/",
          "https://www.facebook.com/multidayamitra/"
        ],
        "contactPoint": [
          {
            "@type": "ContactPoint",
            "telephone": "+62-811-8303-250",
            "contactType": "technical support",
            "areaServed": "ID",
            "availableLanguage": ["Indonesian", "English"]
          },
          {
            "@type": "ContactPoint",
            "telephone": "+62-821-4007-4122",
            "contactType": "sales",
            "areaServed": "ID",
            "availableLanguage": ["Indonesian", "English"]
          }
        ],
        "knowsAbout": [
          "Electrical Engineering",
          "Substation 20kV Installation",
          "Medium Voltage & Low Voltage Panels",
          "PLC & SCADA Industrial Automation",
          "Testing and Commissioning",
          "Infrared Thermography",
          "Fire Alarm Protection System",
          "Rittal Enclosure & Cooling System Distributor",
          "xArrow SCADA Software"
        ],
        "areaServed": {
          "@type": "Country",
          "name": "Indonesia"
        }
      },
      {
        "@type": "WebSite",
        "@id": "https://multidayamitra.co.id/#website",
        "url": "https://multidayamitra.co.id",
        "name": "PT Multi Daya Mitra",
        "publisher": {
          "@id": "https://multidayamitra.co.id/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://multidayamitra.co.id/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      }
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
