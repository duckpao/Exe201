const pool = require('../config/db')

async function list(targetType, targetId, limit = 50) {
  const [rows] = await pool.query(
    `SELECT r.id, r.user_id, r.rating, r.comment, r.created_at,
            u.full_name AS user_name, u.avatar_url AS user_avatar
     FROM reviews r
     JOIN users u ON u.id = r.user_id
     WHERE r.target_type = ? AND r.target_id = ? AND r.deleted_at IS NULL
     ORDER BY r.created_at DESC, r.id DESC
     LIMIT ?`,
    [targetType, targetId, limit]
  )
  return rows
}

async function summary(targetType, targetId) {
  const [[row]] = await pool.query(
    `SELECT AVG(rating) AS average_rating, COUNT(*) AS review_count
     FROM reviews WHERE target_type = ? AND target_id = ? AND deleted_at IS NULL`,
    [targetType, targetId]
  )
  return row
}

async function findByUser(targetType, targetId, userId) {
  const [rows] = await pool.query(
    `SELECT r.id, r.user_id, r.rating, r.comment, r.created_at,
            u.full_name AS user_name, u.avatar_url AS user_avatar
     FROM reviews r
     JOIN users u ON u.id = r.user_id
     WHERE r.target_type = ? AND r.target_id = ? AND r.user_id = ? AND r.deleted_at IS NULL
     LIMIT 1`,
    [targetType, targetId, userId]
  )
  return rows[0] || null
}

// config.table / config.ownerColumn lấy từ listingRegistry (hằng số nội bộ).
async function findListingOwner(config, listingId) {
  const [rows] = await pool.query(
    `SELECT ${config.ownerColumn} AS owner_id FROM ${config.table} WHERE id = ? AND deleted_at IS NULL LIMIT 1`,
    [listingId]
  )
  return rows[0] || null
}

async function hasConversation(listingType, listingId, inquirerId) {
  const [rows] = await pool.query(
    'SELECT id FROM conversations WHERE listing_type = ? AND listing_id = ? AND inquirer_id = ? LIMIT 1',
    [listingType, listingId, inquirerId]
  )
  return rows.length > 0
}

// Ghi đè đánh giá cũ (kể cả đã xóa mềm) nhờ unique key (user_id, target_type, target_id).
async function upsert({ userId, targetType, targetId, rating, comment }) {
  await pool.query(
    `INSERT INTO reviews (user_id, target_type, target_id, rating, comment)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE rating = VALUES(rating), comment = VALUES(comment), deleted_at = NULL`,
    [userId, targetType, targetId, rating, comment]
  )
}

async function softDelete(targetType, targetId, userId) {
  const [result] = await pool.query(
    `UPDATE reviews SET deleted_at = NOW()
     WHERE target_type = ? AND target_id = ? AND user_id = ? AND deleted_at IS NULL`,
    [targetType, targetId, userId]
  )
  return result.affectedRows > 0
}

module.exports = { list, summary, findByUser, findListingOwner, hasConversation, upsert, softDelete }
