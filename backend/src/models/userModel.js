const pool = require('../config/db')

async function findByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email])
  return rows[0] || null
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [id])
  return rows[0] || null
}

async function createUser({ fullName, email, phone = null, passwordHash = null, role = 'tenant' }) {
  const [result] = await pool.query(
    'INSERT INTO users (full_name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)',
    [fullName, email, phone, passwordHash, role]
  )
  return findById(result.insertId)
}

async function updatePasswordById(userId, passwordHash) {
  await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, userId])
}

async function findOauthAccount(provider, providerUid) {
  const [rows] = await pool.query(
    'SELECT * FROM user_oauth_accounts WHERE provider = ? AND provider_uid = ? LIMIT 1',
    [provider, providerUid]
  )
  return rows[0] || null
}

async function linkOauthAccount({ userId, provider, providerUid, providerEmail }) {
  await pool.query(
    'INSERT INTO user_oauth_accounts (user_id, provider, provider_uid, provider_email) VALUES (?, ?, ?, ?)',
    [userId, provider, providerUid, providerEmail]
  )
}

async function createUserWithGoogle({ fullName, email, providerUid, providerEmail, avatarUrl = null }) {
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()

    const [existingRows] = await connection.query('SELECT * FROM users WHERE email = ? LIMIT 1', [email])
    let user = existingRows[0]

    if (!user) {
      const [result] = await connection.query(
        'INSERT INTO users (full_name, email, avatar_url, role) VALUES (?, ?, ?, ?)',
        [fullName, email, avatarUrl, 'tenant']
      )
      const [createdRows] = await connection.query('SELECT * FROM users WHERE id = ?', [result.insertId])
      user = createdRows[0]
    }

    await connection.query(
      'INSERT INTO user_oauth_accounts (user_id, provider, provider_uid, provider_email) VALUES (?, ?, ?, ?)',
      [user.id, 'google', providerUid, providerEmail]
    )

    await connection.commit()
    return user
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

module.exports = {
  findByEmail,
  findById,
  createUser,
  updatePasswordById,
  findOauthAccount,
  linkOauthAccount,
  createUserWithGoogle,
}
