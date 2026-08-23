import { requireUser } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/format";
import Link from "next/link";
import { DownloadCloud, Download, AlertCircle, Calendar } from "lucide-react";

export default async function LibraryPage() {
  const user = await requireUser();

  const orders = await db.order.findMany({
    where: { userId: user.id, status: "paid" },
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
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Thư Viện Sản Phẩm Đã Mua</h1>
        <p className="text-xs text-slate-400 mt-1">
          Toàn bộ file số, template và tài liệu bản quyền thuộc sở hữu tài khoản của bạn.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="glass-card p-12 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <DownloadCloud className="w-6 h-6" />
          </div>
          <p className="text-slate-400 text-sm">Bạn chưa có sản phẩm số nào trong thư viện.</p>
          <Link href="/products" className="btn-primary py-2.5 px-6 text-xs inline-flex">
            Khám phá sản phẩm ngay
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="glass-card p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/[0.06] text-xs">
                <span className="font-mono text-cyan-400 font-bold">Mã đơn: {order.publicCode}</span>
                <span className="text-slate-400">Mua ngày: {formatDate(order.paidAt || order.createdAt)}</span>
              </div>

              <div className="divide-y divide-white/[0.04]">
                {order.items.map((item) => (
                  <div key={item.id} className="py-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-white text-base">{item.productTitleSnap}</h3>
                        <span className="text-xs text-slate-400">Gói: {item.variantNameSnap}</span>
                      </div>
                    </div>

                    {/* Download Tokens */}
                    <div className="space-y-2">
                      {item.downloadTokens.map((token) => {
                        const isExpired = new Date(token.expiresAt) < new Date();
                        const isMax = token.maxDownloads !== -1 && token.downloadCount >= token.maxDownloads;
                        const canDownload = !token.revoked && !isExpired && !isMax;

                        return (
                          <div
                            key={token.id}
                            className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div className="space-y-1">
                              <div className="font-mono text-sm font-semibold text-white">
                                {token.asset.name}
                              </div>
                              <div className="flex items-center gap-3 text-xs text-slate-400">
                                <span>
                                  Lượt tải: <strong>{token.downloadCount}</strong> /{" "}
                                  {token.maxDownloads === -1 ? "Không giới hạn" : token.maxDownloads}
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                                  Hết hạn: {formatDate(token.expiresAt)}
                                </span>
                              </div>
                            </div>

                            {canDownload ? (
                              <a
                                href={`/api/download/${token.token}`}
                                className="btn-primary py-2 px-4 text-xs inline-flex items-center gap-2 self-start sm:self-auto"
                              >
                                <Download className="w-4 h-4" />
                                <span>Tải Về Máy</span>
                              </a>
                            ) : (
                              <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5 self-start sm:self-auto">
                                <AlertCircle className="w-4 h-4" />
                                {isExpired ? "Đã hết hạn" : isMax ? "Đã hết lượt tải" : "Đã bị thu hồi"}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
