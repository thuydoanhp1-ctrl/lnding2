import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/format";
import { CheckCircle, Clock, AlertTriangle, Download, ArrowRight } from "lucide-react";

interface OrderStatusPageProps {
  params: Promise<{ publicCode: string }>;
}

export default async function OrderStatusPage({ params }: OrderStatusPageProps) {
  const { publicCode } = await params;

  const order = await db.order.findUnique({
    where: { publicCode },
    include: {
      items: {
        include: {
          product: true,
          variant: true,
          downloadTokens: {
            include: { asset: true },
          },
        },
      },
    },
  });

  if (!order) {
    notFound();
  }

  const isPaid = order.status === "paid";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Status Card */}
      <div className="glass-card p-8 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center">
          {isPaid ? (
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/30">
              <CheckCircle className="w-10 h-10" />
            </div>
          ) : (
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-2xl border border-amber-500/30">
              <Clock className="w-10 h-10 animate-pulse" />
            </div>
          )}
        </div>

        <h1 className="text-2xl font-extrabold text-white">
          {isPaid ? "Đơn Hàng Đã Thanh Toán Thành Công" : "Đơn Hàng Đang Chờ Xác Nhận Thanh Toán"}
        </h1>

        <p className="text-xs text-slate-400 max-w-md mx-auto">
          Mã đơn hàng: <strong className="font-mono text-cyan-400">{order.publicCode}</strong> • Ngày tạo: {formatDate(order.createdAt)}
        </p>

        {isPaid && (
          <div className="pt-2">
            <Link href="/dashboard/library" className="btn-primary py-2.5 px-6 text-xs inline-flex items-center gap-2">
              <span>Đến Thư Viện Tải File</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Items & Downloads */}
      <div className="glass-card p-6 space-y-6">
        <h2 className="text-base font-bold text-white border-b border-white/[0.08] pb-3">
          Chi Tiết Sản Phẩm & Tệp Đính Kèm
        </h2>

        <div className="divide-y divide-white/[0.06]">
          {order.items.map((item) => (
            <div key={item.id} className="py-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-white text-sm">{item.productTitleSnap}</h3>
                  <div className="text-xs text-slate-400">Gói: {item.variantNameSnap}</div>
                </div>
                <div className="font-mono font-bold text-emerald-400 text-sm">
                  {formatCurrency(item.priceSnap)}
                </div>
              </div>

              {/* Download links if paid */}
              {isPaid && item.downloadTokens.length > 0 && (
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-2">
                  <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">
                    Tệp số sẵn sàng tải:
                  </span>
                  <div className="space-y-1.5">
                    {item.downloadTokens.map((token) => (
                      <div key={token.id} className="flex items-center justify-between">
                        <span className="text-xs text-slate-300 font-mono">{token.asset.name}</span>
                        <a
                          href={`/api/download/${token.token}`}
                          className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Tải về</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
