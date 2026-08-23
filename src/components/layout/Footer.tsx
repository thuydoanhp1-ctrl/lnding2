import Link from "next/link";
import { env } from "@/lib/env";

export function Footer() {
  const siteName = env.NEXT_PUBLIC_SITE_NAME || "Digital Forge";

  return (
    <footer className="mt-auto bg-[#04060a] border-t border-white/[0.06] text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
                ⚡
              </div>
              <span className="font-bold text-lg text-white">{siteName}</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Nền tảng phân phối sản phẩm số, template và công cụ AI tự động hóa chất lượng cao cho nhà sáng tạo và doanh nghiệp.
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-xs uppercase tracking-wider">Khám Phá</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/products" className="hover:text-white transition-colors">Tất cả sản phẩm</Link></li>
              <li><Link href="/categories/ai-prompts-agents" className="hover:text-white transition-colors">AI Prompts & Agents</Link></li>
              <li><Link href="/categories/notion-templates" className="hover:text-white transition-colors">Notion Templates</Link></li>
              <li><Link href="/categories/code-ui-kits" className="hover:text-white transition-colors">Code & UI Kits</Link></li>
            </ul>
          </div>

          {/* User */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-xs uppercase tracking-wider">Tài Khoản</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/dashboard/library" className="hover:text-white transition-colors">Thư viện của tôi</Link></li>
              <li><Link href="/dashboard/orders" className="hover:text-white transition-colors">Lịch sử đơn hàng</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Tiếp thị liên kết (10%)</Link></li>
              <li><Link href="/dashboard/settings" className="hover:text-white transition-colors">Cài đặt tài khoản</Link></li>
            </ul>
          </div>

          {/* Legal & Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-xs uppercase tracking-wider">Thông Tin</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Chính sách bảo mật</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Điều khoản dịch vụ</Link></li>
              <li><Link href="/refund-policy" className="hover:text-white transition-colors">Chính sách hoàn tiền</Link></li>
              <li><span className="text-slate-500">Hỗ trợ: {env.EMAIL_REPLY_TO}</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>© {new Date().getFullYear()} {siteName}. 100% Serverless trên Vercel & Supabase.</div>
          <div>Bảo mật thanh toán qua VietQR Sepay tự động.</div>
        </div>
      </div>
    </footer>
  );
}
