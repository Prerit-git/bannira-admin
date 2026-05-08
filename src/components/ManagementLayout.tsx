"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  PlusCircle, 
  Users, 
  Settings,
  ArrowUpRight, 
  ArrowRightLeft,
  Package
} from "lucide-react";
import Image from "next/image";

export default function ManagementLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "All Orders", href: "/orders", icon: ShoppingBag },
    { label: "All Products", href: "/products", icon: Package },
    { label: "Add Product", href: "/products/add", icon: PlusCircle },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="bg-[#FAF9F6] text-slate-900 flex min-h-screen font-sans selection:bg-[#D4AF37]/20">
      <aside className="w-72 bg-[#7B2D0A] fixed h-full flex flex-col border-r border-slate-100/80 shadow-[10px_0_40px_-20px_rgba(0,0,0,0.03)] z-50">
        <div className="p-8 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Management</span>
          </div>
          <h1 className="text-2xl font-serif font-bold tracking-tighter text-zinc-900">
            <Image src={"/bannira_web_logo.png"} height={50} width={200} alt="logo" className="h-[100] w-[200]"/>
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-4 py-4 rounded-2xl transition-all duration-300 group ${
                  isActive 
                    ? "bg-slate-50 text-zinc-900 shadow-sm" 
                    : "text-slate-400 hover:bg-slate-50/80 hover:text-zinc-600"
                }`}
              >
                <div className="flex items-center gap-4">
                  <item.icon 
                    size={20} 
                    strokeWidth={isActive ? 2 : 1.5} 
                    className={isActive ? "text-[#D4AF37]" : "text-slate-300 group-hover:text-slate-400"} 
                  />
                  <span className="text-[11px] font-black uppercase tracking-widest">
                    {item.label}
                  </span>
                </div>
                {isActive && <ArrowUpRight size={14} className="text-[#D4AF37]" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 mt-auto border-t border-slate-50">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/50">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center text-white font-bold text-xs">
              B
            </div>
            <div className="flex flex-col">
              {/* <span className="text-xs font-black uppercase tracking-tighter text-zinc-800">Prerit</span> */}
              <span className="text-[9px] font-bold text-white uppercase">Administrator</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 ml-72 p-12 min-h-screen bg-slate-100">
        {children}
      </main>
    </div>
  );
}