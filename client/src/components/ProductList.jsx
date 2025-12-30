// list nhà <- trang chủ
import { Link, useNavigate } from "react-router-dom";
import { sampleProducts } from "../hook/chitietsanpham"; // dùng chung data với ProductDetail

const soluong = 8;

const formatPrice = (price) => price.toLocaleString("vi-VN") + " ₫";

function ProductCard({ p }) {
  const cover = (p.images?.[0] || p.image) ?? "/house1.jpg";

  return (
    <Link
      to={`/ProductDetail/${p.id}`} // ✅ KHỚP route hiện tại của mày
      className="group block rounded-2xl overflow-hidden border bg-white shadow-sm hover:shadow-lg transition"
    >
      <div className="relative overflow-hidden">
        <img
          src={cover}
          alt={p.name}
          className="w-full h-48 object-cover group-hover:scale-[1.03] transition"
        />

        {/* ✅ Badge type */}
        {p.type && (
          <div className="absolute left-3 top-3 rounded-full border border-gray-200 bg-white/90 px-3 py-1 text-xs font-medium text-gray-700">
            🏷 {p.type}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg line-clamp-2">{p.name}</h3>

        <p className="text-sm text-gray-500 mt-1 line-clamp-1">
          📍 {p.address}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-blue-600 font-bold">{formatPrice(p.price)}</p>
          <p className="text-sm text-gray-500">{p.area} m²</p>
        </div>

        <div className="mt-3 flex gap-2 text-xs">
          <span className="px-2 py-1 rounded-lg bg-gray-100">
            🛏 {p.bedrooms}
          </span>
          <span className="px-2 py-1 rounded-lg bg-gray-100">
            🚿 {p.bathrooms}
          </span>
          <span className="px-2 py-1 rounded-lg bg-gray-100">
            🧭 {p.direction}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function ProductList() {
  const navigate = useNavigate();

  const handleViewMore = () => {
    navigate("/nha");
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">Các sản phẩm</h2>
        <p className="text-gray-500 mt-2">
          Gợi ý bất động sản nổi bật dành cho bạn
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {sampleProducts.slice(0, soluong).map((p) => (
          <ProductCard key={p.id} p={p} />
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
