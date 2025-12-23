-- =========================
-- USERS
-- =========================
INSERT INTO users (username, password, role) VALUES
('admin', '$2y$10$adminhashdemo', 'admin'),
('staff01', '$2y$10$staffhashdemo', 'staff');

-- =========================
-- CATEGORIES
-- =========================
INSERT INTO categories (name, slug) VALUES
('Căn hộ chung cư', 'can-ho-chung-cu'),
('Nhà phố', 'nha-pho'),
('Đất nền', 'dat-nen'),
('Biệt thự', 'biet-thu');

-- =========================
-- LOCATIONS
-- =========================
INSERT INTO locations (city, district, ward) VALUES
('Quy Nhơn', 'TP Quy Nhơn', 'Nhơn Bình'),
('Quy Nhơn', 'TP Quy Nhơn', 'Nhơn Phú'),
('Quy Nhơn', 'TP Quy Nhơn', 'Ghềnh Ráng'),
('Quy Nhơn', 'TP Quy Nhơn', 'Hải Cảng');

-- =========================
-- PROPERTY FEATURES
-- =========================
INSERT INTO property_features (name) VALUES
('Gần biển'),
('Có sổ đỏ'),
('Full nội thất'),
('Hẻm ô tô'),
('View biển'),
('Gần trường học'),
('Gần chợ');

-- =========================
-- PROPERTIES
-- =========================
INSERT INTO properties
(title, slug, price, area, bedrooms, bathrooms, direction, status, description, is_featured, category_id, location_id)
VALUES
(
 'Căn hộ view biển Quy Nhơn',
 'can-ho-view-bien-quy-nhon',
 2500000000,
 75,
 2,
 2,
 'Đông',
 'ban',
 'Căn hộ cao cấp view biển, đầy đủ nội thất, pháp lý rõ ràng.',
 1,
 1,
 3
),
(
 'Nhà phố trung tâm TP Quy Nhơn',
 'nha-pho-trung-tam-quy-nhon',
 4200000000,
 90,
 3,
 3,
 'Nam',
 'ban',
 'Nhà phố trung tâm, gần chợ, trường học, tiện kinh doanh.',
 1,
 2,
 2
),
(
 'Đất nền Nhơn Phú giá rẻ',
 'dat-nen-nhon-phu-gia-re',
 1200000000,
 100,
 NULL,
 NULL,
 'Tây',
 'ban',
 'Đất nền khu dân cư, sổ đỏ riêng, xây dựng tự do.',
 0,
 3,
 2
),
(
 'Căn hộ cho thuê gần biển',
 'can-ho-cho-thue-gan-bien',
 8000000,
 60,
 1,
 1,
 'Đông Bắc',
 'cho-thue',
 'Căn hộ cho thuê dài hạn, gần biển, full nội thất.',
 0,
 1,
 3
);

-- =========================
-- PROPERTY IMAGES
-- =========================
INSERT INTO property_images (property_id, image_url, is_main) VALUES
(1, '/uploads/properties/p1_main.jpg', 1),
(1, '/uploads/properties/p1_2.jpg', 0),
(1, '/uploads/properties/p1_3.jpg', 0),

(2, '/uploads/properties/p2_main.jpg', 1),
(2, '/uploads/properties/p2_2.jpg', 0),

(3, '/uploads/properties/p3_main.jpg', 1),

(4, '/uploads/properties/p4_main.jpg', 1),
(4, '/uploads/properties/p4_2.jpg', 0);

-- =========================
-- PROPERTY FEATURE MAP
-- =========================
INSERT INTO property_feature_map (property_id, feature_id) VALUES
(1, 1), -- gần biển
(1, 3), -- full nội thất
(1, 5), -- view biển

(2, 2), -- sổ đỏ
(2, 4), -- hẻm ô tô
(2, 6), -- gần trường

(3, 2), -- sổ đỏ
(3, 7), -- gần chợ

(4, 1), -- gần biển
(4, 3); -- full nội thất

-- =========================
-- NEWS
-- =========================
INSERT INTO news (title, slug, content, image) VALUES
(
 'Thị trường bất động sản Quy Nhơn 2025',
 'thi-truong-bat-dong-san-quy-nhon-2025',
 'Thị trường bất động sản Quy Nhơn đang có nhiều tín hiệu tích cực...',
 '/uploads/news/news1.jpg'
),
(
 'Đầu tư căn hộ ven biển có còn hấp dẫn?',
 'dau-tu-can-ho-ven-bien',
 'Căn hộ ven biển vẫn là phân khúc được quan tâm...',
 '/uploads/news/news2.jpg'
);

-- =========================
-- CONTACTS
-- =========================
INSERT INTO contacts (name, phone, email, message, property_id) VALUES
(
 'Nguyễn Văn A',
 '0909123456',
 'vana@gmail.com',
 'Tôi muốn xem nhà vào cuối tuần.',
 2
),
(
 'Trần Thị B',
 '0911222333',
 'thib@gmail.com',
 'Căn hộ này còn cho thuê không?',
 4
);

-- =========================
-- SETTINGS
-- =========================
INSERT INTO settings (site_name, hotline, email, address, logo) VALUES
(
 'Quy Nhơn Homes',
 '0909 888 999',
 'info@quynhonhomes.vn',
 '123 Nguyễn Tất Thành, TP Quy Nhơn, Bình Định',
 '/uploads/logo.png'
);
