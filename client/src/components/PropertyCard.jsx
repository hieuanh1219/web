// src/components/PropertyCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { selectPropertyCard } from "../hook/data";

// --- BỘ ICON SVG (Đã bỏ Heart) ---
const CardIcons = {
  Bed: () => (
    <svg
      className="w-4 h-4"
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
      className="w-4 h-4"
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
      className="w-4 h-4"
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
      className="w-3.5 h-3.5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
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
        d="M17 8l4 4m0 0l-4 4m4-4H3"
      />
    </svg>
  ),
  Info: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
};

export default function PropertyCard({ propertyId }) {
  const card = selectPropertyCard(propertyId);
  if (!card) return null;

  return (
    <Link to={`/properties/${card.slug}`} className="group block h-full">
      <div className="relative flex h-full flex-col bg-white rounded-[24px] overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_-5px_rgba(14,32,56,0.15)] hover:-translate-y-1 border border-slate-100">
        {/* 1. IMAGE COVER AREA */}
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
          {/* Ảnh nền */}
          {card.coverUrl ? (
            <img
              src={card.coverUrl}
              alt={card.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-slate-50 text-slate-300">
              <CardIcons.Area />
              <span className="ml-2 text-sm italic">No image</span>
            </div>
          )}

          {/* Lớp gradient nhẹ */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent opacity-60" />

          {/* Badges (Tags) - Góc trái trên */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
            <span
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-md border border-white/20
              ${
                card.transactionType === "SALE"
                  ? "bg-emerald-500/90"
                  : "bg-blue-500/90"
              }`}
            >
              {card.transactionType === "SALE" ? "Đang Bán" : "Cho Thuê"}
            </span>
          </div>

          {/* ĐÃ XÓA NÚT TIM Ở ĐÂY */}

          {/* Giá tiền - Góc dưới trái */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl inline-block shadow-lg">
              <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">
                Giá niêm yết
              </span>
              <span className="text-lg md:text-xl font-extrabold text-[#0E2038]">
                {card.displayPrice || "Liên hệ"}
              </span>
            </div>
          </div>
        </div>

        {/* 2. CARD BODY */}
        <div className="flex flex-1 flex-col p-5">
          {/* Dòng địa chỉ & Loại BĐS */}
          <div className="flex items-center justify-between mb-3">
            <span className="px-2.5 py-1 rounded-md bg-slate-100 text-[10px] font-bold text-slate-600 uppercase tracking-wide">
              {card.typeName}
            </span>
            {card.categoryLabel && (
              <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wide border border-indigo-100 px-2 py-0.5 rounded-md">
                {card.categoryLabel}
              </span>
            )}
          </div>

          {/* Tiêu đề */}
          <h3 className="text-[17px] font-bold text-[#0E2038] leading-snug line-clamp-2 mb-2 group-hover:text-blue-700 transition-colors">
            {card.title}
          </h3>

          {/* Địa chỉ */}
          <div className="flex items-start gap-1.5 text-slate-500 text-sm mb-5">
            <div className="mt-0.5 flex-shrink-0">
              <CardIcons.Location />
            </div>
            <span className="line-clamp-1">{card.locationName}</span>
          </div>

          {/* Divider */}
          <div className="h-px bg-slate-100 w-full mb-4 mt-auto"></div>

          {/* 3. FOOTER INFO */}
          <div className="flex items-center justify-between text-slate-600">
            {!card.bedrooms && !card.bathrooms ? (
              <div className="flex items-center gap-2 text-xs font-medium bg-slate-50 px-3 py-2 rounded-lg w-full text-slate-500">
                <CardIcons.Info />
                <span className="line-clamp-1">
                  {card.subSpec || "Đang cập nhật thông tin"}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                {card.bedrooms > 0 && (
                  <div
                    className="flex items-center gap-1.5 tooltip"
                    title="Phòng ngủ"
                  >
                    <CardIcons.Bed />
                    <span className="text-sm font-bold">{card.bedrooms}</span>
                  </div>
                )}
                {card.bathrooms > 0 && (
                  <div className="flex items-center gap-1.5" title="Phòng tắm">
                    <CardIcons.Bath />
                    <span className="text-sm font-bold">{card.bathrooms}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5" title="Diện tích">
                  <CardIcons.Area />
                  <span className="text-sm font-bold">{card.area} m²</span>
                </div>
              </div>
            )}

            <div className="ml-auto transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 text-[#0E2038]">
              <CardIcons.ArrowRight />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
