import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Thêm chút hiệu ứng cho sinh động
import PropertyCard from "./PropertyCard";
import { MOCK, selectPropertyCard } from "../hook/data";

export default function ProductList() {
  const navigate = useNavigate();

  // --- LOGIC ĐỒNG BỘ VỚI PROPERTYLISTPAGE ---
  const products = useMemo(() => {
    const allIds = MOCK.listing || Object.keys(MOCK.entities.properties);

    return allIds
      .filter((id) => {
        const rawProp = MOCK.entities.properties[id];
        if (!rawProp) return false;

        // Logic "Mua Bán" (SALE) = Không phải thuê VÀ Có đất
        const hasLandArea =
          rawProp.landArea && parseFloat(rawProp.landArea) > 0;
        const isRent = rawProp.transactionType === "RENT";

        return !isRent && hasLandArea;
      })
      .slice(0, 8)
      .map((id) => selectPropertyCard(id));
  }, []);

  const handleViewMore = () => {
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
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border-2 border-[#0E2038] bg-transparent px-8 py-4 font-bold text-[#0E2038] transition-all hover:bg-[#0E2038] hover:text-white active:scale-95"
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
