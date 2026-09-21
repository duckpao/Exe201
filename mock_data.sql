-- =========================================================
-- Mock data cho database `nhatro` — chỉ dùng để test
-- Chạy sau database.sql: mysql -u root -p nhatro < mock_data.sql
-- Mật khẩu thật của mọi user mẫu (trước khi hash): "Password123!"
-- password_hash dưới đây là bcrypt hash thật (bcryptjs, cost 10) của "Password123!",
-- dùng để test đăng nhập bằng tài khoản ngay được.
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
-- addresses
-- ---------------------------------------------------------
INSERT INTO addresses (id, province, district, ward, street_address, latitude, longitude) VALUES
  (1, 'TP. Hồ Chí Minh', 'Quận 5',       'Phường 7',     '123 Đường Nguyễn Trãi',      10.7546, 106.6634),
  (2, 'TP. Hồ Chí Minh', 'Quận 3',       'Phường 1',     '45 Đường Lê Văn Sỹ',         10.7869, 106.6798),
  (3, 'Hà Nội',          'Cầu Giấy',     'Dịch Vọng',    '78 Đường Cầu Giấy',          21.0333, 105.7956),
  (4, 'TP. Hồ Chí Minh', 'Quận 1',       'Bến Nghé',     '12 Đường Trần Hưng Đạo',     10.7686, 106.6957),
  (5, 'TP. Hồ Chí Minh', 'Bình Thạnh',   'Phường 25',    '200 Đường Điện Biên Phủ',    10.8020, 106.7135),
  (6, 'Hà Nội',          'Đống Đa',      'Láng Thượng',  '56 Đường Láng',              21.0170, 105.8140);

-- ---------------------------------------------------------
-- room_listings (phòng trọ cho thuê)
-- ---------------------------------------------------------
INSERT INTO room_listings (id, landlord_id, address_id, title, description, price_per_month, deposit_amount, area_m2, max_occupants, amenities, status) VALUES
  (1, 2, 1, 'Phòng trọ full nội thất gần ĐH Kinh tế',
     'Phòng sạch sẽ, có máy lạnh, tủ lạnh, giờ giấc tự do.', 3000000, 3000000, 20.0, 2,
     JSON_ARRAY('wifi', 'may_lanh', 'tu_lanh', 'gio_giac_tu_do'), 'available'),
  (2, 2, 2, 'Phòng trọ mới xây, có thang máy',
     'Toà nhà mới xây 2025, an ninh 24/7, có thang máy.', 4500000, 4500000, 25.0, 2,
     JSON_ARRAY('wifi', 'thang_may', 'an_ninh_24_7', 'gac_xep'), 'available'),
  (3, 3, 3, 'Phòng trọ sinh viên giá rẻ Cầu Giấy',
     'Gần các trường đại học, phù hợp sinh viên.', 2200000, 2000000, 16.0, 2,
     JSON_ARRAY('wifi', 'gio_giac_tu_do'), 'rented'),
  (4, 2, 1, 'Phòng trọ ban công thoáng mát',
     'Có ban công riêng, view thoáng, gần chợ.', 3500000, 3500000, 22.0, 3,
     JSON_ARRAY('wifi', 'may_lanh', 'ban_cong'), 'hidden');

INSERT INTO room_images (id, room_listing_id, image_url, is_primary) VALUES
  (1, 1, 'https://picsum.photos/seed/room1a/800/600', 1),
  (2, 1, 'https://picsum.photos/seed/room1b/800/600', 0),
  (3, 2, 'https://picsum.photos/seed/room2a/800/600', 1),
  (4, 3, 'https://picsum.photos/seed/room3a/800/600', 1),
  (5, 4, 'https://picsum.photos/seed/room4a/800/600', 1);

-- ---------------------------------------------------------
-- room_pass_listings (pass trọ — sang nhượng hợp đồng còn hạn)
-- ---------------------------------------------------------
INSERT INTO room_pass_listings (id, room_listing_id, posted_by, address_id, title, description, monthly_price, compensation_fee, contract_end_date, reason, status) VALUES
  (1, 3, 4, 3, 'Pass phòng trọ Cầu Giấy giá tốt, còn hợp đồng 6 tháng',
     'Phòng đang thuê ổn, chuyển công tác nên cần pass gấp.', 2200000, 500000, '2026-12-31', 'Chuyển công tác vào TPHCM', 'active'),
  (2, NULL, 6, 6, 'Sang phòng trọ Láng, Đống Đa, dọn vào ở ngay',
     'Phòng đầy đủ nội thất cơ bản, chủ dễ tính.', 2800000, 300000, '2026-08-15', 'Về quê', 'active');

INSERT INTO room_pass_images (id, room_pass_listing_id, image_url, is_primary) VALUES
  (1, 1, 'https://picsum.photos/seed/pass1a/800/600', 1),
  (2, 2, 'https://picsum.photos/seed/pass2a/800/600', 1);

