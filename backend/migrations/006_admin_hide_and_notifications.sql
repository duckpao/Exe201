-- Admin ẩn bài đăng kèm lý do bắt buộc + thông báo trên website cho người đăng.
-- Cột ẩn tách riêng khỏi `status` vì mỗi loại bài đăng có ENUM status khác nhau và chủ bài
-- tự đổi được status; nếu dùng chung, chủ bài có thể tự "bỏ ẩn" bài bị admin ẩn.

SET @add_hidden = (
  SELECT IF(COUNT(*) = 0,
    'ALTER TABLE room_listings ADD COLUMN admin_hidden_at DATETIME NULL, ADD COLUMN admin_hidden_reason VARCHAR(500) NULL',
    'SELECT 1')
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'room_listings' AND COLUMN_NAME = 'admin_hidden_at'
);
PREPARE stmt FROM @add_hidden; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @add_hidden = (
  SELECT IF(COUNT(*) = 0,
    'ALTER TABLE roommate_listings ADD COLUMN admin_hidden_at DATETIME NULL, ADD COLUMN admin_hidden_reason VARCHAR(500) NULL',
    'SELECT 1')
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'roommate_listings' AND COLUMN_NAME = 'admin_hidden_at'
);
PREPARE stmt FROM @add_hidden; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @add_hidden = (
  SELECT IF(COUNT(*) = 0,
    'ALTER TABLE room_pass_listings ADD COLUMN admin_hidden_at DATETIME NULL, ADD COLUMN admin_hidden_reason VARCHAR(500) NULL',
    'SELECT 1')
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'room_pass_listings' AND COLUMN_NAME = 'admin_hidden_at'
);
PREPARE stmt FROM @add_hidden; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @add_hidden = (
  SELECT IF(COUNT(*) = 0,
    'ALTER TABLE item_listings ADD COLUMN admin_hidden_at DATETIME NULL, ADD COLUMN admin_hidden_reason VARCHAR(500) NULL',
    'SELECT 1')
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'item_listings' AND COLUMN_NAME = 'admin_hidden_at'
);
PREPARE stmt FROM @add_hidden; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @add_hidden = (
  SELECT IF(COUNT(*) = 0,
    'ALTER TABLE vehicles ADD COLUMN admin_hidden_at DATETIME NULL, ADD COLUMN admin_hidden_reason VARCHAR(500) NULL',
    'SELECT 1')
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'vehicles' AND COLUMN_NAME = 'admin_hidden_at'
);
PREPARE stmt FROM @add_hidden; EXECUTE stmt; DEALLOCATE PREPARE stmt;

CREATE TABLE IF NOT EXISTS notifications (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id      BIGINT UNSIGNED NOT NULL,
  type         VARCHAR(50)  NOT NULL,
  title        VARCHAR(200) NOT NULL,
  body         TEXT NULL,
  listing_type ENUM('room','roommate','pass_room','item','vehicle') NULL,
  listing_id   BIGINT UNSIGNED NULL,
  is_read      TINYINT(1) NOT NULL DEFAULT 0,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  KEY idx_notifications_user (user_id, is_read, created_at),
  CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
