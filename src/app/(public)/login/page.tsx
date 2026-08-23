import Link from "next/link";
import { Lock, Sparkles, ShieldCheck } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="glass-card p-8 text-center space-y-6">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
          <Lock className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-white">Đăng Nhập Tài Khoản</h1>
          <p className="text-xs text-slate-400">
            Truy cập thư viện sản phẩm số, lịch sử đơn hàng và bảng điều khiển tiếp thị liên kết.
          </p>
        </div>

        {/* Demo Fast Access Button */}
        <div className="space-y-3 pt-2">
          <Link
            href="/dashboard"
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Trải Nghiệm Dashboard (Bản Demo)</span>
          </Link>

          <Link
            href="/admin/dashboard"
            className="w-full py-3 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 border border-white/10 transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Trải Nghiệm Trang Quản Trị Admin CMS</span>
          </Link>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-white/[0.08] w-full" />
          <span className="bg-[#07090e] px-3 text-[11px] text-slate-500 uppercase tracking-wider relative">
            hoặc Google OAuth
          </span>
        </div>

        <button
          type="button"
          onClick={() => alert("Chế độ Google OAuth Production sẽ kích hoạt khi bạn cấu hình AUTH_GOOGLE_ID trong biến môi trường. Hiện tại bạn có thể dùng nút 'Trải Nghiệm Dashboard (Bản Demo)' ở trên để xem đầy đủ mọi tính năng!")}
          className="w-full py-3 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 font-medium text-xs flex items-center justify-center gap-3 border border-white/10 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Đăng nhập bằng Google Account</span>
        </button>

        <p className="text-[11px] text-slate-500">
          Hệ thống bảo mật 100% Serverless trên Vercel & Supabase.
        </p>
      </div>
    </div>
  );
}
