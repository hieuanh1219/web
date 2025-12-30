
import { useEffect, useState } from "react";
import { getNews } from "../hook/dulieubao";

function SectionTitle({ children }) {
  return (
    <div className="flex items-center gap-3">
      <h2 className="text-lg font-semibold text-xanh-than">{children}</h2>
      <div className="h-px flex-1 bg-slate-200" />
    </div>
  );
}

function TimePill({ children }) {
  return (
    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
      {children}
    </span>
  );
}

function NewsRow({ item }) {
  return (
    <article className="group flex gap-3 py-3">
      {item.thumb && (
        <div className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-slate-100">
          <img
            src={item.thumb}
            alt={item.title}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        </div>
      )}

      <div className="min-w-0">
        <TimePill>{item.time}</TimePill>

        <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-xanh-than group-hover:underline">
          {item.title}
        </h3>

        {item.excerpt && (
          <p className="mt-1 line-clamp-2 text-xs text-slate-600">
            {item.excerpt}
          </p>
        )}
      </div>
    </article>
  );
}

export default function News() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getNews().then(setData);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="rounded-2xl  bg-white p-6">
          <SectionTitle>Tin Tức</SectionTitle>

          <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* LEFT */}
            <div className="lg:col-span-8">
              {data && (
                <>
                  {/* FEATURED */}
                  <article className="overflow-hidden rounded-2xl border border-slate-200">
                    <div className="relative h-64">
                      <img
                        src={data.featured.image}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute left-4 top-4 rounded-full bg-xanh-than px-3 py-1 text-xs font-semibold text-white">
                        {data.featured.badge}
                      </span>
                    </div>

                    <div className="p-5">
                      <TimePill>{data.featured.time}</TimePill>

                      <h3 className="mt-2 text-lg font-bold text-xanh-than">
                        {data.featured.title}
                      </h3>

                      <p className="mt-2 text-sm text-slate-600">
                        {data.featured.excerpt}
                      </p>
                    </div>
                  </article>

                  {/* LIST */}
                  <div className="mt-4 divide-y divide-slate-200">
                    {data.leftNews.map((item) => (
                      <NewsRow key={item.id} item={item} />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* RIGHT */}
            <div className="lg:col-span-4 space-y-6">
              {/* MOST VIEWED */}
              <div className="rounded-2xl border border-slate-200 p-4">
                <h4 className="text-sm font-semibold text-xanh-than">
                  QUAN TÂM NHIỀU
                </h4>

                <div className="mt-4 space-y-3">
                  {data?.mostViewed.map((item, idx) => (
                    <div
                      key={item.id}
                      className="flex gap-3 rounded-xl bg-slate-50 p-3"
                    >
                      <div className="min-w-0">
                        <TimePill>{item.time}</TimePill>
                        <p className="mt-1 line-clamp-2 text-sm font-medium text-xanh-than">
                          {item.title}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SERVICE */}
              <div className="rounded-2xl border border-slate-200 p-4">
                <h4 className="text-lg font-semibold text-xanh-than">
                  Dịch vụ
                </h4>

                <div className="mt-3 overflow-hidden rounded-2xl bg-slate-50">
                  <div className="h-40">
                    <img
                      src={data?.services.image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <h5 className="text-sm font-semibold text-xanh-than">
                      {data?.services.title}
                    </h5>

                    <p className="mt-2 text-sm text-slate-600">
                      {data?.services.content}
                    </p>

                    <button className="mt-4 w-full rounded-xl bg-xanh-than py-2.5 text-sm font-semibold text-white hover:opacity-95">
                      {data?.services.ctaText}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* grid */}
        </div>
      </div>
    </div>
  );
}
