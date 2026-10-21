const pool = require('../config/db')
const { buildMemberSql } = require('./subscriptionModel')
const { LISTING_TYPES } = require('./listingRegistry')
const { buildMediaRows } = require('../utils/media')
const { queryWithRetry } = pool

const member = buildMemberSql(LISTING_TYPES.room, 'rl')

function buildListFilters(query) {
  const where = ["rl.deleted_at IS NULL", "rl.status IN ('available','rented')", 'rl.admin_hidden_at IS NULL']
  const params = []

  if (query.keyword) {
    where.push('(rl.title LIKE ? OR rl.description LIKE ?)')
    params.push(`%${query.keyword}%`, `%${query.keyword}%`)
  }
  if (query.priceMin) {
    where.push('rl.price_per_month >= ?')
    params.push(query.priceMin)
  }
  if (query.priceMax) {
    where.push('rl.price_per_month <= ?')
    params.push(query.priceMax)
  }
  if (query.propertyType) {
    where.push('rl.property_type = ?')
    params.push(query.propertyType)
  }
  if (query.areaMin) {
    where.push('rl.area_m2 >= ?')
    params.push(query.areaMin)
  }
  if (query.areaMax) {
    where.push('rl.area_m2 <= ?')
    params.push(query.areaMax)
  }
  if (query.ward) {
    where.push('a.ward = ?')
    params.push(query.ward)
  }
  for (const amenity of query.amenities || []) {
    where.push('JSON_CONTAINS(rl.amenities, JSON_QUOTE(?))')
    params.push(amenity)
  }

  return { whereSql: where.join(' AND '), params }
}

async function list(query, { limit, offset }) {
  const { whereSql, params } = buildListFilters(query)

  const [rows] = await queryWithRetry(
    `SELECT rl.*, a.province, a.district, a.ward,
       (SELECT media_url FROM room_images WHERE room_listing_id = rl.id AND media_type = 'image' ORDER BY is_primary DESC, id ASC LIMIT 1) AS primary_image,
       ${member.selectSql}
     FROM room_listings rl
     JOIN addresses a ON a.id = rl.address_id
     ${member.joinSql}
     WHERE ${whereSql}
     ORDER BY (rl.status = 'available') DESC, (CASE WHEN rl.status = 'available' THEN member_rank ELSE 0 END) DESC, rl.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  )

  const [[{ total }]] = await queryWithRetry(
    `SELECT COUNT(*) AS total FROM room_listings rl JOIN addresses a ON a.id = rl.address_id WHERE ${whereSql}`,
    params
  )

  return { rows, total }
}

  async function findById(id, viewerId = null) {
  const [rows] = await pool.query(
    `SELECT rl.*, a.province, a.district, a.ward, a.street_address, a.formatted_address, a.latitude, a.longitude,
       u.id AS landlord_user_id, u.full_name AS landlord_name, u.avatar_url AS landlord_avatar, u.created_at AS landlord_created_at,
       u.phone AS landlord_phone, u.email AS landlord_email,
       ${member.selectSql}
     FROM room_listings rl
     JOIN addresses a ON a.id = rl.address_id
     JOIN users u ON u.id = rl.landlord_id
     ${member.joinSql}
     WHERE rl.id = ? AND rl.deleted_at IS NULL
       AND ((rl.status IN ('available','rented') AND rl.admin_hidden_at IS NULL) OR rl.landlord_id = ?)
     LIMIT 1`,
    [id, viewerId]
  )
  return rows[0] || null
}

async function getGallery(roomListingId) {
  const [rows] = await pool.query(
    'SELECT media_url, media_type FROM room_images WHERE room_listing_id = ? ORDER BY is_primary DESC, id ASC',
    [roomListingId]
  )
  return rows
}

async function getLandlordRating(landlordId) {
  const [[row]] = await pool.query(
    `SELECT AVG(rating) AS avg_rating, COUNT(*) AS review_count
     FROM reviews WHERE target_type = 'landlord' AND target_id = ? AND deleted_at IS NULL`,
    [landlordId]
  )
  return row
}

async function create({ landlordId, addressId, title, description, propertyType, pricePerMonth, depositAmount, areaM2, maxOccupants, amenities }) {
  const [result] = await pool.query(
    `INSERT INTO room_listings (landlord_id, address_id, title, description, property_type, price_per_month, deposit_amount, area_m2, max_occupants, amenities)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [landlordId, addressId, title, description || null, propertyType, pricePerMonth, depositAmount || null, areaM2 || null, maxOccupants || null, amenities ? JSON.stringify(amenities) : null]
  )
  return result.insertId
}

async function addImages(roomListingId, images) {
  if (!images.length) return
  const values = buildMediaRows(roomListingId, images)
  await pool.query('INSERT INTO room_images (room_listing_id, media_url, media_type, is_primary) VALUES ?', [values])
}

module.exports = { list, findById, getGallery, getLandlordRating, create, addImages }
