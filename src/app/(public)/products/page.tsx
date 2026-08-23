import { db } from "@/lib/db";
import { ProductCard } from "@/components/store/ProductCard";
import Link from "next/link";

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    tag?: string;
    q?: string;
  }>;
}

export const revalidate = 60;

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category, tag, q } = await searchParams;

  const whereCondition: any = {
    status: "published",
  };

  if (category) {
    whereCondition.category = { slug: category };
  }

  if (tag) {
    whereCondition.tags = { has: tag };
  }

  if (q) {
    whereCondition.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { shortDescription: { contains: q, mode: "insensitive" } },
    ];
  }

  const [products, categories] = await Promise.all([
    db.product.findMany({
      where: whereCondition,
      include: { variants: true, category: true },
      orderBy: { createdAt: "desc" },
    }),
    db.category.findMany({
      where: { deletedAt: null },
      orderBy: { order: "asc" },
    }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white">Kho Sản Phẩm Số & AI Tools</h1>
        <p className="text-slate-400 text-sm mt-1">
          Khám phá toàn bộ tài nguyên bản quyền được thiết kế sẵn sàng đưa vào ứng dụng thực tế.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 pb-2">
        <Link
          href="/products"
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            !category
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
              : "bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]"
          }`}
        >
          Tất cả
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              category === cat.slug
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                : "bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Product Grid */}
      {products.length === 0 ? (
        <div className="glass-card p-12 text-center text-slate-400 space-y-3">
          <p className="text-base font-semibold">Chưa có sản phẩm nào phù hợp với bộ lọc hiện tại.</p>
          <Link href="/products" className="btn-secondary py-2 px-4 text-xs">
            Xóa bộ lọc
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
