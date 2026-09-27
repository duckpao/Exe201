const pool = require('../config/db')

function buildListFilters(query) {
  const where = ["it.deleted_at IS NULL", "it.status IN ('available','urgent')"]
  const params = []

  if (query.ward) {
    where.push('a.ward = ?')
    params.push(query.ward)
  }
  if (query.priceMin) {
    where.push('it.price >= ?')
    params.push(query.priceMin)
  }
  if (query.priceMax) {
    where.push('it.price <= ?')
    params.push(query.priceMax)
  }
  if (query.category) {
    where.push('it.category = ?')
    params.push(query.category)
  }
  if (query.condition) {
    where.push('it.item_condition = ?')
    params.push(query.condition)
  }

  return { whereSql: where.join(' AND '), params }
}

async function list(query, { limit, offset }) {
  const { whereSql, params } = buildListFilters(query)

  const [rows] = await pool.query(
    `SELECT it.*, a.province, a.district, a.ward,
       (SELECT media_url FROM item_images WHERE item_listing_id = it.id ORDER BY is_primary DESC, id ASC LIMIT 1) AS primary_image
     FROM item_listings it
     JOIN addresses a ON a.id = it.address_id
     WHERE ${whereSql}
     ORDER BY it.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  )

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM item_listings it JOIN addresses a ON a.id = it.address_id WHERE ${whereSql}`,
    params
  )

  return { rows, total }
}

async function findById(id) {
  const [rows] = await pool.query(
    `SELECT it.*, a.province, a.district, a.ward,
       u.full_name AS poster_name, u.avatar_url AS poster_avatar
     FROM item_listings it
     JOIN addresses a ON a.id = it.address_id
     JOIN users u ON u.id = it.posted_by
     WHERE it.id = ? AND it.deleted_at IS NULL
     LIMIT 1`,
    [id]
  )
  return rows[0] || null
}

async function getGallery(itemListingId) {
  const [rows] = await pool.query(
    'SELECT media_url, media_type FROM item_images WHERE item_listing_id = ? ORDER BY is_primary DESC, id ASC',
    [itemListingId]
  )
  return rows
}

async function create({ postedBy, addressId, title, description, category, itemCondition, price }) {
  const [result] = await pool.query(
    `INSERT INTO item_listings (posted_by, address_id, title, description, category, item_condition, price, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
    [postedBy, addressId, title, description || null, category, itemCondition || null, price]
  )
  return result.insertId
}

async function addImages(itemListingId, images) {
  if (!images.length) return
  const values = images.map((img, index) => [itemListingId, img.url, img.mediaType, index === 0 ? 1 : 0])
  await pool.query('INSERT INTO item_images (item_listing_id, media_url, media_type, is_primary) VALUES ?', [values])
}

async function updateStatus(id, status) {
  await pool.query('UPDATE item_listings SET status = ? WHERE id = ?', [status, id])
}

module.exports = { list, findById, getGallery, create, addImages, updateStatus }
