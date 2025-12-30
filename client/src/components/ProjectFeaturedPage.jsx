// dự án nổi trội
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const formatPriceShort = (vnd) => {
  // format kiểu 2.3 tỷ, 950 triệu...
  if (!Number.isFinite(vnd)) return "—";
  if (vnd >= 1_000_000_000) return `${(vnd / 1_000_000_000).toFixed(1)} tỷ`;
  if (vnd >= 1_000_000) return `${Math.round(vnd / 1_000_000)} triệu`;
  return vnd.toLocaleString("vi-VN") + " ₫";
};

// ✅ Data dự án nổi bật (bán dự án) — schema riêng cho project
const featuredProject = {
  id: 101,
  name: "Vinhomes Grand Park",
  status: "Đang mở bán",
  developer: "Vinhomes",
  location: "TP. Thủ Đức, TP.HCM",
  type: "Khu đô thị",
  handover: "2026",
  priceFrom: 2_900_000_000, // giá từ
  minArea: 45,
  maxArea: 120,
  images: [
    "/duannoitroi/anh1.jpg",
    "/duannoitroi/anh2.jpg",
    "/duannoitroi/anh3.jpg",
  ],
  details: {
    overview:
      "Khu đô thị quy mô lớn với hệ tiện ích nội khu hoàn chỉnh: công viên, trường học, TTTM và kết nối giao thông thuận tiện.",
    highlights: [
      "Đại đô thị 271ha",
      "Công viên ven sông",
      "Tiện ích all-in-one",
      "Kết nối metro",
    ],
    productTypes: ["Căn hộ", "Shophouse", "Biệt thự"],
    amenities: [
      "Công viên",
      "Trường học",
      "TTTM",
      "Bệnh viện",
      "Hồ bơi",
      "Gym",
    ],
    notes: "Hỗ trợ vay ngân hàng, booking giữ chỗ sớm ưu đãi tốt.",
  },
};

