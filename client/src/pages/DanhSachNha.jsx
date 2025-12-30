// import { useEffect, useMemo, useState } from "react";
// import { useSearchParams, Link } from "react-router-dom";
// import { sampleProducts } from "../hook/chitietsanpham";

// const formatPrice = (price) => price.toLocaleString("vi-VN") + " ₫";

// /* ===== Utils ===== */
// const getKhuVuc = (address = "") => {
//   const lower = address.toLowerCase();
//   if (lower.includes("quận 1")) return "quan-1";
//   if (lower.includes("quận 7")) return "quan-7";
//   if (lower.includes("thủ đức") || lower.includes("thảo điền")) return "quan-2";
//   if (lower.includes("phú nhuận")) return "phu-nhuan";
//   if (lower.includes("gò vấp")) return "go-vap";
//   return "khac";
// };
// const getGiaTy = (price) => price / 1_000_000_000;

// const KIEU_OPTS = [
//   { value: "", label: "Tất cả loại hình" },
//   { value: "chung-cu", label: "Căn hộ / Chung cư" },
//   { value: "nha-pho", label: "Nhà phố" },
//   { value: "biet-thu", label: "Biệt thự" },
// ];
// const KV_OPTS = [
//   { value: "", label: "Tất cả khu vực" },
//   { value: "quan-1", label: "Quận 1" },
//   { value: "quan-2", label: "Quận 2 (Thảo Điền / Thủ Đức)" },
//   { value: "quan-7", label: "Quận 7" },
//   { value: "phu-nhuan", label: "Phú Nhuận" },
//   { value: "go-vap", label: "Gò Vấp" },
//   { value: "khac", label: "Khác" },
// ];
// const TT_OPTS = [
//   { value: "", label: "Tất cả tình trạng" },
//   { value: "new", label: "Mới" },
//   { value: "old", label: "Cũ" },
// ];
// const GIA_OPTS = [
//   { value: "", label: "Tất cả mức giá" },
//   { value: "0-2", label: "Dưới 2 tỷ" },
//   { value: "2-5", label: "2 – 5 tỷ" },
//   { value: "5-10", label: "5 – 10 tỷ" },
//   { value: "10-1000", label: "Trên 10 tỷ" },
// ];

// /** ===== UI atoms (đồng bộ dropdown) ===== */
// function Select({ label, value, onChange, options }) {
//   return (
//     <label className="block">
//       {label && (
//         <span className="mb-1 block text-xs font-medium text-xanh-than/80">
//           {label}
//         </span>
//       )}
//       <div className="relative">
//         <select
//           value={value}
//           onChange={onChange}
//           className="
//             w-full appearance-none rounded-xl border border-xanh-than/15 bg-white
//             px-3 py-2.5 pr-10 text-sm text-xanh-than
//             outline-none transition
//             focus:border-xanh-than/45 focus:ring-2 focus:ring-xanh-than/15
//           "
//         >
//           {options.map((o) => (
//             <option key={o.value} value={o.value}>
//               {o.label}
//             </option>
//           ))}
//         </select>

//         <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xanh-than/60">
//           ▾
//         </span>
//       </div>
//     </label>
//   );
// }

// function Chip({ children }) {
//   return (
//     <span className="inline-flex items-center rounded-full border border-xanh-than/15 bg-xanh-than/5 px-3 py-1 text-xs text-xanh-than">
//       {children}
//     </span>
//   );
// }

// export default function DanhSachNha() {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [loading, setLoading] = useState(false);

//   // URL params
//   const kieu = searchParams.get("kieu") || "";
//   const khuVuc = searchParams.get("khu_vuc") || "";
//   const tinhTrang = searchParams.get("tinh_trang") || "";
//   const gia = searchParams.get("gia") || "";
//   const q = searchParams.get("q") || "";

//   const updateParam = (key, value) => {
//     const next = new URLSearchParams(searchParams);
//     if (!value) next.delete(key);
//     else next.set(key, value);
//     setSearchParams(next, { replace: true });
//   };

//   const resetAll = () => setSearchParams({}, { replace: true });

//   /* ===== FILTER ===== */
//   const filteredProducts = useMemo(() => {
//     let result = [...sampleProducts];

//     // Keyword
//     if (q.trim()) {
//       const kw = q.trim().toLowerCase();
//       result = result.filter((p) => {
//         const name = (p.name || "").toLowerCase();
//         const addr = (p.address || "").toLowerCase();
//         return name.includes(kw) || addr.includes(kw);
//       });
//     }

//     // Loại hình
//     if (kieu) {
//       result = result.filter((p) => {
//         const name = (p.name || "").toLowerCase();
//         if (kieu === "chung-cu") return name.includes("căn hộ");
//         if (kieu === "nha-pho") return name.includes("nhà phố");
//         if (kieu === "biet-thu") return name.includes("biệt thự");
//         return true;
//       });
//     }

