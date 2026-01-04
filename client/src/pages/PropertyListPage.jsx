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

// --- 1. CẤU HÌNH DỮ LIỆU (GIỮ NGUYÊN) ---
const PRICE_RANGES = {
  SALE: [
    { label: "Mức giá", min: 0, max: Infinity }, // Đổi label mặc định ngắn gọn
    { label: "< 2 tỷ", min: 0, max: 2000000000 },
    { label: "2 - 5 tỷ", min: 2000000000, max: 5000000000 },
    { label: "5 - 10 tỷ", min: 5000000000, max: 10000000000 },
    { label: "10 - 20 tỷ", min: 10000000000, max: 20000000000 },
    { label: "> 20 tỷ", min: 20000000000, max: Infinity },
  ],
  RENT: [
    { label: "Mức giá", min: 0, max: Infinity },
    { label: "< 5 triệu", min: 0, max: 5000000 },
    { label: "5 - 15 triệu", min: 5000000, max: 15000000 },
    { label: "> 15 triệu", min: 15000000, max: Infinity },
  ],
  PROJECT: [
    { label: "Mức giá", min: 0, max: Infinity },
    { label: "< 3 tỷ", min: 0, max: 3000000000 },
    { label: "3 - 7 tỷ", min: 3000000000, max: 7000000000 },
    { label: "> 7 tỷ", min: 7000000000, max: Infinity },
  ],
};

const AREA_RANGES = [
  { label: "Diện tích", min: 0, max: Infinity },
  { label: "< 50m²", min: 0, max: 50 },
  { label: "50 - 80m²", min: 50, max: 80 },
  { label: "80 - 150m²", min: 80, max: 150 },
  { label: "> 150m²", min: 150, max: Infinity },
];

const BEDROOM_OPTIONS = [
  { label: "Phòng ngủ", value: "all" },
  { label: "1+", value: 1 },
  { label: "2+", value: 2 },
  { label: "3+", value: 3 },
  { label: "4+", value: 4 },
];

const RENTAL_PERIODS = [
  { label: "Thời hạn", value: "all" },
  { label: "Dài hạn", value: "long_term" },
  { label: "Ngắn hạn", value: "short_term" },
];

// --- ICON COMPONENTS ---
const Icons = {
  Search: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  Filter: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  ),
  ChevronDown: () => (
    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  ),
  Empty: () => (
    <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  ),
};

