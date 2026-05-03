"use client";

import { useState, useEffect } from "react";
import { 
  ShoppingBag, Search, Loader2, ChevronRight, 
  Phone, Mail, MapPin, Calendar, CreditCard, 
  X, User, PackageCheck, Receipt
} from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null); // For Modal

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Pending": return "bg-orange-50 text-orange-600 border-orange-100";
      case "Shipped": return "bg-blue-50 text-blue-600 border-blue-100";
      case "Delivered": return "bg-green-50 text-green-600 border-green-100";
      case "Cancelled": return "bg-red-50 text-red-600 border-red-100";
      default: return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  const filteredOrders = orders.filter((o: any) => {
    const name = o.customerName?.toLowerCase() || "";
    const id = o._id?.toString().toLowerCase() || "";
    const term = searchTerm.toLowerCase();
    return name.includes(term) || id.includes(term);
  });

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
      <Loader2 className="animate-spin mb-4 text-[#D4AF37]" size={32} />
      <p className="text-[10px] uppercase tracking-[0.2em] font-black">Scanning Orders...</p>
    </div>
  );

  return (
    <div className="max-w-[1200px] mx-auto animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-2xl font-serif font-bold tracking-tight text-slate-900">Orders</h1>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">
            {orders.length} Total Sales
          </p>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
          <input 
            type="text" placeholder="Search customer or Order ID..."
            className="pl-10 pr-6 py-3 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-1 focus:ring-[#D4AF37] w-80 text-xs transition-all shadow-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Date & ID</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Customer</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Items</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Payment</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order: any) => (
                <tr 
                  key={order._id} 
                  onClick={() => setSelectedOrder(order)}
                  className="hover:bg-slate-50/50 transition-all group cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-900 mb-0.5">#{order._id.slice(-6).toUpperCase()}</span>
                      <span className="text-[9px] text-slate-400 font-medium">{new Date(order.createdAt).toLocaleDateString('en-GB')}</span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 text-xs">{order.shippingAddress.fullName || "Guest"}</span>
                      <span className="text-[9px] text-slate-400">{order.phone}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 3).map((item: any, i: number) => (
                        <img key={i} src={item.image} className="w-8 h-10 rounded-md border-2 border-white object-cover shadow-sm" />
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-8 h-10 rounded-md border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-black text-slate-400">+{order.items.length - 3}</div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <CreditCard size={12} className="text-slate-300" />
                      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">{order.paymentMethod || "COD"}</span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full border ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                       <span className="font-black text-slate-900 text-xs">₹{order.totalAmount.toLocaleString()}</span>
                       <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-900 transition-all group-hover:translate-x-1" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-slate-300">
            <ShoppingBag size={32} strokeWidth={1} className="mb-3" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No matching orders</p>
          </div>
        )}
      </div>

      {/* --- ORDER DETAILS MODAL --- */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-[110] flex items-center justify-end p-4 animate-in fade-in duration-300">
          <div className="bg-white h-full max-w-xl w-full rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-500">
            
            {/* Modal Header */}
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-1">Order Details</p>
                <p className="text-lg font-bold text-slate-900">ID: #{selectedOrder._id.toUpperCase()}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-all">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              
              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400"><User size={14}/></div>
                    <div>
                      <p className="text-[9px] font-black uppercase text-slate-400 mb-0.5">Customer</p>
                      <p className="text-xs font-bold text-slate-800">{selectedOrder.shippingAddress.fullName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400"><Phone size={14}/></div>
                    <div>
                      <p className="text-[9px] font-black uppercase text-slate-400 mb-0.5">Phone</p>
                      <p className="text-xs font-bold text-slate-800">{selectedOrder.shippingAddress.phone}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400"><MapPin size={14}/></div>
                  <div>
                    <p className="text-[9px] font-black uppercase text-slate-400 mb-0.5">Shipping Address</p>
                    <p className="text-xs font-medium text-slate-600 leading-relaxed">
                      {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.area}, {selectedOrder.shippingAddress.state}<br/>
                      {selectedOrder.shippingAddress.pincode}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items List */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <PackageCheck size={14} className="text-[#D4AF37]" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Ordered Items ({selectedOrder.items.length})</p>
                </div>
                <div className="space-y-3">
                  {selectedOrder.items.map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100/50">
                      <img src={item.image} className="w-12 h-16 object-cover rounded-xl shadow-sm" />
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-800">{item.name}</p>
                        <div className="flex items-center gap-3 mt-1">
                           <span className="text-[9px] font-black bg-white px-2 py-0.5 rounded border text-slate-400 uppercase">Size: {item.size}</span>
                           <span className="text-[9px] font-bold text-slate-400 tracking-tighter">Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <p className="text-xs font-black text-slate-900">₹{item.price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-zinc-900 rounded-[2rem] p-6 text-white relative overflow-hidden">
                <Receipt className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5 -rotate-12" />
                <div className="space-y-3 relative z-10">
                  <div className="flex justify-between text-xs text-zinc-400 font-medium">
                    <span>Subtotal</span>
                    <span>₹{selectedOrder.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-400 font-medium">
                    <span>Shipping</span>
                    <span className=" uppercase font-black tracking-widest text-[9px]">₹{selectedOrder.shippingCharge}</span>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-400 font-medium">
                    <span>Tax</span>
                    <span className=" uppercase font-black tracking-widest text-[9px]">₹{selectedOrder.tax}</span>
                  </div>
                  <div className="flex justify-between text-xs text-zinc-400 font-medium">
                    <span>Discount</span>
                    <span className=" uppercase font-black tracking-widest text-[9px]">₹{selectedOrder.discount}</span>
                  </div>
                  <div className="pt-3 border-t border-white/10 flex justify-between items-end">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">Total Amount</p>
                    <p className="text-2xl font-serif font-bold tracking-tight">₹{selectedOrder.totalAmount.toLocaleString()}</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer / Actions */}
            <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-3">
               <button className="flex-1 py-4 bg-zinc-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-xl transition-all">Update Status</button>
               <button className="px-6 py-4 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white transition-all">Print Invoice</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Sparkles({ size, className, fill }: { size: number; className?: string; fill?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    </svg>
  );
}