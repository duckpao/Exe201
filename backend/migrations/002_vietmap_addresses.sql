-- Bổ sung dữ liệu VietMap cho database đã tồn tại.
-- Không cần chạy file này nếu tạo database mới từ database.sql.
ALTER TABLE addresses
  ADD COLUMN formatted_address VARCHAR(500) NULL AFTER street_address,
  ADD COLUMN vietmap_ref_id VARCHAR(500) NULL AFTER formatted_address,
  ADD COLUMN location_source ENUM('manual','vietmap') NOT NULL DEFAULT 'manual' AFTER longitude,
  ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at,
  ADD KEY idx_addresses_coordinates (latitude, longitude),
  ADD KEY idx_addresses_vietmap_ref (vietmap_ref_id(191));

-- Bổ sung tọa độ gần trung tâm các khu vực mẫu để dữ liệu seed cũ có thể hiển thị bản đồ.
UPDATE addresses SET latitude = 21.0147000, longitude = 105.5265000, location_source = 'manual'
WHERE ward = 'Tân Xã' AND latitude IS NULL AND longitude IS NULL;
UPDATE addresses SET latitude = 21.0069000, longitude = 105.5412000, location_source = 'manual'
WHERE ward = 'Thạch Hòa' AND latitude IS NULL AND longitude IS NULL;
UPDATE addresses SET latitude = 21.0282000, longitude = 105.5815000, location_source = 'manual'
WHERE ward = 'Thạch Thất' AND latitude IS NULL AND longitude IS NULL;