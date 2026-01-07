export const MOCK = {
  entities: {
    users: {
      user_admin_01: {
        id: "user_admin_01",
        name: "Admin Support",
        email: "support@batdongsan.com",
        phone: "0909000111",
        role: "ADMIN",
        status: "ACTIVE",
        avatarUrl: "https://i.pravatar.cc/150?u=user_admin_01",
      },
    },
    locations: {
      loc_hcm_thu_duc: { id: "loc_hcm_thu_duc", name: "TP. Thủ Đức", slug: "tp-thu-duc" },
    },
    propertyTypes: {
      type_apartment: { id: "type_apartment", name: "Căn hộ", slug: "can-ho" },
    },
    amenities: {
        amen_pool: { id: "amen_pool", name: "Hồ bơi" }, // Dữ liệu cũ (giữ lại để filter)
    },
    tags: {},

    // =================
    // PROPERTIES (SEED CHI TIẾT)
    // =================
    properties: {
      prop_001: {
        // --- CƠ BẢN ---
        id: "prop_001",
        title: "Simona Heights Quy Nhơn - Biểu Tượng Sống Sang",
        slug: "simona-heights-quy-nhon",
        transactionType: "SALE",
        status: "PUBLISHED",
        price: "6500000000.00",
        displayPrice: "6.5 tỷ",
        priceUnit: "VND",
        area: "92.50",
        bedrooms: 3,
        bathrooms: 2,
        address: "145A Trần Hưng Đạo, P. Lê Lợi, TP. Quy Nhơn",
        coverUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200",
        locationId: "loc_hcm_thu_duc", // Demo
        typeId: "type_apartment",
        authorId: "user_admin_01",
        
        // --- NỘI DUNG MỞ RỘNG (LANDING PAGE DATA) ---
        extendedContent: {
          // 1. TỔNG QUAN
          overview: {
            // Giới thiệu dạng HTML paragraph
            description: [
                "Simona Heights là tuyệt tác kiến trúc Art Deco độc bản tại trung tâm thành phố biển Quy Nhơn. Được phát triển bởi Phú Mỹ Quy Nhơn, dự án không chỉ mang đến không gian sống thượng lưu mà còn là tài sản kế thừa giá trị cho thế hệ mai sau.",
                "Sở hữu vị trí 'kim cương' với 2 mặt tiền đường Trần Hưng Đạo và Trần Bình Trọng, Simona Heights kết nối dễ dàng đến bãi biển vầng trăng khuyết chỉ với 5 phút đi bộ. Đây là dự án hiếm hoi tại Quy Nhơn sở hữu pháp lý sở hữu lâu dài.",
                "Simona Heights được ví như tuyệt tác kiến trúc Art Deco độc bản giữa trung tâm thành phố biển Quy Nhơn – nơi hội tụ tinh hoa thẩm mỹ, giá trị sống đỉnh cao và tiềm năng gia tăng bền vững theo thời gian. Dự án do Phú Mỹ Quy Nhơn phát triển với tầm nhìn kiến tạo một biểu tượng nhà ở sang trọng, không chỉ đáp ứng nhu cầu an cư của giới tinh hoa mà còn trở thành tài sản kế thừa giá trị cho nhiều thế hệ trong tương lai.",
                "Nổi bật với vị trí “kim cương” hiếm có, Simona Heights sở hữu hai mặt tiền đường lớn Trần Hưng Đạo và Trần Bình Trọng – trục giao thông huyết mạch của thành phố. Từ đây, cư dân dễ dàng kết nối đến các tiện ích trọng điểm như trung tâm hành chính, khu mua sắm, ẩm thực, giải trí và đặc biệt là bãi biển vầng trăng khuyết chỉ với khoảng 5 phút đi bộ. Vị trí này không chỉ mang lại sự thuận tiện tối đa trong sinh hoạt hằng ngày mà còn khẳng định giá trị vượt trội của bất động sản tọa lạc ngay lõi trung tâm đô thị biển.",
                "Không dừng lại ở đó, Simona Heights còn ghi dấu ấn mạnh mẽ khi là một trong số rất ít dự án tại Quy Nhơn sở hữu pháp lý lâu dài, mang đến sự an tâm tuyệt đối cho khách hàng và nhà đầu tư. Kết hợp giữa kiến trúc Art Deco sang trọng, vị trí đắc địa hiếm có và giá trị pháp lý bền vững, Simona Heights không chỉ là nơi để ở, mà còn là biểu tượng phong cách sống thượng lưu, khẳng định đẳng cấp và tầm nhìn của chủ nhân trong bức tranh phát triển năng động của thành phố biển Quy Nhơn."
            ],
            // Thông số dự án
            specs: [
                { label: "Chủ đầu tư", value: "Công ty TNHH ĐT XD Phú Mỹ Quy Nhơn" },
                { label: "Tổng diện tích", value: "7.000 m²" },
                { label: "Mật độ xây dựng", value: "45%" },
                { label: "Quy mô", value: "2 block cao 29 tầng (Sea & Art)" },
                { label: "Loại hình", value: "Căn hộ hạng sang, Shophouse" },
                { label: "Bàn giao", value: "Quý IV/2026 (Dự kiến)" }
            ],
            // Ảnh gallery tổng quan
            gallery: [
                "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800",
                // "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
                // "https://images.unsplash.com/photo-1460317442991-0ec2aa9a153d?w=800"
            ]
          },

          // 2. TIỆN ÍCH (Chi tiết từng tiện ích)
          amenities: [
            {
              title: "Hồ bơi vô cực Skypool tầng 29",
              desc: "Thả mình trong làn nước mát lạnh, ngắm nhìn toàn cảnh vịnh Quy Nhơn và cầu Thị Nại lung linh về đêm.",
              image: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800"
            },
            {
              title: "Công viên vườn treo nhiệt đới",
              desc: "Lá phổi xanh giữa tầng không, nơi cư dân tìm về sự cân bằng, thư thái với các loài cây bản địa đặc trưng.",
              image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800"
            },
            {
              title: "Gym & Yoga Center 5 Sao",
              desc: "Trang thiết bị Technogym hiện đại, view biển trực diện giúp tái tạo năng lượng mỗi ngày.",
              image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800"
            },
            {
              title: "Sảnh đón Luxury Lobby",
              desc: "Thiết kế trần cao 6m, ốp đá Marble nhập khẩu, mang lại cảm giác choáng ngợp và đẳng cấp ngay từ bước chân đầu tiên.",
              image: "https://images.unsplash.com/photo-1565514020126-db2899478170?w=800"
            }
          ],

          // 3. MẶT BẰNG THIẾT KẾ
          layouts: [
            {
              name: "Mặt bằng tổng thể (Master Plan)",
              desc: "Bố trí khối đế thương mại tách biệt với khối tháp căn hộ, đảm bảo sự riêng tư nhưng vẫn thuận tiện mua sắm.",
              image: "https://khudothikimdo.net.vn/wp-content/uploads/2021/07/mat-bang-phan-khu-3-khu-do-thi-kim-do.jpg" // Giả lập ảnh layout
            },
            {
              name: "Mặt bằng tầng điển hình (Tầng 6-28)",
              desc: "Mật độ 12 căn/sàn với 4 thang máy tốc độ cao. Hành lang rộng 2.2m thông gió tự nhiên.",
              image: "https://vinhomegreencitys.vn/wp-content/uploads/2025/06/Mat-bang-tien-ich-du-an-Vinhoms-Green-City-Hau-Nghia-Duc-Hoa-Long-An-1024x622.jpg"
            },
            {
              name: "Thiết kế căn 3PN - The Royal",
              desc: "Căn góc 2 view biển. Phòng khách Panorama. Bếp đảo hiện đại.",
              image: "https://aeland.com.vn/wp-content/uploads/2019/05/thiet-ke-van-khe-1.jpg"
            }
          ],

          // 4. VỊ TRÍ & LIÊN KẾT VÙNG
          location: {
            desc: "Nằm ngay giao lộ Trần Hưng Đạo - Trần Bình Trọng, Simona Heights là tâm điểm kết nối của phố biển.",
            latitude: 13.782967,
            longitude: 109.231267,
            mapImage: "https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200", // Ảnh chụp map nếu không dùng iframe
            nearby: [
                { place: "Bãi biển Quy Nhơn", distance: "200m", time: "3 phút đi bộ" },
                { place: "Quảng trường Nguyễn Tất Thành", distance: "500m", time: "5 phút" },
                { place: "Đại học Quy Nhơn", distance: "1km", time: "2 phút xe máy" },
                { place: "Sân bay Phù Cát", distance: "30km", time: "30 phút ô tô" }
            ]
          },

          // 5. HỎI ĐÁP (FAQ)
          faqs: [
            { q: "Pháp lý dự án hiện tại ra sao?", a: "Dự án đã có Giấy phép xây dựng số 12/GPXD và đã đóng 100% tiền sử dụng đất. Khách hàng ký HĐMB trực tiếp CĐT." },
            { q: "Ngân hàng nào hỗ trợ vay vốn?", a: "Vietcombank và Vietinbank bảo lãnh dự án. Hỗ trợ vay 70% giá trị căn hộ trong 20 năm." },
            { q: "Tiến độ thanh toán như thế nào?", a: "Thanh toán giãn 18 đợt. Đợt 1 chỉ 15%. Chiết khấu thanh toán nhanh lên đến 9%." }
          ],

          // 6. TIN TỨC LIÊN QUAN
          news: [
             { title: "Lễ động thổ dự án Simona Heights", date: "15/01/2026", thumb: "https://images.unsplash.com/photo-1504384308090-c54be3852f33?w=600" },
             { title: "Quy Nhơn lọt top điểm đến hàng đầu Đông Nam Á", date: "10/01/2026", thumb: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600" }
          ]
        }
      },
      // ... Các prop khác (prop_002,...) bạn có thể copy cấu trúc này hoặc để null
    },
    propertyImages: {},
    propertyMedia: {},
    propertyFeatures: {},
    propertyAmenities: [],
    propertyTags: [],
  },
  
  route: {
    bySlug: {
      "simona-heights-quy-nhon": "prop_001",
    },
  },
};

export const selectPropertyDetail = (propertyId) => {
  const p = MOCK.entities.properties[propertyId];
  if (!p) return null;
  const location = MOCK.entities.locations[p.locationId];
  return { ...p, locationObj: location };
};

export const selectPropertyCard = (propertyId) => {
  const p = MOCK.entities.properties[propertyId];
  if (!p) return null;
  return {
      id: p.id,
      slug: p.slug,
      title: p.title,
      coverUrl: p.coverUrl,
      displayPrice: p.displayPrice,
      transactionType: p.transactionType,
      status: p.status,
  };
};