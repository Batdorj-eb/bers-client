import { notFound } from "next/navigation";
import NewsCard from "@/components/NewsCard";
import PageShell from "@/components/PageShell";
import {
  categories,
  getCategoryBySlug,
  getNewsByCategory,
} from "@/lib/newsData";

export function generateStaticParams() {
  return categories.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "Ангилал олдсонгүй" };
  return {
    title: `${category.name} | BERS.mn`,
    description: `${category.name} ангиллын мэдээ`,
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const items = getNewsByCategory(category.name);

  return (
    <PageShell showMidAd>
      <header className="mb-8 animate-fade-up">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
          Ангилал
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {category.name}
        </h1>
        <p className="mt-2 text-sm text-muted">{items.length} мэдээ олдлоо</p>
      </header>

      {items.length === 0 ? (
        <p className="border border-line bg-surface/70 px-6 py-12 text-center text-muted">
          Энэ ангилалд одоогоор мэдээ байхгүй байна.
        </p>
      ) : (
        <div className="flex flex-col gap-5">
          {items.map((news) => (
            <NewsCard key={news.slug} news={news} />
          ))}
        </div>
      )}
    </PageShell>
  );
}
