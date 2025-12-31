import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MOCK, selectPropertyCard } from "../hook/data";

export default function ProjectFeatured() {
  // 1. Logic tìm dự án nổi bật nhất (Dự án đầu tiên trong data)
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

  if (!featuredProject) return null;

  return (
    <section className="group relative h-screen w-full overflow-hidden bg-[#0E2038]">
      {/* === 1. BACKGROUND IMAGE (FULL SCREEN) === */}
      <div className="absolute inset-0 h-full w-full">
        <img
          src={featuredProject.coverUrl}
          alt={featuredProject.title}
          className="h-full w-full object-cover object-center transition-transform duration-[10s] group-hover:scale-110"
        />

        {/* Lớp phủ Gradient: 
            - Từ đen (dưới đáy) -> Trong suốt (giữa) -> Đen mờ (trên cùng để rõ Navbar) 
        */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30"></div>

        {/* Thêm một lớp màu Xanh than mỏng để ám màu thương hiệu */}
        <div className="absolute inset-0 bg-[#0E2038]/20 mix-blend-multiply"></div>
      </div>

      {/* === 2. CONTENT (CENTERED) === */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-6xl mx-auto"
        >
          {/* Badge */}
          <span className="mb-6 inline-block rounded-full border border-white/30 bg-white/10 px-6 py-2 text-sm font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
            Dự án tâm điểm
          </span>

          {/* Title - Chữ cực lớn */}
          <h2 className="mb-6 text-5xl font-extralight leading-tight text-white md:text-7xl lg:text-8xl drop-shadow-2xl">
            {featuredProject.title}
          </h2>

          {/* Location & Price */}
          <p className="mb-10 text-xl font-light text-slate-200 md:text-3xl max-w-4xl mx-auto leading-relaxed">
            Kiệt tác {featuredProject.typeName?.toLowerCase()} tại{" "}
            <span className="font-semibold text-white">
              {featuredProject.locationName}
            </span>
            <span className="mx-3 opacity-50">|</span>
            Giá từ{" "}
            <span className="font-bold text-yellow-400">
              {featuredProject.displayPrice}
            </span>
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              to={`/properties/${featuredProject.slug}`}
              className="min-w-[200px] rounded-full bg-white px-8 py-4 text-base font-bold text-[#0E2038] transition-all hover:bg-yellow-400 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
            >
              Xem chi tiết dự án
            </Link>

            <button className="min-w-[200px] rounded-full border border-white px-8 py-4 text-base font-bold text-white transition-all hover:bg-white hover:text-[#0E2038]">
              Đăng ký tham quan
            </button>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator (Mũi tên chỉ xuống) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1.5, duration: 1.5, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50"
      >
        <span className="text-[10px] uppercase tracking-widest">
          Khám phá tiếp
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </motion.div>
    </section>
  );
}
