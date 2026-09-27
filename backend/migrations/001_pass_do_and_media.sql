-- =========================================================
-- Migration 001: Pass Đồ (item_listings/item_images) + media (ảnh/video) + các cột filter/form còn thiếu
-- Chạy trên DB `nhatro` đang có dữ liệu (không mất dữ liệu hiện tại):
--   mysql -h 127.0.0.1 -P 3308 -u nhatro_user -p nhatro < backend/migrations/001_pass_do_and_media.sql
-- =========================================================

USE `nhatro`;

SET NAMES utf8mb4;

-- ---------------------------------------------------------
-- addresses: form đăng bài chỉ thu thập khu vực cấp xã, không có số nhà
-- ---------------------------------------------------------
ALTER TABLE addresses
  MODIFY street_address VARCHAR(255) NULL;

-- ---------------------------------------------------------
-- room_listings
-- ---------------------------------------------------------
ALTER TABLE room_listings
  ADD COLUMN property_type ENUM('phong_tro','chung_cu_mini','nha_nguyen_can') NOT NULL DEFAULT 'phong_tro' AFTER description;

-- room_images: đổi tên image_url -> media_url, thêm media_type để hỗ trợ video
ALTER TABLE room_images
  CHANGE COLUMN image_url media_url VARCHAR(255) NOT NULL,
  ADD COLUMN media_type ENUM('image','video') NOT NULL DEFAULT 'image' AFTER media_url;

-- ---------------------------------------------------------
-- room_pass_listings
-- ---------------------------------------------------------
ALTER TABLE room_pass_listings
  ADD COLUMN pass_type ENUM('pass','transfer') NOT NULL DEFAULT 'pass' AFTER description,
  ADD COLUMN property_type ENUM('phong_tro','chung_cu_mini','nha_nguyen_can') NULL AFTER pass_type,
  ADD COLUMN area_m2 DECIMAL(6,2) NULL AFTER property_type,
  ADD COLUMN max_occupants SMALLINT UNSIGNED NULL AFTER area_m2,
  ADD COLUMN amenities JSON NULL AFTER max_occupants,
  MODIFY COLUMN contract_end_date DATE NULL,
  MODIFY COLUMN status ENUM('pending','active','urgent','completed','cancelled') NOT NULL DEFAULT 'pending';

ALTER TABLE room_pass_images
  CHANGE COLUMN image_url media_url VARCHAR(255) NOT NULL,
  ADD COLUMN media_type ENUM('image','video') NOT NULL DEFAULT 'image' AFTER media_url;

-- ---------------------------------------------------------
-- roommate_listings
-- ---------------------------------------------------------
ALTER TABLE roommate_listings
  MODIFY COLUMN description TEXT NULL,
  ADD COLUMN place_info TEXT NULL AFTER description,
  ADD COLUMN age SMALLINT UNSIGNED NULL AFTER place_info,
  ADD COLUMN property_type ENUM('phong_tro','chung_cu_mini','nha_nguyen_can') NULL AFTER room_type,
  ADD COLUMN area_m2 DECIMAL(6,2) NULL AFTER property_type,
  ADD COLUMN publish_at DATETIME NULL AFTER amenities;

ALTER TABLE roommate_images
  CHANGE COLUMN image_url media_url VARCHAR(255) NOT NULL,
  ADD COLUMN media_type ENUM('image','video') NOT NULL DEFAULT 'image' AFTER media_url;

-- ---------------------------------------------------------
-- vehicles
-- ---------------------------------------------------------
ALTER TABLE vehicles
  ADD COLUMN service_type VARCHAR(50) NULL AFTER vehicle_type,
  ADD COLUMN tags JSON NULL AFTER description;

ALTER TABLE vehicle_images
  CHANGE COLUMN image_url media_url VARCHAR(255) NOT NULL,
  ADD COLUMN media_type ENUM('image','video') NOT NULL DEFAULT 'image' AFTER media_url;

-- ---------------------------------------------------------
-- Pass Đồ: bảng mới
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS item_listings (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  posted_by      BIGINT UNSIGNED NOT NULL,
  address_id     BIGINT UNSIGNED NOT NULL,
  title          VARCHAR(200) NOT NULL,
  description    TEXT NULL,
  category       VARCHAR(50) NOT NULL,
  item_condition VARCHAR(50) NULL,
  price          DECIMAL(12,2) NOT NULL,
  status         ENUM('pending','available','urgent','sold') NOT NULL DEFAULT 'pending',
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at     TIMESTAMP NULL,
  KEY idx_item_posted_by (posted_by),
  KEY idx_item_address (address_id),
  KEY idx_item_status (status),
  CONSTRAINT fk_item_user FOREIGN KEY (posted_by) REFERENCES users(id),
  CONSTRAINT fk_item_address FOREIGN KEY (address_id) REFERENCES addresses(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS item_images (
  id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  item_listing_id  BIGINT UNSIGNED NOT NULL,
  media_url        VARCHAR(255) NOT NULL,
  media_type       ENUM('image','video') NOT NULL DEFAULT 'image',
  is_primary       TINYINT(1) NOT NULL DEFAULT 0,
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_item_images_listing (item_listing_id),
  CONSTRAINT fk_item_images_listing FOREIGN KEY (item_listing_id) REFERENCES item_listings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELIMITER $$

DROP TRIGGER IF EXISTS trg_item_listings_after_insert$$
CREATE TRIGGER trg_item_listings_after_insert AFTER INSERT ON item_listings FOR EACH ROW
BEGIN
  INSERT INTO audit_logs (table_name, record_id, action, changed_by, new_data)
  VALUES ('item_listings', NEW.id, 'INSERT', @app_user_id,
    JSON_OBJECT('title', NEW.title, 'price', NEW.price, 'status', NEW.status));
END$$

DROP TRIGGER IF EXISTS trg_item_listings_after_update$$
CREATE TRIGGER trg_item_listings_after_update AFTER UPDATE ON item_listings FOR EACH ROW
BEGIN
  INSERT INTO audit_logs (table_name, record_id, action, changed_by, old_data, new_data)
  VALUES ('item_listings', NEW.id, 'UPDATE', @app_user_id,
    JSON_OBJECT('title', OLD.title, 'price', OLD.price, 'status', OLD.status),
    JSON_OBJECT('title', NEW.title, 'price', NEW.price, 'status', NEW.status));
END$$

DROP TRIGGER IF EXISTS trg_item_listings_after_delete$$
CREATE TRIGGER trg_item_listings_after_delete AFTER DELETE ON item_listings FOR EACH ROW
BEGIN
  INSERT INTO audit_logs (table_name, record_id, action, changed_by, old_data)
  VALUES ('item_listings', OLD.id, 'DELETE', @app_user_id,
    JSON_OBJECT('title', OLD.title, 'price', OLD.price, 'status', OLD.status));
END$$

DELIMITER ;
