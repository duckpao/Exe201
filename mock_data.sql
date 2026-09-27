-- =========================================================
-- Mock data cho database `nhatro` — chỉ dùng để test
-- Chạy sau database.sql: mysql -u root -p nhatro < mock_data.sql
-- Mật khẩu thật của mọi user mẫu (trước khi hash): "Password123!"
-- password_hash dưới đây là bcrypt hash thật (bcryptjs, cost 10) của "Password123!",
-- dùng để test đăng nhập bằng tài khoản ngay được.
-- Khu vực dùng chung: Tân Xã / Thạch Hòa / Thạch Thất (Hòa Lạc, Hà Nội) — khớp theme frontend.
-- =========================================================

USE `nhatro`;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------
-- users
-- ---------------------------------------------------------
INSERT INTO users (id, full_name, email, phone, password_hash, avatar_url, role, status) VALUES
  (1, 'Nguyễn Văn Admin', 'admin@nhatro.vn',      '0900000001', '$2b$10$Nv9u0ypJ7rjM4pA3j2rERuPKAFQz6UlNHbJ.eYO0UNujSfpuyFtom', NULL, 'admin',    'active'),
  (2, 'Trần Thị Lan',     'lan.tran@nhatro.vn',   '0900000002', '$2b$10$Nv9u0ypJ7rjM4pA3j2rERuPKAFQz6UlNHbJ.eYO0UNujSfpuyFtom', NULL, 'landlord', 'active'),
  (3, 'Phạm Văn Hùng',    'hung.pham@nhatro.vn',  '0900000003', '$2b$10$Nv9u0ypJ7rjM4pA3j2rERuPKAFQz6UlNHbJ.eYO0UNujSfpuyFtom', NULL, 'landlord', 'active'),
  (4, 'Lê Thị Mai',       'mai.le@gmail.com',     '0900000004', '$2b$10$Nv9u0ypJ7rjM4pA3j2rERuPKAFQz6UlNHbJ.eYO0UNujSfpuyFtom', NULL, 'tenant',   'active'),
  (5, 'Hoàng Văn Nam',    'nam.hoang@gmail.com',  '0900000005', NULL,                                                            NULL, 'tenant',   'active'),
  (6, 'Đỗ Thị Hoa',       'hoa.do@gmail.com',     '0900000006', '$2b$10$Nv9u0ypJ7rjM4pA3j2rERuPKAFQz6UlNHbJ.eYO0UNujSfpuyFtom', NULL, 'tenant',   'locked');

-- Nam (id 5) chỉ đăng nhập bằng Google
INSERT INTO user_oauth_accounts (id, user_id, provider, provider_uid, provider_email) VALUES
  (1, 5, 'google', 'google-oauth2|1084729384756', 'nam.hoang@gmail.com');

-- ---------------------------------------------------------
-- addresses (chỉ khu vực cấp xã, khớp form đăng bài — Tân Xã / Thạch Hòa / Thạch Thất)
-- ---------------------------------------------------------
INSERT INTO addresses (id, province, district, ward) VALUES
  (1, 'Hà Nội', 'Thạch Thất', 'Tân Xã'),
  (2, 'Hà Nội', 'Thạch Thất', 'Thạch Hòa'),
  (3, 'Hà Nội', 'Thạch Thất', 'Thạch Thất');

-- ---------------------------------------------------------
-- room_listings (phòng trọ cho thuê)
-- ---------------------------------------------------------
INSERT INTO room_listings (id, landlord_id, address_id, title, description, property_type, price_per_month, deposit_amount, area_m2, max_occupants, amenities, status) VALUES
  (1, 2, 1, 'Phòng trọ full nội thất gần khu dịch vụ Tân Xã',
     'Phòng sạch sẽ, có máy lạnh, tủ lạnh, giờ giấc tự do.', 'phong_tro', 1800000, 1800000, 25.0, 2,
     JSON_ARRAY('Full nội thất', 'Có điều hòa'), 'available'),
  (2, 2, 2, 'Phòng trọ mới xây, an ninh 24/7',
     'Toà nhà mới xây 2025, an ninh 24/7, có thang máy.', 'chung_cu_mini', 2300000, 2300000, 28.0, 2,
     JSON_ARRAY('Có gác lửng', 'Full nội thất'), 'available'),
  (3, 3, 3, 'Phòng trọ giá rẻ cho sinh viên',
     'Gần các trường đại học, phù hợp sinh viên.', 'phong_tro', 1500000, 1500000, 18.0, 2,
     JSON_ARRAY('Full nội thất'), 'rented'),
  (4, 2, 1, 'Phòng trọ ban công thoáng mát',
     'Có ban công riêng, view thoáng, gần chợ.', 'nha_nguyen_can', 2100000, 2100000, 24.0, 3,
     JSON_ARRAY('Có ban công', 'Có điều hòa'), 'hidden');

