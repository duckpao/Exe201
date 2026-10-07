const pool = require('../config/db')

async function findOrCreateWard({
  ward,
  province = 'Hà Nội',
  district = 'Thạch Thất',
  provinceCode = null,
  wardCode = null,
  streetAddress = null,
  formattedAddress = null,
  vietmapRefId = null,
  latitude = null,
  longitude = null,
  locationSource = 'manual',
} = {}) {
  if (vietmapRefId) {
    const [existingRows] = await pool.query('SELECT * FROM addresses WHERE vietmap_ref_id = ? LIMIT 1', [vietmapRefId])
    if (existingRows[0]) return existingRows[0]
  }

  if (!streetAddress) {
    if (wardCode) {
      const [existingRows] = await pool.query(
        'SELECT * FROM addresses WHERE ward_code = ? AND street_address IS NULL LIMIT 1',
        [wardCode]
      )
      if (existingRows[0]) return existingRows[0]
    } else {
      const [existingRows] = await pool.query(
        'SELECT * FROM addresses WHERE province = ? AND district = ? AND ward = ? LIMIT 1',
        [province, district, ward]
      )
      if (existingRows[0]) return existingRows[0]
    }
  }

  const [result] = await pool.query(
    `INSERT INTO addresses
       (province, district, ward, province_code, ward_code, street_address, formatted_address, vietmap_ref_id, latitude, longitude, location_source)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [province, district, ward, provinceCode, wardCode, streetAddress, formattedAddress, vietmapRefId, latitude, longitude, locationSource]
  )
  const [rows] = await pool.query('SELECT * FROM addresses WHERE id = ?', [result.insertId])
  return rows[0]
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM addresses WHERE id = ? LIMIT 1', [id])
  return rows[0] || null
}

module.exports = { findOrCreateWard, findById }
