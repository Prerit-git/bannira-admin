"use client";
import React, { useState, useEffect } from "react";
import { Plus, Trash, Save, X, Sparkles, Tag, LayoutDashboard, Images, Check, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Banner {
  imageUrl: string;
  mobileImageUrl: string;
  title: string;
  subtitle: string;
  ctaLink: string;
}

interface Coupon {
  _id?: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue?: number;
  startDate: string;
  endDate: string;
}

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
}

export default function AdminUISettings() {
  const [activeTab, setActiveTab] = useState<string>("general");
  
  // States
  const [topStrip, setTopStrip] = useState<string[]>([]);
  const [newStripText, setNewStripText] = useState<string>("");
  const [discountCode, setDiscountCode] = useState<string>("");
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [shipping, setShipping] = useState<number>(150);
  const [shippingFreeLimit, setShippingFreeLimit] = useState<number>(2999);
  const [gst, setGst] = useState<number>(18);
  
  const [heroBanners, setHeroBanners] = useState<Banner[]>([
    { imageUrl: "",mobileImageUrl: "", title: "", subtitle: "", ctaLink: "" },
  ]);
  
  const [featuredProductIds, setFeaturedProductIds] = useState<string[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [newCoupon, setNewCoupon] = useState<Coupon>({
    code: "",
    discountType: "percentage",
    discountValue: 0,
    minOrderValue: 0,
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    fetchSettings();
    fetchProducts();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const result = await res.json();
      if (result.success && result.data) {
        const data = result.data;
        setTopStrip(data.topStripText || []);
        setDiscountCode(data.discountCode || "");
        setDiscountValue(data.discountValue || 0);
        setShipping(data.shippingCost || 150);
        setShippingFreeLimit(data.shippingFreeLimit || 2999);
        setGst(data.gstPercentage || 18);
        setHeroBanners(data.heroBanners || []);
        setFeaturedProductIds(data.featuredProductIds || []);
        setCoupons(data.coupons || []);
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        setAllProducts(result.data);
      } else if (Array.isArray(result)) {
        setAllProducts(result);
      }
    } catch (error) {
      console.error("Failed to load products from database", error);
      setAllProducts([
        {
          _id: "1",
          name: "Royal Silk Kurti",
          price: 1150,
          image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300",
        },
        {
          _id: "2",
          name: "Emerald Velvet Gown",
          price: 2999,
          image: "https://images.unsplash.com/photo-1595777457583-95e05b263313?w=300",
        },
        {
          _id: "3",
          name: "Golden Tissue Saree",
          price: 3499,
          image: "https://images.unsplash.com/photo-1610030469980-44ea258d4349?w=300",
        },
      ]);
    }
  };

  const handleAddStripText = () => {
    if (newStripText.trim()) {
      setTopStrip([...topStrip, newStripText.trim().toUpperCase()]);
      setNewStripText("");
    }
  };

  const handleRemoveStripText = (index: number) => {
    setTopStrip(topStrip.filter((_, i) => i !== index));
  };

  const addBanner = () => {
    setHeroBanners([
      ...heroBanners,
      { imageUrl: "",mobileImageUrl: "", title: "", subtitle: "", ctaLink: "" },
    ]);
  };

  const removeBanner = (index: number) => {
    setHeroBanners(heroBanners.filter((_, i) => i !== index));
  };

  // --- Save Handlers ---

  const handleSaveGeneral = async () => {
    try {
      const payload = {
        topStripText: topStrip,
        shippingCost: shipping,
        shippingFreeLimit,
        gstPercentage: gst,
        discountCode,
        discountValue,
      };
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) alert("✅ General settings saved successfully!");
    } catch (error) {
      alert("Error saving General settings");
    }
  };

  const handleSaveBanners = async () => {
    try {
      const payload = { heroBanners };
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) alert("✅ Hero Banners saved successfully!");
    } catch (error) {
      alert("Error saving Banners");
    }
  };

  const handleSaveFeatured = async () => {
    if (featuredProductIds.length < 5) {
      alert("⚠️ Minimum 5 products are required to feature on the homepage.");
      return;
    }
    try {
      const payload = { featuredProductIds };
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) alert("✅ Featured products saved successfully!");
    } catch (error) {
      alert("Error saving featured products");
    }
  };

  const handleAddCoupon = async () => {
    try {
      // Validate start date validity
      if (!newCoupon.code || !newCoupon.discountValue) {
        alert("Enter required fields (code, value).");
        return;
      }
      
      const payload = {
        ...newCoupon,
        startDate: newCoupon.startDate || new Date().toISOString().split('T')[0],
        endDate: newCoupon.endDate || undefined
      };

      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.success) {
        setCoupons(result.data);
        alert("🎉 Coupon added successfully");
        setNewCoupon({
          code: "",
          discountType: "percentage",
          discountValue: 0,
          minOrderValue: 0,
          startDate: "",
          endDate: "",
        });
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error adding coupon:", error);
    }
  };

  const handleDeleteCoupon = async (id: string | undefined) => {
    if (!id) {
      alert("⚠️ Coupon ID is missing or invalid.");
      return;
    }

    try {
      const res = await fetch(`/api/admin/coupons?id=${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (result.success) {
        setCoupons(result.data || []);
        alert("🗑️ Coupon deleted successfully!");
      } else {
        alert(result.message || "Failed to delete coupon.");
      }
    } catch (error) {
      console.error("Error deleting coupon:", error);
      alert("Error deleting coupon");
    }
  };

  return (
    <div className="min-h-screen">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl text-[#2A1A12] mb-1">
            Admin Control Center
          </h1>
          <p className="text-[#8C7A6B] text-[10px] tracking-[0.2em] uppercase font-bold">
            Manage your frontend layout and business rules
          </p>
        </div>
        {/* <div className="flex items-center gap-3">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#7B2D0A]"></span>
          </span>
          <span className="text-[10px] font-black uppercase text-[#7B2D0A]">
            Live Connection
          </span>
        </div> */}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* SIDEBAR TABS */}
        <div className="lg:col-span-1 space-y-3">
          {[
            { id: "general", label: "General Settings", icon: LayoutDashboard },
            { id: "banners", label: "Hero Carousel", icon: Images },
            { id: "featured", label: "Featured Selection", icon: Sparkles },
            { id: "coupons", label: "Coupons", icon: Tag },
          ].map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-6 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all flex items-center gap-4 border ${
                  activeTab === tab.id
                    ? "bg-[#7B2D0A] text-[#F3E1B6] border-[#7B2D0A] shadow-[0_15px_30px_rgba(123,45,10,0.18)]"
                    : "bg-white text-stone-600 border-stone-100 hover:border-stone-400 hover:shadow-sm"
                }`}
              >
                <IconComponent size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* CONTENT PANEL */}
        <div className="lg:col-span-4 bg-white p-8 md:p-12 rounded-[2.5rem] border border-[#EBEBE8] shadow-[0_20px_80px_rgba(0,0,0,0.03)] backdrop-blur-sm">
          <AnimatePresence mode="wait">
            
            {activeTab === "general" && (
              <motion.div
                key="general"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-3 pb-6 border-b border-[#EBEBE8]">
                  <div className="w-8 h-8 rounded-2xl bg-[#F4EFEB] flex items-center justify-center text-[#7B2D0A]">
                    <LayoutDashboard size={16} />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif text-[#2A1A12]">
                      Announcement & Store Settings
                    </h2>
                    <p className="text-[#8C7A6B] text-[9px] uppercase tracking-widest">
                      Update top notification strip and tax/shipping rules
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 block mb-3">
                    Announcement Strip Messages
                  </label>
                  <div className="flex gap-3 mb-4">
                    <input
                      type="text"
                      value={newStripText}
                      onChange={(e) => setNewStripText(e.target.value)}
                      className="flex-1 h-14 border border-stone-200 rounded-2xl px-5 text-xs focus:border-[#7B2D0A] outline-none uppercase transition-all"
                      placeholder="e.g. FLAT 10% OFF ON YOUR FIRST PURCHASE"
                    />
                    <button
                      onClick={handleAddStripText}
                      className="px-6 bg-[#7B2D0A] text-[#F3E1B6] rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-[#2A1A12] transition-all"
                    >
                      Add Msg
                    </button>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto p-4 bg-[#F4EFEB]/40 rounded-2xl border border-stone-100">
                    {topStrip.map((text, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-white border border-[#EBEBE8] rounded-xl text-xs text-[#2A1A12] shadow-sm"
                      >
                        <span className="font-medium tracking-wide">{text}</span>
                        <button
                          onClick={() => handleRemoveStripText(index)}
                          className="text-stone-300 hover:text-red-500 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    {topStrip.length === 0 && (
                      <p className="text-[9px] text-stone-400 text-center py-4">
                        No notification messages added yet.
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[#EBEBE8] pt-8">
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 block mb-3">
                      Shipping Charges (₹)
                    </label>
                    <input
                      type="number"
                      value={shipping || ""}
                      onChange={(e) => setShipping(Number(e.target.value))}
                      className="w-full h-14 border border-stone-200 rounded-2xl px-5 text-xs focus:border-[#7B2D0A] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 block mb-3">
                      Free Shipping Above Order Price (₹)
                    </label>
                    <input
                      type="number"
                      value={shippingFreeLimit || ""}
                      onChange={(e) => setShippingFreeLimit(Number(e.target.value))}
                      className="w-full h-14 border border-stone-200 rounded-2xl px-5 text-xs focus:border-[#7B2D0A] outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-[#EBEBE8] pt-8">
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-stone-400 block mb-3">
                      GST Rate (%)
                    </label>
                    <input
                      type="number"
                      value={gst || ""}
                      onChange={(e) => setGst(Number(e.target.value))}
                      className="w-full h-14 border border-stone-200 rounded-2xl px-5 text-xs focus:border-[#7B2D0A] outline-none transition-all"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSaveGeneral}
                  className="flex items-center gap-3 px-8 py-4 bg-zinc-900 text-white rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-[#7B2D0A] transition-all"
                >
                  <Save size={16} /> Save General Settings
                </button>
              </motion.div>
            )}

            {activeTab === "banners" && (
              <motion.div
                key="banners"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-3 pb-6 border-b border-[#EBEBE8]">
                  <div className="w-8 h-8 rounded-2xl bg-[#F4EFEB] flex items-center justify-center text-[#7B2D0A]">
                    <Images size={16} />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif text-[#2A1A12]">
                      Hero Banner Carousel
                    </h2>
                    <p className="text-[#8C7A6B] text-[9px] uppercase tracking-widest">
                      Manage sliding header banners
                    </p>
                  </div>
                </div>

                {heroBanners.map((banner, index) => (
                  <div
                    key={index}
                    className="p-8 border border-[#EBEBE8] rounded-3xl space-y-5 relative bg-[#F4EFEB]/30"
                  >
                    <span className="text-[9px] font-black text-[#7B2D0A] tracking-wider px-3 py-1 bg-[#F4EFEB] rounded-full">
                      Slide {index + 1}
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-[8px] uppercase tracking-widest text-stone-400 mb-2 block">
                          Image URL
                        </label>
                        <input
                          type="text"
                          placeholder="https://images.unsplash.com/..."
                          value={banner.imageUrl}
                          onChange={(e) => {
                            const newB = [...heroBanners];
                            newB[index].imageUrl = e.target.value;
                            setHeroBanners(newB);
                          }}
                          className="h-12 w-full border border-stone-200 rounded-2xl px-5 text-xs bg-white focus:border-[#7B2D0A] outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[8px] uppercase tracking-widest text-stone-400 mb-2 block">
                          Mobile Image URL
                        </label>
                        <input
                          type="text"
                          placeholder="https://images.unsplash.com/..."
                          value={banner.mobileImageUrl}
                          onChange={(e) => {
                            const newB = [...heroBanners];
                            newB[index].mobileImageUrl = e.target.value;
                            setHeroBanners(newB);
                          }}
                          className="h-12 w-full border border-stone-200 rounded-2xl px-5 text-xs bg-white focus:border-[#7B2D0A] outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[8px] uppercase tracking-widest text-stone-400 mb-2 block">
                          Title
                        </label>
                        <input
                          type="text"
                          placeholder="Royal Festive Collection"
                          value={banner.title}
                          onChange={(e) => {
                            const newB = [...heroBanners];
                            newB[index].title = e.target.value;
                            setHeroBanners(newB);
                          }}
                          className="h-12 w-full border border-stone-200 rounded-2xl px-5 text-xs bg-white focus:border-[#7B2D0A] outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[8px] uppercase tracking-widest text-stone-400 mb-2 block">
                          Subtitle
                        </label>
                        <input
                          type="text"
                          placeholder="Up to 40% Off on Heritage Designs"
                          value={banner.subtitle}
                          onChange={(e) => {
                            const newB = [...heroBanners];
                            newB[index].subtitle = e.target.value;
                            setHeroBanners(newB);
                          }}
                          className="h-12 w-full border border-stone-200 rounded-2xl px-5 text-xs bg-white focus:border-[#7B2D0A] outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[8px] uppercase tracking-widest text-stone-400 mb-2 block">
                          CTA Link URL
                        </label>
                        <input
                          type="text"
                          placeholder="/collections/festive"
                          value={banner.ctaLink}
                          onChange={(e) => {
                            const newB = [...heroBanners];
                            newB[index].ctaLink = e.target.value;
                            setHeroBanners(newB);
                          }}
                          className="h-12 w-full border border-stone-200 rounded-2xl px-5 text-xs bg-white focus:border-[#7B2D0A] outline-none transition-all"
                        />
                      </div>
                    </div>
                    {heroBanners.length > 1 && (
                      <button
                        onClick={() => removeBanner(index)}
                        className="absolute top-8 right-8 p-2 rounded-xl text-stone-400 hover:text-red-500 bg-white shadow hover:bg-red-50/50 transition-all"
                      >
                        <Trash size={14} />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  onClick={addBanner}
                  className="flex items-center gap-3 text-xs font-black tracking-widest uppercase text-[#7B2D0A] hover:text-black py-4 border-2 border-dashed border-stone-200 rounded-2xl justify-center w-full transition-all"
                >
                  <Plus size={16} /> Add New Slide
                </button>

                <button
                  onClick={handleSaveBanners}
                  className="flex items-center gap-3 px-8 py-4 bg-zinc-900 text-white rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-[#7B2D0A] transition-all"
                >
                  <Save size={16} /> Save Banners
                </button>
              </motion.div>
            )}

            {activeTab === "featured" && (
              <motion.div
                key="featured"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-3 pb-6 border-b border-[#EBEBE8]">
                  <div className="w-8 h-8 rounded-2xl bg-[#F4EFEB] flex items-center justify-center text-[#7B2D0A]">
                    <Sparkles size={16} />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif text-[#2A1A12]">
                      Featured Products Selection
                    </h2>
                    <p className="text-[#8C7A6B] text-[9px] uppercase tracking-widest">
                      Products featured on the main home page
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-64 overflow-y-auto border border-[#EBEBE8] p-6 rounded-3xl bg-[#F4EFEB]/20">
                  {allProducts.map((prod) => {
                    const isSelected = featuredProductIds.includes(prod._id);
                    return (
                      <label
                        key={prod._id}
                        className={`flex flex-col gap-3 p-4 border rounded-2xl cursor-pointer bg-white transition-all duration-300 ${
                          isSelected
                            ? "border-[#7B2D0A] shadow-[0_10px_30px_rgba(123,45,10,0.15)] ring-1 ring-[#7B2D0A]"
                            : "border-[#EBEBE8] hover:border-[#8C7A6B] hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-center gap-3 justify-between">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFeaturedProductIds([
                                    ...featuredProductIds,
                                    prod._id,
                                  ]);
                                } else {
                                  setFeaturedProductIds(
                                    featuredProductIds.filter(
                                      (id) => id !== prod._id,
                                    ),
                                  );
                                }
                              }}
                              className="accent-[#7B2D0A] w-4 h-4"
                            />
                            <span className="text-xs font-bold text-[#2A1A12] line-clamp-1">
                              {prod.name}
                            </span>
                          </div>
                          {isSelected && (
                            <Check
                              size={12}
                              className="text-[#7B2D0A] font-black"
                            />
                          )}
                        </div>
                        {prod.image && (
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-full h-24 object-cover rounded-xl mt-1 pointer-events-none"
                          />
                        )}
                        <span className="text-[10px] font-black text-stone-500">
                          ₹{prod.price}
                        </span>
                      </label>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between border-t border-[#EBEBE8] pt-4">
                  <p className="text-[10px] text-[#7B2D0A] font-bold tracking-widest">
                    Selected: {featuredProductIds.length} / 5 minimum
                  </p>
                  {featuredProductIds.length >= 5 && (
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase text-green-700 bg-green-50 px-4 py-2 rounded-full">
                      <ShieldCheck size={14} /> Ready
                    </div>
                  )}
                </div>

                <button
                  onClick={handleSaveFeatured}
                  className="flex items-center gap-3 px-8 py-4 bg-zinc-900 text-white rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-[#7B2D0A] transition-all"
                >
                  <Save size={16} /> Save Featured Products
                </button>
              </motion.div>
            )}

            {activeTab === "coupons" && (
              <motion.div
                key="coupons"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="flex items-center gap-3 pb-6 border-b border-[#EBEBE8]">
                  <div className="w-8 h-8 rounded-2xl bg-[#F4EFEB] flex items-center justify-center text-[#7B2D0A]">
                    <Tag size={16} />
                  </div>
                  <div>
                    <h2 className="text-xl font-serif text-[#2A1A12]">
                      Coupons Control Panel
                    </h2>
                    <p className="text-[#8C7A6B] text-[9px] uppercase tracking-widest">
                      Add or modify discount offers
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-[8px] uppercase tracking-widest text-stone-400 mb-2 block">
                      Code
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. FESTIVE20"
                      value={newCoupon.code}
                      onChange={(e) =>
                        setNewCoupon({ ...newCoupon, code: e.target.value })
                      }
                      className="h-14 w-full border border-stone-200 rounded-2xl px-5 text-xs uppercase focus:border-[#7B2D0A] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[8px] uppercase tracking-widest text-stone-400 mb-2 block">
                      Discount Type
                    </label>
                    <select
                      value={newCoupon.discountType}
                      onChange={(e) =>
                        setNewCoupon({
                          ...newCoupon,
                          discountType: e.target.value as
                            | "percentage"
                            | "fixed",
                        })
                      }
                      className="h-14 w-full border border-stone-200 rounded-2xl px-5 text-xs bg-white focus:border-[#7B2D0A] outline-none transition-all"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[8px] uppercase tracking-widest text-stone-400 mb-2 block">
                      Value
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 20"
                      value={newCoupon.discountValue || ""}
                      onChange={(e) =>
                        setNewCoupon({
                          ...newCoupon,
                          discountValue: Number(e.target.value),
                        })
                      }
                      className="h-14 w-full border border-stone-200 rounded-2xl px-5 text-xs focus:border-[#7B2D0A] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[8px] uppercase tracking-widest text-stone-400 mb-2 block">
                      Minimum Order Value
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 1999"
                      value={newCoupon.minOrderValue || ""}
                      onChange={(e) =>
                        setNewCoupon({
                          ...newCoupon,
                          minOrderValue: Number(e.target.value),
                        })
                      }
                      className="h-14 w-full border border-stone-200 rounded-2xl px-5 text-xs focus:border-[#7B2D0A] outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-[8px] uppercase tracking-widest text-stone-400 mb-2 block">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={newCoupon.startDate}
                      onChange={(e) =>
                        setNewCoupon({ ...newCoupon, startDate: e.target.value })
                      }
                      className="h-14 w-full border border-stone-200 rounded-2xl px-5 text-xs focus:border-[#7B2D0A] outline-none transition-all text-stone-500"
                    />
                  </div>
                  <div>
                    <label className="text-[8px] uppercase tracking-widest text-stone-400 mb-2 block">
                      End Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={newCoupon.endDate}
                      onChange={(e) =>
                        setNewCoupon({ ...newCoupon, endDate: e.target.value })
                      }
                      className="h-14 w-full border border-stone-200 rounded-2xl px-5 text-xs focus:border-[#7B2D0A] outline-none transition-all text-stone-500"
                    />
                  </div>
                </div>

                <button
                  onClick={handleAddCoupon}
                  className="px-8 py-4 bg-[#7B2D0A] text-[#F3E1B6] rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-[0_10px_20px_rgba(123,45,10,0.15)] hover:bg-[#2A1A12] transition-all"
                >
                  Add Coupon
                </button>

                <div className="border-t pt-8 mt-8">
                  <h3 className="text-sm font-serif mb-4">Active Coupons</h3>
                  <div className="max-h-60 overflow-y-auto space-y-3">
                    {coupons.map((c: any, index) => (
                      <div
                        key={c._id || index}
                        className="flex justify-between items-center p-5 bg-[#F4EFEB]/30 rounded-2xl border border-[#EBEBE8] text-xs"
                      >
                        <span className="font-black uppercase tracking-widest">
                          {c.code}
                        </span>
                        <span className="text-[#8C7A6B]">
                          {c.discountValue}{" "}
                          {c.discountType === "percentage" ? "%" : "₹"} OFF
                        </span>
                        <button
                          onClick={() => handleDeleteCoupon(c._id || c.code)} 
                          className="text-stone-400 hover:text-red-500 p-2 rounded-xl hover:bg-white transition-all"
                        >
                          <Trash size={14} />
                        </button>
                      </div>
                    ))}
                    {coupons.length === 0 && (
                      <p className="text-[10px] text-stone-400 py-6 text-center">
                        No coupons active
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}