import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { VariantSelector } from "@/components/store/VariantSelector";
import { Star, Download, ShieldCheck, RefreshCw, Layers } from "lucide-react";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;

  const product = await db.product.findUnique({
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

  if (!product || product.status !== "published") {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
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
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
              {product.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1 text-amber-400 font-semibold">
                <Star className="w-4 h-4 fill-current" />
                <span>{product.ratingAvg ? product.ratingAvg.toFixed(1) : "5.0"}</span>
                <span>({product.ratingCount || 12} đánh giá)</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Download className="w-4 h-4 text-slate-500" />
                <span>{product.salesCount} lượt tải</span>
              </div>
            </div>
          </div>

          {/* Markdown Body */}
          <div className="glass-card p-8 space-y-6">
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
              <div className="text-slate-400">Không virus, đã kiểm tra kỹ</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs space-y-1">
              <RefreshCw className="w-5 h-5 text-cyan-400 mb-1" />
              <div className="font-bold text-white">Cập Nhật Miễn Phí</div>
              <div className="text-slate-400">Tự động nhận bản mới</div>
            </div>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs space-y-1">
              <Download className="w-5 h-5 text-indigo-400 mb-1" />
              <div className="font-bold text-white">Tải Xuống Tức Thì</div>
              <div className="text-slate-400">Link signed URL serverless</div>
            </div>
          </div>
        </div>

        {/* Right Column: Variant Selector & Purchase Box */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-24">
            <VariantSelector variants={product.variants} productTitle={product.title} />
          </div>
        </div>
      </div>
    </div>
  );
}
