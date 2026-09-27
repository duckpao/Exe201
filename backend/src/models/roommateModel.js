const pool = require('../config/db')

function buildListFilters(query) {
  const where = [
    'rm.deleted_at IS NULL',
    "rm.status = 'active'",
    '(rm.publish_at IS NULL OR rm.publish_at <= NOW())',
  ]
  const params = []

  if (query.ward) {
    where.push('a.ward = ?')
    params.push(query.ward)
  }
  if (query.budgetMin) {
    where.push('rm.budget_max >= ?')
    params.push(query.budgetMin)
  }
  if (query.budgetMax) {
    where.push('rm.budget_min <= ?')
    params.push(query.budgetMax)
  }
  if (query.propertyType) {
    where.push('rm.property_type = ?')
    params.push(query.propertyType)
  }
  if (query.areaMin) {
    where.push('rm.area_m2 >= ?')
    params.push(query.areaMin)
  }
  if (query.areaMax) {
    where.push('rm.area_m2 <= ?')
    params.push(query.areaMax)
  }
  if (query.gender) {
    where.push('rm.gender_preference = ?')
    params.push(query.gender)
  }

  return { whereSql: where.join(' AND '), params }
}

async function list(query, { limit, offset }) {
  const { whereSql, params } = buildListFilters(query)

  const [rows] = await pool.query(
    `SELECT rm.*, a.province, a.district, a.ward,
       u.full_name AS poster_name, u.avatar_url AS poster_avatar,
       (SELECT media_url FROM roommate_images WHERE roommate_listing_id = rm.id ORDER BY is_primary DESC, id ASC LIMIT 1) AS primary_image
     FROM roommate_listings rm
     JOIN addresses a ON a.id = rm.address_id
     JOIN users u ON u.id = rm.posted_by
     WHERE ${whereSql}
     ORDER BY rm.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  )

  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM roommate_listings rm JOIN addresses a ON a.id = rm.address_id WHERE ${whereSql}`,
    params
  )

  return { rows, total }
}

async function findById(id) {
  const [rows] = await pool.query(
    `SELECT rm.*, a.province, a.district, a.ward,
       u.full_name AS poster_name, u.avatar_url AS poster_avatar
     FROM roommate_listings rm
     JOIN addresses a ON a.id = rm.address_id
     JOIN users u ON u.id = rm.posted_by
     WHERE rm.id = ? AND rm.deleted_at IS NULL
     LIMIT 1`,
    [id]
  )
  return rows[0] || null
}

async function getGallery(roommateListingId) {
  const [rows] = await pool.query(
    'SELECT media_url, media_type FROM roommate_images WHERE roommate_listing_id = ? ORDER BY is_primary DESC, id ASC',
    [roommateListingId]
  )
  return rows
}

async function create({
  postedBy, addressId, title, description, placeInfo, age, roomType, propertyType, areaM2,
  budgetMin, budgetMax, moveInDate, genderPreference, amenities, publishAt,
}) {
  const [result] = await pool.query(
    `INSERT INTO roommate_listings
       (posted_by, address_id, title, description, place_info, age, room_type, property_type, area_m2,
        budget_min, budget_max, move_in_date, gender_preference, amenities, publish_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      postedBy, addressId, title, description || null, placeInfo || null, age || null, roomType,
      propertyType || null, areaM2 || null, budgetMin || null, budgetMax || null, moveInDate || null,
      genderPreference || 'any', amenities ? JSON.stringify(amenities) : null, publishAt || null,
    ]
  )
  return result.insertId
}

async function addImages(roommateListingId, images) {
  if (!images.length) return
  const values = images.map((img, index) => [roommateListingId, img.url, img.mediaType, index === 0 ? 1 : 0])
  await pool.query('INSERT INTO roommate_images (roommate_listing_id, media_url, media_type, is_primary) VALUES ?', [values])
}

module.exports = { list, findById, getGallery, create, addImages }
