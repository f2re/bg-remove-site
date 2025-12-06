import { PRICING_PACKAGES, FAQ_ITEMS } from "@/lib/constants";

export default function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "BG Remove",
    description: "Профессиональное удаление фона с фотографий через Telegram бот",
    url: "https://bg.app-studio.online",
    logo: "https://bg.app-studio.online/logo.png",
    sameAs: [
      "https://t.me/BackgroundRemoving_bot",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      availableLanguage: ["Russian", "English"],
    },
  };

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "BG Remove Telegram Bot",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any (Telegram)",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "RUB",
      lowPrice: PRICING_PACKAGES[1].price,
      highPrice: PRICING_PACKAGES[PRICING_PACKAGES.length - 1].price,
      offerCount: PRICING_PACKAGES.length,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "500",
      bestRating: "5",
      worstRating: "1",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const productSchemas = PRICING_PACKAGES.filter(pkg => pkg.price > 0).map((pkg) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${pkg.name} пакет`,
    description: `Обработка ${pkg.photos} фотографий - ${pkg.features.join(", ")}`,
    offers: {
      "@type": "Offer",
      price: pkg.price,
      priceCurrency: "RUB",
      availability: "https://schema.org/InStock",
    },
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {productSchemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
