// src/components/HomeFeatured.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // Cần cài framer-motion
import { MOCK, selectPropertyDetail } from "../hook/data";

// --- HELPERS ---
const formatMoneyVND = (value) => {
  if (!value) return "—";
  const n = Number(value);
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} tỷ`;
  if (n >= 1_000_000) return `${Math.round(n / 1_000_000)} triệu`;
  return new Intl.NumberFormat("vi-VN").format(n) + " ₫";
};

// --- ICONS (Đồng bộ với PropertyCard) ---
const Icons = {
  Bed: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  ),
  Bath: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    </svg>
  ),
  Area: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
      />
    </svg>
  ),
  Location: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  ),
  ArrowRight: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M14 5l7 7m0 0l-7 7m7-7H3"
      />
    </svg>
  ),
  ChevronLeft: () => (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </svg>
  ),
  ChevronRight: () => (
    <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  ),
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

  // Preload Images
  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [images]);

  // Navigation Logic
  const nextImage = () => setCurrentImg((prev) => (prev + 1) % images.length);
  const prevImage = () =>
    setCurrentImg((prev) => (prev - 1 + images.length) % images.length);

  if (!featured) return null;

  return (
    <section className="relative w-full h-[95vh] overflow-hidden bg-[#0E2038] text-white">
      {/* 1. BACKGROUND LAYERS (Parallax Effect) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImg}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 z-0"
        >
          {/* Ảnh nền chính (được làm tối) */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
            style={{ backgroundImage: `url(${images[currentImg]})` }}
          />
          {/* Overlay Gradient: Trái đậm -> Phải nhạt để đọc chữ */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0E2038] via-[#0E2038]/90 to-[#0E2038]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E2038] via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* 2. MAIN CONTENT GRID */}
      <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full items-center">
          {/* === LEFT: INFO (Chiếm 5 phần) === */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Tag Spotlight */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-[1px] w-12 bg-yellow-500"></div>
                <span className="text-yellow-400 font-bold uppercase tracking-[0.2em] text-sm">
                  Bất động sản nổi bật
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl uppercase lg:text-6xl font-sangtrong leading-tight text-white mb-4">
                {featured.title}
              </h1>

              {/* Location */}
              <div className="flex items-center gap-2 text-slate-300 mb-6">
                <Icons.Location />
                <span className="text-lg font-light">
                  {featured.address || featured.locationName}
                </span>
              </div>

              {/* Price & Specs Block */}
              <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">
                      Giá bán
                    </p>
                    <div className="text-4xl font-bold text-white tracking-tight">
                      {featured.displayPrice || formatMoneyVND(featured.price)}
                    </div>
                  </div>

                  {/* Icons Grid */}
                  <div className="flex gap-6 border-l border-white/10 pl-6">
                    <div className="flex flex-col items-center gap-1">
                      <Icons.Bed />
                      <span className="text-sm font-semibold">
                        {featured.bedrooms} PN
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Icons.Bath />
                      <span className="text-sm font-semibold">
                        {featured.bathrooms} WC
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Icons.Area />
                      <span className="text-sm font-semibold">
                        {featured.area} m²
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <Link
                  to={`/properties/${featured.slug}`}
                  className="group bg-white text-[#0E2038] px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-colors flex items-center gap-2"
                >
                  Xem chi tiết
                  <span className="group-hover:translate-x-1 transition-transform">
                    <Icons.ArrowRight />
                  </span>
                </Link>
                <button className="px-8 py-4 rounded-xl border border-white/30 text-white font-bold hover:bg-white/10 transition-colors">
                  Liên hệ ngay
                </button>
              </div>
            </motion.div>
          </div>

          {/* === RIGHT: IMAGE PREVIEW / SLIDER (Chiếm 7 phần) === */}
          <div className="hidden lg:col-span-7 lg:flex justify-end relative h-[600px] items-center">
            {/* Decorative Circle Background */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl" />

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative w-full max-w-2xl aspect-[4/3]"
            >
              {/* Khung ảnh chính */}
              <div className="relative w-full h-full rounded-[30px] overflow-hidden shadow-2xl border-4 border-white/10 group">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImg}
                    src={images[currentImg]}
                    alt="Property Preview"
                    initial={{ scale: 1.1, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Navigation Buttons (Floating on Image) */}
                <div className="absolute bottom-6 right-6 flex gap-3">
                  <button
                    onClick={prevImage}
                    className="w-12 h-12 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white border border-white/20 flex items-center justify-center transition-all hover:scale-110"
                  >
                    <Icons.ChevronLeft />
                  </button>
                  <button
                    onClick={nextImage}
                    className="w-12 h-12 rounded-full bg-white text-[#0E2038] hover:bg-yellow-400 border border-white flex items-center justify-center transition-all hover:scale-110 shadow-lg"
                  >
                    <Icons.ChevronRight />
                  </button>
                </div>

                {/* Image Counter Badge */}
                <div className="absolute top-6 right-6 bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-xs font-bold uppercase tracking-wider">
                  Ảnh {currentImg + 1} / {images.length}
                </div>
              </div>

              {/* Floating Info Card (Góc trái dưới của ảnh) */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-10 -left-10 bg-white/10 backdrop-blur-xl border border-white/20 p-5 rounded-2xl w-64 shadow-xl hidden xl:block"
              >
                <h4 className="text-sm font-bold text-yellow-400 mb-2 uppercase tracking-wider">
                  Tiện ích đẳng cấp
                </h4>
                <div className="flex flex-wrap gap-2">
                  {featured.amenities?.slice(0, 3).map((amenity, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-white/10 px-2 py-1 rounded text-slate-200"
                    >
                      {amenity.name}
                    </span>
                  )) || (
                    <span className="text-xs text-slate-300">
                      Đầy đủ tiện nghi
                    </span>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50"
      >
        <span className="text-[10px] uppercase tracking-widest">
          KHÁM PHÁ TIẾP
        </span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent"></div>
      </motion.div>
    </section>
  );
}
