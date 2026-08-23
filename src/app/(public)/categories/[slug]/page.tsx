import { db } from "@/lib/db";
import { ProductCard } from "@/components/store/ProductCard";
import Link from "next/link";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

const CATEGORY_NAMES: Record<string, { name: string; desc: string }> = {
  "ai-prompts-agents": {
    name: "AI Prompts & Agents",
    desc: "Tổng hợp prompt engineering frameworks, AI agent blueprints và công cụ tự động hóa doanh nghiệp.",
  },
  "notion-templates": {
    name: "Notion & Productivity",
    desc: "Các mẫu Notion OS quản trị doanh nghiệp, CRM khách hàng, OKRs và quản lý dự án tối ưu.",
  },
  "presets-luts": {
    name: "LUTs & Video Presets",
    desc: "Preset màu điện ảnh, Sound FX và LUTs dành cho Premiere Pro, CapCut, DaVinci Resolve.",
  },
  "code-ui-kits": {
    name: "Code & UI Starter Kits",
    desc: "Source code Next.js fullstack, Flutter apps và boilerplate sẵn sàng deploy production.",
  },
};

const ALL_MOCK_PRODUCTS = [
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

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const categoryInfo = CATEGORY_NAMES[slug] || { name: slug, desc: "Danh mục sản phẩm số chất lượng cao" };

  let products: any[] = [];

  try {
    const dbProducts = await db.product.findMany({
      where: {
        status: "published",
        category: { slug },
      },
      include: { variants: true, category: true },
      orderBy: { createdAt: "desc" },
    });
    if (dbProducts.length > 0) {
      products = dbProducts;
    }
  } catch (err) {
    console.warn("DB not ready, filtering mock products...");
  }

  if (products.length === 0) {
    products = ALL_MOCK_PRODUCTS.filter((p) => p.category.slug === slug);
    if (products.length === 0) {
      products = ALL_MOCK_PRODUCTS; // Show all if none matched
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-white transition-colors">Trang chủ</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-white transition-colors">Danh mục</Link>
        <span>/</span>
        <span className="text-cyan-400">{categoryInfo.name}</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white">{categoryInfo.name}</h1>
        <p className="text-slate-400 text-sm mt-1">{categoryInfo.desc}</p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
