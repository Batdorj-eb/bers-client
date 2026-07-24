export const categories = [
  {
    name: "Цагаачлал & Хууль, бодлого",
    english: "Law & Policy",
    slug: "law-policy",
    description:
      "Виз, green card, иргэншил, бодлогын өөрчлөлт, ICE-тэй холбоотой мэдээ.",
  },
  {
    name: "Бизнес & Ажил эрхлэлт",
    english: "Entrepreneurship",
    slug: "entrepreneurship",
    description:
      "LLC/EIN, татвар, зээл, ажлын байрны зах зээлтэй холбоотой мэдээлэл.",
  },
  {
    name: "Боловсрол",
    english: "Higher Education",
    slug: "education",
    description:
      "Их сургуулийн элсэлт, тэтгэлэг, оюутны виз (F-1/OPT), сургалтын зээл.",
  },
  {
    name: "Эрүүл мэнд",
    english: "Health",
    slug: "health",
    description:
      "Эрүүл мэндийн даатгал, эмнэлгийн систем, яаралтай тусламж зэрэгтэй холбоотой мэдээлэл.",
  },
  {
    name: "Нийгэм & Хамт олон",
    english: "Community/Society",
    slug: "community",
    description:
      "Хот тус бүрийн Монголчуудын арга хэмжээтэй холбоотой мэдээлэл.",
  },
  {
    name: "Монгол & Дэлхийн мэдээ",
    english: "Homeland/World News",
    slug: "homeland-world",
    description: "Эх орны онцлох мэдээ мэдээллийг товчхон хүргэнэ.",
  },
];

export function getCategoryBySlug(slug) {
  return categories.find((item) => item.slug === slug);
}
