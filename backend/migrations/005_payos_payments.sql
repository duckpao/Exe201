-- Chuyển payment provider từ VNPay sang payOS nhưng vẫn giữ được dữ liệu VNPay cũ.
ALTER TABLE listing_payments
  MODIFY provider ENUM('vnpay','payos') NOT NULL DEFAULT 'payos';

SET @add_provider_order_code = (
  SELECT IF(COUNT(*) = 0,
    'ALTER TABLE listing_payments ADD COLUMN provider_order_code BIGINT NULL AFTER provider',
    'SELECT 1')
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'listing_payments' AND COLUMN_NAME = 'provider_order_code'
);
PREPARE stmt FROM @add_provider_order_code;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @add_payment_link_id = (
  SELECT IF(COUNT(*) = 0,
    'ALTER TABLE listing_payments ADD COLUMN payment_link_id VARCHAR(100) NULL AFTER provider_order_code',
    'SELECT 1')
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'listing_payments' AND COLUMN_NAME = 'payment_link_id'
);
PREPARE stmt FROM @add_payment_link_id;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @add_order_code_index = (
  SELECT IF(COUNT(*) = 0,
    'ALTER TABLE listing_payments ADD UNIQUE KEY uq_listing_payment_order_code (provider_order_code)',
    'SELECT 1')
  FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'listing_payments' AND INDEX_NAME = 'uq_listing_payment_order_code'
);
PREPARE stmt FROM @add_order_code_index;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;