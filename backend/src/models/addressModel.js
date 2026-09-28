const pool = require('../config/db')

async function findOrCreateWard({
  ward,
  province = 'Hà Nội',
  district = 'Thạch Thất',
  provinceCode = null,
  wardCode = null,
  streetAddress = null,
  latitude = null,
  longitude = null,
} = {}) {
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
    `INSERT INTO addresses (province, district, ward, province_code, ward_code, street_address, latitude, longitude)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [province, district, ward, provinceCode, wardCode, streetAddress, latitude, longitude]
  )
  const [rows] = await pool.query('SELECT * FROM addresses WHERE id = ?', [result.insertId])
  return rows[0]
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM addresses WHERE id = ? LIMIT 1', [id])
  return rows[0] || null
}

module.exports = { findOrCreateWard, findById }
