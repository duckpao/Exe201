const crypto = require('crypto')
const pool = require('../config/db')

function viewerKey(request) {
  const identity = request.user?.id ? `u:${request.user.id}` : `ip:${request.ip || 'unknown'}`
  return crypto.createHash('sha256').update(`${process.env.JWT_SECRET || ''}|${identity}`).digest('hex')
}

// Mỗi người xem tính một lần mỗi ngày; chủ bài không tính. Không chờ kết quả để không làm chậm trang chi tiết.
function trackView(request, listingType, listingId, ownerId) {
  if (request.user?.id && request.user.id === ownerId) return
  pool
    .query('INSERT IGNORE INTO listing_view_daily (listing_type, listing_id, view_date, viewer_key) VALUES (?, ?, CURDATE(), ?)', [
      listingType,
      listingId,
      viewerKey(request),
    ])
    .catch((error) => console.error('Ghi lượt xem thất bại:', error.message))
}

async function viewsLast30Days(listingType, listingIds) {
  if (!listingIds.length) return new Map()
  const [rows] = await pool.query(
    `SELECT listing_id, COUNT(*) AS views FROM listing_view_daily
     WHERE listing_type = ? AND listing_id IN (?) AND view_date >= DATE_SUB(CURDATE(), INTERVAL 29 DAY)
     GROUP BY listing_id`,
    [listingType, listingIds]
  )
  return new Map(rows.map((row) => [row.listing_id, Number(row.views)]))
}

module.exports = { trackView, viewsLast30Days }
