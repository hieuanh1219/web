
// làm lại khi đầy đủ 3 trang danh sách (dự án,mua nhà, thuê nhà)
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TINH_THANH from "../hook/datatinhthanh";

export default function SearchSection() {
  const navigate = useNavigate();

  // ====== TAB TYPE ======
  // "du-an" | "mua-nha" | "thue-nha"
  const [loaiTim, setLoaiTim] = useState("du-an");

  // ====== COMMON ======
  const [keyword, setKeyword] = useState("");
  const [khuVuc, setKhuVuc] = useState(""); // thêm khu vực dùng chung

  // ====== LOẠI 1: DỰ ÁN ======
  const [duAnLoai, setDuAnLoai] = useState(""); // loại dự án
  const [duAnTinhTrang, setDuAnTinhTrang] = useState(""); // tình trạng
  const [duAnTienDo, setDuAnTienDo] = useState(""); // tiến độ
  const [duAnGia, setDuAnGia] = useState([1, 10]); // tỷ

  // ====== LOẠI 2: MUA NHÀ ======
  const [muaGia, setMuaGia] = useState([1, 10]); // tỷ
  const [muaDacDiem, setMuaDacDiem] = useState(""); // đặc điểm
  const [muaSanPham, setMuaSanPham] = useState(""); // sản phẩm

  // ====== LOẠI 3: THUÊ NHÀ ======
  const [thueThoiGian, setThueThoiGian] = useState(""); // thời gian thuê
  const [thueGia, setThueGia] = useState([1, 10]); // triệu/tháng (demo)
  const [thueDacDiem, setThueDacDiem] = useState("");
  const [thueSanPham, setThueSanPham] = useState("");

  // ====== OPTIONS (mày chỉnh tuỳ data thật) ======
  const DU_AN_LOAI_OPTIONS = useMemo(
    () => [
      { value: "", label: "Chọn loại dự án" },
      { value: "can-ho", label: "Căn hộ" },
      { value: "khu-do-thi", label: "Khu đô thị" },
      { value: "nha-pho", label: "Nhà phố" },
      { value: "biet-thu", label: "Biệt thự" },
      { value: "dat-nen", label: "Đất nền" },
    ],
    []
  );

  const DU_AN_TINH_TRANG_OPTIONS = useMemo(
    () => [
      { value: "", label: "Chọn tình trạng" },
      { value: "dang-mo-ban", label: "Đang mở bán" },
      { value: "sap-mo-ban", label: "Sắp mở bán" },
      { value: "da-ban-giao", label: "Đã bàn giao" },
    ],
    []
  );

  const DU_AN_TIEN_DO_OPTIONS = useMemo(
    () => [
      { value: "", label: "Chọn tiến độ" },
      { value: "dang-xay-dung", label: "Đang xây dựng" },
      { value: "sap-ban-giao", label: "Sắp bàn giao" },
      { value: "da-hoan-thien", label: "Đã hoàn thiện" },
    ],
    []
  );

  const DAC_DIEM_OPTIONS = useMemo(
    () => [
      { value: "", label: "Chọn đặc điểm" },
      { value: "gan-truong", label: "Gần trường học" },
      { value: "gan-benh-vien", label: "Gần bệnh viện" },
      { value: "noi-that", label: "Có nội thất" },
      { value: "view-dep", label: "View đẹp" },
    ],
    []
  );

  const SAN_PHAM_OPTIONS = useMemo(
    () => [
      { value: "", label: "Chọn sản phẩm" },
      { value: "chung-cu", label: "Chung cư" },
      { value: "nha-pho", label: "Nhà phố" },
      { value: "biet-thu", label: "Biệt thự" },
      { value: "dat-nen", label: "Đất nền" },
      { value: "shophouse", label: "Shophouse" },
    ],
    []
  );

  const THUE_THOI_GIAN_OPTIONS = useMemo(
    () => [
      { value: "", label: "Chọn thời gian thuê" },
      { value: "ngan-han", label: "Ngắn hạn" },
      { value: "6-thang", label: "6 tháng" },
      { value: "1-nam", label: "1 năm" },
      { value: "dai-han", label: "Dài hạn" },
    ],
    []
  );

  // ====== SUBMIT ======
  const handleSearch = (e) => {
    e.preventDefault();

    const paramsObj = {
      ...(loaiTim && { loai: loaiTim }),
      ...(keyword && { q: keyword }),
      ...(khuVuc && { khu_vuc: khuVuc }),
    };

    if (loaiTim === "du-an") {
      Object.assign(paramsObj, {
        ...(duAnLoai && { du_an_loai: duAnLoai }),
        ...(duAnTinhTrang && { tinh_trang: duAnTinhTrang }),
        ...(duAnTienDo && { tien_do: duAnTienDo }),
        ...(duAnGia && { gia: `${duAnGia[0]}-${duAnGia[1]}` }),
      });
    }

    if (loaiTim === "mua-nha") {
      Object.assign(paramsObj, {
        ...(muaGia && { gia: `${muaGia[0]}-${muaGia[1]}` }),
        ...(muaDacDiem && { dac_diem: muaDacDiem }),
        ...(muaSanPham && { san_pham: muaSanPham }),
      });
    }

    if (loaiTim === "thue-nha") {
      Object.assign(paramsObj, {
        ...(thueThoiGian && { thoi_gian_thue: thueThoiGian }),
        ...(thueGia && { gia: `${thueGia[0]}-${thueGia[1]}` }),
        ...(thueDacDiem && { dac_diem: thueDacDiem }),
        ...(thueSanPham && { san_pham: thueSanPham }),
      });
    }

    const onlyLoai =
      Object.keys(paramsObj).filter((k) => k !== "loai").length === 0;
    if (onlyLoai) {
      alert("Nhập keyword hoặc chọn ít nhất 1 bộ lọc để tìm kiếm");
      return;
    }

    const params = new URLSearchParams(paramsObj);
    navigate(`/danhsach?${params.toString()}`);
  };

  const handleReset = () => {
    setKeyword("");
    setKhuVuc("");

    setDuAnLoai("");
    setDuAnTinhTrang("");
    setDuAnTienDo("");
    setDuAnGia([1, 10]);

    setMuaGia([1, 10]);
    setMuaDacDiem("");
    setMuaSanPham("");

    setThueThoiGian("");
    setThueGia([1, 10]);
    setThueDacDiem("");
    setThueSanPham("");
  };

  // ====== RANGE COMPONENT (2 THUMB + TOOLTIP) ======
  const RangeTwoThumb = ({
    label,
    unit = "tỷ",
    min = 1,
    max = 20,
    gap = 1,
    value,
    onChange,
  }) => {
    const minVal = value[0];
    const maxVal = value[1];

    const minPercent = ((minVal - min) / (max - min)) * 100;
    const maxPercent = ((maxVal - min) / (max - min)) * 100;

    return (
      <div className="rounded-2xl border border-gray-200 bg-white/70 p-5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-gray-700">{label}</p>
            <p className="text-xs text-gray-500">Kéo 2 đầu để chọn khoảng</p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-xl bg-blue-600/10 px-3 py-2 text-sm font-semibold text-blue-700">
            {minVal} – {maxVal} {unit}
          </div>
        </div>

        <div className="mt-5">
          <div className="relative h-14 select-none">
            <div className="absolute left-0 right-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-gray-200" />
            <div
              className="absolute top-1/2 h-2 -translate-y-1/2 rounded-full bg-blue-600 transition-[left,width] duration-100"
              style={{
                left: `${minPercent}%`,
                width: `${maxPercent - minPercent}%`,
              }}
            />

            <div
              className="absolute -top-1 translate-x-[-50%] rounded-lg bg-gray-900 px-2 py-1 text-[11px] font-semibold text-white shadow"
              style={{ left: `${minPercent}%` }}
            >
              {minVal} {unit}
              <div className="mx-auto mt-1 h-0 w-0 border-x-4 border-x-transparent border-t-4 border-t-gray-900" />
            </div>

            <div
              className="absolute -top-1 translate-x-[-50%] rounded-lg bg-gray-900 px-2 py-1 text-[11px] font-semibold text-white shadow"
              style={{ left: `${maxPercent}%` }}
            >
              {maxVal} {unit}
              <div className="mx-auto mt-1 h-0 w-0 border-x-4 border-x-transparent border-t-4 border-t-gray-900" />
            </div>

            <input
              type="range"
              min={min}
              max={max}
              value={minVal}
              onChange={(e) => {
                const v = Math.min(Number(e.target.value), maxVal - gap);
                onChange([v, maxVal]);
              }}
              className="range-two absolute left-0 right-0 top-1/2 -translate-y-1/2 w-full appearance-none bg-transparent"
              style={{ zIndex: minVal > max - 2 ? 6 : 5 }}
            />

            <input
              type="range"
              min={min}
              max={max}
              value={maxVal}
              onChange={(e) => {
                const v = Math.max(Number(e.target.value), minVal + gap);
                onChange([minVal, v]);
              }}
              className="range-two absolute left-0 right-0 top-1/2 -translate-y-1/2 w-full appearance-none bg-transparent"
              style={{ zIndex: 7 }}
            />

            <style>{`
              .range-two { pointer-events: none; }
              .range-two::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                height: 18px;
                width: 18px;
                border-radius: 9999px;
                background: #ffffff;
                border: 2px solid #2563eb;
                box-shadow: 0 10px 25px rgba(37, 99, 235, 0.22);
                cursor: grab;
                pointer-events: auto;
                transition: transform 0.12s ease;
              }
              .range-two:active::-webkit-slider-thumb {
                cursor: grabbing;
                transform: scale(1.08);
              }
              .range-two::-moz-range-thumb {
                height: 18px;
                width: 18px;
                border-radius: 9999px;
                background: #ffffff;
                border: 2px solid #2563eb;
                box-shadow: 0 10px 25px rgba(37, 99, 235, 0.22);
                cursor: grab;
                pointer-events: auto;
                transition: transform 0.12s ease;
              }
              .range-two:active::-moz-range-thumb {
                cursor: grabbing;
                transform: scale(1.08);
              }
              .range-two::-webkit-slider-runnable-track { height: 0px; }
              .range-two::-moz-range-track { height: 0px; }
            `}</style>
          </div>

          <div className="mt-1 flex items-center justify-between text-xs text-gray-500">
            <span>
              {min} {unit}
            </span>
            <span>
              {max} {unit}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    // <div className="min-h-screen relative flex items-center justify-center px-4 py-10">
    <div className="relative flex items-center justify-center px-4 pt-6 pb-10 min-h-[calc(100vh-var(--nav-h))]">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/anhnen.jpg')" }}
      />
      <div className="absolute inset-0 bg-black/30" />

      <form
        onSubmit={handleSearch}
        className="relative w-full max-w-6xl overflow-hidden rounded-2xl border border-white/60 bg-white/70 shadow-xl backdrop-blur-xl"
      >
        {/* Header */}
        <div className="px-6 py-6 md:px-10 md:py-8 border-b border-gray-200/70">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
            Tìm kiếm bất động sản
          </h2>
          <p className="mt-1 text-sm md:text-base text-gray-600">
            Chọn loại tìm kiếm, nhập keyword và lọc theo nhu cầu.
          </p>

          {/* Tabs */}
          <div className="mt-5 inline-flex rounded-2xl bg-white/70 p-1 border border-gray-200">
            {[
              { key: "du-an", label: "Dự án" },
              { key: "mua-nha", label: "Mua nhà" },
              { key: "thue-nha", label: "Thuê nhà" },
            ].map((t) => {
              const active = loaiTim === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setLoaiTim(t.key)}
                  className={[
                    "px-4 py-2 text-sm font-semibold rounded-xl transition",
                    active
                      ? "bg-blue-600 text-white shadow"
                      : "text-gray-700 hover:bg-gray-50",
                  ].join(" ")}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6 md:px-10 md:py-8 space-y-6">
          {/* COMMON: KEYWORD + KHU VỰC */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Keyword */}
            <div className="md:col-span-8">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Từ khoá
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="M21 21l-4.3-4.3" />
                  </svg>
                </span>

                <input
                  type="text"
                  placeholder="VD: chung cư quận 1, dự án quận 9, nhà cho thuê..."
                  className="w-full rounded-xl border border-gray-200 bg-white px-10 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>
            </div>

            {/* Khu vực */}
            <div className="md:col-span-4">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Khu vực
              </label>
              <select
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                value={khuVuc}
                onChange={(e) => setKhuVuc(e.target.value)}
              >
                <option value="">Tỉnh / Thành</option>
                {TINH_THANH.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ====== PANEL: DỰ ÁN ====== */}
          {loaiTim === "du-an" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-4">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Loại
                  </label>
                  <select
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    value={duAnLoai}
                    onChange={(e) => setDuAnLoai(e.target.value)}
                  >
                    {DU_AN_LOAI_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-4">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Tình trạng
                  </label>
                  <select
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    value={duAnTinhTrang}
                    onChange={(e) => setDuAnTinhTrang(e.target.value)}
                  >
                    {DU_AN_TINH_TRANG_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-4">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Tiến độ
                  </label>
                  <select
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    value={duAnTienDo}
                    onChange={(e) => setDuAnTienDo(e.target.value)}
                  >
                    {DU_AN_TIEN_DO_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <RangeTwoThumb
                label="Khoảng giá (Dự án)"
                unit="tỷ"
                min={1}
                max={20}
                gap={1}
                value={duAnGia}
                onChange={setDuAnGia}
              />
            </div>
          )}

          {/* ====== PANEL: MUA NHÀ ====== */}
          {loaiTim === "mua-nha" && (
            <div className="space-y-4">
              <RangeTwoThumb
                label="Khoảng giá (Mua nhà)"
                unit="tỷ"
                min={1}
                max={20}
                gap={1}
                value={muaGia}
                onChange={setMuaGia}
              />

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-6">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Đặc điểm
                  </label>
                  <select
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    value={muaDacDiem}
                    onChange={(e) => setMuaDacDiem(e.target.value)}
                  >
                    {DAC_DIEM_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-6">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Sản phẩm
                  </label>
                  <select
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    value={muaSanPham}
                    onChange={(e) => setMuaSanPham(e.target.value)}
                  >
                    {SAN_PHAM_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ====== PANEL: THUÊ NHÀ ====== */}
          {loaiTim === "thue-nha" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-6">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Thời gian thuê
                  </label>
                  <select
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    value={thueThoiGian}
                    onChange={(e) => setThueThoiGian(e.target.value)}
                  >
                    {THUE_THOI_GIAN_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-6">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Sản phẩm
                  </label>
                  <select
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    value={thueSanPham}
                    onChange={(e) => setThueSanPham(e.target.value)}
                  >
                    {SAN_PHAM_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <RangeTwoThumb
                label="Khoảng giá (Thuê nhà)"
                unit="triệu"
                min={1}
                max={50}
                gap={1}
                value={thueGia}
                onChange={setThueGia}
              />

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-12">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Đặc điểm
                  </label>
                  <select
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    value={thueDacDiem}
                    onChange={(e) => setThueDacDiem(e.target.value)}
                  >
                    {DAC_DIEM_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col md:flex-row gap-3">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 md:w-auto"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              Tìm kiếm
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-200/60 md:w-auto"
            >
              Reset lọc
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}