const pool = require('../config/db')
const { LISTING_TYPES, getListingType } = require('./listingRegistry')

// Tra cứu chủ bài đăng + tiêu đề cho bất kỳ loại bài đăng nào.
// Dùng khi mở cuộc trò chuyện: cần biết ai là người nhận tin nhắn.
async function findOwner(listingType, listingId) {
  const config = getListingType(listingType)
  if (!config) return null

  const [rows] = await pool.query(
    `SELECT l.id, l.${config.ownerColumn} AS owner_id, l.${config.titleColumn} AS title,
       u.full_name AS owner_name, u.avatar_url AS owner_avatar
     FROM ${config.table} l
     JOIN users u ON u.id = l.${config.ownerColumn}
     WHERE l.id = ? AND l.deleted_at IS NULL
     LIMIT 1`,
    [listingId]
  )
  return rows[0] || null
}

// Bảng ảo (listing_type, listing_id, title, image) ghép từ cả 5 bảng bài đăng,
// để conversations có thể LEFT JOIN lấy tiêu đề/ảnh mà không cần biết trước loại.
function buildListingUnionSql() {
  return Object.entries(LISTING_TYPES)
    .map(
      ([type, config]) => `SELECT '${type}' AS listing_type, l.id AS listing_id,
         l.${config.titleColumn} AS listing_title,
         (SELECT media_url FROM ${config.imageTable}
          WHERE ${config.imageForeignKey} = l.id ORDER BY is_primary DESC, id ASC LIMIT 1) AS listing_image
       FROM ${config.table} l`
    )
    .join(' UNION ALL ')
}

module.exports = { findOwner, buildListingUnionSql }
