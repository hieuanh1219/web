// import { useMemo, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import { sampleProducts } from "../hook/chitietsanpham";

// const formatPrice = (price) => price.toLocaleString("vi-VN") + " ₫";

// function InfoCard({ label, value, icon }) {
//   return (
//     <div className="p-4 border rounded-xl bg-white shadow-sm">
//       <div className="text-sm text-gray-500 mb-1">
//         {icon} {label}
//       </div>
//       <div className="font-semibold">{value}</div>
//     </div>
//   );
// }

// function RelatedCard({ p }) {
//   const cover = (p.images?.[0] || p.image) ?? "/house1.jpg";

//   return (
//     <Link
//       to={`/ProductDetail/${p.id}`} // ✅ KHỚP route với list/trang chủ của mày
//       className="group block rounded-2xl overflow-hidden border bg-white hover:shadow-lg transition"
//     >
//       <div className="relative overflow-hidden">
//         <img
//           src={cover}
//           alt={p.name}
//           className="h-48 w-full object-cover group-hover:scale-[1.03] transition"
//         />

//         {/* ✅ Badge type */}
//         {p.type && (
//           <div className="absolute left-3 top-3 rounded-full border border-gray-200 bg-white/90 px-3 py-1 text-xs font-medium text-gray-700">
//             🏷 {p.type}
//           </div>
//         )}
//       </div>

//       <div className="p-4">
//         <div className="font-semibold line-clamp-2">{p.name}</div>
//         <div className="text-sm text-gray-500 mt-1 line-clamp-1">
//           📍 {p.address}
//         </div>

//         <div className="mt-3 flex items-center justify-between">
//           <div className="text-blue-600 font-semibold">
//             {formatPrice(p.price)}
//           </div>
//           <div className="text-sm text-gray-500">{p.area} m²</div>
//         </div>
//       </div>
//     </Link>
//   );
// }

// export default function ProductDetail() {
//   const { id } = useParams();
//   const product = useMemo(
//     () => sampleProducts.find((p) => p.id === Number(id)),
//     [id]
//   );

//   const [activeImg, setActiveImg] = useState(0);
//   const [tab, setTab] = useState("overview");

//   if (!product) {
//     return (
//       <p className="text-center mt-10 text-red-500">Không tìm thấy sản phẩm</p>
//     );
//   }

//   const imgs = product.images || [];
//   const currentPrice = product.price;

//   // ✅ Logic: related theo (cùng khu vực) ưu tiên, nếu thiếu thì fallback theo khoảng giá ±25%
//   const relatedProducts = useMemo(() => {
//     const normalizeAreaKey = (addr = "") => {
//       const lower = addr.toLowerCase();
//       if (lower.includes("quận 7")) return "q7";
//       if (lower.includes("thảo điền")) return "thaodien";
//       if (lower.includes("thủ đức")) return "thuduc";
//       if (lower.includes("quận 1")) return "q1";
//       if (lower.includes("bình thạnh")) return "binhthanh";
//       if (lower.includes("phú nhuận")) return "phunhuan";
//       if (lower.includes("tân bình")) return "tanbinh";
//       if (lower.includes("gò vấp")) return "govap";
//       if (lower.includes("bình tân")) return "binhtan";
//       if (lower.includes("quận 12")) return "q12";
//       return lower.split(",").slice(-2).join(",").trim(); // fallback
//     };

//     const key = normalizeAreaKey(product.address);

//     const byArea = sampleProducts
//       .filter((p) => p.id !== product.id)
//       .filter((p) => normalizeAreaKey(p.address) === key);

//     if (byArea.length >= 4) return byArea.slice(0, 4);

//     const min = currentPrice * 0.75;
//     const max = currentPrice * 1.25;

//     const byPrice = sampleProducts
//       .filter((p) => p.id !== product.id)
//       .filter((p) => p.price >= min && p.price <= max);

//     // gộp area + price (không trùng)
//     const merged = [...byArea, ...byPrice].filter(
//       (p, idx, arr) => arr.findIndex((x) => x.id === p.id) === idx
//     );

//     return merged.slice(0, 6);
//   }, [product, currentPrice]);

//   return (
//     <div className="container mx-auto px-4 py-12">
//       {/* ====== TOP DETAIL ====== */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
//         {/* GALLERY */}
//         <div>
//           <div className="relative rounded-2xl overflow-hidden shadow-lg bg-white">
//             <img
//               src={imgs[activeImg] ?? "/house1.jpg"}
//               alt={`${product.name} - ${activeImg + 1}`}
//               className="w-full h-[420px] object-cover"
//             />

//             {/* ✅ Badge type trên ảnh chính */}
//             {product.type && (
//               <div className="absolute left-4 top-4 rounded-full border border-gray-200 bg-white/90 px-3 py-1 text-xs font-medium text-gray-700">
//                 🏷 {product.type}
//               </div>
//             )}
//           </div>

