"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Receipt, Loader2, ArrowRight, Info } from "lucide-react";
import { generateInvoiceHTML } from "@/lib/invoiceTemplate";
import { motion, AnimatePresence } from "framer-motion";

export default function OfflineBillingPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [billingLoading, setBillingLoading] = useState(false);
  
  const [customer, setCustomer] = useState({ name: "Walk-in Customer", phone: "", gst: "" });
  const [billItems, setBillItems] = useState<any[]>([]);
  const [paymentMode, setPaymentMode] = useState("Cash");
  const [discount, setDiscount] = useState(0);

  const [productSearchTerm, setProductSearchTerm] = useState("");
  const [selectedProdId, setSelectedProdId] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedQty, setSelectedQty] = useState(1);
  const [toast, setToast] = useState({ message: "", visible: false });

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => { setProducts(Array.isArray(data) ? data : data.products || []); setCatalogLoading(false); })
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
    if (!selectedProdId || !selectedSize || selectedQty <= 0 || !currentSelectedProduct) return;

    const availableStockInDB = Number(sizeVariantsObj[selectedSize]) || 0;
    const existingItem = billItems.find(item => item.productId === selectedProdId && item.size === selectedSize);
    const existingQtyInGrid = existingItem ? existingItem.quantity : 0;
    const totalRequestedQty = existingQtyInGrid + Number(selectedQty);

    if (totalRequestedQty > availableStockInDB) {
      showToast(`Sorry! Size ${selectedSize} only has ${availableStockInDB} units available in DB.`);
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
    setBillItems(billItems.filter((_, i) => i !== index));
  };

  const subtotal = billItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  const calculateTaxForBill = (isGstMode: boolean) => {
    return isGstMode ? Math.round(subtotal * 0.18) : 0;
  };

  const triggerPDFDownload = async (orderData: any, invoiceType: "GST" | "NON-GST") => {
    const html2pdf = (await import("html2pdf.js")).default;
    const element = document.createElement("div");
    element.innerHTML = generateInvoiceHTML(orderData, invoiceType);

    const options: any = {
      margin: 10,
      filename: `Bannira_Offline_${invoiceType}_Invoice_${orderData._id.slice(-6).toUpperCase()}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    };

    html2pdf().from(element).set(options).save();
  };

  const handleProcessOrderSubmit = async (invoiceFormat: "GST" | "NON-GST") => {
    if (billItems.length === 0) return alert("Please select at least 1 design item silhouette.");
    
    if (invoiceFormat === "GST" && !customer.gst) {
      alert("Please enter Client Corporate GSTIN ID first to generate a GST Tax Invoice.");
      return;
    }

    setBillingLoading(true);
    const computedTax = calculateTaxForBill(invoiceFormat === "GST");
    const computedTotal = subtotal + computedTax - Number(discount);

    try {
      const res = await fetch("/api/admin/offline-sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: customer.name,
          customerPhone: customer.phone,
          customerGst: invoiceFormat === "GST" ? customer.gst : "",
          items: billItems,
          subtotal,
          discount,
          tax: computedTax,
          totalAmount: computedTotal,
          paymentMode
        })
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to save offline counter order.");

      // Success PDF triggers instantly
      await triggerPDFDownload(result.order, invoiceFormat);
      
      // Clear data states cleanly
      setBillItems([]);
      setCustomer({ name: "Walk-in Customer", phone: "", gst: "" });
      setDiscount(0);
      setSelectedProdId("");
      setProductSearchTerm("");
      alert("Offline counter order synchronized successfully across DB arrays!");
    } catch (err: any) {
      alert(err.message || "Something went wrong.");
    } finally {
      setBillingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] p-4 md:p-12 pt-28 font-poppins text-slate-800">
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
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b pb-3">1. Add Counter Catalog Item</h2>
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Search Product Name</label>
                <input type="text" value={productSearchTerm} onChange={e => setProductSearchTerm(e.target.value)} placeholder="Type name to filter options below..." className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-[#7B2D0A]" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Select Product</label>
                  <select value={selectedProdId} onChange={e => { setSelectedProdId(e.target.value); setSelectedSize(""); }} className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-3 text-xs outline-none focus:ring-1 focus:ring-[#7B2D0A] w-full">
                    <option value="">Choose item...</option>
                    {filteredProductsOption.map(p => <option key={p._id || p.id} value={p._id || p.id}>{p.name} (₹{p.price})</option>)}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Select Size (Stock)</label>
                  <select value={selectedSize} disabled={!selectedProdId} onChange={e => setSelectedSize(e.target.value)} className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-3 text-xs outline-none focus:ring-1 focus:ring-[#7B2D0A] disabled:opacity-50 w-full">
                    <option value="">Size...</option>
                    {sizeOptions.map(s => <option key={s} value={s}>{s} ({sizeVariantsObj[s]} left)</option>)}
                  </select>
                </div>

                <div className="flex gap-2">
                  <div className="flex flex-col gap-1.5 w-20">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Qty</label>
                    <input type="number" min={1} value={selectedQty} onChange={e => setSelectedQty(Math.max(1, Number(e.target.value)))} className="bg-slate-50 border border-slate-100 rounded-xl px-3 py-3 text-xs outline-none text-center w-full" />
                  </div>
                  <button type="button" onClick={handleAddItemToGrid} className="flex-1 bg-[#7B2D0A] text-white hover:bg-black rounded-xl py-3 px-4 flex items-center justify-center transition-all cursor-pointer"><Plus size={16} /></button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm overflow-hidden">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b pb-3 mb-4">2. Current Counter Invoice Items Grid</h2>
            {billItems.length === 0 ? (
              <p className="text-center py-10 text-xs italic text-slate-300">Invoice row stack is completely empty.</p>
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
                      <th className="py-2 text-center">Action</th>
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
                        <td className="py-3 text-center">
                          <button type="button" onClick={() => handleRemoveItem(index)} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                        </td>
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
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 border-b pb-3">3. Walk-In Profile Parameters</h2>
            <div className="space-y-4">
              <input type="text" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-[#7B2D0A]" placeholder="Customer Name *" required />
              <input type="text" maxLength={10} value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value.replace(/\D/g,"")})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-[#7B2D0A]" placeholder="Mobile Number (Optional)" />
              <input type="text" maxLength={15} value={customer.gst} onChange={e => setCustomer({...customer, gst: e.target.value.toUpperCase()})} className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-[#7B2D0A] uppercase" placeholder="Client Corporate GSTIN (Optional)" />
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
              <div className="flex justify-between items-center pt-2">
                <span>Payment Mode</span>
                <select value={paymentMode} onChange={e => setPaymentMode(e.target.value)} className="bg-white/10 border border-white/10 text-white font-bold rounded-lg px-2 py-1 outline-none text-xs">
                  <option value="Cash" className="text-slate-900">Cash</option>
                  <option value="UPI" className="text-slate-900">Online Payment</option>
                  <option value="Card" className="text-slate-900">Credit/Debit Card</option>
                </select>
              </div>
            </div>

            {/* 🔥 DUAL OUTPUT TRIGGER CTA BUTTON SELECTIONS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 relative z-10">
              <button 
                type="button" 
                disabled={billingLoading || billItems.length === 0} 
                onClick={() => handleProcessOrderSubmit("GST")}
                className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#c4a030] text-zinc-900 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all disabled:opacity-30 cursor-pointer"
              >
                {billingLoading ? <Loader2 className="animate-spin" size={12} /> : <><Receipt size={12} /> Print GST invoice</>}
              </button>
              
              <button 
                type="button" 
                disabled={billingLoading || billItems.length === 0} 
                onClick={() => handleProcessOrderSubmit("NON-GST")}
                className="w-full py-3.5 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5 transition-all disabled:opacity-30 cursor-pointer"
              >
                {billingLoading ? <Loader2 className="animate-spin" size={12} /> : <><Receipt size={12} /> Print Cash Memo(Non-Gst)</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}