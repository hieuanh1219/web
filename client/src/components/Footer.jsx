// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

// --- ICONS SVG CHUẨN ---
const Icons = {
  Phone: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  ),
  Mail: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  ),
  MapPin: () => (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  ),
  Send: () => (
    <svg
      className="w-4 h-4"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M14 5l7 7m0 0l-7 7m7-7H3"
      />
    </svg>
  ),
  Check: () => (
    <svg
      className="w-5 h-5 text-emerald-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  ),

  // Social Brand Icons (Fill)
  Facebook: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 2.848-6.304 6.162-6.304 1.882 0 3.659.26 3.886.333v4.03h-2.199c-1.558 0-1.993 1.056-1.993 2.503v1.018h3.93l-.53 3.667h-3.4v7.98H9.1z" />
    </svg>
  ),
  Youtube: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.498-5.814z" />
    </svg>
  ),
  Gmail: () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
    </svg>
  ),
};

export default function Footer() {
  return (
    <footer
      id="contact"
      className="bg-[#0E2038] text-white pt-20 pb-10 overflow-hidden relative font-sans"
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      <div className="absolute -top-[200px] -right-[200px] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* --- TOP SECTION: CTA & NEWSLETTER --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 border-b border-white/5 pb-16">
          <div className="lg:col-span-7">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Bạn đang tìm kiếm{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">
                ngôi nhà mơ ước?
              </span>
            </h2>
            <p className="text-slate-300 text-lg max-w-xl leading-relaxed">
              Đăng ký để nhận thông tin về các dự án mới nhất, bảng giá độc
              quyền và ưu đãi đặc biệt từ RealEstate.
            </p>
          </div>
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="relative group">
              <input
                type="email"
                placeholder="Nhập địa chỉ email của bạn..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-36 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:bg-white/10 transition-all text-white placeholder-slate-400"
              />
              <button className="absolute right-2 top-2 bottom-2 bg-white text-[#0E2038] hover:bg-yellow-400 font-bold px-6 rounded-xl transition-all shadow-lg flex items-center gap-2">
                <span>Đăng ký</span>
                <Icons.Send />
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-3 ml-2">
              *Chúng tôi cam kết bảo mật thông tin cá nhân của bạn.
            </p>
          </div>
        </div>

        {/* --- MAIN CONTENT GRID (3 CỘT) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 mb-16">
          {/* CỘT 1: THƯƠNG HIỆU & MẠNG XÃ HỘI */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-blue-500/30">
                R
              </div>
              <div>
                <span className="text-2xl font-bold tracking-tight block leading-none">
                  RealEstate
                </span>
                <span className="text-[10px] uppercase tracking-widest text-slate-400">
                  Luxury Homes
                </span>
              </div>
            </Link>
            <p className="text-slate-400 leading-relaxed text-sm max-w-sm">
              Kiến tạo không gian sống đẳng cấp. Chúng tôi cung cấp giải pháp
              bất động sản toàn diện với sự minh bạch và chuyên nghiệp hàng đầu.
            </p>

            {/* SOCIAL ICONS */}
            <div className="pt-4">
              <p className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-3">
                Kết nối với chúng tôi
              </p>
              <div className="flex gap-4">
                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-[#1877F2]/10 hover:bg-[#1877F2] text-[#1877F2] hover:text-white flex items-center justify-center transition-all duration-300 border border-[#1877F2]/20"
                  title="Facebook"
                >
                  <Icons.Facebook />
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 rounded-full bg-[#FF0000]/10 hover:bg-[#FF0000] text-[#FF0000] hover:text-white flex items-center justify-center transition-all duration-300 border border-[#FF0000]/20"
                  title="YouTube"
                >
                  <Icons.Youtube />
                </a>

                {/* Gmail */}
                <a
                  href="mailto:contact@realestate.com"
                  className="w-10 h-10 rounded-full bg-[#EA4335]/10 hover:bg-[#EA4335] text-[#EA4335] hover:text-white flex items-center justify-center transition-all duration-300 border border-[#EA4335]/20"
                  title="Gmail"
                >
                  <Icons.Gmail />
                </a>
              </div>
            </div>
          </div>

          {/* CỘT 2: THÔNG TIN LIÊN HỆ */}
          <div>
            <h4 className="font-bold text-lg mb-6 flex items-center gap-2 text-white">
              <span className="w-8 h-[2px] bg-yellow-500"></span> Liên hệ
            </h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4 text-sm text-slate-300 group">
                <div className="mt-1 text-yellow-400 p-2 bg-yellow-400/10 rounded-lg group-hover:bg-yellow-400 group-hover:text-[#0E2038] transition-colors">
                  <Icons.MapPin />
                </div>
                <div>
                  <span className="block font-bold text-white mb-1">
                    Trụ sở chính
                  </span>
                  <span>Tầng 12, Tòa nhà Bitexco, Q.1, TP. Hồ Chí Minh</span>
                </div>
              </li>
              <li className="flex items-center gap-4 text-sm text-slate-300 group">
                <div className="text-yellow-400 p-2 bg-yellow-400/10 rounded-lg group-hover:bg-yellow-400 group-hover:text-[#0E2038] transition-colors">
                  <Icons.Phone />
                </div>
                <div>
                  <span className="block font-bold text-white mb-1">
                    Hotline tư vấn
                  </span>
                  <a
                    href="tel:0901234567"
                    className="hover:text-yellow-400 transition text-lg font-mono"
                  >
                    0901 234 567
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-4 text-sm text-slate-300 group">
                <div className="text-yellow-400 p-2 bg-yellow-400/10 rounded-lg group-hover:bg-yellow-400 group-hover:text-[#0E2038] transition-colors">
                  <Icons.Mail />
                </div>
                <div>
                  <span className="block font-bold text-white mb-1">
                    Email hỗ trợ
                  </span>
                  <a
                    href="mailto:contact@realestate.com"
                    className="hover:text-yellow-400 transition"
                  >
                    contact@realestate.com
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* CỘT 3: THỐNG KÊ (STATS CARD) */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-3xl p-8 border border-white/10 backdrop-blur-md shadow-2xl relative overflow-hidden">
            {/* Hiệu ứng nền nhẹ */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <h4 className="font-bold text-white mb-6 text-lg">
              Dấu ấn phát triển
            </h4>
            <div className="space-y-5 relative z-10">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <span className="text-slate-400 text-sm font-medium">
                  Khách hàng tin chọn
                </span>
                <span className="font-bold text-xl text-white">5,000+</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <span className="text-slate-400 text-sm font-medium">
                  Dự án phân phối
                </span>
                <span className="font-bold text-xl text-white">120+</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-400 text-sm font-medium">
                  Tỷ lệ hài lòng
                </span>
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xl">
                  <span>99%</span>
                  <Icons.Check />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <p className="text-xs text-slate-500 mb-3">
                Đối tác chiến lược của các ngân hàng lớn
              </p>
              <div className="flex justify-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                {/* Giả lập logo bank bằng text placeholder hoặc khối */}
                <span className="h-6 w-12 bg-white/20 rounded"></span>
                <span className="h-6 w-12 bg-white/20 rounded"></span>
                <span className="h-6 w-12 bg-white/20 rounded"></span>
                <span className="h-6 w-12 bg-white/20 rounded"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
