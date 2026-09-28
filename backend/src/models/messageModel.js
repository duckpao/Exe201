const pool = require('../config/db')

async function create({ conversationId, senderId, body }) {
  const [result] = await pool.query(
    'INSERT INTO messages (conversation_id, sender_id, body) VALUES (?, ?, ?)',
    [conversationId, senderId, body]
  )
  await pool.query('UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?', [conversationId])
  const [rows] = await pool.query('SELECT * FROM messages WHERE id = ? LIMIT 1', [result.insertId])
  return rows[0]
}

async function listByConversation(conversationId, { limit = 50 } = {}) {
  const [rows] = await pool.query(
    'SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC, id ASC LIMIT ?',
    [conversationId, limit]
  )
  return rows
}

async function markRead(conversationId, userId) {
  await pool.query(
    'UPDATE messages SET is_read = 1 WHERE conversation_id = ? AND sender_id != ? AND is_read = 0',
    [conversationId, userId]
  )
}

module.exports = { create, listByConversation, markRead }