INSERT INTO room_images (id, room_listing_id, media_url, media_type, is_primary) VALUES
  (1, 1, 'https://picsum.photos/seed/room1a/800/600', 'image', 1),
  (2, 1, 'https://picsum.photos/seed/room1b/800/600', 'image', 0),
  (3, 2, 'https://picsum.photos/seed/room2a/800/600', 'image', 1),
  (4, 3, 'https://picsum.photos/seed/room3a/800/600', 'image', 1),
  (5, 4, 'https://picsum.photos/seed/room4a/800/600', 'image', 1);

-- ---------------------------------------------------------
-- room_pass_listings (pass trọ — sang nhượng / chuyển nhượng hợp đồng còn hạn)
-- ---------------------------------------------------------
INSERT INTO room_pass_listings (id, room_listing_id, posted_by, address_id, title, description, pass_type, property_type, area_m2, max_occupants, amenities, monthly_price, compensation_fee, contract_end_date, reason, status) VALUES
  (1, 3, 4, 3, 'Pass phòng trọ giá sinh viên, còn hợp đồng 6 tháng',
     'Phòng đang thuê ổn, chuyển công tác nên cần pass lại.', 'pass', 'phong_tro', 18.0, 2,
     JSON_ARRAY('Full nội thất'), 1500000, 300000, '2026-12-31', 'Chuyển công tác vào TPHCM', 'active'),
  (2, NULL, 6, 2, 'Pass gấp phòng trọ gần trường, giá tốt',
     'Phòng đầy đủ nội thất cơ bản, chủ dễ tính, cần pass gấp do có việc đột xuất.', 'pass', 'phong_tro', 20.0, 2,
     JSON_ARRAY('Full nội thất'), 1600000, 200000, '2026-10-15', 'Về quê', 'urgent'),
  (3, NULL, 5, 1, 'Sang nhượng hợp đồng chung cư mini Tân Xã',
     'Còn thời hạn hợp đồng, chuyển đi vì lý do cá nhân.', 'transfer', 'chung_cu_mini', 26.0, 2,
     JSON_ARRAY('Có điều hòa'), 2300000, NULL, '2026-11-01', NULL, 'active');

INSERT INTO room_pass_images (id, room_pass_listing_id, media_url, media_type, is_primary) VALUES
  (1, 1, 'https://picsum.photos/seed/pass1a/800/600', 'image', 1),
  (2, 2, 'https://picsum.photos/seed/pass2a/800/600', 'image', 1),
  (3, 3, 'https://picsum.photos/seed/pass3a/800/600', 'image', 1);

-- ---------------------------------------------------------
-- roommate_listings (tìm người ở ghép / tìm phòng ở ghép)
-- ---------------------------------------------------------
INSERT INTO roommate_listings (id, posted_by, address_id, title, description, place_info, age, room_type, property_type, area_m2, budget_min, budget_max, move_in_date, gender_preference, amenities, publish_at, status) VALUES
  (1, 4, 3, 'Có phòng trống, tìm nữ ở ghép Thạch Thất',
     'Mình đang thuê phòng 2 người, còn 1 giường trống, tìm bạn nữ ở ghép, sạch sẽ, hoà đồng.',
     'Phòng full nội thất, có điều hòa, giờ giấc tự do.', 20,
     'has_room', 'phong_tro', 18.0, 1100000, 1300000, '2026-10-01', 'female',
     JSON_ARRAY('Full nội thất', 'Có điều hòa'), NULL, 'active'),
  (2, 6, 2, 'Tìm phòng + người ở ghép khu Thạch Hòa',
     'Mình mới chuyển ra Hòa Lạc đi làm, muốn tìm phòng và ở ghép cùng 1-2 bạn, ngân sách vừa phải.',
     NULL, 21,
     'looking_for_room', 'phong_tro', NULL, 1000000, 1200000, '2026-10-15', 'any',
     JSON_ARRAY('Giờ giấc tự do'), NULL, 'active'),
  (3, 5, 1, 'Ở ghép Tân Xã, cần bạn nam cùng chia phòng',
     'Phòng 2 người, tiện đi làm, tìm bạn nam sạch sẽ, không hút thuốc trong phòng.',
     'Phòng có gác lửng, an ninh tốt.', 22,
     'has_room', 'chung_cu_mini', 26.0, 1200000, 1400000, NULL, 'male',
     JSON_ARRAY('Có gác lửng'), NULL, 'closed');

