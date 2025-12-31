// src/components/PropertyCard.jsx
// component mới
import React from "react";
import { Link } from "react-router-dom";
import { selectPropertyCard } from "../hook/data"; // chỉnh path

export default function PropertyCard({ propertyId }) {
  const card = selectPropertyCard(propertyId);
  if (!card) return null;

  return (
    <Link
      to={`/properties/${card.slug}`}
      className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="aspect-[16/10] w-full bg-slate-100">
        {card.coverUrl ? (
          <img
            src={card.coverUrl}
            alt={card.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-500">
            No image
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="text-sm font-semibold text-slate-900 line-clamp-2">
          {card.title}
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="text-base font-bold text-slate-900">
            {card.displayPrice || "—"}
          </div>
          <div className="text-xs text-slate-600">
            {card.area ? `${card.area} m²` : "—"}
          </div>
        </div>

        <div className="mt-2 text-xs text-slate-600">
          {card.typeName || "—"} • {card.locationName || "—"}
        </div>

        <div className="mt-3 flex gap-2">
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700">
            {card.transactionType}
          </span>
          <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700">
            {card.bedrooms ?? "—"} PN • {card.bathrooms ?? "—"} WC
          </span>
        </div>
      </div>
    </Link>
  );
}