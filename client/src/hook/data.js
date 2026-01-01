// fe.one-property.mock.js
// DATA MOCK: Đã chuẩn hóa theo Schema Prisma

export const MOCK = {
  // =================
  // ENTITIES (Normalized Tables)
  // =================
  entities: {
    // 0. USERS (Bắt buộc phải có để map với authorId trong Property)
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

    // 1. LOCATIONS (Khớp model Location)
    locations: {
      loc_hcm: {
        id: "loc_hcm",
        name: "TP. Hồ Chí Minh",
        slug: "tp-ho-chi-minh",
        parentId: null,
      },
      loc_hcm_thu_duc: {
        id: "loc_hcm_thu_duc",
        name: "TP. Thủ Đức",
        slug: "tp-thu-duc",
        parentId: "loc_hcm",
      },
      loc_hcm_q1: {
        id: "loc_hcm_q1",
        name: "Quận 1",
        slug: "quan-1",
        parentId: "loc_hcm",
      },
      loc_hcm_q7: {
        id: "loc_hcm_q7",
        name: "Quận 7",
        slug: "quan-7",
        parentId: "loc_hcm",
      },
      loc_hn: {
        id: "loc_hn",
        name: "Hà Nội",
        slug: "ha-noi",
        parentId: null,
      },
      loc_hn_cau_giay: {
        id: "loc_hn_cau_giay",
        name: "Cầu Giấy",
        slug: "cau-giay",
        parentId: "loc_hn",
      },
      loc_bd: {
        id: "loc_bd",
        name: "Bình Dương",
        slug: "binh-duong",
        parentId: null,
      },
      loc_dn: {
        id: "loc_dn",
        name: "Đà Nẵng",
        slug: "da-nang",
        parentId: null,
      },
      loc_pq: {
        id: "loc_pq",
        name: "Phú Quốc",
        slug: "phu-quoc",
        parentId: null,
      },
    },

    // 2. PROPERTY TYPES (Khớp model PropertyType)
    propertyTypes: {
      type_apartment: { id: "type_apartment", name: "Căn hộ", slug: "can-ho" },
      type_land: { id: "type_land", name: "Đất nền", slug: "dat-nen" },
      type_townhouse: {
        id: "type_townhouse",
        name: "Nhà phố",
        slug: "nha-pho",
      },
      type_villa: { id: "type_villa", name: "Biệt thự", slug: "biet-thu" },
      type_office: { id: "type_office", name: "Văn phòng", slug: "van-phong" },
      type_shophouse: {
        id: "type_shophouse",
        name: "Shophouse",
        slug: "shophouse",
      },
      type_factory: {
        id: "type_factory",
        name: "Nhà xưởng",
        slug: "nha-xuong",
      },
      type_hotel_resort: {
        id: "type_hotel_resort",
        name: "Hotel - Resort",
        slug: "hotel-resort",
      },
    },

    // 3. AMENITIES (Khớp model Amenity)
    amenities: {
      amen_pool: { id: "amen_pool", name: "Hồ bơi", slug: "ho-boi" },
      amen_gym: { id: "amen_gym", name: "Phòng gym", slug: "phong-gym" },
      amen_parking: {
        id: "amen_parking",
        name: "Hầm để xe",
        slug: "ham-de-xe",
      },
      amen_security_24_7: {
        id: "amen_security_24_7",
        name: "Bảo vệ 24/7",
        slug: "bao-ve-24-7",
      },
      amen_elevator: {
        id: "amen_elevator",
        name: "Thang máy",
        slug: "thang-may",
      },
      amen_bbq: { id: "amen_bbq", name: "Khu BBQ", slug: "khu-bbq" },
      amen_park: { id: "amen_park", name: "Công viên", slug: "cong-vien" },
      amen_3phase_electric: {
        id: "amen_3phase_electric",
        name: "Điện 3 pha",
        slug: "dien-3-pha",
      },
      amen_container_access: {
        id: "amen_container_access",
        name: "Xe Cont vào tận nơi",
        slug: "xe-cont-vao",
      },
      amen_meeting_room: {
        id: "amen_meeting_room",
        name: "Phòng họp chung",
        slug: "phong-hop",
      },
      amen_beach: {
        id: "amen_beach",
        name: "Bãi biển riêng",
        slug: "bai-bien-rieng",
      },
    },

    // 4. TAGS (Khớp model Tag)
    tags: {
      tag_near_metro: {
        id: "tag_near_metro",
        name: "Gần Metro",
        slug: "gan-metro",
      },
      tag_full_furniture: {
        id: "tag_full_furniture",
        name: "Full nội thất",
        slug: "full-noi-that",
      },
      tag_river_view: {
        id: "tag_river_view",
        name: "View sông",
        slug: "view-song",
      },
      tag_good_price: {
        id: "tag_good_price",
        name: "Giá tốt",
        slug: "gia-tot",
      },
      tag_urgent: {
        id: "tag_urgent",
        name: "Cần bán gấp",
        slug: "can-ban-gap",
      },
      tag_new: { id: "tag_new", name: "Mới xây", slug: "moi-xay" },
      tag_foreigner_quota: {
        id: "tag_foreigner_quota",
        name: "Suất người nước ngoài",
        slug: "suat-nnn",
      },
      tag_high_roi: {
        id: "tag_high_roi",
        name: "Lợi nhuận cao",
        slug: "loi-nhuan-cao",
      },
    },

    // =================
    // PROPERTY (CORE) - Map với model Property
    // NOTE: `coverUrl` và `displayPrice` là field FE tự thêm (computed),
    // DB thực tế lưu trong PropertyImage hoặc tính toán runtime.
    // =================
    properties: {
      // 1. Căn hộ bán
      prop_001: {
        id: "prop_001",
        title:
          "Căn hộ 3PN Masteri Thảo Điền, full nội thất, view sông (Tầng cao)",
        slug: "can-ho-3pn-masteri-thao-dien-full-noi-that-view-song-001",
        description: `
          BÁN CĂN HỘ 3 PHÒNG NGỦ MASTERI THẢO ĐIỀN - TẦM NHÌN SÔNG SÀI GÒN TUYỆT ĐẸP

Cần tìm chủ nhân mới cho căn hộ cao cấp tại tháp T2, Masteri Thảo Điền. Căn hộ có diện tích 92.5m2, được thiết kế 3 phòng ngủ và 2 WC, tối ưu hóa công năng sử dụng cho gia đình đa thế hệ.

Điểm đắt giá nhất của căn hộ chính là vị trí tầng cao với tầm nhìn trực diện ra sông Sài Gòn. Gia chủ có thể tận hưởng không gian sống trong lành, thoáng đãng và ngắm nhìn khung cảnh thành phố lung linh về đêm ngay tại ban công nhà mình.

Về nội thất, chủ nhà đã đầu tư mạnh tay với toàn bộ trang thiết bị nhập khẩu từ Ý. Từ bộ sofa da thật tại phòng khách, bàn ăn mặt đá sang trọng cho đến hệ thống bếp Bosch hiện đại đều được chọn lọc kỹ lưỡng. Căn hộ đang trong tình trạng hoàn hảo, sẵn sàng chào đón cư dân mới dọn vào ở ngay mà không cần sửa chữa thêm.

Cư dân tại đây được thừa hưởng trọn vẹn hệ sinh thái tiện ích đẳng cấp của khu Thảo Điền: mua sắm tại Vincom Mega Mall ngay dưới chân tòa nhà, sử dụng hồ bơi và phòng Gym miễn phí. Đặc biệt, việc kết nối giao thông vô cùng thuận lợi nhờ nhà ga Metro An Phú nằm ngay mặt tiền dự án.

Pháp lý căn hộ hoàn chỉnh, đã có sổ hồng riêng. Giá bán mong muốn là 6.5 tỷ đồng. Gia chủ rất thiện chí bán và sẵn sàng thương lượng mức giá tốt nhất cho khách hàng thanh toán nhanh.
        `,
        transactionType: "SALE",
        status: "PUBLISHED",
        currency: "VND",
        price: "6500000000.00",
        priceMin: "6300000000.00",
        priceMax: "6800000000.00",
        priceUnit: "VND",
        isNegotiable: true,
        area: "92.50",
        landArea: null,
        bedrooms: 3,
        bathrooms: 2,
        floors: null,
        frontage: null,
        roadWidth: null,
        address: "159 Xa lộ Hà Nội, P. Thảo Điền, TP. Thủ Đức",
        latitude: "10.8031000",
        longitude: "106.7317000",
        metaTitle: "Bán căn hộ 3PN Masteri Thảo Điền",
        metaDescription: "Căn hộ 3PN Masteri Thảo Điền, view sông.",
        canonicalUrl: "https://example.com/bds/prop-001",
        locationId: "loc_hcm_thu_duc",
        typeId: "type_apartment",
        authorId: "user_admin_01",
        publishedAt: "2025-12-25T10:00:00.000Z",
        createdAt: "2025-12-20T03:00:00.000Z",
        updatedAt: "2025-12-26T09:30:00.000Z",
        coverUrl:
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
        displayPrice: "6.5 tỷ",
      },

      // 2. Căn hộ thuê
      prop_002: {
        id: "prop_002",
        title: "Cho thuê Landmark 81, 2PN view công viên, nội thất cơ bản",
        slug: "cho-thue-landmark-81-2pn-view-cong-vien",
        description:
          "Căn hộ tầng trung, view trực diện công viên 14ha. Miễn phí quản lý.",
        transactionType: "RENT",
        status: "PUBLISHED",
        currency: "VND",
        price: "25000000.00",
        priceMin: null,
        priceMax: null,
        priceUnit: "VND",
        isNegotiable: true,
        area: "78.00",
        landArea: null,
        bedrooms: 2,
        bathrooms: 2,
        floors: null,
        frontage: null,
        roadWidth: null,
        address: "208 Nguyễn Hữu Cảnh, P.22, Bình Thạnh, HCM",
        latitude: "10.7950",
        longitude: "106.7220",
        metaTitle: "Cho thuê căn hộ Landmark 81 2PN",
        metaDescription: "Giá tốt nhất thị trường.",
        canonicalUrl: "https://example.com/bds/prop-002",
        locationId: "loc_hcm",
        typeId: "type_apartment",
        authorId: "user_admin_01",
        publishedAt: "2026-01-01T08:00:00.000Z",
        createdAt: "2026-01-01T07:00:00.000Z",
        updatedAt: "2026-01-01T07:00:00.000Z",
        coverUrl:
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
        displayPrice: "25 triệu/tháng",
      },

      // 3. Đất nền bán
      prop_003: {
        id: "prop_003",
        title: "Đất nền khu công nghiệp VSIP 2, lô góc 2 mặt tiền",
        slug: "dat-nen-vsip-2-binh-duong-lo-goc",
        description:
          "Thổ cư 100%, sổ hồng riêng. Tiện xây trọ hoặc kinh doanh cafe.",
        transactionType: "SALE",
        status: "PUBLISHED",
        currency: "VND",
        price: "1800000000.00",
        priceMin: null,
        priceMax: null,
        priceUnit: "VND",
        isNegotiable: true,
        area: "150.00",
        landArea: "150.00",
        bedrooms: null,
        bathrooms: null,
        floors: null,
        frontage: "10.0",
        roadWidth: "16.0",
        address: "Đường số 5, VSIP 2, Tân Uyên, Bình Dương",
        latitude: "11.0833",
        longitude: "106.6833",
        metaTitle: "Bán đất nền VSIP 2 Bình Dương",
        metaDescription: "Đất nền sổ đỏ, giá đầu tư.",
        canonicalUrl: "https://example.com/bds/prop-003",
        locationId: "loc_bd",
        typeId: "type_land",
        authorId: "user_admin_01",
        publishedAt: "2026-01-02T09:00:00.000Z",
        createdAt: "2026-01-02T08:00:00.000Z",
        updatedAt: "2026-01-02T08:00:00.000Z",
        coverUrl:
          "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
        displayPrice: "1.8 tỷ",
      },

      // 4. Nhà phố bán
      prop_004: {
        id: "prop_004",
        title: "Nhà phố liền kề Phú Mỹ Hưng, 5x20m, xây 4 tầng",
        slug: "nha-pho-phu-my-hung-quan-7",
        description:
          "Khu vực an ninh, gần trường quốc tế SSIS. Đang có hợp đồng thuê.",
        transactionType: "SALE",
        status: "PUBLISHED",
        currency: "VND",
        price: "22000000000.00",
        priceMin: null,
        priceMax: null,
        priceUnit: "VND",
        isNegotiable: true,
        area: "400.00",
        landArea: "100.00",
        bedrooms: 4,
        bathrooms: 5,
        floors: 4,
        frontage: "5.0",
        roadWidth: "12.0",
        address: "Nguyễn Đức Cảnh, Tân Phong, Quận 7, HCM",
        latitude: "10.7290",
        longitude: "106.7080",
        metaTitle: "Bán nhà phố Phú Mỹ Hưng",
        metaDescription: "Nhà phố thương mại, dòng tiền tốt.",
        canonicalUrl: "https://example.com/bds/prop-004",
        locationId: "loc_hcm_q7",
        typeId: "type_townhouse",
        authorId: "user_admin_01",
        publishedAt: "2026-01-02T10:00:00.000Z",
        createdAt: "2026-01-02T09:30:00.000Z",
        updatedAt: null,
        coverUrl:
          "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800",
        displayPrice: "22 tỷ",
      },

      // 5. Biệt thự bán
      prop_005: {
        id: "prop_005",
        title: "Biệt thự đơn lập Ciputra, căn góc view hồ Tây, sân vườn rộng",
        slug: "biet-thu-ciputra-ha-noi-view-ho",
        description: `
          Siêu phẩm biệt thự đơn lập tại khu đô thị Ciputra Nam Thăng Long. Vị trí đắc địa, căn góc 2 mặt tiền, view thoáng đãng nhìn ra Hồ Tây.
          
          Thông số chi tiết:
          - Diện tích đất: 300m2. Diện tích xây dựng: 150m2 x 3 tầng.
          - Sân vườn: 150m2 trồng nhiều cây cảnh quý, có hồ cá Koi phong thủy.
          - Thiết kế: Tân cổ điển Châu Âu, nội thất gỗ Gõ Đỏ tự nhiên.
          - Công năng: 5 phòng ngủ Master, phòng thờ, phòng Karaoke giải trí, hầm rượu vang.
          - An ninh: Khu Compound bảo vệ 24/7, camera giám sát quanh nhà.
          
          Phù hợp cho gia đình đa thế hệ mong muốn không gian sống đẳng cấp, thượng lưu giữa lòng Hà Nội.
        `,
        transactionType: "SALE",
        status: "PUBLISHED",
        currency: "VND",
        price: "65000000000.00",
        priceMin: null,
        priceMax: null,
        priceUnit: "VND",
        isNegotiable: true,
        area: "300.00",
        landArea: "300.00",
        bedrooms: 5,
        bathrooms: 6,
        floors: 3,
        frontage: "15.0",
        roadWidth: "20.0",
        address: "KĐT Ciputra, Tây Hồ, Hà Nội",
        latitude: "21.0667",
        longitude: "105.8000",
        metaTitle: "Bán biệt thự Ciputra Hà Nội",
        metaDescription: "Siêu phẩm biệt thự view hồ.",
        canonicalUrl: "https://example.com/bds/prop-005",
        locationId: "loc_hn",
        typeId: "type_villa",
        authorId: "user_admin_01",
        publishedAt: "2026-01-03T14:00:00.000Z",
        createdAt: "2026-01-03T10:00:00.000Z",
        updatedAt: null,
        coverUrl:
          "https://images.unsplash.com/photo-1613490493576-2f50331579aa?w=800",
        displayPrice: "65 tỷ",
      },

      // 6. Văn phòng cho thuê
      prop_006: {
        id: "prop_006",
        title: "Sàn văn phòng hạng A - Bitexco Financial Tower, tầng 32",
        slug: "van-phong-bitexco-quan-1",
        description:
          "View toàn cảnh thành phố. Bàn giao thô hoặc hoàn thiện. Miễn phí làm ngoài giờ.",
        transactionType: "RENT",
        status: "PUBLISHED",
        currency: "USD",
        price: "45.00",
        priceMin: null,
        priceMax: null,
        priceUnit: "USD/m2",
        isNegotiable: false,
        area: "250.00",
        landArea: null,
        bedrooms: null,
        bathrooms: null,
        floors: null,
        frontage: null,
        roadWidth: null,
        address: "2 Hải Triều, Bến Nghé, Quận 1, HCM",
        latitude: "10.7716",
        longitude: "106.7044",
        metaTitle: "Cho thuê văn phòng Bitexco",
        metaDescription: "Văn phòng cao cấp Quận 1.",
        canonicalUrl: "https://example.com/bds/prop-006",
        locationId: "loc_hcm_q1",
        typeId: "type_office",
        authorId: "user_admin_01",
        publishedAt: "2026-01-03T09:00:00.000Z",
        createdAt: "2026-01-03T08:00:00.000Z",
        updatedAt: null,
        coverUrl:
          "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
        displayPrice: "45 USD/m²",
      },

      // 7. Shophouse thuê
      prop_007: {
        id: "prop_007",
        title: "Shophouse Nguyễn Cơ Thạch, Sala, phù hợp F&B",
        slug: "shophouse-sala-thu-duc",
        description: "Vỉa hè rộng 8m, khu vực đông đúc dân cư cao cấp.",
        transactionType: "RENT",
        status: "PUBLISHED",
        currency: "USD",
        price: "4000.00",
        priceMin: null,
        priceMax: null,
        priceUnit: "USD",
        isNegotiable: true,
        area: "140.00",
        landArea: null,
        bedrooms: null,
        bathrooms: 2,
        floors: 2,
        frontage: "7.0",
        roadWidth: "30.0",
        address: "Nguyễn Cơ Thạch, An Lợi Đông, Thủ Đức",
        latitude: "10.7700",
        longitude: "106.7100",
        metaTitle: "Cho thuê Shophouse Sala",
        metaDescription: "Mặt tiền kinh doanh đắc địa.",
        canonicalUrl: "https://example.com/bds/prop-007",
        locationId: "loc_hcm_thu_duc",
        typeId: "type_shophouse",
        authorId: "user_admin_01",
        publishedAt: "2026-01-04T08:00:00.000Z",
        createdAt: "2026-01-04T07:00:00.000Z",
        updatedAt: null,
        coverUrl:
          "https://images.unsplash.com/photo-1555617778-02518510b9fa?w=800",
        displayPrice: "4,000 USD/tháng",
      },

      // 8. Nhà xưởng bán
      prop_008: {
        id: "prop_008",
        title: "Cụm nhà xưởng 5000m2 KCN Sóng Thần, PCCC tự động",
        slug: "ban-nha-xuong-song-than",
        description: "Xưởng tiêu chuẩn, trần cao 12m. Đang có sẵn cẩu trục.",
        transactionType: "SALE",
        status: "PUBLISHED",
        currency: "VND",
        price: "45000000000.00",
        priceMin: null,
        priceMax: null,
        priceUnit: "VND",
        isNegotiable: true,
        area: "5000.00",
        landArea: "8000.00",
        bedrooms: null,
        bathrooms: 4,
        floors: 1,
        frontage: "50.0",
        roadWidth: "20.0",
        address: "KCN Sóng Thần 1, Dĩ An, Bình Dương",
        latitude: "10.9200",
        longitude: "106.7500",
        metaTitle: "Bán nhà xưởng Bình Dương",
        metaDescription: "Kho xưởng bán giá tốt.",
        canonicalUrl: "https://example.com/bds/prop-008",
        locationId: "loc_bd",
        typeId: "type_factory",
        authorId: "user_admin_01",
        publishedAt: "2026-01-04T10:00:00.000Z",
        createdAt: "2026-01-04T09:00:00.000Z",
        updatedAt: null,
        coverUrl:
          "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800",
        displayPrice: "45 tỷ",
      },

      // 9. Hotel-Resort bán
      prop_009: {
        id: "prop_009",
        title: "Bán Resort mini 20 Bungalow, mặt biển Bãi Trường",
        slug: "ban-resort-phu-quoc-mat-bien",
        description: "Đang vận hành tốt, doanh thu ổn định. Sở hữu 50 năm.",
        transactionType: "SALE",
        status: "PUBLISHED",
        currency: "VND",
        price: "80000000000.00",
        priceMin: null,
        priceMax: null,
        priceUnit: "VND",
        isNegotiable: true,
        area: "2000.00",
        landArea: "3000.00",
        bedrooms: 20,
        bathrooms: 25,
        floors: 1,
        frontage: "30.0",
        roadWidth: "10.0",
        address: "Bãi Trường, Dương Tơ, Phú Quốc",
        latitude: "10.1500",
        longitude: "103.9800",
        metaTitle: "Bán Resort Phú Quốc",
        metaDescription: "Cơ hội đầu tư nghỉ dưỡng.",
        canonicalUrl: "https://example.com/bds/prop-009",
        locationId: "loc_pq",
        typeId: "type_hotel_resort",
        authorId: "user_admin_01",
        publishedAt: "2026-01-05T08:00:00.000Z",
        createdAt: "2026-01-05T07:00:00.000Z",
        updatedAt: null,
        coverUrl:
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
        displayPrice: "80 tỷ",
      },

      // 10. Đất nền (Lô đất biển Đà Nẵng)
      prop_010: {
        id: "prop_010",
        title: "Lô đất biển Mỹ Khê, vị trí vàng xây khách sạn",
        slug: "dat-bien-my-khe-da-nang",
        description: "Cách biển 50m. Giấy phép xây dựng cao tầng.",
        transactionType: "SALE",
        status: "PUBLISHED",
        currency: "VND",
        price: "35000000000.00",
        priceMin: null,
        priceMax: null,
        priceUnit: "VND",
        isNegotiable: true,
        area: "200.00",
        landArea: "200.00",
        bedrooms: null,
        bathrooms: null,
        floors: null,
        frontage: "10.0",
        roadWidth: "7.5",
        address: "Võ Nguyên Giáp, Sơn Trà, Đà Nẵng",
        latitude: "16.0600",
        longitude: "108.2400",
        metaTitle: "Đất biển Đà Nẵng giá rẻ",
        metaDescription: "",
        canonicalUrl: "",
        locationId: "loc_dn",
        typeId: "type_land",
        authorId: "user_admin_01",
        publishedAt: "2026-01-06T09:00:00.000Z",
        createdAt: "2026-01-06T09:00:00.000Z",
        updatedAt: null,
        coverUrl:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
        displayPrice: "35 tỷ",
      },

      // 11. Căn hộ giá rẻ Cầu Giấy (Rent)
      prop_011: {
        id: "prop_011",
        title: "Căn hộ dịch vụ mini Cầu Giấy, full đồ, 35m2",
        slug: "can-ho-mini-cau-giay",
        description: "Thích hợp cho sinh viên hoặc người đi làm độc thân.",
        transactionType: "RENT",
        status: "PUBLISHED",
        currency: "VND",
        price: "5500000.00",
        priceMin: null,
        priceMax: null,
        priceUnit: "VND",
        isNegotiable: false,
        area: "35.00",
        landArea: null,
        bedrooms: 1,
        bathrooms: 1,
        floors: null,
        frontage: null,
        roadWidth: null,
        address: "Ngõ 165 Cầu Giấy, Hà Nội",
        latitude: "21.0333",
        longitude: "105.7833",
        metaTitle: "",
        metaDescription: "",
        canonicalUrl: "",
        locationId: "loc_hn_cau_giay",
        typeId: "type_apartment",
        authorId: "user_admin_01",
        publishedAt: "2026-01-06T10:00:00.000Z",
        createdAt: "2026-01-06T10:00:00.000Z",
        updatedAt: null,
        coverUrl:
          "https://images.unsplash.com/photo-1522050212171-61b01dd24579?w=800",
        displayPrice: "5.5 triệu/tháng",
      },

      // 12. Shophouse Bán
      prop_012: {
        id: "prop_012",
        title: "Shophouse khối đế Vinhomes Golden River, Ba Son",
        slug: "shophouse-ba-son-quan-1",
        description: "Sở hữu vĩnh viễn, vị trí kim cương ven sông Sài Gòn.",
        transactionType: "SALE",
        status: "PUBLISHED",
        currency: "VND",
        price: "50000000000.00",
        priceMin: null,
        priceMax: null,
        priceUnit: "VND",
        isNegotiable: true,
        area: "120.00",
        landArea: null,
        bedrooms: null,
        bathrooms: 1,
        floors: 2,
        frontage: "6.0",
        roadWidth: null,
        address: "Số 2 Tôn Đức Thắng, Q1, HCM",
        latitude: "10.7800",
        longitude: "106.7050",
        metaTitle: "",
        metaDescription: "",
        canonicalUrl: "",
        locationId: "loc_hcm_q1",
        typeId: "type_shophouse",
        authorId: "user_admin_01",
        publishedAt: "2026-01-07T08:00:00.000Z",
        createdAt: "2026-01-07T08:00:00.000Z",
        updatedAt: null,
        coverUrl:
          "https://images.unsplash.com/photo-1519643381401-22c77e60520e?w=800",
        displayPrice: "50 tỷ",
      },

      // 13. Nhà phố thuê
      prop_013: {
        id: "prop_013",
        title: "Nhà nguyên căn 3 tầng đường Lê Duẩn, Đà Nẵng",
        slug: "nha-le-duan-da-nang",
        description: "Trung tâm mua sắm sầm uất, tiện mở shop thời trang.",
        transactionType: "RENT",
        status: "PUBLISHED",
        currency: "VND",
        price: "40000000.00",
        priceMin: null,
        priceMax: null,
        priceUnit: "VND",
        isNegotiable: true,
        area: "100.00",
        landArea: "100.00",
        bedrooms: 3,
        bathrooms: 3,
        floors: 3,
        frontage: "5.0",
        roadWidth: "20.0",
        address: "Lê Duẩn, Hải Châu, Đà Nẵng",
        latitude: "16.0700",
        longitude: "108.2100",
        metaTitle: "",
        metaDescription: "",
        canonicalUrl: "",
        locationId: "loc_dn",
        typeId: "type_townhouse",
        authorId: "user_admin_01",
        publishedAt: "2026-01-07T11:00:00.000Z",
        createdAt: "2026-01-07T11:00:00.000Z",
        updatedAt: null,
        coverUrl:
          "https://images.unsplash.com/photo-1513584685908-2274653fa87f?w=800",
        displayPrice: "40 triệu/tháng",
      },

      // 14. Kho xưởng thuê
      prop_014: {
        id: "prop_014",
        title: "Kho chứa hàng 500m2 gần cảng Cát Lái",
        slug: "kho-cat-lai-thu-duc",
        description: "Đường xe container không cấm giờ. Sàn epoxy sạch sẽ.",
        transactionType: "RENT",
        status: "PUBLISHED",
        currency: "VND",
        price: "50000000.00",
        priceMin: null,
        priceMax: null,
        priceUnit: "VND",
        isNegotiable: true,
        area: "500.00",
        landArea: "500.00",
        bedrooms: null,
        bathrooms: 1,
        floors: 1,
        frontage: "10.0",
        roadWidth: "15.0",
        address: "KCN Cát Lái, Thủ Đức",
        latitude: "10.7600",
        longitude: "106.7800",
        metaTitle: "",
        metaDescription: "",
        canonicalUrl: "",
        locationId: "loc_hcm_thu_duc",
        typeId: "type_factory",
        authorId: "user_admin_01",
        publishedAt: "2026-01-08T09:00:00.000Z",
        createdAt: "2026-01-08T09:00:00.000Z",
        updatedAt: null,
        coverUrl:
          "https://images.unsplash.com/photo-1565610222536-ef125c59da2c?w=800",
        displayPrice: "50 triệu/tháng",
      },

      // 15. Villa nghỉ dưỡng thuê
      prop_015: {
        id: "prop_015",
        title: "Villa 4PN Sunset Sanato, hồ bơi riêng, view biển",
        slug: "villa-sunset-sanato-thue-ngay",
        description: "Cho thuê ngắn hạn/dài hạn. Nội thất 5 sao.",
        transactionType: "RENT",
        status: "PUBLISHED",
        currency: "VND",
        price: "6000000.00",
        priceMin: null,
        priceMax: null,
        priceUnit: "VND/đêm",
        isNegotiable: true,
        area: "350.00",
        landArea: "400.00",
        bedrooms: 4,
        bathrooms: 4,
        floors: 2,
        frontage: null,
        roadWidth: null,
        address: "Bãi Trường, Phú Quốc",
        latitude: "10.1800",
        longitude: "103.9700",
        metaTitle: "",
        metaDescription: "",
        canonicalUrl: "",
        locationId: "loc_pq",
        typeId: "type_hotel_resort",
        authorId: "user_admin_01",
        publishedAt: "2026-01-08T14:00:00.000Z",
        createdAt: "2026-01-08T14:00:00.000Z",
        updatedAt: null,
        coverUrl:
          "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
        displayPrice: "6 triệu/đêm",
      },

      // 16. Văn phòng bán
      prop_016: {
        id: "prop_016",
        title: "Sàn văn phòng 100m2 tòa Discovery Complex",
        slug: "ban-van-phong-discovery-complex",
        description: "Sổ hồng sở hữu 50 năm. Tầng cao view đẹp.",
        transactionType: "SALE",
        status: "PUBLISHED",
        currency: "VND",
        price: "4500000000.00",
        priceMin: null,
        priceMax: null,
        priceUnit: "VND",
        isNegotiable: true,
        area: "100.00",
        landArea: null,
        bedrooms: null,
        bathrooms: null,
        floors: null,
        frontage: null,
        roadWidth: null,
        address: "302 Cầu Giấy, Hà Nội",
        latitude: "21.0300",
        longitude: "105.7900",
        metaTitle: "",
        metaDescription: "",
        canonicalUrl: "",
        locationId: "loc_hn_cau_giay",
        typeId: "type_office",
        authorId: "user_admin_01",
        publishedAt: "2026-01-09T08:00:00.000Z",
        createdAt: "2026-01-09T08:00:00.000Z",
        updatedAt: null,
        coverUrl:
          "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800",
        displayPrice: "4.5 tỷ",
      },

      // 17. Đất nền giá rẻ
      prop_017: {
        id: "prop_017",
        title: "Đất thổ cư Bến Cát, 100m2, đường nhựa 8m",
        slug: "dat-nen-ben-cat-binh-duong",
        description: "Khu dân cư hiện hữu, gần chợ.",
        transactionType: "SALE",
        status: "PUBLISHED",
        currency: "VND",
        price: "950000000.00",
        priceMin: null,
        priceMax: null,
        priceUnit: "VND",
        isNegotiable: false,
        area: "100.00",
        landArea: "100.00",
        bedrooms: null,
        bathrooms: null,
        floors: null,
        frontage: "5.0",
        roadWidth: "8.0",
        address: "Mỹ Phước 3, Bến Cát, Bình Dương",
        latitude: "11.1000",
        longitude: "106.6000",
        metaTitle: "",
        metaDescription: "",
        canonicalUrl: "",
        locationId: "loc_bd",
        typeId: "type_land",
        authorId: "user_admin_01",
        publishedAt: "2026-01-09T09:00:00.000Z",
        createdAt: "2026-01-09T09:00:00.000Z",
        updatedAt: null,
        coverUrl:
          "https://images.unsplash.com/photo-1592595896551-12b371d546d5?w=800",
        displayPrice: "950 triệu",
      },

      // 18. Căn hộ Penthouse
      prop_018: {
        id: "prop_018",
        title: "Penthouse Đảo Kim Cương, 400m2, hồ bơi riêng",
        slug: "penthouse-dao-kim-cuong",
        description: "Đẳng cấp thượng lưu. View 360 độ sông Sài Gòn.",
        transactionType: "SALE",
        status: "PUBLISHED",
        currency: "VND",
        price: "85000000000.00",
        priceMin: null,
        priceMax: null,
        priceUnit: "VND",
        isNegotiable: true,
        area: "400.00",
        landArea: null,
        bedrooms: 4,
        bathrooms: 5,
        floors: 2,
        frontage: null,
        roadWidth: null,
        address: "Đường số 1, Thạnh Mỹ Lợi, Thủ Đức",
        latitude: "10.7650",
        longitude: "106.7450",
        metaTitle: "",
        metaDescription: "",
        canonicalUrl: "",
        locationId: "loc_hcm_thu_duc",
        typeId: "type_apartment",
        authorId: "user_admin_01",
        publishedAt: "2026-01-10T10:00:00.000Z",
        createdAt: "2026-01-10T10:00:00.000Z",
        updatedAt: null,
        coverUrl:
          "https://images.unsplash.com/photo-1512918760532-3edbed1351c3?w=800",
        displayPrice: "85 tỷ",
      },

      // 19. Hotel bán
      prop_019: {
        id: "prop_019",
        title: "Khách sạn 3 sao, 10 tầng, mặt tiền Nguyễn Văn Linh",
        slug: "ban-khach-san-da-nang",
        description:
          "40 phòng kinh doanh, full nội thất, đang có lượng khách ổn định.",
        transactionType: "SALE",
        status: "PUBLISHED",
        currency: "VND",
        price: "55000000000.00",
        priceMin: null,
        priceMax: null,
        priceUnit: "VND",
        isNegotiable: true,
        area: "1000.00",
        landArea: "120.00",
        bedrooms: 40,
        bathrooms: 42,
        floors: 10,
        frontage: "6.0",
        roadWidth: "30.0",
        address: "Nguyễn Văn Linh, Hải Châu, Đà Nẵng",
        latitude: "16.0500",
        longitude: "108.2000",
        metaTitle: "",
        metaDescription: "",
        canonicalUrl: "",
        locationId: "loc_dn",
        typeId: "type_hotel_resort",
        authorId: "user_admin_01",
        publishedAt: "2026-01-11T08:00:00.000Z",
        createdAt: "2026-01-11T08:00:00.000Z",
        updatedAt: null,
        coverUrl:
          "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
        displayPrice: "55 tỷ",
      },

      // 20. Nhà phố trong ngõ
      prop_020: {
        id: "prop_020",
        title: "Nhà Đống Đa, ngõ xe ba gác, 40m2 x 5 tầng",
        slug: "nha-dong-da-ha-noi",
        description: "Nhà xây mới, về ở ngay. Gần hồ Hoàng Cầu.",
        transactionType: "SALE",
        status: "PUBLISHED",
        currency: "VND",
        price: "6200000000.00",
        priceMin: null,
        priceMax: null,
        priceUnit: "VND",
        isNegotiable: true,
        area: "200.00",
        landArea: "40.00",
        bedrooms: 3,
        bathrooms: 4,
        floors: 5,
        frontage: "4.0",
        roadWidth: "2.5",
        address: "Ngõ 108 Hoàng Cầu, Đống Đa, Hà Nội",
        latitude: "21.0180",
        longitude: "105.8200",
        metaTitle: "",
        metaDescription: "",
        canonicalUrl: "",
        locationId: "loc_hn",
        typeId: "type_townhouse",
        authorId: "user_admin_01",
        publishedAt: "2026-01-12T08:00:00.000Z",
        createdAt: "2026-01-12T08:00:00.000Z",
        updatedAt: null,
        coverUrl:
          "https://images.unsplash.com/photo-1591474200742-8e512e6f98f8?w=800",
        displayPrice: "6.2 tỷ",
      },

      // 21. Shophouse Phú Quốc
      prop_021: {
        id: "prop_021",
        title: "Shophouse Địa Trung Hải - Sun Premier Village Primavera",
        slug: "shophouse-dia-trung-hai-phu-quoc",
        description:
          "View trực diện biển, đón hoàng hôn. Kinh doanh sầm uất 24/7.",
        transactionType: "SALE",
        status: "PUBLISHED",
        currency: "VND",
        price: "25000000000.00",
        priceMin: null,
        priceMax: null,
        priceUnit: "VND",
        isNegotiable: true,
        area: "300.00",
        landArea: "100.00",
        bedrooms: null,
        bathrooms: 3,
        floors: 3,
        frontage: "6.0",
        roadWidth: "10.0",
        address: "An Thới, Phú Quốc",
        latitude: "10.0200",
        longitude: "104.0100",
        metaTitle: "",
        metaDescription: "",
        canonicalUrl: "",
        locationId: "loc_pq",
        typeId: "type_shophouse",
        authorId: "user_admin_01",
        publishedAt: "2026-01-12T09:00:00.000Z",
        createdAt: "2026-01-12T09:00:00.000Z",
        updatedAt: null,
        coverUrl:
          "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800",
        displayPrice: "25 tỷ",
      },
    },

    // =================
    // CHILD TABLES (1-n) - Khớp model PropertyImage, PropertyMedia, PropertyFeature
    // =================
    // propertyImages: {
    //   pimg_001_1: {
    //     id: "pimg_001_1",
    //     propertyId: "prop_001",
    //     url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    //     alt: "PK",
    //     sortOrder: 1,
    //   },

    //   pimg_002_1: {
    //     id: "pimg_002_1",
    //     propertyId: "prop_002",
    //     url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    //     alt: "Living Room",
    //     sortOrder: 1,
    //   },
    //   pimg_002_2: {
    //     id: "pimg_002_2",
    //     propertyId: "prop_002",
    //     url: "https://images.example.com/prop002/2.jpg",
    //     alt: "Bedroom",
    //     sortOrder: 2,
    //   },

    //   pimg_003_1: {
    //     id: "pimg_003_1",
    //     propertyId: "prop_003",
    //     url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
    //     alt: "Đất thực tế",
    //     sortOrder: 1,
    //   },

    //   pimg_004_1: {
    //     id: "pimg_004_1",
    //     propertyId: "prop_004",
    //     url: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800",
    //     alt: "Mặt tiền",
    //     sortOrder: 1,
    //   },

    //   pimg_005_1: {
    //     id: "pimg_005_1",
    //     propertyId: "prop_005",
    //     url: "https://images.unsplash.com/photo-1613490493576-2f50331579aa?w=800",
    //     alt: "Mặt tiền biệt thự",
    //     sortOrder: 1,
    //   },
    //   pimg_005_2: {
    //     id: "pimg_005_2",
    //     propertyId: "prop_005",
    //     url: "https://images.example.com/prop005/2.jpg",
    //     alt: "Sân vườn",
    //     sortOrder: 2,
    //   },

    //   pimg_008_1: {
    //     id: "pimg_008_1",
    //     propertyId: "prop_008",
    //     url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800",
    //     alt: "Cổng kho",
    //     sortOrder: 1,
    //   },
    // },
    propertyImages: {
      // --- PROP 001 (Căn hộ) ---
      pimg_001_1: {
        id: "pimg_001_1",
        propertyId: "prop_001",
        sortOrder: 1,
        url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
        alt: "Phòng khách hiện đại",
      },
      pimg_001_2: {
        id: "pimg_001_2",
        propertyId: "prop_001",
        sortOrder: 2,
        url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800",
        alt: "Khu vực bếp",
      },
      pimg_001_3: {
        id: "pimg_001_3",
        propertyId: "prop_001",
        sortOrder: 3,
        url: "https://images.unsplash.com/photo-1616594031246-8595dc097287?w=800",
        alt: "Phòng ngủ Master",
      },
      pimg_001_4: {
        id: "pimg_001_4",
        propertyId: "prop_001",
        sortOrder: 4,
        url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800",
        alt: "Phòng tắm kính",
      },

      // --- PROP 002 (Căn hộ cho thuê) ---
      pimg_002_1: {
        id: "pimg_002_1",
        propertyId: "prop_002",
        sortOrder: 1,
        url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
        alt: "Phòng khách view thoáng",
      },
      pimg_002_2: {
        id: "pimg_002_2",
        propertyId: "prop_002",
        sortOrder: 2,
        url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
        alt: "Phòng ngủ nhỏ",
      },
      pimg_002_3: {
        id: "pimg_002_3",
        propertyId: "prop_002",
        sortOrder: 3,
        url: "https://images.unsplash.com/photo-1484154218962-a1c002085d2f?w=800",
        alt: "Ban công view công viên",
      },

      // --- PROP 003 (Đất nền) ---
      pimg_003_1: {
        id: "pimg_003_1",
        propertyId: "prop_003",
        sortOrder: 1,
        url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
        alt: "Thực tế lô đất",
      },
      pimg_003_2: {
        id: "pimg_003_2",
        propertyId: "prop_003",
        sortOrder: 2,
        url: "https://images.unsplash.com/photo-1516156008625-3a9d60da9205?w=800",
        alt: "Đường trước mặt",
      },

      // --- PROP 004 (Nhà phố) ---
      pimg_004_1: {
        id: "pimg_004_1",
        propertyId: "prop_004",
        sortOrder: 1,
        url: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800",
        alt: "Mặt tiền nhà phố",
      },
      pimg_004_2: {
        id: "pimg_004_2",
        propertyId: "prop_004",
        sortOrder: 2,
        url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
        alt: "Phòng khách sang trọng",
      },
      pimg_004_3: {
        id: "pimg_004_3",
        propertyId: "prop_004",
        sortOrder: 3,
        url: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800",
        alt: "Sân thượng",
      },

      // --- PROP 005 (Biệt thự) ---
      pimg_005_1: {
        id: "pimg_005_1",
        propertyId: "prop_005",
        sortOrder: 1,
        url: "https://images.unsplash.com/photo-1613490493576-2f50331579aa?w=800",
        alt: "Toàn cảnh biệt thự",
      },
      pimg_005_2: {
        id: "pimg_005_2",
        propertyId: "prop_005",
        sortOrder: 2,
        url: "https://images.unsplash.com/photo-1572331165267-854da2b00ca1?w=800",
        alt: "Hồ bơi sân vườn",
      },
      pimg_005_3: {
        id: "pimg_005_3",
        propertyId: "prop_005",
        sortOrder: 3,
        url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800",
        alt: "Phòng khách lớn",
      },
      pimg_005_4: {
        id: "pimg_005_4",
        propertyId: "prop_005",
        sortOrder: 4,
        url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
        alt: "Hầm rượu",
      },

      // --- PROP 006 (Văn phòng) ---
      pimg_006_1: {
        id: "pimg_006_1",
        propertyId: "prop_006",
        sortOrder: 1,
        url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
        alt: "Sảnh văn phòng",
      },
      pimg_006_2: {
        id: "pimg_006_2",
        propertyId: "prop_006",
        sortOrder: 2,
        url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800",
        alt: "Góc làm việc view đẹp",
      },

      // --- PROP 007 (Shophouse) ---
      pimg_007_1: {
        id: "pimg_007_1",
        propertyId: "prop_007",
        sortOrder: 1,
        url: "https://images.unsplash.com/photo-1555617778-02518510b9fa?w=800",
        alt: "Mặt tiền kinh doanh",
      },

      // --- PROP 008 (Nhà xưởng) ---
      pimg_008_1: {
        id: "pimg_008_1",
        propertyId: "prop_008",
        sortOrder: 1,
        url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800",
        alt: "Cổng chính",
      },
      pimg_008_2: {
        id: "pimg_008_2",
        propertyId: "prop_008",
        sortOrder: 2,
        url: "https://images.unsplash.com/photo-1565610222536-ef125c59da2c?w=800",
        alt: "Không gian bên trong",
      },

      // --- PROP 009 (Resort) ---
      pimg_009_1: {
        id: "pimg_009_1",
        propertyId: "prop_009",
        sortOrder: 1,
        url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
        alt: "View biển",
      },
      pimg_009_2: {
        id: "pimg_009_2",
        propertyId: "prop_009",
        sortOrder: 2,
        url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800",
        alt: "Bungalow",
      },
      pimg_009_3: {
        id: "pimg_009_3",
        propertyId: "prop_009",
        sortOrder: 3,
        url: "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800",
        alt: "Hồ bơi chung",
      },

      // --- PROP 018 (Penthouse) ---
      pimg_018_1: {
        id: "pimg_018_1",
        propertyId: "prop_018",
        sortOrder: 1,
        url: "https://images.unsplash.com/photo-1512918760532-3edbed1351c3?w=800",
        alt: "Terrace view",
      },
      pimg_018_2: {
        id: "pimg_018_2",
        propertyId: "prop_018",
        sortOrder: 2,
        url: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800",
        alt: "Phòng khách thông tầng",
      },

      // --- PROP 020 (Nhà ngõ) ---
      pimg_020_1: {
        id: "pimg_020_1",
        propertyId: "prop_020",
        sortOrder: 1,
        url: "https://images.unsplash.com/photo-1591474200742-8e512e6f98f8?w=800",
        alt: "Mặt tiền",
      },
      pimg_020_2: {
        id: "pimg_020_2",
        propertyId: "prop_020",
        sortOrder: 2,
        url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800",
        alt: "Phòng ngủ",
      },
    },

    propertyMedia: {
      pmedia_001: {
        id: "pmedia_001",
        propertyId: "prop_001",
        type: "VIDEO",
        url: "video.mp4",
        title: "Tour",
        sortOrder: 1,
      },
      pmedia_005: {
        id: "pmedia_005",
        propertyId: "prop_005",
        type: "VR",
        url: "vr.html",
        title: "360 Villa",
        sortOrder: 1,
      },
    },

    propertyFeatures: {
      // Prop 1: Căn hộ
      pf_01_1: {
        id: "pf_01_1",
        propertyId: "prop_001",
        key: "legal",
        value: "Sổ hồng lâu dài",
      },
      pf_01_2: {
        id: "pf_01_2",
        propertyId: "prop_001",
        key: "direction",
        value: "Đông Nam",
      },
      pf_01_3: {
        id: "pf_01_3",
        propertyId: "prop_001",
        key: "furniture",
        value: "Đầy đủ cao cấp",
      },
      pf_01_4: {
        id: "pf_01_4",
        propertyId: "prop_001",
        key: "balcony",
        value: "Đông Nam",
      },

      // Prop 2: Căn hộ thuê
      pf_02_1: {
        id: "pf_02_1",
        propertyId: "prop_002",
        key: "furniture",
        value: "Cơ bản (Rèm, máy lạnh)",
      },
      pf_02_2: {
        id: "pf_02_2",
        propertyId: "prop_002",
        key: "direction",
        value: "Tây Bắc",
      },
      pf_02_3: {
        id: "pf_02_3",
        propertyId: "prop_002",
        key: "deposit",
        value: "2 tháng",
      },

      // Prop 3: Đất nền
      pf_03_1: {
        id: "pf_03_1",
        propertyId: "prop_003",
        key: "legal",
        value: "Sổ đỏ thổ cư 100%",
      },
      pf_03_2: {
        id: "pf_03_2",
        propertyId: "prop_003",
        key: "direction",
        value: "Đông",
      },
      pf_03_3: {
        id: "pf_03_3",
        propertyId: "prop_003",
        key: "build_permit",
        value: "Xây tự do",
      },

      // Prop 4: Nhà phố
      pf_04_1: {
        id: "pf_04_1",
        propertyId: "prop_004",
        key: "legal",
        value: "Sổ hồng hoàn công",
      },
      pf_04_2: {
        id: "pf_04_2",
        propertyId: "prop_004",
        key: "direction",
        value: "Nam",
      },
      pf_04_3: {
        id: "pf_04_3",
        propertyId: "prop_004",
        key: "furniture",
        value: "Dính tường",
      },

      // Prop 5: Biệt thự
      pf_05_1: {
        id: "pf_05_1",
        propertyId: "prop_005",
        key: "legal",
        value: "Sổ đỏ chính chủ",
      },
      pf_05_2: {
        id: "pf_05_2",
        propertyId: "prop_005",
        key: "direction",
        value: "Đông Bắc",
      },
      pf_05_3: {
        id: "pf_05_3",
        propertyId: "prop_005",
        key: "view",
        value: "Hồ Tây",
      },

      // Prop 6: Văn phòng
      pf_06_1: {
        id: "pf_06_1",
        propertyId: "prop_006",
        key: "grade",
        value: "Hạng A",
      },
      pf_06_2: {
        id: "pf_06_2",
        propertyId: "prop_006",
        key: "floor_type",
        value: "Sàn nâng",
      },

      // Prop 8: Nhà xưởng
      pf_08_1: {
        id: "pf_08_1",
        propertyId: "prop_008",
        key: "power",
        value: "Trạm biến áp 560KVA",
      },
      pf_08_2: {
        id: "pf_08_2",
        propertyId: "prop_008",
        key: "water",
        value: "Nước máy KCN",
      },

      // Prop 9: Resort
      pf_09_1: {
        id: "pf_09_1",
        propertyId: "prop_009",
        key: "legal",
        value: "Đất TMDV 50 năm",
      },
      pf_09_2: {
        id: "pf_09_2",
        propertyId: "prop_009",
        key: "occupancy",
        value: "80%",
      },
    },

    // =================
    // JOINS (n-n) - Khớp model PropertyAmenity, PropertyTag
    // =================
    propertyAmenities: [
      // Prop 1 (Căn hộ Masteri)
      { propertyId: "prop_001", amenityId: "amen_pool" },
      { propertyId: "prop_001", amenityId: "amen_gym" },
      { propertyId: "prop_001", amenityId: "amen_park" },
      { propertyId: "prop_001", amenityId: "amen_security_24_7" },
      { propertyId: "prop_001", amenityId: "amen_elevator" },

      // Prop 2 (Landmark 81)
      { propertyId: "prop_002", amenityId: "amen_pool" },
      { propertyId: "prop_002", amenityId: "amen_gym" },
      { propertyId: "prop_002", amenityId: "amen_park" },
      { propertyId: "prop_002", amenityId: "amen_security_24_7" },
      { propertyId: "prop_002", amenityId: "amen_elevator" },

      // Prop 4 (Nhà phố)
      { propertyId: "prop_004", amenityId: "amen_parking" },
      { propertyId: "prop_004", amenityId: "amen_security_24_7" },
      { propertyId: "prop_004", amenityId: "amen_park" },

      // Prop 5 (Biệt thự)
      { propertyId: "prop_005", amenityId: "amen_pool" },
      { propertyId: "prop_005", amenityId: "amen_bbq" },
      { propertyId: "prop_005", amenityId: "amen_parking" },
      { propertyId: "prop_005", amenityId: "amen_security_24_7" },

      // Prop 6 (Văn phòng)
      { propertyId: "prop_006", amenityId: "amen_elevator" },
      { propertyId: "prop_006", amenityId: "amen_meeting_room" },
      { propertyId: "prop_006", amenityId: "amen_security_24_7" },
      { propertyId: "prop_006", amenityId: "amen_parking" },

      // Prop 8 (Xưởng)
      { propertyId: "prop_008", amenityId: "amen_3phase_electric" },
      { propertyId: "prop_008", amenityId: "amen_container_access" },
      { propertyId: "prop_008", amenityId: "amen_security_24_7" },

      // Prop 9 (Resort)
      { propertyId: "prop_009", amenityId: "amen_beach" },
      { propertyId: "prop_009", amenityId: "amen_pool" },
      { propertyId: "prop_009", amenityId: "amen_bbq" },
      { propertyId: "prop_009", amenityId: "amen_gym" },

      // Prop 18 (Penthouse)
      { propertyId: "prop_018", amenityId: "amen_pool" },
      { propertyId: "prop_018", amenityId: "amen_elevator" },
      { propertyId: "prop_018", amenityId: "amen_security_24_7" },
    ],

    propertyTags: [
      { propertyId: "prop_001", tagId: "tag_river_view" },
      { propertyId: "prop_002", tagId: "tag_good_price" },
      { propertyId: "prop_002", tagId: "tag_near_metro" },
      { propertyId: "prop_003", tagId: "tag_urgent" },
      { propertyId: "prop_005", tagId: "tag_foreigner_quota" },
      { propertyId: "prop_008", tagId: "tag_good_price" },
      { propertyId: "prop_009", tagId: "tag_high_roi" },
    ],
  },

  // =================
  // HELPER MAPPINGS
  // =================
  route: {
    bySlug: {
      "can-ho-3pn-masteri-thao-dien-full-noi-that-view-song-001": "prop_001",
      "cho-thue-landmark-81-2pn-view-cong-vien": "prop_002",
      "dat-nen-vsip-2-binh-duong-lo-goc": "prop_003",
      "nha-pho-phu-my-hung-quan-7": "prop_004",
      "biet-thu-ciputra-ha-noi-view-ho": "prop_005",
      "van-phong-bitexco-quan-1": "prop_006",
      "shophouse-sala-thu-duc": "prop_007",
      "ban-nha-xuong-song-than": "prop_008",
      "ban-resort-phu-quoc-mat-bien": "prop_009",
      "dat-bien-my-khe-da-nang": "prop_010",
      "can-ho-mini-cau-giay": "prop_011",
      "shophouse-ba-son-quan-1": "prop_012",
      "nha-le-duan-da-nang": "prop_013",
      "kho-cat-lai-thu-duc": "prop_014",
      "villa-sunset-sanato-thue-ngay": "prop_015",
      "ban-van-phong-discovery-complex": "prop_016",
      "dat-nen-ben-cat-binh-duong": "prop_017",
      "penthouse-dao-kim-cuong": "prop_018",
      "ban-khach-san-da-nang": "prop_019",
      "nha-dong-da-ha-noi": "prop_020",
      "shophouse-dia-trung-hai-phu-quoc": "prop_021",
    },
  },
};

