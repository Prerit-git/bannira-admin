// "use client";

// import { useState, useEffect } from "react";
// import { Plus, Trash2, Receipt, Loader2, ArrowRight, Info, Download, CheckCircle } from "lucide-react";
// import { generateInvoiceHTML } from "@/lib/invoiceTemplate";
// import { motion, AnimatePresence } from "framer-motion";

// export default function OfflineSale() {
//   const [products, setProducts] = useState<any[]>([]);
//   const [catalogLoading, setCatalogLoading] = useState(true);
//   const [billingLoading, setBillingLoading] = useState(false);
  
//   const [customer, setCustomer] = useState({ name: "In-store Customer", phone: "", gst: "" });
//   const [billItems, setBillItems] = useState<any[]>([]);
//   const [paymentMode, setPaymentMode] = useState("Cash");
//   const [discount, setDiscount] = useState(0);

//   const [productSearchTerm, setProductSearchTerm] = useState("");
//   const [selectedProdId, setSelectedProdId] = useState("");
//   const [selectedSize, setSelectedSize] = useState("");
//   const [selectedQty, setSelectedQty] = useState(1);
//   const [toast, setToast] = useState({ message: "", visible: false });

//   // Flow Lifecycle States
//   const [isSaleSaved, setIsSaleSaved] = useState(false);
//   const [savedOrderData, setSavedOrderData] = useState<any>(null);

//   useEffect(() => {
//     fetch("/api/products")
//       .then(res => res.json())
//       .then(data => { 
//         setProducts(Array.isArray(data) ? data : data.products || []); 
//         setCatalogLoading(false); 
//       })
//       .catch(() => setCatalogLoading(false));
//   }, []);

//   const showToast = (msg: string) => {
//     setToast({ message: msg, visible: true });
//     setTimeout(() => setToast({ message: "", visible: false }), 4000);
//   };

//   const filteredProductsOption = products.filter(p => 
//     p.name?.toLowerCase().includes(productSearchTerm.toLowerCase())
//   );

//   const currentSelectedProduct = products.find(p => (p._id || p.id) === selectedProdId);

//   let sizeVariantsObj: Record<string, number> = {};
//   if (currentSelectedProduct?.sizeVariants) {
//     sizeVariantsObj = typeof currentSelectedProduct.sizeVariants.toJSON === 'function' 
//       ? currentSelectedProduct.sizeVariants.toJSON() 
//       : currentSelectedProduct.sizeVariants;
//   }
//   const sizeOptions = Object.keys(sizeVariantsObj).filter(size => Number(sizeVariantsObj[size]) > 0);

//   const handleAddItemToGrid = () => {
//     if (isSaleSaved) return; 
//     if (!selectedProdId || !selectedSize || selectedQty <= 0 || !currentSelectedProduct) return;

//     const availableStockInDB = Number(sizeVariantsObj[selectedSize]) || 0;
//     const existingItem = billItems.find(item => item.productId === selectedProdId && item.size === selectedSize);
//     const existingQtyInGrid = existingItem ? existingItem.quantity : 0;
//     const totalRequestedQty = existingQtyInGrid + Number(selectedQty);

//     if (totalRequestedQty > availableStockInDB) {
//       showToast(`Sorry! Size ${selectedSize} only has ${availableStockInDB} units available in Database.`);
//       return;
//     }

//     if (existingItem) {
//       const updated = [...billItems];
//       const idx = billItems.findIndex(item => item.productId === selectedProdId && item.size === selectedSize);
//       updated[idx].quantity = totalRequestedQty;
//       setBillItems(updated);
//     } else {
//       setBillItems([...billItems, {
//         productId: selectedProdId,
//         name: currentSelectedProduct.name,
//         size: selectedSize,
//         quantity: Number(selectedQty),
//         price: Number(currentSelectedProduct.price),
//         image: currentSelectedProduct.image || currentSelectedProduct.images?.[0]
//       }]);
//     }
//     setSelectedSize("");
//     setSelectedQty(1);
//   };

