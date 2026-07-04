// "use client";

// import { useState, useEffect } from "react";
// import { 
//   ShoppingBag, Search, Loader2, ChevronRight, 
//   Phone, CreditCard, X, User, PackageCheck, Receipt, MapPin,
//   Download
// } from "lucide-react";
// import { generateInvoiceHTML } from "@/lib/invoiceTemplate";

// const downloadInvoicePDF = async (order: any, type: "GST" | "NON-GST") => {
//   const html2pdf = (await import("html2pdf.js")).default;

//   const invoiceHtmlString = generateInvoiceHTML(order, type);

//   const element = document.createElement("div");
//   element.innerHTML = invoiceHtmlString;

//   const options:any = {
//     margin: 10,
//     filename: `Bannira_Invoice_${type}_${order._id.slice(-6).toUpperCase()}.pdf`,
//     image: { type: "jpeg", quality: 0.98 },
//     html2canvas: { scale: 2, useCORS: true },
//     jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
//   };

//   html2pdf().from(element).set(options).save();
// };

// export default function Orders() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedOrder, setSelectedOrder] = useState<any>(null);
  
//   const [activeTab, setActiveTab] = useState<"online" | "offline">("online");

//   const fetchOrders = async (tabType: "online" | "offline") => {
//   try {
//     setLoading(true);
//     const endpoint = tabType === "online" ? "/api/orders" : "/api/admin/offline-sales";
//     const res = await fetch(endpoint);
    
//     if (!res.ok) {
//       throw new Error(`Server responded with status: ${res.status}`);
//     }
    
//     const data = await res.json();
//     setOrders(Array.isArray(data) ? data : data.sales || data.orders || []);
//   } catch (err) {
//     console.error(`Failed to fetch ${tabType} orders schemas`);
//     console.error("🔥 ACTUAL NETWORK ERROR DETAIL:", err);
//     setOrders([]); 
//   } finally {
//     setLoading(false);
//   }
// };

//   // Trigger fetching loops every time the admin tab selections shifts active flags
//   useEffect(() => { 
//     fetchOrders(activeTab); 
//   }, [activeTab]);

//   const getCustomStatus = (order: any) => {
//     if (order.paymentStatus === "Paid") {
//       return { text: "Paid", style: "bg-green-50 text-green-600 border-green-100" };
//     }
//     if (order.paymentMethod === "cod" || order.paymentMethod === "cash") {
//       return { text: "Pay on Delivery", style: "bg-orange-50 text-orange-600 border-orange-100" };
//     }
//     return { text: "Pending", style: "bg-orange-50 text-orange-600 border-orange-100" };
//   };

//   // Filter matrix evaluation logic
//   const filteredOrders = orders
//     .filter((o: any) => {
//       if (activeTab === "offline") return true; 
//       return o.orderStatus === "Processing";
//     })
//     .filter((o: any) => {
//       // Walk-in client name matching parameters allocation
//       const name = (o.shippingAddress?.fullName || o.customerName || "").toLowerCase();
//       const id = (o._id || o.invoiceNumber || "").toString().toLowerCase();
//       const term = searchTerm.toLowerCase();
//       return name.includes(term) || id.includes(term);
//     });

//   return (
//     <div className="w-full max-w-[300px] md:max-w-[1200px] mx-auto animate-in fade-in duration-700 pb-20 px-0 md:px-4 min-w-0 overflow-hidden">
//       {/* Header */}
//       <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-10">
//         <div>
//           <h1 className="text-2xl font-serif font-bold tracking-tight text-slate-900">
//             Orders
//           </h1>
//           <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">
//             {filteredOrders.length} {activeTab === "online" ? "Processing Online" : "Recorded Offline"} Sales
//           </p>
//         </div>

//         <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 group w-auto">
//           {/* 🔥 3. PREMIUM PREMIUM BANNIRA STANDARD TAB CONTROLLERS CHIPS WRAPPER */}
//           <div className="flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/30 self-start">
//             <button
//               type="button"
//               onClick={() => { setActiveTab("online"); setSelectedOrder(null); }}
//               className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all duration-200 cursor-pointer ${
//                 activeTab === "online" 
//                   ? "bg-white text-slate-900 shadow-xs" 
//                   : "text-slate-400 hover:text-slate-700"
//               }`}
//             >
//               Online Orders
//             </button>
//             <button
//               type="button"
//               onClick={() => { setActiveTab("offline"); setSelectedOrder(null); }}
//               className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all duration-200 cursor-pointer ${
//                 activeTab === "offline" 
//                   ? "bg-white text-slate-900 shadow-xs" 
//                   : "text-slate-400 hover:text-slate-700"
//               }`}
//             >
//               Offline Orders
//             </button>
//           </div>

//           <div className="relative">
//             <Search
//               className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
//               size={14}
//             />
//             <input
//               type="text"
//               placeholder="Search customer or Order ID..."
//               className="pl-10 pr-6 py-3 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-1 focus:ring-[#D4AF37] w-full md:w-80 text-xs transition-all shadow-sm"
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//         </div>
//       </header>

//       {/* Dynamic Render Switch Table Screen Logic */}
//       {loading ? (
//         <div className="flex flex-col items-center justify-center h-[40vh] text-slate-400 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
//           <Loader2 className="animate-spin mb-4 text-[#D4AF37]" size={32} />
//           <p className="text-[10px] uppercase tracking-[0.2em] font-black text-center">Scanning Storage Files...</p>
//         </div>
//       ) : (
//         <div className="w-full bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
//           {/* Inner Scroll Wrapper */}
//           <div className="w-full overflow-x-auto block min-w-0 clear-both">
//             <table className="w-full text-left border-collapse min-w-[850px] table-auto">
//               <thead>
//                 <tr className="bg-slate-50/50 border-b border-slate-100">
//                   <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 w-[15%]">
//                     Date & ID
//                   </th>
//                   <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 w-[25%]">
//                     Customer
//                   </th>
//                   {activeTab === "online" && (
//                     <>
//                   <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 w-[20%]">
//                     Items
//                   </th>
//                   <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 w-[15%]">
//                     Payment
//                   </th>
//                   <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 w-[12%]">
//                     Status
//                   </th>
//                     </>
//                   )}
//                   <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right w-[13%]">
//                     Amount
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100">
//                 {filteredOrders.map((order: any) => {
//                   const statusData = getCustomStatus(order); 
                  
//                   const orderIdString = order._id ? order._id.toString() : "";
//                   const displayId = order.invoiceNumber || `#${orderIdString.slice(-6).toUpperCase()}`;
//                   const customerName = order.shippingAddress?.fullName || order.customerName || "Walk-In Buyer";
//                   const customerPhone = order.shippingAddress?.phone || order.customerPhone || order.phone || "N/A";
//                   const paymentDisplay = order.paymentMethod || order.paymentMode || "COD";
//                   const finalAmount = order.totalAmount || 0;

