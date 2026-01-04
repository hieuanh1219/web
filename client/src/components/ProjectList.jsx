// import React, { useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import PropertyCard from "./PropertyCard";
// import { MOCK, selectPropertyCard } from "../hook/data";

// export default function ProjectList() {
//   const navigate = useNavigate();

//   // --- LOGIC ĐỒNG BỘ VỚI PROPERTYLISTPAGE ---
//   const projects = useMemo(() => {
//     const allIds = MOCK.listing || Object.keys(MOCK.entities.properties);

//     return allIds
//       .filter((id) => {
//         // 1. Lấy dữ liệu thô để kiểm tra
//         const rawProp = MOCK.entities.properties[id];
//         if (!rawProp) return false;

//         // 2. Áp dụng đúng logic của PropertyListPage
//         const hasLandArea =
//           rawProp.landArea && parseFloat(rawProp.landArea) > 0;
//         const isRent = rawProp.transactionType === "RENT";

//         // PROJECT = Không phải thuê VÀ Không có đất
//         const isProject = !isRent && !hasLandArea;

//         return isProject;
//       })
//       .slice(0, 8) // Giới hạn 8
//       .map((id) => selectPropertyCard(id)); // Map sang data hiển thị sau khi đã lọc
//   }, []);

//   const handleViewMore = () => {
//     navigate("/properties?tab=PROJECT");
//   };

//   return (
//     <section className="bg-white py-16 md:py-24">
//       <div className="mx-auto max-w-[1600px] px-6 md:px-12">
//         {/* Header Section */}
//         <div className="mb-12 text-center">
//           <motion.h2
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="text-3xl font-extralight text-[#0E2038] md:text-4xl"
//           >
//             Dự án tiêu biểu
//           </motion.h2>
//           <motion.p
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ delay: 0.1 }}
//             className="mt-3 text-lg text-slate-500 max-w-2xl mx-auto"
//           >
//             Khám phá các dự án căn hộ, khu đô thị hiện đại với tiềm năng sinh
//             lời cao và không gian sống đẳng cấp.
//           </motion.p>
//         </div>

//         {/* Grid Projects */}
//         <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
//           {projects.map((p, index) => (
//             <motion.div
//               key={p.id}
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ delay: index * 0.05, duration: 0.5 }}
//             >
//               <PropertyCard propertyId={p.id} />
//             </motion.div>
//           ))}
//         </div>

//         {/* Button Xem thêm */}
//         <div className="mt-16 flex justify-center">
//           <button
//             onClick={handleViewMore}
//             className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border-2 border-[#0E2038] bg-transparent px-8 py-4 font-bold text-[#0E2038] transition-all hover:bg-[#0E2038] hover:text-white active:scale-95"
//           >
//             <span>Khám phá tất cả dự án</span>
//             <span className="transition-transform duration-300 group-hover:translate-x-1">
//               →
//             </span>
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PropertyCard from "./PropertyCard";
import { MOCK, selectPropertyCard } from "../hook/data";

export default function ProjectList() {
  const navigate = useNavigate();

  // --- LOGIC GIỮ NGUYÊN ---
  const projects = useMemo(() => {
    const allIds = MOCK.listing || Object.keys(MOCK.entities.properties);
    return allIds
      .filter((id) => {
        const rawProp = MOCK.entities.properties[id];
        if (!rawProp) return false;
        const hasLandArea =
          rawProp.landArea && parseFloat(rawProp.landArea) > 0;
        const isRent = rawProp.transactionType === "RENT";
        return !isRent && !hasLandArea;
      })
      .slice(0, 8)
      .map((id) => selectPropertyCard(id));
  }, []);

  const handleViewMore = () => {
    navigate("/properties?tab=PROJECT");
  };

  return (
    <section className="bg-white py-12 md:py-24 overflow-hidden">
      {/* Thêm overflow-hidden để tránh lỗi layout ngang trên mobile */}

      <div className="mx-auto max-w-[1600px] px-4 md:px-12">
        {/* Header Section */}
        <div className="mb-8 md:mb-12 text-center px-2">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-4xl font-extralight text-[#0E2038]"
          >
            Dự án tiêu biểu
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-2 md:mt-3 text-sm md:text-lg text-slate-500 max-w-2xl mx-auto"
          >
            Khám phá các dự án căn hộ, khu đô thị hiện đại với tiềm năng sinh
            lời cao.
          </motion.p>
        </div>

        {/* --- GRID / SCROLL CONTAINER --- */}
        {/* Mobile: Flex + Overflow-x (Trượt ngang)
            Desktop: Grid (Lưới truyền thống)
        */}
        <div
          className="
            flex snap-x snap-mandatory gap-4 overflow-x-auto pb-6 
            md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-8 md:pb-0 
            /* Ẩn thanh scrollbar mặc định cho đẹp (tùy chọn) */
            [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
          "
        >
          {projects.map((p, index) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              // Mobile: Set chiều rộng cố định để các thẻ không bị co lại
              className="min-w-[85vw] sm:min-w-[320px] snap-center md:min-w-0"
            >
              <PropertyCard propertyId={p.id} />
            </motion.div>
          ))}
        </div>

        {/* Button Xem thêm */}
        <div className="mt-8 md:mt-16 flex justify-center">
          <button
            onClick={handleViewMore}
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border-2 border-[#0E2038] bg-transparent px-6 py-3 md:px-8 md:py-4 font-bold text-[#0E2038] transition-all hover:bg-[#0E2038] hover:text-white active:scale-95 text-sm md:text-base"
          >
            <span>Khám phá tất cả dự án</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}