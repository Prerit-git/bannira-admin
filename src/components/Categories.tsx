"use client";

import { useState, useEffect } from "react";
import { Loader2, Plus, Trash2, Edit3, Folder, Layers, Check, X } from "lucide-react";

export default function Categories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const result = await res.json();
      if (result.success) setCategories(result.data);
    } catch (err) {
      console.error("Error loading categories", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: inputValue.trim() }),
      });
      if (res.ok) {
        setInputValue("");
        fetchCategories();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateCategory = async (id: string) => {
    if (!editValue.trim()) return;
    try {
      const res = await fetch("/api/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, name: editValue.trim() }),
      });
      if (res.ok) {
        setEditingId(null);
        fetchCategories();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
      <Loader2 className="animate-spin mb-4 text-[#B8945A]" size={32} />
      <p className="text-[10px] uppercase tracking-widest font-black">Syncing Warehouse Categories...</p>
    </div>
  );

  return (
    <div className="max-w-[1200px] mx-auto animate-in fade-in duration-700 pb-20 p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-slate-900">Category Management</h1>
        <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-1">
          {categories.length} Active Segments
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ADD CATEGORY FORM */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <h2 className="text-sm font-black uppercase tracking-widest text-slate-800 mb-4 flex items-center gap-2">
            <Layers size={14} className="text-[#B8945A]" /> Create Segment
          </h2>
          <form onSubmit={handleAddCategory} className="space-y-3">
            <input
              type="text"
              placeholder="e.g., Short Cotton Kurtis"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-xs outline-none focus:border-[#B8945A] focus:bg-white transition-all uppercase font-semibold"
            />
            <button type="submit" className="w-full py-3.5 bg-black text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-[#7B2D0A] transition-all flex items-center justify-center gap-2">
              <Plus size={14} /> Add Category
            </button>
          </form>
        </div>

        {/* CATEGORIES LIST TABLE */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Category Details</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Products in DB</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {categories.map((cat) => (
                <tr key={cat._id} className="hover:bg-slate-50/30 transition-all">
                  <td className="px-6 py-4">
                    {editingId === cat._id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="border border-[#B8945A] rounded-lg px-3 py-1.5 text-xs outline-none uppercase font-semibold bg-white"
                        />
                        <button onClick={() => handleUpdateCategory(cat._id)} className="p-1.5 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors"><Check size={14} /></button>
                        <button onClick={() => setEditingId(null)} className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"><X size={14} /></button>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-tight">{cat.name}</span>
                        <span className="text-[10px] text-slate-400 font-medium font-mono">{cat.slug}</span>
                      </div>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${cat.productCount > 0 ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-amber-50 text-amber-600 border-amber-100"}`}>
                      {cat.productCount} Live Items
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setEditingId(cat._id); setEditValue(cat.name); }}
                        className="p-2 text-slate-400 hover:text-black hover:bg-slate-100 rounded-full transition-colors"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat._id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}