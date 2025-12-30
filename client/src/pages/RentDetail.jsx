import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { sampleRentals } from "../hook/nhachothue";

/* ===== Utils ===== */
const formatPrice = (vnd) =>
  (Number(vnd) || 0).toLocaleString("vi-VN") + " ₫/tháng";

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

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/35 bg-white/80 px-3 py-1 text-xs font-medium text-gray-800 shadow-sm backdrop-blur">
      {children}
    </span>
  );
}

function RelatedCard({ r }) {
  const cover = (r.images?.[0] || r.image) ?? "/house1.jpg";

  return (
    <Link
      to={`/rent/${r.id}`}
      className="group block overflow-hidden rounded-2xl border border-white/20 bg-white/80 shadow-sm backdrop-blur transition hover:shadow-lg"
    >
      <div className="relative overflow-hidden">
        <img
          src={cover}
          alt={r.name}
          className="h-48 w-full object-cover transition group-hover:scale-[1.04]"
        />
        {r.type && (
          <div className="absolute left-3 top-3">
            <Badge>🏷 {r.type}</Badge>
          </div>
        )}
        {r.rentalPeriod && (
          <div className="absolute right-3 top-3">
            <Badge>⏱ {r.rentalPeriod}</Badge>
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="line-clamp-2 font-semibold text-gray-900">{r.name}</div>
        <div className="mt-1 line-clamp-1 text-sm text-gray-600">
          📍 {r.address}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="font-semibold text-blue-700">
            {formatPrice(r.price)}
          </div>
          <div className="text-sm text-gray-600">{r.area} m²</div>
        </div>
      </div>
    </Link>
  );
}

export default function RentDetail() {
  const { id } = useParams();

  const rental = useMemo(
    () => sampleRentals.find((x) => x.id === Number(id)),
    [id]
  );

  const [activeImg, setActiveImg] = useState(0);
  const [tab, setTab] = useState("overview");

  if (!rental) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center text-red-500">Không tìm thấy tin thuê</p>
      </div>
    );
  }

  const imgs = rental.images || [];
  const cover = (imgs[0] || rental.image) ?? "/house1.jpg";

  const relatedRentals = useMemo(() => {
    const norm = (s = "") => s.toLowerCase();

    const sameType = sampleRentals
      .filter((x) => x.id !== rental.id)
      .filter((x) => norm(x.type).includes(norm(rental.type)));

    if (sameType.length >= 6) return sameType.slice(0, 6);

    const min = rental.price * 0.75;
    const max = rental.price * 1.25;

    const byPrice = sampleRentals
      .filter((x) => x.id !== rental.id)
      .filter((x) => x.price >= min && x.price <= max);

    const merged = [...sameType, ...byPrice].filter(
      (p, idx, arr) => arr.findIndex((z) => z.id === p.id) === idx
    );

    return merged.slice(0, 6);
  }, [rental]);

  return (
    <div className="relative min-h-screen">
      {/* ===== Background Image ===== */}
      <div className="absolute inset-0 -z-10">
        <img src={cover} alt="bg" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-white/90" />
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* ===== Top header ===== */}
        <div className="mb-5">
          <Link
            to="/rent"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/80 px-4 py-2 text-sm font-medium text-gray-800 shadow-sm backdrop-blur hover:bg-white"
          >
            ← Quay lại danh sách thuê
          </Link>
        </div>

        {/* ===== Main card (2 columns) ===== */}
        <div className="overflow-hidden rounded-3xl border border-white/20 bg-white/70 shadow-xl backdrop-blur">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* LEFT: Gallery */}
            <div className="border-b border-white/20 lg:border-b-0 lg:border-r">
              <div className="relative">
                <img
                  src={(imgs[activeImg] || cover) ?? "/house1.jpg"}
                  alt={`${rental.name} - ${activeImg + 1}`}
                  className="h-[320px] md:h-[420px] lg:h-[520px] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

                {/* Badges on image */}
                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  {rental.type && <Badge>🏷 {rental.type}</Badge>}
                  {rental.rentalPeriod && (
                    <Badge>⏱ {rental.rentalPeriod}</Badge>
                  )}
                  {rental.direction && <Badge>🧭 {rental.direction}</Badge>}
                </div>

                {/* counter */}
                {imgs.length > 0 && (
                  <div className="absolute bottom-4 right-4">
                    <Badge>
                      🖼 {Math.min(activeImg + 1, imgs.length)}/{imgs.length}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Thumbs */}
              {imgs.length > 1 && (
                <div className="bg-white/55 px-4 py-4">
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
                          className="h-16 md:h-20 w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: Details */}
            <div className="p-5 md:p-7">
              <div className="flex flex-col gap-2">
                <h1 className="text-xl md:text-2xl font-extrabold text-gray-900">
                  {rental.name}
                </h1>
                <p className="text-sm md:text-base text-gray-700">
                  📍 {rental.address}
                </p>

                <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
                  <div className="text-2xl md:text-3xl font-extrabold text-blue-700">
                    {formatPrice(rental.price)}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {rental.type && <Badge>🏷 {rental.type}</Badge>}
                    {rental.rentalPeriod && (
                      <Badge>⏱ {rental.rentalPeriod}</Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Info cards */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <InfoCard
                  icon="📐"
                  label="Diện tích"
                  value={`${rental.area} m²`}
                />
                <InfoCard
                  icon="🛏"
                  label="Phòng ngủ"
                  value={Number(rental.bedrooms) > 0 ? rental.bedrooms : "—"}
                />
                <InfoCard
                  icon="🚿"
                  label="Phòng tắm"
                  value={rental.bathrooms}
                />
                <InfoCard
                  icon="🏷"
                  label="Loại hình"
                  value={rental.type || "—"}
                />
              </div>

              {/* CTA */}
              <div className="mt-6">
                <button className="w-full rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700">
                  Liên hệ tư vấn
                </button>
              </div>

              {/* Tabs */}
              <div className="mt-7">
                <div className="flex flex-wrap gap-2">
                  {[
                    { key: "overview", label: "Mô tả" },
                    { key: "highlights", label: "Điểm nổi bật" },
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
                      {rental.details?.overview || "—"}
                    </p>
                  )}

                  {tab === "highlights" && (
                    <ul className="list-disc pl-5 text-gray-800 space-y-1">
                      {(rental.details?.highlights || []).length ? (
                        rental.details.highlights.map((x, i) => (
                          <li key={i}>{x}</li>
                        ))
                      ) : (
                        <li>—</li>
                      )}
                    </ul>
                  )}

                  {tab === "amenities" && (
                    <ul className="list-disc pl-5 text-gray-800 space-y-1">
                      {(rental.details?.amenities || []).length ? (
                        rental.details.amenities.map((x, i) => (
                          <li key={i}>{x}</li>
                        ))
                      ) : (
                        <li>—</li>
                      )}
                    </ul>
                  )}

                  {tab === "notes" && (
                    <div className="rounded-2xl bg-blue-50 p-4 text-blue-900">
                      {rental.details?.notes || "—"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== Related ===== */}
        <div className="mt-12">
          <div className="mb-5 flex items-end justify-between">
            <h2 className="text-2xl font-bold text-white drop-shadow">
              Tin thuê liên quan
            </h2>
            <span className="text-sm text-white/80 drop-shadow">
              Gợi ý theo loại hình / khoảng giá
            </span>
          </div>

          {relatedRentals.length === 0 ? (
            <div className="rounded-3xl border border-white/20 bg-white/70 p-6 text-gray-700 shadow-sm backdrop-blur">
              Chưa có tin thuê liên quan phù hợp.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedRentals.map((r) => (
                <RelatedCard key={r.id} r={r} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
