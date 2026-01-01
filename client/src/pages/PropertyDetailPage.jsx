// src/pages/PropertyDetailPage.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MOCK, selectPropertyDetail, selectPropertyCard } from "../hook/data";
import PropertyCard from "../components/PropertyCard";

// --- HELPER FORMAT ---
const formatMoneyVND = (valueLikeString) => {
  if (!valueLikeString) return "Thỏa thuận";
  const n = Number(valueLikeString);
  if (!Number.isFinite(n) || n === 0) return "Thỏa thuận";

  // Thêm khoảng trắng \u00A0 (non-breaking space) để tách số và chữ
  if (n >= 1000000000)
    return (
      new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 2 }).format(
        n / 1000000000
      ) + "\u00A0tỷ"
    );
  if (n >= 1000000)
    return (
      new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(
        n / 1000000
      ) + "\u00A0triệu"
    );
  return new Intl.NumberFormat("vi-VN").format(n) + "\u00A0₫";
};

// --- COMPONENTS ---
const SectionHeader = ({ title }) => (
  <h3 className="text-xl md:text-2xl font-bold text-[#0E2038] mb-6 mt-12 first:mt-0">
    {title}
  </h3>
);

const SpecRow = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="flex items-baseline justify-between py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 px-2 rounded transition-colors">
      <span className="text-slate-500 font-medium">{label}</span>
      <span className="text-[#0E2038] font-bold text-right">{value}</span>
    </div>
  );
};

