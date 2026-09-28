const pool = require('../config/db')

function buildListFilters(query) {
  const where = ["rp.deleted_at IS NULL", "rp.status IN ('active','urgent')"]
  const params = []

  if (query.ward) {
    where.push('a.ward = ?')
    params.push(query.ward)
  }
  if (query.priceMin) {
    where.push('rp.monthly_price >= ?')
    params.push(query.priceMin)
  }
  if (query.priceMax) {
    where.push('rp.monthly_price <= ?')
    params.push(query.priceMax)
  }
  if (query.propertyType) {
    where.push('rp.property_type = ?')
    params.push(query.propertyType)
  }
  if (query.areaMin) {
    where.push('rp.area_m2 >= ?')
    params.push(query.areaMin)
  }
  if (query.areaMax) {
    where.push('rp.area_m2 <= ?')
    params.push(query.areaMax)
  }
  for (const amenity of query.amenities || []) {
    where.push('JSON_CONTAINS(rp.amenities, JSON_QUOTE(?))')
    params.push(amenity)
  }

  return { whereSql: where.join(' AND '), params }
}

async function list(query, { limit, offset }) {
  const { whereSql, params } = buildListFilters(query)

  const [rows] = await pool.query(
    `SELECT rp.*, a.province, a.district, a.ward,
       (SELECT media_url FROM room_pass_images WHERE room_pass_listing_id = rp.id ORDER BY is_primary DESC, id ASC LIMIT 1) AS primary_image
     FROM room_pass_listings rp
     JOIN addresses a ON a.id = rp.address_id
     WHERE ${whereSql}
     ORDER BY rp.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  )

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM room_pass_listings rp JOIN addresses a ON a.id = rp.address_id WHERE ${whereSql}`,
    params
  )

  return { rows, total }
}

async function findById(id) {
  const [rows] = await pool.query(
    `SELECT rp.*, a.province, a.district, a.ward, a.street_address, a.latitude, a.longitude,
       u.full_name AS poster_name, u.avatar_url AS poster_avatar
     FROM room_pass_listings rp
     JOIN addresses a ON a.id = rp.address_id
     JOIN users u ON u.id = rp.posted_by
     WHERE rp.id = ? AND rp.deleted_at IS NULL
     LIMIT 1`,
    [id]
  )
  return rows[0] || null
}

async function getGallery(passListingId) {
  const [rows] = await pool.query(
    'SELECT media_url, media_type FROM room_pass_images WHERE room_pass_listing_id = ? ORDER BY is_primary DESC, id ASC',
    [passListingId]
  )
  return rows
}

async function create({
  postedBy, addressId, title, description, passType, propertyType, areaM2, maxOccupants,
  amenities, monthlyPrice, compensationFee, contractEndDate, reason,
}) {
  const [result] = await pool.query(
    `INSERT INTO room_pass_listings
       (posted_by, address_id, title, description, pass_type, property_type, area_m2, max_occupants,
        amenities, monthly_price, compensation_fee, contract_end_date, reason, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
    [
      postedBy, addressId, title, description || null, passType || 'pass', propertyType || null,
      areaM2 || null, maxOccupants || null, amenities ? JSON.stringify(amenities) : null,
      monthlyPrice, compensationFee || null, contractEndDate || null, reason || null,
    ]
  )
  return result.insertId
}

async function addImages(passListingId, images) {
  if (!images.length) return
  const values = images.map((img, index) => [passListingId, img.url, img.mediaType, index === 0 ? 1 : 0])
  await pool.query('INSERT INTO room_pass_images (room_pass_listing_id, media_url, media_type, is_primary) VALUES ?', [values])
}

async function updateStatus(id, status) {
  await pool.query('UPDATE room_pass_listings SET status = ? WHERE id = ?', [status, id])
}

module.exports = { list, findById, getGallery, create, addImages, updateStatus }