//   const handleRemoveItem = (index: number) => {
//     if (isSaleSaved) return;
//     setBillItems(billItems.filter((_, i) => i !== index));
//   };

//   // Mandatory 18% tax constraints setup
//   const subtotal = billItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
//   const tax = Math.round(subtotal * 0.18);
//   const totalAmount = subtotal + tax - Number(discount);

//   const handleDownloadInvoice = async () => {
//     if (!savedOrderData) return;
    
//     const html2pdf = (await import("html2pdf.js")).default;
//     const invoiceType = customer.gst.trim().length > 0 ? "GST" : "NON-GST";
//     const element = document.createElement("div");

//     const invoiceFormatPayload = {
//       _id: savedOrderData._id || "OFFLINE_SALE",
//       subtotal: savedOrderData.subtotal !== undefined ? savedOrderData.subtotal : subtotal,
//       shippingCharge: 0,
//       tax: savedOrderData.tax !== undefined ? savedOrderData.tax : tax,
//       discount: savedOrderData.discount !== undefined ? savedOrderData.discount : Number(discount),
//       totalAmount: savedOrderData.totalAmount || totalAmount,
//       paymentMethod: savedOrderData.paymentMode || paymentMode,
//       paymentStatus: "Paid",
//       createdAt: savedOrderData.createdAt || new Date(),
//       items: savedOrderData.items || billItems,
//       shippingAddress: {
//         fullName: customer.name || "In-store Customer",
//         phone: customer.phone || "N/A",
//         email: "Offline Store Walk-In",
//         address: "Over-the-counter Offline Sale",
//         area: "Direct Store Desk",
//         state: "Store Register",
//         pincode: "000000",
//         gstNumber: customer.gst || ""
//       }
//     };

//     element.innerHTML = generateInvoiceHTML(invoiceFormatPayload, invoiceType);

//     const options: any = {
//       margin: 10,
//       filename: `Bannira_OfflineInvoice_${invoiceType}_${invoiceFormatPayload._id.toString().slice(-6).toUpperCase()}.pdf`,
//       image: { type: "jpeg", quality: 0.98 },
//       html2canvas: { scale: 2, useCORS: true },
//       jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
//     };

//     html2pdf().from(element).set(options).save();
//   };

//   const handleRecordSaleToDB = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (billItems.length === 0) return alert("Please select at least 1 design item silhouette.");

//     setBillingLoading(true);
//     try {
//       const res = await fetch("/api/admin/offline-sales", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           customerName: customer.name,
//           customerPhone: customer.phone,
//           customerGst: customer.gst,
//           items: billItems,
//           subtotal,
//           discount,
//           tax, 
//           totalAmount,
//           paymentMode
//         })
//       });

//       const result = await res.json();
//       if (!res.ok) throw new Error(result.error || "Failed to save offline counter order.");

//       setSavedOrderData(result.sale || result.order || result.data);
//       setIsSaleSaved(true);
//       showToast("Sale recorded successfully");
//     } catch (err: any) {
//       alert(err.message || "Something went wrong.");
//     } Richmond: {
//       setBillingLoading(false);
//     }
//   };

//   const handleResetForm = () => {
//     setBillItems([]);
//     setCustomer({ name: "In-store Customer", phone: "", gst: "" });
//     setDiscount(0);
//     setSelectedProdId("");
//     setProductSearchTerm("");
//     setIsSaleSaved(false);
//     setSavedOrderData(null);
//   };

