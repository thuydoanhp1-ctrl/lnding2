import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import { ProductWithVariants } from "@/types";
import { Star, Download } from "lucide-react";

interface ProductCardProps {
  product: ProductWithVariants;
}

export function ProductCard({ product }: ProductCardProps) {
  const minPrice = product.basePrice || (product.variants?.[0]?.price ?? 0);
  const comparePrice = product.variants?.[0]?.comparePrice;

  return (
    <div className="glass-card group overflow-hidden flex flex-col justify-between">
      <div>
        {/* Cover Image Container */}
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
          <img
            src={product.coverImage || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {product.category && (
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-semibold text-cyan-400">
              {product.category.name}
            </div>
          )}

          {product.featured && (
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-indigo-500/80 backdrop-blur-md text-white text-xs font-bold shadow-lg shadow-indigo-500/30">
              🔥 Nổi bật
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Rating & Sales */}
          <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
            <div className="flex items-center gap-1 text-amber-400 font-semibold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{product.ratingAvg ? product.ratingAvg.toFixed(1) : "5.0"}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>{product.salesCount} lượt mua</span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-bold text-white text-base leading-snug group-hover:text-cyan-400 transition-colors line-clamp-2 mb-2">
              {product.title}
            </h3>
          </Link>

          {/* Short Description */}
          {product.shortDescription && (
            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
              {product.shortDescription}
            </p>
          )}
        </div>
      </div>

      {/* Footer Price & Action */}
      <div className="p-5 pt-0 flex items-center justify-between border-t border-white/[0.04] mt-2">
        <div>
          {comparePrice && comparePrice > minPrice && (
            <div className="text-xs text-slate-500 line-through">
              {formatCurrency(comparePrice)}
            </div>
          )}
          <div className="text-base font-extrabold text-emerald-400 font-mono">
            {formatCurrency(minPrice)}
          </div>
        </div>

        <Link
          href={`/products/${product.slug}`}
          className="px-3.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-indigo-600 hover:text-white text-slate-300 text-xs font-semibold border border-white/[0.08] transition-all"
        >
          Xem Chi Tiết &rarr;
        </Link>
      </div>
    </div>
  );
}
