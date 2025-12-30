// fe.one-property.mock.js
// 1 sản phẩm để test FE — cấu trúc dễ nhân bản / chèn thêm data

export const MOCK = {
  // =================
  // ENTITIES (by table)
  // =================
  entities: {
    locations: {
      loc_hcm: { id: "loc_hcm", name: "TP. Hồ Chí Minh", slug: "tp-ho-chi-minh", parentId: null },
      loc_hcm_thu_duc: { id: "loc_hcm_thu_duc", name: "TP. Thủ Đức", slug: "tp-thu-duc", parentId: "loc_hcm" },
    },

    propertyTypes: {
      type_apartment: { id: "type_apartment", name: "Căn hộ", slug: "can-ho" },
    },

    amenities: {
      amen_pool: { id: "amen_pool", name: "Hồ bơi", slug: "ho-boi" },
      amen_gym: { id: "amen_gym", name: "Phòng gym", slug: "phong-gym" },
      amen_parking: { id: "amen_parking", name: "Hầm để xe", slug: "ham-de-xe" },
      amen_security_24_7: { id: "amen_security_24_7", name: "Bảo vệ 24/7", slug: "bao-ve-24-7" },
      amen_elevator: { id: "amen_elevator", name: "Thang máy", slug: "thang-may" },
    },

    tags: {
      tag_near_metro: { id: "tag_near_metro", name: "Gần Metro", slug: "gan-metro" },
      tag_full_furniture: { id: "tag_full_furniture", name: "Full nội thất", slug: "full-noi-that" },
      tag_river_view: { id: "tag_river_view", name: "View sông", slug: "view-song" },
      tag_good_price: { id: "tag_good_price", name: "Giá tốt", slug: "gia-tot" },
    },

    // =================
    // PROPERTY (core fields)
    // =================
    properties: {
      prop_001: {
        id: "prop_001",
        title: "Căn hộ 3PN Masteri Thảo Điền, full nội thất, view sông (Tầng cao)",
        slug: "can-ho-3pn-masteri-thao-dien-full-noi-that-view-song-001",
        description:
          "Căn hộ thiết kế hiện đại, nội thất cao cấp. Gần Metro, tiện ích đầy đủ. View sông thoáng, tầng cao yên tĩnh.",
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

        address: "159 Xa lộ Hà Nội, Phường Thảo Điền, TP. Thủ Đức, TP.HCM",
        latitude: "10.8031000",
        longitude: "106.7317000",

        metaTitle: "Bán căn hộ 3PN Masteri Thảo Điền | Full nội thất | View sông",
        metaDescription: "Căn hộ 3PN Masteri Thảo Điền, full nội thất, view sông, tầng cao. Giá tốt.",
        canonicalUrl: "https://example.com/bds/can-ho-3pn-masteri-thao-dien-full-noi-that-view-song-001",

        locationId: "loc_hcm_thu_duc",
        typeId: "type_apartment",

        publishedAt: "2025-12-25T10:00:00.000Z",
        createdAt: "2025-12-20T03:00:00.000Z",
        updatedAt: "2025-12-26T09:30:00.000Z",

        // FE convenience (không bắt buộc)
        coverUrl: "https://images.example.com/properties/prop_001/cover.jpg",
        displayPrice: "6.5 tỷ",
      },
    },

    // =================
    // CHILD TABLES (1-n)
    // =================
    propertyImages: {
      pimg_001: { id: "pimg_001", propertyId: "prop_001", url: "https://images.example.com/properties/prop_001/01.jpg", alt: "Phòng khách - view sông", sortOrder: 1 },
      pimg_002: { id: "pimg_002", propertyId: "prop_001", url: "https://images.example.com/properties/prop_001/02.jpg", alt: "Bếp - bàn ăn", sortOrder: 2 },
      pimg_003: { id: "pimg_003", propertyId: "prop_001", url: "https://images.example.com/properties/prop_001/03.jpg", alt: "Phòng ngủ master", sortOrder: 3 },
      pimg_004: { id: "pimg_004", propertyId: "prop_001", url: "https://images.example.com/properties/prop_001/04.jpg", alt: "Ban công - view sông", sortOrder: 4 },
    },

    propertyMedia: {
      pmedia_001: { id: "pmedia_001", propertyId: "prop_001", type: "VIDEO", url: "https://videos.example.com/properties/prop_001/tour.mp4", title: "Video tour căn hộ", sortOrder: 1 },
      pmedia_002: { id: "pmedia_002", propertyId: "prop_001", type: "VR", url: "https://vr.example.com/properties/prop_001/index.html", title: "VR 360°", sortOrder: 2 },
      pmedia_003: { id: "pmedia_003", propertyId: "prop_001", type: "FILE", url: "https://files.example.com/properties/prop_001/phap-ly.pdf", title: "Hồ sơ pháp lý (PDF)", sortOrder: 3 },
    },

    propertyFeatures: {
      pfeat_001: { id: "pfeat_001", propertyId: "prop_001", key: "legal", value: "Sổ hồng riêng, sang tên nhanh" },
      pfeat_002: { id: "pfeat_002", propertyId: "prop_001", key: "direction", value: "Đông Nam" },
      pfeat_003: { id: "pfeat_003", propertyId: "prop_001", key: "furniture", value: "Full nội thất cao cấp (dọn vào ở ngay)" },
      pfeat_004: { id: "pfeat_004", propertyId: "prop_001", key: "floor", value: "Tầng 29 (tầng cao, thoáng)" },
    },

    // =================
    // JOINS (n-n) — để dạng list là dễ copy/add
    // =================
    propertyAmenities: [
      { propertyId: "prop_001", amenityId: "amen_pool" },
      { propertyId: "prop_001", amenityId: "amen_gym" },
      { propertyId: "prop_001", amenityId: "amen_parking" },
      { propertyId: "prop_001", amenityId: "amen_security_24_7" },
      { propertyId: "prop_001", amenityId: "amen_elevator" },
    ],

    propertyTags: [
      { propertyId: "prop_001", tagId: "tag_near_metro" },
      { propertyId: "prop_001", tagId: "tag_full_furniture" },
      { propertyId: "prop_001", tagId: "tag_river_view" },
      { propertyId: "prop_001", tagId: "tag_good_price" },
    ],
  },

  // =================
  // VIEWS FOR FE (ready-to-render)
  // =================
  // 1) Listing: lấy 1 propertyId -> build card
  listing: ["prop_001"],

  // 2) Detail: mapping slug -> propertyId (routing)
  route: {
    bySlug: {
      "can-ho-3pn-masteri-thao-dien-full-noi-that-view-song-001": "prop_001",
    },
  },
};

// =================
// HELPERS (optional)
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

  const features = Object.values(e.propertyFeatures).filter((x) => x.propertyId === propertyId);

  const amenityIds = e.propertyAmenities.filter((x) => x.propertyId === propertyId).map((x) => x.amenityId);
  const tagIds = e.propertyTags.filter((x) => x.propertyId === propertyId).map((x) => x.tagId);

  return {
    ...p,
    location: e.locations[p.locationId] || null,
    type: e.propertyTypes[p.typeId] || null,
    images,
    media,
    features,
    amenities: amenityIds.map((id) => e.amenities[id]).filter(Boolean),
    tags: tagIds.map((id) => e.tags[id]).filter(Boolean),
  };
};

export const selectPropertyCard = (propertyId) => {
  const p = MOCK.entities.properties[propertyId];
  if (!p) return null;
  const location = MOCK.entities.locations[p.locationId];
  const type = MOCK.entities.propertyTypes[p.typeId];

  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    coverUrl: p.coverUrl,
    displayPrice: p.displayPrice,
    transactionType: p.transactionType,
    status: p.status,
    area: p.area,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    locationName: location?.name,
    typeName: type?.name,
  };
};
