const pool = require('../config/db')
const { LISTING_TYPES, LISTING_TYPE_KEYS } = require('./listingRegistry')

const USER_COLUMNS = 'id, full_name, email, phone, avatar_url, role, status, created_at'

async function listUsers({ keyword, role, status, limit, offset }) {
  const where = ['deleted_at IS NULL']
  const params = []
  if (keyword) {
    where.push('(full_name LIKE ? OR email LIKE ?)')
    params.push(`%${keyword}%`, `%${keyword}%`)
  }
  if (role) {
    where.push('role = ?')
    params.push(role)
  }
  if (status) {
    where.push('status = ?')
    params.push(status)
  }
  const whereSql = where.join(' AND ')

  const [rows] = await pool.query(
    `SELECT ${USER_COLUMNS} FROM users WHERE ${whereSql} ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  )
  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM users WHERE ${whereSql}`, params)
  return { rows, total }
}

async function findUser(id) {
  const [rows] = await pool.query(`SELECT ${USER_COLUMNS} FROM users WHERE id = ? AND deleted_at IS NULL LIMIT 1`, [id])
  return rows[0] || null
}

async function updateUser(id, { role, status }) {
  const updates = []
  const params = []
  if (role) {
    updates.push('role = ?')
    params.push(role)
  }
  if (status) {
    updates.push('status = ?')
    params.push(status)
  }
  await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ? AND deleted_at IS NULL`, [...params, id])
  return findUser(id)
}

// Số liệu tổng quan. Tên bảng lấy từ listingRegistry (hằng số nội bộ).
async function getOverview() {
  const [[userStats]] = await pool.query(
    `SELECT COUNT(*) AS total,
            COALESCE(SUM(status = 'locked'), 0) AS locked
     FROM users WHERE deleted_at IS NULL`
  )

  const perType = await Promise.all(
    LISTING_TYPE_KEYS.map(async (type) => {
      const config = LISTING_TYPES[type]
      const hasPending = type === 'item' || type === 'pass_room'
      const [[row]] = await pool.query(
        `SELECT COUNT(*) AS total,
                COALESCE(SUM(admin_hidden_at IS NOT NULL), 0) AS hidden,
                ${hasPending ? "COALESCE(SUM(status = 'pending'), 0)" : '0'} AS pending
         FROM ${config.table} WHERE deleted_at IS NULL`
      )
      return { type, label: config.label, total: Number(row.total), hidden: Number(row.hidden), pending: Number(row.pending) }
    })
  )

  const [recentUsers] = await pool.query(
    `SELECT ${USER_COLUMNS} FROM users WHERE deleted_at IS NULL ORDER BY created_at DESC, id DESC LIMIT 5`
  )

  return {
    users: { total: Number(userStats.total), locked: Number(userStats.locked) },
    listings: {
      total: perType.reduce((sum, item) => sum + item.total, 0),
      hidden: perType.reduce((sum, item) => sum + item.hidden, 0),
      pending: perType.reduce((sum, item) => sum + item.pending, 0),
      byType: perType,
    },
    recentUsers,
  }
}

module.exports = { listUsers, findUser, updateUser, getOverview }