//     // Khu vực
//     if (khuVuc) {
//       result = result.filter((p) => getKhuVuc(p.address) === khuVuc);
//     }

//     // Tình trạng (fake)
//     if (tinhTrang) {
//       result = result.filter((p) =>
//         tinhTrang === "new" ? p.id % 2 === 0 : p.id % 2 !== 0
//       );
//     }

//     // Giá (tỷ)
//     if (gia) {
//       const [min, max] = gia.split("-").map(Number);
//       result = result.filter((p) => {
//         const giaTy = getGiaTy(p.price);
//         return giaTy >= min && giaTy <= max;
//       });
//     }

//     return result;
//   }, [kieu, khuVuc, tinhTrang, gia, q]);

//   /* ===== Fake loading ===== */
//   useEffect(() => {
//     setLoading(true);
//     const t = setTimeout(() => setLoading(false), 220);
//     return () => clearTimeout(t);
//   }, [kieu, khuVuc, tinhTrang, gia, q]);

//   const activeCount = [kieu, khuVuc, tinhTrang, gia, q].filter(Boolean).length;

//   return (
//     <div className="container mx-auto px-4 py-10">
//       {/* Header */}
//       <div className="mb-7 text-center">
//         <h1 className="text-3xl font-extrabold tracking-tight text-xanh-than">
//           Danh sách Nhà
//         </h1>
//         <p className="mt-2 text-sm text-xanh-than/70">
//           Lọc theo nhu cầu và xem chi tiết sản phẩm
//         </p>
//       </div>

//       {/* Filter bar */}
//       <div className="mb-8 rounded-2xl border border-xanh-than/10 bg-white p-4 shadow-sm">
//         <div className="flex flex-col gap-4">
//           {/* Search + actions */}
//           <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//             <div className="flex-1">
//               <div className="relative">
//                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xanh-than/50">
//                   🔎
//                 </span>
//                 <input
//                   value={q}
//                   onChange={(e) => updateParam("q", e.target.value)}
//                   placeholder="Tìm theo tên hoặc địa chỉ..."
//                   className="
//                     w-full rounded-xl border border-xanh-than/15 bg-white
//                     px-10 py-2.5 text-sm text-xanh-than
//                     outline-none transition
//                     focus:border-xanh-than/45 focus:ring-2 focus:ring-xanh-than/15
//                   "
//                 />
//               </div>
//             </div>

//             <div className="flex items-center justify-between gap-3 md:justify-end">
//               <div className="text-sm text-xanh-than/70">
//                 <span className="font-semibold text-xanh-than">
//                   {filteredProducts.length}
//                 </span>{" "}
//                 kết quả
//               </div>

//               <button
//                 onClick={resetAll}
//                 className="
//                   rounded-xl border border-xanh-than/15 bg-white px-4 py-2.5 text-sm
//                   text-xanh-than transition hover:bg-xanh-than/5
//                   focus:outline-none focus:ring-2 focus:ring-xanh-than/15
//                 "
//               >
//                 Reset{activeCount ? ` (${activeCount})` : ""}
//               </button>
//             </div>
//           </div>

//           {/* Dropdowns (đồng bộ) */}
//           <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
//             <Select
//               label="Loại hình"
//               value={kieu}
//               onChange={(e) => updateParam("kieu", e.target.value)}
//               options={KIEU_OPTS}
//             />
//             <Select
//               label="Khu vực"
//               value={khuVuc}
//               onChange={(e) => updateParam("khu_vuc", e.target.value)}
//               options={KV_OPTS}
//             />
//             <Select
//               label="Tình trạng"
//               value={tinhTrang}
//               onChange={(e) => updateParam("tinh_trang", e.target.value)}
//               options={TT_OPTS}
//             />
//             <Select
//               label="Mức giá"
//               value={gia}
//               onChange={(e) => updateParam("gia", e.target.value)}
//               options={GIA_OPTS}
//             />
//           </div>