//   return (
//     <div className="min-h-screen p-4 pt-12 text-slate-800">
//       <AnimatePresence>
//         {toast.visible && (
//           <motion.div initial={{ y: 50, opacity: 0, x: "-50%" }} animate={{ y: 0, opacity: 1, x: "-50%" }} exit={{ y: 50, opacity: 0, x: "-50%" }} className="fixed bottom-10 left-1/2 z-[300] bg-[#1C1C1C] text-red-400 px-8 py-4 rounded-2xl shadow-2xl border border-red-500/10 flex items-center gap-3 text-xs font-bold tracking-wide max-w-md text-center">
//             <Info size={16} className="text-red-400 shrink-0" />
//             <p>{toast.message}</p>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
//         {/* Left Side Content Area Block */}
//         <div className="lg:col-span-7 space-y-6">
//           <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
//             <div className="flex justify-between items-center border-b pb-3">
//               <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">1. Add Items</h2>
//               {isSaleSaved && (
//                 <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-md font-bold uppercase tracking-wider flex items-center gap-1">
//                   <CheckCircle size={12}/> Locked
//                 </span>
//               )}
//             </div>
            
//             <div className="space-y-4">
//               <div className="flex flex-col gap-1.5">
//                 <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Search Product Name</label>
//                 <input type="text" disabled={isSaleSaved} value={productSearchTerm} onChange={e => setProductSearchTerm(e.target.value)} placeholder="Type name to filter options below..." className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-[#7B2D0A] disabled:opacity-50 disabled:cursor-not-allowed" />
//               </div>

//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
//                 <div className="flex flex-col gap-1.5">
//                   <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Select Product</label>
//                   <select disabled={isSaleSaved} value={selectedProdId} onChange={e => { setSelectedProdId(e.target.value); setSelectedSize(""); }} className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-3 text-xs outline-none focus:ring-1 focus:ring-[#7B2D0A] w-full disabled:opacity-50 disabled:cursor-not-allowed">
//                     <option value="">Choose item...</option>
//                     {filteredProductsOption.map(p => <option key={p._id || p.id} value={p._id || p.id}>{p.name} (₹{p.price})</option>)}
//                   </select>
//                 </div>

//                 <div className="flex flex-col gap-1.5">
//                   <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Select Size (Stock)</label>
//                   <select disabled={isSaleSaved || !selectedProdId} value={selectedSize} onChange={e => setSelectedSize(e.target.value)} className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-3 text-xs outline-none focus:ring-1 focus:ring-[#7B2D0A] disabled:opacity-50 w-full disabled:cursor-not-allowed">
//                     <option value="">Size...</option>
//                     {sizeOptions.map(s => <option key={s} value={s}>{s} ({sizeVariantsObj[s]} left)</option>)}
//                   </select>
//                 </div>

//                 <div className="flex gap-2">
//                   <div className="flex flex-col gap-1.5 w-20">
//                     <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Qty</label>
//                     <input type="number" min={1} disabled={isSaleSaved} value={selectedQty} onChange={e => setSelectedQty(Math.max(1, Number(e.target.value)))} className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-3 text-xs outline-none text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" />
//                   </div>
//                   <button type="button" disabled={isSaleSaved} onClick={handleAddItemToGrid} className="flex-1 bg-[#7B2D0A] text-white hover:bg-black rounded-xl py-3 px-4 flex items-center justify-center transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"><Plus size={16} /></button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm overflow-hidden">
//             <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b pb-3 mb-4">2. Products List</h2>
//             {billItems.length === 0 ? (
//               <p className="text-center py-10 text-xs italic text-slate-300">No items</p>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full text-left text-xs border-collapse">
//                   <thead>
//                     <tr className="border-b border-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-400">
//                       <th className="py-2">Description</th>
//                       <th className="py-2 text-center">Size</th>
//                       <th className="py-2 text-center">Qty</th>
//                       <th className="py-2 text-right">Rate</th>
//                       <th className="py-2 text-right">Total</th>
//                       {!isSaleSaved && <th className="py-2 text-center">Action</th>}
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
//                     {billItems.map((item, index) => (
//                       <tr key={index}>
//                         <td className="py-3 max-w-[200px] truncate">{item.name}</td>
//                         <td className="py-3 text-center font-bold">{item.size}</td>
//                         <td className="py-3 text-center">{item.quantity}</td>
//                         <td className="py-3 text-right font-mono">₹{item.price}</td>
//                         <td className="py-3 text-right font-mono font-bold text-slate-900">₹{item.price * item.quantity}</td>
//                         {!isSaleSaved && (
//                           <td className="py-3 text-center">
//                             <button type="button" onClick={() => handleRemoveItem(index)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
//                           </td>
//                         )}
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Right Side Sidebar Actions Block */}
//         <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-32">
//           <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
//             <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b pb-3">3. Customer Information</h2>
//             <div className="space-y-4">
//               <input type="text" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-[#7B2D0A]" placeholder="Customer Name *" required />
//               <input type="text" maxLength={10} value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value.replace(/\D/g,"")})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-[#7B2D0A]" placeholder="Mobile Number (Optional)" />
//               <input type="text" maxLength={15} value={customer.gst} onChange={e => setCustomer({...customer, gst: e.target.value.toUpperCase()})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-[#7B2D0A] uppercase" placeholder="Customer GSTIN (optional)" />
//             </div>
//           </div>

