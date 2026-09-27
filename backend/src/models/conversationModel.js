const pool = require('../config/db')

async function findOrCreate({ roomListingId, landlordId, tenantId }) {
  const [existingRows] = await pool.query(
    'SELECT * FROM conversations WHERE room_listing_id = ? AND tenant_id = ? LIMIT 1',
    [roomListingId, tenantId]
  )
  if (existingRows[0]) return existingRows[0]

  const [result] = await pool.query(
    'INSERT INTO conversations (room_listing_id, landlord_id, tenant_id) VALUES (?, ?, ?)',
    [roomListingId, landlordId, tenantId]
  )
  return findById(result.insertId)
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM conversations WHERE id = ? LIMIT 1', [id])
  return rows[0] || null
}

async function isParticipant(id, userId) {
  const conversation = await findById(id)
  if (!conversation) return false
  return conversation.landlord_id === userId || conversation.tenant_id === userId
}

async function listForUser(userId) {
  const [rows] = await pool.query(
    `SELECT c.*, rl.title AS room_title,
       (SELECT media_url FROM room_images WHERE room_listing_id = rl.id ORDER BY is_primary DESC, id ASC LIMIT 1) AS room_image,
       landlord.full_name AS landlord_name, landlord.avatar_url AS landlord_avatar,
       tenant.full_name AS tenant_name, tenant.avatar_url AS tenant_avatar,
       (SELECT body FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC, id DESC LIMIT 1) AS last_message,
       (SELECT created_at FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC, id DESC LIMIT 1) AS last_message_at,
       (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id AND is_read = 0 AND sender_id != ?) AS unread_count
     FROM conversations c
     JOIN room_listings rl ON rl.id = c.room_listing_id
     JOIN users landlord ON landlord.id = c.landlord_id
     JOIN users tenant ON tenant.id = c.tenant_id
     WHERE c.landlord_id = ? OR c.tenant_id = ?
     ORDER BY COALESCE(last_message_at, c.created_at) DESC`,
    [userId, userId, userId]
  )
  return rows
}

module.exports = { findOrCreate, findById, isParticipant, listForUser }