//           {/* Active chips */}
//           {activeCount > 0 && (
//             <div className="flex flex-wrap gap-2 pt-1">
//               {q && (
//                 <Chip>
//                   Từ khoá: <b className="ml-1">{q}</b>
//                 </Chip>
//               )}
//               {kieu && (
//                 <Chip>
//                   Loại:{" "}
//                   <b className="ml-1">
//                     {KIEU_OPTS.find((x) => x.value === kieu)?.label}
//                   </b>
//                 </Chip>
//               )}
//               {khuVuc && (
//                 <Chip>
//                   Khu vực:{" "}
//                   <b className="ml-1">
//                     {KV_OPTS.find((x) => x.value === khuVuc)?.label}
//                   </b>
//                 </Chip>
//               )}
//               {tinhTrang && (
//                 <Chip>
//                   Tình trạng:{" "}
//                   <b className="ml-1">
//                     {TT_OPTS.find((x) => x.value === tinhTrang)?.label}
//                   </b>
//                 </Chip>
//               )}
//               {gia && (
//                 <Chip>
//                   Giá:{" "}
//                   <b className="ml-1">
//                     {GIA_OPTS.find((x) => x.value === gia)?.label}
//                   </b>
//                 </Chip>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* List */}
//       {loading ? (
//         <p className="text-center text-xanh-than/70">Đang tải dữ liệu...</p>
//       ) : filteredProducts.length === 0 ? (
//         <div className="rounded-2xl border border-xanh-than/10 bg-white p-10 text-center shadow-sm">
//           <p className="text-lg font-semibold text-xanh-than">
//             Không có sản phẩm phù hợp
//           </p>
//           <p className="mt-2 text-sm text-xanh-than/70">
//             Thử đổi bộ lọc hoặc bấm Reset để xem lại toàn bộ.
//           </p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
//           {filteredProducts.map((p) => (
//             <Link
//               key={p.id}
//               to={`/ProductDetail/${p.id}`}
//               className="
//                 group rounded-2xl overflow-hidden border border-xanh-than/10
//                 bg-white shadow-sm transition hover:shadow-lg
//               "
//             >
//               <div className="relative overflow-hidden">
//                 <img
//                   src={p.images?.[0]}
//                   alt={p.name}
//                   className="h-48 w-full object-cover transition group-hover:scale-[1.04]"
//                 />
//                 <div className="absolute left-3 top-3 rounded-full border border-xanh-than/15 bg-white/90 px-3 py-1 text-xs text-xanh-than">
//                   {getKhuVuc(p.address).replace("-", " ").toUpperCase()}
//                 </div>
//               </div>

//               <div className="p-4">
//                 <h3 className="font-semibold text-xanh-than line-clamp-2">
//                   {p.name}
//                 </h3>
//                 <p className="mt-1 text-sm text-xanh-than/70">📍 {p.address}</p>

//                 <div className="mt-3 flex items-end justify-between">
//                   <p className="font-extrabold text-xanh-than">
//                     {formatPrice(p.price)}
//                   </p>
//                   <span className="text-xs text-xanh-than/50 transition group-hover:text-xanh-than/80">
//                     Xem chi tiết →
//                   </span>
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { sampleProducts } from "../hook/chitietsanpham";

const formatPrice = (price) => price.toLocaleString("vi-VN") + " ₫";

/* ===== Utils ===== */
const getKhuVuc = (address = "") => {
  const lower = address.toLowerCase();
  if (lower.includes("quận 1")) return "quan-1";
  if (lower.includes("quận 7")) return "quan-7";
  if (lower.includes("thủ đức") || lower.includes("thảo điền")) return "quan-2";
  if (lower.includes("phú nhuận")) return "phu-nhuan";
  if (lower.includes("gò vấp")) return "go-vap";
  return "khac";
};
const getGiaTy = (price) => price / 1_000_000_000;

/* ===== TYPE (khớp data mới) ===== */
const TYPE_OPTS = [
  { value: "", label: "Tất cả loại hình" },
  { value: "can-ho", label: "Căn Hộ" },
  { value: "nha-pho", label: "Nhà Phố" },
  { value: "biet-thu", label: "Biệt Thự" },
  { value: "dat-nen", label: "Đất Nền" },
  { value: "shophouse", label: "ShopHouse" },
  { value: "nha-xuong", label: "Nhà Xưởng" },
];

const KV_OPTS = [
  { value: "", label: "Tất cả khu vực" },
  { value: "quan-1", label: "Quận 1" },
  { value: "quan-2", label: "Quận 2 (Thảo Điền / Thủ Đức)" },
  { value: "quan-7", label: "Quận 7" },
  { value: "phu-nhuan", label: "Phú Nhuận" },
  { value: "go-vap", label: "Gò Vấp" },
  { value: "khac", label: "Khác" },
];

const TT_OPTS = [
  { value: "", label: "Tất cả tình trạng" },
  { value: "new", label: "Mới" },
  { value: "old", label: "Cũ" },
];

const GIA_OPTS = [
  { value: "", label: "Tất cả mức giá" },
  { value: "0-2", label: "Dưới 2 tỷ" },
  { value: "2-5", label: "2 – 5 tỷ" },
  { value: "5-10", label: "5 – 10 tỷ" },
  { value: "10-1000", label: "Trên 10 tỷ" },
];