//           <div className="bg-zinc-900 text-white rounded-[2rem] p-6 shadow-xl space-y-5 relative overflow-hidden">
//             <Receipt className="absolute -right-4 -bottom-4 w-20 h-20 text-white/5 -rotate-12" />
//             <div className="space-y-3 relative z-10 font-medium text-xs text-zinc-400">
//               <div className="flex justify-between"><span>Subtotal</span><span className="text-white">₹{subtotal.toLocaleString()}</span></div>
//               <div className="flex justify-between items-center">
//                 <span>Manual Discount (₹)</span>
//                 <input type="number" min={0} value={discount} onChange={e => setDiscount(Math.max(0, Number(e.target.value)))} className="w-24 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-right text-white font-mono text-xs outline-none" />
//               </div>
              
//               <div className="flex justify-between">
//                 <span>Tax (IGST 18%)</span>
//                 <span className="text-[#D4AF37] font-bold">₹{tax.toLocaleString()}</span>
//               </div>
              
//               <div className="flex justify-between items-center pt-2">
//                 <span>Payment Mode</span>
//                 <select value={paymentMode} onChange={e => setPaymentMode(e.target.value)} className="bg-white/10 border border-white/10 text-white font-bold rounded-lg px-2 py-1 outline-none text-xs">
//                   <option value="Cash" className="text-slate-900">Cash</option>
//                   <option value="UPI" className="text-slate-900">Online Payment</option>
//                   <option value="Card" className="text-slate-900">Credit/Debit Card</option>
//                 </select>
//               </div>
//               <div className="h-px bg-white/10 my-2" />
//               <div className="flex justify-between items-center">
//                 <span className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Grand Total</span>
//                 <span className="text-2xl font-serif text-[#D4AF37] font-bold">₹{totalAmount.toLocaleString()}</span>
//               </div>
//             </div>

//             {/* ACTION SWITCHER MATRIX */}
//             <div className="relative z-10 pt-2">
//               <AnimatePresence mode="wait">
//                 {!isSaleSaved ? (
//                   <button 
//                     key="save-btn"
//                     type="button" 
//                     disabled={billingLoading || billItems.length === 0} 
//                     onClick={handleRecordSaleToDB}
//                     className="w-full py-4 bg-[#D4AF37] hover:bg-[#c4a030] text-zinc-900 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-30 cursor-pointer shadow-lg shadow-[#D4AF37]/10"
//                   >
//                     {billingLoading ? <Loader2 className="animate-spin" size={14} /> : <><Receipt size={14} /> Record Sale <ArrowRight size={14}/></>}
//                   </button>
//                 ) : (
//                   <div key="download-block" className="space-y-3">
//                     {/* <button 
//                       type="button" 
//                       onClick={handleDownloadInvoice}
//                       className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
//                     >
//                       <Download size={14} /> Download Invoice
//                     </button> */}
                    
