-- Bài đăng tự duyệt: Pass phòng và Pass đồ hiện ngay khi đăng, admin kiểm duyệt sau bằng cách ẩn bài.
-- Item không có giá trị 'active' nên dùng 'available' (còn hàng).
UPDATE room_pass_listings SET status = 'active' WHERE status = 'pending';
UPDATE item_listings SET status = 'available' WHERE status = 'pending';

ALTER TABLE room_pass_listings
  MODIFY status ENUM('pending','active','urgent','completed','cancelled') NOT NULL DEFAULT 'active';
ALTER TABLE item_listings
  MODIFY status ENUM('pending','available','urgent','sold') NOT NULL DEFAULT 'available';
