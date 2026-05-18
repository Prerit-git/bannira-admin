"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShoppingBag, Users, Package, Bell, AlertTriangle, ChevronRight, 
  IndianRupee, Loader2, Sparkles, UserPlus, User, Clock
} from "lucide-react";

export default function Dashboard() {
  const [data, setData] = useState({
    revenue: 0,
    ordersCount: 0,
    usersCount: 0,
    productsCount: 0,
    recentActivity: [] as any[],
    lowStockItems: [] as any[],
    totalStockUnits: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [orderRes, productRes, userRes] = await Promise.all([
          fetch("/api/orders"),
          fetch("/api/products"),
          fetch("/api/users")
        ]);

        const orders = orderRes.ok ? await orderRes.json() : [];
        const products = productRes.ok ? await productRes.json() : [];
        const users = userRes.ok ? await userRes.json() : [];

        // Dynamic Calculations
        const totalRevenue = orders.reduce((acc: number, curr: any) => acc + (curr.totalAmount || 0), 0);
        const lowStock = products.filter((p: any) => p.quantity < 5);
        const totalUnits = products.reduce((acc: number, curr: any) => acc + (curr.quantity || 0), 0);

        // Combine Latest Orders & Users for Activity Feed
        const combinedActivity = [
          ...orders.slice(0, 3).map((o: any) => ({ ...o, type: 'order' })),
          ...users.slice(0, 2).map((u: any) => ({ ...u, type: 'user' }))
        ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setData({
          revenue: totalRevenue,
          ordersCount: orders.length,
          usersCount: users.length,
          productsCount: products.length,
          recentActivity: combinedActivity,
          lowStockItems: lowStock,
          totalStockUnits: totalUnits
        });
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#F8F5F2] p-4">
      <Loader2 className="animate-spin text-[#B8945A] mb-4" size={40} />
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#B8945A] text-center">Bannira Dashboard Initializing...</p>
    </div>
  );

  return (
    <div className="min-h-screen p-0 md:p-6 lg:p-8 font-sans text-slate-800 animate-in fade-in duration-700">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 md:mb-12">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={14} className="text-[#B8945A]" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#B8945A]">
              Admin Command Center
            </p>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif font-medium text-[#2D2D2D]">
            Bannira Dashboard
          </h1>
        </div>

        <div className="hidden md:flex items-center gap-3 sm:gap-4 self-end sm:self-auto">
          <button className="relative w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-2xl bg-white border border-[#EFECE8] text-slate-400 hover:text-[#B8945A] transition-all shadow-sm cursor-pointer">
            <Bell size={20} />
            <span className="absolute top-3 right-3 w-2 h-2 bg-[#B8945A] rounded-full border-2 border-white"></span>
          </button>
          <div className="w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-[#2D2D2D] text-[#B8945A] flex items-center justify-center font-serif text-xl shadow-lg border-2 border-white">
            <User size={20} />
          </div>
        </div>
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
        <StatCard
          title="TOTAL REVENUE"
          value={`₹${data.revenue.toLocaleString()}`}
          trend="+12%"
          icon={<IndianRupee size={20} />}
          trendUp={true}
        />
        <StatCard
          title="ORDERS"
          value={data.ordersCount}
          trend="Live"
          icon={<ShoppingBag size={20} />}
          trendUp={true}
        />
        <StatCard
          title="TOTAL USERS"
          value={data.usersCount}
          trend="+ new"
          icon={<Users size={20} />}
          trendUp={true}
        />
        <StatCard
          title="INVENTORY"
          value={data.productsCount.toString().padStart(2, "0")}
          trend={`${data.lowStockItems.length} alerts`}
          icon={<Package size={20} />}
          trendUp={false}
          color={data.lowStockItems.length > 0 ? "text-red-500" : ""}
        />
      </div>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        
        {/* RECENT ACTIVITY CARD */}
        <div className="lg:col-span-8 bg-white rounded-[2rem] md:rounded-[2.5rem] p-5 sm:p-8 md:p-10 shadow-sm border border-[#EFECE8]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 md:mb-10">
            <div>
              <h2 className="text-lg md:text-xl font-serif font-bold text-[#2D2D2D]">
                Recent Activity
              </h2>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mt-1">
                Real-time updates
              </p>
            </div>
            <Link
              href="/orders"
              className="text-[10px] font-black uppercase tracking-widest text-[#B8945A] hover:bg-[#B8945A]/5 px-4 py-2 rounded-xl transition-all self-start sm:self-auto"
            >
              View All Orders
            </Link>
          </div>

          <div className="space-y-0 overflow-hidden">
            {data.recentActivity.map((item, i) => (
              <ActivityItem key={i} item={item} />
            ))}
            {data.recentActivity.length === 0 && (
              <div className="py-16 md:py-20 text-center text-slate-300 uppercase text-[10px] font-bold tracking-[0.2em]">
                No recent store activity
              </div>
            )}
          </div>
        </div>

        {/* INVENTORY SIDEBAR */}
        <div className="lg:col-span-4 space-y-6 md:space-y-8">
          <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-8 border border-[#EFECE8] shadow-sm">
            <h3 className="text-md md:text-lg font-serif font-bold text-[#2D2D2D] mb-6">
              Stock Analysis
            </h3>

            <div className="space-y-6">
              <div className="p-5 bg-[#FAF9F6] rounded-3xl border border-[#EFECE8] relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Total Stock Units
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-slate-800">
                    {data.totalStockUnits.toLocaleString()}
                  </p>
                </div>
                <Package className="absolute -right-4 -bottom-4 text-slate-200/50 w-16 h-16 md:w-20 md:h-20" />
              </div>

              {/* Low Stock Alerts */}
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B8945A] mb-4 flex items-center gap-2">
                  <AlertTriangle size={12} /> Stock Alerts
                </p>
                <div className="space-y-3">
                  {data.lowStockItems.slice(0, 4).map((item: any) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-white rounded-2xl border border-[#EFECE8] hover:border-[#B8945A]/30 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 shadow-sm shrink-0">
                        <Package size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">
                          {item.name}
                        </p>
                        <p className="text-[9px] text-red-500 font-black uppercase mt-0.5">
                          {item.quantity} Units Left
                        </p>
                      </div>
                      <Link href={`/products/edit/${item._id}`} className="shrink-0">
                        <ChevronRight
                          size={14}
                          className="text-slate-300 group-hover:text-[#B8945A] transition-all"
                        />
                      </Link>
                    </div>
                  ))}
                  {data.lowStockItems.length === 0 && (
                    <div className="p-6 text-center border-2 border-dashed border-slate-100 rounded-3xl">
                      <p className="text-[9px] font-black text-green-500 uppercase tracking-widest italic">
                        Inventory Health: Optimal
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Link
              href="/products"
              className="block w-full mt-6 md:mt-8 py-4 bg-[#2D2D2D] text-white text-center rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg"
            >
              Manage Warehouse
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value, trend, trendUp, icon, color }: any) {
  return (
    <div className="bg-white p-5 md:p-7 rounded-[2rem] border border-[#EFECE8] shadow-sm hover:shadow-md transition-all group">
      <div className="flex justify-between items-start mb-2">
        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{title}</p>
        <div className="p-2 md:p-2.5 bg-[#F8F5F2] rounded-xl text-slate-400 group-hover:text-[#B8945A] transition-colors shrink-0">{icon}</div>
      </div>
      <h3 className={`text-xl md:text-2xl font-serif font-bold ${color || "text-[#2D2D2D]"}`}>{value}</h3>
      <div className={`mt-2 text-[10px] font-bold ${trendUp ? "text-emerald-500" : "text-orange-500"} uppercase tracking-tighter truncate`}>
        {trendUp ? "↑" : "↓"} {trend} <span className="text-slate-300 ml-1 font-medium">v/s last period</span>
      </div>
    </div>
  );
}

function ActivityItem({ item }: any) {
  const isOrder = item.type === 'order';
  return (
    <div className="flex items-start gap-4 md:gap-6 group cursor-default">
      <div className={`w-11 h-11 md:w-12 md:h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-all z-10 ${isOrder ? "bg-[#B8945A]/10 text-[#B8945A]" : "bg-blue-50 text-blue-500"}`}>
        {isOrder ? <ShoppingBag size={20} /> : <UserPlus size={20} />}
      </div>
      <div className="flex-1 pb-6 md:pb-8  ml-[-30px] md:ml-[-34px] pl-11 md:pl-14 group-last:border-none min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5 sm:mb-1">
          <h4 className="text-xs md:text-sm font-bold text-slate-800">{isOrder ? "New Order" : "New Registration"}</h4>
          <span className="text-[9px] md:text-[10px] font-medium text-slate-400 flex items-center gap-1 sm:gap-1.5 whitespace-nowrap">
            <Clock size={11} className="text-[#B8945A]" /> 
            {new Date(item.createdAt).toLocaleDateString('en-GB', { 
              day: '2-digit', 
              month: 'short' 
            })} 
            <span className="opacity-30">•</span>
            {new Date(item.createdAt).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            })}
          </span>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed truncate-2-lines">
          {isOrder ? (
            <>User <span className="font-bold text-slate-700">{item.customerName}</span> spent <span className="font-bold text-[#B8945A]">₹{item.totalAmount}</span></>
          ) : (
            <><span className="font-bold text-slate-700">{item.name}</span> joined the Bannira Circle</>
          )}
        </p>
      </div>
    </div>
  );
}