-- ---------------------------------------------------------
-- roommate_listings (tìm người ở ghép / tìm phòng ở ghép)
-- ---------------------------------------------------------
INSERT INTO roommate_listings (id, posted_by, address_id, title, description, room_type, budget_min, budget_max, move_in_date, gender_preference, amenities, status) VALUES
  (1, 4, 3, 'Có phòng trống, tìm nữ ở ghép Cầu Giấy',
     'Mình đang thuê phòng 2 người ở Cầu Giấy, còn 1 giường trống, tìm bạn nữ ở ghép, sạch sẽ, hoà đồng.',
     'has_room', 1100000, 1300000, '2026-10-01', 'female',
     JSON_ARRAY('wifi', 'gio_giac_tu_do', 'may_lanh'), 'active'),
  (2, 6, 6, 'Tìm phòng + người ở ghép khu Đống Đa',
     'Mình mới chuyển ra Hà Nội đi làm, muốn tìm phòng và ở ghép cùng 1-2 bạn, ngân sách vừa phải.',
     'looking_for_room', 1500000, 2500000, '2026-10-15', 'any',
     JSON_ARRAY('wifi', 'gio_giac_tu_do'), 'active'),
  (3, 5, 4, 'Ở ghép quận 1, cần bạn nam cùng chia phòng',
     'Phòng 2 người trung tâm quận 1, tiện đi làm, tìm bạn nam sạch sẽ, không hút thuốc trong phòng.',
     'has_room', 2000000, 2200000, NULL, 'male',
     JSON_ARRAY('wifi', 'thang_may', 'an_ninh_24_7'), 'closed');

INSERT INTO roommate_images (id, roommate_listing_id, image_url, is_primary) VALUES
  (1, 1, 'https://picsum.photos/seed/roommate1a/800/600', 1),
  (2, 2, 'https://picsum.photos/seed/roommate2a/800/600', 1),
  (3, 3, 'https://picsum.photos/seed/roommate3a/800/600', 1);

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
INSERT INTO vehicles (id, owner_id, vehicle_type, name, license_plate, capacity_kg, price_per_hour, price_per_trip, description, status) VALUES
  (1, 3, 'van',       'Ford Transit chở đồ',        '51C-123.45',  1000.00, 200000, 500000, 'Xe van rộng, phù hợp chuyển nhà phòng trọ, có tài xế hỗ trợ khuân đồ.', 'available'),
  (2, 3, 'truck',      'Xe tải 1.5 tấn',             '29C-678.90',  1500.00, 300000, 800000, 'Xe tải thùng kín, chở được đồ đạc cỡ lớn.', 'busy'),
  (3, 2, 'motorbike',  'Xe máy chở hàng Honda Wave', '59P1-111.22',  100.00,  80000, 150000, 'Phù hợp chở đồ nhỏ, thùng loa, valy sinh viên.', 'available');

INSERT INTO vehicle_images (id, vehicle_id, image_url, is_primary) VALUES
  (1, 1, 'https://picsum.photos/seed/vehicle1a/800/600', 1),
  (2, 2, 'https://picsum.photos/seed/vehicle2a/800/600', 1),
  (3, 3, 'https://picsum.photos/seed/vehicle3a/800/600', 1);

-- ---------------------------------------------------------
-- vehicle_bookings
-- ---------------------------------------------------------
INSERT INTO vehicle_bookings (id, vehicle_id, renter_id, pickup_address_id, dropoff_address_id, scheduled_at, estimated_hours, total_price, status, note) VALUES
  (1, 1, 4, 4, 5, '2026-09-25 08:00:00', 3.0, 600000, 'confirmed',   'Cần 2 người khuân đồ, có tủ lạnh và giường.'),
  (2, 3, 6, 6, 2, '2026-09-22 14:00:00', 1.5, 120000, 'completed',   'Chỉ chở valy và thùng đồ nhỏ.'),
  (3, 2, 5, 1, 3, '2026-09-30 09:00:00', NULL, NULL,   'pending',    'Chưa rõ số lượng đồ, cần xe tài xế liên hệ trước.');

-- ---------------------------------------------------------
-- reviews
-- ---------------------------------------------------------
INSERT INTO reviews (id, user_id, target_type, target_id, rating, comment) VALUES
  (1, 4, 'room_listing', 1, 5, 'Phòng đẹp như hình, chủ nhà thân thiện, hỗ trợ nhiệt tình.'),
  (2, 6, 'vehicle',      3, 4, 'Vận chuyển nhanh, tài xế nhiệt tình, giá hợp lý.'),
  (3, 5, 'landlord',     2, 5, 'Chủ nhà uy tín, sửa chữa đồ hư nhanh chóng.');

-- ---------------------------------------------------------
-- favorites
-- ---------------------------------------------------------
INSERT INTO favorites (id, user_id, target_type, target_id) VALUES
  (1, 4, 'room_listing',      2),
  (2, 5, 'room_pass_listing', 1),
  (3, 6, 'vehicle',           1),
  (4, 6, 'roommate_listing',  1);

SET FOREIGN_KEY_CHECKS = 1;