//           {imgs.length > 1 && (
//             <div className="mt-4 grid grid-cols-4 gap-3">
//               {imgs.map((src, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => setActiveImg(idx)}
//                   className={`rounded-xl overflow-hidden border transition ${
//                     idx === activeImg ? "border-blue-600" : "border-gray-200"
//                   }`}
//                   title={`Ảnh ${idx + 1}`}
//                 >
//                   <img
//                     src={src}
//                     alt={`thumb-${idx}`}
//                     className="h-20 w-full object-cover"
//                   />
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* INFO */}
//         <div>
//           <h1 className="text-3xl font-bold">{product.name}</h1>
//           <p className="text-gray-500 mt-2">📍 {product.address}</p>

//           {/* ✅ Hiển thị type trong phần info */}
//           {product.type && (
//             <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-gray-700">
//               🏷 <span className="font-semibold">{product.type}</span>
//             </div>
//           )}

//           <div className="mt-5 text-3xl text-blue-600 font-semibold">
//             {formatPrice(product.price)}
//           </div>

//           <div className="mt-6 grid grid-cols-2 gap-4">
//             <InfoCard
//               icon="🏠"
//               label="Diện tích"
//               value={`${product.area} m²`}
//             />
//             <InfoCard
//               icon="🛏"
//               label="Phòng ngủ"
//               value={`${product.bedrooms}`}
//             />
//             <InfoCard
//               icon="🚿"
//               label="Phòng tắm"
//               value={`${product.bathrooms}`}
//             />
//             <InfoCard icon="🧭" label="Hướng" value={product.direction} />
//           </div>

//           <div className="mt-6 flex gap-3">
//             <button className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition">
//               Liên hệ tư vấn
//             </button>
//             <button className="flex-1 border border-gray-300 py-3 rounded-xl hover:bg-gray-50 transition">
//               Đặt lịch xem nhà
//             </button>
//           </div>

//           {/* TABS */}
//           <div className="mt-8">
//             <div className="flex gap-2">
//               {[
//                 { key: "overview", label: "Mô tả" },
//                 { key: "layout", label: "Bố trí" },
//                 { key: "amenities", label: "Tiện ích" },
//               ].map((t) => (
//                 <button
//                   key={t.key}
//                   onClick={() => setTab(t.key)}
//                   className={`px-4 py-2 rounded-xl border transition ${
//                     tab === t.key
//                       ? "bg-blue-600 text-white border-blue-600"
//                       : "bg-white border-gray-200 hover:bg-gray-50"
//                   }`}
//                 >
//                   {t.label}
//                 </button>
//               ))}
//             </div>

//             <div className="mt-4 p-5 border rounded-2xl bg-white shadow-sm">
//               {tab === "overview" && (
//                 <div className="space-y-4">
//                   <p className="text-gray-700 leading-relaxed">
//                     {product.details?.overview}
//                   </p>

//                   {product.details?.highlights?.length > 0 && (
//                     <>
//                       <h2 className="text-lg font-semibold">Điểm nổi bật</h2>
//                       <ul className="list-disc pl-5 text-gray-700 space-y-1">
//                         {product.details.highlights.map((x, i) => (
//                           <li key={i}>{x}</li>
//                         ))}
//                       </ul>
//                     </>
//                   )}

//                   {product.details?.notes && (
//                     <div className="p-4 rounded-xl bg-blue-50 text-blue-900">
//                       <b>Lưu ý:</b> {product.details.notes}
//                     </div>
//                   )}
//                 </div>
//               )}

//               {tab === "layout" && (
//                 <div className="space-y-3">
//                   <h2 className="text-lg font-semibold">Bố trí & công năng</h2>
//                   <ul className="list-disc pl-5 text-gray-700 space-y-1">
//                     {(product.details?.layout || []).map((x, i) => (
//                       <li key={i}>{x}</li>
//                     ))}
//                   </ul>
//                 </div>
//               )}

//               {tab === "amenities" && (
//                 <div className="space-y-3">
//                   <h2 className="text-lg font-semibold">Tiện ích xung quanh</h2>
//                   <ul className="list-disc pl-5 text-gray-700 space-y-1">
//                     {(product.details?.amenities || []).map((x, i) => (
//                       <li key={i}>{x}</li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ====== RELATED PRODUCTS ====== */}
//       <div className="mt-14">
//         <div className="flex items-end justify-between mb-5">
//           <h2 className="text-2xl font-bold">Sản phẩm liên quan</h2>
//           <span className="text-sm text-gray-500">
//             Gợi ý theo khu vực / khoảng giá
//           </span>
//         </div>

