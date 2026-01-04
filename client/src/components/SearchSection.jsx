// src/components/SearchSection.jsx
import React, { useMemo, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MOCK } from "../hook/data";
import TINH_THANH from "../hook/datatinhthanh";
import {
  Search,
  MapPin,
  Building2,
  Wallet,
  ChevronDown,
  RotateCcw,
  Home,
  Key,
  Building,
  ArrowRight,
  ScanLine,
  CalendarDays,
  Filter,
  X,
} from "lucide-react";

/* --- 1. CONFIG DATA --- */
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

const RENTAL_PERIODS = [
  { label: "Tất cả", value: "all" },
  { label: "Dài hạn (Tháng/Năm)", value: "long_term" },
  { label: "Ngắn hạn (Ngày/Đêm)", value: "short_term" },
];

/* =========================
   HELPERS
========================= */
const normalize = (s = "") =>
  s
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const isProjectByFE = (p) => !p?.landArea || parseFloat(p.landArea) === 0;

const matchPropertyToTab = (p, tab) => {
  if (!p) return false;
  if (tab === "SALE") return p.transactionType === "SALE";
  if (tab === "RENT") return p.transactionType === "RENT";
  if (tab === "PROJECT") return isProjectByFE(p);
  return true;
};

export default function SearchSection() {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => setIsLoaded(true), []);

  const [activeTab, setActiveTab] = useState("PROJECT");
  const [filters, setFilters] = useState({
    keyword: "",
    locationId: "all",
    typeId: "all",
    priceRangeIndex: 0,
    areaRangeIndex: 0,
    rentalPeriod: "all",
  });

  // LOGIC LỌC TYPE
  const visiblePropertyTypes = useMemo(() => {
    const allTypes = Object.values(MOCK.entities.propertyTypes);
    if (activeTab === "PROJECT") {
      return allTypes.filter((t) =>
        [
          "type_apartment",
          "type_shophouse",
          "type_office",
          "type_hotel_resort",
        ].includes(t.id)
      );
    }
    if (activeTab === "SALE") {
      return allTypes.filter((t) =>
        [
          "type_townhouse",
          "type_land",
          "type_villa",
          "type_factory",
          "type_hotel_resort",
        ].includes(t.id)
      );
    }
    return allTypes;
  }, [activeTab]);

  // HANDLERS
  const handleSearch = (e) => {
    e?.preventDefault();
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
    navigate(`/properties?${params.toString()}`);
  };

  const handleReset = () => {
    setFilters({
      keyword: "",
      locationId: "all",
      typeId: "all",
      priceRangeIndex: 0,
      areaRangeIndex: 0,
      rentalPeriod: "all",
    });
  };

  /* --- LOGIC AUTOCOMPLETE --- */
  const [showSuggest, setShowSuggest] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const suggestWrapRef = useRef(null);

  useEffect(() => {
    const onDown = (e) => {
      if (!suggestWrapRef.current) return;
      if (!suggestWrapRef.current.contains(e.target)) {
        setShowSuggest(false);
        setHighlightIndex(-1);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const searchIndex = useMemo(() => {
    const e = MOCK.entities;
    const tagsByProp = (e.propertyTags || []).reduce((acc, x) => {
      (acc[x.propertyId] ||= []).push(e.tags?.[x.tagId]?.name);
      return acc;
    }, {});
    const amenitiesByProp = (e.propertyAmenities || []).reduce((acc, x) => {
      (acc[x.propertyId] ||= []).push(e.amenities?.[x.amenityId]?.name);
      return acc;
    }, {});
    const featuresByProp = Object.values(e.propertyFeatures || {}).reduce(
      (acc, x) => {
        (acc[x.propertyId] ||= []).push(x.value);
        return acc;
      },
      {}
    );
    return { tagsByProp, amenitiesByProp, featuresByProp };
  }, []);

  const propertySuggestions = useMemo(() => {
    const q = normalize(filters.keyword);
    if (!q) return [];
    const e = MOCK.entities;
    const props = Object.values(e.properties || {}).filter((p) => {
      if (!matchPropertyToTab(p, activeTab)) return false;
      if (filters.locationId !== "all" && p.locationId !== filters.locationId)
        return false;
      if (filters.typeId !== "all" && p.typeId !== filters.typeId) return false;
      return true;
    });

    const list = props
      .map((p) => {
        const locationName = e.locations?.[p.locationId]?.name || "";
        const typeName = e.propertyTypes?.[p.typeId]?.name || "";
        const tags = (searchIndex.tagsByProp[p.id] || []).filter(Boolean);
        const amenities = (searchIndex.amenitiesByProp[p.id] || []).filter(
          Boolean
        );
        const features = (searchIndex.featuresByProp[p.id] || []).filter(
          Boolean
        );
        const blob = [
          p.title,
          p.address,
          locationName,
          typeName,
          p.displayPrice,
          ...tags,
          ...amenities,
          ...features,
        ]
          .filter(Boolean)
          .join(" | ");
        const n = normalize(blob);
        if (!n.includes(q)) return null;
        const titleN = normalize(p.title);
        const score =
          (titleN.startsWith(q) ? 60 : 0) +
          (titleN.includes(q) ? 25 : 0) +
          (normalize(p.address).includes(q) ? 10 : 0);
        return {
          id: p.id,
          slug: p.slug,
          title: p.title,
          address: p.address,
          coverUrl: p.coverUrl,
          displayPrice: p.displayPrice,
          locationName,
          typeName,
          score,
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
    return list;
  }, [
    filters.keyword,
    filters.locationId,
    filters.typeId,
    activeTab,
    searchIndex,
  ]);

  const pickSuggestion = (sug) => {
    setFilters((prev) => ({ ...prev, keyword: sug.title }));
    setShowSuggest(false);
    setHighlightIndex(-1);
    navigate(`/properties/${sug.slug}`);
  };

  /* --- UI COMPONENTS --- */
  const CustomSelect = ({
    icon: Icon,
    label,
    value,
    onChange,
    options,
    defaultLabel = "Tất cả",
  }) => (
    <div className="relative w-full group">
      <div className="flex flex-col h-[60px] md:h-[72px] justify-center px-4 md:px-5 rounded-xl border border-white/10 bg-black/20 backdrop-blur-md transition-all duration-300 hover:bg-black/40 hover:border-amber-400/30 group-focus-within:bg-black/50 group-focus-within:border-amber-400 group-focus-within:ring-1 group-focus-within:ring-amber-400/50">
        <div className="flex items-center gap-3">
          <Icon
            size={18}
            className="text-slate-400 group-focus-within:text-amber-400 transition-colors duration-300 flex-shrink-0"
            strokeWidth={1.5}
          />
          <div className="flex-1 overflow-hidden">
            <span className="block text-[10px] md:text-[11px] uppercase font-bold text-slate-400 tracking-wider mb-0.5 group-focus-within:text-amber-400 transition-colors">
              {label}
            </span>
            <div className="relative">
              <select
                value={value === 0 ? "all" : value}
                onChange={onChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              >
                <option value="all">{defaultLabel}</option>
                {options.map((opt, idx) => {
                  const val = opt.value ?? opt.id ?? idx;
                  if (val === "all" || val === 0) return null;
                  return (
                    <option key={val} value={val} className="text-slate-900">
                      {opt.label || opt.name}
                    </option>
                  );
                })}
              </select>
              <div className="text-white text-sm md:text-[15px] font-medium truncate pr-4 leading-tight">
                {(() => {
                  if (value === "all" || value === 0) return defaultLabel;
                  if (typeof value === "number") {
                    const found = options.find(
                      (o, idx) => idx === value || o.value === value
                    );
                    return found ? found.label || found.name : defaultLabel;
                  }
                  const found = options.find(
                    (o) => o.value === value || o.id === value
                  );
                  return found ? found.label || found.name : defaultLabel;
                })()}
              </div>
            </div>
          </div>
          <ChevronDown
            size={14}
            className="text-slate-500 group-focus-within:text-amber-400 transition-colors flex-shrink-0"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative w-full min-h-screen overflow-hidden font-sans text-slate-200">
      {/* BACKGROUND */}
      <div className="absolute inset-0 w-full h-full fixed">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[30s] ease-linear hover:scale-105"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2560&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
      </div>

      <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-10 md:py-0">
        {/* TITLE SECTION */}
        <div
          className={`text-center mb-6 md:mb-10 transition-all duration-1000 transform ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h1 className="font-sangtrong uppercase text-3xl md:text-6xl lg:text-7xl text-white leading-tight mb-3 drop-shadow-2xl">
            {/* KHÔNG GIAN SỐNG <br className="hidden md:block" /> */}
            Không gian sống <br />
            <span className="text-amber-400 font-sangtrong text-4xl md:text-5xl">
              ĐẲNG CẤP THƯỢNG LƯU
            </span>
          </h1>
          <p className="text-slate-300 font-sans text-xs md:text-lg max-w-2xl mx-auto tracking-wide px-2">
            Tìm kiếm ngôi nhà mơ ước trong bộ sưu tập{" "}
            <span className="text-white font-medium">độc bản</span> của chúng
            tôi.
          </p>
        </div>

        {/* FORM CONTAINER */}
        <div
          className={`w-full max-w-6xl transition-all duration-1000 delay-200 transform ${
            isLoaded ? "translate-y-0 opacity-97" : "translate-y-12 opacity-0"
          }`}
        >
          {/* LƯU Ý: Xóa overflow-hidden để dropdown không bị cắt */}
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[20px] md:rounded-[30px] shadow-2xl relative">
            {/* TABS - Bo góc trên thủ công */}
            <div className="flex flex-row border-b border-white/5 overflow-x-auto scrollbar-hide rounded-t-[20px] md:rounded-t-[30px]">
              {[
                { id: "PROJECT", label: "Dự Án", icon: Building },
                { id: "SALE", label: "Nhà", icon: Home },
                { id: "RENT", label: "Thuê", icon: Key },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setFilters((prev) => ({
                        ...prev,
                        priceRangeIndex: 0,
                        areaRangeIndex: 0,
                        rentalPeriod: "all",
                        typeId: "all",
                        keyword: "",
                      }));
                      setShowSuggest(false);
                      setIsMobileFilterOpen(false);
                    }}
                    className={`relative flex-1 py-4 md:py-5 flex items-center justify-center gap-2 md:gap-3 transition-all duration-300 min-w-[90px]
                      ${
                        isActive
                          ? "bg-white/10 text-white"
                          : "hover:bg-white/5 text-slate-400 hover:text-white"
                      }`}
                  >
                    <tab.icon
                      size={16}
                      className={`md:w-[18px] md:h-[18px] ${
                        isActive ? "text-amber-400" : ""
                      }`}
                      strokeWidth={1.5}
                    />
                    <span className="text-[11px] md:text-sm font-bold tracking-widest uppercase">
                      {tab.label}
                    </span>
                    {isActive && (
                      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* FORM INPUTS */}
            <form onSubmit={handleSearch} className="p-4 md:p-8 lg:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 md:gap-4 relative">
                {/* 1. KEYWORD INPUT (z-50 để luôn nổi lên trên) */}
                <div
                  className="lg:col-span-3 relative z-50"
                  ref={suggestWrapRef}
                >
                  <div className="relative w-full h-[60px] md:h-[72px] rounded-xl border border-white/10 bg-black/20 backdrop-blur-md flex flex-col justify-center px-4 md:px-5 transition-all duration-300 focus-within:bg-black/50 focus-within:border-amber-400">
                    <div className="flex items-center gap-3">
                      <Search
                        size={18}
                        className="text-slate-400 flex-shrink-0"
                      />
                      <div className="flex-1">
                        <label className="block text-[10px] md:text-[11px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">
                          Từ khóa
                        </label>
                        <input
                          type="text"
                          value={filters.keyword}
                          onChange={(e) => {
                            setFilters({ ...filters, keyword: e.target.value });
                            setShowSuggest(true);
                            setHighlightIndex(-1);
                          }}
                          onFocus={() => setShowSuggest(true)}
                          onKeyDown={(e) => {
                            if (
                              !showSuggest ||
                              propertySuggestions.length === 0
                            )
                              return;
                            if (e.key === "ArrowDown") {
                              e.preventDefault();
                              setHighlightIndex((prev) =>
                                Math.min(
                                  prev + 1,
                                  propertySuggestions.length - 1
                                )
                              );
                            }
                            if (e.key === "ArrowUp") {
                              e.preventDefault();
                              setHighlightIndex((prev) =>
                                Math.max(prev - 1, 0)
                              );
                            }
                            if (e.key === "Enter" && highlightIndex >= 0) {
                              e.preventDefault();
                              pickSuggestion(
                                propertySuggestions[highlightIndex]
                              );
                            }
                            if (e.key === "Escape") {
                              setShowSuggest(false);
                              setHighlightIndex(-1);
                            }
                          }}
                          placeholder={
                            activeTab === "PROJECT"
                              ? "Tên dự án..."
                              : "Địa chỉ, đường..."
                          }
                          className="w-full bg-transparent text-white text-sm md:text-[15px] font-medium placeholder-slate-600 focus:outline-none"
                        />
                      </div>
                      {filters.keyword && (
                        <button
                          type="button"
                          onClick={() =>
                            setFilters({ ...filters, keyword: "" })
                          }
                          className="p-1 text-slate-500 hover:text-white"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    {/* SUGGESTION DROPDOWN (z-100) */}
                    {showSuggest && propertySuggestions.length > 0 && (
                      <div className="absolute left-0 right-0 top-[65px] md:top-[78px] z-[100]">
                        <div className="rounded-2xl border border-white/10 bg-black/95 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden max-h-[300px] overflow-y-auto custom-scrollbar ring-1 ring-white/10">
                          {propertySuggestions.map((sug, idx) => (
                            <button
                              key={sug.id}
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => pickSuggestion(sug)}
                              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-white/5 last:border-0 ${
                                idx === highlightIndex
                                  ? "bg-white/15"
                                  : "hover:bg-white/10"
                              }`}
                            >
                              <div className="w-10 h-10 rounded bg-white/10 flex-shrink-0 overflow-hidden border border-white/10">
                                {sug.coverUrl && (
                                  <img
                                    src={sug.coverUrl}
                                    className="w-full h-full object-cover"
                                    alt=""
                                  />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-white text-sm font-semibold truncate">
                                  {sug.title}
                                </div>
                                <div className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                                  <MapPin size={10} />{" "}
                                  {sug.address || sug.locationName}
                                </div>
                              </div>
                              <div className="text-[11px] font-bold text-amber-400 whitespace-nowrap">
                                {sug.displayPrice}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* MOBILE TOGGLE (Chỉ hiện trên Mobile, z-40 để nằm dưới keyword nhưng trên các ô khác) */}
                <div className="block lg:hidden relative z-40">
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                    className={`w-full h-[50px] flex items-center justify-center gap-2 rounded-xl text-sm font-bold uppercase tracking-wide border transition-all ${
                      isMobileFilterOpen
                        ? "bg-amber-400/20 border-amber-400 text-amber-400"
                        : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
                    }`}
                  >
                    <Filter size={16} />
                    {isMobileFilterOpen ? "Thu gọn bộ lọc" : "Bộ lọc nâng cao"}
                  </button>
                </div>

                {/* CÁC BỘ LỌC KHÁC (Ẩn trên mobile trừ khi mở) */}
                <div
                  className={`lg:contents ${
                    isMobileFilterOpen ? "contents" : "hidden"
                  } relative z-10`}
                >
                  <div className="lg:col-span-3">
                    <CustomSelect
                      icon={MapPin}
                      label="Khu vực"
                      value={filters.locationId}
                      onChange={(e) =>
                        setFilters({ ...filters, locationId: e.target.value })
                      }
                      options={TINH_THANH}
                      defaultLabel="Toàn quốc"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <CustomSelect
                      icon={Building2}
                      label="Loại hình"
                      value={filters.typeId}
                      onChange={(e) =>
                        setFilters({ ...filters, typeId: e.target.value })
                      }
                      options={visiblePropertyTypes}
                      defaultLabel="Tất cả"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <CustomSelect
                      icon={Wallet}
                      label="Mức giá"
                      value={filters.priceRangeIndex}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          priceRangeIndex:
                            e.target.value === "all"
                              ? 0
                              : Number(e.target.value),
                        })
                      }
                      options={PRICE_RANGES[activeTab]}
                    />
                  </div>
                  <div className="lg:col-span-2">
                    {activeTab === "RENT" ? (
                      <CustomSelect
                        icon={CalendarDays}
                        label="Thời hạn"
                        value={filters.rentalPeriod}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            rentalPeriod: e.target.value,
                          })
                        }
                        options={RENTAL_PERIODS}
                      />
                    ) : (
                      <CustomSelect
                        icon={ScanLine}
                        label="Diện tích"
                        value={filters.areaRangeIndex}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            areaRangeIndex:
                              e.target.value === "all"
                                ? 0
                                : Number(e.target.value),
                          })
                        }
                        options={AREA_RANGES}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS (z-0 để không che gì cả) */}
              <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-white/5 flex flex-col-reverse md:flex-row items-center justify-between gap-4 relative z-0">
                <button
                  type="button"
                  onClick={() => {
                    handleReset();
                    setShowSuggest(false);
                  }}
                  className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider hover:text-white transition-colors group py-2"
                >
                  <RotateCcw
                    size={14}
                    className="group-hover:-rotate-180 transition-transform duration-500"
                  />{" "}
                  Xóa bộ lọc
                </button>

                <button
                  type="submit"
                  className="w-full md:w-auto px-12 py-3.5 md:py-4 bg-gradient-to-r from-amber-400 to-yellow-600 hover:from-amber-300 hover:to-yellow-500 text-black font-bold text-sm uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] transform hover:-translate-y-0.5 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <Search size={18} strokeWidth={2.5} /> <span>Tìm Kiếm</span>{" "}
                  <ArrowRight size={18} strokeWidth={2.5} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