/* ===== normalize + map type ===== */
const norm = (s = "") => s.toLowerCase().trim();
const typeToSlug = (type = "") => {
  const t = norm(type);

  if (t === "căn hộ" || t === "can ho" || t === "can hộ") return "can-ho";
  if (t === "nhà phố" || t === "nha pho") return "nha-pho";
  if (t === "biệt thự" || t === "biet thu" || t === "biet thự")
    return "biet-thu";
  if (t === "đất nền" || t === "dat nen" || t === "dat nền") return "dat-nen";
  if (t === "shophouse") return "shophouse";
  if (t === "nhà xưởng" || t === "nha xuong") return "nha-xuong";

  return "";
};

/** ===== UI atoms ===== */
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

export default function DanhSachNha() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  // URL params (✅ đổi kieu -> type)
  const type = searchParams.get("type") || "";
  const khuVuc = searchParams.get("khu_vuc") || "";
  const tinhTrang = searchParams.get("tinh_trang") || "";
  const gia = searchParams.get("gia") || "";
  const q = searchParams.get("q") || "";

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value) next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  const resetAll = () => setSearchParams({}, { replace: true });

  /* ===== FILTER ===== */
  const filteredProducts = useMemo(() => {
    let result = [...sampleProducts];

    // Keyword
    if (q.trim()) {
      const kw = q.trim().toLowerCase();
      result = result.filter((p) => {
        const name = (p.name || "").toLowerCase();
        const addr = (p.address || "").toLowerCase();
        return name.includes(kw) || addr.includes(kw);
      });
    }

    // Type (✅ dùng field p.type thay vì dò theo name)
    if (type) {
      result = result.filter((p) => typeToSlug(p.type) === type);
    }

    // Khu vực
    if (khuVuc) {
      result = result.filter((p) => getKhuVuc(p.address) === khuVuc);
    }

    // Tình trạng (fake)
    if (tinhTrang) {
      result = result.filter((p) =>
        tinhTrang === "new" ? p.id % 2 === 0 : p.id % 2 !== 0
      );
    }

    // Giá (tỷ)
    if (gia) {
      const [min, max] = gia.split("-").map(Number);
      result = result.filter((p) => {
        const giaTy = getGiaTy(p.price);
        return giaTy >= min && giaTy <= max;
      });
    }

    return result;
  }, [type, khuVuc, tinhTrang, gia, q]);

  /* ===== Fake loading ===== */
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 220);
    return () => clearTimeout(t);
  }, [type, khuVuc, tinhTrang, gia, q]);

  const activeCount = [type, khuVuc, tinhTrang, gia, q].filter(Boolean).length;

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-7 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-xanh-than">
          Danh sách Nhà
        </h1>
        <p className="mt-2 text-sm text-xanh-than/70">
          Lọc theo nhu cầu và xem chi tiết sản phẩm
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
                  placeholder="Tìm theo tên hoặc địa chỉ..."
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
                  {filteredProducts.length}
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
              label="Loại hình"
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
              value={tinhTrang}
              onChange={(e) => updateParam("tinh_trang", e.target.value)}
              options={TT_OPTS}
            />
            <Select
              label="Mức giá"
              value={gia}
              onChange={(e) => updateParam("gia", e.target.value)}
              options={GIA_OPTS}
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
              {tinhTrang && (
                <Chip>
                  Tình trạng:{" "}
                  <b className="ml-1">
                    {TT_OPTS.find((x) => x.value === tinhTrang)?.label}
                  </b>
                </Chip>
              )}
              {gia && (
                <Chip>
                  Giá:{" "}
                  <b className="ml-1">
                    {GIA_OPTS.find((x) => x.value === gia)?.label}
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
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-xanh-than/10 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-xanh-than">
            Không có sản phẩm phù hợp
          </p>
          <p className="mt-2 text-sm text-xanh-than/70">
            Thử đổi bộ lọc hoặc bấm Reset để xem lại toàn bộ.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          {filteredProducts.map((p) => (
            <Link
              key={p.id}
              to={`/ProductDetail/${p.id}`}
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

                {/* ✅ Badge type (data mới) */}
                {p.type && (
                  <div className="absolute left-3 top-3 rounded-full border border-xanh-than/15 bg-white/90 px-3 py-1 text-xs text-xanh-than">
                    🏷 {p.type}
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-xanh-than line-clamp-2">
                  {p.name}
                </h3>
                <p className="mt-1 text-sm text-xanh-than/70 line-clamp-1">
                  📍 {p.address}
                </p>

                <div className="mt-3 flex items-end justify-between">
                  <p className="font-extrabold text-xanh-than">
                    {formatPrice(p.price)}
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
