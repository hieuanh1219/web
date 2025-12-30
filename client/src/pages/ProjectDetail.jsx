import { useMemo, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { sampleProjects } from "../hook/chitietduan";

/* ===== Utils ===== */
const formatPrice = (price) =>
  Number.isFinite(price) ? price.toLocaleString("vi-VN") + " ₫" : "—";

const formatPriceShort = (vnd) => {
  if (!Number.isFinite(vnd)) return "—";
  if (vnd >= 1_000_000_000) return `${(vnd / 1_000_000_000).toFixed(1)} tỷ`;
  if (vnd >= 1_000_000) return `${Math.round(vnd / 1_000_000)} triệu`;
  return vnd.toLocaleString("vi-VN") + " ₫";
};

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
      <div className="font-semibold text-gray-900 line-clamp-1">{value}</div>
    </div>
  );
}

function RelatedProjectCard({ p }) {
  const cover = p.images?.[0] ?? "/house1.jpg";

  return (
    <Link
      to={`/ProjectDetail/${p.id}`}
      className="group block overflow-hidden rounded-2xl border border-white/20 bg-white/80 shadow-sm backdrop-blur transition hover:shadow-lg"
    >
      <div className="relative overflow-hidden">
        <img
          src={cover}
          alt={p.name}
          className="h-48 w-full object-cover transition group-hover:scale-[1.04]"
        />

        <div className="absolute left-3 top-3 flex gap-2">
          {p.type && <Badge>🏙 {p.type}</Badge>}
        </div>

        <div className="absolute right-3 top-3">
          {p.status && <Badge>🏗 {p.status}</Badge>}
        </div>
      </div>

      <div className="p-4">
        <div className="line-clamp-2 font-semibold text-gray-900">{p.name}</div>
        <div className="mt-1 line-clamp-1 text-sm text-gray-600">
          📍 {p.location}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div className="font-semibold text-blue-700">
            Giá từ {formatPriceShort(p.priceFrom)}
          </div>
          <div className="text-sm text-gray-600">
            {p.minArea}–{p.maxArea} m²
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          {p.developer && (
            <span className="rounded-full border border-white/30 bg-white/70 px-3 py-1 text-gray-800">
              🏢 {p.developer}
            </span>
          )}
          {p.handover && (
            <span className="rounded-full border border-white/30 bg-white/70 px-3 py-1 text-gray-800">
              📦 {p.handover}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function ProjectDetail() {
  const { id } = useParams();

  const project = useMemo(
    () => sampleProjects.find((p) => p.id === Number(id)),
    [id]
  );

  const [activeImg, setActiveImg] = useState(0);
  const [tab, setTab] = useState("overview");

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-12">
        <p className="text-center text-red-500">Không tìm thấy dự án</p>
      </div>
    );
  }

  const imgs = project.images || [];
  const cover = imgs[0] ?? "/house1.jpg";

  // preload ảnh
  useEffect(() => {
    imgs.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [imgs]);

  // Related: ưu tiên location -> developer -> giá ±25%
  const relatedProjects = useMemo(() => {
    const normalizeKey = (s = "") =>
      s
        .toLowerCase()
        .replaceAll("tp.", "tp")
        .replaceAll("thành phố", "tp")
        .replace(/\s+/g, " ")
        .trim();

    const keyLocation = normalizeKey(project.location);
    const keyDeveloper = normalizeKey(project.developer);

    const byLocation = sampleProjects
      .filter((p) => p.id !== project.id)
      .filter((p) => normalizeKey(p.location) === keyLocation);

    const byDeveloper = sampleProjects
      .filter((p) => p.id !== project.id)
      .filter((p) => normalizeKey(p.developer) === keyDeveloper);

    const min = project.priceFrom * 0.75;
    const max = project.priceFrom * 1.25;

    const byPrice = sampleProjects
      .filter((p) => p.id !== project.id)
      .filter((p) => p.priceFrom >= min && p.priceFrom <= max);

    const merged = [...byLocation, ...byDeveloper, ...byPrice].filter(
      (p, idx, arr) => arr.findIndex((x) => x.id === p.id) === idx
    );

    return merged.slice(0, 6);
  }, [project]);

  return (
    <div className="relative min-h-screen">
      {/* ===== Background Image (giống RentDetail) ===== */}
      <div className="absolute inset-0 -z-10">
        <img src={cover} alt="bg" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-white/90" />
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Back */}
        <div className="mb-6">
          <Link
            to="/duan"
            className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/80 px-4 py-2 text-sm font-medium text-gray-800 shadow-sm backdrop-blur hover:bg-white"
          >
            ← Quay lại danh sách dự án
          </Link>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-3xl border border-white/20 bg-white/70 shadow-xl backdrop-blur">
          {/* Hero */}
          <div className="relative">
            <img
              src={imgs[activeImg] ?? "/house1.jpg"}
              alt={`${project.name} - ${activeImg + 1}`}
              className="h-[420px] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

            {/* Badges */}
            <div className="absolute left-5 top-5 flex flex-wrap gap-2">
              {project.type && <Badge>🏙 {project.type}</Badge>}
              {project.status && <Badge>🏗 {project.status}</Badge>}
              {project.developer && <Badge>🏢 {project.developer}</Badge>}
            </div>

            {/* Title */}
            <div className="absolute bottom-5 left-5 right-5">
              <h1 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow">
                {project.name}
              </h1>
              <p className="mt-2 text-sm md:text-base text-white/90">
                📍 {project.location}
              </p>

              <div className="mt-3 text-xl md:text-3xl font-extrabold text-white">
                Giá từ {formatPrice(project.priceFrom)}
                <span className="ml-2 text-sm md:text-base font-medium text-white/85">
                  ({formatPriceShort(project.priceFrom)})
                </span>
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
                icon="🏙"
                label="Loại dự án"
                value={project.type || "—"}
              />
              <InfoCard
                icon="🏢"
                label="Chủ đầu tư"
                value={project.developer || "—"}
              />
              <InfoCard
                icon="📐"
                label="Diện tích"
                value={`${project.minArea}–${project.maxArea} m²`}
              />
              <InfoCard
                icon="📦"
                label="Bàn giao"
                value={project.handover || "—"}
              />
            </div>

            {/* CTA */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
              <button className="rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700">
                Nhận báo giá / Ưu đãi
              </button>
              <button className="rounded-2xl border border-gray-200 bg-white px-5 py-3 font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50">
                Đăng ký tham quan
              </button>
            </div>

            {/* Tabs */}
            <div className="mt-7">
              <div className="flex flex-wrap gap-2">
                {[
                  { key: "overview", label: "Tổng quan" },
                  { key: "products", label: "Loại sản phẩm" },
                  { key: "amenities", label: "Tiện ích" },
                  { key: "legal", label: "Pháp lý / tiến độ" },
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
                  <div className="space-y-4">
                    <p className="text-gray-800 leading-relaxed">
                      {project.details?.overview || "—"}
                    </p>

                    {!!project.details?.highlights?.length && (
                      <>
                        <h2 className="text-lg font-semibold text-gray-900">
                          Điểm nổi bật
                        </h2>
                        <ul className="list-disc pl-5 text-gray-800 space-y-1">
                          {project.details.highlights.map((x, i) => (
                            <li key={i}>{x}</li>
                          ))}
                        </ul>
                      </>
                    )}

                    {project.details?.notes && (
                      <div className="rounded-2xl bg-blue-50 p-4 text-blue-900">
                        <b>Lưu ý:</b> {project.details.notes}
                      </div>
                    )}
                  </div>
                )}

                {tab === "products" && (
                  <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Loại sản phẩm mở bán
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {(project.details?.productTypes || []).map((x, i) => (
                        <span
                          key={i}
                          className="rounded-full border border-white/30 bg-white/80 px-3 py-1 text-sm text-gray-800"
                        >
                          🧩 {x}
                        </span>
                      ))}
                      {(project.details?.productTypes || []).length === 0 && (
                        <div className="text-gray-700">Chưa có dữ liệu.</div>
                      )}
                    </div>
                  </div>
                )}

                {tab === "amenities" && (
                  <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Tiện ích dự án
                    </h2>
                    <ul className="list-disc pl-5 text-gray-800 space-y-1">
                      {(project.details?.amenities || []).map((x, i) => (
                        <li key={i}>{x}</li>
                      ))}
                      {(project.details?.amenities || []).length === 0 && (
                        <li>Chưa cập nhật.</li>
                      )}
                    </ul>
                  </div>
                )}

                {tab === "legal" && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Pháp lý
                      </h2>
                      <ul className="list-disc pl-5 text-gray-800 space-y-1">
                        {(project.details?.legal || []).map((x, i) => (
                          <li key={i}>{x}</li>
                        ))}
                        {(project.details?.legal || []).length === 0 && (
                          <li>Chưa cập nhật.</li>
                        )}
                      </ul>
                    </div>

                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        Tiến độ / mở bán
                      </h2>
                      <ul className="list-disc pl-5 text-gray-800 space-y-1">
                        {(project.details?.progress || []).map((x, i) => (
                          <li key={i}>{x}</li>
                        ))}
                        {(project.details?.progress || []).length === 0 && (
                          <li>Chưa cập nhật.</li>
                        )}
                      </ul>
                    </div>
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
              Dự án liên quan
            </h2>
            <span className="text-sm text-white/80 drop-shadow">
              Gợi ý theo khu vực / CĐT / khoảng giá
            </span>
          </div>

          {relatedProjects.length === 0 ? (
            <div className="rounded-3xl border border-white/20 bg-white/70 p-6 text-gray-700 shadow-sm backdrop-blur">
              Chưa có dự án liên quan phù hợp.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProjects.map((p) => (
                <RelatedProjectCard key={p.id} p={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
