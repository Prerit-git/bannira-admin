"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import {
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

export default function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  
  // Safely unwrap params using React.use()
  const resolvedParams = use(params);
  const productId = resolvedParams?.id;

  // UI States
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [showSEO, setShowSEO] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [dbCategories, setDbCategories] = useState<string[]>([]);

  const [product, setProduct] = useState({
    name: "",
    category: "",
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
    sizeVariants: {} as Record<string, number>,
    isFeatured: false,
    videoUrl: "",
    metaTitle: "",
    metaDescription: "",
  });

  const availableSizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL"];

  // 1. Load Initial Data from API
  useEffect(() => {
    const loadInitialData = async () => {
      if (!productId || productId === "undefined") return;

      try {
        setFetching(true);
        
        const catRes = await fetch("/api/categories");
        const cats = await catRes.json();
        setDbCategories(cats);

        const res = await fetch(`/api/products/${productId}`, { 
          cache: 'no-store',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (!res.ok) {
           const errorData = await res.json();
           throw new Error(errorData.error || "Failed to fetch product");
        }
        
        const data = await res.json();
        
        setProduct({
          ...data,
          price: data.price?.toString() || "",
          quantity: data.quantity?.toString() || "",
          originalPrice: data.originalPrice?.toString() || "",
          sizeVariants: data.sizeVariants || {},
        });
        setImages(data.images || []);
        
      } catch (err: any) {
        console.error("Fetch Error:", err.message);
        alert("Error: " + err.message);
      } finally {
        setFetching(false);
      }
    };

    loadInitialData();
  }, [productId]);

  const handleSizeToggle = (size: string) => {
  let updatedSizes = [...product.sizes];
  let updatedVariants = { ...product.sizeVariants };

  if (updatedSizes.includes(size)) {
    updatedSizes = updatedSizes.filter((s) => s !== size);
    delete updatedVariants[size];
  } else {
    updatedSizes.push(size);
    updatedVariants[size] = 0; // Default zero entry fallback initialization
  }

  const totalQty = Object.values(updatedVariants).reduce((sum, curr) => sum + Number(curr || 0), 0);

  setProduct({
    ...product,
    sizes: updatedSizes,
    sizeVariants: updatedVariants,
    quantity: String(totalQty),
  });
};

const handleSizeQtyChange = (size: string, qtyStr: string) => {
  const qtyNum = qtyStr === "" ? 0 : Math.max(0, parseInt(qtyStr) || 0);
  const updatedVariants = { ...product.sizeVariants, [size]: qtyNum };
  
  const totalQty = Object.values(updatedVariants).reduce((sum, curr) => sum + Number(curr || 0), 0);

  setProduct({
    ...product,
    sizeVariants: updatedVariants,
    quantity: String(totalQty),
  });
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) return alert("Please upload at least one photo.");
    
    setLoading(true);

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            ...product, 
            images,
            // Convert strings back to numbers for DB
            price: Number(product.price),
            quantity: Number(product.quantity),
            originalPrice: product.originalPrice ? Number(product.originalPrice) : undefined
        }),
      });

      if (res.ok) {
        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          router.push("/products");
          router.refresh(); // Force refresh the list page
        }, 2000);
      } else {
          const err = await res.json();
          alert("Update error: " + err.error);
      }
    } catch (err) {
      alert("Something went wrong during update.");
    } finally {
      setLoading(false);
    }
  };

  // Loading State UI
  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
        <Loader2 className="animate-spin mb-4 text-[#D4AF37]" size={32} />
        <p className="text-[10px] uppercase tracking-[0.2em] font-black">Decrypting Piece Details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto pb-24 font-sans text-slate-900 animate-in fade-in duration-700">
      {/* Header */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-2 md:gap-0">
        <div className="flex items-center gap-5">
          <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-100 text-slate-400 hover:text-slate-900 transition-all shadow-sm">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-bold tracking-tight">Modify Product</h1>
            <p className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-bold tracking-[0.2em]">Editing: {product.name}</p>
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="bg-zinc-800 text-white px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-black transition-all disabled:opacity-50 flex items-center gap-3 active:scale-95 shadow-lg cursor-pointer"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle2 size={16} />}
          {loading ? "Please wait..." : "Update Product"}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-8">
          {/* General Information */}
          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-[#D4AF37]">
              <Sparkles size={14} />
              <p className="text-[10px] font-black uppercase tracking-[0.2em]">Product Core</p>
            </div>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-2 ml-1">Title *</label>
                <input type="text" value={product.name} required className="w-full p-4 bg-slate-50 rounded-2xl outline-none focus:ring-1 focus:ring-[#D4AF37] transition-all" onChange={e => setProduct({...product, name: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="relative">
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-2 ml-1">Category *</label>
                  <select 
                    value={product.category} required 
                    className="w-full p-4 bg-slate-50 rounded-2xl outline-none appearance-none cursor-pointer focus:ring-1 focus:ring-[#D4AF37]"
                    onChange={e => setProduct({...product, category: e.target.value})}
                  >
                    <option value="">Select Category</option>
                    {dbCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-[42px] text-slate-400 pointer-events-none" size={16} />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-2 ml-1">Badge</label>
                  <input type="text" value={product.badge} className="w-full p-4 bg-slate-50 rounded-2xl outline-none" onChange={e => setProduct({...product, badge: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-2 ml-1">Story & Details *</label>
                <textarea value={product.description} required className="w-full p-4 bg-slate-50 rounded-2xl h-32 outline-none resize-none leading-relaxed" onChange={e => setProduct({...product, description: e.target.value})} />
              </div>
            </div>
          </section>

          {/* Media Section */}
          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-[#D4AF37]">
              <Video size={14} />
              <p className="text-[10px] font-black uppercase tracking-[0.2em]">Gallery Update</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {images.map((url, i) => (
                <div key={i} className="relative aspect-[3/4] rounded-2xl overflow-hidden group border border-slate-100 shadow-sm">
                  <img src={url} className="w-full h-full object-cover" alt="product" />
                  <button type="button" onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <X size={20} />
                  </button>
                </div>
              ))}
              <CldUploadWidget uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET} onSuccess={(res: any) => setImages(prev => [...prev, res.info.secure_url])}>
                {({ open }) => (
                  <button type="button" onClick={() => open()} className="aspect-[3/4] border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-300 hover:text-[#D4AF37] hover:bg-slate-50 transition-all">
                    <UploadCloud size={24} className="mb-2" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-center px-2">Add Photo</span>
                  </button>
                )}
              </CldUploadWidget>
            </div>
            <input type="text" value={product.videoUrl} placeholder="Social Reel Link (Optional)" className="w-full p-4 bg-slate-50 rounded-2xl outline-none" onChange={e => setProduct({...product, videoUrl: e.target.value})} />
          </section>

          {/* Optional SEO Meta */}
          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-sm overflow-hidden">
            <button type="button" onClick={() => setShowSEO(!showSEO)} className="flex items-center justify-between w-full group">
              <div className="flex items-center gap-2 text-slate-400 group-hover:text-[#D4AF37] transition-colors">
                <Globe size={14} />
                <p className="text-[10px] font-black uppercase tracking-[0.2em]">SEO Config (Optional)</p>
              </div>
              <ChevronRight className={`text-slate-300 transition-transform ${showSEO ? "rotate-90" : ""}`} size={16} />
            </button>
            {showSEO && (
              <div className="mt-8 space-y-4 animate-in slide-in-from-top-4 duration-300">
                <input type="text" value={product.metaTitle} placeholder="Meta Title" className="w-full p-4 bg-slate-50 rounded-2xl outline-none text-sm" onChange={e => setProduct({...product, metaTitle: e.target.value})} />
                <textarea value={product.metaDescription} className="w-full p-4 bg-slate-50 rounded-2xl h-20 outline-none resize-none text-sm" placeholder="Meta Description" onChange={e => setProduct({...product, metaDescription: e.target.value})} />
              </div>
            )}
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 space-y-8">
          {/* Display Settings */}
          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-6">Inventory Status</p>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl cursor-pointer shadow-inner" onClick={() => setProduct({...product, isFeatured: !product.isFeatured})}>
              <p className="text-[11px] font-black uppercase text-slate-700">Set as Featured</p>
              <div className={`w-12 h-6 rounded-full transition-all relative ${product.isFeatured ? "bg-zinc-900" : "bg-slate-200"}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${product.isFeatured ? "left-7" : "left-1"}`} />
              </div>
            </div>
          </section>

          {/* Pricing & Stock */}
          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-6">Price & Logistics</p>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Price</label>
                  <input type="number" value={product.price} className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold" onChange={e => setProduct({...product, price: e.target.value})} />
                </div>
                <div>
                   <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Stock</label>
                   <input type="number" value={product.quantity} className="w-full p-4 bg-slate-50 rounded-2xl outline-none font-bold" readOnly/>
                </div>
              </div>
              <label className="text-[9px] font-bold text-slate-400 block mb-1 uppercase">Original MRP</label>
              <input type="number" value={product.originalPrice} className="w-full p-4 bg-slate-50 rounded-2xl outline-none text-slate-400" onChange={e => setProduct({...product, originalPrice: e.target.value})} />
            </div>
          </section>

          {/* Product Specifications */}
          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-50 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-6">Specifications</p>
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {availableSizes.map(size => (
                  <button key={size} type="button" onClick={() => handleSizeToggle(size)} className={`w-11 h-11 rounded-full text-[10px] font-black border transition-all ${product.sizes.includes(size) ? "bg-zinc-900 text-white shadow-md border-zinc-900" : "bg-white text-slate-400 border-slate-100 hover:border-slate-300"}`}>
                    {size}
                  </button>
                ))}
{product.sizes.length > 0 && (
  <div className="mt-3 pt-3 border-t border-stone-100 grid grid-cols-2 sm:grid-cols-3 gap-2">
    {product.sizes.map((size) => {
      const currentQty = product.sizeVariants[size] !== undefined ? product.sizeVariants[size] : "";
      return (
        <div key={size} className="bg-stone-50/40 p-2.5 rounded-xl border border-stone-100 flex items-center justify-between text-xs">
          <span className="font-bold text-stone-700 uppercase pr-1">{size}</span>
          <div className="flex items-center gap-1">
            {/* <span className="text-[9px] text-stone-400 font-bold uppercase">Qty:</span> */}
            <input
              type="number"
              min="0"
              value={currentQty}
              placeholder="0"
              onChange={(e) => handleSizeQtyChange(size, e.target.value)}
              className="w-14 p-1 bg-white text-center rounded-md outline-none text-xs font-bold border border-stone-200"
            />
          </div>
        </div>
      );
    })}
  </div>
)}
              </div>
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Color</span>
                <div className="flex items-center gap-3">
                   <input type="color" value={product.colorCode} className="w-8 h-8 cursor-pointer bg-transparent border-none" onChange={e => setProduct({...product, colorCode: e.target.value})} />
                   <span className="text-[10px] font-bold uppercase text-slate-400">{product.colorCode}</span>
                </div>
              </div>
              <input type="text" value={product.fabric} placeholder="Fabric" className="w-full p-4 bg-slate-50 rounded-xl outline-none text-sm" onChange={e => setProduct({...product, fabric: e.target.value})} />
              <input type="text" value={product.work} placeholder="Workmanship" className="w-full p-4 bg-slate-50 rounded-xl outline-none text-sm" onChange={e => setProduct({...product, work: e.target.value})} />
              <input type="text" value={product.occasion} placeholder="Occasion" className="w-full p-4 bg-slate-50 rounded-xl outline-none text-sm" onChange={e => setProduct({...product, occasion: e.target.value})} />
            </div>
          </section>
        </div>
      </div>

      {/* Pop-up Success Overlay */}
      {showPopup && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] animate-in zoom-in-95 duration-300">
          <div className="bg-zinc-900 text-white px-10 py-5 rounded-[2.5rem] shadow-2xl flex items-center gap-4 border border-[#D4AF37]/30">
            <CheckCircle2 size={18} className="text-[#D4AF37]" />
            <div>
              <p className="text-[10px] font-black uppercase text-[#D4AF37] tracking-widest">Update Success</p>
              <p className="text-[10px] text-slate-300">Your changes are now live.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}