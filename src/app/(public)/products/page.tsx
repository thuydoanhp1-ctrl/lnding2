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

const FALLBACK_CATEGORIES = [
  { id: "c1", name: "AI Prompts & Agents", slug: "ai-prompts-agents" },
  { id: "c2", name: "Notion & Productivity", slug: "notion-templates" },
  { id: "c3", name: "LUTs & Video Presets", slug: "presets-luts" },
  { id: "c4", name: "Code & UI Starter Kits", slug: "code-ui-kits" },
];

const FALLBACK_PRODUCTS = [
  {
    id: "p1",
    title: "AI Flywheel Automation Masterclass - Trọn Bộ 52 AI Skills",
    slug: "ai-flywheel-masterclass",
    shortDescription: "Toàn bộ hệ thống 52 kỹ năng AI tự động hóa 8 giai đoạn khép kín cho doanh nghiệp.",
    basePrice: 1990000,
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    ratingAvg: 5.0,
    salesCount: 342,
    category: { name: "AI Prompts & Agents", slug: "ai-prompts-agents" },
    variants: [
      { id: "v1", name: "Bản Cá Nhân", price: 1990000, comparePrice: 4990000, licenseType: "personal" }
    ]
  },
  {
    id: "p2",
    title: "Ultimate Business OS - Notion Template All-in-One",
    slug: "ultimate-business-os",
    shortDescription: "Không gian làm việc Notion quản trị dự án, tài chính và CRM khách hàng toàn diện.",
    basePrice: 790000,
    coverImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80",
    ratingAvg: 4.9,
    salesCount: 185,
    category: { name: "Notion & Productivity", slug: "notion-templates" },
    variants: [
      { id: "v2", name: "Bản Cá Nhân", price: 790000, comparePrice: 1590000, licenseType: "personal" }
    ]
  },
  {
    id: "p3",
    title: "Cinematic Teal & Orange LUTs Pack cho Premiere & CapCut",
    slug: "cinematic-luts-pack",
    shortDescription: "Bộ 25 LUTs màu điện ảnh chuyên nghiệp cho video sáng tạo nội dung triệu view.",
    basePrice: 490000,
    coverImage: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&auto=format&fit=crop&q=80",
    ratingAvg: 4.8,
    salesCount: 512,
    category: { name: "LUTs & Video Presets", slug: "presets-luts" },
    variants: [
      { id: "v3", name: "Bản Cá Nhân", price: 490000, comparePrice: 990000, licenseType: "personal" }
    ]
  }
];

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category, tag, q } = await searchParams;

  let products: any[] = [];
  let categories: any[] = [];

  try {
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

    const [dbProducts, dbCategories] = await Promise.all([
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

    products = dbProducts.length > 0 ? dbProducts : (FALLBACK_PRODUCTS as any);
    categories = dbCategories.length > 0 ? dbCategories : FALLBACK_CATEGORIES;
  } catch (err) {
    products = FALLBACK_PRODUCTS as any;
    categories = FALLBACK_CATEGORIES;
  }

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
