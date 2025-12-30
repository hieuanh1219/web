import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { sampleRentals } from "../hook/nhachothue";


/* ===== Utils ===== */
const formatPrice = (vnd) =>
  (Number(vnd) || 0).toLocaleString("vi-VN") + " ₫/tháng";
const getGiaTrieu = (price = 0) => price / 1_000_000;

const norm = (s = "") => s.toLowerCase().trim();
const periodToSlug = (p = "") => {
  const x = norm(p);
  if (x.includes("ngắn")) return "ngan-han";
  if (x.includes("dài")) return "dai-han";
  return "";
};
const typeToSlug = (t = "") => {
  const x = norm(t);
  if (x.includes("căn")) return "can-ho";
  if (x.includes("nhà phố") || x.includes("nha pho")) return "nha-pho";
  if (x.includes("biệt thự") || x.includes("biet thu")) return "biet-thu";
  if (x.includes("văn phòng") || x.includes("van phong")) return "van-phong";
  if (x.includes("shophouse")) return "shophouse";
  if (x.includes("nhà xưởng") || x.includes("nha xuong")) return "nha-xuong";
  return "";
};

const hasFeature = (rental, featureSlug) => {
  const d = rental?.details || {};
  const blob = [
    rental?.name,
    rental?.address,
    rental?.type,
    rental?.rentalPeriod,
    d?.overview,
    d?.notes,
    ...(d?.highlights || []),
    ...(d?.amenities || []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const match = {
    "full-noi-that": ["full nội thất", "full noi that"],
    "gan-metro": ["metro", "ga metro"],
    "san-vuon": ["sân vườn", "san vuon", "garden"],
    "view-song": ["view sông", "ven sông", "song"],
    "xe-hoi": ["xe hơi", "xe hoi", "đường rộng", "hem xe hoi"],
    "dien-3-pha": ["điện 3 pha", "dien 3 pha", "3 pha"],
  };

  const keys = match[featureSlug] || [];
  return keys.some((k) => blob.includes(k));
};

/** ===== Options ===== */
const PERIOD_OPTS = [
  { value: "", label: "Tất cả thời gian thuê" },
  { value: "ngan-han", label: "Ngắn hạn" },
  { value: "dai-han", label: "Dài hạn" },
];

const TYPE_OPTS = [
  { value: "", label: "Tất cả loại hình" },
  { value: "can-ho", label: "Căn Hộ" },
  { value: "nha-pho", label: "Nhà Phố" },
  { value: "biet-thu", label: "Biệt Thự" },
  { value: "van-phong", label: "Văn Phòng" },
  { value: "shophouse", label: "ShopHouse" },
  { value: "nha-xuong", label: "Nhà Xưởng" },
];

const PRICE_OPTS = [
  { value: "", label: "Tất cả mức giá" },
  { value: "0-10", label: "Dưới 10 triệu" },
  { value: "10-20", label: "10 – 20 triệu" },
  { value: "20-40", label: "20 – 40 triệu" },
  { value: "40-70", label: "40 – 70 triệu" },
  { value: "70-1000", label: "Trên 70 triệu" },
];

const FEATURE_OPTS = [
  { value: "", label: "Tất cả đặc điểm" },
  { value: "full-noi-that", label: "Full nội thất" },
  { value: "gan-metro", label: "Gần Metro" },
  { value: "san-vuon", label: "Có sân vườn" },
  { value: "view-song", label: "View sông" },
  { value: "xe-hoi", label: "Đường/Hẻm xe hơi" },
  { value: "dien-3-pha", label: "Điện 3 pha" },
];

/** ===== UI atoms ===== */
function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      {label && (
        <span className="mb-1 block text-xs font-medium text-white/90">
          {label}
        </span>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="
            w-full appearance-none rounded-xl border border-white/20
            bg-white/90 px-3 py-2.5 pr-10 text-sm text-slate-900
            outline-none transition
            focus:border-white/40 focus:ring-2 focus:ring-white/25
          "
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-700/70">
          ▾
        </span>
      </div>
    </label>
  );
}

function Chip({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white backdrop-blur">
      {children}
    </span>
  );
}

function RentalCard({ r }) {
  const cover = (r.images?.[0] || r.image) ?? "/house1.jpg";
  return (
    <Link
      to={`/rent/${r.id}`} // nếu chưa có detail thì đổi route cho đúng
      className="
        group rounded-2xl overflow-hidden border border-white/10
        bg-white/90 shadow-sm transition hover:shadow-xl hover:-translate-y-0.5
        backdrop-blur
      "
    >
      <div className="relative overflow-hidden">
        <img
          src={cover}
          alt={r.name}
          className="h-48 w-full object-cover transition group-hover:scale-[1.04]"
        />

        {r.type && (
          <div className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/35 px-3 py-1 text-xs text-white backdrop-blur">
            🏷 {r.type}
          </div>
        )}

        {r.rentalPeriod && (
          <div className="absolute right-3 top-3 rounded-full border border-white/20 bg-black/35 px-3 py-1 text-xs text-white backdrop-blur">
            ⏱ {r.rentalPeriod}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-slate-900 line-clamp-2">{r.name}</h3>
        <p className="mt-1 text-sm text-slate-600 line-clamp-1">
          📍 {r.address}
        </p>

        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-1 text-slate-700">
            📐 {r.area} m²
          </span>
          {Number(r.bedrooms) > 0 && (
            <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-1 text-slate-700">
              🛏 {r.bedrooms} PN
            </span>
          )}
          <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-1 text-slate-700">
            🚿 {r.bathrooms} WC
          </span>
          {r.direction && (
            <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-1 text-slate-700">
              🧭 {r.direction}
            </span>
          )}
        </div>

        <div className="mt-3 flex items-end justify-between">
          <p className="font-extrabold text-slate-900">
            {formatPrice(r.price)}
          </p>
          <span className="text-xs text-slate-500 transition group-hover:text-slate-700">
            Xem chi tiết →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function DanhSachThueNha() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  // URL params
  const q = searchParams.get("q") || "";
  const type = searchParams.get("type") || "";
  const rentalPeriod = searchParams.get("rental_period") || "";
  const price = searchParams.get("price") || "";
  const feature = searchParams.get("feature") || "";

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value) next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  const resetAll = () => setSearchParams({}, { replace: true });

  const filtered = useMemo(() => {
    let result = [...sampleRentals];

    // keyword
    if (q.trim()) {
      const kw = q.trim().toLowerCase();
      result = result.filter((r) => {
        const name = (r.name || "").toLowerCase();
        const addr = (r.address || "").toLowerCase();
        const d = r.details || {};
        const extra = [
          d.overview,
          d.notes,
          ...(d.highlights || []),
          ...(d.amenities || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return name.includes(kw) || addr.includes(kw) || extra.includes(kw);
      });
    }

    // type
    if (type) result = result.filter((r) => typeToSlug(r.type) === type);

    // rental period
    if (rentalPeriod)
      result = result.filter(
        (r) => periodToSlug(r.rentalPeriod) === rentalPeriod
      );

    // price (triệu/tháng)
    if (price) {
      const [min, max] = price.split("-").map(Number);
      result = result.filter((r) => {
        const trieu = getGiaTrieu(r.price);
        return trieu >= min && trieu <= max;
      });
    }

    // feature
    if (feature) result = result.filter((r) => hasFeature(r, feature));

    return result;
  }, [q, type, rentalPeriod, price, feature]);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 220);
    return () => clearTimeout(t);
  }, [q, type, rentalPeriod, price, feature]);

  const activeCount = [q, type, rentalPeriod, price, feature].filter(
    Boolean
  ).length;

  // ✅ đổi ảnh nền ở đây (đặt ảnh vào public: /bg-rent.jpg)
  const BG_URL = "/nenthuenha/anh1.jpg";

  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      {/* ===== HERO + FILTER ON IMAGE ===== */}
      <section
        className="relative pt-28 pb-10"
        style={{
          backgroundImage: `url(${BG_URL})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* overlay */}
        <div className="absolute inset-0 bg-black/55" />
        {/* soft gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/55 to-slate-950/90" />

        <div className="relative container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Thuê nhà theo nhu cầu của bạn
            </h1>
            <p className="mt-3 text-sm md:text-base text-white/85">
              Tìm nhanh theo từ khoá, lọc theo loại hình, thời gian thuê, giá và
              đặc điểm.
            </p>
          </div>

          {/* Glass filter card */}
          <div className="mt-6 mx-auto w-full max-w-4xl rounded-2xl border border-white/15 bg-white/10 p-3 md:p-4 shadow-2xl backdrop-blur">
            <div className="flex flex-col gap-3">
              {/* Search + actions */}
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="flex-1">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70">
                      🔎
                    </span>
                    <input
                      value={q}
                      onChange={(e) => updateParam("q", e.target.value)}
                      placeholder="Tìm theo tên, địa chỉ, tiện ích..."
                      className="
              w-full rounded-xl border border-white/20 bg-white/90
              px-9 py-2 text-sm text-slate-900
              outline-none transition
              focus:border-white/40 focus:ring-2 focus:ring-white/25
            "
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 md:justify-end">
                  <div className="text-sm text-white/85">
                    <span className="font-semibold text-white">
                      {filtered.length}
                    </span>{" "}
                    kết quả
                  </div>

                  <button
                    onClick={resetAll}
                    className="
            rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm
            text-white transition hover:bg-white/15
            focus:outline-none focus:ring-2 focus:ring-white/25
          "
                  >
                    Reset{activeCount ? ` (${activeCount})` : ""}
                  </button>
                </div>
              </div>

              {/* Dropdowns (compact) */}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
                <Select
                  label="Loại hình"
                  value={type}
                  onChange={(e) => updateParam("type", e.target.value)}
                  options={TYPE_OPTS}
                />
                <Select
                  label="Thời gian thuê"
                  value={rentalPeriod}
                  onChange={(e) => updateParam("rental_period", e.target.value)}
                  options={PERIOD_OPTS}
                />
                <Select
                  label="Khoảng giá"
                  value={price}
                  onChange={(e) => updateParam("price", e.target.value)}
                  options={PRICE_OPTS}
                />
                <Select
                  label="Đặc điểm"
                  value={feature}
                  onChange={(e) => updateParam("feature", e.target.value)}
                  options={FEATURE_OPTS}
                />
              </div>

              {/* Active chips (compact) */}
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
                  {rentalPeriod && (
                    <Chip>
                      Thời gian:{" "}
                      <b className="ml-1">
                        {
                          PERIOD_OPTS.find((x) => x.value === rentalPeriod)
                            ?.label
                        }
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
                  {feature && (
                    <Chip>
                      Đặc điểm:{" "}
                      <b className="ml-1">
                        {FEATURE_OPTS.find((x) => x.value === feature)?.label}
                      </b>
                    </Chip>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== LIST AREA ===== */}
      <section className="bg-slate-950 flex-1">
        <div className="container mx-auto px-4 py-10">
          {loading ? (
            <p className="text-center text-white/80">Đang tải dữ liệu...</p>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center shadow-sm text-white/90">
              <p className="text-lg font-semibold">Không có sản phẩm phù hợp</p>
              <p className="mt-2 text-sm text-white/70">
                Thử đổi bộ lọc hoặc bấm Reset để xem lại toàn bộ.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
              {filtered.map((r) => (
                <RentalCard key={r.id} r={r} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
