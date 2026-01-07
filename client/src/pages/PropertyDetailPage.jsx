
import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { MOCK, selectPropertyDetail } from "../hook/data";

// --- SUB-COMPONENTS (STYLE MỚI) ---

// Container chung cho các section: Bỏ viền bao quanh, tập trung vào spacing
const SectionContainer = ({ id, title, children }) => (
  <section id={id} className="scroll-mt-28 mb-20 md:mb-24 last:mb-0">
    <div className="flex items-center gap-4 mb-8">
      <h2 className="text-xl md:text-2xl font-noidung font-nomal  text-[#0E2038] uppercase tracking-wider">
        {title}
      </h2>
      <div className="h-px bg-slate-200 flex-1"></div>
    </div>
    {children}
  </section>
);

// 1. TỔNG QUAN: Ảnh to xếp dọc
const Overview = ({ data }) => (
  <div className="flex flex-col gap-10">
    {/* Phần text giới thiệu */}
    <div className="prose prose-lg font-noidung font-nomal text-slate-700 max-w-none text-justify leading-8">
      {data.description?.map((p, i) => <p key={i}>{p}</p>)}
    </div>

    {/* Bảng thông số: Thiết kế phẳng, tối giản */}
    <div className="bg-slate-50 p-6 md:p-8 rounded-sm">
      <h4 className="font-noidung font-bold text-[#0E2038] mb-6 text-sm uppercase tracking-widest border-b border-slate-200 pb-2 inline-block">
        Thông tin dự án
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-12">
        {data.specs?.map((s, i) => (
          <div key={i} className="flex flex-col gap-1">
            <span className="text-xs text-slate-500 uppercase font-noidung font-medium">{s.label}</span>
            <span className="text-base font-noidung font-semibold text-[#0E2038]">{s.value}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Gallery: Ảnh Full Width xếp dọc */}
    <div className="flex flex-col gap-8 mt-4">
      {data.gallery?.map((img, idx) => (
        <figure key={idx} className="w-full">
          <img 
            src={img} 
            alt="Overview" 
            className="w-full h-auto object-cover rounded-sm shadow-sm aspect-[16/9] md:aspect-[21/9]" 
          />
          {/* <figcaption className="mt-3 text-sm text-slate-500 italic text-center md:text-left">
            Phối cảnh thực tế dự án - Góc nhìn {idx + 1}
          </figcaption> */}
        </figure>
      ))}
    </div>
  </div>
);

// 2. TIỆN ÍCH: Ảnh trên - Chữ dưới (Card lớn)
const Amenities = ({ list }) => (
  <div className="grid grid-cols-1 gap-12 md:gap-16">
    {list?.map((item, idx) => (
      <div key={idx} className="group">
        {/* Ảnh lớn */}
        <div className="w-full aspect-video md:aspect-[2/1] overflow-hidden rounded-sm mb-5 relative">
          <img 
            src={item.image} 
            alt={item.title} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
        </div>
        {/* Nội dung bên dưới */}
        <div className="md:px-2">
          <h3 className="text-xl md:text-2xl font-noidung font-nomal text-[#0E2038] mb-3">
            {item.title}
          </h3>
          <p className=" font-noidung font-light text-slate-600 text-base md:text-lg leading-relaxed max-w-4xl">
            {item.desc}
          </p>
        </div>
      </div>
    ))}
  </div>
);

// 3. MẶT BẰNG: Ảnh là trọng tâm
const Layouts = ({ list }) => (
  <div className="flex flex-col gap-16">
    {list?.map((layout, idx) => (
      <div key={idx} className="flex flex-col">
        <div className="bg-slate-50 rounded-sm border border-slate-100 p-4 md:p-8">
            <img 
                src={layout.image} 
                alt={layout.name} 
                className="w-full h-auto object-contain max-h-[80vh] mix-blend-multiply" 
            />
        </div>
        <div className="mt-6 md:px-2">
           <h3 className="text-lg font-noidung font-light text-[#0E2038] mb-1">{layout.name}</h3>
           <p className="text-slate-500 font-noidung font-">{layout.desc}</p>
        </div>
      </div>
    ))}
  </div>
);

// 4. VỊ TRÍ: Map lớn + List kết nối vùng
const Location = ({ data }) => (
  <div className="flex flex-col gap-8">
    <p className="text-lg font-noidung font-nomal text-slate-700 md:w-3/4">{data.desc}</p>
    
    {/* Map full width */}
    <div className="w-full h-[400px] md:h-[500px] bg-slate-100 rounded-sm overflow-hidden border border-slate-200">
         <iframe
            title="Map"
            className="w-full h-full grayscale hover:grayscale-0 transition duration-700"
            src={`https://maps.google.com/maps?q=${data.latitude},${data.longitude}&z=16&output=embed`}
            loading="lazy"
         ></iframe>
    </div>

    {/* Nearby List - Giao diện sạch */}
    <div className="mt-4">
        <h4 className="text-sm font-noidung font-bold uppercase text-slate-400 mb-6 tracking-widest">Kết nối khu vực</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.nearby?.map((n, i) => (
                <div key={i} className="bg-white border-l-2 border-blue-600 pl-4 py-1">
                    <p className="font-noidung font-bold text-[#0E2038] text-lg">{n.place}</p>
                    <div className="flex items-center font-noidung font-light gap-2 text-sm text-slate-500 mt-1">
                        <span>{n.distance}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span>{n.time}</span>
                    </div>
                </div>
            ))}
        </div>
    </div>
  </div>
);

// 5. HỎI ĐÁP & TIN TỨC: Giữ nguyên logic nhưng style phẳng
const FAQ = ({ list }) => (
  <div className="space-y-4">
      {list?.map((item, idx) => (
          <div key={idx} className="border-b border-slate-100 pb-4 last:border-0">
              <h4 className="font-noidung font-bold text-[#0E2038] text-lg mb-2">{item.q}</h4>
              <p className="text-slate-600 font-noidung font-light leading-relaxed">{item.a}</p>
          </div>
      ))}
  </div>
);

const News = ({ list }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {list?.map((n, idx) => (
            <div key={idx} className="group cursor-pointer">
                <div className="w-full aspect-[3/2] overflow-hidden rounded-sm mb-3">
                    <img src={n.thumb} alt="" className="w-full h-full object-cover group-hover:scale-105 transition duration-500"/>
                </div>
                <h4 className="font-noidung font-bold text-[#0E2038] text-lg leading-tight group-hover:text-blue-700 transition">{n.title}</h4>
                <span className="text-xs font-noidung font-light text-slate-400 mt-2 block">{n.date}</span>
            </div>
        ))}
    </div>
);


// --- MAIN PAGE ---

export default function PropertyDetailPage() {
  const { slug } = useParams();
  const propertyId = MOCK.route?.bySlug?.[slug];
  const detail = useMemo(() => (propertyId ? selectPropertyDetail(propertyId) : null), [propertyId]);
  
  const ext = detail?.extendedContent || {};
  const [activeId, setActiveId] = useState("overview");

  const menuItems = [
    { id: "overview", label: "Tổng quan", hasData: !!ext.overview },
    { id: "amenities", label: "Tiện ích", hasData: !!ext.amenities?.length },
    { id: "layouts", label: "Mặt bằng", hasData: !!ext.layouts?.length },
    { id: "location", label: "Vị trí", hasData: !!ext.location },
    { id: "faq", label: "Hỏi đáp", hasData: !!ext.faqs?.length },
    { id: "news", label: "Tin tức", hasData: !!ext.news?.length },
  ].filter(i => i.hasData);

  // Scroll Spy
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const item of menuItems) {
        const element = document.getElementById(item.id);
        if (element && element.offsetTop <= scrollPosition) setActiveId(item.id);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuItems]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
        const offset = 100;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
    }
  };

  if (!detail) return <div className="min-h-screen flex items-center justify-center text-slate-400 tracking-widest uppercase text-sm">Đang tải dữ liệu...</div>;

  return (
    <div className="bg-white min-h-screen font-sans text-slate-700 pb-32">
      
      {/* 1. HERO BANNER: Full màn hình, text tinh tế */}
      <div className="relative w-full h-[60vh] md:h-[80vh]">
        <img src={detail.coverUrl} className="w-full h-full object-cover" alt="Cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80"></div>
        
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-12 lg:p-16">
            <div className="max-w-[1400px] mx-auto text-white animate-fade-in-up">
                <div className="flex items-center gap-3 mb-4">
                    <span className="bg-white/20 backdrop-blur-md border border-white/30 text-white px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-widest">
                        {detail.type?.name}
                    </span>
                    <span className="bg-blue-600 px-3 py-1 rounded-sm text-xs font-noidung font-nomal uppercase tracking-widest">
                        {detail.transactionType === 'SALE' ? 'Đang mở bán' : 'Cho thuê'}
                    </span>
                </div>
                
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-noidung font-bold leading-tight mb-4 tracking-tight shadow-black/20">
                    {detail.title}
                </h1>
                
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-t border-white/20 pt-6 mt-6">
                    <p className="text-lg md:text-xl text-white/90 font-noidung font-light flex items-center gap-2">
                        {detail.address}
                    </p>
                    <div className="flex flex-col items-start md:items-end">
                        <span className="text-xs font-noidung font-nomal uppercase tracking-widest opacity-70 mb-1">Giá niêm yết</span>
                        <span className="text-3xl md:text-4xl font-noidung font-bold text-white">{detail.displayPrice}</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <div className="max-w-[1400px] mx-auto px-5 md:px-10 mt-16 md:mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            
            {/* --- SIDEBAR MENU (Sticky Desktop) --- */}
            <aside className="hidden lg:block lg:col-span-3 h-full">
                <div className="sticky top-28">
                    <nav className="flex flex-col gap-1">
                        {menuItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => scrollTo(item.id)}
                                className={`text-left py-3 px-4 rounded-sm transition-all duration-300 text-sm tracking-wide ${
                                    activeId === item.id
                                    ? "bg-[#0E2038] text-white font-bold shadow-lg shadow-blue-900/20 translate-x-2"
                                    : "text-slate-500 hover:text-[#0E2038] hover:bg-slate-50"
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    {/* Desktop Contact CTA */}
                    <div className="mt-12 p-6 bg-slate-50 border border-slate-100 rounded-sm">
                        <p className="text-xs font-noidung font-bold text-slate-400 uppercase tracking-widest mb-2">Hỗ trợ 24/7</p>
                        <p className="text-2xl font-noidung font-nomal text-[#0E2038] mb-4">0909 000 111</p>
                        <button className="w-full py-3 bg-[#0E2038] text-white font-noidung font-bold text-xs uppercase tracking-widest rounded-sm hover:bg-blue-900 transition shadow-lg shadow-blue-900/10">
                            Yêu cầu tư vấn
                        </button>
                    </div>
                </div>
            </aside>

            {/* --- CONTENT BODY --- */}
            <main className="lg:col-span-9 flex flex-col">
                {ext.overview && (
                    <SectionContainer id="overview" title="Tổng quan">
                        <Overview data={ext.overview} />
                    </SectionContainer>
                )}

                {ext.amenities?.length > 0 && (
                    <SectionContainer id="amenities" title="Tiện ích đẳng cấp">
                        <Amenities list={ext.amenities} />
                    </SectionContainer>
                )}

                {ext.layouts?.length > 0 && (
                    <SectionContainer id="layouts" title="Mặt bằng thiết kế">
                        <Layouts list={ext.layouts} />
                    </SectionContainer>
                )}

                {ext.location && (
                    <SectionContainer id="location" title="Vị trí chiến lược">
                        <Location data={ext.location} />
                    </SectionContainer>
                )}

                {ext.faqs?.length > 0 && (
                    <SectionContainer id="faq" title="Hỏi đáp">
                        <FAQ list={ext.faqs} />
                    </SectionContainer>
                )}

                {ext.news?.length > 0 && (
                    <SectionContainer id="news" title="Tin tức">
                        <News list={ext.news} />
                    </SectionContainer>
                )}
            </main>
        </div>
      </div>

      {/* 3. MOBILE BOTTOM BAR (Tinh tế) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 lg:hidden z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] pb-6 safe-area-pb">
        <div className="flex gap-3">
             <a href="tel:0909000111" className="flex-1 bg-slate-100 text-[#0E2038] font-bold py-3 rounded-sm flex items-center justify-center gap-2 active:scale-95 transition">
                <span>📞 Gọi ngay</span>
             </a>
             <button className="flex-[2] bg-[#0E2038] text-white font-bold py-3 rounded-sm uppercase tracking-wider text-sm shadow-lg shadow-blue-900/20 active:scale-95 transition">
                Nhận báo giá
             </button>
        </div>
      </div>

    </div>
  );
}