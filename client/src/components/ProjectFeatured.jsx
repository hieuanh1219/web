
import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MOCK, selectPropertyCard } from "../hook/data";

export default function ProjectFeatured() {
  // 1. Logic tìm dự án nổi bật
  const featuredProject = useMemo(() => {
    const allIds = MOCK.listing || Object.keys(MOCK.entities.properties);
    for (const id of allIds) {
      const card = selectPropertyCard(id);
      if (card && card.isProject) {
        return card;
      }
    }
    return null;
  }, []);

  // 2. Logic Slideshow
  // Giả sử dữ liệu có trường 'images' là mảng các url ảnh.
  // Nếu không có, fallback về mảng chứa 1 ảnh coverUrl.
  const slides = useMemo(() => {
    if (!featuredProject) return [];
    // Ưu tiên dùng mảng images, nếu không có thì dùng coverUrl nhân bản lên để test hiệu ứng
    return featuredProject.images && featuredProject.images.length > 0
      ? featuredProject.images
      : [featuredProject.coverUrl];
  }, [featuredProject]);

  const [currentIndex, setCurrentIndex] = useState(0);

  // Tự động chuyển ảnh mỗi 6 giây
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (!featuredProject) return null;

  return (
    <section className="group relative h-screen w-full overflow-hidden bg-[#0E2038]">
      {/* === 1. BACKGROUND SLIDESHOW === */}
      <div className="absolute inset-0 h-full w-full">
        <AnimatePresence mode="popLayout">
          <motion.img
            key={currentIndex} // Key thay đổi để trigger animation
            src={slides[currentIndex]}
            alt={featuredProject.title}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }} // Ảnh cũ sẽ mờ dần đi
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        </AnimatePresence>

        {/* Lớp phủ Gradient: Đen đáy -> Trong suốt -> Đen mờ đỉnh */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60 pointer-events-none"></div>
        {/* Lớp phủ màu thương hiệu mỏng */}
        <div className="absolute inset-0 bg-[#0E2038]/20 mix-blend-multiply pointer-events-none"></div>
      </div>

      {/* === 2. CONTENT === */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mx-auto flex w-full max-w-5xl flex-col items-center"
        >
          {/* Badge: Nhỏ gọn hơn trên mobile */}
          <span className="mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md sm:mb-6 sm:px-6 sm:py-2 sm:text-xs">
            Dự án tâm điểm
          </span>

          {/* Title: Responsive typography (Mobile: 4xl -> Desktop: 8xl) */}
          <h2 className="mb-4 font-sangtrong text-4xl uppercase leading-tight text-white drop-shadow-2xl sm:mb-6 sm:text-6xl md:text-7xl lg:text-8xl">
            {featuredProject.title}
          </h2>

          {/* Location & Price: Tinh chỉnh cho mobile */}
          <div className="mb-8 max-w-2xl text-base font-light leading-relaxed text-slate-200 sm:mb-10 sm:text-xl md:text-2xl">
            <p>
              Kiệt tác {featuredProject.typeName?.toLowerCase()} tại{" "}
              <span className="font-semibold text-white">
                {featuredProject.locationName}
              </span>
            </p>
            <div className="mt-2 flex items-center justify-center gap-2 text-sm sm:mt-0 sm:inline sm:text-inherit">
              <span className="hidden opacity-50 sm:inline">|</span>
              <span>Giá từ </span>
              <span className="font-bold text-yellow-400">
                {featuredProject.displayPrice}
              </span>
            </div>
          </div>

          {/* Buttons: Stack dọc trên mobile, ngang trên desktop */}
          <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:gap-6">
            <Link
              to={`/properties/${featuredProject.slug}`}
              className="group/btn relative flex w-full items-center justify-center overflow-hidden rounded-full bg-white px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-[#0E2038] transition-all hover:bg-yellow-400 sm:w-auto sm:min-w-[180px] sm:py-4"
            >
              <span className="relative z-10">Xem chi tiết</span>
            </Link>

            <button className="group/btn flex w-full items-center justify-center rounded-full border border-white/40 bg-white/5 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white backdrop-blur-sm transition-all hover:bg-white hover:text-[#0E2038] sm:w-auto sm:min-w-[180px] sm:py-4">
              Đăng ký tham quan
            </button>
          </div>
        </motion.div>
      </div>

      {/* === 3. INDICATORS (DOTS) === */}
      {/* Hiển thị các chấm tròn để biết đang ở ảnh nào */}
      {slides.length > 1 && (
        <div className="absolute bottom-24 left-1/2 z-20 flex -translate-x-1/2 gap-3 sm:bottom-10 sm:left-10 sm:translate-x-0">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === currentIndex
                  ? "w-8 bg-white"
                  : "w-1.5 bg-white/40 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ delay: 2, duration: 2, repeat: Infinity }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/40 sm:flex"
      >
        <span className="text-[9px] uppercase tracking-[0.3em]">Khám phá</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </motion.div>
    </section>
  );
}