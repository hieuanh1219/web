// src/data/news.mock.js
export const mockNewsPayload = {
  // 1. TIN NỔI BẬT (Featured)
  featured: {
    id: "n1",
    title:
      "Tại sao Vingroup, MIK Group, Đèo Cả đột ngột rút khỏi loạt siêu dự án hạ tầng?",
    excerpt:
      "Chuyên gia nhận định việc rút lui có thể liên quan tái cấu trúc vốn, thay đổi quy hoạch hoặc điều kiện đấu thầu...",
    time: "2 giờ trước",
    image:
      "https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=1200&q=80",
    badge: "TIN NỔI BẬT",
    // Link bài viết chi tiết
    url: "https://cafef.vn/bat-dong-san.chn",
  },

  // 2. TIN BÊN TRÁI (Left News)
  leftNews: [
    {
      id: "n2",
      title:
        "4 trường hợp không được bồi thường khi Nhà nước thu hồi đất từ năm 2026",
      time: "2 giờ trước",
      excerpt:
        "Một số trường hợp như lấn chiếm, sử dụng sai mục đích, không đủ điều kiện cấp giấy...",
      thumb:
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80",
      url: "https://thuvienphapluat.vn/chinh-sach-phap-luat-moi",
    },
    {
      id: "n3",
      title: "Casa Villa – sinh lời và tận hưởng điểm đến bên bờ biển Vũng Tàu",
      time: "3 giờ trước",
      excerpt:
        "Dự án nghỉ dưỡng với thiết kế hiện đại, tiện ích đồng bộ, phù hợp nhu cầu đầu tư dài hạn...",
      thumb:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80",
      url: "https://vnexpress.net/bat-dong-san/du-an",
    },
    {
      id: "n4",
      title: "Nhà ở xã hội tăng tốc, thị trường bất động sản vẫn ‘nén’ pha",
      time: "1 ngày trước",
      excerpt:
        "Nguồn cung tăng nhưng lực cầu và tốc độ hấp thụ còn phụ thuộc tín dụng và hạ tầng...",
      thumb:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
      url: "https://dantri.com.vn/bat-dong-san.htm",
    },
  ],

  // 3. QUAN TÂM NHIỀU (Most Viewed) - Đã thêm URL
  mostViewed: [
    {
      id: "m1",
      title:
        "Những người có đất ở 4 trường hợp không được bồi thường khi Nhà nước thu hồi đất từ năm 2026",
      time: "1 giờ trước",
      url: "https://thuvienphapluat.vn/page/tin-tuc-phap-luat.aspx",
    },
    {
      id: "m2",
      title:
        "Người mua nhà phải vay xuyên đêm, mệt mỏi vì cơn sốt phân khúc căn hộ Hà Nội",
      time: "4 giờ trước",
      url: "https://dantri.com.vn/bat-dong-san/thi-truong.htm",
    },
    {
      id: "m3",
      title:
        "Vinhomes: chủ tịch Phạm Nhật Vượng nhận nhiệm vụ tại siêu dự án 8.500 tỷ đồng ở Khánh Hòa",
      time: "7 giờ trước",
      url: "https://cafef.vn/doanh-nghiep.chn",
    },
    {
      id: "m4",
      title:
        "Vinhomes: chủ tịch Phạm Nhật Vượng sắp bán hàng ngàn căn hộ xã hội với giá 22 triệu đồng/m2",
      time: "11 giờ trước",
      url: "https://vnexpress.net/bat-dong-san",
    },
  ],

  // 4. DỊCH VỤ (Services)
  services: {
    title: "Ký gửi nhà đất trọn gói",
    content:
      "Ký gửi bất động sản hiệu quả: đăng tin, lọc khách, dẫn xem, hỗ trợ pháp lý và chốt giao dịch. Tối ưu giá bán/cho thuê với đội ngũ tư vấn giàu kinh nghiệm.",
    image:
      "https://images.unsplash.com/photo-1560518883-2d3e2f4f4b58?auto=format&fit=crop&w=1200&q=80",
    ctaText: "XEM CHI TIẾT",
    // Link trỏ về trang ký gửi của web bạn (hoặc link ngoài)
    url: "/ky-gui-nha-dat",
  },
};

// Giả lập API call
export async function getNews() {
  await new Promise((r) => setTimeout(r, 250));
  return mockNewsPayload;
}
