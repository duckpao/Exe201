-- Gói đăng ký của người đăng bài, tách thanh toán gói khỏi phí từng lượt đăng, và đếm lượt xem.

SET @add_purpose = (
  SELECT IF(COUNT(*) = 0,
    'ALTER TABLE listing_payments ADD COLUMN purpose ENUM(''posting_credit'',''subscription'') NOT NULL DEFAULT ''posting_credit'', ADD COLUMN plan_code VARCHAR(30) NULL',
    'SELECT 1')
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'listing_payments' AND COLUMN_NAME = 'purpose'
);
PREPARE stmt FROM @add_purpose; EXECUTE stmt; DEALLOCATE PREPARE stmt;

CREATE TABLE IF NOT EXISTS user_subscriptions (
  id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id          BIGINT UNSIGNED NOT NULL,
  tier             ENUM('basic','pro') NOT NULL,
  cycle            ENUM('monthly','yearly') NOT NULL,
  starts_at        DATETIME NOT NULL,
  expires_at       DATETIME NOT NULL,
  source           ENUM('payment','admin') NOT NULL,
  payment_id       BIGINT UNSIGNED NULL,
  granted_by       BIGINT UNSIGNED NULL,
  revoked_at       DATETIME NULL,
  reminder_sent_at DATETIME NULL,
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_subscription_payment (payment_id),
  KEY idx_subscription_user (user_id, expires_at),
  CONSTRAINT fk_subscription_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- viewer_key là SHA-256 của người xem (tài khoản hoặc IP), không lưu IP thô.
CREATE TABLE IF NOT EXISTS listing_view_daily (
  listing_type ENUM('room','roommate','pass_room','item','vehicle') NOT NULL,
  listing_id   BIGINT UNSIGNED NOT NULL,
  view_date    DATE NOT NULL,
  viewer_key   CHAR(64) NOT NULL,
  PRIMARY KEY (listing_type, listing_id, view_date, viewer_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
