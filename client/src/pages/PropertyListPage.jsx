// src/pages/PropertyListPage.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PropertyCard from "../components/PropertyCard";
import { MOCK, selectPropertyCard } from "../hook/data";

// --- CẤU HÌNH DỮ LIỆU (GIỮ NGUYÊN) ---
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

  // 1. STATE QUẢN LÝ
  const [activeTab, setActiveTab] = useState("SALE");
  const [filters, setFilters] = useState({
    keyword: "",
    locationId: "all",
    typeId: "all",
    priceRangeIndex: 0,
  });

  // Đồng bộ URL -> State
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["SALE", "RENT", "PROJECT"].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab: tab });
    setFilters({
      keyword: "",
      locationId: "all",
      typeId: "all",
      priceRangeIndex: 0,
    });
  };

  // 2. LẤY DỮ LIỆU
  const propertyIds = useMemo(() => {
    return MOCK.listing && MOCK.listing.length > 0
      ? MOCK.listing
      : MOCK.entities?.properties
      ? Object.keys(MOCK.entities.properties)
      : [];
  }, []);

  const locations = Object.values(MOCK.entities.locations);
  const propertyTypes = Object.values(MOCK.entities.propertyTypes);

  // 3. LOGIC LỌC
  const filteredCards = useMemo(() => {
    const list = propertyIds
      .map((id) => selectPropertyCard(id))
      .filter((item) => item !== null);

    const listByTab = list.filter((c) => {
      if (activeTab === "PROJECT") return c.isProject;
      if (activeTab === "SALE")
        return c.transactionType === "SALE" && !c.isProject;
      if (activeTab === "RENT") return c.transactionType === "RENT";
      return true;
    });

    return listByTab.filter((c) => {
      const searchContent = [c.title, c.locationName, c.typeName]
        .join(" ")
        .toLowerCase();
      const matchKeyword =
        !filters.keyword ||
        searchContent.includes(filters.keyword.toLowerCase());
      const pLocId = MOCK.entities.properties[c.id]?.locationId;
      const matchLocation =
        filters.locationId === "all" || pLocId === filters.locationId;
      const pTypeId = MOCK.entities.properties[c.id]?.typeId;
      const matchType = filters.typeId === "all" || pTypeId === filters.typeId;
      const rawPrice = parseFloat(MOCK.entities.properties[c.id]?.price || 0);
      const range = PRICE_RANGES[activeTab][filters.priceRangeIndex];
      const matchPrice = rawPrice >= range.min && rawPrice < range.max;

      return matchKeyword && matchLocation && matchType && matchPrice;
    });
  }, [propertyIds, activeTab, filters]);

  // --- UI COMPONENTS NHỎ (GIỮ NGUYÊN) ---
  const TabButton = ({ id, label, current }) => (
    <button
      onClick={() => handleTabChange(id)}
      className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 relative ${
        current === id
          ? "text-white shadow-lg shadow-blue-900/20"
          : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
      }`}
    >
      {current === id && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-[#0E2038] rounded-full"
        />
      )}
      <span className="relative z-10">{label}</span>
    </button>
  );

  const CustomSelect = ({ icon: Icon, value, onChange, options, label }) => (
    <div className="relative group w-full">
      <div className="absolute left-0 top-3 text-slate-400 group-focus-within:text-[#0E2038] transition-colors">
        <Icon />
      </div>
      <div className="pl-8 w-full">
        <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-0.5">
          {label}
        </label>
        <div className="relative">
          <select
            value={value}
            onChange={onChange}
            className="w-full bg-transparent text-[#0E2038] font-medium py-1 pr-8 focus:outline-none cursor-pointer appearance-none truncate"
          >
            {options.map((opt, i) => (
              <option key={i} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-0 top-1.5 pointer-events-none text-slate-400">
            <Icons.ChevronDown />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* ================= UPDATE: HERO SECTION MỚI ================= */}
      {/* Background Section - Tăng chiều cao lên 500px và dùng ảnh nền */}
      <div className="relative h-[500px] rounded-b-[50px] overflow-hidden shadow-[0_20px_50px_rgba(8,24,44,0.2)] z-0">
        {/* 1. Lớp Ảnh nền */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            // Sử dụng ảnh mẫu chất lượng cao (Bạn có thể thay link ảnh của bạn vào đây)
            backgroundImage: `url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2053&q=80')`,
          }}
        />

        {/* 2. Lớp phủ Gradient để tạo sự liền mạch */}
        {/* Lớp tối tổng thể để text trắng dễ đọc */}
        <div className="absolute inset-0 bg-black/30" />
        {/* Gradient chính: Từ màu thương hiệu tối ở trên -> Xuống màu trắng mờ ở dưới đáy để hòa vào nền */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50/95 via-[#0E2038]/50 to-[#0E2038]/80" />

        {/* 3. Nội dung chữ */}
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4 drop-shadow-lg">
              Tìm kiếm{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
                tổ ấm
              </span>{" "}
              của bạn
            </h1>
            <p className="text-slate-200 text-lg md:text-xl font-medium max-w-2xl mx-auto drop-shadow-md">
              Khám phá {propertyIds.length}+ bất động sản tiềm năng với thông
              tin minh bạch.
            </p>
          </motion.div>
        </div>
      </div>
      {/* ================= END UPDATE ================= */}

      {/* SEARCH BAR - Floating (Nổi lên trên 2 phần) */}
      <div className="max-w-6xl mx-auto px-4 -mt-28 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white rounded-3xl shadow-[0_20px_40px_-10px_rgba(14,32,56,0.15)] p-2 backdrop-blur-xl bg-white/95 border border-white/50"
        >
          {/* Tabs Switcher */}
          <div className="flex justify-center mb-6 pt-4">
            <div className="bg-slate-100/80 p-1.5 rounded-full inline-flex">
              <TabButton id="SALE" label="Mua Bán" current={activeTab} />
              <TabButton id="RENT" label="Cho Thuê" current={activeTab} />
              <TabButton id="PROJECT" label="Dự Án" current={activeTab} />
            </div>
          </div>

          {/* Filter Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0 md:divide-x divide-slate-100 pb-2 px-2 md:px-6">
            {/* 1. Keyword Input */}
            <div className="md:col-span-4 py-3 md:pr-6">
              <div className="flex items-center gap-3 w-full h-full">
                <div className="text-slate-400">
                  <Icons.Search />
                </div>
                <div className="w-full">
                  <label className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-0.5">
                    Tìm kiếm
                  </label>
                  <input
                    type="text"
                    value={filters.keyword}
                    onChange={(e) =>
                      setFilters({ ...filters, keyword: e.target.value })
                    }
                    placeholder={
                      activeTab === "PROJECT"
                        ? "Tên dự án..."
                        : "Nhập tên đường, địa chỉ..."
                    }
                    className="w-full bg-transparent text-[#0E2038] font-medium placeholder-slate-300 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 2. Location Select */}
            <div className="md:col-span-3 py-3 md:px-6">
              <CustomSelect
                icon={Icons.Location}
                label="Khu vực"
                value={filters.locationId}
                onChange={(e) =>
                  setFilters({ ...filters, locationId: e.target.value })
                }
                options={[
                  { value: "all", label: "Toàn quốc" },
                  ...locations.map((l) => ({ value: l.id, label: l.name })),
                ]}
              />
            </div>

            {/* 3. Type Select */}
            <div className="md:col-span-3 py-3 md:px-6">
              <CustomSelect
                icon={Icons.Home}
                label="Loại nhà đất"
                value={filters.typeId}
                onChange={(e) =>
                  setFilters({ ...filters, typeId: e.target.value })
                }
                options={[
                  { value: "all", label: "Tất cả loại hình" },
                  ...propertyTypes.map((t) => ({ value: t.id, label: t.name })),
                ]}
              />
            </div>

            {/* 4. Price Select */}
            <div className="md:col-span-2 py-3 md:pl-6">
              <CustomSelect
                icon={Icons.Dollar}
                label="Mức giá"
                value={filters.priceRangeIndex}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    priceRangeIndex: Number(e.target.value),
                  })
                }
                options={PRICE_RANGES[activeTab].map((range, idx) => ({
                  value: idx,
                  label: range.label,
                }))}
              />
            </div>
          </div>

          {/* Search Button Area */}
          <div className="mt-2 pt-4 border-t border-slate-50 flex justify-end px-4 pb-2">
            <button className="w-full md:w-auto bg-[#0E2038] hover:bg-blue-900 text-white px-8 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-[#0E2038]/20 transition-all hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2">
              <Icons.Search />
              <span>TÌM KIẾM NGAY</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* SECTION 2: RESULTS (GIỮ NGUYÊN) */}
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-16">
        {/* Header Results */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-[#0E2038] mb-2 flex items-center gap-2">
              {activeTab === "SALE"
                ? "Nhà đất bán"
                : activeTab === "RENT"
                ? "Nhà đất cho thuê"
                : "Dự án nổi bật"}
              <span className="text-sm font-normal text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                {filteredCards.length} tin
              </span>
            </h2>
            <p className="text-slate-500">
              Kết quả tìm kiếm phù hợp với tiêu chí của bạn
            </p>
          </div>

          {/* Nút sắp xếp (Placeholder) */}
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Sắp xếp theo:</span>
            <select className="bg-white border border-slate-200 rounded-lg py-1.5 px-3 font-medium text-[#0E2038] focus:outline-none cursor-pointer hover:border-blue-500 transition-colors">
              <option>Mới nhất</option>
              <option>Giá thấp đến cao</option>
              <option>Giá cao đến thấp</option>
            </select>
          </div>
        </div>

        {/* Content Grid */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {filteredCards.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-slate-200"
              >
                <div className="text-slate-200 mb-6">
                  <Icons.Empty />
                </div>
                <h3 className="text-xl font-bold text-[#0E2038] mb-2">
                  Không tìm thấy kết quả nào
                </h3>
                <p className="text-slate-400 text-center max-w-md mb-8">
                  Rất tiếc, chúng tôi không tìm thấy bất động sản nào phù hợp
                  với bộ lọc hiện tại của bạn.
                </p>
                <button
                  onClick={() => handleTabChange(activeTab)}
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-[#0E2038] font-semibold rounded-xl transition-colors"
                >
                  Xóa bộ lọc & Thử lại
                </button>
              </motion.div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8"
              >
                {filteredCards.map((c, i) => (
                  <motion.div
                    layout
                    key={c.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
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