//                   return (
//                     <tr
//                       key={order._id || displayId}
//                       onClick={() => {
//                         // Normalize format structures mapping objects layer safely on modal runtime opening points
//                         const unifiedOrder = {
//                           ...order,
//                           _id: order._id || "OFFLINE_SALE",
//                           createdAt: order.createdAt,
//                           subtotal: order.subtotal || 0,
//                           shippingCharge: order.shippingCharge || 0,
//                           tax: order.tax || 0,
//                           discount: order.discount || 0,
//                           totalAmount: finalAmount,
//                           paymentMethod: paymentDisplay,
//                           paymentStatus: order.paymentStatus || "Paid",
//                           items: order.items || [],
//                           shippingAddress: {
//                             fullName: customerName,
//                             phone: customerPhone,
//                             email: order.shippingAddress?.email || "Offline Cash Register Desk",
//                             address: order.shippingAddress?.address || "Store Sale Counter Checkout",
//                             area: order.shippingAddress?.area || "Over the counter",
//                             state: order.shippingAddress?.state || "Direct Register",
//                             pincode: order.shippingAddress?.pincode || "000000",
//                             gstNumber: order.shippingAddress?.gstNumber || order.customerGst || ""
//                           }
//                         };
//                         setSelectedOrder(unifiedOrder);
//                       }}
//                       className="hover:bg-slate-50/50 transition-all group cursor-pointer"
//                     >
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex flex-col">
//                           <span className="text-[10px] font-bold text-slate-900 mb-0.5">
//                             {displayId.startsWith("#") ? displayId : `${displayId}`}
//                           </span>
//                           <span className="text-[9px] text-slate-400 font-medium">
//                             {new Date(order.createdAt).toLocaleDateString("en-GB")}
//                           </span>
//                         </div>
//                       </td>

//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex flex-col">
//                           <span className="font-bold text-slate-800 text-xs">
//                             {customerName}
//                           </span>
//                           <span className="text-[9px] text-slate-400">
//                             {customerPhone}
//                           </span>
//                         </div>
//                       </td>
//                       {activeTab === "online" && (
//                         <>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="flex -space-x-2">
//                               {(order.items || []).slice(0, 3).map((item: any, i: number) => (
//                                 <img key={i} src={item.image || "/placeholder.jpg"} className="w-8 h-10 rounded-md border-2 border-white object-cover shadow-sm inline-block" alt="item thumbnail" />
//                               ))}
//                               {(order.items || []).length > 3 && (
//                                 <div className="w-8 h-10 rounded-md border-2 border-white bg-slate-100 inline-flex items-center justify-center text-[8px] font-black text-slate-400">+{(order.items || []).length - 3}</div>
//                               )}
//                             </div>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center gap-1.5">
//                           <CreditCard size={12} className="text-slate-300" />
//                           <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
//                             {paymentDisplay}
//                           </span>
//                         </div>
//                       </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full border ${statusData.style}`}>{statusData.text}</span>
//                           </td>
//                         </>
//                       )}

//                       {/* <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex -space-x-2">
//                           {(order.items || []).slice(0, 3).map((item: any, i: number) => (
//                             <img
//                               key={i}
//                               src={item.image}
//                               className="w-8 h-10 rounded-md border-2 border-white object-cover shadow-sm inline-block"
//                               alt="item thumbnail"
//                             />
//                           ))}
//                           {(order.items || []).length > 3 && (
//                             <div className="w-8 h-10 rounded-md border-2 border-white bg-slate-100 inline-flex items-center justify-center text-[8px] font-black text-slate-400">
//                               +{(order.items || []).length - 3}
//                             </div>
//                           )}
//                         </div>
//                       </td>

//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center gap-1.5">
//                           <CreditCard size={12} className="text-slate-300" />
//                           <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
//                             {paymentDisplay}
//                           </span>
//                         </div>
//                       </td>

//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full border ${statusData.style}`}>
//                           {statusData.text}
//                         </span>
//                       </td> */}

