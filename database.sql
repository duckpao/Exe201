-- =========================================================
-- Database: nhatro (website cho thuê phòng trọ / pass trọ / xe vận chuyển)
-- Engine: MySQL 8.0 / MariaDB 10.6+
-- =========================================================

CREATE DATABASE IF NOT EXISTS `nhatro`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `nhatro`;

SET NAMES utf8mb4;
SET time_zone = '+07:00';

-- ---------------------------------------------------------
-- Người dùng & xác thực (thường / Google)
-- ---------------------------------------------------------
CREATE TABLE users (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  full_name       VARCHAR(100)  NOT NULL,
  email           VARCHAR(150)  NOT NULL,
  phone           VARCHAR(20)   NULL,
  password_hash   VARCHAR(255)  NULL, -- NULL nếu tài khoản chỉ đăng nhập bằng Google
  avatar_url      VARCHAR(255)  NULL,
  role            ENUM('tenant','landlord','admin') NOT NULL DEFAULT 'tenant',
  status          ENUM('active','locked') NOT NULL DEFAULT 'active',
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at      TIMESTAMP NULL,
  UNIQUE KEY uq_users_email (email),
  UNIQUE KEY uq_users_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE user_oauth_accounts (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         BIGINT UNSIGNED NOT NULL,
  provider        ENUM('google') NOT NULL DEFAULT 'google',
  provider_uid    VARCHAR(255) NOT NULL, -- sub id trả về từ Google
  provider_email  VARCHAR(150) NULL,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_oauth_provider_uid (provider, provider_uid),
  KEY idx_oauth_user (user_id),
  CONSTRAINT fk_oauth_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- Địa chỉ (dùng chung cho phòng trọ, pass trọ, điểm đón/trả xe)
-- ---------------------------------------------------------
CREATE TABLE addresses (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  province       VARCHAR(100) NOT NULL,
  district       VARCHAR(100) NOT NULL,
  ward           VARCHAR(100) NULL,
  street_address VARCHAR(255) NOT NULL,
  latitude       DECIMAL(10,7) NULL,
  longitude      DECIMAL(10,7) NULL,
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- Phòng trọ cho thuê
-- ---------------------------------------------------------
CREATE TABLE room_listings (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  landlord_id     BIGINT UNSIGNED NOT NULL,
  address_id      BIGINT UNSIGNED NOT NULL,
  title           VARCHAR(200) NOT NULL,
  description     TEXT NULL,
  price_per_month DECIMAL(12,2) NOT NULL,
  deposit_amount  DECIMAL(12,2) NULL,
  area_m2         DECIMAL(6,2) NULL,
  max_occupants   SMALLINT UNSIGNED NULL,
  amenities       JSON NULL, -- ví dụ: ["wifi","gac_xep","gio_giac_tu_do"]
  status          ENUM('available','rented','hidden') NOT NULL DEFAULT 'available',
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at      TIMESTAMP NULL,
  KEY idx_room_landlord (landlord_id),
  KEY idx_room_address (address_id),
  KEY idx_room_status (status),
  CONSTRAINT fk_room_landlord FOREIGN KEY (landlord_id) REFERENCES users(id),
  CONSTRAINT fk_room_address FOREIGN KEY (address_id) REFERENCES addresses(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE room_images (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  room_listing_id BIGINT UNSIGNED NOT NULL,
  image_url       VARCHAR(255) NOT NULL,
  is_primary      TINYINT(1) NOT NULL DEFAULT 0,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_room_images_listing (room_listing_id),
  CONSTRAINT fk_room_images_listing FOREIGN KEY (room_listing_id) REFERENCES room_listings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- Pass trọ: người đang thuê sang nhượng lại hợp đồng còn hạn
-- ---------------------------------------------------------
CREATE TABLE room_pass_listings (
  id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  room_listing_id   BIGINT UNSIGNED NULL, -- liên kết phòng gốc nếu đã có trong hệ thống
  posted_by         BIGINT UNSIGNED NOT NULL, -- người thuê hiện tại, muốn pass lại
  address_id        BIGINT UNSIGNED NOT NULL,
  title             VARCHAR(200) NOT NULL,
  description       TEXT NULL,
  monthly_price     DECIMAL(12,2) NOT NULL,
  compensation_fee  DECIMAL(12,2) NULL, -- phí đền bù/hoàn cọc cho người pass
  contract_end_date DATE NOT NULL,
  reason            VARCHAR(255) NULL,
  status            ENUM('active','completed','cancelled') NOT NULL DEFAULT 'active',
  created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at        TIMESTAMP NULL,
  KEY idx_pass_posted_by (posted_by),
  KEY idx_pass_address (address_id),
  KEY idx_pass_status (status),
  CONSTRAINT fk_pass_room FOREIGN KEY (room_listing_id) REFERENCES room_listings(id) ON DELETE SET NULL,
  CONSTRAINT fk_pass_user FOREIGN KEY (posted_by) REFERENCES users(id),
  CONSTRAINT fk_pass_address FOREIGN KEY (address_id) REFERENCES addresses(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE room_pass_images (
  id                    BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  room_pass_listing_id  BIGINT UNSIGNED NOT NULL,
  image_url             VARCHAR(255) NOT NULL,
  is_primary            TINYINT(1) NOT NULL DEFAULT 0,
  created_at            TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_pass_images_listing (room_pass_listing_id),
  CONSTRAINT fk_pass_images_listing FOREIGN KEY (room_pass_listing_id) REFERENCES room_pass_listings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- Liên hệ / hỏi thuê (áp dụng cho cả phòng trọ và pass trọ)
-- ---------------------------------------------------------
CREATE TABLE room_inquiries (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  listing_type   ENUM('room','pass') NOT NULL,
  listing_id     BIGINT UNSIGNED NOT NULL, -- id trong room_listings hoặc room_pass_listings tùy listing_type
  user_id        BIGINT UNSIGNED NOT NULL,
  message        TEXT NULL,
  contact_phone  VARCHAR(20) NULL,
  status         ENUM('new','contacted','closed') NOT NULL DEFAULT 'new',
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_inquiry_listing (listing_type, listing_id),
  KEY idx_inquiry_user (user_id),
  CONSTRAINT fk_inquiry_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- Xe cho thuê vận chuyển đồ đạc
-- ---------------------------------------------------------
CREATE TABLE vehicles (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  owner_id       BIGINT UNSIGNED NOT NULL,
  vehicle_type   ENUM('motorbike','van','truck') NOT NULL,
  name           VARCHAR(150) NOT NULL,
  license_plate  VARCHAR(20) NOT NULL,
  capacity_kg    DECIMAL(8,2) NULL,
  price_per_hour DECIMAL(12,2) NULL,
  price_per_trip DECIMAL(12,2) NULL,
  description    TEXT NULL,
  status         ENUM('available','busy','hidden') NOT NULL DEFAULT 'available',
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at     TIMESTAMP NULL,
  UNIQUE KEY uq_vehicle_plate (license_plate),
  KEY idx_vehicle_owner (owner_id),
  KEY idx_vehicle_status (status),
  CONSTRAINT fk_vehicle_owner FOREIGN KEY (owner_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE vehicle_images (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  vehicle_id  BIGINT UNSIGNED NOT NULL,
  image_url   VARCHAR(255) NOT NULL,
  is_primary  TINYINT(1) NOT NULL DEFAULT 0,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_vehicle_images_vehicle (vehicle_id),
  CONSTRAINT fk_vehicle_images_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE vehicle_bookings (
  id                 BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  vehicle_id         BIGINT UNSIGNED NOT NULL,
  renter_id          BIGINT UNSIGNED NOT NULL,
  pickup_address_id  BIGINT UNSIGNED NOT NULL,
  dropoff_address_id BIGINT UNSIGNED NOT NULL,
  scheduled_at       DATETIME NOT NULL,
  estimated_hours    DECIMAL(5,2) NULL,
  total_price        DECIMAL(12,2) NULL,
  status             ENUM('pending','confirmed','in_progress','completed','cancelled') NOT NULL DEFAULT 'pending',
  note               TEXT NULL,
  created_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at         TIMESTAMP NULL,
  KEY idx_booking_vehicle (vehicle_id),
  KEY idx_booking_renter (renter_id),
  KEY idx_booking_status (status),
  CONSTRAINT fk_booking_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
  CONSTRAINT fk_booking_renter FOREIGN KEY (renter_id) REFERENCES users(id),
  CONSTRAINT fk_booking_pickup FOREIGN KEY (pickup_address_id) REFERENCES addresses(id),
  CONSTRAINT fk_booking_dropoff FOREIGN KEY (dropoff_address_id) REFERENCES addresses(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- Đánh giá & yêu thích
-- ---------------------------------------------------------
CREATE TABLE reviews (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     BIGINT UNSIGNED NOT NULL,
  target_type ENUM('room_listing','vehicle','landlord') NOT NULL,
  target_id   BIGINT UNSIGNED NOT NULL,
  rating      TINYINT UNSIGNED NOT NULL,
  comment     TEXT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at  TIMESTAMP NULL,
  KEY idx_review_target (target_type, target_id),
  KEY idx_review_user (user_id),
  CONSTRAINT fk_review_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT chk_review_rating CHECK (rating BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE favorites (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id     BIGINT UNSIGNED NOT NULL,
  target_type ENUM('room_listing','room_pass_listing','vehicle') NOT NULL,
  target_id   BIGINT UNSIGNED NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_favorite (user_id, target_type, target_id),
  CONSTRAINT fk_favorite_user FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------
-- Audit log: ghi lại lịch sử thay đổi trên các bảng nghiệp vụ chính
-- changed_by lấy từ session var @app_user_id do backend SET trước mỗi query
-- ---------------------------------------------------------
CREATE TABLE audit_logs (
  id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  table_name  VARCHAR(64) NOT NULL,
  record_id   BIGINT UNSIGNED NOT NULL,
  action      ENUM('INSERT','UPDATE','DELETE') NOT NULL,
  changed_by  BIGINT UNSIGNED NULL,
  old_data    JSON NULL,
  new_data    JSON NULL,
  changed_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_audit_table_record (table_name, record_id),
  KEY idx_audit_changed_at (changed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

DELIMITER $$

-- users
CREATE TRIGGER trg_users_after_insert AFTER INSERT ON users FOR EACH ROW
BEGIN
  INSERT INTO audit_logs (table_name, record_id, action, changed_by, new_data)
  VALUES ('users', NEW.id, 'INSERT', @app_user_id,
    JSON_OBJECT('full_name', NEW.full_name, 'email', NEW.email, 'role', NEW.role, 'status', NEW.status));
END$$

CREATE TRIGGER trg_users_after_update AFTER UPDATE ON users FOR EACH ROW
BEGIN
  INSERT INTO audit_logs (table_name, record_id, action, changed_by, old_data, new_data)
  VALUES ('users', NEW.id, 'UPDATE', @app_user_id,
    JSON_OBJECT('full_name', OLD.full_name, 'email', OLD.email, 'role', OLD.role, 'status', OLD.status),
    JSON_OBJECT('full_name', NEW.full_name, 'email', NEW.email, 'role', NEW.role, 'status', NEW.status));
END$$

CREATE TRIGGER trg_users_after_delete AFTER DELETE ON users FOR EACH ROW
BEGIN
  INSERT INTO audit_logs (table_name, record_id, action, changed_by, old_data)
  VALUES ('users', OLD.id, 'DELETE', @app_user_id,
    JSON_OBJECT('full_name', OLD.full_name, 'email', OLD.email, 'role', OLD.role, 'status', OLD.status));
END$$

-- room_listings
CREATE TRIGGER trg_room_listings_after_insert AFTER INSERT ON room_listings FOR EACH ROW
BEGIN
  INSERT INTO audit_logs (table_name, record_id, action, changed_by, new_data)
  VALUES ('room_listings', NEW.id, 'INSERT', @app_user_id,
    JSON_OBJECT('title', NEW.title, 'price_per_month', NEW.price_per_month, 'status', NEW.status));
END$$

CREATE TRIGGER trg_room_listings_after_update AFTER UPDATE ON room_listings FOR EACH ROW
BEGIN
  INSERT INTO audit_logs (table_name, record_id, action, changed_by, old_data, new_data)
  VALUES ('room_listings', NEW.id, 'UPDATE', @app_user_id,
    JSON_OBJECT('title', OLD.title, 'price_per_month', OLD.price_per_month, 'status', OLD.status),
    JSON_OBJECT('title', NEW.title, 'price_per_month', NEW.price_per_month, 'status', NEW.status));
END$$

CREATE TRIGGER trg_room_listings_after_delete AFTER DELETE ON room_listings FOR EACH ROW
BEGIN
  INSERT INTO audit_logs (table_name, record_id, action, changed_by, old_data)
  VALUES ('room_listings', OLD.id, 'DELETE', @app_user_id,
    JSON_OBJECT('title', OLD.title, 'price_per_month', OLD.price_per_month, 'status', OLD.status));
END$$

-- room_pass_listings
CREATE TRIGGER trg_room_pass_after_insert AFTER INSERT ON room_pass_listings FOR EACH ROW
BEGIN
  INSERT INTO audit_logs (table_name, record_id, action, changed_by, new_data)
  VALUES ('room_pass_listings', NEW.id, 'INSERT', @app_user_id,
    JSON_OBJECT('title', NEW.title, 'monthly_price', NEW.monthly_price, 'status', NEW.status));
END$$

CREATE TRIGGER trg_room_pass_after_update AFTER UPDATE ON room_pass_listings FOR EACH ROW
BEGIN
  INSERT INTO audit_logs (table_name, record_id, action, changed_by, old_data, new_data)
  VALUES ('room_pass_listings', NEW.id, 'UPDATE', @app_user_id,
    JSON_OBJECT('title', OLD.title, 'monthly_price', OLD.monthly_price, 'status', OLD.status),
    JSON_OBJECT('title', NEW.title, 'monthly_price', NEW.monthly_price, 'status', NEW.status));
END$$

CREATE TRIGGER trg_room_pass_after_delete AFTER DELETE ON room_pass_listings FOR EACH ROW
BEGIN
  INSERT INTO audit_logs (table_name, record_id, action, changed_by, old_data)
  VALUES ('room_pass_listings', OLD.id, 'DELETE', @app_user_id,
    JSON_OBJECT('title', OLD.title, 'monthly_price', OLD.monthly_price, 'status', OLD.status));
END$$

-- vehicle_bookings
CREATE TRIGGER trg_vehicle_bookings_after_insert AFTER INSERT ON vehicle_bookings FOR EACH ROW
BEGIN
  INSERT INTO audit_logs (table_name, record_id, action, changed_by, new_data)
  VALUES ('vehicle_bookings', NEW.id, 'INSERT', @app_user_id,
    JSON_OBJECT('vehicle_id', NEW.vehicle_id, 'renter_id', NEW.renter_id, 'status', NEW.status, 'total_price', NEW.total_price));
END$$

CREATE TRIGGER trg_vehicle_bookings_after_update AFTER UPDATE ON vehicle_bookings FOR EACH ROW
BEGIN
  INSERT INTO audit_logs (table_name, record_id, action, changed_by, old_data, new_data)
  VALUES ('vehicle_bookings', NEW.id, 'UPDATE', @app_user_id,
    JSON_OBJECT('status', OLD.status, 'total_price', OLD.total_price),
    JSON_OBJECT('status', NEW.status, 'total_price', NEW.total_price));
END$$

CREATE TRIGGER trg_vehicle_bookings_after_delete AFTER DELETE ON vehicle_bookings FOR EACH ROW
BEGIN
  INSERT INTO audit_logs (table_name, record_id, action, changed_by, old_data)
  VALUES ('vehicle_bookings', OLD.id, 'DELETE', @app_user_id,
    JSON_OBJECT('vehicle_id', OLD.vehicle_id, 'renter_id', OLD.renter_id, 'status', OLD.status, 'total_price', OLD.total_price));
END$$

DELIMITER ;
