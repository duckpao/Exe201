const pool = require('../config/db')
const { LISTING_TYPES, LISTING_TYPE_KEYS, getListingType } = require('./listingRegistry')
const { formatVnd } = require('../utils/format')

// Projection dùng chung cho "bài đăng của tôi" và "đã lưu": tiêu đề, giá đại diện,
// trạng thái và ảnh đại diện. Tên bảng/cột lấy từ listingRegistry (hằng số nội bộ,
// không phải input người dùng) nên nội suy vào SQL là an toàn; id luôn được ép Number.
//
// withEditable chỉ bật cho view của chính chủ: lấy thêm giá trị thô của các cột
// trong editableFields để form "sửa bài đăng" prefill được ngay, không cần request thứ hai.
function buildSelect(config, withEditable = false) {
  const editableColumns = withEditable
    ? Object.entries(config.editableFields).map(
        ([name, field]) => `, t.${field.column} AS \`editable__${name}\``
      )
    : []

  return `SELECT t.id,
            t.${config.titleColumn} AS title,
            ${config.priceColumn} AS price,
            t.status,
            t.created_at,
            (SELECT media_url FROM ${config.imageTable}
              WHERE ${config.imageForeignKey} = t.id
              ORDER BY is_primary DESC, id ASC
              LIMIT 1) AS image
            ${editableColumns.join('\n            ')}
          FROM ${config.table} t`
}

// Cột DECIMAL qua mysql2 trả về string nên phải ép Number, nếu không input number
// của form sẽ nhận "1800000.00" và hiện sai.
function toEditable(config, row) {
  return Object.entries(config.editableFields).reduce((acc, [name, field]) => {
    const value = row[`editable__${name}`]
    acc[name] = value == null ? '' : field.kind === 'money' ? Number(value) : value
    return acc
  }, {})
}

function toSummary(type, row, withEditable = false) {
  const config = LISTING_TYPES[type]
  const summary = {
    type,
    id: row.id,
    title: row.title,
    price: formatVnd(row.price, config.priceSuffix),
    status: row.status,
    image: row.image,
    createdAt: row.created_at,
    path: `${config.path}/${row.id}`,
    label: config.label,
  }

  if (!withEditable) return summary

  // fields + statusOptions đi kèm từng dòng để form sửa bài render generic theo loại,
  // khỏi phải lặp lại bản đồ 5 loại ở frontend (nguồn drift kinh điển).
  return {
    ...summary,
    editable: toEditable(config, row),
    fields: Object.entries(config.editableFields).map(([name, field]) => ({
      name,
      label: field.label,
      kind: field.kind,
      required: field.required === true,
    })),
    statusOptions: config.ownerStatusValues,
  }
}

function newestFirst(a, b) {
  return new Date(b.createdAt) - new Date(a.createdAt)
}

// idsByType: { room: [1, 2], item: [5] } -> Map khóa `${type}:${id}` => summary.
// Bài đăng đã soft-delete không trả về, để caller biết bản ghi đã mất.
async function findSummariesByIds(idsByType) {
  const found = new Map()

  await Promise.all(
    Object.entries(idsByType).map(async ([type, rawIds]) => {
      const config = getListingType(type)
      const ids = [...new Set(rawIds.map(Number).filter(Number.isInteger))]
      if (!config || ids.length === 0) return

      const placeholders = ids.map(() => '?').join(', ')
      const [rows] = await pool.query(
        `${buildSelect(config)} WHERE t.id IN (${placeholders}) AND t.deleted_at IS NULL`,
        ids
      )
      rows.forEach((row) => found.set(`${type}:${row.id}`, toSummary(type, row)))
    })
  )

  return found
}

// Toàn bộ bài đăng còn sống của một user, gồm cả pending/hidden vì đây là view của chính chủ.
async function findSummariesByOwner(userId) {
  const perType = await Promise.all(
    LISTING_TYPE_KEYS.map(async (type) => {
      const config = LISTING_TYPES[type]
      const [rows] = await pool.query(
        `${buildSelect(config, true)} WHERE t.${config.ownerColumn} = ? AND t.deleted_at IS NULL`,
        [userId]
      )
      return rows.map((row) => toSummary(type, row, true))
    })
  )

  return perType.flat().sort(newestFirst)
}

// Một bài đăng của chính chủ, dùng để trả về trạng thái mới sau khi PUT thành công.
async function findOwnedSummary(type, id, userId) {
  const config = getListingType(type)
  if (!config) return null

  const [rows] = await pool.query(
    `${buildSelect(config, true)} WHERE t.id = ? AND t.${config.ownerColumn} = ? AND t.deleted_at IS NULL`,
    [id, userId]
  )
  return rows.length > 0 ? toSummary(type, rows[0], true) : null
}

module.exports = { findSummariesByIds, findSummariesByOwner, findOwnedSummary }
