const pool = require('../config/db')
const { buildListingUnionSql } = require('./listingModel')

async function findOrCreate({ listingType, listingId, ownerId, inquirerId }) {
  const [existingRows] = await pool.query(
    'SELECT * FROM conversations WHERE listing_type = ? AND listing_id = ? AND inquirer_id = ? LIMIT 1',
    [listingType, listingId, inquirerId]
  )
  if (existingRows[0]) return existingRows[0]

  const [result] = await pool.query(
    'INSERT INTO conversations (listing_type, listing_id, owner_id, inquirer_id) VALUES (?, ?, ?, ?)',
    [listingType, listingId, ownerId, inquirerId]
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
  return conversation.owner_id === userId || conversation.inquirer_id === userId
}

async function listForUser(userId) {
  // LEFT JOIN để một bài đăng đã bị gỡ không làm mất cuộc trò chuyện khỏi danh sách.
  const [rows] = await pool.query(
    `SELECT c.*, l.listing_title, l.listing_image,
       owner.full_name AS owner_name, owner.avatar_url AS owner_avatar,
       inquirer.full_name AS inquirer_name, inquirer.avatar_url AS inquirer_avatar,
       (SELECT body FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC, id DESC LIMIT 1) AS last_message,
       (SELECT created_at FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC, id DESC LIMIT 1) AS last_message_at,
       (SELECT COUNT(*) FROM messages
        WHERE conversation_id = c.id AND sender_type = 'user' AND message_kind = 'chat'
          AND is_read = 0 AND sender_id != ?) AS unread_count
     FROM conversations c
     LEFT JOIN (${buildListingUnionSql()}) l
       ON l.listing_type = c.listing_type AND l.listing_id = c.listing_id
     JOIN users owner ON owner.id = c.owner_id
     JOIN users inquirer ON inquirer.id = c.inquirer_id
     WHERE c.owner_id = ? OR c.inquirer_id = ?
     ORDER BY COALESCE(last_message_at, c.created_at) DESC`,
    [userId, userId, userId]
  )
  return rows
}

module.exports = { findOrCreate, findById, isParticipant, listForUser }
