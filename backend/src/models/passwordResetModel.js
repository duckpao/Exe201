const pool = require('../config/db')

async function createToken({ userId, tokenHash, expiresAt }) {
  await pool.query(
    'INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)',
    [userId, tokenHash, expiresAt]
  )
}

async function findValidTokenByHash(tokenHash) {
  const [rows] = await pool.query(
    `SELECT * FROM password_reset_tokens
     WHERE token_hash = ? AND used_at IS NULL AND expires_at > NOW()
     LIMIT 1`,
    [tokenHash]
  )
  return rows[0] || null
}

async function markUsed(id) {
  await pool.query('UPDATE password_reset_tokens SET used_at = NOW() WHERE id = ?', [id])
}

async function invalidateActiveTokensForUser(userId) {
  await pool.query(
    'UPDATE password_reset_tokens SET used_at = NOW() WHERE user_id = ? AND used_at IS NULL',
    [userId]
  )
}

module.exports = { createToken, findValidTokenByHash, markUsed, invalidateActiveTokensForUser }