export default function PropertyDetailPage() {
  const { slug } = useParams();

  // 1. DATA
  const propertyId = MOCK.route?.bySlug?.[slug];
  const detail = useMemo(
    () => (propertyId ? selectPropertyDetail(propertyId) : null),
    [propertyId]
  );

  const relatedProperties = useMemo(() => {
    if (!detail) return [];
    return (MOCK.listing || Object.keys(MOCK.entities.properties))
      .map((id) => selectPropertyCard(id))
      .filter(
        (p) => p && p.id !== detail.id && p.typeName === detail.type?.name
      )
      .slice(0, 3);
  }, [detail]);

  // 2. SCROLL SPY
  const sections = [
    { id: "overview", label: "Tổng quan" },
    { id: "gallery", label: "Hình ảnh" },
    { id: "description", label: "Mô tả" },
    { id: "specs", label: "Chi tiết" },
    { id: "location", label: "Vị trí" },
  ];

  const sectionRefs = useRef({});
  const [activeSection, setActiveSection] = useState("overview");

  const setSectionRef = (id) => (el) => {
    if (el) sectionRefs.current[id] = el;
  };

  const scrollToSection = (id) => {
    const el = sectionRefs.current[id];
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const section of sections) {
        const element = sectionRefs.current[section.id];
        if (element && element.offsetTop <= scrollPosition)
          setActiveSection(section.id);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!detail)
    return (
      <div className="h-screen flex items-center justify-center text-[#0E2038]">
        Đang tải dữ liệu...
      </div>
    );
  const coverImage =
    detail.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1600596542815-2495db9a9cf6?auto=format&fit=crop&q=80";

  return (
    <div className="min-h-screen bg-white font-sans text-slate-700 pb-32">
      {/* 1. HERO SECTION */}
      <div className="relative w-full h-[70vh] md:h-[85vh]">
        <img
          src={coverImage}
          className="w-full h-full object-cover"
          alt="Cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-white"></div>
        <Link
          to="/properties"
          className="absolute top-8 left-6 md:left-12 z-20 text-white flex items-center gap-2 opacity-80 hover:opacity-100 transition"
        >
          <span className="text-xl">←</span>{" "}
          <span className="text-sm font-bold uppercase tracking-widest">
            Quay lại
          </span>
        </Link>
      </div>

      {/* 2. CONTENT BODY */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative -mt-20 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          {/* SIDEBAR */}
          <aside className="hidden lg:block lg:col-span-2">
            <div className="sticky top-24 pt-4">
              <nav className="flex flex-col gap-5 text-sm">
                {sections.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => scrollToSection(s.id)}
                    className={`text-left font-bold uppercase tracking-widest transition-colors duration-300 ${
                      activeSection === s.id
                        ? "text-[#0E2038]"
                        : "text-slate-300 hover:text-slate-500"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* MAIN STREAM */}
          <main className="lg:col-span-9 flex flex-col gap-16 md:pt-4">
            {/* A. HEADLINE (Tên & Giá) */}
            <section ref={setSectionRef("overview")}>
              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                <span>{detail.type?.name}</span>
                <span>•</span>
                <span>
                  {detail.transactionType === "SALE" ? "Đang bán" : "Cho thuê"}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#0E2038] leading-tight mb-6">
                {detail.title}
              </h1>

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-slate-100 pb-8">
                <div className="max-w-xl">
                  <p className="text-lg md:text-xl text-slate-500 font-light leading-relaxed">
                    {detail.address}
                  </p>
                </div>

                {/* SỬA LỖI DÍNH CHỮ Ở ĐÂY */}
                <div className="flex flex-col md:items-end shrink-0">
                  <span className="text-xs font-bold uppercase text-slate-400 mb-1">
                    Giá niêm yết
                  </span>
                  <div className="flex items-baseline gap-3">
                    {" "}
                    {/* Tăng gap lên 3 */}
                    <span className="text-4xl md:text-5xl font-black text-[#0E2038] tracking-tight">
                      {/* Ưu tiên dùng displayPrice nếu có, nhưng thêm khoảng trắng nếu chuỗi dính */}
                      {detail.displayPrice
                        ? detail.displayPrice.replace(
                            /(\d+)(tỷ|triệu|vnd)/i,
                            "$1\u00A0$2"
                          )
                        : formatMoneyVND(detail.price)}
                    </span>
                    {/* Nếu đơn vị nằm riêng lẻ thì hiển thị màu nhạt hơn */}
                    {detail.priceUnit &&
                      !detail.displayPrice
                        ?.toLowerCase()
                        .includes(detail.priceUnit.toLowerCase()) && (
                        <span className="text-xl text-slate-400 font-medium">
                          {detail.priceUnit}
                        </span>
                      )}
                  </div>
                </div>
              </div>

              {/* Quick Specs */}
              <div className="flex flex-wrap gap-8 md:gap-16 pt-8">
                {[
                  {
                    label: "Diện tích",
                    val: detail.area ? `${detail.area} m²` : null,
                  },
                  { label: "Phòng ngủ", val: detail.bedrooms },
                  { label: "Phòng tắm", val: detail.bathrooms },
                  {
                    label: "Pháp lý",
                    val: detail.features?.find((f) => f.key === "legal")?.value,
                  },
                ].map(
                  (item, i) =>
                    item.val && (
                      <div key={i}>
                        <p className="text-xs text-slate-400 font-bold uppercase mb-1">
                          {item.label}
                        </p>
                        <p className="text-xl md:text-2xl font-bold text-[#0E2038]">
                          {item.val}
                        </p>
                      </div>
                    )
                )}
              </div>
            </section>

            {/* B. GALLERY */}
            <section ref={setSectionRef("gallery")}>
              <SectionHeader title="Hình ảnh thực tế" />
              <div className="flex flex-col gap-6">
                {detail.images?.slice(0, 3).map((img, idx) => (
                  <div key={idx} className="w-full">
                    <img
                      src={img.url}
                      alt={`Gallery ${idx}`}
                      className="w-full h-auto object-cover rounded-lg"
                      loading="lazy"
                    />
                    {img.alt && (
                      <p className="mt-2 text-sm text-slate-400 italic">
                        {img.alt}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              {detail.images?.length > 3 && (
                <button className="mt-6 text-[#0E2038] font-bold underline hover:text-blue-600">
                  Xem toàn bộ {detail.images.length} hình ảnh
                </button>
              )}
            </section>

            {/* C. DESCRIPTION */}
            <section ref={setSectionRef("description")}>
              <SectionHeader title="Thông tin chi tiết" />
              <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-8 font-light">
                {detail.description?.split("\n").map((p, i) => (
                  <p key={i} className="mb-6">
                    {p}
                  </p>
                ))}
              </div>
            </section>

            {/* D. SPECS */}
            <section ref={setSectionRef("specs")}>
              <SectionHeader title="Thông số kỹ thuật" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-2">
                <SpecRow label="Loại hình" value={detail.type?.name} />
                <SpecRow
                  label="Diện tích đất"
                  value={detail.landArea ? `${detail.landArea} m²` : null}
                />
                <SpecRow
                  label="Mặt tiền"
                  value={detail.frontage ? `${detail.frontage} m` : null}
                />
                <SpecRow
                  label="Đường vào"
                  value={detail.roadWidth ? `${detail.roadWidth} m` : null}
                />
                <SpecRow label="Số tầng" value={detail.floors} />
                <SpecRow
                  label="Hướng nhà"
                  value={
                    detail.features?.find((f) => f.key === "direction")?.value
                  }
                />
                {detail.features
                  ?.filter((f) => !["direction", "legal"].includes(f.key))
                  .map((f) => (
                    <SpecRow key={f.id} label={f.key} value={f.value} />
                  ))}
              </div>
              {detail.amenities?.length > 0 && (
                <div className="mt-10">
                  <h4 className="text-sm font-bold uppercase text-slate-400 mb-4 tracking-widest">
                    Tiện ích
                  </h4>
                  <div className="flex flex-wrap gap-x-8 gap-y-3">
                    {detail.amenities.map((a) => (
                      <span
                        key={a.id}
                        className="text-[#0E2038] font-medium flex items-center gap-2"
                      >
                        • {a.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* E. LOCATION */}
            <section ref={setSectionRef("location")}>
              <SectionHeader title="Vị trí" />
              <p className="text-lg text-slate-600 mb-6 flex items-center gap-2">
                <span className="text-red-500">📍</span>
                {detail.address}
              </p>

              <div className="w-full h-[450px] bg-slate-100 rounded-2xl overflow-hidden relative shadow-sm border border-slate-200">
                {detail.latitude && detail.longitude ? (
                  <>
                    {/* 1. Bản đồ tương tác (Iframe) */}
                    <iframe
                      title="Google Map Location"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      scrolling="no"
                      marginHeight="0"
                      marginWidth="0"
                      // z=15: độ zoom, hl=vi: ngôn ngữ tiếng Việt
                      src={`https://maps.google.com/maps?q=${detail.latitude},${detail.longitude}&hl=vi&z=15&output=embed`}
                      className="w-full h-full grayscale-[20%] hover:grayscale-0 transition duration-500"
                    ></iframe>

                    {/* 2. Nút mở sang trang Google Maps (Overlay) */}
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${detail.latitude},${detail.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute bottom-5 left-5 bg-white text-[#0E2038] px-5 py-3 rounded-xl font-bold shadow-lg hover:bg-[#0E2038] hover:text-white transition-all transform hover:-translate-y-1 flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                        />
                      </svg>
                      Mở rộng bản đồ
                    </a>
                  </>
                ) : (
                  // Fallback nếu không có tọa độ
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                    <svg
                      className="w-16 h-16 mb-4 opacity-20"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    <span className="text-sm">Chưa cập nhật tọa độ bản đồ</span>
                  </div>
                )}
              </div>
            </section>

            {/* F. RELATED */}
            {relatedProperties.length > 0 && (
              <section className="pt-16 border-t border-slate-100 mt-8">
                <h3 className="text-2xl font-bold text-[#0E2038] mb-8">
                  Có thể bạn quan tâm
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {relatedProperties.map((p) => (
                    <div key={p.id}>
                      <PropertyCard propertyId={p.id} />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