INSERT INTO roommate_images (id, roommate_listing_id, media_url, media_type, is_primary) VALUES
  (1, 1, 'https://picsum.photos/seed/roommate1a/800/600', 'image', 1),
  (2, 2, 'https://picsum.photos/seed/roommate2a/800/600', 'image', 1),
  (3, 3, 'https://picsum.photos/seed/roommate3a/800/600', 'image', 1);

-- ---------------------------------------------------------
-- item_listings (Pass Đồ — rao bán đồ cũ)
-- ---------------------------------------------------------
INSERT INTO item_listings (id, posted_by, address_id, title, description, category, item_condition, price, status) VALUES
  (1, 4, 1, 'Bàn học gỗ + ghế xoay, còn mới 90%', 'Bàn học gỗ chắc chắn kèm ghế xoay, còn mới, ít trầy xước.', 'Nội thất', 'Mới 90%', 350000, 'available'),
  (2, 6, 2, 'Quạt điện Panasonic 3 tốc độ', 'Quạt chạy êm, đủ 3 tốc độ, cần bán gấp do chuyển đi.', 'Đồ điện tử', 'Đã dùng', 180000, 'urgent'),
  (3, 5, 1, 'Tủ nhựa 5 tầng đựng quần áo', 'Tủ nhựa 5 tầng, còn chắc chắn, phù hợp phòng trọ nhỏ.', 'Nội thất', 'Đã dùng', 150000, 'available'),
  (4, 4, 3, 'Nồi cơm điện Sharp 1.8L', 'Nồi cơm điện dung tích 1.8L, còn mới 95%, cần bán gấp.', 'Đồ gia dụng', 'Mới 95%', 250000, 'urgent'),
  (5, 6, 1, 'Xe đạp cào cào cho sinh viên', 'Xe đạp còn chạy tốt, phù hợp di chuyển gần trong khu vực.', 'Xe cộ', 'Đã dùng', 600000, 'available'),
  (6, 5, 2, 'Bộ giáo trình Đại học Kinh tế năm 2', 'Đầy đủ giáo trình năm 2, còn sạch, không ghi chú nhiều.', 'Sách - Giáo trình', 'Đã dùng', 120000, 'available');

INSERT INTO item_images (id, item_listing_id, media_url, media_type, is_primary) VALUES
  (1, 1, 'https://picsum.photos/seed/item1a/800/600', 'image', 1),
  (2, 2, 'https://picsum.photos/seed/item2a/800/600', 'image', 1),
  (3, 3, 'https://picsum.photos/seed/item3a/800/600', 'image', 1),
  (4, 4, 'https://picsum.photos/seed/item4a/800/600', 'image', 1),
  (5, 5, 'https://picsum.photos/seed/item5a/800/600', 'image', 1),
  (6, 6, 'https://picsum.photos/seed/item6a/800/600', 'image', 1);

-- ---------------------------------------------------------
-- room_inquiries (liên hệ hỏi thuê / hỏi pass / hỏi ở ghép)
-- ---------------------------------------------------------
INSERT INTO room_inquiries (id, listing_type, listing_id, user_id, message, contact_phone, status) VALUES
  (1, 'room', 1, 5, 'Phòng còn không ạ? Cho em xem thêm hình được không?', '0911111111', 'new'),
  (2, 'pass', 1, 6, 'Cho em hỏi phí đền bù có thương lượng được không ạ?', '0922222222', 'contacted'),
  (3, 'room', 3, 4, 'Phòng này còn trống chưa ạ?', '0933333333', 'closed'),
  (4, 'roommate', 1, 6, 'Mình quan tâm, cho mình xin thêm thông tin phòng nhé.', '0900000006', 'new');

