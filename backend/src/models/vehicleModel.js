const pool = require('../config/db')

function buildListFilters(query) {
  const where = ["v.deleted_at IS NULL", "v.status = 'available'"]
  const params = []

  if (query.priceMin) {
    where.push('COALESCE(v.price_per_trip, v.price_per_hour) >= ?')
    params.push(query.priceMin)
  }
  if (query.priceMax) {
    where.push('COALESCE(v.price_per_trip, v.price_per_hour) <= ?')
    params.push(query.priceMax)
  }
  if (query.serviceType) {
    where.push('v.service_type = ?')
    params.push(query.serviceType)
  }
  if (query.capacityMin) {
    where.push('v.capacity_kg >= ?')
    params.push(query.capacityMin)
  }
  if (query.capacityMax) {
    where.push('v.capacity_kg <= ?')
    params.push(query.capacityMax)
  }

  return { whereSql: where.join(' AND '), params }
}

async function list(query, { limit, offset }) {
  const { whereSql, params } = buildListFilters(query)

  const [rows] = await pool.query(
    `SELECT v.*,
       (SELECT media_url FROM vehicle_images WHERE vehicle_id = v.id ORDER BY is_primary DESC, id ASC LIMIT 1) AS primary_image,
       (SELECT AVG(rating) FROM reviews WHERE target_type = 'vehicle' AND target_id = v.id AND deleted_at IS NULL) AS avg_rating
     FROM vehicles v
     WHERE ${whereSql}
     ORDER BY v.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  )

  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM vehicles v WHERE ${whereSql}`, params)

  return { rows, total }
}

async function findById(id) {
  const [rows] = await pool.query(
    `SELECT v.*, u.full_name AS owner_name, u.avatar_url AS owner_avatar,
       (SELECT AVG(rating) FROM reviews WHERE target_type = 'vehicle' AND target_id = v.id AND deleted_at IS NULL) AS avg_rating,
       (SELECT COUNT(*) FROM reviews WHERE target_type = 'vehicle' AND target_id = v.id AND deleted_at IS NULL) AS review_count
     FROM vehicles v
     JOIN users u ON u.id = v.owner_id
     WHERE v.id = ? AND v.deleted_at IS NULL
     LIMIT 1`,
    [id]
  )
  return rows[0] || null
}

async function getGallery(vehicleId) {
  const [rows] = await pool.query(
    'SELECT media_url, media_type FROM vehicle_images WHERE vehicle_id = ? ORDER BY is_primary DESC, id ASC',
    [vehicleId]
  )
  return rows
}

async function create({ ownerId, vehicleType, serviceType, name, licensePlate, capacityKg, pricePerHour, pricePerTrip, description, tags }) {
  const [result] = await pool.query(
    `INSERT INTO vehicles (owner_id, vehicle_type, service_type, name, license_plate, capacity_kg, price_per_hour, price_per_trip, description, tags)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [ownerId, vehicleType, serviceType || null, name, licensePlate, capacityKg || null, pricePerHour || null, pricePerTrip || null, description || null, tags ? JSON.stringify(tags) : null]
  )
  return result.insertId
}

async function addImages(vehicleId, images) {
  if (!images.length) return
  const values = images.map((img, index) => [vehicleId, img.url, img.mediaType, index === 0 ? 1 : 0])
  await pool.query('INSERT INTO vehicle_images (vehicle_id, media_url, media_type, is_primary) VALUES ?', [values])
}

async function createBooking({ vehicleId, renterId, pickupAddressId, dropoffAddressId, scheduledAt, estimatedHours, totalPrice, note }) {
  const [result] = await pool.query(
    `INSERT INTO vehicle_bookings (vehicle_id, renter_id, pickup_address_id, dropoff_address_id, scheduled_at, estimated_hours, total_price, note)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [vehicleId, renterId, pickupAddressId, dropoffAddressId, scheduledAt, estimatedHours || null, totalPrice || null, note || null]
  )
  return result.insertId
}

module.exports = { list, findById, getGallery, create, addImages, createBooking }