//                       <td className="px-6 py-4 text-right whitespace-nowrap">
//                         <div className="flex items-center justify-end gap-3">
//                           <span className="font-black text-slate-900 text-xs">
//                             ₹{finalAmount.toLocaleString("en-IN")}
//                           </span>
//                           <ChevronRight
//                             size={14}
//                             className="text-slate-300 group-hover:text-slate-900 transition-all group-hover:translate-x-1"
//                           />
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           {filteredOrders.length === 0 && (
//             <div className="py-20 flex flex-col items-center justify-center text-slate-300">
//               <ShoppingBag size={32} strokeWidth={1} className="mb-3" />
//               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
//                 No matching {activeTab} orders found
//               </p>
//             </div>
//           )}
//         </div>
//       )}

//       {/* --- RESPONSIVE ORDER DETAILS MODAL / DRAWER --- */}
//       {selectedOrder && (
//         <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-[110] flex items-end md:items-center justify-center md:justify-end p-0 md:p-4 animate-in fade-in duration-300">
//           <div className="bg-white h-[90vh] md:h-full max-w-full md:max-w-xl w-full rounded-t-[2.5rem] md:rounded-t-none md:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom md:slide-in-from-right duration-500">
//             {/* Modal Header */}
//             <div className="p-6 md:p-8 border-b border-slate-50 flex items-center justify-between shrink-0">
//               <div className="min-w-0">
//                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-1">
//                   Order Details
//                 </p>
//                 <p className="text-base md:text-lg font-bold text-slate-900 truncate">
//                   ID: {selectedOrder.invoiceNumber || `#${selectedOrder._id.toString().slice(-6).toUpperCase()}`}
//                 </p>
//               </div>
//               <button
//                 onClick={() => setSelectedOrder(null)}
//                 className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-all shrink-0 cursor-pointer"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             {/* Modal Body */}
//             <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 md:space-y-8">
//               {/* Customer Info Grid */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                 <div className="space-y-4">
//                   <div className="flex items-start gap-3">
//                     <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
//                       <User size={14} />
//                     </div>
//                     <div>
//                       <p className="text-[9px] font-black uppercase text-slate-400 mb-0.5">
//                         Customer
//                       </p>
//                       <p className="text-xs font-bold text-slate-800">
//                         {selectedOrder.shippingAddress?.fullName}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-start gap-3">
//                     <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
//                       <Phone size={14} />
//                     </div>
//                     <div>
//                       <p className="text-[9px] font-black uppercase text-slate-400 mb-0.5">
//                         Phone
//                       </p>
//                       <p className="text-xs font-bold text-slate-800">
//                         {selectedOrder.shippingAddress?.phone}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex items-start gap-3">
//                   <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
//                     <MapPin size={14} />
//                   </div>
//                   <div>
//                     <p className="text-[9px] font-black uppercase text-slate-400 mb-0.5">
//                       Shipping Address
//                     </p>
//                     <p className="text-xs font-medium text-slate-600 leading-relaxed">
//                       {selectedOrder.shippingAddress?.address},{" "}
//                       {selectedOrder.shippingAddress?.area},{" "}
//                       {selectedOrder.shippingAddress?.state}
//                       <br />
//                       {selectedOrder.shippingAddress?.pincode}
//                       {selectedOrder.shippingAddress?.gstNumber && (
//                         <span className="block mt-1 font-bold text-[#7B2D0A]">GSTIN: {selectedOrder.shippingAddress.gstNumber}</span>
//                       )}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Order Items List */}
//               <div>
//                 <div className="flex items-center gap-2 mb-4">
//                   <PackageCheck size={14} className="text-[#D4AF37]" />
//                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">
//                     Ordered Items ({selectedOrder.items.length})
//                   </p>
//                 </div>
//                 <div className="space-y-3">
//                   {selectedOrder.items.map((item: any, i: number) => (
//                     <div
//                       key={i}
//                       className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100/50"
//                     >
//                       <img
//                         src={item.image}
//                         className="w-12 h-16 object-cover rounded-xl shadow-sm shrink-0"
//                         alt="product thumbnail"
//                       />
//                       <div className="flex-1 min-w-0">
//                         <p className="text-xs font-bold text-slate-800 truncate">
//                           {item.name}
//                         </p>
//                         <div className="flex items-center gap-3 mt-1">
//                           <span className="text-[9px] font-black bg-white px-2 py-0.5 rounded border text-slate-400 uppercase">
//                             Size: {item.size}
//                           </span>
//                           <span className="text-[9px] font-bold text-slate-400 tracking-tighter">
//                             Qty: {item.quantity}
//                           </span>
//                         </div>
//                       </div>
//                       <p className="text-xs font-black text-slate-900 shrink-0">
//                         ₹{(item.price || 0).toLocaleString("en-IN")}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Order Summary Card */}
//               <div className="bg-zinc-900 rounded-[2rem] p-6 text-white relative overflow-hidden shrink-0">
//                 <Receipt className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5 -rotate-12" />
//                 <div className="space-y-3 relative z-10">
//                   <div className="flex justify-between text-xs text-zinc-400 font-medium">
//                     <span>Subtotal</span>
//                     <span>
//                       ₹{(selectedOrder.subtotal || 0).toLocaleString("en-IN")}
//                     </span>
//                   </div>
//                   <div className="flex justify-between text-xs text-zinc-400 font-medium">
//                     <span>Shipping</span>
//                     <span className=" uppercase font-black tracking-widest text-[9px]">
//                       ₹{selectedOrder.shippingCharge || 0}
//                     </span>
//                   </div>
//                   <div className="flex justify-between text-xs text-zinc-400 font-medium">
//                     <span>Tax</span>
//                     <span className=" uppercase font-black tracking-widest text-[9px]">
//                       ₹{(selectedOrder.tax || 0).toLocaleString("en-IN")}
//                     </span>
//                   </div>
//                   <div className="flex justify-between text-xs text-zinc-400 font-medium">
//                     <span>Discount</span>
//                     <span className=" uppercase font-black tracking-widest text-[9px]">
//                       - ₹{(selectedOrder.discount || 0).toLocaleString("en-IN")}
//                     </span>
//                   </div>
//                   <div className="pt-3 border-t border-white/10 flex justify-between items-end">
//                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">
//                       Total Amount
//                     </p>
//                     <p className="text-xl md:text-2xl font-serif font-bold tracking-tight">
//                       ₹{(selectedOrder.totalAmount || 0).toLocaleString("en-IN")}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Modal Footer / Actions */}
//             <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-3 shrink-0">
//               <button
//                 onClick={() => downloadInvoicePDF(selectedOrder, "GST")}
//                 className="w-[50%] px-4 py-4 border border-stone-200 bg-white hover:bg-[#7B2D0A]/5 hover:border-[#7B2D0A]/30 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#7B2D0A] transition-all cursor-pointer flex items-center justify-center gap-1"
//               >
//                 <Download size={12} /> GST INVOICE
//               </button>

//               <button
//                 onClick={() => downloadInvoicePDF(selectedOrder, "NON-GST")}
//                 className="w-[50%] px-4 py-4 border border-slate-200 bg-white hover:bg-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-700 transition-all cursor-pointer flex items-center justify-center gap-1"
//               >
//                 <Download size={12} />Cash Memo (Non-gst)
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// function Sparkles({ size, className, fill }: { size: number; className?: string; fill?: string }) {
//   return (
//     <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={fill || "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
//       <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
//     </svg>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import { 
//   ShoppingBag, Search, Loader2, ChevronRight, 
//   Phone, CreditCard, X, User, PackageCheck, Receipt, MapPin,
//   Download
// } from "lucide-react";
// import { generateInvoiceHTML } from "@/lib/invoiceTemplate";

// const downloadInvoicePDF = async (order: any, type: "GST" | "NON-GST") => {
//   const html2pdf = (await import("html2pdf.js")).default;

//   const invoiceHtmlString = generateInvoiceHTML(order, type);

//   const element = document.createElement("div");
//   element.innerHTML = invoiceHtmlString;

//   const options:any = {
//     margin: 10,
//     filename: `Bannira_Invoice_${type}_${order._id.slice(-6).toUpperCase()}.pdf`,
//     image: { type: "jpeg", quality: 0.98 },
//     html2canvas: { scale: 2, useCORS: true },
//     jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
//   };

//   html2pdf().from(element).set(options).save();
// };

// export default function Orders() {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedOrder, setSelectedOrder] = useState<any>(null);
  
//   const [activeTab, setActiveTab] = useState<"online" | "offline">("online");

//   const fetchOrders = async (tabType: "online" | "offline") => {
//     try {
//       setLoading(true);
//       const endpoint = tabType === "online" ? "/api/orders" : "/api/admin/offline-sales";
//       const res = await fetch(endpoint);
      
//       if (!res.ok) {
//         throw new Error(`Server responded with status: ${res.status}`);
//       }
      
//       const data = await res.json();
//       setOrders(Array.isArray(data) ? data : data.sales || data.orders || []);
//     } catch (err) {
//       console.error(`Failed to fetch ${tabType} orders schemas`);
//       console.error("🔥 ACTUAL NETWORK ERROR DETAIL:", err);
//       setOrders([]); 
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { 
//     fetchOrders(activeTab); 
//   }, [activeTab]);

//   const getCustomStatus = (order: any) => {
//     if (order.paymentStatus === "Paid") {
//       return { text: "Paid", style: "bg-green-50 text-green-600 border-green-100" };
//     }
//     if (order.paymentMethod === "cod" || order.paymentMethod === "cash") {
//       return { text: "Pay on Delivery", style: "bg-orange-50 text-orange-600 border-orange-100" };
//     }
//     return { text: "Pending", style: "bg-orange-50 text-orange-600 border-orange-100" };
//   };

//   const filteredOrders = orders
//     .filter((o: any) => {
//       if (activeTab === "offline") return true; 
//       return o.orderStatus === "Processing";
//     })
//     .filter((o: any) => {
//       const name = (o.shippingAddress?.fullName || o.customerName || "").toLowerCase();
//       const id = (o._id || o.invoiceNumber || "").toString().toLowerCase();
//       const term = searchTerm.toLowerCase();
//       return name.includes(term) || id.includes(term);
//     });

//   return (
//     <div className="w-full max-w-[300px] md:max-w-[1200px] mx-auto animate-in fade-in duration-700 pb-20 px-0 md:px-4 min-w-0 overflow-hidden">
//       {/* Header */}
//       <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-10">
//         <div>
//           <h1 className="text-2xl font-serif font-bold tracking-tight text-slate-900">
//             Orders
//           </h1>
//           <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">
//             {filteredOrders.length} {activeTab === "online" ? "Processing Online" : "Recorded Offline"} Sales
//           </p>
//         </div>

//         <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 group w-auto">
//           <div className="flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/30 self-start">
//             <button
//               type="button"
//               onClick={() => { setActiveTab("online"); setSelectedOrder(null); }}
//               className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all duration-200 cursor-pointer ${
//                 activeTab === "online" ? "bg-white text-slate-900 shadow-xs" : "text-slate-400 hover:text-slate-700"
//               }`}
//             >
//               Online Orders
//             </button>
//             <button
//               type="button"
//               onClick={() => { setActiveTab("offline"); setSelectedOrder(null); }}
//               className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all duration-200 cursor-pointer ${
//                 activeTab === "offline" ? "bg-white text-slate-900 shadow-xs" : "text-slate-400 hover:text-slate-700"
//               }`}
//             >
//               Offline Orders
//             </button>
//           </div>

//           <div className="relative">
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
//             <input
//               type="text"
//               placeholder="Search customer or Order ID..."
//               className="pl-10 pr-6 py-3 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-1 focus:ring-[#D4AF37] w-full md:w-80 text-xs transition-all shadow-sm"
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//         </div>
//       </header>

//       {/* Table Section */}
//       {loading ? (
//         <div className="flex flex-col items-center justify-center h-[40vh] text-slate-400 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
//           <Loader2 className="animate-spin mb-4 text-[#D4AF37]" size={32} />
//           <p className="text-[10px] uppercase tracking-[0.2em] font-black text-center">Scanning Storage Files...</p>
//         </div>
//       ) : (
//         <div className="w-full bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
//           <div className="w-full overflow-x-auto block min-w-0 clear-both">
//             <table className="w-full text-left border-collapse min-w-[850px] table-auto">
//               <thead>
//                 <tr className="bg-slate-50/50 border-b border-slate-100">
//                   <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 w-[15%]">
//                     Date & ID
//                   </th>
//                   <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 w-[25%]">
//                     Customer
//                   </th>
//                   {activeTab === "online" && (
//                     <>
//                       <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 w-[20%]">
//                         Items
//                       </th>
//                       {/* <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 w-[15%]">
//                         Payment
//                       </th> */}
//                       <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 w-[12%]">
//                         Status
//                       </th>
//                     </>
//                   )}
//                   {/* 🔥 FIXED: Added dynamic header for 'Sell Through' column when offline tab is open */}
//                   {activeTab === "offline" && (
//                     <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 w-[47%]">
//                       Sell Through
//                     </th>
//                   )}
//                   <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right w-[13%]">
//                     Amount
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100">
//                 {filteredOrders.map((order: any) => {
//                   const statusData = getCustomStatus(order); 
                  
//                   const orderIdString = order._id ? order._id.toString() : "";
//                   const displayId = order.invoiceNumber || `#${orderIdString.slice(-6).toUpperCase()}`;
//                   const customerName = order.shippingAddress?.fullName || order.customerName || "Walk-In Buyer";
//                   const customerPhone = order.shippingAddress?.phone || order.customerPhone || order.phone || "N/A";
//                   const paymentDisplay = order.paymentMethod || order.paymentMode || "COD";
//                   const finalAmount = order.totalAmount || 0;
                  
//                   // Safe lookup for channel data string template routing
//                   const platformChannel = order.sellThrough || "In-store";

//                   return (
//                     <tr
//                       key={order._id || displayId}
//                       onClick={() => {
//                         const unifiedOrder = {
//                           ...order,
//                           _id: order._id || "OFFLINE_SALE",
//                           createdAt: order.createdAt,
//                           subtotal: order.subtotal || 0,
//                           shippingCharge: order.shippingCharge || 0,
//                           tax: order.tax || 0,
//                           discount: order.discount || 0,
//                           totalAmount: finalAmount,
//                           paymentMethod: paymentDisplay,
//                           paymentStatus: order.paymentStatus || "Paid",
//                           items: order.items || [],
//                           shippingAddress: {
//                             fullName: customerName,
//                             phone: customerPhone,
//                             email: order.shippingAddress?.email || "Offline Cash Register Desk",
//                             address: order.shippingAddress?.address || "Store Sale Counter Checkout",
//                             area: order.shippingAddress?.area || "Over the counter",
//                             state: order.shippingAddress?.state || "Direct Register",
//                             pincode: order.shippingAddress?.pincode || "000000",
//                             gstNumber: order.shippingAddress?.gstNumber || order.customerGst || ""
//                           }
//                         };
//                         setSelectedOrder(unifiedOrder);
//                       }}
//                       className="hover:bg-slate-50/50 transition-all group cursor-pointer"
//                     >
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex flex-col">
//                           <span className="text-[10px] font-bold text-slate-900 mb-0.5">
//                             {displayId}
//                           </span>
//                           <span className="text-[9px] text-slate-400 font-medium">
//                             {new Date(order.createdAt).toLocaleDateString("en-GB")}
//                           </span>
//                         </div>
//                       </td>

//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex flex-col">
//                           <span className="font-bold text-slate-800 text-xs">
//                             {customerName}
//                           </span>
//                           <span className="text-[9px] text-slate-400">
//                             {customerPhone}
//                           </span>
//                         </div>
//                       </td>

//                       {activeTab === "online" && (
//                         <>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="flex -space-x-2">
//                               {(order.items || []).slice(0, 3).map((item: any, i: number) => (
//                                 <img key={i} src={item.image || "/placeholder.jpg"} className="w-8 h-10 rounded-md border-2 border-white object-cover shadow-sm inline-block" alt="item thumbnail" />
//                               ))}
//                               {(order.items || []).length > 3 && (
//                                 <div className="w-8 h-10 rounded-md border-2 border-white bg-slate-100 inline-flex items-center justify-center text-[8px] font-black text-slate-400">+{(order.items || []).length - 3}</div>
//                               )}
//                             </div>
//                           </td>
//                           {/* <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="flex items-center gap-1.5">
//                               <CreditCard size={12} className="text-slate-300" />
//                               <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">
//                                 {paymentDisplay}
//                               </span>
//                             </div>
//                           </td> */}
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full border ${statusData.style}`}>{statusData.text}</span>
//                           </td>
//                         </>
//                       )}

//                       {/* 🔥 FIXED: Rendered explicit luxury typography chips badge for the 'Sell Through' column */}
//                       {activeTab === "offline" && (
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className={`text-[10px] font-extrabold tracking-wider px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg uppercase ${
//                             platformChannel === "Amazon" ? "text-orange-500 bg-orange-50/30" :
//                             platformChannel === "Flipkart" ? "text-blue-500 bg-blue-50/30" :
//                             platformChannel === "Meesho" ? "text-pink-500 bg-pink-50/30" : 
//                             "text-slate-600 bg-slate-50"
//                           }`}>
//                             {platformChannel}
//                           </span>
//                         </td>
//                       )}

//                       <td className="px-6 py-4 text-right whitespace-nowrap">
//                         <div className="flex items-center justify-end gap-3">
//                           <span className="font-black text-slate-900 text-xs">
//                             ₹{finalAmount.toLocaleString("en-IN")}
//                           </span>
//                           <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-900 transition-all group-hover:translate-x-1" />
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>

//           {filteredOrders.length === 0 && (
//             <div className="py-20 flex flex-col items-center justify-center text-slate-300">
//               <ShoppingBag size={32} strokeWidth={1} className="mb-3" />
//               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
//                 No matching {activeTab} orders found
//               </p>
//             </div>
//           )}
//         </div>
//       )}

//       {/* --- RESPONSIVE ORDER DETAILS MODAL / DRAWER --- */}
//       {selectedOrder && (
//         <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-[110] flex items-end md:items-center justify-center md:justify-end p-0 md:p-4 animate-in fade-in duration-300">
//           <div className="bg-white h-[90vh] md:h-full max-w-full md:max-w-xl w-full rounded-t-[2.5rem] md:rounded-t-none md:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom md:slide-in-from-right duration-500">
//             {/* Modal Header */}
//             <div className="p-6 md:p-8 border-b border-slate-50 flex items-center justify-between shrink-0">
//               <div className="min-w-0">
//                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-1">
//                   Order Details
//                 </p>
//                 <p className="text-base md:text-lg font-bold text-slate-900 truncate">
//                   ID: {selectedOrder.invoiceNumber || `#${selectedOrder._id.toString().slice(-6).toUpperCase()}`}
//                 </p>
//               </div>
//               <button
//                 onClick={() => setSelectedOrder(null)}
//                 className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-all shrink-0 cursor-pointer"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             {/* Modal Body */}
//             <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 md:space-y-8">
//               {/* Customer Info Grid */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                 <div className="space-y-4">
//                   <div className="flex items-start gap-3">
//                     <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
//                       <User size={14} />
//                     </div>
//                     <div>
//                       <p className="text-[9px] font-black uppercase text-slate-400 mb-0.5">
//                         Customer
//                       </p>
//                       <p className="text-xs font-bold text-slate-800">
//                         {selectedOrder.shippingAddress?.fullName}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-start gap-3">
//                     <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
//                       <Phone size={14} />
//                     </div>
//                     <div>
//                       <p className="text-[9px] font-black uppercase text-slate-400 mb-0.5">
//                         Phone
//                       </p>
//                       <p className="text-xs font-bold text-slate-800">
//                         {selectedOrder.shippingAddress?.phone}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex items-start gap-3">
//                   <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
//                     <MapPin size={14} />
//                   </div>
//                   <div>
//                     <p className="text-[9px] font-black uppercase text-slate-400 mb-0.5">
//                       Shipping Address
//                     </p>
//                     <p className="text-xs font-medium text-slate-600 leading-relaxed">
//                       {selectedOrder.shippingAddress?.address},{" "}
//                       {selectedOrder.shippingAddress?.area},{" "}
//                       {selectedOrder.shippingAddress?.state}
//                       <br />
//                       {selectedOrder.shippingAddress?.pincode}
//                       {selectedOrder.shippingAddress?.gstNumber && (
//                         <span className="block mt-1 font-bold text-[#7B2D0A]">GSTIN: {selectedOrder.shippingAddress.gstNumber}</span>
//                       )}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Order Items List */}
//               <div>
//                 <div className="flex items-center gap-2 mb-4">
//                   <PackageCheck size={14} className="text-[#D4AF37]" />
//                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">
//                     Ordered Items ({selectedOrder.items.length})
//                   </p>
//                 </div>
//                 <div className="space-y-3">
//                   {selectedOrder.items.map((item: any, i: number) => (
//                     <div key={i} className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100/50">
//                       <img src={item.image} className="w-12 h-16 object-cover rounded-xl shadow-sm shrink-0" alt="product thumbnail" />
//                       <div className="flex-1 min-w-0">
//                         <p className="text-xs font-bold text-slate-800 truncate">
//                           {item.name}
//                         </p>
//                         <div className="flex items-center gap-3 mt-1">
//                           <span className="text-[9px] font-black bg-white px-2 py-0.5 rounded border text-slate-400 uppercase">
//                             Size: {item.size}
//                           </span>
//                           <span className="text-[9px] font-bold text-slate-400 tracking-tighter">
//                             Qty: {item.quantity}
//                           </span>
//                         </div>
//                       </div>
//                       <p className="text-xs font-black text-slate-900 shrink-0">
//                         ₹{(item.price || 0).toLocaleString("en-IN")}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Order Summary Card */}
//               <div className="bg-zinc-900 rounded-[2rem] p-6 text-white relative overflow-hidden shrink-0">
//                 <Receipt className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5 -rotate-12" />
//                 <div className="space-y-3 relative z-10">
//                   <div className="flex justify-between text-xs text-zinc-400 font-medium">
//                     <span>Subtotal</span>
//                     <span>₹{(selectedOrder.subtotal || 0).toLocaleString("en-IN")}</span>
//                   </div>
//                   <div className="flex justify-between text-xs text-zinc-400 font-medium">
//                     <span>Shipping</span>
//                     <span className=" uppercase font-black tracking-widest text-[9px]">₹{selectedOrder.shippingCharge || 0}</span>
//                   </div>
//                   <div className="flex justify-between text-xs text-zinc-400 font-medium">
//                     <span>Tax</span>
//                     <span className=" uppercase font-black tracking-widest text-[9px]">₹{(selectedOrder.tax || 0).toLocaleString("en-IN")}</span>
//                   </div>
//                   <div className="flex justify-between text-xs text-zinc-400 font-medium">
//                     <span>Discount</span>
//                     <span className=" uppercase font-black tracking-widest text-[9px]">- ₹{(selectedOrder.discount || 0).toLocaleString("en-IN")}</span>
//                   </div>
//                   <div className="pt-3 border-t border-white/10 flex justify-between items-end">
//                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">Total Amount</p>
//                     <p className="text-xl md:text-2xl font-serif font-bold tracking-tight">₹{(selectedOrder.totalAmount || 0).toLocaleString("en-IN")}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Modal Footer / Actions */}
//             <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-3 shrink-0">
//               <button
//                 onClick={() => downloadInvoicePDF(selectedOrder, "GST")}
//                 className="w-[50%] px-4 py-4 border border-stone-200 bg-white hover:bg-[#7B2D0A]/5 hover:border-[#7B2D0A]/30 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#7B2D0A] transition-all cursor-pointer flex items-center justify-center gap-1"
//               >
//                 <Download size={12} /> GST INVOICE
//               </button>

//               <button
//                 onClick={() => downloadInvoicePDF(selectedOrder, "NON-GST")}
//                 className="w-[50%] px-4 py-4 border border-slate-200 bg-white hover:bg-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-700 transition-all cursor-pointer flex items-center justify-center gap-1"
//               >
//                 <Download size={12} />Cash Memo (Non-gst)
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { 
  ShoppingBag, Search, Loader2, ChevronRight, 
  Phone, CreditCard, X, User, PackageCheck, Receipt, MapPin,
  Download, ChevronLeft, Calendar, FileSpreadsheet, ChevronDown
} from "lucide-react";
import { generateInvoiceHTML } from "@/lib/invoiceTemplate";
import { AnimatePresence } from "framer-motion";

const downloadInvoicePDF = async (order: any, type: "GST" | "NON-GST") => {
  const html2pdf = (await import("html2pdf.js")).default;
  const invoiceHtmlString = generateInvoiceHTML(order, type);
  const element = document.createElement("div");
  element.innerHTML = invoiceHtmlString;

  const options: any = {
    margin: 10,
    filename: `Bannira_Invoice_${type}_${order._id.slice(-6).toUpperCase()}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
  };
  html2pdf().from(element).set(options).save();
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"online" | "offline">("online");

  // PAGINATION STATES
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // EXPORT POPUP MODAL STATES
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportType, setExportType] = useState<"month" | "range">("month");
  const [exportMonth, setExportMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [exportStartDate, setExportStartDate] = useState("");
  const [exportEndDate, setExportEndDate] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  // ROW-LEVEL STATUS UPDATING MUTATION LOOPS
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const fetchOrders = async (tabType: "online" | "offline") => {
    try {
      setLoading(true);
      const endpoint = tabType === "online" ? "/api/orders" : "/api/admin/offline-sales";
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error(`Server responded with status: ${res.status}`);
      const data = await res.json();
      
      // Data standard formatting allocation map loops
      const fetchedArray = Array.isArray(data) ? data : data.sales || data.orders || [];
      
      // 🔥 FIXED: Online screen strictly filters to only show 'Paid' transactions
      if (tabType === "online") {
        const onlyPaidOnline = fetchedArray.filter((o: any) => o.paymentStatus === "Paid");
        setOrders(onlyPaidOnline);
      } else {
        setOrders(fetchedArray); // Offline transactions are implicitly counter-paid desk context
      }
      
      setCurrentPage(1); // Reset to page 1 on tab shift switch trigger
    } catch (err) {
      console.error(`Failed to fetch ${tabType} orders schemas`, err);
      setOrders([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchOrders(activeTab); 
  }, [activeTab]);

  // 🔥 FIXED & UPGRADED: REAL-TIME MONGO DATABASE ORDERSTATUS KEY SYNC PIPELINE
  const handleUpdateStatusInDB = async (orderId: string, currentInvoiceNum: string, newStatus: string) => {
    const uniqueRowId = orderId || currentInvoiceNum;
    setUpdatingOrderId(uniqueRowId);
    try {
      const endpoint = activeTab === "online" ? "/api/orders/update-status" : "/api/admin/offline-sales/update-status";
      const res = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: activeTab === "online" ? orderId : null,
          invoiceNumber: activeTab === "offline" ? currentInvoiceNum : null,
          status: newStatus // Target string values map strictly to: "Pending" | "In-Process" | "Success"
        })
      });

      if (!res.ok) throw new Error("Could not modify inventory state matrix.");
      
      // Local state modification instantly maps new data layout variables matrix context
      // setOrders((prevOrders: any) => 
      //   prevOrders.map((o: any) => {
      //     const matchCondition = activeTab === "online" ? o._id === orderId : o.invoiceNumber === currentInvoiceNum;
      //     return matchCondition ? { ...o, orderStatus: newStatus } : o;
      //   })
      // );
      setOrders((prevOrders: any) => 
  prevOrders.map((o: any) => {
    const matchCondition = activeTab === "online" ? o._id === orderId : o.invoiceNumber === currentInvoiceNum;
    return matchCondition ? { ...o, status: newStatus } : o;
  })
);
    } catch (err) {
      alert("Failed to update status in live Database. Please verify your endpoints schema structure.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // EXPORT ENGINE FOR SEPARATE ONLINE & OFFLINE WORKSHEET TABS
  const handleExportMultiTabExcel = async () => {
    setIsExporting(true);
    try {
      const [onlineRes, offlineRes] = await Promise.all([
        fetch("/api/orders"),
        fetch("/api/admin/offline-sales")
      ]);

      const onlineDataRaw = await onlineRes.json();
      const offlineDataRaw = await offlineRes.json();

      const allOnlineOrders = Array.isArray(onlineDataRaw) ? onlineDataRaw : onlineDataRaw.orders || [];
      const allOfflineSales = Array.isArray(offlineDataRaw) ? offlineDataRaw : offlineDataRaw.sales || [];

      // Only Paid filtering engine parameters context
      const paidOnlineOrders = allOnlineOrders.filter((o: any) => o.paymentStatus === "Paid");
      const paidOfflineSales = allOfflineSales; 

      const filterByTimeline = (dataset: any[]) => {
        if (exportType === "month") {
          return dataset.filter((o: any) => o.createdAt.startsWith(exportMonth));
        } else if (exportType === "range" && exportStartDate && exportEndDate) {
          const start = new Date(exportStartDate);
          const end = new Date(exportEndDate);
          end.setHours(23, 59, 59, 999);
          return dataset.filter((o: any) => {
            const d = new Date(o.createdAt);
            return d >= start && d <= end;
          });
        }
        return dataset;
      };

      const finalOnlineList = filterByTimeline(paidOnlineOrders);
      const finalOfflineList = filterByTimeline(paidOfflineSales);

      if (finalOnlineList.length === 0 && finalOfflineList.length === 0) {
        alert("No verified paid transaction logs found for the selected timeline");
        setIsExporting(false);
        return;
      }

      let finalFileName = "Bannira-sales-report";
      
      if (exportType === "month") {
        const [year, monthStr] = exportMonth.split("-");
        const monthNames = [
          "January", "February", "March", "April", "May", "June", 
          "July", "August", "September", "October", "November", "December"
        ];
        const monthName = monthNames[parseInt(monthStr, 10) - 1];
        finalFileName = `Bannira-sales-report-${monthName}-${year}`;
      } else if (exportType === "range" && exportStartDate && exportEndDate) {
        const formatDateDDMM = (dateString: string) => {
          const d = new Date(dateString);
          const day = String(d.getDate()).padStart(2, "0");
          const month = String(d.getMonth() + 1).padStart(2, "0");
          return `${day}${month}`;
        };
        finalFileName = `Bannira-sales-report-${formatDateDDMM(exportStartDate)}-${formatDateDDMM(exportEndDate)}`;
      }

      let xmlOutputString = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="HeaderStyle">
   <Font ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#7B2D0A" ss:Pattern="Solid"/>
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
  </Style>
  <Style ss:ID="TitleStyle">
   <Font ss:Size="14" ss:Bold="1" ss:Color="#1E293B"/>
  </Style>
  <Style ss:ID="DefaultCell">
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
  </Style>
 </Styles>
      `;

      xmlOutputString += `
 <Worksheet ss:Name="Online Sales Report">
  <Table>
   <Row ss:Height="25"><Cell ss:StyleID="TitleStyle"><Data ss:Type="String">BANNIRA - ONLINE SALES REPORT</Data></Cell></Row>
   <Row ss:Height="20">
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Date</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Order ID</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Customer Name</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Customer Phone</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Items Count</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Payment Status</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Order Status</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Total Amount</Data></Cell>
   </Row>
      `;

      finalOnlineList.forEach((o: any) => {
        xmlOutputString += `
   <Row>
    <Cell ss:StyleID="DefaultCell"><Data ss:Type="String">${new Date(o.createdAt).toLocaleDateString("en-GB")}</Data></Cell>
    <Cell ss:StyleID="DefaultCell"><Data ss:Type="String">${o._id}</Data></Cell>
    <Cell ss:StyleID="DefaultCell"><Data ss:Type="String">${o.shippingAddress?.fullName || o.userName || "N/A"}</Data></Cell>
    <Cell ss:StyleID="DefaultCell"><Data ss:Type="String">${o.shippingAddress?.phone || o.userPhone || "N/A"}</Data></Cell>
    <Cell ss:StyleID="DefaultCell"><Data ss:Type="Number">${o.items?.length || 0}</Data></Cell>
    <Cell ss:StyleID="DefaultCell"><Data ss:Type="String">${o.paymentStatus || "Pending"}</Data></Cell>
    <Cell ss:StyleID="DefaultCell"><Data ss:Type="String">${o.orderStatus || "Pending"}</Data></Cell>
    <Cell ss:StyleID="DefaultCell"><Data ss:Type="String">₹${o.totalAmount || o.total || 0}</Data></Cell>
   </Row>
        `;
      });
      xmlOutputString += `  </Table>
 </Worksheet>
      `;

      xmlOutputString += `
 <Worksheet ss:Name="Offline Sales Report">
  <Table>
   <Row ss:Height="25"><Cell ss:StyleID="TitleStyle"><Data ss:Type="String">BANNIRA - OFFLINE SALES REPORT</Data></Cell></Row>
   <Row ss:Height="20">
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Date</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Invoice Number</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Customer Name</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Customer Phone</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Customer GSTIN</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Sell Through</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Items Count</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Order Status</Data></Cell>
    <Cell ss:StyleID="HeaderStyle"><Data ss:Type="String">Total Amount</Data></Cell>
   </Row>
      `;

      finalOfflineList.forEach((o: any) => {
        xmlOutputString += `
   <Row>
    <Cell ss:StyleID="DefaultCell"><Data ss:Type="String">${new Date(o.createdAt).toLocaleDateString("en-GB")}</Data></Cell>
    <Cell ss:StyleID="DefaultCell"><Data ss:Type="String">${o.invoiceNumber}</Data></Cell>
    <Cell ss:StyleID="DefaultCell"><Data ss:Type="String">${o.customerName || "Walk-In Buyer"}</Data></Cell>
    <Cell ss:StyleID="DefaultCell"><Data ss:Type="String">${o.customerPhone || "N/A"}</Data></Cell>
    <Cell ss:StyleID="DefaultCell"><Data ss:Type="String">${o.customerGst || "N/A"}</Data></Cell>
    <Cell ss:StyleID="DefaultCell"><Data ss:Type="String">${o.sellThrough || "In-store"}</Data></Cell>
    <Cell ss:StyleID="DefaultCell"><Data ss:Type="Number">${o.items?.length || 0}</Data></Cell>
    <Cell ss:StyleID="DefaultCell"><Data ss:Type="String">${o.orderStatus || "Pending"}</Data></Cell>
    <Cell ss:StyleID="DefaultCell"><Data ss:Type="String">₹${o.totalAmount || 0}</Data></Cell>
   </Row>
        `;
      });
      xmlOutputString += `  </Table>
 </Worksheet>
</Workbook>
      `;

      const blob = new Blob([xmlOutputString], { type: "application/vnd.ms-excel" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${finalFileName}.xls`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExportModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Something went wrong during file compilation.");
    } finally {
      setIsExporting(false);
    }
  };

  const preFilteredOrders = orders.filter((o: any) => {
    const name = (o.shippingAddress?.fullName || o.customerName || o.userName || "").toLowerCase();
    const id = (o._id || o.invoiceNumber || "").toString().toLowerCase();
    const term = searchTerm.toLowerCase();
    return name.includes(term) || id.includes(term);
  });

  // PAGINATION CALCULATIONS
  const totalPages = Math.ceil(preFilteredOrders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPagedOrdersList = preFilteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="w-full max-w-[300px] md:max-w-[1200px] mx-auto animate-in fade-in duration-700 pb-20 px-0 md:px-4 min-w-0 overflow-hidden">
      {/* Header Widget */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-10">
        <div>
          <h1 className="text-2xl font-serif font-bold tracking-tight text-slate-900">Orders</h1>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">
            {preFilteredOrders.length} Total {activeTab === "online" ? "Online" : "Offline"} Orders Found
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 group w-auto">
          <button
            type="button"
            onClick={() => setIsExportModalOpen(true)}
            className="px-4 py-3 bg-white border border-slate-200/60 text-slate-700 hover:text-[#7B2D0A] hover:bg-stone-50 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          >
            <FileSpreadsheet size={15} className="text-emerald-600" />
            <span>Export Data</span>
          </button>

          <div className="flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/30 self-start">
            <button
              type="button"
              onClick={() => { setActiveTab("online"); setSelectedOrder(null); }}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all duration-200 cursor-pointer ${
                activeTab === "online" ? "bg-white text-slate-900 shadow-xs" : "text-slate-400 hover:text-slate-700"
              }`}
            >
              Online Orders
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab("offline"); setSelectedOrder(null); }}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all duration-200 cursor-pointer ${
                activeTab === "offline" ? "bg-white text-slate-900 shadow-xs" : "text-slate-400 hover:text-slate-700"
              }`}
            >
              Offline Orders
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
            <input
              type="text"
              placeholder="Search customer or Order ID..."
              className="pl-10 pr-6 py-3 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-1 focus:ring-[#D4AF37] w-full md:w-80 text-xs transition-all shadow-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Grid Canvas Panel */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-[40vh] text-slate-400 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <Loader2 className="animate-spin mb-4 text-[#D4AF37]" size={32} />
          <p className="text-[10px] uppercase tracking-[0.2em] font-black text-center">Scanning Storage Files...</p>
        </div>
      ) : (
        <div className="w-full bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between min-h-[500px]">
          <div className="w-full overflow-x-auto block min-w-0 clear-both">
            <table className="w-full text-left border-collapse min-w-[950px] table-auto">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 w-[15%]">Date & ID</th>
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 w-[20%]">Customer</th>
                  {activeTab === "online" && <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 w-[15%]">Items</th>}
                  {activeTab === "offline" && <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 w-[20%]">Sell Through</th>}
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right w-[12%]">Amount</th>
                  {activeTab === "online" && (
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center w-[18%]">Order Status</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentPagedOrdersList.map((order: any) => {
                  const orderIdString = order._id ? order._id.toString() : "";
                  const displayId = order.invoiceNumber || `#${orderIdString.slice(-6).toUpperCase()}`;
                  const customerName = order.shippingAddress?.fullName || order.customerName || order.userName || "Walk-In Buyer";
                  const customerPhone = order.shippingAddress?.phone || order.customerPhone || order.phone || "N/A";
                  const paymentDisplay = order.paymentMethod || order.paymentMode || "COD";
                  const finalAmount = order.totalAmount || order.total || 0;
                  const platformChannel = order.sellThrough || "In-store";
                  const currentOrderStatus = order.status || "Pending";

                  return (
                    <tr key={order._id || displayId} className="hover:bg-slate-100 transition-all group cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap" onClick={() => setSelectedOrder({ ...order, customerName, customerPhone, paymentDisplay, finalAmount })} >
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-slate-900 mb-0.5">{displayId}</span>
                          <span className="text-[9px] text-slate-400 font-medium">{new Date(order.createdAt).toLocaleDateString("en-GB")}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap" onClick={() => setSelectedOrder({ ...order, customerName, customerPhone, paymentDisplay, finalAmount })} >
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 text-xs">{customerName}</span>
                          <span className="text-[9px] text-slate-400">{customerPhone}</span>
                        </div>
                      </td>

                      {activeTab === "online" && (
                        <td className="px-6 py-4 whitespace-nowrap" onClick={() => setSelectedOrder({ ...order, customerName, customerPhone, paymentDisplay, finalAmount })} >
                          <div className="flex -space-x-2">
                            {(order.items || []).slice(0, 3).map((item: any, i: number) => (
                              <img key={i} src={item.image || "/placeholder.jpg"} className="w-8 h-10 rounded-md border-2 border-white object-cover shadow-sm inline-block" alt="item thumbnail" />
                            ))}
                            {(order.items || []).length > 3 && (
                              <div className="w-8 h-10 rounded-md border-2 border-white bg-slate-100 inline-flex items-center justify-center text-[8px] font-black text-slate-400">+{(order.items || []).length - 3}</div>
                            )}
                          </div>
                        </td>
                      )}

                      {activeTab === "offline" && (
                        <td className="px-6 py-4 whitespace-nowrap" onClick={() => setSelectedOrder({ ...order, customerName, customerPhone, paymentDisplay, finalAmount })} >
                          <span className={`text-[9px] font-extrabold tracking-wider px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-md uppercase ${
                            platformChannel === "Amazon" ? "text-orange-500 bg-orange-50/30" :
                            platformChannel === "Flipkart" ? "text-blue-500 bg-blue-50/30" :
                            platformChannel === "Meesho" ? "text-pink-500 bg-pink-50/30" : "text-slate-600"
                          }`}>{platformChannel}</span>
                        </td>
                      )}

                      <td className="px-6 py-4 text-right whitespace-nowrap" onClick={() => setSelectedOrder({ ...order, customerName, customerPhone, paymentDisplay, finalAmount })} >
                        <span className="font-black text-slate-900 text-xs">₹{finalAmount.toLocaleString("en-IN")}</span>
                      </td>

                      {activeTab === "online" && (
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="relative inline-block w-full max-w-[145px]" onClick={(e) => e.stopPropagation()}>
                          {updatingOrderId === (order._id || order.invoiceNumber) ? (
                            <div className="flex items-center justify-center py-1"><Loader2 className="animate-spin text-[#7B2D0A]" size={14} /></div>
                          ) : (
                            <div className="relative group/select flex items-center">
                              <select
                                value={currentOrderStatus}
                                onChange={(e) => handleUpdateStatusInDB(order._id, order.invoiceNumber, e.target.value)}
                                className={`w-full appearance-none bg-transparent border-2 font-black rounded-2xl px-4 py-2 pr-8 text-[10px] uppercase tracking-wider outline-none cursor-pointer transition-all duration-300 hover:shadow-xs shadow-[#7B2D0A]/5 ${
                                  currentOrderStatus === "Pending" ? "text-red-700 bg-red-50/60 border-red-200/80 hover:border-red-400" :
                                  currentOrderStatus === "In-Process" ? "text-yellow-400 bg-amber-50/60 border-amber-200/80 hover:border-amber-400" :
                                  "text-emerald-700 bg-emerald-50/60 border-emerald-200/80 hover:border-emerald-400"
                                }`}
                              >
                                <option value="Pending" className="text-red-700 bg-white font-bold">Pending</option>
                                <option value="In-Process" className="text-yellow-400 bg-white font-bold">In-Process</option>
                                <option value="Success" className="text-emerald-700 bg-white font-bold">Success</option>
                              </select>
                              <ChevronDown size={12} className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors pointer-events-none ${
                                currentOrderStatus === "Pending" ? "text-red-500" :
                                currentOrderStatus === "In-Process" ? "text-amber-700" :
                                "text-emerald-500"
                              }`} />
                            </div>
                          )}
                        </div>
                      </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* PAGINATION PANEL FOOTER BAR */}
          {totalPages > 1 && (
            <div className="p-4 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between mt-auto px-6">
              <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Page {currentPage} of {totalPages}</p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="p-2 bg-white border border-slate-200 rounded-xl disabled:opacity-40 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="p-2 bg-white border border-slate-200 rounded-xl disabled:opacity-40 hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

          {preFilteredOrders.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-slate-300">
              <ShoppingBag size={32} strokeWidth={1} className="mb-3" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No matching {activeTab} orders found</p>
            </div>
          )}
        </div>
      )}

      {/* EXPORT PARAMETERS RANGE SELECTION MODAL POPUP */}
      <AnimatePresence>
        {isExportModalOpen && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setIsExportModalOpen(false)} />
            <div className="bg-white rounded-[2rem] w-full max-w-[420px] p-6 shadow-2xl relative z-10 border border-slate-100 animate-in scale-in duration-300">
              <div className="flex items-center justify-between border-b pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-[#7B2D0A]" />
                  <h3 className=" font-bold text-lg text-slate-900">Configure CSV Export</h3>
                </div>
                <button type="button" onClick={() => setIsExportModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-full text-slate-400"><X size={16} /></button>
              </div>

              <div className="space-y-6">
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/20 text-center">
                  <button type="button" onClick={() => setExportType("month")} className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${exportType === "month" ? "bg-white text-slate-900 shadow-xs" : "text-slate-400"}`}>By Month</button>
                  <button type="button" onClick={() => setExportType("range")} className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${exportType === "range" ? "bg-white text-slate-900 shadow-xs" : "text-slate-400"}`}>Custom Range</button>
                </div>

                {exportType === "month" ? (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Select Targeting Month</label>
                    <input type="month" value={exportMonth} onChange={e => setExportMonth(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-[#7B2D0A]" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Start Date</label>
                      <input type="date" value={exportStartDate} onChange={e => setExportStartDate(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-3 text-xs outline-none focus:ring-1 focus:ring-[#7B2D0A]" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">End Date</label>
                      <input type="date" value={exportEndDate} onChange={e => setExportEndDate(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-3 text-xs outline-none focus:ring-1 focus:ring-[#7B2D0A]" />
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  disabled={isExporting || (exportType === "range" && (!exportStartDate || !exportEndDate))}
                  onClick={handleExportMultiTabExcel}
                  className="w-full mt-2 py-4 bg-[#D4AF37] hover:bg-[#bfa032] text-zinc-900 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#D4AF37]/10 disabled:opacity-40 cursor-pointer"
                >
                  {isExporting ? <Loader2 className="animate-spin" size={14} /> : <><Download size={14} /> Download Reports</>}
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* --- RESPONSIVE ORDER DETAILS MODAL / DRAWER --- */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-[110] flex items-end md:items-center justify-center md:justify-end p-0 md:p-4 animate-in fade-in duration-300">
          <div className="bg-white h-[90vh] md:h-full max-w-full md:max-w-xl w-full rounded-t-[2.5rem] md:rounded-t-none md:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom md:slide-in-from-right duration-500">
            {/* Modal Header */}
            <div className="p-6 md:p-8 border-b border-slate-50 flex items-center justify-between shrink-0">
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-1">Order Review</p>
                <p className="text-base md:text-lg font-bold text-slate-900 truncate">ID: {selectedOrder.invoiceNumber || `#${selectedOrder._id.toString().slice(-6).toUpperCase()}`}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-red-500 transition-all shrink-0 cursor-pointer"><X size={20} /></button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 md:space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0"><User size={14} /></div>
                    <div>
                      <p className="text-[9px] font-black uppercase text-slate-400 mb-0.5">Customer</p>
                      <p className="text-xs font-bold text-slate-800">{selectedOrder.customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0"><Phone size={14} /></div>
                    <div>
                      <p className="text-[9px] font-black uppercase text-slate-400 mb-0.5">Phone</p>
                      <p className="text-xs font-bold text-slate-800">{selectedOrder.customerPhone}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0"><MapPin size={14} /></div>
                  <div>
                    <p className="text-[9px] font-black uppercase text-slate-400 mb-0.5">Shipping Address</p>
                    <p className="text-xs font-medium text-slate-600 leading-relaxed">
                      {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.area}, {selectedOrder.shippingAddress?.state}
                      <br />{selectedOrder.shippingAddress?.pincode}
                      {selectedOrder.shippingAddress?.gstNumber && <span className="block mt-1 font-bold text-[#7B2D0A]">GSTIN: {selectedOrder.shippingAddress.gstNumber}</span>}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <PackageCheck size={14} className="text-[#D4AF37]" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Ordered Items ({selectedOrder.items?.length || 0})</p>
                </div>
                <div className="space-y-3">
                  {(selectedOrder.items || []).map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100/50">
                      <img src={item.image || "/placeholder.jpg"} className="w-12 h-16 object-cover rounded-xl shadow-sm shrink-0" alt="product thumbnail" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[9px] font-black bg-white px-2 py-0.5 rounded border text-slate-400 uppercase">Size: {item.size}</span>
                          <span className="text-[9px] font-bold text-slate-400 tracking-tighter">Qty: {item.quantity}</span>
                        </div>
                      </div>
                      <p className="text-xs font-black text-slate-900 shrink-0">₹{(item.price || 0).toLocaleString("en-IN")}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-zinc-900 rounded-[2rem] p-6 text-white relative overflow-hidden shrink-0">
                <Receipt className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5 -rotate-12" />
                <div className="space-y-3 relative z-10">
                  <div className="flex justify-between text-xs text-zinc-400 font-medium"><span>Subtotal</span><span>₹{(selectedOrder.subtotal || 0).toLocaleString("en-IN")}</span></div>
                  <div className="flex justify-between text-xs text-zinc-400 font-medium"><span>Shipping</span><span className=" uppercase font-black tracking-widest text-[9px]">₹{selectedOrder.shippingCharge || 0}</span></div>
                  <div className="flex justify-between text-xs text-zinc-400 font-medium"><span>Tax</span><span className=" uppercase font-black tracking-widest text-[9px]">₹{(selectedOrder.tax || 0).toLocaleString("en-IN")}</span></div>
                  <div className="flex justify-between text-xs text-zinc-400 font-medium"><span>Discount</span><span className=" uppercase font-black tracking-widest text-[9px]">- ₹{(selectedOrder.discount || 0).toLocaleString("en-IN")}</span></div>
                  <div className="pt-3 border-t border-white/10 flex justify-between items-end">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">Total Amount</p>
                    <p className="text-xl md:text-2xl font-serif font-bold tracking-tight">₹{selectedOrder.finalAmount?.toLocaleString("en-IN")}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-100 flex shrink-0">
              <button onClick={() => downloadInvoicePDF(selectedOrder, "GST")} className="w-full px-4 py-4 border border-stone-200 bg-white hover:bg-[#7B2D0A]/5 hover:border-[#7B2D0A]/30 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#7B2D0A] transition-all cursor-pointer flex items-center justify-center gap-1"><Download size={12} /> GST INVOICE</button>
              {/* <button onClick={() => downloadInvoicePDF(selectedOrder, "NON-GST")} className="w-[50%] px-4 py-4 border border-slate-200 bg-white hover:bg-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-700 transition-all cursor-pointer flex items-center justify-center gap-1"><Download size={12} />Cash Memo (Non-gst)</button> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}