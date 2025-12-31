// src/components/SearchSection.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MOCK } from "../hook/data";
import TINH_THANH from "../hook/datatinhthanh";

// Import Icon từ Lucide React
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
} from "lucide-react";

// --- CẤU HÌNH GIÁ (GIỮ NGUYÊN) ---
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
    { label: "Dưới 10 triệu", min: 0, max: 10000000 },
    { label: "10 - 30 triệu", min: 10000000, max: 30000000 },
    { label: "30 - 50 triệu", min: 30000000, max: 50000000 },
    { label: "Trên 50 triệu", min: 50000000, max: Infinity },
  ],
  PROJECT: [
    { label: "Tất cả mức giá", min: 0, max: Infinity },
    { label: "Dưới 3 tỷ", min: 0, max: 3000000000 },
    { label: "3 - 7 tỷ", min: 3000000000, max: 7000000000 },
    { label: "Trên 7 tỷ", min: 7000000000, max: Infinity },
  ],
};

export default function SearchSection() {
  const navigate = useNavigate();

  // 1. STATE QUẢN LÝ
  const [activeTab, setActiveTab] = useState("PROJECT");
  const [filters, setFilters] = useState({
    keyword: "",
    locationId: "all",
    typeId: "all",
    priceRangeIndex: 0,
  });

  // 2. LẤY DỮ LIỆU
  const propertyTypes = useMemo(
    () => Object.values(MOCK.entities.propertyTypes),
    []
  );

  // 3. HANDLERS
  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("tab", activeTab);
    if (filters.keyword) params.set("keyword", filters.keyword);
    if (filters.locationId !== "all")
      params.set("locationId", filters.locationId);
    if (filters.typeId !== "all") params.set("typeId", filters.typeId);

    navigate(`/properties?${params.toString()}`);
  };

  const handleReset = () => {
    setFilters({
      keyword: "",
      locationId: "all",
      typeId: "all",
      priceRangeIndex: 0,
    });
  };

  // --- UI HELPER: Custom Select Wrapper ---
  const CustomSelect = ({
    icon: Icon, // Nhận component Icon
    label,
    value,
    onChange,
    options,
    defaultLabel = "Tất cả",
  }) => (
    <div className="relative group w-full">
      <div className="flex items-center h-[64px] bg-white/5 border border-white/10 rounded-2xl px-5 transition-all duration-300 group-hover:bg-white/10 group-focus-within:bg-white/15 group-focus-within:border-yellow-400/50 group-focus-within:ring-4 group-focus-within:ring-yellow-400/10 backdrop-blur-md">
        {/* Icon container với hiệu ứng glow nhẹ */}
        <div className="text-slate-400 group-focus-within:text-yellow-400 transition-colors mr-4 p-2 rounded-lg bg-white/5 group-focus-within:bg-yellow-400/10">
          <Icon size={20} strokeWidth={2} />
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <label className="text-[11px] uppercase font-bold text-slate-400 tracking-wider mb-0.5 truncate group-focus-within:text-yellow-400 transition-colors">
            {label}
          </label>

          <div className="relative">
            <select
              value={value}
              onChange={onChange}
              className="w-full bg-transparent text-white font-semibold text-[15px] appearance-none focus:outline-none cursor-pointer absolute inset-0 opacity-0 z-10"
            >
              <option value="all" className="text-slate-900">
                {defaultLabel}
              </option>
              {options.map((opt, idx) => {
                const val = opt.value || opt.id || idx;
                const lab = opt.label || opt.name || opt.label;
                return (
                  <option key={val} value={val} className="text-slate-900">
                    {lab}
                  </option>
                );
              })}
            </select>

            <div className="text-white/90 font-medium truncate pr-4">
              {(() => {
                if (value === "all" || value === 0) return defaultLabel;
                const found = options.find(
                  (o) =>
                    o.value === value ||
                    o.id === value ||
                    options.indexOf(o) === value
                );
                return found ? found.label || found.name : defaultLabel;
              })()}
            </div>
          </div>
        </div>

        <div className="absolute right-4 text-slate-500 group-focus-within:text-yellow-400 pointer-events-none transition-colors">
          <ChevronDown size={16} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden font-sans">
      {/* 1. BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transform hover:scale-105 transition-transform duration-[20s]"
        style={{ backgroundImage: "url('/anhnen.jpg')" }}
      />

      {/* 2. OVERLAY CAO CẤP */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-900/90" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

      {/* 3. MAIN CONTENT */}
      <div className="relative z-10 w-full max-w-7xl px-4 flex flex-col items-center justify-center h-full">
        {/* HERO TEXT */}
        <div className="text-center mb-12 space-y-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl ring-1 ring-white/20">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </span>
            <span className="text-xs font-bold text-white uppercase tracking-widest">
              Hệ thống BĐS SỐ 1 VIỆT NAM
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.1] tracking-tight drop-shadow-2xl">
            Khởi Đầu <br className="md:hidden" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 animate-gradient-x">
              Thịnh Vượng
            </span>
          </h1>

          <p className="text-slate-300 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
            Khám phá hơn{" "}
            <strong className="text-white font-bold">200+</strong> bất động
            sản{" "}
            {activeTab === "PROJECT"
              ? "dự án cao cấp"
              : activeTab === "SALE"
              ? "đang giao dịch"
              : "cho thuê"}{" "}
            tại những vị trí đắc địa nhất.
          </p>
        </div>

        {/* 4. SEARCH BOX CONTAINER */}
        <div className="w-full bg-slate-900/40 border border-white/10 backdrop-blur-2xl rounded-[40px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)] overflow-visible">
          {/* TABS HEADER */}
          <div className="flex justify-center md:justify-start px-8 pt-6 pb-2 gap-2">
            {[
              { id: "PROJECT", label: "Dự Án", icon: Building },
              { id: "SALE", label: "Mua Bán", icon: Home },
              { id: "RENT", label: "Cho Thuê", icon: Key },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setFilters({ ...filters, priceRangeIndex: 0 });
                  }}
                  className={`
                    relative group flex items-center gap-3 px-6 py-3 rounded-full transition-all duration-300
                    ${
                      isActive
                        ? "bg-white text-slate-900 shadow-lg shadow-white/10 scale-105"
                        : "bg-transparent text-slate-400 hover:text-white hover:bg-white/5"
                    }
                  `}
                >
                  <TabIcon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  <span
                    className={`text-sm font-bold tracking-wide ${
                      isActive ? "opacity-100" : "opacity-80"
                    }`}
                  >
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* SEARCH FORM */}
          <form onSubmit={handleSearch} className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Keyword Input */}
              <div className="md:col-span-12 lg:col-span-4">
                <div className="relative group w-full h-full">
                  <div className="flex items-center h-[64px] bg-white/5 border border-white/10 rounded-2xl px-5 transition-all duration-300 group-hover:bg-white/10 group-focus-within:bg-white/15 group-focus-within:border-yellow-400/50 group-focus-within:ring-4 group-focus-within:ring-yellow-400/10 backdrop-blur-md">
                    <div className="text-slate-400 group-focus-within:text-yellow-400 mr-4 p-2 rounded-lg bg-white/5 group-focus-within:bg-yellow-400/10 transition-colors">
                      <Search size={20} strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[11px] uppercase font-bold text-slate-400 tracking-wider mb-0.5 group-focus-within:text-yellow-400 transition-colors">
                        Từ khóa tìm kiếm
                      </label>
                      <input
                        type="text"
                        value={filters.keyword}
                        onChange={(e) =>
                          setFilters({ ...filters, keyword: e.target.value })
                        }
                        placeholder={
                          activeTab === "PROJECT"
                            ? "Vinhomes, EcoPark..."
                            : "Nhập địa chỉ, đường..."
                        }
                        className="w-full bg-transparent text-white font-semibold text-[15px] placeholder-slate-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Select */}
              <div className="md:col-span-6 lg:col-span-3">
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

              {/* Type Select */}
              <div className="md:col-span-6 lg:col-span-3">
                <CustomSelect
                  icon={Building2}
                  label="Loại hình"
                  value={filters.typeId}
                  onChange={(e) =>
                    setFilters({ ...filters, typeId: e.target.value })
                  }
                  options={propertyTypes}
                  defaultLabel="Tất cả"
                />
              </div>

              {/* Price Select */}
              <div className="md:col-span-12 lg:col-span-2">
                <CustomSelect
                  icon={Wallet}
                  label="Mức giá"
                  value={filters.priceRangeIndex}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      priceRangeIndex: Number(e.target.value),
                    })
                  }
                  options={PRICE_RANGES[activeTab]}
                />
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="mt-8 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/5">
              <button
                type="button"
                onClick={handleReset}
                className="group flex items-center gap-2 px-6 py-3 rounded-xl text-slate-400 text-sm font-bold hover:text-white hover:bg-white/5 transition-all w-full sm:w-auto justify-center"
              >
                <RotateCcw
                  size={16}
                  className="group-hover:-rotate-180 transition-transform duration-500"
                />
                <span>Làm mới bộ lọc</span>
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-600 text-white font-bold text-lg shadow-[0_10px_30px_rgba(251,191,36,0.25)] hover:shadow-[0_20px_50px_rgba(251,191,36,0.4)] hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12"></div>
                <Search size={22} strokeWidth={2.5} />
                <span className="uppercase tracking-wide">Tìm kiếm</span>
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white to-transparent"></div>
        <span className="text-[10px] text-white uppercase tracking-[0.2em]">
          Khám phá
        </span>
      </div>
    </div>
  );
}
