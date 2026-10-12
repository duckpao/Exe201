const pool = require('../config/db')

async function create({ userId, type, title, body = null, listingType = null, listingId = null }) {
  const [result] = await pool.query(
    'INSERT INTO notifications (user_id, type, title, body, listing_type, listing_id) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, type, title, body, listingType, listingId]
  )
  return result.insertId
}

async function listForUser(userId, limit = 50) {
  const [rows] = await pool.query(
    'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC, id DESC LIMIT ?',
    [userId, limit]
  )
  return rows
}

async function countUnread(userId) {
  const [[{ total }]] = await pool.query(
    'SELECT COUNT(*) AS total FROM notifications WHERE user_id = ? AND is_read = 0',
    [userId]
  )
  return total
}

async function markRead(userId, id) {
  const [result] = await pool.query(
    'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
    [id, userId]
  )
  return result.affectedRows > 0
}

async function markAllRead(userId) {
  await pool.query('UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0', [userId])
}

module.exports = { create, listForUser, countUnread, markRead, markAllRead }
