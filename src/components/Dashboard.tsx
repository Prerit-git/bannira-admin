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

        const rawOrders = orderRes.ok ? await orderRes.json() : [];
        const products = productRes.ok ? await productRes.json() : [];
        const users = userRes.ok ? await userRes.json() : [];

        // 🔥 CRITICAL CHANGE: Sirf vahi orders filter karein jinka orderStatus "Processing" hai
        const orders = rawOrders.filter((curr: any) => curr.orderStatus === "Processing");

        // Dynamic Calculations (Ab sirf "Processing" orders ke basis par calculations hongi)
        const totalRevenue = orders.reduce((acc: number, curr: any) => acc + (curr.totalAmount || 0), 0);
        const lowStock = products.filter((p: any) => p.quantity < 5);
        const totalStock = products.reduce((acc: number, curr: any) => acc + (curr.quantity || 0), 0);

        // Combine and Sort Recent Activity
        const combinedActivity = [
          ...orders.map((o: any) => ({ ...o, type: "order" })),
          ...users.map((u: any) => ({ ...u, type: "user" }))
        ].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        setData({
          revenue: totalRevenue,
          ordersCount: orders.length,
          usersCount: users.length,
          productsCount: products.length,
          recentActivity: combinedActivity.slice(0, 5),
          lowStockItems: lowStock,
          totalStockUnits: totalStock
        });
      } catch (error) {
        console.error("Dashboard Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-[#B8945A]" size={40} />
          <p className="text-sm font-medium text-slate-500 animate-pulse">Loading dashboard insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 md:p-0 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Dashboard Overview</h1>
            <Sparkles size={18} className="text-[#B8945A] hidden sm:block animate-pulse" />
          </div>
          <p className="text-xs md:text-sm font-medium text-slate-400 uppercase tracking-wider">Real-time business performance & metrics</p>
        </div>
        {/* <div className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-2xl shadow-sm border border-slate-100 self-start md:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Live System Sync</span>
        </div> */}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <StatCard 
          title="Total Revenue" 
          value={`₹${data.revenue.toLocaleString()}`} 
          icon={<IndianRupee size={22} />} 
          color="bg-emerald-50 text-emerald-600 border-emerald-100"
          link="/admin/orders"
        />
        <StatCard 
          title="Total Orders"
          value={data.ordersCount.toString()} 
          icon={<ShoppingBag size={22} />} 
          color="bg-blue-50 text-blue-600 border-blue-100"
          link="/admin/orders"
        />
        <StatCard 
          title="Total Customers" 
          value={data.usersCount.toString()} 
          icon={<Users size={22} />} 
          color="bg-purple-50 text-purple-600 border-purple-100"
          link="/admin/customers"
        />
        <StatCard 
          title="Total Products" 
          value={`${data.productsCount} (${data.totalStockUnits} units)`} 
          icon={<Package size={22} />} 
          color="bg-amber-50 text-amber-600 border-amber-100"
          link="/admin/products"
        />
      </div>

      {/* Secondary Row Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
        {/* Recent Activity Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100/80">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-xl text-slate-700">
                <Bell size={18} />
              </div>
              <div>
                <h3 className="text-sm md:text-base font-extrabold text-slate-800 tracking-tight">Recent Activity</h3>
                <p className="text-[10px] md:text-xs text-slate-400 font-medium">Latest interactions across platform</p>
              </div>
            </div>
          </div>

          <div className="relative ml-0 md:ml-5 space-y-1">
            {data.recentActivity.length > 0 ? (
              data.recentActivity.map((item, idx) => {
                const isOrder = item.type === "order";
                return (
                  <div key={item._id || idx} className="flex gap-4 relative group">
                    <div className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center relative z-10 transition-transform group-hover:scale-105 border-4 border-white ${
                      isOrder ? "bg-amber-50 text-amber-600 shadow-sm shadow-amber-100" : "bg-indigo-50 text-indigo-600 shadow-sm shadow-indigo-100"
                    }`}>
                      {isOrder ? <ShoppingBag size={15} /> : <UserPlus size={15} />}
                    </div>
                    <div className="flex-1 pb-6 md:pb-8 pl-1 md:pl-2 group-last:border-none min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5 sm:mb-1">
                        <h4 className="text-xs md:text-sm font-bold text-slate-800">
                          {isOrder ? `Order Placed` : "New Customer"}
                        </h4>
                        <span className="text-[9px] md:text-[10px] font-medium text-slate-400 flex items-center gap-1 sm:gap-1.5 whitespace-nowrap">
                          <Clock size={11} className="text-[#B8945A]" /> 
                          {new Date(item.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} 
                          <span className="opacity-30">•</span>
                          {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed truncate-2-lines">
                        {isOrder ? (
                          <>Order <span className="font-semibold text-slate-700">#{item._id?.slice(-6).toUpperCase()}</span> by <span className="font-semibold text-slate-700">{item.userName || item.shippingAddress?.fullName}</span> worth <span className="font-bold text-emerald-600">₹{item.totalAmount}</span> via <span className="uppercase font-semibold text-slate-600">{item.paymentMethod}</span></>
                        ) : (
                          <><span className="font-semibold text-slate-700">{item.name}</span> (<span className="text-slate-500">{item.email}</span>) successfully registered an account.</>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="pl-4 py-4 text-xs font-semibold text-slate-400">No recent activity logged.</div>
            )}
          </div>
        </div>

        {/* Low Stock Notifications */}
        <div className="bg-white rounded-3xl p-5 md:p-6 shadow-sm border border-slate-100/80">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                <AlertTriangle size={18} />
              </div>
              <div>
                <h3 className="text-sm md:text-base font-extrabold text-slate-800 tracking-tight">Stock Alerts</h3>
                <p className="text-[10px] md:text-xs text-slate-400 font-medium">Products running low on inventory</p>
              </div>
            </div>
            {data.lowStockItems.length > 0 && (
              <span className="text-[10px] font-black bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full border border-rose-100">
                {data.lowStockItems.length} Critical
              </span>
            )}
          </div>

          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {data.lowStockItems.length > 0 ? (
              data.lowStockItems.map((product: any) => (
                <div key={product._id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/50 hover:bg-slate-50 border border-slate-100 transition-colors group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200/60">
                      <img src={product.images?.[0] || "/placeholder.jpg"} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-700 truncate pr-2">{product.name}</h4>
                      <p className="text-[10px] font-medium text-slate-400 capitalize">{product.category}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 pl-2">
                    <span className="text-xs font-extrabold text-rose-600 block">{product.quantity} left</span>
                    <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-tight">Restock Item</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mb-3">
                  <Package size={20} />
                </div>
                <h5 className="text-xs font-bold text-slate-700 mb-0.5">Inventory Healthy</h5>
                <p className="text-[10px] text-slate-400 font-medium max-w-[180px]">All products have sufficient units available.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, link }: { title: string; value: string; icon: any; color: string; link: string }) {
  return (
    <Link href={link} className="block group">
      <div className="bg-white p-5 rounded-3xl border border-slate-100/80 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-200/60 flex items-center justify-between">
        <div className="space-y-1.5 min-w-0">
          <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight truncate pr-1">{value}</h3>
        </div>
        <div className={`w-11 h-11 md:w-12 md:h-12 rounded-2xl flex items-center justify-center border transition-all duration-300 group-hover:scale-105 ${color}`}>
          {icon}
        </div>
      </div>
    </Link>
  );
}