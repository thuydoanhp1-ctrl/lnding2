import { db } from "@/lib/db";
import { VariantSelector } from "@/components/store/VariantSelector";
import { Star, Download, ShieldCheck, RefreshCw, Layers, CheckCircle2, Zap } from "lucide-react";
import Link from "next/link";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

const FALLBACK_PRODUCTS_DETAIL: Record<string, any> = {
  "ai-flywheel-masterclass": {
    id: "p1",
    title: "AI Flywheel Automation Masterclass - Trọn Bộ 52 AI Skills",
    slug: "ai-flywheel-masterclass",
    shortDescription: "Toàn bộ hệ thống 52 kỹ năng AI tự động hóa 8 giai đoạn khép kín cho doanh nghiệp.",
    longDescription: `### 🚀 Tổng Quan Khóa Học & Bộ Công Cụ AI Flywheel

Khóa học và bộ tài nguyên **AI Automation For Business Masterclass** cung cấp hệ thống 52 kỹ năng AI đóng gói sẵn giúp tự động hóa toàn diện 8 giai đoạn vận hành doanh nghiệp:

1. **Giai đoạn 1: Content Research & SEO Intelligence** (8 Skills) - Nghiên cứu từ khóa, phân tích đối thủ tự động.
2. **Giai đoạn 2: Multi-Platform Content Generation** (7 Skills) - Viết bài chuẩn SEO, kịch bản video ngắn TikTok/Reels/Shorts.
3. **Giai đoạn 3: Visual & Media Automation** (6 Skills) - Tạo banner, thumbnail, visual prompt tự động bằng Midjourney/Flux.
4. **Giai đoạn 4: Social Distribution & Scheduling** (6 Skills) - Đăng bài đa kênh tự động qua API.
5. **Giai đoạn 5: Lead Capture & AI Chatbot** (7 Skills) - Tự động tư vấn, chốt lịch hẹn 24/7.
6. **Giai đoạn 6: Email Marketing Nurturing** (6 Skills) - Chuỗi email tự động hóa cá nhân hóa cao.
7. **Giai đoạn 7: Conversion Optimization & Analytics** (6 Skills) - Phân tích dữ liệu, tối ưu ROI quảng cáo.
8. **Giai đoạn 8: Operations & CRM Automation** (6 Skills) - Đồng bộ dữ liệu bán hàng vào Notion, CRM.

---

### 🎁 Bạn Sẽ Nhận Được Gì?
- **52 File Prompt Templates & Custom GPTs Prompts** chuẩn hóa theo từng bài toán thực tế.
- **8 Hệ thống Tự Động Hóa Make.com / n8n Blueprint JSON** chỉ cần import là chạy ngay.
- **Full Video Hướng Dẫn Từng Bước (Full HD)** cầm tay chỉ việc từ A-Z.
- **Cộng đồng Private Mastermind** hỗ trợ giải đáp 24/7 và cập nhật kỹ năng mới trọn đời.`,
    basePrice: 1990000,
    coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80",
    ratingAvg: 5.0,
    ratingCount: 48,
    salesCount: 342,
    category: { name: "AI Prompts & Agents", slug: "ai-prompts-agents" },
    variants: [
      {
        id: "v1-personal",
        name: "Gói Cá Nhân (Personal)",
        price: 1990000,
        comparePrice: 4990000,
        licenseType: "personal",
        maxDownloads: 10,
        downloadExpiry: 365,
        description: "Dành cho cá nhân, freelancer tự học và ứng dụng cho 1 dự án riêng."
      },
      {
        id: "v1-commercial",
        name: "Gói Doanh Nghiệp (Commercial)",
        price: 4990000,
        comparePrice: 9900000,
        licenseType: "commercial",
        maxDownloads: 50,
        downloadExpiry: 730,
        description: "Được phép triển khai cho toàn bộ nhân sự công ty và dự án khách hàng."
      },
      {
        id: "v1-extended",
        name: "Gói Mở Rộng + 1-on-1 Coaching (Extended)",
        price: 9990000,
        comparePrice: 18000000,
        licenseType: "extended",
        maxDownloads: -1,
        downloadExpiry: 3650,
        description: "Bao gồm 3 buổi kèm 1-1 trực tiếp xây dựng hệ thống AI theo yêu cầu riêng."
      }
    ]
  },
  "ultimate-business-os": {
    id: "p2",
    title: "Ultimate Business OS - Notion Template All-in-One",
    slug: "ultimate-business-os",
    shortDescription: "Không gian làm việc Notion quản trị dự án, tài chính và CRM khách hàng toàn diện.",
    longDescription: `### 📊 Hệ Thống Quản Trị Doanh Nghiệp Toàn Diện Trên Notion

**Ultimate Business OS** là mẫu template Notion được thiết kế chuyên sâu dành cho Doanh nghiệp vừa & nhỏ (SME), Agency và Solo Founder:

- **Quản lý Dự án & Task**: Kanban Board, Timeline Gantt, phân bổ nhân sự và deadline tự động.
- **CRM Khách Hàng**: Quản lý phễu bán hàng, lịch sử trao đổi, hợp đồng và hóa đơn.
- **Quản lý Tài Chính**: Thu chi, dòng tiền, dự báo doanh thu và phân tích lợi nhuận.
- **Tài liệu & Wiki Nội Bộ (SOPs)**: Lưu trữ quy trình làm việc chuẩn hóa cho từng phòng ban.`,
    basePrice: 790000,
    coverImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&auto=format&fit=crop&q=80",
    ratingAvg: 4.9,
    ratingCount: 32,
    salesCount: 185,
    category: { name: "Notion & Productivity", slug: "notion-templates" },
    variants: [
      {
        id: "v2-personal",
        name: "Bản Cá Nhân (Solo)",
        price: 790000,
        comparePrice: 1590000,
        licenseType: "personal",
        maxDownloads: 10,
        downloadExpiry: 365,
        description: "1 tài khoản Notion sử dụng trọn đời."
      },
      {
        id: "v2-team",
        name: "Bản Đội Nhóm (Team)",
        price: 1890000,
        comparePrice: 3500000,
        licenseType: "team",
        maxDownloads: 30,
        downloadExpiry: 730,
        description: "Dành cho đội nhóm tối đa 15 thành viên cùng làm việc."
      }
    ]
  },
  "cinematic-luts-pack": {
    id: "p3",
    title: "Cinematic Teal & Orange LUTs Pack cho Premiere & CapCut",
    slug: "cinematic-luts-pack",
    shortDescription: "Bộ 25 LUTs màu điện ảnh chuyên nghiệp cho video sáng tạo nội dung triệu view.",
    longDescription: `### 🎬 Nâng Cấp Chất Lượng Video Chuẩn Điện Ảnh

Bộ sưu tập 25 file `.cube` LUTs màu sắc cao cấp được tinh chỉnh riêng cho:
- **Phần mềm hỗ trợ**: Adobe Premiere Pro, Final Cut Pro, DaVinci Resolve, CapCut PC & Mobile.
- **Các hệ màu hỗ trợ**: Sony S-Log3, Canon C-Log, D-Cinelike (DJI), Rec.709 tiêu chuẩn và iPhone ProRes Log.`,
    basePrice: 490000,
    coverImage: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=1200&auto=format&fit=crop&q=80",
    ratingAvg: 4.8,
    ratingCount: 27,
    salesCount: 512,
    category: { name: "LUTs & Video Presets", slug: "presets-luts" },
    variants: [
      {
        id: "v3-personal",
        name: "Bản Cá Nhân",
        price: 490000,
        comparePrice: 990000,
        licenseType: "personal",
        maxDownloads: 10,
        downloadExpiry: 365,
        description: "Sử dụng cho các kênh video cá nhân."
      },
      {
        id: "v3-commercial",
        name: "Bản Thương Mại",
        price: 1290000,
        comparePrice: 2500000,
        licenseType: "commercial",
        maxDownloads: 50,
        downloadExpiry: 730,
        description: "Sử dụng cho video thương mại và sản xuất cho khách hàng."
      }
    ]
  }
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;

  let product: any = null;

  try {
    product = await db.product.findUnique({
      where: { slug },
      include: {
        variants: {
          where: { available: true },
          orderBy: { order: "asc" },
        },
        category: true,
        reviews: {
          where: { status: "published" },
          include: { user: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  } catch (err) {
    console.warn("DB query failed, checking fallback data...");
  }

  if (!product) {
    product = FALLBACK_PRODUCTS_DETAIL[slug] || FALLBACK_PRODUCTS_DETAIL["ai-flywheel-masterclass"];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/" className="hover:text-white transition-colors">Trang chủ</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-white transition-colors">Sản phẩm</Link>
        <span>/</span>
        <span className="text-slate-200 line-clamp-1">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Gallery & Description */}
        <div className="lg:col-span-7 space-y-8">
          {/* Main Cover */}
          <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-slate-900 border border-white/[0.08] shadow-2xl">
            <img
              src={product.coverImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80"}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Badges & Meta info */}
          <div className="space-y-4">
            {product.category && (
              <span className="text-xs font-bold text-cyan-400 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                {product.category.name}
              </span>
            )}
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
              {product.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1 text-amber-400 font-semibold">
                <Star className="w-4 h-4 fill-current" />
                <span>{product.ratingAvg ? product.ratingAvg.toFixed(1) : "5.0"}</span>
                <span>({product.ratingCount || 35} đánh giá)</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Download className="w-4 h-4 text-slate-500" />
                <span>{product.salesCount} lượt tải</span>
              </div>
            </div>
          </div>

          {/* Markdown Body */}
          <div className="glass-card p-6 md:p-8 space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/[0.08] pb-4">
              <Layers className="w-5 h-5 text-indigo-400" />
              Chi Tiết Sản Phẩm
            </h2>
            <div className="prose prose-invert max-w-none text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
              {product.longDescription || product.shortDescription}
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs space-y-1">
              <ShieldCheck className="w-5 h-5 text-emerald-400 mb-1" />
              <div className="font-bold text-white">An Toàn Tuyệt Đối</div>
              <div className="text-slate-400">File sạch, kiểm duyệt kỹ càng</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs space-y-1">
              <RefreshCw className="w-5 h-5 text-cyan-400 mb-1" />
              <div className="font-bold text-white">Cập Nhật Miễn Phí</div>
              <div className="text-slate-400">Tự động nhận bản nâng cấp mới</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs space-y-1">
              <Zap className="w-5 h-5 text-indigo-400 mb-1" />
              <div className="font-bold text-white">Tải Xuống Tức Thì</div>
              <div className="text-slate-400">Link signed URL bảo mật 1h</div>
            </div>
          </div>
        </div>

        {/* Right Column: Variant Selector & Purchase Box */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-24">
            <VariantSelector variants={product.variants || []} productTitle={product.title} />
          </div>
        </div>
      </div>
    </div>
  );
}
