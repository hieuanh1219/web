// src/pages/PropertyListPage.jsx
import React, { useMemo, useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import PropertyCard from "../components/PropertyCard";
import { MOCK, selectPropertyCard } from "../hook/data";
import TINH_THANH from "../hook/datatinhthanh";

// --- 1. CẤU HÌNH DỮ LIỆU ---
const PRICE_RANGES = {
  SALE: [
    { label: "Tất cả mức giá", min: 0, max: Infinity },
    { label: "Dưới 2 tỷ", min: 0, max: 2000000000 },
    { label: "2 - 5 tỷ", min: 2000000000, max: 5000000000 },
    { label: "5 - 10 tỷ", min: 5000000000, max: 10000000000 },
    { label: "10 - 20 tỷ", min: 10000000000, max: 20000000000 },
    { label: "Trên 20 tỷ", min: 20000000000, max: Infinity },
  ],
  RENT: [
    { label: "Tất cả mức giá", min: 0, max: Infinity },
    { label: "Dưới 5 triệu", min: 0, max: 5000000 },
    { label: "5 - 15 triệu", min: 5000000, max: 15000000 },
    { label: "Trên 15 triệu", min: 15000000, max: Infinity },
  ],
  PROJECT: [
    { label: "Tất cả mức giá", min: 0, max: Infinity },
    { label: "Dưới 3 tỷ", min: 0, max: 3000000000 },
    { label: "3 - 7 tỷ", min: 3000000000, max: 7000000000 },
    { label: "Trên 7 tỷ", min: 7000000000, max: Infinity },
  ],
};

const AREA_RANGES = [
  { label: "Tất cả diện tích", min: 0, max: Infinity },
  { label: "Dưới 50m²", min: 0, max: 50 },
  { label: "50 - 80m²", min: 50, max: 80 },
  { label: "80 - 150m²", min: 80, max: 150 },
  { label: "Trên 150m²", min: 150, max: Infinity },
];

const BEDROOM_OPTIONS = [
  { label: "Tất cả", value: "all" },
  { label: "1+ phòng ngủ", value: 1 },
  { label: "2+ phòng ngủ", value: 2 },
  { label: "3+ phòng ngủ", value: 3 },
  { label: "4+ phòng ngủ", value: 4 },
];

const RENTAL_PERIODS = [
  { label: "Tất cả", value: "all" },
  { label: "Dài hạn (Tháng/Năm)", value: "long_term" },
  { label: "Ngắn hạn (Ngày/Đêm)", value: "short_term" },
];

// --- ICON COMPONENTS (GIỮ NGUYÊN) ---
const Icons = {
  Search: () => (
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
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
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
  Home: () => (
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
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  ),
  Dollar: () => (
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
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  Filter: () => (
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
        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
      />
    </svg>
  ),
  Calendar: () => (
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
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
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
        strokeWidth={2}
        d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
      />
    </svg>
  ),
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
        strokeWidth={2}
        d="M21 7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.293.293a1 1 0 001.414 0L10 18.414l1.293 1.293a1 1 0 001.414 0L14 18.414l1.293 1.293a1 1 0 001.414 0L18 20v-5h2a2 2 0 002-2V7z"
      />
    </svg>
  ),
  ChevronDown: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  ),
  Empty: () => (
    <svg
      className="w-16 h-16"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
      />
    </svg>
  ),
};

export default function PropertyListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // --- PARALLAX ANIMATION SETUP ---
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  // Background di chuyển chậm hơn tốc độ cuộn (parallax)
  const yRange = useTransform(scrollY, [0, 500], [0, 150]);
  const opacityRange = useTransform(scrollY, [0, 400], [1, 0.8]);

  // 1. STATE QUẢN LÝ
  const [activeTab, setActiveTab] = useState("PROJECT");
  const [filters, setFilters] = useState({
    keyword: "",
    locationId: "all",
    typeId: "all",
    priceRangeIndex: 0,
    areaRangeIndex: 0,
    minBedrooms: "all",
    rentalPeriod: "all",
  });

  // --- LOGIC: ĐỒNG BỘ URL & LỌC DỮ LIỆU (GIỮ NGUYÊN) ---
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["SALE", "RENT", "PROJECT"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
    const keywordParam = searchParams.get("keyword");
    const locationParam = searchParams.get("locationId");
    const typeParam = searchParams.get("typeId");
    const priceParam = searchParams.get("price");
    const areaParam = searchParams.get("area");
    const periodParam = searchParams.get("period");
    const bedsParam = searchParams.get("beds");

    setFilters({
      keyword: keywordParam || "",
      locationId: locationParam || "all",
      typeId: typeParam || "all",
      priceRangeIndex: priceParam ? Number(priceParam) : 0,
      areaRangeIndex: areaParam ? Number(areaParam) : 0,
      rentalPeriod: periodParam || "all",
      minBedrooms: bedsParam || "all",
    });
  }, [searchParams]);

  const handleSearchAction = () => {
    const params = new URLSearchParams();
    params.set("tab", activeTab);
    if (filters.keyword) params.set("keyword", filters.keyword);
    if (filters.locationId !== "all")
      params.set("locationId", filters.locationId);
    if (filters.typeId !== "all") params.set("typeId", filters.typeId);
    if (filters.priceRangeIndex > 0)
      params.set("price", filters.priceRangeIndex);
    if (
      (activeTab === "SALE" || activeTab === "PROJECT") &&
      filters.areaRangeIndex > 0
    ) {
      params.set("area", filters.areaRangeIndex);
    }
    if (activeTab === "RENT" && filters.rentalPeriod !== "all") {
      params.set("period", filters.rentalPeriod);
    }
    if (filters.minBedrooms !== "all") {
      params.set("beds", filters.minBedrooms);
    }
    setSearchParams(params);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFilters({
      keyword: "",
      locationId: "all",
      typeId: "all",
      priceRangeIndex: 0,
      areaRangeIndex: 0,
      minBedrooms: "all",
      rentalPeriod: "all",
    });
    setSearchParams({ tab: tab });
  };

  // --- LẤY DỮ LIỆU & FILTER (GIỮ NGUYÊN) ---
  const propertyIds = useMemo(() => {
    return MOCK.listing && MOCK.listing.length > 0
      ? MOCK.listing
      : MOCK.entities?.properties
      ? Object.keys(MOCK.entities.properties)
      : [];
  }, []);
  const locations = TINH_THANH;
  const visiblePropertyTypes = useMemo(() => {
    const allTypes = Object.values(MOCK.entities.propertyTypes);
    if (activeTab === "PROJECT")
      return allTypes.filter((t) =>
        [
          "type_apartment",
          "type_shophouse",
          "type_office",
          "type_hotel_resort",
        ].includes(t.id)
      );
    if (activeTab === "SALE")
      return allTypes.filter((t) =>
        [
          "type_townhouse",
          "type_land",
          "type_villa",
          "type_factory",
          "type_hotel_resort",
        ].includes(t.id)
      );
    return allTypes;
  }, [activeTab]);

  const filteredCards = useMemo(() => {
    return propertyIds
      .filter((id) => {
        const rawProp = MOCK.entities.properties[id];
        if (!rawProp) return false;
        let category = "";
        const hasLandArea =
          rawProp.landArea && parseFloat(rawProp.landArea) > 0;
        if (rawProp.transactionType === "RENT") category = "RENT";
        else category = hasLandArea ? "SALE" : "PROJECT";
        if (category !== activeTab) return false;

        const searchContent = [
          rawProp.title,
          MOCK.entities.locations[rawProp.locationId]?.name,
          MOCK.entities.propertyTypes[rawProp.typeId]?.name,
        ]
          .join(" ")
          .toLowerCase();
        if (
          filters.keyword &&
          !searchContent.includes(filters.keyword.toLowerCase())
        )
          return false;

        if (filters.locationId !== "all") {
          const propLoc = MOCK.entities.locations[rawProp.locationId];
          const parentLoc = propLoc?.parentId
            ? MOCK.entities.locations[propLoc.parentId]
            : null;
          const isMatchSlug = (dbSlug, filterSlug) => {
            if (!dbSlug || !filterSlug) return false;
            if (dbSlug === filterSlug) return true;
            if (filterSlug === "tp-hcm" && dbSlug.includes("ho-chi-minh"))
              return true;
            return false;
          };
          const matchSelf = isMatchSlug(propLoc?.slug, filters.locationId);
          const matchParent = isMatchSlug(parentLoc?.slug, filters.locationId);
          if (!matchSelf && !matchParent) return false;
        }
        if (filters.typeId !== "all" && rawProp.typeId !== filters.typeId)
          return false;

        const rawPrice = parseFloat(rawProp.price || 0);
        const pRange = PRICE_RANGES[activeTab][filters.priceRangeIndex];
        if (pRange && (rawPrice < pRange.min || rawPrice >= pRange.max))
          return false;

        if (activeTab === "RENT" && filters.rentalPeriod !== "all") {
          const unit = (rawProp.priceUnit || "").toLowerCase();
          const isShortTerm = unit.includes("đêm") || unit.includes("ngày");
          if (filters.rentalPeriod === "short_term" && !isShortTerm)
            return false;
          if (filters.rentalPeriod === "long_term" && isShortTerm) return false;
        }

        if (
          (activeTab === "SALE" || activeTab === "PROJECT") &&
          filters.areaRangeIndex > 0
        ) {
          const areaToCheck = hasLandArea
            ? parseFloat(rawProp.landArea)
            : parseFloat(rawProp.area);
          const aRange = AREA_RANGES[filters.areaRangeIndex];
          if (aRange && (areaToCheck < aRange.min || areaToCheck >= aRange.max))
            return false;
        }

        if (filters.minBedrooms !== "all") {
          const beds = rawProp.bedrooms || 0;
          if (beds < Number(filters.minBedrooms)) return false;
        }
        return true;
      })
      .map((id) => selectPropertyCard(id));
  }, [propertyIds, activeTab, filters]);

  // --- UI COMPONENTS HELPER ---
  const TabButton = ({ id, label, current }) => (
    <button
      onClick={() => handleTabChange(id)}
      className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 relative overflow-hidden ${
        current === id
          ? "text-white shadow-lg"
          : "text-slate-600 hover:text-[#0E2038] hover:bg-white/60"
      }`}
    >
      {current === id && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-[#0E2038] rounded-full"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      <span className="relative z-10 tracking-wide">{label}</span>
    </button>
  );

  const CustomSelect = ({
    icon: Icon,
    value,
    onChange,
    options,
    label,
    defaultLabel = "Tất cả",
  }) => (
    <div className="relative group w-full transition-all duration-200">
      <div className="absolute left-0 top-3 text-slate-400 group-focus-within:text-[#0E2038] transition-colors">
        <Icon />
      </div>
      <div className="pl-9 w-full">
        <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-0.5 group-focus-within:text-blue-600 transition-colors">
          {label}
        </label>
        <div className="relative">
          <select
            value={value === 0 ? "all" : value}
            onChange={onChange}
            className="w-full bg-transparent text-[#0E2038] font-bold py-1 pr-8 focus:outline-none cursor-pointer appearance-none truncate border-b border-transparent group-focus-within:border-blue-100 transition-all"
          >
            <option value="all">{defaultLabel}</option>
            {options.map((opt, i) => {
              const val = opt.value ?? opt.id;
              if (val === "all" || val === 0) return null;
              return (
                <option key={val ?? i} value={val}>
                  {opt.label || opt.name}
                </option>
              );
            })}
          </select>
          <div className="absolute right-0 top-1.5 pointer-events-none text-slate-400 group-hover:text-[#0E2038] transition-colors">
            <Icons.ChevronDown />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans" ref={containerRef}>
      {/* --- HERO SECTION WITH PARALLAX & CURVE --- */}
      {/* UPDATE: Chiều cao responsive: 450px cho mobile, 600px cho desktop */}
      <div className="relative h-[450px] md:h-[600px] w-full overflow-hidden">
        {/* 1. Background Image w/ Parallax */}
        <motion.div
          style={{ y: yRange, opacity: opacityRange }}
          className="absolute inset-0"
        >
          <img
            src="https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2700&auto=format&fit=crop"
            alt="Real Estate Cover"
            className="w-full h-full object-cover"
          />

          {/* Lớp phủ tối để làm nổi text (Contrast Overlay) */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/30 to-slate-900/60" />
        </motion.div>

        {/* 2. (NEW) LỚP PHỦ GRADIENT NỐI NỀN */}
        {/* Đây là lớp giúp ảnh hòa vào nền slate-50 bên dưới. 
            Mobile cao 120px (h-32), Desktop cao 192px (h-48) */}
        <div className="absolute bottom-0 left-0 w-full h-32 md:h-48 bg-gradient-to-t from-slate-50 via-slate-50/70 to-transparent z-10 pointer-events-none" />

        {/* 3. Content Centered */}
        {/* UPDATE: z-index tăng lên 20 để nổi trên lớp gradient nối */}
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4 pb-20 md:pb-28 z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] md:text-xs font-bold tracking-widest uppercase mb-3 md:mb-4"
            >
              Real Estate Platform
            </motion.span>

            {/* UPDATE: Font size responsive */}
            <h1 className="text-3xl md:text-6xl font-black text-white mb-4 md:mb-6 tracking-tight leading-tight drop-shadow-lg">
              {activeTab === "PROJECT" && "Kiến Tạo Cuộc Sống Mới"}
              {activeTab === "SALE" && "Tìm Kiếm Ngôi Nhà Mơ Ước"}
              {activeTab === "RENT" && "Trải Nghiệm Sống Đẳng Cấp"}
            </h1>

            <p className="text-slate-100 text-sm md:text-xl font-medium max-w-xs md:max-w-2xl mx-auto drop-shadow-md leading-relaxed opacity-90">
              {activeTab === "PROJECT"
                ? "Khám phá các dự án bất động sản tiềm năng với cơ hội đầu tư sinh lời vượt trội."
                : activeTab === "SALE"
                ? "Kết nối trực tiếp với hàng ngàn chủ nhà và môi giới uy tín trên toàn quốc."
                : "Hệ thống tìm kiếm thông minh giúp bạn tìm thuê căn hộ ưng ý chỉ trong vài phút."}
            </p>
          </motion.div>
        </div>
      </div>

      {/* --- FLOATING FILTER BAR --- */}
      {/* UPDATE: Margin top âm điều chỉnh lại cho mobile (-mt-16) và desktop (-mt-32) */}
      <div className="max-w-7xl mx-auto px-4 relative z-30 -mt-16 md:-mt-32">
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/90 backdrop-blur-xl rounded-[24px] md:rounded-[32px] shadow-[0_25px_50px_-12px_rgba(14,32,56,0.15)] p-5 md:p-8 border border-white/60"
        >
          {/* TABS SWITCHER */}
          <div className="flex justify-center mb-6 md:mb-8 overflow-x-auto scrollbar-hide">
            <div className="bg-slate-100 p-1 md:p-1.5 rounded-full inline-flex shadow-inner whitespace-nowrap">
              <TabButton id="PROJECT" label="Dự Án" current={activeTab} />
              <TabButton id="SALE" label="Nhà" current={activeTab} />
              <TabButton id="RENT" label="Cho Thuê" current={activeTab} />
            </div>
          </div>

          {/* INPUTS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-12 gap-y-6 md:gap-x-8 lg:gap-x-0 lg:divide-x divide-slate-200">
            {/* 1. Keyword */}
            <div className="lg:col-span-3 lg:pr-8 py-1">
              <div className="flex items-center gap-3 md:gap-4 h-full group">
                <div className="text-slate-400 group-focus-within:text-[#0E2038] transition-colors shrink-0">
                  <Icons.Search />
                </div>
                <div className="w-full">
                  <label className="block text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-0.5 group-focus-within:text-blue-600 transition-colors">
                    Tìm kiếm
                  </label>
                  <input
                    type="text"
                    placeholder={
                      activeTab === "PROJECT"
                        ? "Tên dự án..."
                        : "Địa chỉ, đường..."
                    }
                    value={filters.keyword}
                    onChange={(e) =>
                      setFilters({ ...filters, keyword: e.target.value })
                    }
                    className="w-full bg-transparent font-bold text-[#0E2038] text-sm md:text-base placeholder-slate-300 focus:outline-none border-b border-transparent group-focus-within:border-blue-100 transition-all py-1 truncate"
                  />
                </div>
              </div>
            </div>

            {/* 2. Select Groups - Mobile Layout optimization */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-none md:gap-0 md:contents">
              <div className="lg:col-span-2 lg:px-8 py-1">
                <CustomSelect
                  icon={Icons.Location}
                  label="Khu vực"
                  value={filters.locationId}
                  onChange={(e) =>
                    setFilters({ ...filters, locationId: e.target.value })
                  }
                  options={locations}
                />
              </div>
              <div className="lg:col-span-2 lg:px-8 py-1">
                <CustomSelect
                  icon={Icons.Home}
                  label="Loại hình"
                  value={filters.typeId}
                  onChange={(e) =>
                    setFilters({ ...filters, typeId: e.target.value })
                  }
                  options={visiblePropertyTypes}
                />
              </div>
            </div>

            <div className="lg:col-span-2 lg:px-8 py-1">
              <CustomSelect
                icon={Icons.Dollar}
                label="Mức giá"
                value={filters.priceRangeIndex}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    priceRangeIndex:
                      e.target.value === "all" ? 0 : Number(e.target.value),
                  })
                }
                options={PRICE_RANGES[activeTab].map((r, i) => ({
                  value: i,
                  label: r.label,
                }))}
              />
            </div>

            {/* 3. Dynamic Fields */}
            <div className="lg:col-span-3 lg:pl-8 py-1 flex gap-4 md:gap-6">
              <div className="w-1/2">
                {activeTab === "SALE" || activeTab === "PROJECT" ? (
                  <CustomSelect
                    icon={Icons.Area}
                    label="Diện tích"
                    value={filters.areaRangeIndex}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        areaRangeIndex:
                          e.target.value === "all" ? 0 : Number(e.target.value),
                      })
                    }
                    options={AREA_RANGES.map((r, i) => ({
                      value: i,
                      label: r.label,
                    }))}
                  />
                ) : (
                  <CustomSelect
                    icon={Icons.Calendar}
                    label="Thời hạn"
                    value={filters.rentalPeriod}
                    onChange={(e) =>
                      setFilters({ ...filters, rentalPeriod: e.target.value })
                    }
                    options={RENTAL_PERIODS}
                  />
                )}
              </div>
              <div className="w-1/2">
                <CustomSelect
                  icon={Icons.Bed}
                  label="Phòng ngủ"
                  value={filters.minBedrooms}
                  onChange={(e) =>
                    setFilters({ ...filters, minBedrooms: e.target.value })
                  }
                  options={BEDROOM_OPTIONS}
                />
              </div>
            </div>
          </div>

          {/* SEARCH BUTTON */}
          <div className="mt-6 md:mt-8 flex justify-end">
            <button
              onClick={handleSearchAction}
              className="w-full md:w-auto bg-[#0E2038] hover:bg-blue-900 text-white px-8 py-3.5 md:px-10 md:py-4 rounded-xl md:rounded-2xl font-bold text-sm shadow-xl shadow-[#0E2038]/20 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 group"
            >
              <Icons.Filter />
              <span>CẬP NHẬT KẾT QUẢ</span>
              <div className="w-2 h-2 rounded-full bg-blue-400 group-hover:animate-ping" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* --- RESULTS LIST --- */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-10 gap-4">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-[#0E2038] flex items-center gap-3 md:gap-4"
          >
            Kết quả tìm kiếm
            <span className="bg-blue-100 text-blue-800 text-sm md:text-base py-1 px-3 md:px-4 rounded-full font-bold">
              {filteredCards.length}
            </span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <select className="w-full md:w-auto bg-white border border-slate-200 text-sm font-semibold px-4 py-2.5 md:px-5 md:py-3 rounded-lg md:rounded-xl focus:outline-none cursor-pointer hover:border-blue-400 transition-colors shadow-sm">
              <option>Mới nhất</option>
              <option>Giá thấp - cao</option>
              <option>Giá cao - thấp</option>
            </select>
          </motion.div>
        </div>

        {/* ... (Phần hiển thị grid kết quả giữ nguyên, chỉ chỉnh gap nhỏ nếu cần) ... */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {filteredCards.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-20 md:py-32 bg-white rounded-[24px] md:rounded-[32px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center mx-auto"
              >
                <div className="text-slate-200 mb-6 bg-slate-50 p-6 rounded-full">
                  <Icons.Empty />
                </div>
                <h3 className="text-xl font-bold text-[#0E2038] mb-2">
                  Không có kết quả phù hợp
                </h3>
                <p className="text-slate-400 max-w-sm mx-auto px-4">
                  Vui lòng thử lại với từ khóa khác hoặc điều chỉnh bộ lọc.
                </p>
                <button
                  onClick={() => handleTabChange(activeTab)}
                  className="mt-6 md:mt-8 text-sm font-bold text-[#0E2038] underline decoration-2 underline-offset-4 hover:text-blue-600 transition-colors"
                >
                  Xóa toàn bộ bộ lọc
                </button>
              </motion.div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
              >
                {filteredCards.map((c, i) => (
                  <motion.div
                    key={c.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                  >
                    <PropertyCard propertyId={c.id} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