//                     <button 
//                       type="button" 
//                       onClick={handleResetForm}
//                       className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer"
//                     >
//                       New Billing
//                     </button>
//                   </div>
//                 )}
//               </AnimatePresence>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Receipt, Loader2, ArrowRight, Info, Download, CheckCircle, ChevronDown } from "lucide-react";
import { generateInvoiceHTML } from "@/lib/invoiceTemplate";
import { motion, AnimatePresence } from "framer-motion";

export default function OfflineSale() {
  const [products, setProducts] = useState<any[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [billingLoading, setBillingLoading] = useState(false);
  
  // 🔥 FIXED: Added 'sellThrough' default configuration & 'customSellThrough' state mapping
  const [customer, setCustomer] = useState({ 
    name: "In-store Customer", 
    phone: "", 
    gst: "",
    sellThrough: "In-store", 
    customSellThrough: "" 
  });
  
  const [billItems, setBillItems] = useState<any[]>([]);
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [discount, setDiscount] = useState(0);

  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [selectedProdId, setSelectedProdId] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedQty, setSelectedQty] = useState(1);
  const [toast, setToast] = useState({ message: "", visible: false });

  // Flow Lifecycle States
  const [isSaleSaved, setIsSaleSaved] = useState(false);
  const [savedOrderData, setSavedOrderData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => { 
        setProducts(Array.isArray(data) ? data : data.products || []); 
        setCatalogLoading(false); 
      })
      .catch(() => setCatalogLoading(false));
  }, []);

  const showToast = (msg: string) => {
    setToast({ message: msg, visible: true });
    setTimeout(() => setToast({ message: "", visible: false }), 4000);
  };

  const filteredProductsOption = products.filter(p => 
    p.name?.toLowerCase().includes(productSearchTerm.toLowerCase())
  );

  const currentSelectedProduct = products.find(p => (p._id || p.id) === selectedProdId);

  let sizeVariantsObj: Record<string, number> = {};
  if (currentSelectedProduct?.sizeVariants) {
    sizeVariantsObj = typeof currentSelectedProduct.sizeVariants.toJSON === 'function' 
      ? currentSelectedProduct.sizeVariants.toJSON() 
      : currentSelectedProduct.sizeVariants;
  }
  const sizeOptions = Object.keys(sizeVariantsObj).filter(size => Number(sizeVariantsObj[size]) > 0);

  const handleAddItemToGrid = () => {
    if (isSaleSaved) return; 
    if (!selectedProdId || !selectedSize || selectedQty <= 0 || !currentSelectedProduct) return;

    const availableStockInDB = Number(sizeVariantsObj[selectedSize]) || 0;
    const existingItem = billItems.find(item => item.productId === selectedProdId && item.size === selectedSize);
    const existingQtyInGrid = existingItem ? existingItem.quantity : 0;
    const totalRequestedQty = existingQtyInGrid + Number(selectedQty);

    if (totalRequestedQty > availableStockInDB) {
      showToast(`Sorry! Size ${selectedSize} only has ${availableStockInDB} units available in Database.`);
      return;
    }

    if (existingItem) {
      const updated = [...billItems];
      const idx = billItems.findIndex(item => item.productId === selectedProdId && item.size === selectedSize);
      updated[idx].quantity = totalRequestedQty;
      setBillItems(updated);
    } else {
      setBillItems([...billItems, {
        productId: selectedProdId,
        name: currentSelectedProduct.name,
        size: selectedSize,
        quantity: Number(selectedQty),
        price: Number(currentSelectedProduct.price),
        image: currentSelectedProduct.image || currentSelectedProduct.images?.[0]
      }]);
    }
    setSelectedSize("");
    setSelectedQty(1);
  };

  const handleRemoveItem = (index: number) => {
    if (isSaleSaved) return;
    setBillItems(billItems.filter((_, i) => i !== index));
  };

  // Mandatory 18% tax constraints setup
  const subtotal = billItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = Math.round(subtotal * 0.18);
  const totalAmount = subtotal + tax - Number(discount);

  const handleDownloadInvoice = async () => {
    if (!savedOrderData) return;
    
    const html2pdf = (await import("html2pdf.js")).default;
    const invoiceType = customer.gst.trim().length > 0 ? "GST" : "NON-GST";
    const element = document.createElement("div");

    const finalPlatformLabel = customer.sellThrough === "Other" ? customer.customSellThrough : customer.sellThrough;

    const invoiceFormatPayload = {
      _id: savedOrderData._id || "OFFLINE_SALE",
      subtotal: savedOrderData.subtotal !== undefined ? savedOrderData.subtotal : subtotal,
      shippingCharge: 0,
      tax: savedOrderData.tax !== undefined ? savedOrderData.tax : tax,
      discount: savedOrderData.discount !== undefined ? savedOrderData.discount : Number(discount),
      totalAmount: savedOrderData.totalAmount || totalAmount,
      paymentMethod: savedOrderData.paymentMode || paymentMode,
      paymentStatus: "Paid",
      createdAt: savedOrderData.createdAt || new Date(),
      items: savedOrderData.items || billItems,
      shippingAddress: {
        fullName: customer.name || "In-store Customer",
        phone: customer.phone || "N/A",
        email: `Channel: ${finalPlatformLabel}`,
        address: "Over-the-counter Offline Sale",
        area: "Direct Store Desk",
        state: "Store Register",
        pincode: "000000",
        gstNumber: customer.gst || ""
      }
    };

    element.innerHTML = generateInvoiceHTML(invoiceFormatPayload, invoiceType);

    const options: any = {
      margin: 10,
      filename: `Bannira_OfflineInvoice_${invoiceType}_${invoiceFormatPayload._id.toString().slice(-6).toUpperCase()}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    };

    html2pdf().from(element).set(options).save();
  };

  const handleRecordSaleToDB = async (e: React.FormEvent) => {
    e.preventDefault();
    if (billItems.length === 0) return alert("Please select at least 1 design item silhouette.");
    
    // Validate custom string input context if Other is active selected
    if (customer.sellThrough === "Other" && !customer.customSellThrough.trim()) {
      return alert("Please enter the specific platform name for 'Other' channels.");
    }

    const finalChannelSource = customer.sellThrough === "Other" ? customer.customSellThrough.trim() : customer.sellThrough;

    setBillingLoading(true);
    try {
      const res = await fetch("/api/admin/offline-sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customer.name,
          customerPhone: customer.phone,
          customerGst: customer.gst,
          sellThrough: finalChannelSource, // Sending localized source platform tracker to DB
          items: billItems,
          subtotal,
          discount,
          tax, 
          totalAmount,
          paymentMode
        })
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to save offline counter order.");

      setSavedOrderData(result.sale || result.order || result.data);
      setIsSaleSaved(true);
      showToast("Sale recorded successfully");
    } catch (err: any) {
      alert(err.message || "Something went wrong.");
    } finally {
      setBillingLoading(false);
    }
  };

  const handleResetForm = () => {
    setBillItems([]);
    setCustomer({ name: "In-store Customer", phone: "", gst: "", sellThrough: "In-store", customSellThrough: "" });
    setDiscount(0);
    setSelectedProdId("");
    setProductSearchTerm("");
    setIsSaleSaved(false);
    setSavedOrderData(null);
  };

  return (
    <div className="min-h-screen p-0 md:p-4 pt-12 text-slate-800">
      <AnimatePresence>
        {toast.visible && (
          <motion.div initial={{ y: 50, opacity: 0, x: "-50%" }} animate={{ y: 0, opacity: 1, x: "-50%" }} exit={{ y: 50, opacity: 0, x: "-50%" }} className="fixed bottom-10 left-1/2 z-[300] bg-[#1C1C1C] text-red-400 px-8 py-4 rounded-2xl shadow-2xl border border-red-500/10 flex items-center gap-3 text-xs font-bold tracking-wide max-w-md text-center">
            <Info size={16} className="text-red-400 shrink-0" />
            <p>{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side Content Area Block */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">1. Add Items</h2>
              {isSaleSaved && (
                <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-md font-bold uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle size={12}/> Locked
                </span>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Search Product Name</label>
                <input type="text" disabled={isSaleSaved} value={productSearchTerm} onChange={e => setProductSearchTerm(e.target.value)} placeholder="Type name to filter options below..." className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-[#7B2D0A] disabled:opacity-50 disabled:cursor-not-allowed" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Select Product</label>
                  <select disabled={isSaleSaved} value={selectedProdId} onChange={e => { setSelectedProdId(e.target.value); setSelectedSize(""); }} className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-3 text-xs outline-none focus:ring-1 focus:ring-[#7B2D0A] w-full disabled:opacity-50 disabled:cursor-not-allowed">
                    <option value="">Choose item...</option>
                    {filteredProductsOption.map(p => <option key={p._id || p.id} value={p._id || p.id}>{p.name} (₹{p.price})</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Select Size (Stock)</label>
                  <select disabled={isSaleSaved || !selectedProdId} value={selectedSize} onChange={e => setSelectedSize(e.target.value)} className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-3 text-xs outline-none focus:ring-1 focus:ring-[#7B2D0A] disabled:opacity-50 w-full disabled:cursor-not-allowed">
                    <option value="">Size...</option>
                    {sizeOptions.map(s => <option key={s} value={s}>{s} ({sizeVariantsObj[s]} left)</option>)}
                  </select>
                </div>

                <div className="flex gap-2">
                  <div className="flex flex-col gap-1.5 w-20">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Qty</label>
                    <input type="number" min={1} disabled={isSaleSaved} value={selectedQty} onChange={e => setSelectedQty(Math.max(1, Number(e.target.value)))} className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-3 text-xs outline-none text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" />
                  </div>
                  <button type="button" disabled={isSaleSaved} onClick={handleAddItemToGrid} className="flex-1 bg-[#7B2D0A] text-white hover:bg-black rounded-xl py-3 px-4 flex items-center justify-center transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"><Plus size={16} /></button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm overflow-hidden">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b pb-3 mb-4">2. Products List</h2>
            {billItems.length === 0 ? (
              <p className="text-center py-10 text-xs italic text-slate-300">No items</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-400">
                      <th className="py-2">Description</th>
                      <th className="py-2 text-center">Size</th>
                      <th className="py-2 text-center">Qty</th>
                      <th className="py-2 text-right">Rate</th>
                      <th className="py-2 text-right">Total</th>
                      {!isSaleSaved && <th className="py-2 text-center">Action</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-medium text-slate-700">
                    {billItems.map((item, index) => (
                      <tr key={index}>
                        <td className="py-3 max-w-[200px] truncate">{item.name}</td>
                        <td className="py-3 text-center font-bold">{item.size}</td>
                        <td className="py-3 text-center">{item.quantity}</td>
                        <td className="py-3 text-right font-mono">₹{item.price}</td>
                        <td className="py-3 text-right font-mono font-bold text-slate-900">₹{item.price * item.quantity}</td>
                        {!isSaleSaved && (
                          <td className="py-3 text-center">
                            <button type="button" onClick={() => handleRemoveItem(index)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Side Sidebar Actions Block */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-32">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b pb-3">3. Customer Information</h2>
            <div className="space-y-4">
              <input type="text" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-[#7B2D0A]" placeholder="Customer Name *" required />
              <input type="text" maxLength={10} value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value.replace(/\D/g,"")})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-[#7B2D0A]" placeholder="Mobile Number (Optional)" />
              <input type="text" maxLength={15} value={customer.gst} onChange={e => setCustomer({...customer, gst: e.target.value.toUpperCase()})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-[#7B2D0A] uppercase" placeholder="Customer GSTIN (optional)" />

              {/* 🔥 FIXED: Added 'Sell through' luxury dropdown component configuration block */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sell Through *</label>
                <div className="relative">
                  <select 
                    disabled={isSaleSaved}
                    value={customer.sellThrough} 
                    onChange={e => setCustomer({...customer, sellThrough: e.target.value})} 
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-[#7B2D0A] appearance-none cursor-pointer text-slate-700"
                  >
                    <option value="In-store">In-store</option>
                    <option value="Myntra">Myntra</option>
                    <option value="Amazon">Amazon</option>
                    <option value="Flipkart">Flipkart</option>
                    <option value="Meesho">Meesho</option>
                    <option value="Other">Other (Custom platform)</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* 🔥 FIXED: Smooth layout expansion field triggers explicitly when 'Other' channel parameter is active */}
              <AnimatePresence>
                {customer.sellThrough === "Other" && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <input 
                      type="text" 
                      disabled={isSaleSaved}
                      value={customer.customSellThrough} 
                      onChange={e => setCustomer({...customer, customSellThrough: e.target.value})} 
                      className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-[#7B2D0A] mt-1" 
                      placeholder="Enter Platform Name (e.g. WhatsApp, Facebook) *" 
                      required 
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="bg-zinc-900 text-white rounded-[2rem] p-6 shadow-xl space-y-5 relative overflow-hidden">
            <Receipt className="absolute -right-4 -bottom-4 w-20 h-20 text-white/5 -rotate-12" />
            <div className="space-y-3 relative z-10 font-medium text-xs text-zinc-400">
              <div className="flex justify-between"><span>Subtotal</span><span className="text-white">₹{subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between items-center">
                <span>Manual Discount (₹)</span>
                <input type="number" min={0} value={discount} onChange={e => setDiscount(Math.max(0, Number(e.target.value)))} className="w-24 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-right text-white font-mono text-xs outline-none" />
              </div>
              
              <div className="flex justify-between">
                <span>Tax (IGST 18%)</span>
                <span className="text-[#D4AF37] font-bold">₹{tax.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <span>Payment Mode</span>
                <select value={paymentMode} onChange={e => setPaymentMode(e.target.value)} className="bg-white/10 border border-white/10 text-white font-bold rounded-lg px-2 py-1 outline-none text-xs">
                  <option value="Cash" className="text-slate-900">Cash</option>
                  <option value="UPI" className="text-slate-900">Online Payment</option>
                  <option value="Card" className="text-slate-900">Credit/Debit Card</option>
                </select>
              </div>
              <div className="h-px bg-white/10 my-2" />
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Grand Total</span>
                <span className="text-2xl font-serif text-[#D4AF37] font-bold">₹{totalAmount.toLocaleString()}</span>
              </div>
            </div>

            {/* ACTION SWITCHER MATRIX */}
            <div className="relative z-10 pt-2">
              <AnimatePresence mode="wait">
                {!isSaleSaved ? (
                  <button 
                    key="save-btn"
                    type="button" 
                    disabled={billingLoading || billItems.length === 0} 
                    onClick={handleRecordSaleToDB}
                    className="w-full py-4 bg-[#D4AF37] hover:bg-[#c4a030] text-zinc-900 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-30 cursor-pointer shadow-lg shadow-[#D4AF37]/10"
                  >
                    {billingLoading ? <Loader2 className="animate-spin" size={14} /> : <><Receipt size={14} /> Record Sale <ArrowRight size={14}/></>}
                  </button>
                ) : (
                  <div key="download-block" className="space-y-3">
                    <button 
                      type="button" 
                      onClick={handleDownloadInvoice}
                      className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/20"
                    >
                      <Download size={14} /> Download Invoice
                    </button>
                    
                    <button 
                      type="button" 
                      onClick={handleResetForm}
                      className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer"
                    >
                      New Billing
                    </button>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}