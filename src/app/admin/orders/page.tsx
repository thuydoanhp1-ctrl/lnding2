import { db } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/format";
import { OrderActionButtons } from "@/components/admin/OrderActionButtons";

const FALLBACK_ADMIN_ORDERS = [
  {
    id: "o1",
    publicCode: "ORD-9X82F1",
    buyerName: "Trần Minh",
    buyerEmail: "tranminh@gmail.com",
    total: 1990000,
    paymentMemo: "ORD-9X82F1",
    status: "pending",
    createdAt: new Date(),
  },
  {
    id: "o2",
    publicCode: "ORD-4K11M7",
    buyerName: "Lê Hoàng",
    buyerEmail: "lehoang.agency@gmail.com",
    total: 4990000,
    paymentMemo: "ORD-4K11M7",
    status: "paid",
    createdAt: new Date(Date.now() - 3600000),
  },
  {
    id: "o3",
    publicCode: "ORD-2P55Q8",
    buyerName: "Vũ Tuấn",
    buyerEmail: "tuanvu.ai@gmail.com",
    total: 790000,
    paymentMemo: "ORD-2P55Q8 FORGE88",
    status: "pending",
    createdAt: new Date(Date.now() - 7200000),
  },
  {
    id: "o4",
    publicCode: "ORD-7H33K2",
    buyerName: "Nguyễn Thị Hoa",
    buyerEmail: "hoanguyen@gmail.com",
    total: 490000,
    paymentMemo: "ORD-7H33K2",
    status: "paid",
    createdAt: new Date(Date.now() - 14400000),
  }
];

export default async function AdminOrdersPage() {
  let orders: any[] = [];

  try {
    const dbOrders = await db.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" },
    });
    if (dbOrders.length > 0) {
      orders = dbOrders;
    }
  } catch (err) {
    console.warn("DB not ready, displaying mock admin orders...");
  }

  if (orders.length === 0) {
    orders = FALLBACK_ADMIN_ORDERS;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Quản Lý Đơn Hàng</h1>
        <p className="text-xs text-slate-400 mt-1">Danh sách toàn bộ đơn hàng và đối soát thanh toán VietQR</p>
      </div>

      <div className="glass-card overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-white/[0.04] text-slate-300 font-bold border-b border-white/[0.06]">
            <tr>
              <th className="p-4">Mã Đơn</th>
              <th className="p-4">Khách Hàng</th>
              <th className="p-4">Tổng Tiền</th>
              <th className="p-4">Nội Dung Memo</th>
              <th className="p-4">Ngày Tạo</th>
              <th className="p-4 text-right">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04] text-slate-300">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-white/[0.02]">
                <td className="p-4 font-mono font-bold text-cyan-400">{order.publicCode}</td>
                <td className="p-4">
                  <div className="font-semibold text-white">{order.buyerName}</div>
                  <div className="text-slate-400 text-[11px]">{order.buyerEmail}</div>
                </td>
                <td className="p-4 font-mono font-bold text-emerald-400">{formatCurrency(order.total)}</td>
                <td className="p-4 font-mono text-amber-400 bg-black/20">{order.paymentMemo}</td>
                <td className="p-4 text-slate-400">{formatDate(order.createdAt)}</td>
                <td className="p-4 text-right">
                  <OrderActionButtons orderId={order.id} status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
