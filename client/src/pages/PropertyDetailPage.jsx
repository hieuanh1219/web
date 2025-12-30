// src/pages/PropertyDetailPage.jsx
// page chi tiet moi
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MOCK, selectPropertyDetail } from "../hook/data"; // chỉnh path theo dự án

const formatMoneyVND = (valueLikeString) => {
  if (!valueLikeString) return "—";
  const n = Number(valueLikeString);
  if (!Number.isFinite(n)) return valueLikeString;
  return new Intl.NumberFormat("vi-VN").format(n) + " ₫";
};

// pill nhỏ, tinh tế
const pill =
  "inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium leading-5 text-slate-700";

const Card = ({ children, className = "" }) => (
  <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
    {children}
  </div>
);

const SectionTitle = ({ children }) => (
  <h2 className="text-[18px] font-semibold text-slate-900">{children}</h2>
);

export default function PropertyDetailPage() {
  const { slug } = useParams();
  const propertyId = MOCK.route?.bySlug?.[slug];

  const detail = useMemo(() => {
    if (!propertyId) return null;
    return selectPropertyDetail(propertyId);
  }, [propertyId]);

  // ======= SECTIONS (menu trái) =======
  const sections = useMemo(() => {
    const base = [
      { id: "overview", label: "Tổng quan" },
      { id: "gallery", label: "Hình ảnh" },
      { id: "description", label: "Mô tả" },
      { id: "features", label: "Thông tin" },
      { id: "amenities", label: "Tiện ích" },
      { id: "media", label: "Media" },
      { id: "location", label: "Vị trí" },
    ];
    if (!detail?.media?.length) return base.filter((x) => x.id !== "media");
    return base;
  }, [detail]);

  const sectionRefs = useRef({});
  const setSectionRef = (id) => (el) => {
    if (el) sectionRefs.current[id] = el;
  };

  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    if (!detail) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];

        if (visible?.target?.dataset?.sectionId) {
          setActiveSection(visible.target.dataset.sectionId);
        }
      },
      {
        root: null,
        rootMargin: "-18% 0px -70% 0px",
        threshold: [0.08, 0.12, 0.2, 0.3, 0.4, 0.5],
      }
    );

    sections.forEach((s) => {
      const el = sectionRefs.current[s.id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [detail, sections]);

  const scrollToSection = (id) => {
    const el = sectionRefs.current[id];
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 84;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  if (!detail) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <Card>
            <h1 className="text-xl font-semibold text-slate-900">Không tìm thấy sản phẩm</h1>
            <p className="mt-2 text-slate-600">
              Slug: <span className="font-mono">{slug}</span>
            </p>
            <div className="mt-6">
              <Link
                to="/properties"
                className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                ← Về danh sách
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const mapUrl =
    detail.latitude && detail.longitude
      ? `https://www.google.com/maps?q=${detail.latitude},${detail.longitude}`
      : null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              to={-1}
              className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
            >
              ← Back
            </Link>
            <div className="hidden sm:block text-sm text-slate-600">
              {detail.type?.name || "—"} • {detail.location?.name || "—"}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={pill}>{detail.transactionType}</span>
            <span className={pill}>{detail.status}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Mobile: bỏ TOC, chỉ content */}
        {/* Desktop: TOC trái + content phải */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* LEFT TOC (desktop only) */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                  Nội dung
                </div>

                <div className="mt-3 space-y-1">
                  {sections.map((s) => {
                    const active = s.id === activeSection;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => scrollToSection(s.id)}
                        className={[
                          "w-full rounded-xl px-3 py-2 text-left text-sm transition-colors",
                          active ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-50",
                        ].join(" ")}
                      >
                        {s.label}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">
                    Quick info
                  </div>
                  <div className="mt-2 space-y-1.5 text-sm text-slate-800">
                    <KV k="Giá" v={detail.displayPrice || formatMoneyVND(detail.price)} />
                    <KV k="Diện tích" v={detail.area ? `${detail.area} m²` : "—"} />
                    <KV k="PN/WC" v={`${detail.bedrooms ?? "—"} / ${detail.bathrooms ?? "—"}`} />
                    <KV k="Khu vực" v={detail.location?.name || "—"} />
                  </div>
                </div>

                <Link
                  to="/properties"
                  className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                >
                  ← Về danh sách
                </Link>
              </div>
            </div>
          </aside>

          {/* CONTENT */}
          <main className="lg:col-span-9">
            {/* OVERVIEW */}
            <section ref={setSectionRef("overview")} data-section-id="overview" className="scroll-mt-24">
              <Card>
                <h1 className="text-[28px] font-semibold leading-snug text-slate-900">
                  {detail.title}
                </h1>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-2xl font-bold text-slate-900">
                    {detail.displayPrice || formatMoneyVND(detail.price)}
                  </span>
                  {detail.isNegotiable && <span className={pill}>Có thương lượng</span>}
                  <span className={pill}>{detail.type?.name || "—"}</span>
                  <span className={pill}>{detail.location?.name || "—"}</span>
                </div>

                {!!detail.tags?.length && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {detail.tags.map((t) => (
                      <span
                        key={t.id}
                        className="inline-flex items-center rounded-full bg-slate-900 px-2.5 py-0.5 text-[11px] font-semibold leading-5 text-white"
                      >
                        {t.name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <MiniStat label="Diện tích" value={detail.area ? `${detail.area} m²` : "—"} />
                  <MiniStat label="Phòng ngủ" value={Number.isFinite(detail.bedrooms) ? detail.bedrooms : "—"} />
                  <MiniStat label="Phòng tắm" value={Number.isFinite(detail.bathrooms) ? detail.bathrooms : "—"} />
                  <MiniStat label="Khoảng giá" value={`${formatMoneyVND(detail.priceMin)} - ${formatMoneyVND(detail.priceMax)}`} />
                </div>
              </Card>
            </section>

            {/* GALLERY */}
            <section ref={setSectionRef("gallery")} data-section-id="gallery" className="mt-8 scroll-mt-24">
              <Card>
                <div className="flex items-end justify-between gap-4">
                  <SectionTitle>Hình ảnh</SectionTitle>
                  <div className="text-sm text-slate-600">
                    {(detail.images?.length ?? 0) ? `${detail.images.length} ảnh` : "—"}
                  </div>
                </div>

                {(detail.images?.length ?? 0) === 0 ? (
                  <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
                    Chưa có ảnh.
                  </div>
                ) : (
                  <div className="mt-5 space-y-4">
                    {detail.images.map((img) => (
                      <figure
                        key={img.id}
                        className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100"
                      >
                        <img
                          src={img.url}
                          alt={img.alt || detail.title}
                          className="h-auto w-full object-cover"
                          loading="lazy"
                        />
                        {img.alt ? (
                          <figcaption className="border-t border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                            {img.alt}
                          </figcaption>
                        ) : null}
                      </figure>
                    ))}
                  </div>
                )}
              </Card>
            </section>

            {/* DESCRIPTION */}
            <section ref={setSectionRef("description")} data-section-id="description" className="mt-8 scroll-mt-24">
              <Card>
                <SectionTitle>Mô tả</SectionTitle>
                <p className="mt-3 whitespace-pre-line text-[15px] leading-7 text-slate-700">
                  {detail.description || "—"}
                </p>
              </Card>
            </section>

            {/* FEATURES */}
            <section ref={setSectionRef("features")} data-section-id="features" className="mt-8 scroll-mt-24">
              <Card>
                <SectionTitle>Thông tin</SectionTitle>

                {(detail.features?.length ?? 0) === 0 ? (
                  <div className="mt-4 text-sm text-slate-600">—</div>
                ) : (
                  <div className="mt-5 grid grid-cols-1 gap-2">
                    {detail.features.map((f) => (
                      <div
                        key={f.id}
                        className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3"
                      >
                        <div className="text-sm font-semibold text-slate-900">{f.key}</div>
                        <div className="text-sm text-slate-700 text-right">{f.value}</div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </section>

            {/* AMENITIES */}
            <section ref={setSectionRef("amenities")} data-section-id="amenities" className="mt-8 scroll-mt-24">
              <Card>
                <SectionTitle>Tiện ích</SectionTitle>
                {(detail.amenities?.length ?? 0) === 0 ? (
                  <div className="mt-4 text-sm text-slate-600">—</div>
                ) : (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {detail.amenities.map((a) => (
                      <span key={a.id} className={pill}>
                        {a.name}
                      </span>
                    ))}
                  </div>
                )}
              </Card>
            </section>

            {/* MEDIA */}
            {detail.media?.length ? (
              <section ref={setSectionRef("media")} data-section-id="media" className="mt-8 scroll-mt-24">
                <Card>
                  <SectionTitle>Media</SectionTitle>
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {detail.media.map((m) => (
                      <a
                        key={m.id}
                        href={m.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 hover:bg-slate-50"
                      >
                        <div>
                          <div className="text-sm font-semibold text-slate-900">{m.title || "Media"}</div>
                          <div className="mt-1 text-xs text-slate-600">{m.type}</div>
                        </div>
                        <span className="text-sm font-semibold text-slate-900 group-hover:translate-x-0.5 transition-transform">
                          →
                        </span>
                      </a>
                    ))}
                  </div>
                </Card>
              </section>
            ) : null}

            {/* LOCATION */}
            <section ref={setSectionRef("location")} data-section-id="location" className="mt-8 scroll-mt-24">
              <Card>
                <SectionTitle>Vị trí</SectionTitle>

                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-600">Địa chỉ</div>
                  <div className="mt-1 text-sm text-slate-900">{detail.address || "—"}</div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {mapUrl && (
                      <a
                        href={mapUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                      >
                        Mở Google Maps
                      </a>
                    )}
                    {detail.canonicalUrl && (
                      <a
                        href={detail.canonicalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
                      >
                        Canonical URL
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold text-slate-900">{value ?? "—"}</div>
    </div>
  );
}

function KV({ k, v }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-slate-600">{k}</span>
      <span className="font-semibold text-slate-900 text-right">{v}</span>
    </div>
  );
}
