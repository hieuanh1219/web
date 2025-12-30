// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// const menuItems = [
//   {
//     name: "DỰ ÁN",
//     dropdown: [
//       { name: "Căn Hộ", path: "/duan?type=can-ho" },
//       { name: "Biệt Thự", path: "/duan?type=" },
//       { name: "Đất Nền", path: "/service/management" },
//       { name: "ShopHouse", path: "/service/management" },
//       { name: "Hotel-Resort", path: "/service/management" },
//     ],
//   },
//   {
//     name: "MUA NHÀ",
//     dropdown: [
//       { name: "Căn Hộ", path: "/service/advisory" },
//       { name: "Nhà Phố", path: "/service/design" },
//       { name: "Biệt Thự", path: "/service/management" },
//       { name: "Đất nền", path: "/service/management" },
//       { name: "ShopHouse", path: "/service/management" },
//       { name: "Nhà Xưởng", path: "/service/management" },
//     ],
//   },
//   {
//     name: "THUÊ NHÀ",
//     dropdown: [
//       { name: "Căn Hộ", path: "/service/advisory" },
//       { name: "Nhà Phố", path: "/service/design" },
//       { name: "Biệt Thự", path: "/service/management" },
//       { name: "Văn Phòng", path: "/service/management" },
//       { name: "ShopHouse", path: "/service/management" },
//       { name: "Nhà Xưởng", path: "/service/management" },
//     ],
//   },
//   {
//     name: "DỊCH VỤ",
//     dropdown: [{ name: "Ký gửi nhà đất", path: "/service/advisory" }],
//   },
//   { name: "TIN TỨC", scrollId: "news" },
//   { name: "LIÊN HỆ", scrollId: "contact" },
// ];

// export default function Navbar() {
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [mobileDropdown, setMobileDropdown] = useState(null);

//   const handleScroll = (id) => {
//     const yOffset = -80; // chiều cao navbar cố định
//     const element = document.getElementById(id);
//     if (element) {
//       const y =
//         element.getBoundingClientRect().top + window.pageYOffset + yOffset;
//       window.scrollTo({ top: y, behavior: "smooth" });
//     }
//     setMobileOpen(false); // đóng menu mobile sau khi click
//   };

//   return (
//     <nav className="bg-xanh-than text-white shadow-md py-4 px-6 md:px-20 flex justify-between items-center fixed top-0 left-0 w-full z-50">
//       {/* Logo */}
//       <span className="text-2xl font-bold hover:text-xanh-than hover:bg-white transition duration-300 px-3 py-1 rounded cursor-pointer">
//         RealEstate
//       </span>

//       {/* Desktop Menu */}
//       <ul className="hidden md:flex justify-between items-center space-x-6 text-base">
//         {menuItems.map((item) =>
//           item.dropdown ? (
//             <li key={item.name} className="relative group">
//               <span className="flex items-center px-4 py-2 hover:bg-white hover:text-xanh-than transition duration-300 rounded cursor-pointer">
//                 {item.name}
//               </span>

//               <ul className="absolute top-full left-0 mt-1 bg-white text-xanh-than shadow-lg rounded min-w-[180px] opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-50">
//                 {item.dropdown.map((sub) => (
//                   <li key={sub.name}>
//                     <span
//                       className="block px-4 py-2 hover:bg-xanh-than hover:text-white transition duration-200 whitespace-nowrap cursor-pointer"
//                       onClick={() => handleScroll(sub.scrollId)}
//                     >
//                       {sub.name}
//                     </span>
//                   </li>
//                 ))}
//               </ul>
//             </li>
//           ) : item.scrollId ? (
//             <li key={item.name}>
//               <span
//                 className="px-4 py-2 hover:bg-white hover:text-xanh-than transition duration-300 rounded cursor-pointer"
//                 onClick={() => handleScroll(item.scrollId)}
//               >
//                 {item.name}
//               </span>
//             </li>
//           ) : null
//         )}
//       </ul>

