"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  PlusCircle, 
  Settings,
  ArrowUpRight, 
  Package,
  LogOut,
  Menu, 
  X,     
  Layers
} from "lucide-react";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

export default function ManagementLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const { data: session } = useSession();
  
  // Mobile drawer state control
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "All Orders", href: "/orders", icon: ShoppingBag },
    { label: "All Products", href: "/products", icon: Package },
    { label: "Add Product", href: "/products/add", icon: PlusCircle },
    { label: "Categories", href: "/categories", icon: Layers },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="bg-[#FAF9F6] text-slate-900 flex min-h-screen font-sans selection:bg-[#D4AF37]/20 relative">
      
      {/* 1. MOBILE & TABLET TOP HEADER BAR */}
      {!isLoginPage && (
        <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#7B2D0A] flex items-center justify-between px-4 z-40 shadow-md">
          
          <button 
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="text-white p-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            {isDrawerOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="h-8 w-32 relative">
            <Image 
              src="/bannira_web_logo.png" 
              fill
              alt="logo" 
              className="object-contain"
              priority
            />
          </div>

          {/* RIGHT: Quick External Logout */}
          <button 
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-white p-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            title="Instant Logout"
          >
            <LogOut size={22} className="text-slate-200 hover:text-[#D4AF37] transition-colors" />
          </button>
        </header>
      )}

      {/* 2. SIDEBAR / DRAWER INTERFACE */}
      {!isLoginPage && (
        <>
          {isDrawerOpen && (
            <div 
              className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300"
              onClick={() => setIsDrawerOpen(false)}
            />
          )}

          <aside className={`
            w-72 bg-[#7B2D0A] fixed h-full flex flex-col border-r border-slate-100/80 shadow-[10px_0_40px_-20px_rgba(0,0,0,0.03)] z-50
            transition-transform duration-300 ease-in-out
            ${isDrawerOpen ? "translate-x-0" : "-translate-x-full"} 
            lg:translate-x-0
          `}>
            
            <div className="p-8 mb-4 flex items-center justify-between">
              <Image 
                src="/bannira_web_logo.png" 
                height={50} 
                width={200} 
                alt="logo" 
                className="h-[100] w-[200]"
              />
              
              {/* <button 
                onClick={() => setIsDrawerOpen(false)}
                className="lg:hidden text-white/70 hover:text-white p-1 hover:bg-white/10 rounded-lg"
              >
                <X size={20} />
              </button> */}
            </div>

            <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsDrawerOpen(false)} // Shuts drawer overlay down automatically on navigation change
                    className={`flex items-center justify-between px-4 py-4 rounded-2xl transition-all duration-300 group ${
                      isActive 
                        ? "bg-slate-50 text-zinc-900 shadow-sm" 
                        : "text-slate-400 hover:bg-slate-50/80 hover:text-zinc-200"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <item.icon 
                        size={20} 
                        strokeWidth={isActive ? 2 : 1.5} 
                        className={isActive ? "text-[#D4AF37]" : "text-slate-300 group-hover:text-slate-100"} 
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

            <div className="p-4 mt-auto border-t border-white/10">
              <div className="flex items-center justify-between gap-2 p-3 rounded-2xl bg-white/5 backdrop-blur-sm">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 shrink-0 rounded-full bg-[#D4AF37] flex items-center justify-center text-white font-bold text-xs shadow-lg">
                    {session?.user?.name?.[0] || "A"}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-[10px] font-black uppercase tracking-tight text-white truncate">
                      {session?.user?.name || "Admin"}
                    </span>
                    <span className="text-[8px] font-medium text-slate-300 truncate">
                      {session?.user?.email}
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors group cursor-pointer"
                  title="Logout"
                >
                  <LogOut size={18} className="text-slate-300 group-hover:text-[#D4AF37]" />
                </button>
              </div>
            </div>
          </aside>
        </>
      )}

      <main className={`
        flex-1 min-h-screen transition-all duration-300
        ${isLoginPage 
          ? "ml-0 p-0" 
          : "ml-0 lg:ml-72 pt-24 p-6 lg:p-12 bg-slate-100"
        }
      `}>
        {children}
      </main>
    </div>
  );
}