//         {relatedProducts.length === 0 ? (
//           <div className="p-6 rounded-2xl border bg-white text-gray-600">
//             Chưa có sản phẩm liên quan phù hợp.
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {relatedProducts.map((p) => (
//               <RelatedCard key={p.id} p={p} />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import { useMemo, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { sampleProducts } from "../hook/chitietsanpham";

/* ===== Utils ===== */
const formatPrice = (price) =>
  (Number(price) || 0).toLocaleString("vi-VN") + " ₫";

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/35 bg-white/80 px-3 py-1 text-xs font-medium text-gray-800 shadow-sm backdrop-blur">
      {children}
    </span>
  );
}

function InfoCard({ label, value, icon }) {
  return (
    <div className="rounded-2xl border border-white/30 bg-white/85 p-4 shadow-sm backdrop-blur">
      <div className="mb-1 text-sm text-gray-600">
        {icon} {label}
      </div>
      <div className="font-semibold text-gray-900">{value}</div>
    </div>
  );
}

function RelatedCard({ p }) {
  const cover = (p.images?.[0] || p.image) ?? "/house1.jpg";

  return (
    <Link
      to={`/ProductDetail/${p.id}`}
      className="group block overflow-hidden rounded-2xl border border-white/20 bg-white/80 shadow-sm backdrop-blur transition hover:shadow-lg"
    >
      <div className="relative overflow-hidden">
        <img
          src={cover}
          alt={p.name}
          className="h-48 w-full object-cover transition group-hover:scale-[1.04]"
        />

        {/* Badge type */}
        {p.type && (
          <div className="absolute left-3 top-3">
            <Badge>🏷 {p.type}</Badge>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="line-clamp-2 font-semibold text-gray-900">{p.name}</div>
        <div className="mt-1 line-clamp-1 text-sm text-gray-600">
          📍 {p.address}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="font-semibold text-blue-700">
            {formatPrice(p.price)}
          </div>
          <div className="text-sm text-gray-600">{p.area} m²</div>
        </div>
      </div>
    </Link>
  );
}

export default function ProductDetail() {
  const { id } = useParams();

  const product = useMemo(
    () => sampleProducts.find((p) => p.id === Number(id)),
    [id]
  );

  const [activeImg, setActiveImg] = useState(0);
  const [tab, setTab] = useState("overview");

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center text-red-500">Không tìm thấy sản phẩm</p>
      </div>
    );
  }

  const imgs = product.images || [];
  const cover = (imgs[0] || product.image) ?? "/house1.jpg";
  const currentPrice = product.price;

  // preload ảnh cho mượt
  useEffect(() => {
    imgs.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [imgs]);

  // Related theo khu vực (ưu tiên), thiếu thì theo giá ±25%
  const relatedProducts = useMemo(() => {
    const normalizeAreaKey = (addr = "") => {
      const lower = addr.toLowerCase();
      if (lower.includes("quận 7")) return "q7";
      if (lower.includes("thảo điền")) return "thaodien";
      if (lower.includes("thủ đức")) return "thuduc";
      if (lower.includes("quận 1")) return "q1";
      if (lower.includes("bình thạnh")) return "binhthanh";
      if (lower.includes("phú nhuận")) return "phunhuan";
      if (lower.includes("tân bình")) return "tanbinh";
      if (lower.includes("gò vấp")) return "govap";
      if (lower.includes("bình tân")) return "binhtan";
      if (lower.includes("quận 12")) return "q12";
      return lower.split(",").slice(-2).join(",").trim();
    };

    const key = normalizeAreaKey(product.address);

    const byArea = sampleProducts
      .filter((p) => p.id !== product.id)
      .filter((p) => normalizeAreaKey(p.address) === key);

    if (byArea.length >= 6) return byArea.slice(0, 6);

    const min = currentPrice * 0.75;
    const max = currentPrice * 1.25;

    const byPrice = sampleProducts
      .filter((p) => p.id !== product.id)
      .filter((p) => p.price >= min && p.price <= max);

    const merged = [...byArea, ...byPrice].filter(
      (p, idx, arr) => arr.findIndex((x) => x.id === p.id) === idx
    );

    return merged.slice(0, 6);
  }, [product, currentPrice]);

  return (
    <div className="relative min-h-screen">
      {/* ===== Background Image ===== */}
      <div className="absolute inset-0 -z-10">
        <img src={cover} alt="bg" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-white/90" />
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Back */}
        <div className="mb-6">
          <Link
            to="/nha"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/80 px-4 py-2 text-sm font-medium text-gray-800 shadow-sm backdrop-blur hover:bg-white"
          >
            ← Quay lại danh sách nhà
          </Link>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-3xl border border-white/20 bg-white/70 shadow-xl backdrop-blur">
          {/* Hero */}
          <div className="relative">
            <img
              src={imgs[activeImg] ?? "/house1.jpg"}
              alt={`${product.name} - ${activeImg + 1}`}
              className="h-[420px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

            {/* Badges */}
            <div className="absolute left-5 top-5 flex flex-wrap gap-2">
              {product.type && <Badge>🏷 {product.type}</Badge>}
              {product.direction && <Badge>🧭 {product.direction}</Badge>}
              {Number(product.bedrooms) > 0 && (
                <Badge>🛏 {product.bedrooms} PN</Badge>
              )}
              {Number(product.bathrooms) > 0 && (
                <Badge>🚿 {product.bathrooms} WC</Badge>
              )}
            </div>

            {/* Title */}
            <div className="absolute bottom-5 left-5 right-5">
              <h1 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow">
                {product.name}
              </h1>
              <p className="mt-2 text-sm md:text-base text-white/90">
                📍 {product.address}
              </p>
              <div className="mt-3 text-2xl md:text-3xl font-extrabold text-white">
                {formatPrice(product.price)}
              </div>
            </div>
          </div>

          {/* Thumbs */}
          {imgs.length > 1 && (
            <div className="border-b border-white/30 bg-white/60 px-5 py-4">
              <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                {imgs.map((src, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImg(idx)}
                    className={`overflow-hidden rounded-2xl border transition ${
                      idx === activeImg
                        ? "border-blue-600 ring-2 ring-blue-600/30"
                        : "border-white/40 hover:border-white/80"
                    }`}
                    title={`Ảnh ${idx + 1}`}
                  >
                    <img
                      src={src}
                      alt={`thumb-${idx}`}
                      className="h-20 w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="p-5 md:p-7">
            {/* Info cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InfoCard
                icon="📐"
                label="Diện tích"
                value={`${product.area} m²`}
              />
              <InfoCard
                icon="🛏"
                label="Phòng ngủ"
                value={product.bedrooms ?? "—"}
              />
              <InfoCard
                icon="🚿"
                label="Phòng tắm"
                value={product.bathrooms ?? "—"}
              />
              <InfoCard
                icon="🏷"
                label="Loại hình"
                value={product.type || "—"}
              />
            </div>

            {/* CTA (nếu muốn bỏ “Đặt lịch” thì xoá button thứ 2) */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
              <button className="rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700">
                Liên hệ tư vấn
              </button>
              <button className="rounded-2xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50">
                Đặt lịch xem nhà
              </button>
            </div>

            {/* Tabs */}
            <div className="mt-7">
              <div className="flex flex-wrap gap-2">
                {[
                  { key: "overview", label: "Mô tả" },
                  { key: "layout", label: "Bố trí" },
                  { key: "amenities", label: "Tiện ích" },
                  { key: "notes", label: "Ghi chú" },
                ].map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`rounded-2xl border px-4 py-2 text-sm font-medium transition ${
                      tab === t.key
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-white/40 bg-white/70 text-gray-800 hover:bg-white"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="mt-4 rounded-3xl border border-white/30 bg-white/75 p-5 shadow-sm backdrop-blur">
                {tab === "overview" && (
                  <p className="text-gray-800 leading-relaxed">
                    {product.details?.overview || "—"}
                  </p>
                )}

                {tab === "layout" && (
                  <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Bố trí & công năng
                    </h2>
                    <ul className="list-disc pl-5 text-gray-800 space-y-1">
                      {(product.details?.layout || []).length ? (
                        product.details.layout.map((x, i) => (
                          <li key={i}>{x}</li>
                        ))
                      ) : (
                        <li>—</li>
                      )}
                    </ul>
                  </div>
                )}

                {tab === "amenities" && (
                  <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Tiện ích xung quanh
                    </h2>
                    <ul className="list-disc pl-5 text-gray-800 space-y-1">
                      {(product.details?.amenities || []).length ? (
                        product.details.amenities.map((x, i) => (
                          <li key={i}>{x}</li>
                        ))
                      ) : (
                        <li>—</li>
                      )}
                    </ul>
                  </div>
                )}

                {tab === "notes" && (
                  <div className="rounded-2xl bg-blue-50 p-4 text-blue-900">
                    {product.details?.notes || "—"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        <div className="mt-12">
          <div className="mb-5 flex items-end justify-between">
            <h2 className="text-2xl font-bold text-white drop-shadow">
              Sản phẩm liên quan
            </h2>
            <span className="text-sm text-white/80 drop-shadow">
              Gợi ý theo khu vực / khoảng giá
            </span>
          </div>

          {relatedProducts.length === 0 ? (
            <div className="rounded-3xl border border-white/20 bg-white/70 p-6 text-gray-700 shadow-sm backdrop-blur">
              Chưa có sản phẩm liên quan phù hợp.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <RelatedCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
