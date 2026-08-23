import Link from "next/link";
import { auth } from "@/auth";
import { ShoppingBag, User as UserIcon, Shield, Sparkles } from "lucide-react";

export async function Navbar() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-50 bg-[#07090e]/80 backdrop-blur-xl border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">
            DIGITAL<span className="text-cyan-400">FORGE</span>
          </span>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <Link href="/products" className="hover:text-white transition-colors">
            Sản Phẩm Số
          </Link>
          <Link href="/categories/ai-prompts-agents" className="hover:text-white transition-colors flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            AI Agents
          </Link>
          <Link href="/categories/notion-templates" className="hover:text-white transition-colors">
            Notion
          </Link>
          <Link href="/categories/code-ui-kits" className="hover:text-white transition-colors">
            Code & UI
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Cart Icon */}
          <Link
            href="/cart"
            className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-slate-200 transition-colors relative"
            aria-label="Giỏ hàng"
          >
            <ShoppingBag className="w-5 h-5" />
          </Link>

          {/* User / Auth State */}
          {user ? (
            <div className="flex items-center gap-3">
              {user.isAdmin && (
                <Link
                  href="/admin/dashboard"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin
                </Link>
              )}
              <Link
                href="/dashboard"
                className="flex items-center gap-2 p-1.5 pl-3 rounded-xl bg-white/[0.05] border border-white/[0.08] hover:border-indigo-500/40 text-sm font-medium text-white transition-all"
              >
                <span className="hidden sm:inline">{user.name || "Tài khoản"}</span>
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "Avatar"}
                    className="w-7 h-7 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-xs font-bold">
                    {user.name ? user.name[0].toUpperCase() : "U"}
                  </div>
                )}
              </Link>
            </div>
          ) : (
            <Link href="/login" className="btn-primary py-2 px-4 text-sm rounded-xl">
              <UserIcon className="w-4 h-4" />
              Đăng Nhập
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
