const pool = require('../config/db')

// Dòng địa chỉ được tái dùng giữa nhiều bài đăng. Nếu lần tạo đầu geocode thất bại
// (tọa độ NULL), mọi bài sau tái dùng dòng đó sẽ mãi không có bản đồ, nên bù tọa độ
// ngay khi lần đăng sau có được.
async function fillMissingCoordinates(row, latitude, longitude) {
  const hasNewCoords = latitude != null && longitude != null
  if (!hasNewCoords || (row.latitude != null && row.longitude != null)) return row

  await pool.query('UPDATE addresses SET latitude = ?, longitude = ? WHERE id = ?', [latitude, longitude, row.id])
  return { ...row, latitude, longitude }
}

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
    if (existingRows[0]) return fillMissingCoordinates(existingRows[0], latitude, longitude)
  }

  if (!streetAddress) {
    if (wardCode) {
      const [existingRows] = await pool.query(
        'SELECT * FROM addresses WHERE ward_code = ? AND street_address IS NULL LIMIT 1',
        [wardCode]
      )
      if (existingRows[0]) return fillMissingCoordinates(existingRows[0], latitude, longitude)
    } else {
      const [existingRows] = await pool.query(
        'SELECT * FROM addresses WHERE province = ? AND district = ? AND ward = ? LIMIT 1',
        [province, district, ward]
      )
      if (existingRows[0]) return fillMissingCoordinates(existingRows[0], latitude, longitude)
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
