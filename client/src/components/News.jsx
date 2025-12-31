import { useEffect, useState } from "react";
import { getNews } from "../hook/dulieubao";

// Component tiêu đề section nhỏ
function SectionTitle({ children }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <h2 className="text-lg font-bold text-xanh-than uppercase tracking-wide border-l-4 border-xanh-than pl-3">
        {children}
      </h2>
      <div className="h-px flex-1 bg-slate-200" />
    </div>
  );
}

// Component hiển thị thời gian
function TimePill({ children }) {
  return (
    <span className="inline-flex items-center text-[11px] font-medium text-slate-500 uppercase tracking-wider">
      <svg
        className="mr-1 h-3 w-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      {children}
    </span>
  );
}

// Component bài viết dạng danh sách (Cột trái)
function NewsRow({ item }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex gap-4 py-4 transition-colors hover:bg-slate-50 rounded-xl px-2 -mx-2"
    >
      {item.thumb && (
        <div className="relative h-24 w-36 shrink-0 overflow-hidden rounded-xl bg-slate-200">
          <img
            src={item.thumb}
            alt={item.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          />
        </div>
      )}

      <div className="flex flex-col justify-center min-w-0">
        <h3 className="line-clamp-2 text-base font-bold text-xanh-than transition-colors group-hover:text-blue-700">
          {item.title}
        </h3>

        {item.excerpt && (
          <p className="mt-1 line-clamp-2 text-sm text-slate-500 font-light">
            {item.excerpt}
          </p>
        )}

        <div className="mt-2">
          <TimePill>{item.time}</TimePill>
        </div>
      </div>
    </a>
  );
}

// Component bài viết quan tâm nhiều (Cột phải)
function MostViewedItem({ item, index }) {
  // Kiểm tra xem có URL không, nếu không có thì fallback về "#" để vẫn hiện pointer
  const linkUrl = item.url || "#";

  return (
    <a
      href={linkUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-3 py-2 cursor-pointer" // Thêm cursor-pointer cho chắc chắn
    >
      {/* Số thứ tự (1, 2, 3...) */}
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500 group-hover:bg-xanh-than group-hover:text-white transition-colors">
        {index + 1}
      </span>

      {/* Nội dung text */}
      <div className="min-w-0">
        <h4 className="line-clamp-2 text-sm font-medium text-slate-700 group-hover:text-blue-700 transition-colors">
          {item.title}
        </h4>
        <div className="mt-1 text-xs text-slate-400">{item.time}</div>
      </div>
    </a>
  );
}

export default function News() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getNews().then(setData);
  }, []);

  if (!data) return null; // Hoặc loading state nếu muốn

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* --- CỘT TRÁI (Tin chính & Tin danh sách) --- */}
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <SectionTitle>Tin Tức & Sự Kiện</SectionTitle>

            {/* FEATURED NEWS (Tin nổi bật) */}
            <a
              href={data.featured.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block relative overflow-hidden rounded-2xl"
            >
              <div className="relative h-72 w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                <img
                  src={data.featured.image}
                  alt={data.featured.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <span className="absolute top-4 left-4 z-20 rounded bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
                  {data.featured.badge}
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <div className="text-white/80 mb-2">
                  <TimePill>{data.featured.time}</TimePill>
                </div>
                <h3 className="text-2xl font-bold text-white leading-tight group-hover:text-blue-200 transition-colors">
                  {data.featured.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-200 hidden sm:block">
                  {data.featured.excerpt}
                </p>
              </div>
            </a>

            {/* SEPARATOR */}
            <div className="my-6 h-px bg-slate-100" />

            {/* LIST NEWS (Tin bên dưới) */}
            <div className="divide-y divide-slate-100">
              {data.leftNews.map((item) => (
                <NewsRow key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* --- CỘT PHẢI (Quan tâm nhiều & Dịch vụ) --- */}
          <div className="lg:col-span-4 space-y-8">
            {/* MOST VIEWED */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
              <SectionTitle>Quan Tâm Nhiều</SectionTitle>
              <div className="mt-2 flex flex-col gap-3">
                {data.mostViewed.map((item, idx) => (
                  <MostViewedItem key={item.id} item={item} index={idx} />
                ))}
              </div>
            </div>

            {/* SERVICES CARD */}
            <div className="sticky top-4">
              <div className="group relative overflow-hidden rounded-2xl bg-xanh-than text-white shadow-lg">
                {/* Background Image Overlay */}
                <div className="absolute inset-0 opacity-20">
                  <img
                    src={data.services.image}
                    className="h-full w-full object-cover"
                    alt=""
                  />
                </div>

                <div className="relative p-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                    <svg
                      className="h-8 w-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>

                  <h5 className="text-xl font-bold">{data.services.title}</h5>

                  <p className="mt-3 text-sm text-slate-200 leading-relaxed">
                    {data.services.content}
                  </p>

                  <a
                    href={data.services.url}
                    className="mt-6 inline-block w-full rounded-xl bg-white py-3 text-sm font-bold text-xanh-than hover:bg-blue-50 transition-colors shadow-md"
                  >
                    {data.services.ctaText}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
