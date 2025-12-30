// list dự án <- trang chủ
import { Link, useNavigate } from "react-router-dom";
import { sampleProjects } from "../hook/chitietduan";

const soluong = 8;

const formatPriceShort = (vnd) => {
  if (!Number.isFinite(vnd)) return "—";
  if (vnd >= 1_000_000_000) return `${(vnd / 1_000_000_000).toFixed(1)} tỷ`;
  if (vnd >= 1_000_000) return `${Math.round(vnd / 1_000_000)} triệu`;
  return vnd.toLocaleString("vi-VN") + " ₫";
};

function ProjectCard({ p }) {
  const cover = p.images?.[0] ?? "/house1.jpg";

  return (
    <Link
      to={`/ProjectDetail/${p.id}`}
      className="group block rounded-2xl overflow-hidden border bg-white shadow-sm hover:shadow-lg transition"
    >
      <div className="overflow-hidden relative">
        <img
          src={cover}
          alt={p.name}
          className="w-full h-48 object-cover group-hover:scale-[1.03] transition"
        />

        {/* badge status */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-xl bg-black/60 text-white text-xs backdrop-blur border border-white/10">
          🏗 {p.status}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg line-clamp-2">{p.name}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-1">
          📍 {p.location}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-blue-600 font-bold">
            Giá từ {formatPriceShort(p.priceFrom)}
          </p>
          <p className="text-sm text-gray-500">
            {p.minArea}–{p.maxArea} m²
          </p>
        </div>

        <div className="mt-3 flex gap-2 text-xs flex-wrap">
          <span className="px-2 py-1 rounded-lg bg-gray-100">🏙 {p.type}</span>
          <span className="px-2 py-1 rounded-lg bg-gray-100">
            🏢 {p.developer}
          </span>
          <span className="px-2 py-1 rounded-lg bg-gray-100">
            📦 {p.handover}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function ProjectList() {
  const navigate = useNavigate();

  const handleViewMore = () => {
    navigate("/duan"); // route list dự án full
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Các dự án</h2>
        <p className="text-gray-500 mt-2">Gợi ý dự án nổi bật dành cho bạn</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sampleProjects.slice(0, soluong).map((p) => (
          <ProjectCard key={p.id} p={p} />
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <button
          onClick={handleViewMore}
          className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
        >
          Xem thêm
        </button>
      </div>
    </div>
  );
}
