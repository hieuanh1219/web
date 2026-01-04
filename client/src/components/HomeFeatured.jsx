// // src/components/HomeFeatured.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MOCK, selectPropertyDetail } from "../hook/data";

// --- HELPERS & ICONS (Giữ nguyên như cũ) ---
const formatMoneyVND = (value) => {
  if (!value) return "—";
  const n = Number(value);
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} tỷ`;
  if (n >= 1_000_000) return `${Math.round(n / 1_000_000)} triệu`;
  return new Intl.NumberFormat("vi-VN").format(n) + " ₫";
};

// ... (Copy lại toàn bộ object Icons ở đây hoặc import từ file khác để code gọn)
const Icons = {
  Bed: () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>),
  Bath: () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>),
  Area: () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>),
  Location: () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>),
  ArrowRight: () => (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>),
  ChevronLeft: () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>),
  ChevronRight: () => (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>),
};

export default function HomeFeatured() {
  // 1. DATA LOGIC
  const featured = useMemo(() => {
    const allIds = MOCK.listing || Object.keys(MOCK.entities.properties);
    const foundId = allIds.find((id) => {
      const p = MOCK.entities.properties[id];
      return (
        p.transactionType === "SALE" &&
        (p.typeId === "type_villa" || p.typeId === "type_townhouse")
      );
    });
    const targetId = foundId || allIds[0];
    return selectPropertyDetail(targetId);
  }, []);

  // 2. STATE
  const [currentImg, setCurrentImg] = useState(0);

  const images = useMemo(() => {
    if (featured?.images?.length) {
      return featured.images.map((img) => img.url);
    }
    return [featured?.coverUrl || "/house1.jpg"];
  }, [featured]);

  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [images]);

  const nextImage = () => setCurrentImg((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImg((prev) => (prev - 1 + images.length) % images.length);

  if (!featured) return null;

  return (
    // Thay đổi chiều cao: min-h-screen để đảm bảo full màn hình trên mobile
    <section className="relative w-full h-[100dvh] lg:h-[95vh] overflow-hidden bg-[#0E2038] text-white">
      
      {/* 1. BACKGROUND LAYERS (Chung cho cả Mobile & Desktop) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImg}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 z-0"
        >
          {/* Ảnh nền */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
            style={{ backgroundImage: `url(${images[currentImg]})` }}
          />
          {/* Overlay: Mobile cần gradient đen đậm hơn ở dưới để đọc chữ */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0E2038]/30 via-transparent to-[#0E2038] lg:bg-gradient-to-r lg:from-[#0E2038] lg:via-[#0E2038]/90 lg:to-[#0E2038]/30" />
        </motion.div>
      </AnimatePresence>

      {/* 2. MAIN CONTENT */}
      <div className="relative z-10 container mx-auto px-4 lg:px-6 h-full flex flex-col justify-end lg:justify-center pb-24 lg:pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 w-full items-end lg:items-center">
          
          {/* === LEFT INFO (Mobile: Hiển thị đè lên dưới cùng) === */}
          <div className="lg:col-span-5 space-y-4 lg:space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Tag Spotlight */}
              {/* <div className="flex items-center gap-3 mb-2 lg:mb-4">
                <div className="h-[1px] w-8 lg:w-12 bg-yellow-500"></div>
                <span className="text-yellow-400 font-bold uppercase tracking-[0.15em] text-xs lg:text-sm shadow-black drop-shadow-md">
                  Spotlight
                </span>
              </div> */}

              {/* Title: Giảm size trên mobile để không bị tràn */}
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-sangtrong leading-tight text-white mb-2 lg:mb-4 drop-shadow-xl line-clamp-2">
                {featured.title}
              </h1>

              {/* Location */}
              <div className="flex items-center gap-2 text-slate-200 lg:text-slate-300 mb-4 lg:mb-6">
                <Icons.Location />
                <span className="text-sm lg:text-lg font-light truncate max-w-[300px]">
                  {featured.address || featured.locationName}
                </span>
              </div>

              {/* Price & Specs Block: Mobile thiết kế gọn gàng hơn */}
              <div className="bg-black/30 lg:bg-white/5 border border-white/20 lg:border-white/10 backdrop-blur-md lg:backdrop-blur-xl rounded-2xl p-4 lg:p-6 mb-6 lg:mb-8">
                <div className="flex flex-row items-center justify-between gap-4">
                  {/* Giá tiền */}
                  <div>
                    <p className="hidden lg:block text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
                      Giá bán
                    </p>
                    <div className="text-2xl lg:text-4xl font-bold text-white tracking-tight text-yellow-300 lg:text-white">
                      {featured.displayPrice || formatMoneyVND(featured.price)}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="w-[1px] h-10 bg-white/20"></div>

                  {/* Icons Grid: Mobile chuyển sang dạng Flex ngang gọn */}
                  <div className="flex gap-4 lg:gap-6 lg:border-l lg:border-white/10 lg:pl-6">
                    <div className="flex flex-col items-center gap-1">
                      <Icons.Bed />
                      <span className="text-xs lg:text-sm font-semibold">{featured.bedrooms} <span className="hidden sm:inline">PN</span></span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Icons.Bath />
                      <span className="text-xs lg:text-sm font-semibold">{featured.bathrooms} <span className="hidden sm:inline">WC</span></span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Icons.Area />
                      <span className="text-xs lg:text-sm font-semibold">{featured.area} <span className="hidden sm:inline">m²</span></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Buttons: Trên mobile nút sẽ full width */}
              <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
                <Link
                  to={`/properties/${featured.slug}`}
                  className="group bg-white text-[#0E2038] px-6 py-3 lg:px-8 lg:py-4 rounded-xl font-bold text-base lg:text-lg hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  Xem chi tiết
                  <span className="group-hover:translate-x-1 transition-transform">
                    <Icons.ArrowRight />
                  </span>
                </Link>
                <button className="px-6 py-3 lg:px-8 lg:py-4 rounded-xl border border-white/30 bg-black/20 lg:bg-transparent text-white font-bold hover:bg-white/10 transition-colors w-full sm:w-auto">
                  Liên hệ
                </button>
              </div>
            </motion.div>
          </div>

          {/* === RIGHT: IMAGE PREVIEW (Chỉ hiện trên Desktop) === */}
          {/* Code cũ phần này OK, chỉ cần giữ nguyên class hidden lg:block */}
          <div className="hidden lg:col-span-7 lg:flex justify-end relative h-[600px] items-center">
             {/* ... (Giữ nguyên nội dung bên trong phần Desktop như cũ) ... */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative w-full max-w-2xl aspect-[4/3]"
            >
               <div className="relative w-full h-full rounded-[30px] overflow-hidden shadow-2xl border-4 border-white/10 group">
                <img src={images[currentImg]} alt="Preview" className="w-full h-full object-cover" />
                 {/* Desktop Nav */}
                 <div className="absolute bottom-6 right-6 flex gap-3">
                    <button onClick={prevImage} className="w-12 h-12 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white border border-white/20 flex items-center justify-center transition-all hover:scale-110"><Icons.ChevronLeft /></button>
                    <button onClick={nextImage} className="w-12 h-12 rounded-full bg-white text-[#0E2038] hover:bg-yellow-400 border border-white flex items-center justify-center transition-all hover:scale-110 shadow-lg"><Icons.ChevronRight /></button>
                 </div>
               </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* 3. MOBILE CONTROLS (Chỉ hiện trên Mobile để lướt ảnh) */}
      <div className="lg:hidden absolute top-1/2 -translate-y-1/2 inset-x-0 px-4 flex justify-between z-20 pointer-events-none">
        <button 
          onClick={(e) => { e.preventDefault(); prevImage(); }}
          className="pointer-events-auto w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 text-white flex items-center justify-center active:scale-95"
        >
          <Icons.ChevronLeft />
        </button>
        <button 
          onClick={(e) => { e.preventDefault(); nextImage(); }}
          className="pointer-events-auto w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm border border-white/10 text-white flex items-center justify-center active:scale-95"
        >
          <Icons.ChevronRight />
        </button>
      </div>

      {/* 4. IMAGE COUNTER (Mobile Only) */}
      <div className="lg:hidden absolute top-24 right-4 z-20">
         <div className="bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white">
            {currentImg + 1} / {images.length}
         </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-4 lg:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 z-20"
      >
        <div className="w-[1px] h-8 lg:h-12 bg-gradient-to-b from-white to-transparent"></div>
      </motion.div>
    </section>
  );
}