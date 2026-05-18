"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Edit3, Trash2, Plus, Search, Loader2, Package, 
  ChevronLeft, ChevronRight, X, AlertTriangle 
} from "lucide-react";

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const itemsPerPage = 8; 

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/products/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        setProducts((prev) => prev.filter((p: any) => p._id !== deleteId));
        setDeleteId(null);
      }
    } catch (err) {
      alert("Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  const uniqueCategories = Array.from(new Set(products.map((p: any) => p.category)));

  const filteredProducts = products.filter((p: any) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
    let matchesStatus = true;
    if (statusFilter === "in-stock") matchesStatus = p.quantity > 0;
    if (statusFilter === "out-of-stock") matchesStatus = p.quantity <= 0;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentItems = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setCurrentPage(1);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
      <Loader2 className="animate-spin mb-4" size={32} />
      <p className="text-[10px] uppercase tracking-[0.2em] font-black">Syncing Inventory...</p>
    </div>
  );

  return (
    <div className="max-w-[350px] md:max-w-[1200px] mx-auto animate-in fade-in duration-700 pb-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold tracking-tight text-slate-900">Inventory</h1>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">
            {filteredProducts.length} Pieces Found
          </p>
        </div>
        <Link
          href="/products/add"
          className="bg-zinc-800 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] hover:bg-black transition-all flex items-center gap-2 self-start"
        >
          <Plus size={14} /> Add new Product
        </Link>
      </header>

      <div className="flex flex-wrap items-center gap-4 mb-6 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
          <input
            type="text"
            value={searchTerm}
            placeholder="Search by name..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 rounded-lg text-xs outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all"
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase text-slate-400">Category:</span>
          <select
            value={categoryFilter}
            className="bg-slate-50 border-none rounded-lg px-3 py-2 text-xs font-bold text-slate-600 outline-none cursor-pointer focus:ring-1 focus:ring-[#D4AF37]"
            onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="all">All Styles</option>
            {uniqueCategories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase text-slate-400">Stock:</span>
          <select
            value={statusFilter}
            className="bg-slate-50 border-none rounded-lg px-3 py-2 text-xs font-bold text-slate-600 outline-none cursor-pointer focus:ring-1 focus:ring-[#D4AF37]"
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="all">All</option>
            <option value="in-stock">In Stock</option>
            <option value="out-of-stock">Sold Out</option>
          </select>
        </div>

        {(searchTerm || categoryFilter !== "all" || statusFilter !== "all") && (
          <button onClick={resetFilters} className="flex items-center gap-1 text-[10px] font-black uppercase text-red-400 hover:text-red-600 transition-colors ml-2">
            <X size={12} /> Clear
          </button>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Product</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Category</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Price</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Stock Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentItems.map((item: any) => (
                <tr key={item._id} className="hover:bg-slate-50/30 transition-all group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-14 rounded-lg overflow-hidden border border-slate-100 bg-slate-50 relative shrink-0">
                        <img src={item.image} className="w-full h-full object-cover" alt="" />
                        {item.isFeatured && (
                          <div className="absolute top-0.5 right-0.5 bg-[#D4AF37] p-0.5 rounded-full">
                            <Sparkles size={6} className="text-white" fill="white" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-xs truncate max-w-[200px]">{item.name}</span>
                        <span className="text-[9px] font-bold text-[#D4AF37] uppercase tracking-tighter">{item.badge || "New"}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[9px] font-bold uppercase text-slate-500 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">{item.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-slate-900 text-xs">₹{item.price.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${item.quantity > 5 ? "bg-green-500" : item.quantity > 0 ? "bg-orange-400" : "bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]"}`} />
                      <span className={`text-[10px] font-bold ${item.quantity > 0 ? "text-slate-600" : "text-red-500"}`}>
                        {item.quantity > 0 ? `${item.quantity} Left` : "Out of Stock"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/products/edit/${item._id}`} className="p-1.5 text-slate-400 hover:text-zinc-900 hover:bg-slate-100 rounded-lg transition-all">
                        <Edit3 size={14} />
                      </Link>
                      <button onClick={() => setDeleteId(item._id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-slate-300">
            <Package size={32} strokeWidth={1} className="mb-3" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No matching pieces</p>
            <button onClick={resetFilters} className="mt-4 text-[9px] font-bold uppercase text-[#D4AF37] underline underline-offset-4">Reset all filters</button>
          </div>
        )}

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Page {currentPage} of {totalPages}</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="p-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-30"><ChevronLeft size={16} /></button>
              <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="p-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-30"><ChevronRight size={16} /></button>
            </div>
          </div>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-zinc-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] max-w-md w-full p-8 shadow-2xl animate-in zoom-in-95 duration-300 border border-slate-100">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-6">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">Delete Piece?</h3>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">This action will permanently remove this item from the Bannira catalog. This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} disabled={deleting} className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all border border-slate-100">Cancel</button>
              <button onClick={handleDelete} disabled={deleting} className="flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-red-500 text-white hover:bg-red-600 transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2">
                {deleting ? <Loader2 size={14} className="animate-spin" /> : "Delete"}
              </button>
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