export default function PropertyListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // --- PARALLAX ANIMATION ---
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const yRange = useTransform(scrollY, [0, 500], [0, 150]);
  const opacityRange = useTransform(scrollY, [0, 400], [1, 0.8]);

  // 1. STATE
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

  // --- LOGIC: URL SYNC (GIỮ NGUYÊN) ---
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
    if (filters.locationId !== "all") params.set("locationId", filters.locationId);
    if (filters.typeId !== "all") params.set("typeId", filters.typeId);
    if (filters.priceRangeIndex > 0) params.set("price", filters.priceRangeIndex);
    if ((activeTab === "SALE" || activeTab === "PROJECT") && filters.areaRangeIndex > 0) {
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

  // --- FILTER LOGIC (GIỮ NGUYÊN) ---
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
        ["type_apartment", "type_shophouse", "type_office", "type_hotel_resort"].includes(t.id)
      );
    if (activeTab === "SALE")
      return allTypes.filter((t) =>
        ["type_townhouse", "type_land", "type_villa", "type_factory", "type_hotel_resort"].includes(t.id)
      );
    return allTypes;
  }, [activeTab]);

  const filteredCards = useMemo(() => {
    return propertyIds
      .filter((id) => {
        const rawProp = MOCK.entities.properties[id];
        if (!rawProp) return false;
        let category = "";
        const hasLandArea = rawProp.landArea && parseFloat(rawProp.landArea) > 0;
        if (rawProp.transactionType === "RENT") category = "RENT";
        else category = hasLandArea ? "SALE" : "PROJECT";
        if (category !== activeTab) return false;

        const searchContent = [
          rawProp.title,
          MOCK.entities.locations[rawProp.locationId]?.name,
          MOCK.entities.propertyTypes[rawProp.typeId]?.name,
        ].join(" ").toLowerCase();

        if (filters.keyword && !searchContent.includes(filters.keyword.toLowerCase())) return false;

        if (filters.locationId !== "all") {
          const propLoc = MOCK.entities.locations[rawProp.locationId];
          const parentLoc = propLoc?.parentId ? MOCK.entities.locations[propLoc.parentId] : null;
          const isMatchSlug = (dbSlug, filterSlug) => {
             if (!dbSlug || !filterSlug) return false;
             if (dbSlug === filterSlug) return true;
             if (filterSlug === "tp-hcm" && dbSlug.includes("ho-chi-minh")) return true;
             return false;
          }
          const matchSelf = isMatchSlug(propLoc?.slug, filters.locationId);
          const matchParent = isMatchSlug(parentLoc?.slug, filters.locationId);
          if (!matchSelf && !matchParent) return false;
        }

        if (filters.typeId !== "all" && rawProp.typeId !== filters.typeId) return false;

        const rawPrice = parseFloat(rawProp.price || 0);
        const pRange = PRICE_RANGES[activeTab][filters.priceRangeIndex];
        if (pRange && (rawPrice < pRange.min || rawPrice >= pRange.max)) return false;

        if (activeTab === "RENT" && filters.rentalPeriod !== "all") {
            const unit = (rawProp.priceUnit || "").toLowerCase();
            const isShortTerm = unit.includes("đêm") || unit.includes("ngày");
            if (filters.rentalPeriod === "short_term" && !isShortTerm) return false;
            if (filters.rentalPeriod === "long_term" && isShortTerm) return false;
        }

        if ((activeTab === "SALE" || activeTab === "PROJECT") && filters.areaRangeIndex > 0) {
          const areaToCheck = hasLandArea ? parseFloat(rawProp.landArea) : parseFloat(rawProp.area);
          const aRange = AREA_RANGES[filters.areaRangeIndex];
          if (aRange && (areaToCheck < aRange.min || areaToCheck >= aRange.max)) return false;
        }

        if (filters.minBedrooms !== "all") {
          const beds = rawProp.bedrooms || 0;
          if (beds < Number(filters.minBedrooms)) return false;
        }
        return true;
      })
      .map((id) => selectPropertyCard(id));
  }, [propertyIds, activeTab, filters]);

  // --- NEW UI COMPONENTS (Compact & Sharp) ---

  const TabButton = ({ id, label, current }) => (
    <button
      onClick={() => handleTabChange(id)}
      className={`px-4 py-2 text-sm font-semibold transition-all relative ${
        current === id
          ? "text-[#0E2038]"
          : "text-slate-400 hover:text-slate-600"
      }`}
    >
      {label}
      {current === id && (
        <motion.div
          layoutId="activeTabUnderline"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0E2038]"
        />
      )}
    </button>
  );

  // New Compact Select: Look like a standard input, no big icons
  const CompactSelect = ({
    value,
    onChange,
    options,
    defaultLabel = "Tất cả",
  }) => (
    <div className="relative w-full group">
      <select
        value={value === 0 ? "all" : value}
        onChange={onChange}
        className="w-full appearance-none bg-white border border-slate-300 text-slate-700 text-xs md:text-sm font-medium py-2 pl-3 pr-8 rounded-md focus:outline-none focus:border-[#0E2038] focus:ring-1 focus:ring-[#0E2038] transition-all cursor-pointer truncate"
      >
        <option value="all">{defaultLabel}</option>
        {options.map((opt, i) => {
            const val = opt.value ?? opt.id;
            if (val === "all" || val === 0) return null;
            return <option key={val ?? i} value={val}>{opt.label || opt.name}</option>;
        })}
      </select>
      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <Icons.ChevronDown />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans" ref={containerRef}>
      {/* --- HERO SECTION --- */}
      {/* Giảm chiều cao thêm chút nữa để tập trung vào list */}
      <div className="relative h-[350px] md:h-[500px] w-full overflow-hidden">
        <motion.div
          style={{ y: yRange, opacity: opacityRange }}
          className="absolute inset-0"
        >
          <img
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2670&auto=format&fit=crop"
            alt="Real Estate Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/40" />
        </motion.div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center pb-10 z-20 px-4">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-4 tracking-tight drop-shadow-md text-center">
            {activeTab === "PROJECT" && "Dự Án Nổi Bật"}
            {activeTab === "SALE" && "Mua Bán Nhà Đất"}
            {activeTab === "RENT" && "Thuê Bất Động Sản"}
          </h1>
          <p className="text-white/90 text-sm md:text-lg font-medium text-center max-w-xl drop-shadow-sm">
             Tìm kiếm không gian sống lý tưởng của bạn
          </p>
        </div>
      </div>

      {/* --- COMPACT FLOATING FILTER BAR --- */}
      {/* Thay đổi: Gọn gàng hơn, ít bo góc, Search lên trên */}
      <div className="max-w-4xl mx-auto px-4 relative z-30 -mt-24 md:-mt-28">
        
        {/* TAB SWITCHER: Đặt ngay trên hộp bộ lọc */}
        <div className="flex justify-center ">
            <div className="bg-white/90 backdrop-blur-md rounded-t-lg px-2 flex shadow-sm border-t border-x border-white/50">
                <TabButton id="PROJECT" label="Dự Án" current={activeTab} />
                <TabButton id="SALE" label="Mua Bán" current={activeTab} />
                <TabButton id="RENT" label="Cho Thuê" current={activeTab} />
            </div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg border border-slate-100 p-4 md:p-6"
        >
            {/* ROW 1: KEYWORD SEARCH (Full width) */}
            <div className="relative mb-4 md:mb-5">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Icons.Search />
                </div>
                <input 
                    type="text"
                    value={filters.keyword}
                    onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                    placeholder={ activeTab === "PROJECT" ? "Nhập tên dự án, chủ đầu tư..." : "Nhập địa chỉ, tên đường, khu vực..."}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-md text-sm md:text-base font-medium focus:outline-none focus:bg-white focus:border-[#0E2038] focus:ring-1 focus:ring-[#0E2038] transition-all placeholder-slate-400"
                />
            </div>

            {/* ROW 2: FILTERS GRID & BUTTON */}
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Grid Filters: Mobile 2 cột, Desktop dàn ngang */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 w-full">
                    <CompactSelect 
                        value={filters.locationId}
                        onChange={(e) => setFilters({...filters, locationId: e.target.value})}
                        options={locations}
                        defaultLabel="Khu vực"
                    />
                    <CompactSelect 
                        value={filters.typeId}
                        onChange={(e) => setFilters({...filters, typeId: e.target.value})}
                        options={visiblePropertyTypes}
                        defaultLabel="Loại hình"
                    />
                    <CompactSelect 
                        value={filters.priceRangeIndex}
                        onChange={(e) => setFilters({...filters, priceRangeIndex: e.target.value === "all" ? 0 : Number(e.target.value)})}
                        options={PRICE_RANGES[activeTab]}
                        defaultLabel="Mức giá"
                    />
                    
                    {/* Dynamic Field 1 */}
                    {(activeTab === "SALE" || activeTab === "PROJECT") ? (
                        <CompactSelect 
                             value={filters.areaRangeIndex}
                             onChange={(e) => setFilters({...filters, areaRangeIndex: e.target.value === "all" ? 0 : Number(e.target.value)})}
                             options={AREA_RANGES}
                             defaultLabel="Diện tích"
                        />
                    ) : (
                        <CompactSelect 
                            value={filters.rentalPeriod}
                            onChange={(e) => setFilters({...filters, rentalPeriod: e.target.value})}
                            options={RENTAL_PERIODS}
                            defaultLabel="Thời hạn"
                        />
                    )}

                    {/* Dynamic Field 2 */}
                    <div className="col-span-2 md:col-span-1"> {/* Trên mobile cho field cuối full width hàng nếu lẻ */}
                         <CompactSelect 
                            value={filters.minBedrooms}
                            onChange={(e) => setFilters({...filters, minBedrooms: e.target.value})}
                            options={BEDROOM_OPTIONS}
                            defaultLabel="Phòng ngủ"
                        />
                    </div>
                </div>

                {/* Search Button */}
                <button
                    onClick={handleSearchAction}
                    className="shrink-0 bg-[#0E2038] hover:bg-slate-800 text-white text-sm font-bold px-6 py-2.5 rounded-md shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 h-[40px] lg:h-auto mt-1 lg:mt-0"
                >
                    <Icons.Filter />
                    <span>Lọc</span>
                </button>
            </div>
        </motion.div>
      </div>

      {/* --- RESULTS LIST --- */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-[#0E2038]">
             Kết quả ({filteredCards.length})
          </h2>
          <div className="flex items-center gap-3">
             <span className="text-sm text-slate-500">Sắp xếp:</span>
             <select className="bg-transparent text-sm font-semibold text-[#0E2038] focus:outline-none cursor-pointer border-b border-slate-200 pb-1">
                <option>Mới nhất</option>
                <option>Giá thấp - cao</option>
                <option>Giá cao - thấp</option>
             </select>
          </div>
        </div>

        <div className="min-h-[300px]">
          <AnimatePresence mode="wait">
            {filteredCards.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-center py-16 bg-white border border-slate-200 rounded-lg"
              >
                <div className="text-slate-300 mb-4 flex justify-center"><Icons.Empty /></div>
                <p className="text-slate-500 font-medium">Không tìm thấy kết quả phù hợp.</p>
                <button onClick={() => handleTabChange(activeTab)} className="mt-4 text-sm font-bold text-[#0E2038] hover:underline">
                  Xóa bộ lọc
                </button>
              </motion.div>
            ) : (
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCards.map((c, i) => (
                  <motion.div
                    key={c.id} layout
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.3 }}
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