-- ---------------------------------------------------------
-- vehicles (xe cho thuê vận chuyển đồ đạc)
-- ---------------------------------------------------------
INSERT INTO vehicles (id, owner_id, vehicle_type, service_type, name, license_plate, capacity_kg, price_per_hour, price_per_trip, description, tags, status) VALUES
  (1, 3, 'van',       'Chuyển nhà trọn gói', 'Ford Transit chở đồ',        '51C-123.45', 1000.00, 200000, 500000, 'Xe van rộng, phù hợp chuyển nhà phòng trọ, có tài xế hỗ trợ khuân đồ.', JSON_ARRAY('Trọn gói', 'Có bảo hiểm'), 'available'),
  (2, 3, 'truck',     'Xe tải nhỏ',          'Xe tải 1.5 tấn',             '29C-678.90', 1500.00, 300000, 800000, 'Xe tải thùng kín, chở được đồ đạc cỡ lớn.', JSON_ARRAY('Đường dài', 'Có bốc xếp'), 'busy'),
  (3, 2, 'motorbike', 'Xe máy kéo',          'Xe máy chở hàng Honda Wave', '59P1-111.22', 100.00,  80000, 150000, 'Phù hợp chở đồ nhỏ, thùng loa, valy sinh viên.', JSON_ARRAY('Giá rẻ', 'Nhanh chóng'), 'available');

INSERT INTO vehicle_images (id, vehicle_id, media_url, media_type, is_primary) VALUES
  (1, 1, 'https://picsum.photos/seed/vehicle1a/800/600', 'image', 1),
  (2, 2, 'https://picsum.photos/seed/vehicle2a/800/600', 'image', 1),
  (3, 3, 'https://picsum.photos/seed/vehicle3a/800/600', 'image', 1);

-- ---------------------------------------------------------
-- vehicle_bookings
-- ---------------------------------------------------------
INSERT INTO vehicle_bookings (id, vehicle_id, renter_id, pickup_address_id, dropoff_address_id, scheduled_at, estimated_hours, total_price, status, note) VALUES
  (1, 1, 4, 1, 2, '2026-09-25 08:00:00', 3.0, 600000, 'confirmed', 'Cần 2 người khuân đồ, có tủ lạnh và giường.'),
  (2, 3, 6, 2, 3, '2026-09-22 14:00:00', 1.5, 120000, 'completed', 'Chỉ chở valy và thùng đồ nhỏ.'),
  (3, 2, 5, 3, 1, '2026-09-30 09:00:00', NULL, NULL,   'pending',   'Chưa rõ số lượng đồ, cần tài xế liên hệ trước.');

-- ---------------------------------------------------------
-- reviews
-- ---------------------------------------------------------
INSERT INTO reviews (id, user_id, target_type, target_id, rating, comment) VALUES
  (1, 4, 'room_listing', 1, 5, 'Phòng đẹp như hình, chủ nhà thân thiện, hỗ trợ nhiệt tình.'),
  (2, 6, 'vehicle',      3, 4, 'Vận chuyển nhanh, tài xế nhiệt tình, giá hợp lý.'),
  (3, 5, 'landlord',     2, 5, 'Chủ nhà uy tín, sửa chữa đồ hư nhanh chóng.'),
  (4, 4, 'landlord',     3, 4, 'Chủ nhà dễ tính, phản hồi nhanh.'),
  (5, 6, 'vehicle',      1, 5, 'Xe rộng, tài xế hỗ trợ khuân đồ tận tình.');

-- ---------------------------------------------------------
-- favorites
-- ---------------------------------------------------------
INSERT INTO favorites (id, user_id, target_type, target_id) VALUES
  (1, 4, 'room_listing',      2),
  (2, 5, 'room_pass_listing', 1),
  (3, 6, 'vehicle',           1),
  (4, 6, 'roommate_listing',  1);

SET FOREIGN_KEY_CHECKS = 1;
