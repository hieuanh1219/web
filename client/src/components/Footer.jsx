export default function Footer() {
  return (
    <footer id="contact" className="bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
      {/* Top CTA */}
      <div className="border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">
              Bạn cần tư vấn bất động sản?
            </h2>
            <p className="text-gray-300 mt-2 text-sm md:text-base">
              Đội ngũ RealEstate hỗ trợ nhanh trong 5–15 phút (giờ hành chính).
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <a
              href="tel:0901234567"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white text-gray-900 font-semibold hover:bg-gray-200 transition"
            >
              📞 Gọi ngay: 0901 234 567
            </a>
            <a
              href="mailto:contact@realestate.com"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-emerald-600 font-semibold hover:bg-emerald-500 transition"
            >
              ✉️ Email tư vấn
            </a>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Brand */}
        <div className="lg:col-span-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-xl">
              🏡
            </div>
            <div>
              <h3 className="text-xl font-bold">RealEstate</h3>
              <p className="text-gray-400 text-sm">
                Giải pháp bất động sản uy tín
              </p>
            </div>
          </div>

          <p className="text-gray-300 mt-5 leading-relaxed">
            Chuyên môi giới – ký gửi – mua bán – cho thuê nhà đất, căn hộ và mặt
            bằng kinh doanh. Cam kết minh bạch pháp lý và hỗ trợ xuyên suốt quá
            trình giao dịch.
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-white/5 border border-white/10 p-4">
              <p className="text-2xl font-bold">1,200+</p>
              <p className="text-gray-400 text-xs mt-1">BĐS ký gửi</p>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 p-4">
              <p className="text-2xl font-bold">300+</p>
              <p className="text-gray-400 text-xs mt-1">Giao dịch / năm</p>
            </div>
            <div className="rounded-xl bg-white/5 border border-white/10 p-4">
              <p className="text-2xl font-bold">98%</p>
              <p className="text-gray-400 text-xs mt-1">Khách hài lòng</p>
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="lg:col-span-4">
          <h4 className="text-lg font-semibold mb-4">Liên hệ</h4>

          <div className="space-y-4">
            <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
              <p className="text-sm text-gray-400">Địa chỉ</p>
              <p className="mt-1 font-medium">
                123 Nguyễn Văn A, Quận C, TP.HCM
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
              <p className="text-sm text-gray-400">Hotline</p>
              <a
                href="tel:0901234567"
                className="mt-1 block font-semibold hover:text-emerald-400 transition"
              >
                0901 234 567
              </a>
              <p className="text-gray-400 text-sm mt-2">
                Tư vấn mua bán – cho thuê – pháp lý – vay ngân hàng
              </p>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
              <p className="text-sm text-gray-400">Email</p>
              <a
                href="mailto:contact@realestate.com"
                className="mt-1 block font-semibold hover:text-emerald-400 transition"
              >
                contact@realestate.com
              </a>
            </div>

            <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
              <p className="text-sm text-gray-400">Giờ làm việc</p>
              <ul className="mt-2 text-gray-300 text-sm space-y-1">
                <li>Thứ 2 – Thứ 6: 08:30 – 18:00</li>
                <li>Thứ 7: 08:30 – 12:00</li>
                <li>Chủ nhật: Nghỉ (hẹn trước)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Social */}
        <div className="lg:col-span-4">
          <h4 className="text-lg font-semibold mb-4">Kết nối</h4>

          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <p className="text-gray-400 text-sm">
              Theo dõi RealEstate để cập nhật dự án mới, bảng giá và ưu đãi.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <a className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition">
                Facebook
              </a>
              <a className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition">
                Zalo
              </a>
              <a className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition">
                TikTok
              </a>
              <a className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition">
                YouTube
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
