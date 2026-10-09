const pool = require('../config/db')

async function create({ conversationId, senderId = null, senderType = 'user', messageKind = 'chat', body, isRead = false }) {
  const [result] = await pool.query(
    'INSERT INTO messages (conversation_id, sender_id, sender_type, message_kind, body, is_read) VALUES (?, ?, ?, ?, ?, ?)',
    [conversationId, senderId, senderType, messageKind, body, isRead ? 1 : 0]
  )
  await pool.query('UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?', [conversationId])
  const [rows] = await pool.query('SELECT * FROM messages WHERE id = ? LIMIT 1', [result.insertId])
  return rows[0]
}

async function listByConversation(conversationId, { limit = 50 } = {}) {
  const [rows] = await pool.query(
    `SELECT * FROM (
       SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at DESC, id DESC LIMIT ?
     ) recent ORDER BY created_at ASC, id ASC`,
    [conversationId, limit]
  )
  return rows
}

async function listRecentByConversation(conversationId, { limit = 12 } = {}) {
  const [rows] = await pool.query(
    `SELECT * FROM (
       SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at DESC, id DESC LIMIT ?
     ) recent ORDER BY created_at ASC, id ASC`,
    [conversationId, limit]
  )
  return rows
}

async function createAiExchange({ conversationId, senderId, question, answer }) {
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()
    const [questionResult] = await connection.query(
      `INSERT INTO messages
         (conversation_id, sender_id, sender_type, message_kind, body, is_read)
       VALUES (?, ?, 'user', 'ai_question', ?, 1)`,
      [conversationId, senderId, question]
    )
    const [answerResult] = await connection.query(
      `INSERT INTO messages
         (conversation_id, sender_id, sender_type, message_kind, body, is_read)
       VALUES (?, NULL, 'ai', 'ai_answer', ?, 1)`,
      [conversationId, answer]
    )
    await connection.query('UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?', [conversationId])
    const [rows] = await connection.query(
      'SELECT * FROM messages WHERE id IN (?, ?) ORDER BY id ASC',
      [questionResult.insertId, answerResult.insertId]
    )
    await connection.commit()
    return { question: rows.find((row) => row.id === questionResult.insertId), answer: rows.find((row) => row.id === answerResult.insertId) }
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

async function markRead(conversationId, userId) {
  await pool.query(
    "UPDATE messages SET is_read = 1 WHERE conversation_id = ? AND sender_type = 'user' AND message_kind = 'chat' AND sender_id != ? AND is_read = 0",
    [conversationId, userId]
  )
}

module.exports = { create, createAiExchange, listByConversation, listRecentByConversation, markRead }
