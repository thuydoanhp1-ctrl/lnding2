import Link from "next/link";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/store/ProductCard";
import { Sparkles, ShieldCheck, Zap, DownloadCloud, ArrowRight, Bot, LayoutGrid, Film, Code2 } from "lucide-react";

export const revalidate = 60; // ISR cache 60s

const FALLBACK_CATEGORIES = [
  { id: "c1", name: "AI Prompts & Agents", slug: "ai-prompts-agents", description: "Prompt engineering frameworks và AI agents tối ưu cho doanh nghiệp", order: 1 },
  { id: "c2", name: "Notion & Productivity", slug: "notion-templates", description: "Hệ thống quản trị doanh nghiệp và theo dõi mục tiêu OKRs", order: 2 },
  { id: "c3", name: "LUTs & Video Presets", slug: "presets-luts", description: "Preset màu điện ảnh và âm thanh chuyên nghiệp cho video", order: 3 },
  { id: "c4", name: "Code & UI Starter Kits", slug: "code-ui-kits", description: "Source code Next.js, Flutter và boilerplate sẵn sàng deploy", order: 4 },
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
    featured: true,
    category: { name: "AI Prompts & Agents" },
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
    featured: true,
    category: { name: "Notion & Productivity" },
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
    featured: false,
    category: { name: "LUTs & Video Presets" },
    variants: [
      { id: "v3", name: "Bản Cá Nhân", price: 490000, comparePrice: 990000, licenseType: "personal" }
    ]
  }
];

export default async function HomePage() {
  let featuredProducts: any[] = [];
  let categories: any[] = [];

  try {
    const [dbProducts, dbCategories] = await Promise.all([
      db.product.findMany({
        where: { status: "published" },
        include: { variants: true, category: true },
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
      db.category.findMany({
        where: { deletedAt: null },
        orderBy: { order: "asc" },
      }),
    ]);

    featuredProducts = dbProducts.length > 0 ? dbProducts : (FALLBACK_PRODUCTS as any);
    categories = dbCategories.length > 0 ? dbCategories : FALLBACK_CATEGORIES;
  } catch (err) {
    console.warn("Using fallback static products due to uninitialized DB:", err);
    featuredProducts = FALLBACK_PRODUCTS as any;
    categories = FALLBACK_CATEGORIES;
  }

  return (
    <div className="space-y-24 pb-20">
      {/* ================= HERO SECTION ================= */}
      <section className="relative pt-20 pb-12 overflow-hidden text-center">
        {/* Glow lights */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs font-semibold text-cyan-400 backdrop-blur-md">
            <span className="pulse-dot" />
            <span>KHO TÀI NGUYÊN SỐ & AI TỰ ĐỘNG HÓA CAO CẤP</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            Nâng Tầm Hiệu Suất Với <br />
            <span className="gradient-text">Sản Phẩm Số & AI Flywheel</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed">
            Sở hữu trọn bộ công cụ AI Skills, Notion Templates, LUTs điện ảnh và Source Code chuyên nghiệp giúp bạn và doanh nghiệp tiết kiệm 70% thời gian làm việc.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link href="/products" className="btn-primary py-3.5 px-8 text-base">
              <span>Khám Phá Cửa Hàng</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/products?category=ai-prompts-agents" className="btn-secondary py-3.5 px-8 text-base">
              <span>Xem Bộ AI Skills</span>
            </Link>
          </div>

          {/* Value Badges */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-white/[0.06]">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] text-left">
              <Zap className="w-5 h-5 text-indigo-400 mb-2" />
              <div className="font-bold text-white text-sm">Tải Ngay Tức Thì</div>
              <div className="text-xs text-slate-400">Link signed URL an toàn 100%</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] text-left">
              <ShieldCheck className="w-5 h-5 text-emerald-400 mb-2" />
              <div className="font-bold text-white text-sm">Bản Quyền Đầy Đủ</div>
              <div className="text-xs text-slate-400">Cá nhân & Thương mại</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] text-left">
              <Sparkles className="w-5 h-5 text-cyan-400 mb-2" />
              <div className="font-bold text-white text-sm">Cập Nhật Trọn Đời</div>
              <div className="text-xs text-slate-400">Nâng cấp phiên bản mới free</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] text-left">
              <DownloadCloud className="w-5 h-5 text-amber-400 mb-2" />
              <div className="font-bold text-white text-sm">Sepay VietQR</div>
              <div className="text-xs text-slate-400">Tự động kích hoạt trong 3s</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CATEGORIES SECTION ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">Danh Mục Sản Phẩm</h2>
            <p className="text-xs text-slate-400 mt-1">Lựa chọn tài nguyên phù hợp với nhu cầu của bạn</p>
          </div>
          <Link href="/products" className="text-xs font-semibold text-cyan-400 hover:underline">
            Xem tất cả &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="glass-card p-6 flex flex-col justify-between group hover:border-indigo-500/50"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {cat.slug.includes("ai") ? (
                    <Bot className="w-5 h-5" />
                  ) : cat.slug.includes("notion") ? (
                    <LayoutGrid className="w-5 h-5" />
                  ) : cat.slug.includes("preset") ? (
                    <Film className="w-5 h-5" />
                  ) : (
                    <Code2 className="w-5 h-5" />
                  )}
                </div>
                <h3 className="font-bold text-white text-base group-hover:text-cyan-400 transition-colors mb-1">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>
              <div className="mt-4 text-xs font-semibold text-slate-500 group-hover:text-indigo-400 flex items-center gap-1">
                <span>Khám phá</span>
                <span>&rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ================= FEATURED PRODUCTS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-block text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
              Tuyển Chọn Đặc Biệt
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Sản Phẩm Mới & Nổi Bật Nhất</h2>
          </div>
          <Link href="/products" className="btn-secondary py-2 px-4 text-xs">
            Xem Toàn Bộ Kho
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