// =================
// SELECTORS (Logic giả lập JOIN của Backend)
// =================
export const selectPropertyDetail = (propertyId) => {
  const e = MOCK.entities;
  const p = e.properties[propertyId];
  if (!p) return null;

  const images = Object.values(e.propertyImages)
    .filter((x) => x.propertyId === propertyId)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const media = Object.values(e.propertyMedia)
    .filter((x) => x.propertyId === propertyId)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const features = Object.values(e.propertyFeatures).filter(
    (x) => x.propertyId === propertyId
  );

  const amenityIds = e.propertyAmenities
    .filter((x) => x.propertyId === propertyId)
    .map((x) => x.amenityId);

  const tagIds = e.propertyTags
    .filter((x) => x.propertyId === propertyId)
    .map((x) => x.tagId);

  return {
    ...p,
    author: e.users[p.authorId] || null, // Join User
    location: e.locations[p.locationId] || null, // Join Location
    type: e.propertyTypes[p.typeId] || null, // Join Type
    images, // Join PropertyImage
    media, // Join PropertyMedia
    features, // Join PropertyFeature
    amenities: amenityIds.map((id) => e.amenities[id]).filter(Boolean), // Join Amenities
    tags: tagIds.map((id) => e.tags[id]).filter(Boolean), // Join Tags
  };
};

export const selectPropertyCard = (propertyId) => {
  const p = MOCK.entities.properties[propertyId];
  if (!p) return null;

  const location = MOCK.entities.locations[p.locationId];
  const type = MOCK.entities.propertyTypes[p.typeId];

  // Logic phân loại hiển thị
  const isProject = !p.landArea || parseFloat(p.landArea) === 0;

  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    coverUrl: p.coverUrl, // Backend thường trả về url ảnh đầu tiên
    displayPrice: p.displayPrice,
    transactionType: p.transactionType,
    status: p.status,
    area: p.area,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    locationName: location?.name,
    typeName: type?.name,
    isProject: isProject,
    categoryLabel: isProject ? "Dự án" : "Nhà riêng",
    subSpec: isProject
      ? `Diện tích sử dụng: ${p.area}m²`
      : `Đất: ${p.landArea}m² • MT: ${p.frontage}m`,
  };
};
