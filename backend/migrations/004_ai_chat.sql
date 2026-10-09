-- Cho phép lưu câu trả lời Gemini trong cùng luồng chat nhưng phân biệt rõ với người dùng.
-- Migration idempotent: có thể chạy lại mà không báo Duplicate column.
ALTER TABLE messages MODIFY sender_id BIGINT UNSIGNED NULL;

SET @add_sender_type = (
  SELECT IF(COUNT(*) = 0,
    "ALTER TABLE messages ADD COLUMN sender_type ENUM('user','ai') NOT NULL DEFAULT 'user' AFTER sender_id",
    'SELECT 1')
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'messages' AND COLUMN_NAME = 'sender_type'
);
PREPARE stmt FROM @add_sender_type;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @add_message_kind = (
  SELECT IF(COUNT(*) = 0,
    "ALTER TABLE messages ADD COLUMN message_kind ENUM('chat','ai_question','ai_answer') NOT NULL DEFAULT 'chat' AFTER sender_type",
    'SELECT 1')
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'messages' AND COLUMN_NAME = 'message_kind'
);
PREPARE stmt FROM @add_message_kind;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;