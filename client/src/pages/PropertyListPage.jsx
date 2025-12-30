//page list sản phẩm mới 
import React, { useMemo, useState } from "react";
import PropertyCard from "../components/PropertyCard";
import { MOCK, selectPropertyCard } from "../hook/data"; // chỉnh path theo dự án bạn

export default function PropertyListPage() {
  const [q, setQ] = useState("");

  const propertyIds = MOCK.listing || [];

  const cards = useMemo(() => {
    const list = propertyIds
      .map((id) => selectPropertyCard(id))
      .filter(Boolean);

    const keyword = q.trim().toLowerCase();
    if (!keyword) return list;

    return list.filter((c) => {
      const hay = [
        c.title,
        c.locationName,
        c.typeName,
        c.displayPrice,
        c.transactionType,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(keyword);
    });
  }, [propertyIds, q]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Danh sách sản phẩm</h1>
              <p className="mt-1 text-sm text-slate-600">
                Tổng: <span className="font-semibold text-slate-900">{propertyIds.length}</span>
              </p>
            </div>

            <div className="w-full sm:w-96">
              <label className="block text-xs font-semibold uppercase tracking-wide text-slate-600">
                Tìm kiếm
              </label>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="VD: Masteri, Thảo Điền, 3PN..."
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none focus:border-slate-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        {cards.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="text-lg font-semibold text-slate-900">Không có sản phẩm phù hợp</div>
            <div className="mt-1 text-sm text-slate-600">Thử từ khóa khác.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((c) => (
              <PropertyCard key={c.id} propertyId={c.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
