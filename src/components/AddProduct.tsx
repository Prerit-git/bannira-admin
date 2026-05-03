"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import {
  Plus,
  X,
  UploadCloud,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  ChevronDown,
  Globe,
  Sparkles,
  Video,
  ChevronRight,
} from "lucide-react";

export default function AddProduct() {
  const router = useRouter();
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showSEO, setShowSEO] = useState(false);
  const [isNewCategory, setIsNewCategory] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [dbCategories, setDbCategories] = useState<string[]>([]);

  const initialState = {
    name: "",
    category: "",
    customCategory: "",
    price: "",
    originalPrice: "",
    description: "",
    fabric: "",
    occasion: "",
    work: "",
    badge: "",
    color: "",
    colorCode: "#D4AF37",
    quantity: "",
    sizes: [] as string[],
    isFeatured: false,
    videoUrl: "",
    metaTitle: "",
    metaDescription: "",
  };

  const [product, setProduct] = useState(initialState);

  // Configuration
  const initialCategories = ["Cotton Kurti", "Co-ord Set", "Maxi Dress", "Anarkali"];
  const availableSizes = ["S", "M", "L", "XL", "XXL"];

  // Fetch unique categories from database on load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (data.length > 0) {
          setDbCategories(data);
        } else {
          setDbCategories(initialCategories);
        }
      } catch (err) {
        console.error("Failed to load categories from database");
        setDbCategories(initialCategories);
      }
    };
    fetchCategories();
  }, []);

  const handleSizeToggle = (size: string) => {
    setProduct((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Logic to pick either dropdown category or custom one
    const finalCategory = isNewCategory ? product.customCategory : product.category;

    // Validation
    if (images.length === 0) return alert("Please upload at least one photo.");
    if (product.sizes.length === 0) return alert("Please select at least one size.");
    if (!finalCategory) return alert("Please select or enter a category.");

    setLoading(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...product, category: finalCategory, images }),
      });

      if (res.ok) {
        setShowPopup(true);
        // Reset form to initial state
        setProduct(initialState);
        setImages([]);
        setIsNewCategory(false);
        // Refresh categories list to include the new one if created
        if (isNewCategory && !dbCategories.includes(finalCategory)) {
            setDbCategories(prev => [...prev, finalCategory]);
        }
        setTimeout(() => setShowPopup(false), 4000);
      }
    } catch (err) {
      alert("Error while saving. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1100px] mx-auto pb-24 font-sans text-slate-900 animate-in fade-in duration-700">
      {/* Header Section */}
      <header className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-5">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-100 text-slate-400 hover:text-slate-900 transition-all shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-bold tracking-tight">Add new Product</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold tracking-[0.2em]">
              Bannira Catalog
            </p>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-zinc-800 text-white px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-black hover:shadow-2xl transition-all disabled:opacity-50 flex items-center gap-3 active:scale-95 cursor-pointer"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
          {loading ? "Publishing..." : "Publish"}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: Main Product Details */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* General Information Section */}
          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-[#D4AF37]">
              <Sparkles size={14} />
              <p className="text-[10px] font-black uppercase tracking-[0.2em]">General Details</p>
            </div>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-2 ml-1">Product Title *</label>
                <input
                  type="text"
                  value={product.name}
                  required
                  placeholder="e.g. Royal Gold Silk Kurti"
                  className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all"
                  onChange={(e) => setProduct({ ...product, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Category Selection Logic */}
                <div className="relative">
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-2 ml-1">Category *</label>
                  <select
                    value={isNewCategory ? "new" : product.category}
                    required
                    className="w-full p-4 bg-slate-50 rounded-2xl outline-none appearance-none cursor-pointer focus:ring-1 focus:ring-[#D4AF37]"
                    onChange={(e) => {
                      if (e.target.value === "new") {
                        setIsNewCategory(true);
                        setProduct({ ...product, category: "" });
                      } else {
                        setIsNewCategory(false);
                        setProduct({ ...product, category: e.target.value });
                      }
                    }}
                  >
                    <option value="">Select Category</option>
                    {dbCategories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="new" className="text-[#D4AF37] font-bold">+ Create New Category</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-[42px] text-slate-400 pointer-events-none" size={16} />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-2 ml-1">Badge (Tag)</label>
                  <input
                    type="text"
                    value={product.badge}
                    placeholder="e.g. Bestseller"
                    className="w-full p-4 bg-slate-50 rounded-2xl outline-none"
                    onChange={(e) => setProduct({ ...product, badge: e.target.value })}
                  />
                </div>
              </div>

              {/* Input for creating a new category manually */}
              {isNewCategory && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                  <label className="text-[10px] font-bold uppercase text-[#D4AF37] block mb-2 ml-1">New Category Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter custom category"
                    className="w-full p-4 bg-white border border-[#D4AF37]/30 rounded-2xl outline-none shadow-sm"
                    onChange={(e) => setProduct({ ...product, customCategory: e.target.value })}
                  />
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-2 ml-1">Description *</label>
                <textarea
                  value={product.description}
                  required
                  className="w-full p-4 bg-slate-50 rounded-2xl h-32 outline-none resize-none leading-relaxed"
                  placeholder="Tell the story of the fabric and fit..."
                  onChange={(e) => setProduct({ ...product, description: e.target.value })}
                />
              </div>
            </div>
          </section>

          {/* Media Section: Photos and Video */}
          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-[#D4AF37]">
              <Video size={14} />
              <p className="text-[10px] font-black uppercase tracking-[0.2em]">Product Media</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {images.map((url, i) => (
                <div key={url} className="relative aspect-[3/4] rounded-2xl overflow-hidden group border border-slate-100">
                  <img src={url} className="w-full h-full object-cover" alt="product" />
                  <button
                    type="button"
                    onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
              <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                onSuccess={(res: any) => {
                  if (res.info && typeof res.info !== "string") {
                    const newUrl = res.info.secure_url;
                    setImages((prev) => [...prev, newUrl]); // functional update to prevent overwriting
                  }
                }}
              >
                {({ open }) => (
                  <button
                    type="button"
                    onClick={() => open()}
                    className="aspect-[3/4] border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-300 hover:text-[#D4AF37] hover:bg-slate-50 transition-all group"
                  >
                    <UploadCloud size={24} className="mb-2" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Add Photo</span>
                  </button>
                )}
              </CldUploadWidget>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-2 ml-1">Video URL (Optional)</label>
              <input
                type="text"
                value={product.videoUrl}
                placeholder="Link to Cloudinary or Social media Reel"
                className="w-full p-4 bg-slate-50 rounded-2xl outline-none"
                onChange={(e) => setProduct({ ...product, videoUrl: e.target.value })}
              />
            </div>
          </section>

          {/* Optional SEO Section: Collapsible */}
          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-sm overflow-hidden">
            <button
              type="button"
              onClick={() => setShowSEO(!showSEO)}
              className="flex items-center justify-between w-full group"
            >
              <div className="flex items-center gap-2 text-slate-400 group-hover:text-[#D4AF37] transition-colors">
                <Globe size={14} />
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">SEO Settings (Optional)</p>
              </div>
              <ChevronRight className={`text-slate-300 transition-transform ${showSEO ? "rotate-90" : ""}`} size={16} />
            </button>

            {showSEO && (
              <div className="mt-8 space-y-4 animate-in slide-in-from-top-4 duration-500">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-2 ml-1">SEO Meta Title</label>
                  <input
                    type="text"
                    value={product.metaTitle}
                    placeholder="Search result heading..."
                    className="w-full p-4 bg-slate-50 rounded-2xl outline-none text-sm"
                    onChange={(e) => setProduct({ ...product, metaTitle: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-2 ml-1">SEO Meta Description</label>
                  <textarea
                    value={product.metaDescription}
                    className="w-full p-4 bg-slate-50 rounded-2xl h-20 outline-none resize-none text-sm"
                    placeholder="Short summary for Google..."
                    onChange={(e) => setProduct({ ...product, metaDescription: e.target.value })}
                  />
                </div>
              </div>
            )}
          </section>
        </div>

        {/* RIGHT COLUMN: Sidebar Configuration */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Promotion / Homepage Toggle */}
          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-6">Store Display</p>
            <div
              className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50 cursor-pointer"
              onClick={() => setProduct({ ...product, isFeatured: !product.isFeatured })}
            >
              <div>
                <p className="text-[11px] font-black uppercase tracking-tight text-slate-700">Featured</p>
                <p className="text-[9px] text-slate-400 font-medium italic">Show on Home Page</p>
              </div>
              <div className={`w-12 h-6 rounded-full transition-all relative ${product.isFeatured ? "bg-zinc-900" : "bg-slate-200"}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${product.isFeatured ? "left-7" : "left-1"}`} />
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-6">Pricing & Inventory *</p>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-2">Sale Price (₹)</label>
                  <input
                    type="number"
                    value={product.price}
                    required
                    className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-zinc-900"
                    onChange={(e) => setProduct({ ...product, price: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-2">Stock Level</label>
                  <input
                    type="number"
                    value={product.quantity}
                    required
                    className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold text-zinc-900"
                    onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-2">Market Price (MRP)</label>
                <input
                  type="number"
                  value={product.originalPrice}
                  placeholder="Optional"
                  className="w-full p-4 bg-slate-50 rounded-2xl outline-none text-slate-400"
                  onChange={(e) => setProduct({ ...product, originalPrice: e.target.value })}
                />
              </div>
            </div>
          </section>

          {/* Product Specifications Section */}
          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-6">Specifications *</p>
            <div className="space-y-6">
              {/* Size Multi-Selector */}
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-3">Sizes *</label>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSizeToggle(size)}
                      className={`w-11 h-11 rounded-full text-[10px] font-black transition-all border ${product.sizes.includes(size) ? "bg-zinc-900 border-zinc-900 text-white shadow-lg" : "bg-white border-slate-100 text-slate-400 hover:border-slate-300"}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-2">Color *</label>
                  <input
                    type="text"
                    value={product.color}
                    required
                    placeholder="e.g. Maroon"
                    className="w-full p-4 bg-slate-50 rounded-2xl outline-none text-sm"
                    onChange={(e) => setProduct({ ...product, color: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-2">Color Hue *</label>
                  <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl">
                    <input
                      type="color"
                      value={product.colorCode}
                      className="w-8 h-8 border-none bg-transparent cursor-pointer rounded-lg shadow-sm"
                      onChange={(e) => setProduct({ ...product, colorCode: e.target.value })}
                    />
                    <span className="text-[9px] font-bold uppercase text-slate-400">{product.colorCode}</span>
                  </div>
                </div>
              </div>

              {/* Material and Details */}
              <div className="space-y-4">
                <input
                  type="text"
                  value={product.fabric}
                  required
                  placeholder="Fabric (e.g. Pure Silk)"
                  className="w-full p-4 bg-slate-50 rounded-xl outline-none text-sm"
                  onChange={(e) => setProduct({ ...product, fabric: e.target.value })}
                />
                <input
                  type="text"
                  value={product.work}
                  required
                  placeholder="Work (e.g. Hand Embroidery)"
                  className="w-full p-4 bg-slate-50 rounded-xl outline-none text-sm"
                  onChange={(e) => setProduct({ ...product, work: e.target.value })}
                />
                <input
                  type="text"
                  value={product.occasion}
                  required
                  placeholder="Occasion (e.g. Wedding)"
                  className="w-full p-4 bg-slate-50 rounded-xl outline-none text-sm"
                  onChange={(e) => setProduct({ ...product, occasion: e.target.value })}
                />
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Toast Notification for Success */}
      {showPopup && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 duration-500">
          <div className="bg-zinc-900 text-white px-10 py-5 rounded-[2.5rem] shadow-2xl flex items-center gap-4 border border-[#D4AF37]/30">
            <div className="w-8 h-8 bg-[#D4AF37] rounded-full flex items-center justify-center text-zinc-900">
              <CheckCircle2 size={18} strokeWidth={3} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37]">Success !</p>
              <p className="text-xs font-medium text-slate-300">Piece successfully added to the catalog.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}