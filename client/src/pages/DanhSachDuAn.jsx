import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { sampleProjects } from "../hook/chitietduan";

/* ===== Utils ===== */
const formatPriceShort = (vnd) => {
  if (!Number.isFinite(vnd)) return "—";
  if (vnd >= 1_000_000_000) return `${(vnd / 1_000_000_000).toFixed(1)} tỷ`;
  if (vnd >= 1_000_000) return `${Math.round(vnd / 1_000_000)} triệu`;
  return vnd.toLocaleString("vi-VN") + " ₫";
};
const getGiaTy = (priceFrom = 0) => priceFrom / 1_000_000_000;

// map location -> slug khu vực (dựa theo chuỗi location)
const getKhuVucDuAn = (location = "") => {
  const lower = location.toLowerCase();

  if (lower.includes("quận 1")) return "quan-1";
  if (lower.includes("quận 7")) return "quan-7";
  if (lower.includes("thảo điền")) return "quan-2";
  if (lower.includes("quận 2")) return "quan-2";
  if (
    lower.includes("thủ đức") ||
    lower.includes("tp. thủ đức") ||
    lower.includes("tp thủ đức")
  )
    return "thu-duc";
  if (lower.includes("bình thạnh")) return "binh-thanh";
  if (lower.includes("phú nhuận")) return "phu-nhuan";

  // fallback: lấy cụm sau dấu phẩy
  const parts = lower
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
  if (parts.length >= 2) return parts[parts.length - 2].replace(/\s+/g, "-");
  return "khac";
};

/* ===== Options (khớp dữ liệu type mới) ===== */
const TYPE_OPTS = [
  { value: "", label: "Tất cả loại dự án" },
  { value: "can-ho", label: "Căn Hộ" },
  { value: "biet-thu", label: "Biệt Thự" },
  { value: "dat-nen", label: "Đất Nền" },
  { value: "shophouse", label: "ShopHouse" },
  { value: "hotel-resort", label: "Hotel-Resort" },
];

const KV_OPTS = [
  { value: "", label: "Tất cả khu vực" },
  { value: "quan-1", label: "Quận 1" },
  { value: "quan-2", label: "Quận 2 (Thảo Điền)" },
  { value: "thu-duc", label: "TP. Thủ Đức" },
  { value: "quan-7", label: "Quận 7" },
  { value: "binh-thanh", label: "Bình Thạnh" },
  { value: "phu-nhuan", label: "Phú Nhuận" },
  { value: "khac", label: "Khác" },
];

const STATUS_OPTS = [
  { value: "", label: "Tất cả tình trạng" },
  { value: "dang-mo-ban", label: "Đang mở bán" },
  { value: "dang-ban", label: "Đang bán" },
  { value: "sap-mo-ban", label: "Sắp mở bán" },
  { value: "da-ban-giao", label: "Đã bàn giao" },
];

const PRICE_OPTS = [
  { value: "", label: "Tất cả mức giá" },
  { value: "0-2", label: "Dưới 2 tỷ" },
  { value: "2-5", label: "2 – 5 tỷ" },
  { value: "5-10", label: "5 – 10 tỷ" },
  { value: "10-1000", label: "Trên 10 tỷ" },
];

/* ===== Normalize ===== */
const norm = (s = "") => s.toLowerCase().trim();

/* ===== Mapping type/status để filter đúng ===== */
const typeToSlug = (type = "") => {
  const t = norm(type);

  // Khớp đúng với data mới: "Căn Hộ | Biệt Thự | Đất Nền | ShopHouse | Hotel-Resort"
  if (t === "căn hộ" || t === "can hộ" || t === "can ho") return "can-ho";
  if (t === "biệt thự" || t === "biet thự" || t === "biet thu")
    return "biet-thu";
  if (t === "đất nền" || t === "dat nền" || t === "dat nen") return "dat-nen";
  if (t === "shophouse") return "shophouse";
  if (t === "hotel-resort" || t === "hotel resort") return "hotel-resort";

  return "";
};