//       {/* Mobile Hamburger */}
//       <div
//         className="md:hidden flex flex-col cursor-pointer space-y-1"
//         onClick={() => setMobileOpen(!mobileOpen)}
//       >
//         <span className="w-6 h-0.5 bg-white rounded"></span>
//         <span className="w-6 h-0.5 bg-white rounded"></span>
//         <span className="w-6 h-0.5 bg-white rounded"></span>
//       </div>

//       {/* Mobile Menu */}
//       {mobileOpen && (
//         <ul className="absolute top-full left-0 w-full bg-xanh-than text-center flex flex-col shadow-lg z-50">
//           {menuItems.map((item) => (
//             <li key={item.name} className="border-b border-white/20">
//               {item.dropdown ? (
//                 <>
//                   <button
//                     onClick={() =>
//                       setMobileDropdown(
//                         mobileDropdown === item.name ? null : item.name
//                       )
//                     }
//                     className="w-full flex justify-center items-center px-4 py-3 hover:bg-white hover:text-xanh-than transition duration-300 font-medium"
//                   >
//                     {item.name}
//                   </button>

//                   {mobileDropdown === item.name && (
//                     <ul className="bg-white text-xanh-than">
//                       {item.dropdown.map((sub) => (
//                         <li key={sub.name}>
//                           <span
//                             className="block px-4 py-2 hover:bg-xanh-than hover:text-white transition duration-200 cursor-pointer"
//                             onClick={() => handleScroll(sub.scrollId)}
//                           >
//                             {sub.name}
//                           </span>
//                         </li>
//                       ))}
//                     </ul>
//                   )}
//                 </>
//               ) : item.scrollId ? (
//                 <span
//                   className="block px-4 py-3 hover:bg-white hover:text-xanh-than transition duration-300 cursor-pointer"
//                   onClick={() => handleScroll(item.scrollId)}
//                 >
//                   {item.name}
//                 </span>
//               ) : null}
//             </li>
//           ))}
//         </ul>
//       )}
//     </nav>
//   );
// }
// ---------------------------------------------------
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  {
    name: "DỰ ÁN",
    dropdown: [
      { name: "Căn Hộ", path: "/duan?type=can-ho" },
      { name: "Biệt Thự", path: "/duan?type=biet-thu" },
      { name: "Đất Nền", path: "/duan?type=dat-nen" },
      { name: "ShopHouse", path: "/duan?type=shophouse" },
      { name: "Hotel-Resort", path: "/duan?type=hotel-resort" },
  
    ],
  },
  {
    name: "MUA NHÀ",
    dropdown: [
      { name: "Căn Hộ", path: "/nha?type=can-ho" },
      { name: "Nhà Phố", path: "/nha?type=nha-pho" },
      { name: "Biệt Thự", path: "/nha?type=biet-thu" },
      { name: "Đất Nền", path: "/nha?type=dat-nen" },
      { name: "ShopHouse", path: "/nha?type=shophouse" },
      { name: "Nhà Xưởng", path: "/nha?type=nha-xuong" },

    ],
  },
  {
    name: "THUÊ NHÀ",
    dropdown: [
      { name: "Căn Hộ", path: "/rent?type=can-ho" },
      { name: "Nhà Phố", path: "/rent?type=nha-pho" },
      { name: "Biệt Thự", path: "/rent?type=biet-thu" },
      { name: "Văn Phòng", path: "/rent?type=van-phong" },
      { name: "ShopHouse", path: "/rent?type=shophouse" },
      { name: "Nhà Xưởng", path: "/rent?type=nha-xuong" },
     
    ],
  },

  { name: "TIN TỨC", scrollId: "news" },
  { name: "LIÊN HỆ", scrollId: "contact" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(null);

  // lưu pending scroll khi đang ở trang khác
  const [pendingScrollId, setPendingScrollId] = useState(null);

  const scrollToSection = (id) => {
    const yOffset = -80;
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      return true;
    }
    return false;
  };

  const handleScroll = (id) => {
    // nếu đang ở Home => scroll ngay
    if (location.pathname === "/") {
      scrollToSection(id);
      setMobileOpen(false);
      return;
    }

    // nếu không phải Home => về Home trước, rồi scroll sau
    setPendingScrollId(id);
    navigate("/");
    window.scrollTo(0, 0);
    setMobileOpen(false);
    setMobileDropdown(null);
  };

  // Khi route đổi về "/" thì thực hiện scroll pending
  useEffect(() => {
    if (location.pathname === "/" && pendingScrollId) {
      // chờ Home render xong DOM rồi scroll
      const t = setTimeout(() => {
        const ok = scrollToSection(pendingScrollId);
        if (ok) setPendingScrollId(null);
      }, 50);

      return () => clearTimeout(t);
    }
  }, [location.pathname, pendingScrollId]);

  const handleNav = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
    setMobileOpen(false);
    setMobileDropdown(null);
    setPendingScrollId(null);
  };

  return (
    <nav className="bg-xanh-than text-white shadow-md py-4 px-6 md:px-20 flex justify-between items-center fixed top-0 left-0 w-full z-50">
      {/* Logo */}
      <span
        onClick={() => handleNav("/")}
        className="text-2xl font-bold hover:text-xanh-than hover:bg-white transition duration-300 px-3 py-1 rounded cursor-pointer"
      >
        RealEstate
      </span>

      {/* Desktop Menu */}
      <ul className="hidden md:flex justify-between items-center space-x-6 text-base">
        {menuItems.map((item) =>
          item.dropdown ? (
            <li key={item.name} className="relative group">
              <span className="flex items-center px-4 py-2 hover:bg-white hover:text-xanh-than transition duration-300 rounded cursor-pointer">
                {item.name}
              </span>

              <ul className="absolute top-full left-0 mt-1 bg-white text-xanh-than shadow-lg rounded min-w-[180px] opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-50">
                {item.dropdown.map((sub) => (
                  <li key={sub.name}>
                    <span
                      className="block px-4 py-2 hover:bg-xanh-than hover:text-white transition duration-200 whitespace-nowrap cursor-pointer"
                      onClick={() => handleNav(sub.path)}
                    >
                      {sub.name}
                    </span>
                  </li>
                ))}
              </ul>
            </li>
          ) : item.scrollId ? (
            <li key={item.name}>
              <span
                className="px-4 py-2 hover:bg-white hover:text-xanh-than transition duration-300 rounded cursor-pointer"
                onClick={() => handleScroll(item.scrollId)}
              >
                {item.name}
              </span>
            </li>
          ) : null
        )}
      </ul>

      {/* Mobile Hamburger */}
      <div
        className="md:hidden flex flex-col cursor-pointer space-y-1"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        <span className="w-6 h-0.5 bg-white rounded"></span>
        <span className="w-6 h-0.5 bg-white rounded"></span>
        <span className="w-6 h-0.5 bg-white rounded"></span>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <ul className="absolute top-full left-0 w-full bg-xanh-than text-center flex flex-col shadow-lg z-50">
          {menuItems.map((item) => (
            <li key={item.name} className="border-b border-white/20">
              {item.dropdown ? (
                <>
                  <button
                    onClick={() =>
                      setMobileDropdown(
                        mobileDropdown === item.name ? null : item.name
                      )
                    }
                    className="w-full flex justify-center items-center px-4 py-3 hover:bg-white hover:text-xanh-than transition duration-300 font-medium"
                  >
                    {item.name}
                  </button>

                  {mobileDropdown === item.name && (
                    <ul className="bg-white text-xanh-than">
                      {item.dropdown.map((sub) => (
                        <li key={sub.name}>
                          <span
                            className="block px-4 py-2 hover:bg-xanh-than hover:text-white transition duration-200 cursor-pointer"
                            onClick={() => handleNav(sub.path)}
                          >
                            {sub.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : item.scrollId ? (
                <span
                  className="block px-4 py-3 hover:bg-white hover:text-xanh-than transition duration-300 cursor-pointer"
                  onClick={() => handleScroll(item.scrollId)}
                >
                  {item.name}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
