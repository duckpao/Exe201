const pool = require('../config/db')
const { getListingType } = require('./listingRegistry')
const { formatVnd } = require('../utils/format')

// Tên bảng/cột lấy từ listingRegistry (hằng số nội bộ); chỉ id/keyword/phân trang là input
// người dùng và luôn đi qua placeholder.
async function list(type, { keyword, limit, offset }) {
  const config = getListingType(type)
  const where = ['t.deleted_at IS NULL']
  const params = []
  if (keyword) {
    where.push(`(t.${config.titleColumn} LIKE ? OR u.full_name LIKE ?)`)
    params.push(`%${keyword}%`, `%${keyword}%`)
  }
  const whereSql = where.join(' AND ')

  const [rows] = await pool.query(
    `SELECT t.id, t.${config.titleColumn} AS title, ${config.priceColumn} AS price, t.status,
       t.created_at, t.admin_hidden_at, t.admin_hidden_reason,
       u.id AS owner_id, u.full_name AS owner_name,
       (SELECT media_url FROM ${config.imageTable}
         WHERE ${config.imageForeignKey} = t.id ORDER BY is_primary DESC, id ASC LIMIT 1) AS image
     FROM ${config.table} t
     JOIN users u ON u.id = t.${config.ownerColumn}
     WHERE ${whereSql}
     ORDER BY t.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  )
  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM ${config.table} t
     JOIN users u ON u.id = t.${config.ownerColumn} WHERE ${whereSql}`,
    params
  )

  return {
    total,
    rows: rows.map((row) => ({
      type,
      id: row.id,
      title: row.title,
      price: formatVnd(row.price, config.priceSuffix),
      status: row.status,
      image: row.image,
      createdAt: row.created_at,
      ownerId: row.owner_id,
      ownerName: row.owner_name,
      hidden: row.admin_hidden_at != null,
      hiddenReason: row.admin_hidden_reason || null,
      hiddenAt: row.admin_hidden_at || null,
      path: `${config.path}/${row.id}`,
    })),
  }
}

async function findForModeration(type, id) {
  const config = getListingType(type)
  const [rows] = await pool.query(
    `SELECT t.id, t.${config.titleColumn} AS title, t.${config.ownerColumn} AS owner_id, t.admin_hidden_at
     FROM ${config.table} t WHERE t.id = ? AND t.deleted_at IS NULL LIMIT 1`,
    [id]
  )
  return rows[0] || null
}

// reason = null nghĩa là bỏ ẩn.
async function setHidden(type, id, reason) {
  const config = getListingType(type)
  const sql = reason
    ? `UPDATE ${config.table} SET admin_hidden_at = NOW(), admin_hidden_reason = ? WHERE id = ? AND deleted_at IS NULL`
    : `UPDATE ${config.table} SET admin_hidden_at = NULL, admin_hidden_reason = NULL WHERE id = ? AND deleted_at IS NULL`
  const [result] = await pool.query(sql, reason ? [reason, id] : [id])
  return result.affectedRows > 0
}

module.exports = { list, findForModeration, setHidden }