const statusToSlug = (status = "") => {
  const s = norm(status);
  if (s.includes("đang mở bán")) return "dang-mo-ban";
  if (s.includes("đang bán")) return "dang-ban";
  if (s.includes("sắp")) return "sap-mo-ban";
  if (s.includes("đã bàn giao") || s.includes("ban giao")) return "da-ban-giao";
  return "";
};

/** ===== UI atoms (đồng bộ dropdown) ===== */
function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1 block text-xs font-medium text-xanh-than/80">
          {label}
        </span>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="
            w-full appearance-none rounded-xl border border-xanh-than/15 bg-white
            px-3 py-2.5 pr-10 text-sm text-xanh-than
            outline-none transition
            focus:border-xanh-than/45 focus:ring-2 focus:ring-xanh-than/15
          "
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xanh-than/60">
          ▾
        </span>
      </div>
    </label>
  );
}

function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-xanh-than/15 bg-xanh-than/5 px-3 py-1 text-xs text-xanh-than">
      {children}
    </span>
  );
}

export default function DanhSachDuAn() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  // URL params
  const type = searchParams.get("type") || "";
  const khuVuc = searchParams.get("khu_vuc") || "";
  const status = searchParams.get("status") || "";
  const price = searchParams.get("price") || "";
  const q = searchParams.get("q") || "";

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value) next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  const resetAll = () => setSearchParams({}, { replace: true });

  /* ===== FILTER ===== */
  const filteredProjects = useMemo(() => {
    let result = [...sampleProjects];

    // Keyword
    if (q.trim()) {
      const kw = q.trim().toLowerCase();
      result = result.filter((p) => {
        const name = (p.name || "").toLowerCase();
        const loc = (p.location || "").toLowerCase();
        const dev = (p.developer || "").toLowerCase();
        return name.includes(kw) || loc.includes(kw) || dev.includes(kw);
      });
    }

    // Type (khớp type mới)
    if (type) {
      result = result.filter((p) => typeToSlug(p.type) === type);
    }

    // Khu vực
    if (khuVuc) {
      result = result.filter((p) => getKhuVucDuAn(p.location) === khuVuc);
    }

    // Status
    if (status) {
      result = result.filter((p) => statusToSlug(p.status) === status);
    }

    // Price (tỷ) theo priceFrom
    if (price) {
      const [min, max] = price.split("-").map(Number);
      result = result.filter((p) => {
        const giaTy = getGiaTy(p.priceFrom);
        return giaTy >= min && giaTy <= max;
      });
    }

    return result;
  }, [type, khuVuc, status, price, q]);

  /* ===== Fake loading ===== */
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 220);
    return () => clearTimeout(t);
  }, [type, khuVuc, status, price, q]);

  const activeCount = [type, khuVuc, status, price, q].filter(Boolean).length;

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-7 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-xanh-than">
          Danh sách Dự án
        </h1>
        <p className="mt-2 text-sm text-xanh-than/70">
          Lọc theo nhu cầu và xem chi tiết dự án
        </p>
      </div>

      {/* Filter bar */}
      <div className="mb-8 rounded-2xl border border-xanh-than/10 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4">
          {/* Search + actions */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xanh-than/50">
                  🔎
                </span>
                <input
                  value={q}
                  onChange={(e) => updateParam("q", e.target.value)}
                  placeholder="Tìm theo tên dự án, khu vực hoặc chủ đầu tư..."
                  className="
                    w-full rounded-xl border border-xanh-than/15 bg-white
                    px-10 py-2.5 text-sm text-xanh-than
                    outline-none transition
                    focus:border-xanh-than/45 focus:ring-2 focus:ring-xanh-than/15
                  "
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 md:justify-end">
              <div className="text-sm text-xanh-than/70">
                <span className="font-semibold text-xanh-than">
                  {filteredProjects.length}
                </span>{" "}
                kết quả
              </div>

              <button
                onClick={resetAll}
                className="
                  rounded-xl border border-xanh-than/15 bg-white px-4 py-2.5 text-sm
                  text-xanh-than transition hover:bg-xanh-than/5
                  focus:outline-none focus:ring-2 focus:ring-xanh-than/15
                "
              >
                Reset{activeCount ? ` (${activeCount})` : ""}
              </button>
            </div>
          </div>

          {/* Dropdowns */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Select
              label="Loại dự án"
              value={type}
              onChange={(e) => updateParam("type", e.target.value)}
              options={TYPE_OPTS}
            />
            <Select
              label="Khu vực"
              value={khuVuc}
              onChange={(e) => updateParam("khu_vuc", e.target.value)}
              options={KV_OPTS}
            />
            <Select
              label="Tình trạng"
              value={status}
              onChange={(e) => updateParam("status", e.target.value)}
              options={STATUS_OPTS}
            />
            <Select
              label="Mức giá (giá từ)"
              value={price}
              onChange={(e) => updateParam("price", e.target.value)}
              options={PRICE_OPTS}
            />
          </div>

          {/* Active chips */}
          {activeCount > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {q && (
                <Chip>
                  Từ khoá: <b className="ml-1">{q}</b>
                </Chip>
              )}
              {type && (
                <Chip>
                  Loại:{" "}
                  <b className="ml-1">
                    {TYPE_OPTS.find((x) => x.value === type)?.label}
                  </b>
                </Chip>
              )}
              {khuVuc && (
                <Chip>
                  Khu vực:{" "}
                  <b className="ml-1">
                    {KV_OPTS.find((x) => x.value === khuVuc)?.label}
                  </b>
                </Chip>
              )}
              {status && (
                <Chip>
                  Tình trạng:{" "}
                  <b className="ml-1">
                    {STATUS_OPTS.find((x) => x.value === status)?.label}
                  </b>
                </Chip>
              )}
              {price && (
                <Chip>
                  Giá:{" "}
                  <b className="ml-1">
                    {PRICE_OPTS.find((x) => x.value === price)?.label}
                  </b>
                </Chip>
              )}
            </div>
          )}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <p className="text-center text-xanh-than/70">Đang tải dữ liệu...</p>
      ) : filteredProjects.length === 0 ? (
        <div className="rounded-2xl border border-xanh-than/10 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-xanh-than">
            Không có dự án phù hợp
          </p>
          <p className="mt-2 text-sm text-xanh-than/70">
            Thử đổi bộ lọc hoặc bấm Reset để xem lại toàn bộ.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          {filteredProjects.map((p) => (
            <Link
              key={p.id}
              to={`/ProjectDetail/${p.id}`}
              className="
                group rounded-2xl overflow-hidden border border-xanh-than/10
                bg-white shadow-sm transition hover:shadow-lg
              "
            >
              <div className="relative overflow-hidden">
                <img
                  src={p.images?.[0] ?? "/house1.jpg"}
                  alt={p.name}
                  className="h-48 w-full object-cover transition group-hover:scale-[1.04]"
                />
                <div className="absolute left-3 top-3 rounded-full border border-xanh-than/15 bg-white/90 px-3 py-1 text-xs text-xanh-than">
                  🏙 {p.type}
                </div>
                <div className="absolute right-3 top-3 rounded-full border border-xanh-than/15 bg-white/90 px-3 py-1 text-xs text-xanh-than">
                  🏗 {p.status}
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-xanh-than line-clamp-2">
                  {p.name}
                </h3>

                <p className="mt-1 text-sm text-xanh-than/70 line-clamp-1">
                  📍 {p.location}
                </p>

                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-xanh-than/5 border border-xanh-than/10 px-2.5 py-1 text-xanh-than">
                    🏢 {p.developer}
                  </span>
                  <span className="rounded-full bg-xanh-than/5 border border-xanh-than/10 px-2.5 py-1 text-xanh-than">
                    📦 {p.handover}
                  </span>
                  <span className="rounded-full bg-xanh-than/5 border border-xanh-than/10 px-2.5 py-1 text-xanh-than">
                    📐 {p.minArea}–{p.maxArea} m²
                  </span>
                </div>

                <div className="mt-3 flex items-end justify-between">
                  <p className="font-extrabold text-xanh-than">
                    Giá từ {formatPriceShort(p.priceFrom)}
                  </p>
                  <span className="text-xs text-xanh-than/50 transition group-hover:text-xanh-than/80">
                    Xem chi tiết →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

