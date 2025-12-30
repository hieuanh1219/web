// nhà nổi trội
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const formatPrice = (price) => price.toLocaleString("vi-VN") + " ₫";

const featuredProduct = {
  id: 11,
  name: "Nhà phố Gò Vấp – Gần Emart",
  price: 6900000000,
  area: 85,
  address: "Phan Văn Trị, Gò Vấp, TP.HCM",
  bedrooms: 3,
  bathrooms: 3,
  direction: "Tây",
  images: [
    "/nhanoitroi/anh1.jpg",
    "/nhanoitroi/anh2.jpg",
    "/nhanoitroi/anh3.jpg",
  ],
  details: {
    overview: "Nhà phố khu Gò Vấp, tiện ích đầy đủ, phù hợp gia đình trẻ.",
    highlights: ["Gần Emart", "Hẻm rộng 6m", "Nhà mới – nội thất cơ bản"],
    layout: ["1 trệt 2 lầu", "3PN • 3WC", "Phòng khách rộng + bếp"],
    amenities: ["Siêu thị", "Trường học", "Công viên", "Bệnh viện"],
    notes: "Sổ hồng riêng, hỗ trợ ngân hàng, có thể dọn vào ngay.",
  },
};

export default function HomeProject() {
  const p = featuredProduct;

  const images = useMemo(
    () => (p.images?.length ? p.images : ["/house1.jpg"]),
    [p.images]
  );

  const [currentImg, setCurrentImg] = useState(0);
  const [isFading, setIsFading] = useState(false);

  // ✅ preload ảnh cho mượt
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
      {/* ✅ gần full màn hình */}
      <div className="min-h-screen flex items-center">
        {/* Background ảnh thật */}
        <div className="absolute inset-0 -z-10">
          <img
            src={images[0]}
            alt={p.name}
            className="w-full h-full object-cover scale-105"
          />
          {/* overlay nhẹ để chữ rõ, không gradient */}
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" />
        </div>

        <div className="container mx-auto px-4 py-10 md:py-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* LEFT */}
            <div className="text-white">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-sm">
                  ⭐ Sản phẩm nổi bật
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 border border-white/15 text-sm">
                  🧭 Hướng {p.direction}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/20 border border-blue-300/20 text-sm">
                  🔥 Hot Deal
                </span>
              </div>

              <h2 className="mt-4 text-4xl md:text-6xl font-extrabold leading-tight">
                {p.name}
              </h2>

              <p className="mt-3 text-white/80 max-w-xl text-base md:text-lg">
                {p.details?.overview}
              </p>

              {/* Price */}
              <div className="mt-6">
                <div className="text-white/70 text-sm">Giá bán</div>
                <div className="text-3xl md:text-4xl font-extrabold">
                  {formatPrice(p.price)}
                </div>
                <div className="text-white/60 text-sm mt-1">
                  ~ {(p.price / p.area).toLocaleString("vi-VN")} ₫/m²
                </div>
              </div>

              {/* Meta */}
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl">
                <div className="rounded-2xl bg-white/10 border border-white/10 p-3">
                  <div className="text-white/60 text-xs">Diện tích</div>
                  <div className="font-semibold">{p.area} m²</div>
                </div>
                <div className="rounded-2xl bg-white/10 border border-white/10 p-3">
                  <div className="text-white/60 text-xs">Phòng ngủ</div>
                  <div className="font-semibold">{p.bedrooms} PN</div>
                </div>
                <div className="rounded-2xl bg-white/10 border border-white/10 p-3">
                  <div className="text-white/60 text-xs">Phòng tắm</div>
                  <div className="font-semibold">{p.bathrooms} WC</div>
                </div>
                <div className="rounded-2xl bg-white/10 border border-white/10 p-3">
                  <div className="text-white/60 text-xs">Khu vực</div>
                  <div className="font-semibold line-clamp-1">Gò Vấp</div>
                </div>
              </div>

              {/* Address */}
              <div className="mt-4 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl bg-white/10 border border-white/10">
                  <span>📍</span>
                  <span className="text-sm text-white/85 line-clamp-1">
                    {p.address}
                  </span>
                </div>
              </div>

              {/* Highlights */}
              {p.details?.highlights?.length > 0 && (
                <div className="mt-6 max-w-xl">
                  <div className="text-white/70 text-sm mb-2">Điểm nổi bật</div>
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
                  Liên hệ ngay
                </button>
                <Link
                  to={`/ProductDetail/${p.id}`}
                  className="px-6 py-3 rounded-2xl bg-white text-black hover:bg-gray-100 transition font-semibold"
                >
                  Xem chi tiết
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

                  {/* arrows */}
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

                  {/* top badge */}
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-2xl bg-black/55 border border-white/15 text-white text-sm backdrop-blur">
                    {formatPrice(p.price)} • {p.area} m²
                  </div>
                </div>

                {/* footer info */}
                <div className="p-5 text-white">
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <div className="rounded-2xl bg-white/10 border border-white/10 p-3">
                      <div className="text-white/60 text-xs mb-1">Bố trí</div>
                      <div className="line-clamp-2">
                        {p.details?.layout?.[0] || "—"}
                      </div>
                    </div>
                    <div className="rounded-2xl bg-white/10 border border-white/10 p-3">
                      <div className="text-white/60 text-xs mb-1">Tiện ích</div>
                      <div className="line-clamp-2">
                        {p.details?.amenities?.slice(0, 3).join(", ") || "—"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* shadow glow */}
              <div className="absolute -inset-6 -z-10 blur-2xl opacity-30 bg-white/20 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
