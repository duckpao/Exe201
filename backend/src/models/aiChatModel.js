const pool = require('../config/db')
const { getListingType } = require('./listingRegistry')

async function getListingContext(listingType, listingId) {
  const config = getListingType(listingType)
  if (!config) return null

  const selectByType = {
    room: `SELECT l.id, l.title, l.description, l.property_type, l.price_per_month AS price,
             l.deposit_amount, l.area_m2, l.max_occupants, l.amenities, l.status,
             a.ward, a.district, a.province, a.formatted_address
           FROM room_listings l JOIN addresses a ON a.id = l.address_id
           WHERE l.id = ? AND l.deleted_at IS NULL LIMIT 1`,
    pass_room: `SELECT l.id, l.title, l.description, l.property_type, l.monthly_price AS price,
             l.compensation_fee, l.area_m2, l.max_occupants, l.amenities, l.status,
             a.ward, a.district, a.province, a.formatted_address
           FROM room_pass_listings l JOIN addresses a ON a.id = l.address_id
           WHERE l.id = ? AND l.deleted_at IS NULL LIMIT 1`,
    roommate: `SELECT l.id, l.title, l.description, l.place_info, l.room_type, l.property_type,
             l.budget_min, l.budget_max AS price, l.area_m2, l.gender_preference, l.amenities, l.status,
             a.ward, a.district, a.province, a.formatted_address
           FROM roommate_listings l JOIN addresses a ON a.id = l.address_id
           WHERE l.id = ? AND l.deleted_at IS NULL LIMIT 1`,
    item: `SELECT l.id, l.title, l.description, l.category, l.item_condition, l.price, l.status,
             a.ward, a.district, a.province, a.formatted_address
           FROM item_listings l JOIN addresses a ON a.id = l.address_id
           WHERE l.id = ? AND l.deleted_at IS NULL LIMIT 1`,
    vehicle: `SELECT l.id, l.name AS title, l.description, l.vehicle_type, l.service_type,
             COALESCE(l.price_per_trip, l.price_per_hour) AS price, l.price_per_hour, l.price_per_trip,
             l.capacity_kg, l.tags, l.status
           FROM vehicles l WHERE l.id = ? AND l.deleted_at IS NULL LIMIT 1`,
  }
  const [rows] = await pool.query(selectByType[listingType], [listingId])
  return rows[0] || null
}

async function findSimilarRooms(listingType, listing) {
  if (!listing || !['room', 'pass_room', 'roommate'].includes(listingType)) return []
  const price = Number(listing.price) || null
  const area = Number(listing.area_m2) || null
  const params = [listing.id]
  const ordering = []

  if (listing.ward) {
    ordering.push('(a.ward = ?) DESC')
    params.push(listing.ward)
  }
  if (listing.property_type) {
    ordering.push('(rl.property_type = ?) DESC')
    params.push(listing.property_type)
  }
  if (price) {
    ordering.push('(ABS(rl.price_per_month - ?) / ?) ASC')
    params.push(price, Math.max(price, 1))
  }
  if (area) {
    ordering.push('(ABS(COALESCE(rl.area_m2, ?) - ?) / ?) ASC')
    params.push(area, area, Math.max(area, 1))
  }

  const order = ordering.length
    ? `ORDER BY ${ordering.join(', ')}, rl.created_at DESC`
    : 'ORDER BY rl.created_at DESC'

  const [rows] = await pool.query(
    `SELECT rl.id, rl.title, rl.price_per_month AS price, rl.area_m2, rl.property_type,
       a.ward, a.province,
       (SELECT media_url FROM room_images WHERE room_listing_id = rl.id ORDER BY is_primary DESC, id ASC LIMIT 1) AS image
     FROM room_listings rl JOIN addresses a ON a.id = rl.address_id
     WHERE rl.deleted_at IS NULL AND rl.status = 'available' AND NOT (? = 'room' AND rl.id = ?)
     ${order} LIMIT 5`,
    [listingType, ...params]
  )
  return rows.map((row) => ({ ...row, url: `/phong-tro/${row.id}` }))
}

module.exports = { getListingContext, findSimilarRooms }