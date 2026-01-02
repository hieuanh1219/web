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
} from "lucide-react";

/* --- 1. CONFIG DATA (GIỮ NGUYÊN) --- */
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
   HELPERS: AUTOCOMPLETE
========================= */
const normalize = (s = "") =>
  s
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // bỏ dấu tiếng Việt
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

  useEffect(() => setIsLoaded(true), []);

  // 2. STATE QUẢN LÝ
  const [activeTab, setActiveTab] = useState("PROJECT");
  const [filters, setFilters] = useState({
    keyword: "",
    locationId: "all",
    typeId: "all",
    priceRangeIndex: 0,
    areaRangeIndex: 0,
    rentalPeriod: "all",
  });

  // 3. LOGIC LỌC TYPE
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

  // 4. HANDLERS SEARCH LIST (giữ nguyên)
  const handleSearch = (e) => {
    e.preventDefault();
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

  /* =========================
     AUTOCOMPLETE: FULL
  ========================= */
  const [showSuggest, setShowSuggest] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const suggestWrapRef = useRef(null);

  // click outside => đóng gợi ý
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

  // build indexes: tags/amenities/features theo propertyId để search thêm keyword
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

  // suggestions dạng card (property)
  const propertySuggestions = useMemo(() => {
    const q = normalize(filters.keyword);
    if (!q) return [];

    const e = MOCK.entities;

    // filter theo tab + filter theo dropdown đang chọn (khu vực / loại)
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
          slug: p.slug, // ✅ dùng slug để đi detail
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

  // CLICK suggestion => đi detail ngay (đúng router của bạn)
  const pickSuggestion = (sug) => {
    setFilters((prev) => ({ ...prev, keyword: sug.title }));
    setShowSuggest(false);
    setHighlightIndex(-1);

    // ✅ Router của bạn: /properties/:slug
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
      <div className="flex flex-col h-[72px] justify-center px-4 md:px-5 rounded-xl border border-white/10 bg-black/20 backdrop-blur-md transition-all duration-300 hover:bg-black/40 hover:border-amber-400/30 group-focus-within:bg-black/50 group-focus-within:border-amber-400 group-focus-within:ring-1 group-focus-within:ring-amber-400/50">
        <div className="flex items-center gap-3">
          <Icon
            size={18}
            className="text-slate-400 group-focus-within:text-amber-400 transition-colors duration-300"
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
            className="text-slate-500 group-focus-within:text-amber-400 transition-colors"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative w-full h-screen overflow-hidden font-sans text-slate-200">
      {/* BACKGROUND */}
      <div className="absolute inset-0 w-full h-full">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[30s] ease-linear hover:scale-105"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2560&q=80')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* MAIN */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        {/* HEAD */}
        <div
          className={`text-center mb-10 transition-all duration-1000 transform ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h1 className="font-sangtrong uppercase text-4xl md:text-6xl lg:text-7xl text-white leading-tight mb-4 drop-shadow-2xl">
            KHÔNG GIAN SỐNG <br className="hidden md:block" />
            <span className="text-amber-400 font-sangtrong text-5xl">
              ĐẲNG CẤP THƯỢNG lưu
            </span>
          </h1>

          <p className="text-slate-300 font-light text-sm md:text-lg max-w-2xl mx-auto tracking-wide">
            Tìm kiếm ngôi nhà mơ ước trong bộ sưu tập{" "}
            <span className="text-white font-medium">độc bản</span> của chúng
            tôi.
          </p>
        </div>

        {/* FORM WRAPPER */}
        <div
          className={`w-full max-w-6xl transition-all duration-1000 delay-200 transform ${
            isLoaded ? "translate-y-0 opacity-97" : "translate-y-12 opacity-0"
          }`}
        >
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[30px] shadow-2xl">
            {/* TABS */}
            <div className="flex flex-col md:flex-row border-b border-white/5">
              {[
                { id: "PROJECT", label: "Dự Án", icon: Building },
                { id: "SALE", label: "Nhà", icon: Home },
                { id: "RENT", label: "Cho Thuê", icon: Key },
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
                      setHighlightIndex(-1);
                    }}
                    className={`relative flex-1 py-5 flex items-center justify-center gap-3 transition-all duration-300
                      ${
                        isActive
                          ? "bg-white/10 text-white"
                          : "hover:bg-white/5 text-slate-400 hover:text-white"
                      }
                    `}
                  >
                    <tab.icon
                      size={18}
                      strokeWidth={1.5}
                      className={isActive ? "text-amber-400" : ""}
                    />
                    <span className="text-sm font-bold tracking-widest uppercase">
                      {tab.label}
                    </span>
                    {isActive && (
                      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* SEARCH INPUTS */}
            <form onSubmit={handleSearch} className="p-6 md:p-8 lg:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
                {/* Keyword + Suggest */}
                <div className="lg:col-span-3 relative" ref={suggestWrapRef}>
                  <div className="relative w-full h-[72px] rounded-xl border border-white/10 bg-black/20 backdrop-blur-md flex flex-col justify-center px-5 transition-all duration-300 hover:bg-black/40 hover:border-amber-400/30 group focus-within:bg-black/50 focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400/50">
                    <div className="flex items-center gap-3">
                      <Search
                        size={18}
                        className="text-slate-400 group-focus-within:text-amber-400 transition-colors"
                      />
                      <div className="flex-1">
                        <label className="block text-[10px] md:text-[11px] uppercase font-bold text-slate-400 tracking-wider mb-0.5 group-focus-within:text-amber-400 transition-colors">
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
                              : "Tìm địa chỉ, đường..."
                          }
                          className="w-full bg-transparent text-white text-sm md:text-[15px] font-medium placeholder-slate-600 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Dropdown Suggestions */}
                    {showSuggest && propertySuggestions.length > 0 && (
                      <div className="absolute left-0 right-0 top-[78px] z-50">
                        <div className="rounded-2xl border border-white/10 bg-black/85 backdrop-blur-xl shadow-2xl overflow-hidden max-h-[300px] overflow-y-auto custom-scrollbar">
                          {propertySuggestions.map((sug, idx) => (
                            <button
                              key={sug.id}
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => pickSuggestion(sug)}
                              className={`w-full flex items-center gap-3 px-3 py-3 text-left transition-colors ${
                                idx === highlightIndex
                                  ? "bg-white/10"
                                  : "hover:bg-white/5"
                              }`}
                            >
                              <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 bg-white/5 flex-shrink-0">
                                {sug.coverUrl ? (
                                  <img
                                    src={sug.coverUrl}
                                    alt={sug.title}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                  />
                                ) : (
                                  <div className="w-full h-full" />
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="text-[13px] font-semibold text-white truncate">
                                  {sug.title}
                                </div>
                                <div className="text-[11px] text-slate-300 truncate flex items-center gap-1">
                                  <MapPin
                                    size={12}
                                    className="text-slate-400"
                                  />
                                  <span className="truncate">
                                    {sug.address || sug.locationName}
                                  </span>
                                </div>
                              </div>

                              <div className="text-[12px] font-bold text-amber-400 whitespace-nowrap">
                                {sug.displayPrice || ""}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dropdowns */}
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
                          e.target.value === "all" ? 0 : Number(e.target.value),
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
                        setFilters({ ...filters, rentalPeriod: e.target.value })
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

              {/* ACTION BUTTONS */}
              <div className="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => {
                    handleReset();
                    setShowSuggest(false);
                    setHighlightIndex(-1);
                  }}
                  className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider hover:text-white transition-colors group"
                >
                  <RotateCcw
                    size={14}
                    className="group-hover:-rotate-180 transition-transform duration-500"
                  />
                  Xóa bộ lọc
                </button>

                <button
                  type="submit"
                  className="w-full md:w-auto px-12 py-4 bg-gradient-to-r from-amber-400 to-yellow-600 hover:from-amber-300 hover:to-yellow-500 text-black font-bold text-sm uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] transform hover:-translate-y-0.5 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <Search size={18} strokeWidth={2.5} />
                  <span>Tìm Kiếm</span>
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
