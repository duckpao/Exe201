-- Đánh giá cho cả 5 loại bài đăng. Giữ nguyên 'room_listing' (phòng trọ) và 'vehicle' (xe)
-- đang được các truy vấn hiện tại dùng; chỉ thêm 3 loại còn thiếu.
ALTER TABLE reviews
  MODIFY target_type ENUM('room_listing','vehicle','landlord','roommate','pass_room','item') NOT NULL;

-- Mỗi người chỉ đánh giá một lần cho mỗi bài. Dòng này sẽ lỗi nếu đã có dữ liệu trùng.
SET @add_unique = (
  SELECT IF(COUNT(*) = 0,
    'ALTER TABLE reviews ADD UNIQUE KEY uq_review_user_target (user_id, target_type, target_id)',
    'SELECT 1')
  FROM information_schema.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'reviews' AND INDEX_NAME = 'uq_review_user_target'
);
PREPARE stmt FROM @add_unique; EXECUTE stmt; DEALLOCATE PREPARE stmt;
