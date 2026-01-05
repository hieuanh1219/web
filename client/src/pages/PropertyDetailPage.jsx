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
  <h3 className="text-lg md:text-xl font-bold text-[#0E2038] mb-4 md:mb-6 mt-8 first:mt-0 uppercase tracking-wide border-l-4 border-[#0E2038] pl-3">
    {title}
  </h3>
);

const SpecRow = ({ label, value }) => {
  if (!value) return null;
  return (
    <div className="flex items-baseline justify-between py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 px-2 rounded transition-colors text-sm md:text-base">
      <span className="text-slate-500 font-medium">{label}</span>
      <span className="text-[#0E2038] font-semibold text-right">{value}</span>
    </div>
  );
};

// Form liên hệ component
const ContactForm = () => {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm sticky top-24">
      <div className="mb-4">
        <h3 className="font-bold text-[#0E2038] text-lg uppercase">
          Liên hệ tư vấn
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Nhận thông tin chi tiết về BĐS này
        </p>
      </div>

      <form
        className="flex flex-col gap-3"
        onSubmit={(e) => e.preventDefault()}
      >
        <div>
          <input
            type="text"
            placeholder="Họ và tên"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#0E2038] focus:ring-1 focus:ring-[#0E2038] transition-all"
          />
        </div>
        <div>
          <input
            type="tel"
            placeholder="Số điện thoại"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#0E2038] focus:ring-1 focus:ring-[#0E2038] transition-all"
          />
        </div>
        <div>
          <textarea
            rows={4}
            placeholder="Lời nhắn (Ví dụ: Tôi muốn xem nhà vào cuối tuần này...)"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#0E2038] focus:ring-1 focus:ring-[#0E2038] transition-all resize-none"
          ></textarea>
        </div>

        <button className="w-full py-3 bg-[#0E2038] text-white font-bold rounded-lg hover:bg-slate-800 transition-colors uppercase text-sm tracking-wider mt-2 shadow-lg shadow-[#0E2038]/20">
          Gửi yêu cầu
        </button>
      </form>

      <div className="mt-4 pt-4 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-400">Hoặc liên hệ trực tiếp</p>
        <a
          href="tel:0900000000"
          className="block text-xl font-bold text-[#0E2038] mt-1 hover:text-blue-600 transition-colors"
        >
          0900 000 000
        </a>
      </div>
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
      .slice(0, 5); // Lấy nhiều hơn một chút để demo scroll
  }, [detail]);

  // 2. SCROLL SPY
  const sections = [
    { id: "overview", label: "Tổng quan" },
    { id: "description", label: "Mô tả" },
    { id: "specs", label: "Chi tiết" },
    { id: "gallery", label: "Hình ảnh" },
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
      <div className="h-screen flex items-center justify-center text-[#0E2038] text-sm font-medium">
        Đang tải dữ liệu...
      </div>
    );
  const coverImage =
    detail.coverUrl ||
    "https://images.unsplash.com/photo-1600596542815-2495db9a9cf6?auto=format&fit=crop&q=80";

  return (
    <div className="min-h-screen bg-white font-sans text-slate-700 pb-20 md:pb-32">
      {/* 1. HERO SECTION */}
      <div className="relative w-full h-[25vh] md:h-[60vh]">
        <img
          src={coverImage}
          className="w-full h-full object-cover"
          alt="Cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-white/90 md:to-white"></div>
        <Link
          to="/properties"
          className="absolute top-6 left-5 md:left-12 z-20 text-white flex items-center gap-2 opacity-90 hover:opacity-100 transition shadow-sm"
        >
          <span className="text-lg">←</span>{" "}
          <span className="text-xs font-bold uppercase tracking-widest">
            Quay lại
          </span>
        </Link>
      </div>

      {/* 2. CONTENT BODY */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 relative -mt-20 md:-mt-40 z-10">
        {/* GRID LAYOUT: LEFT (Menu) - CENTER (Content) - RIGHT (Form) */}
        {/* Mobile: 1 col, XL: 12 cols */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* --- LEFT: MENU (Hidden on Mobile/Tablet, Visible on XL Desktop) --- */}
          <aside className="hidden xl:block xl:col-span-2">
            <div className="sticky top-24 pt-4">
              <h4 className="text-xs font-bold uppercase text-slate-400 mb-4 tracking-widest pl-4">
                Mục lục
              </h4>
              <nav className="flex flex-col border-l border-slate-200">
                {sections.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => scrollToSection(s.id)}
                    className={`text-left text-sm py-2 pl-4 border-l-2 -ml-[1px] transition-all duration-300 ${
                      activeSection === s.id
                        ? "border-[#0E2038] text-[#0E2038] font-bold"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* --- CENTER: MAIN CONTENT --- */}
          <main className="xl:col-span-7 flex flex-col gap-10 md:gap-14 pt-2">
            {/* A. HEADLINE */}
            <section ref={setSectionRef("overview")}>
              <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 bg-slate-100 w-fit px-2 py-1 rounded">
                <span>{detail.type?.name}</span>
                <span>•</span>
                <span>
                  {detail.transactionType === "SALE" ? "Đang bán" : "Cho thuê"}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#0E2038] leading-snug mb-4 md:mb-6">
                {detail.title}
              </h1>

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-6 md:pb-8">
                <div className="max-w-xl">
                  <p className="text-sm md:text-lg text-black font-normal leading-relaxed">
                    Địa chỉ: {detail.address}
                  </p>
                </div>

                <div className="flex flex-col md:items-end shrink-0 bg-slate-50 p-4 md:p-0 rounded-lg md:bg-transparent">
                  <span className="text-[10px] md:text-xs font-bold uppercase text-slate-600 mb-1">
                    Mức giá niêm yết
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl md:text-4xl font-bold text-[#0E2038] tracking-tight">
                      {detail.displayPrice
                        ? detail.displayPrice.replace(
                            /(\d+)(tỷ|triệu|vnd)/i,
                            "$1\u00A0$2"
                          )
                        : formatMoneyVND(detail.price)}
                    </span>
                    {detail.priceUnit &&
                      !detail.displayPrice
                        ?.toLowerCase()
                        .includes(detail.priceUnit.toLowerCase()) && (
                        <span className="text-sm md:text-lg text-slate-400 font-medium">
                          {detail.priceUnit}
                        </span>
                      )}
                  </div>
                </div>
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 pt-6">
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
                      <div key={i} className="flex flex-col">
                        <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">
                          {item.label}
                        </p>
                        <p className="text-lg md:text-xl font-bold text-[#0E2038] flex items-center gap-1">
                          {item.val}
                        </p>
                      </div>
                    )
                )}
              </div>
            </section>

            {/* B. DESCRIPTION */}
            <section ref={setSectionRef("description")}>
              <SectionHeader title="MÔ TẢ" />
              <div className="prose prose-base md:prose-lg prose-slate max-w-none text-black leading-7 md:leading-8 font-normal text-justify">
                {detail.description?.split("\n").map((p, i) => (
                  <p key={i} className="mb-4">
                    {p}
                  </p>
                ))}
              </div>
            </section>

            {/* C. SPECS */}
            <section ref={setSectionRef("specs")}>
              <SectionHeader title="Thông số kỹ thuật" />
              <div className="bg-slate-50/50 p-4 md:p-6 rounded-xl border border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
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
              </div>

              {detail.amenities?.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-xs font-bold uppercase text-slate-400 mb-3 tracking-widest">
                    Tiện ích đi kèm
                  </h4>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {detail.amenities.map((a) => (
                      <span
                        key={a.id}
                        className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs md:text-sm text-[#0E2038] font-medium shadow-sm"
                      >
                        {a.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* D. GALLERY */}
            <section ref={setSectionRef("gallery")}>
              <SectionHeader title="Hình ảnh" />
              <div className="flex flex-col gap-6 md:gap-10">
                {detail.images?.map((img, idx) => (
                  <div key={idx} className="w-full group">
                    <img
                      src={img.url}
                      alt={img.alt || `Hình ảnh bất động sản ${idx + 1}`}
                      className="w-full h-auto object-cover rounded-lg shadow-sm md:shadow-md group-hover:shadow-lg transition-shadow duration-300"
                      loading="lazy"
                    />
                    {img.alt && (
                      <p className="prose prose-base md:prose-lg prose-slate max-w-none text-black leading-7 md:leading-8 font-normal text-justify">
                        {img.alt}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* E. LOCATION */}
            <section ref={setSectionRef("location")}>
              <SectionHeader title="Vị trí bản đồ" />
              <div className="w-full h-[350px] md:h-[450px] bg-slate-100 rounded-xl overflow-hidden relative shadow-sm border border-slate-200">
                {detail.latitude && detail.longitude ? (
                  <>
                    <iframe
                      title="Google Map Location"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      scrolling="no"
                      marginHeight="0"
                      marginWidth="0"
                      src={`https://maps.google.com/maps?q=${detail.latitude},${detail.longitude}&hl=vi&z=15&output=embed`}
                      className="w-full h-full"
                    ></iframe>
                    <a
                      href={`https://maps.google.com/maps?q=${detail.latitude},${detail.longitude}`}
                      target="_blank"
                      rel="noreferrer"
                      className="absolute bottom-4 left-4 bg-white/90 backdrop-blur text-[#0E2038] px-4 py-2 rounded-lg font-bold text-sm shadow-md hover:bg-[#0E2038] hover:text-white transition-all flex items-center gap-2"
                    >
                      Mở Google Maps
                    </a>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                    <span className="text-sm">Chưa cập nhật tọa độ bản đồ</span>
                  </div>
                )}
              </div>
            </section>

            {/* F. RELATED */}
            {relatedProperties.length > 0 && (
              <section className="pt-12 border-t border-slate-100 mt-4">
                <h3 className="text-xl font-bold text-[#0E2038] mb-6">
                  Có thể bạn quan tâm
                </h3>

                {/* Desktop: Grid 3 cột. Mobile: Horizontal Scroll (trượt ngang) */}
                <div className="flex overflow-x-auto md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-4 md:pb-0 snap-x snap-mandatory md:snap-none scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                  {relatedProperties.map((p) => (
                    <div
                      key={p.id}
                      className="min-w-[280px] md:min-w-0 snap-center"
                    >
                      <PropertyCard propertyId={p.id} />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>

          {/* --- RIGHT: CONTACT FORM (Desktop Only) --- */}
          <aside className="hidden xl:block xl:col-span-3">
            <ContactForm />
          </aside>

          {/* Mobile Contact Form: Có thể hiển thị ở dưới cùng hoặc sticky bottom nếu cần */}
          <div className="xl:hidden block mt-8">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
