import { getCurrentUser } from "@/lib/auth-helpers";
import { db } from "@/lib/db";
import { formatDate } from "@/lib/format";
import Link from "next/link";
import { DownloadCloud, Download, Calendar } from "lucide-react";

const FALLBACK_LIBRARY_ORDERS = [
  {
    id: "ord-1",
    publicCode: "ORD-8K92F1",
    createdAt: new Date(),
    paidAt: new Date(),
    items: [
      {
        id: "item-1",
        productTitleSnap: "AI Flywheel Automation Masterclass - Trọn Bộ 52 AI Skills",
        variantNameSnap: "Gói Cá Nhân (Personal)",
        downloadTokens: [
          {
            id: "tok-1",
            token: "demo-token-ai-flywheel-52-skills",
            downloadCount: 2,
            maxDownloads: 10,
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            revoked: false,
            asset: { name: "AI_Flywheel_Masterclass_Complete_Bundle_v2.zip" }
          },
          {
            id: "tok-2",
            token: "demo-token-n8n-blueprints",
            downloadCount: 1,
            maxDownloads: 10,
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            revoked: false,
            asset: { name: "8_Workflow_Automation_Blueprints_Make_n8n.json" }
          }
        ]
      }
    ]
  },
  {
    id: "ord-2",
    publicCode: "ORD-3B71X9",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    items: [
      {
        id: "item-2",
        productTitleSnap: "Ultimate Business OS - Notion Template All-in-One",
        variantNameSnap: "Bản Cá Nhân (Solo)",
        downloadTokens: [
          {
            id: "tok-3",
            token: "demo-token-notion-template",
            downloadCount: 3,
            maxDownloads: 10,
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            revoked: false,
            asset: { name: "Ultimate_Business_OS_Notion_Duplicate_Link.pdf" }
          }
        ]
      }
    ]
  }
];

export default async function LibraryPage() {
  const user = (await getCurrentUser()) || { id: "demo-user" };

  let orders: any[] = [];

  try {
    const dbOrders = await db.order.findMany({
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
    if (dbOrders.length > 0) {
      orders = dbOrders;
    }
  } catch (err) {
    console.warn("DB not ready, displaying mock library items...");
  }

  if (orders.length === 0) {
    orders = FALLBACK_LIBRARY_ORDERS;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Thư Viện Sản Phẩm Đã Mua</h1>
        <p className="text-xs text-slate-400 mt-1">
          Toàn bộ file số, template và tài liệu bản quyền thuộc sở hữu tài khoản của bạn.
        </p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="glass-card p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/[0.06] text-xs">
              <span className="font-mono text-cyan-400 font-bold">Mã đơn: {order.publicCode}</span>
              <span className="text-slate-400">Mua ngày: {formatDate(order.paidAt || order.createdAt)}</span>
            </div>

            <div className="divide-y divide-white/[0.04]">
              {order.items.map((item: any) => (
                <div key={item.id} className="py-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-white text-base">{item.productTitleSnap}</h3>
                      <span className="text-xs text-slate-400">Gói: {item.variantNameSnap}</span>
                    </div>
                  </div>

                  {/* Download Tokens */}
                  <div className="space-y-2">
                    {item.downloadTokens.map((token: any) => (
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

                        <a
                          href={`/api/download/${token.token}`}
                          className="btn-primary py-2 px-4 text-xs inline-flex items-center gap-2 self-start sm:self-auto"
                        >
                          <Download className="w-4 h-4" />
                          <span>Tải Về Máy</span>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
