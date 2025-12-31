import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Thêm chút hiệu ứng cho sinh động
import PropertyCard from "./PropertyCard";
import { MOCK, selectPropertyCard } from "../hook/data";

export default function ProductList() {
  const navigate = useNavigate();

  // 1. Lấy dữ liệu từ data.js
  const products = useMemo(() => {
    // Lấy danh sách ID
    const allIds = MOCK.listing || Object.keys(MOCK.entities.properties);

    // Map sang object và lọc
    return allIds
      .map((id) => selectPropertyCard(id))
      .filter((p) => p && p.transactionType === "SALE") // Chỉ lấy BĐS đang BÁN (Mua Nhà)
      .slice(0, 8); // Giới hạn 8 sản phẩm
  }, []);

  const handleViewMore = () => {
    // Chuyển sang trang danh sách với tab MUA NHÀ
    navigate("/properties?tab=SALE");
  };

  return (
    <section className="bg-slate-50 py-16 md:py-24">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-extralight text-[#0E2038] md:text-4xl"
          >
            Bất động sản nổi bật
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-3 text-lg text-slate-500 max-w-2xl mx-auto"
          >
            Tuyển chọn những ngôi nhà, căn hộ và biệt thự có giá trị đầu tư tốt
            nhất hiện nay.
          </motion.p>
        </div>

        {/* Grid Products */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p, index) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
            >
              <PropertyCard propertyId={p.id} />
            </motion.div>
          ))}
        </div>

        {/* Button Xem thêm */}
        <div className="mt-16 flex justify-center">
          <button
            onClick={handleViewMore}
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-[#0E2038] px-8 py-4 font-bold text-white shadow-lg transition-all hover:bg-[#1a3a63] hover:shadow-xl hover:shadow-[#0E2038]/20 active:scale-95"
          >
            <span>Xem tất cả nhà đất</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