export default function ProjectFeaturedPage() {
  const p = featuredProject;

  const images = useMemo(
    () => (p.images?.length ? p.images : ["/house1.jpg"]),
    [p.images]
  );

  const [currentImg, setCurrentImg] = useState(0);
  const [isFading, setIsFading] = useState(false);

  // ✅ preload ảnh để chuyển mượt
  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [images]);

  const goTo = (idx) => {
    if (idx === currentImg) return;
    setIsFading(true);
    setTimeout(() => {
      setCurrentImg(idx);
      setIsFading(false);
    }, 160);
  };

  const nextImage = () => goTo((currentImg + 1) % images.length);
  const prevImage = () =>
    goTo((currentImg - 1 + images.length) % images.length);

  return (
    <section className="relative overflow-hidden">
      <div className="min-h-screen flex items-center">
        {/* Background ảnh dự án */}
        <div className="absolute inset-0 -z-10">
          <img
            src={images[0]}
            alt={p.name}
            className="w-full h-full object-cover scale-105"
          />
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" />
        </div>

        <div className="container mx-auto px-4 py-10 md:py-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* LEFT - Content */}
            <div className="text-white">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-sm">
                  🏙 Dự án nổi bật
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/20 border border-blue-300/20 text-sm">
                  {p.status}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/15 text-sm">
                  {p.type}
                </span>
              </div>

              <h1 className="mt-4 text-4xl md:text-6xl font-extrabold leading-tight">
                {p.name}
              </h1>

              <p className="mt-3 text-white/80 max-w-xl text-base md:text-lg">
                {p.details?.overview}
              </p>

              {/* Price */}
              <div className="mt-6">
                <div className="text-white/70 text-sm">Giá từ</div>
                <div className="text-3xl md:text-4xl font-extrabold">
                  {formatPriceShort(p.priceFrom)}
                </div>
                <div className="text-white/60 text-sm mt-1">
                  Diện tích: {p.minArea}–{p.maxArea} m² • Bàn giao: {p.handover}
                </div>
              </div>

              {/* Meta cards */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl">
                <div className="rounded-2xl bg-white/10 border border-white/10 p-3">
                  <div className="text-white/60 text-xs">Chủ đầu tư</div>
                  <div className="font-semibold line-clamp-1">
                    {p.developer}
                  </div>
                </div>
                <div className="rounded-2xl bg-white/10 border border-white/10 p-3">
                  <div className="text-white/60 text-xs">Khu vực</div>
                  <div className="font-semibold line-clamp-1">{p.location}</div>
                </div>
                <div className="rounded-2xl bg-white/10 border border-white/10 p-3">
                  <div className="text-white/60 text-xs">Sản phẩm</div>
                  <div className="font-semibold line-clamp-1">
                    {p.details?.productTypes?.[0] || "—"}
                  </div>
                </div>
                <div className="rounded-2xl bg-white/10 border border-white/10 p-3">
                  <div className="text-white/60 text-xs">Tiện ích</div>
                  <div className="font-semibold line-clamp-1">
                    {p.details?.amenities?.slice(0, 1).join(", ") || "—"}
                  </div>
                </div>
              </div>

              {/* Highlights */}
              {p.details?.highlights?.length > 0 && (
                <div className="mt-6 max-w-xl">
                  <div className="text-white/70 text-sm mb-2">
                    Điểm mạnh dự án
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {p.details.highlights.slice(0, 4).map((h, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-sm"
                      >
                        ✅ {h}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-8 flex flex-wrap gap-3">
                <button className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 transition font-semibold shadow-lg shadow-blue-600/25">
                  Nhận báo giá / Ưu đãi
                </button>

                <Link
                  to={`/ProjectDetail/${p.id}`}
                  className="px-6 py-3 rounded-2xl bg-white text-black hover:bg-gray-100 transition font-semibold"
                >
                  Xem chi tiết dự án
                </Link>
              </div>

              {p.details?.notes && (
                <p className="mt-4 text-sm text-white/70">
                  💡 {p.details.notes}
                </p>
              )}
            </div>

            {/* RIGHT - Carousel */}
            <div className="relative lg:pl-6">
              <div className="rounded-[28px] overflow-hidden border border-white/15 bg-white/10 backdrop-blur-xl shadow-2xl">
                <div className="relative">
                  <img
                    src={images[currentImg]}
                    alt={p.name}
                    loading="eager"
                    className={`w-full h-80 md:h-[520px] object-cover transition-opacity duration-300 ease-in-out will-change-opacity ${
                      isFading ? "opacity-0" : "opacity-100"
                    }`}
                  />

                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute top-1/2 left-3 -translate-y-1/2 bg-white/85 text-black rounded-full w-11 h-11 grid place-items-center hover:bg-white transition"
                        aria-label="Prev"
                      >
                        &#8592;
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute top-1/2 right-3 -translate-y-1/2 bg-white/85 text-black rounded-full w-11 h-11 grid place-items-center hover:bg-white transition"
                        aria-label="Next"
                      >
                        &#8594;
                      </button>
                    </>
                  )}

                  {/* dots */}
                  {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => goTo(idx)}
                          className={`h-2.5 rounded-full transition ${
                            idx === currentImg
                              ? "w-10 bg-white"
                              : "w-2.5 bg-white/55"
                          }`}
                          aria-label={`Go to image ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}

                  {/* badge top */}
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-2xl bg-black/55 border border-white/15 text-white text-sm backdrop-blur">
                    Giá từ {formatPriceShort(p.priceFrom)} • {p.minArea}–
                    {p.maxArea} m²
                  </div>
                </div>

                {/* footer info */}
                <div className="p-5 text-white">
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <div className="rounded-2xl bg-white/10 border border-white/10 p-3">
                      <div className="text-white/60 text-xs mb-1">
                        Loại sản phẩm
                      </div>
                      <div className="line-clamp-2">
                        {p.details?.productTypes?.join(" • ") || "—"}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-white/10 border border-white/10 p-3">
                      <div className="text-white/60 text-xs mb-1">
                        Tiện ích tiêu biểu
                      </div>
                      <div className="line-clamp-2">
                        {p.details?.amenities?.slice(0, 4).join(", ") || "—"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -inset-6 -z-10 blur-2xl opacity-30 bg-white/20 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
