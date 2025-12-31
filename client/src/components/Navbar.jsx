// src/components/Navbar.jsx
import { useEffect, useState, useMemo } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { MOCK, selectPropertyCard } from "../hook/data";

// Helper lấy sản phẩm nổi bật
const getFeaturedProperties = (category) => {
  const allIds = MOCK.listing || Object.keys(MOCK.entities.properties);
  const cards = allIds.map((id) => selectPropertyCard(id)).filter(Boolean);

  let filtered = [];
  if (category === "PROJECT") {
    filtered = cards.filter((c) => c.isProject);
  } else if (category === "SALE") {
    filtered = cards.filter(
      (c) => c.transactionType === "SALE" && !c.isProject
    );
  } else if (category === "RENT") {
    filtered = cards.filter((c) => c.transactionType === "RENT");
  }
  return filtered.slice(0, 4);
};

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(null);

  useEffect(() => {
    setMobileOpen(false);
    setMobileDropdown(null);
  }, [location.pathname]);

  const menuConfig = useMemo(
    () => [
      {
        id: "PROJECT",
        label: "DỰ ÁN",
        path: "/properties?tab=PROJECT", // Link gửi tham số tab
        items: getFeaturedProperties("PROJECT"),
      },
      {
        id: "SALE",
        label: "MUA NHÀ",
        path: "/properties?tab=SALE",
        items: getFeaturedProperties("SALE"),
      },
      {
        id: "RENT",
        label: "THUÊ NHÀ",
        path: "/properties?tab=RENT",
        items: getFeaturedProperties("RENT"),
      },
      { id: "NEWS", label: "TIN TỨC", scrollId: "news" },
      { id: "CONTACT", label: "LIÊN HỆ", scrollId: "contact" },
    ],
    []
  );

  const handleScrollTo = (id) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
    }
    setMobileOpen(false);
  };

  return (
    // SỬA LỖI 1: Luôn set bg-[#0E2038] để không bị mất chữ trên nền trắng
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#0E2038] shadow-md py-4 transition-all duration-300">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* LOGO */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-white tracking-tighter z-50"
        >
          Real<span className="text-yellow-400">Estate</span>.
        </Link>

        {/* DESKTOP MENU */}
        <ul className="hidden lg:flex items-center gap-2">
          {menuConfig.map((menu) => (
            <li key={menu.id} className="group">
              {menu.items ? (
                <div className="relative">
                  <Link
                    to={menu.path}
                    className="px-5 py-3 text-sm font-bold text-white hover:text-yellow-400 transition-colors uppercase tracking-wide block"
                  >
                    {menu.label}
                  </Link>

                  {/* Mega Menu */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-[900px] pt-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-4">
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 border-8 border-transparent border-b-white"></div>
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden p-6">
                      <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
                        <h4 className="text-[#0E2038] font-bold text-lg">
                          Sản phẩm nổi bật
                        </h4>
                        <Link
                          to={menu.path}
                          className="text-sm font-bold text-indigo-600 hover:underline"
                        >
                          Xem tất cả {menu.label.toLowerCase()} →
                        </Link>
                      </div>

                      <div className="grid grid-cols-4 gap-4">
                        {menu.items.map((item) => (
                          <Link
                            key={item.id}
                            to={`/properties/${item.slug}`}
                            className="group/card block"
                          >
                            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 mb-3">
                              <img
                                src={item.coverUrl}
                                alt={item.title}
                                className="w-full h-full object-cover transition duration-500 group-hover/card:scale-110"
                              />
                              <div className="absolute bottom-2 left-2 bg-[#0E2038]/90 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm">
                                {item.typeName}
                              </div>
                            </div>
                            <h5 className="text-xs font-bold text-slate-800 line-clamp-2 group-hover/card:text-[#0E2038] mb-1 h-8">
                              {item.title}
                            </h5>
                            <span className="text-indigo-600 font-bold text-xs">
                              {item.displayPrice}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => handleScrollTo(menu.scrollId)}
                  className="px-5 py-3 text-sm font-bold text-white hover:text-yellow-400 transition-colors uppercase tracking-wide"
                >
                  {menu.label}
                </button>
              )}
            </li>
          ))}
        </ul>

        {/* MOBILE HAMBURGER */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden flex flex-col gap-1.5 z-50 p-2"
        >
          <span
            className={`w-6 h-0.5 bg-white transition-all ${
              mobileOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></span>
          <span
            className={`w-6 h-0.5 bg-white transition-all ${
              mobileOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`w-6 h-0.5 bg-white transition-all ${
              mobileOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></span>
        </button>

        {/* MOBILE MENU */}
        <div
          className={`fixed inset-0 bg-[#0E2038] z-40 flex flex-col pt-24 px-6 transition-all duration-500 ${
            mobileOpen
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0"
          }`}
        >
          <ul className="flex flex-col gap-4">
            {menuConfig.map((menu) => (
              <li key={menu.id} className="border-b border-white/10 pb-4">
                {menu.items ? (
                  <div>
                    <button
                      onClick={() =>
                        setMobileDropdown(
                          mobileDropdown === menu.id ? null : menu.id
                        )
                      }
                      className="w-full flex justify-between items-center text-white font-bold text-lg"
                    >
                      {menu.label}
                      <span
                        className={`text-xl transition-transform ${
                          mobileDropdown === menu.id ? "rotate-180" : ""
                        }`}
                      >
                        ▾
                      </span>
                    </button>
                    <div
                      className={`grid transition-all duration-300 overflow-hidden ${
                        mobileDropdown === menu.id
                          ? "grid-rows-[1fr] mt-4"
                          : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="min-h-0 flex flex-col gap-4 pl-2">
                        <Link
                          to={menu.path}
                          className="text-yellow-400 text-sm font-bold uppercase tracking-wider mb-2"
                        >
                          → Xem tất cả
                        </Link>
                        {menu.items.map((item) => (
                          <Link
                            key={item.id}
                            to={`/properties/${item.slug}`}
                            className="flex gap-4 items-center"
                          >
                            <img
                              src={item.coverUrl}
                              className="w-16 h-12 object-cover rounded bg-slate-700"
                              alt="thumb"
                            />
                            <div className="flex-1">
                              <p className="text-white text-sm font-medium line-clamp-1">
                                {item.title}
                              </p>
                              <p className="text-indigo-300 text-xs font-bold">
                                {item.displayPrice}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleScrollTo(menu.scrollId)}
                    className="w-full text-left text-white font-bold text-lg"
                  >
                    {menu.label}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
