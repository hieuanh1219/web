// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

// --- ICONS SVG (Giữ nguyên không đổi) ---
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
      className="bg-[#0E2038] text-white pt-12 pb-8 lg:pt-20 lg:pb-10 overflow-hidden relative font-sans"
    >
      {/* --- DECORATIVE ELEMENTS (Ẩn bớt trên mobile để đỡ rối) --- */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

      {/* Chỉ hiện hiệu ứng Blur lớn trên màn hình Desktop (hidden md:block) */}
      <div className="hidden md:block absolute -top-[200px] -right-[200px] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Mobile: Một hiệu ứng nhỏ hơn, tinh tế hơn */}
      <div className="block md:hidden absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[60px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-5 lg:px-6 relative z-10">
        {/* --- SECTION 1: CTA & NEWSLETTER --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12 border-b border-white/5 pb-10 lg:pb-16">
          <div className="lg:col-span-7 text-center lg:text-left">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
              Bạn đang tìm kiếm{" "}
              <span className="block md:inline mt-1 md:mt-0 text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500">
                ngôi nhà mơ ước?
              </span>
            </h2>
            <p className="text-slate-300 text-sm md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Đăng ký để nhận thông tin về dự án mới nhất và bảng giá độc quyền
              từ RealEstate.
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="relative group w-full max-w-md mx-auto lg:max-w-none">
              <input
                type="email"
                placeholder="Nhập email của bạn..."
                // Mobile: Text size 16px để tránh lỗi zoom trên iOS
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-5 pr-32 md:pr-36 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:bg-white/10 transition-all text-white placeholder-slate-400 text-base"
              />
              <button className="absolute right-1.5 top-1.5 bottom-1.5 bg-white text-[#0E2038] hover:bg-yellow-400 active:scale-95 font-bold px-4 md:px-6 rounded-xl transition-all shadow-lg flex items-center gap-2">
                <span className="hidden sm:inline">Đăng ký</span>
                <Icons.Send />
              </button>
            </div>
            <p className="text-[10px] md:text-xs text-slate-500 mt-3 text-center lg:text-left lg:ml-2">
              *Cam kết bảo mật thông tin 100%.
            </p>
          </div>
        </div>

        {/* --- SECTION 2: MAIN CONTENT GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16 mb-8 lg:mb-16">
          {/* CỘT 1: THƯƠNG HIỆU (Căn giữa trên Mobile để làm điểm nhấn) */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-5">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl lg:text-2xl shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
                R
              </div>
              <div className="flex flex-col items-start">
                <span className="text-xl lg:text-2xl font-bold tracking-tight block leading-none">
                  RealEstate
                </span>
                <span className="text-[10px] uppercase tracking-widest text-slate-400">
                  Luxury Homes
                </span>
              </div>
            </Link>
            <p className="text-slate-400 leading-relaxed text-sm max-w-xs mx-auto lg:mx-0">
              Kiến tạo không gian sống đẳng cấp. Giải pháp bất động sản toàn
              diện, minh bạch và chuyên nghiệp.
            </p>

            {/* Social Icons - Tăng kích thước vùng chạm cho mobile */}
            <div className="pt-2">
              <div className="flex gap-4">
                {[
                  {
                    Icon: Icons.Facebook,
                    color: "text-[#1877F2]",
                    bg: "bg-[#1877F2]/10",
                    border: "border-[#1877F2]/20",
                  },
                  {
                    Icon: Icons.Youtube,
                    color: "text-[#FF0000]",
                    bg: "bg-[#FF0000]/10",
                    border: "border-[#FF0000]/20",
                  },
                  {
                    Icon: Icons.Gmail,
                    color: "text-[#EA4335]",
                    bg: "bg-[#EA4335]/10",
                    border: "border-[#EA4335]/20",
                  },
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href="#"
                    target="_blank"
                    rel="noreferrer"
                    className={`w-11 h-11 rounded-full ${
                      social.bg
                    } hover:${social.bg.replace("/10", "")} ${
                      social.color
                    } hover:text-white flex items-center justify-center transition-all duration-300 border ${
                      social.border
                    } active:scale-95`}
                  >
                    <social.Icon />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* CỘT 2: LIÊN HỆ (Giữ căn trái cho dễ đọc) */}
          <div className="px-2 md:px-0">
            <h4 className="font-bold text-lg mb-5 flex items-center gap-2 text-white justify-start">
              <span className="w-8 h-[2px] bg-yellow-500"></span> Liên hệ
            </h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-4 text-sm text-slate-300 group">
                <div className="mt-1 flex-shrink-0 text-yellow-400 p-2 bg-yellow-400/10 rounded-lg group-hover:bg-yellow-400 group-hover:text-[#0E2038] transition-colors">
                  <Icons.MapPin />
                </div>
                <div>
                  <span className="block font-bold text-white mb-0.5">
                    Trụ sở chính
                  </span>
                  <span className="opacity-80">
                    Tầng 12, Tòa nhà Bitexco, Q.1, TP. Hồ Chí Minh
                  </span>
                </div>
              </li>

              <li className="flex items-center gap-4 text-sm text-slate-300 group">
                <div className="flex-shrink-0 text-yellow-400 p-2 bg-yellow-400/10 rounded-lg group-hover:bg-yellow-400 group-hover:text-[#0E2038] transition-colors">
                  <Icons.Phone />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-white mb-0.5">Hotline</span>
                  {/* Số điện thoại to hơn một chút trên mobile để dễ bấm */}
                  <a
                    href="tel:0901234567"
                    className="hover:text-yellow-400 transition text-base font-mono font-medium text-white/90"
                  >
                    0901 234 567
                  </a>
                </div>
              </li>

              <li className="flex items-center gap-4 text-sm text-slate-300 group">
                <div className="flex-shrink-0 text-yellow-400 p-2 bg-yellow-400/10 rounded-lg group-hover:bg-yellow-400 group-hover:text-[#0E2038] transition-colors">
                  <Icons.Mail />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-white mb-0.5">Email</span>
                  <a
                    href="mailto:contact@realestate.com"
                    className="hover:text-yellow-400 transition break-all"
                  >
                    contact@realestate.com
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* CỘT 3: THỐNG KÊ (Card style) */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-3xl p-6 lg:p-8 border border-white/10 backdrop-blur-md shadow-xl relative overflow-hidden md:col-span-2 lg:col-span-1 mx-auto w-full max-w-lg lg:max-w-none">
            {/* Hiệu ứng nền nhẹ - giữ lại nhưng mờ hơn */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <h4 className="font-bold text-white mb-5 text-lg flex items-center justify-between">
              <span>Dấu ấn phát triển</span>
              <span className="block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </h4>

            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-slate-400 text-sm">Khách hàng</span>
                <span className="font-bold text-lg text-white">5,000+</span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-slate-400 text-sm">Dự án</span>
                <span className="font-bold text-lg text-white">120+</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-400 text-sm">Hài lòng</span>
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-lg">
                  <span>99%</span>
                  <Icons.Check />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-white/10 text-center">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-3">
                Đối tác chiến lược
              </p>
              <div className="flex justify-center gap-3 opacity-40 grayscale">
                {/* Bank Logos Placeholder - Tinh chỉnh size */}
                <div className="h-5 w-10 bg-white/30 rounded-sm"></div>
                <div className="h-5 w-10 bg-white/30 rounded-sm"></div>
                <div className="h-5 w-10 bg-white/30 rounded-sm"></div>
                <div className="h-5 w-10 bg-white/30 rounded-sm"></div>
              </div>
            </div>
          </div>
        </div>

        {/* --- COPYRIGHT BAR (Thêm mới để kết thúc footer đẹp hơn) --- */}
        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; 2024 RealEstate. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition">
              Điều khoản
            </a>
            <a href="#" className="hover:text-white transition">
              Bảo mật
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
