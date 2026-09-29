const pool = require('../config/db')
const { getListingType } = require('../models/listingRegistry')
const listingSummaryModel = require('../models/listingSummaryModel')

// favorites.(entity_type, entity_id) là quan hệ đa hình trỏ tới 5 bảng bài đăng
// nên không có FOREIGN KEY; mọi validate loại bài đăng đều qua listingRegistry.
function parseTarget(type, id) {
  const config = getListingType(type)
  const entityId = Number(id)
  if (!config || !Number.isInteger(entityId) || entityId <= 0) return null
  return { config, entityId }
}

async function addFavorite(req, res) {
  const target = parseTarget(req.body.entityType, req.body.entityId)
  if (!target) {
    return res.status(400).json({ message: 'Loại bài đăng hoặc ID không hợp lệ' })
  }

  const { config, entityId } = target
  try {
    // Không có FK nên phải tự kiểm tra bài đăng tồn tại, tránh lưu bản ghi mồ côi.
    const [rows] = await pool.query(
      `SELECT id FROM ${config.table} WHERE id = ? AND deleted_at IS NULL LIMIT 1`,
      [entityId]
    )
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy bài đăng' })
    }

    await pool.query(
      'INSERT IGNORE INTO favorites (user_id, entity_type, entity_id) VALUES (?, ?, ?)',
      [req.user.id, req.body.entityType, entityId]
    )
    res.status(201).json({ message: 'Đã lưu vào danh sách yêu thích' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Lỗi server' })
  }
}

async function removeFavorite(req, res) {
  const target = parseTarget(req.params.entityType, req.params.entityId)
  if (!target) {
    return res.status(400).json({ message: 'Loại bài đăng hoặc ID không hợp lệ' })
  }

  try {
    await pool.query('DELETE FROM favorites WHERE user_id = ? AND entity_type = ? AND entity_id = ?', [
      req.user.id,
      req.params.entityType,
      target.entityId,
    ])
    res.json({ message: 'Đã bỏ yêu thích' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Lỗi server' })
  }
}

async function listFavorites(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT id, entity_type, entity_id, created_at FROM favorites WHERE user_id = ? ORDER BY created_at DESC, id DESC',
      [req.user.id]
    )

    const idsByType = rows.reduce((acc, row) => {
      acc[row.entity_type] = acc[row.entity_type] || []
      acc[row.entity_type].push(row.entity_id)
      return acc
    }, {})
    const summaries = await listingSummaryModel.findSummariesByIds(idsByType)

    // Bài đăng đã bị xóa vẫn giữ lại dòng favorite (listing: null) để người dùng
    // thấy và tự bỏ lưu, thay vì biến mất im lặng khiến số lượng không khớp.
    res.json({
      data: rows.map((row) => ({
        id: row.id,
        entityType: row.entity_type,
        entityId: row.entity_id,
        createdAt: row.created_at,
        listing: summaries.get(`${row.entity_type}:${row.entity_id}`) || null,
      })),
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Lỗi server' })
  }
}

async function checkFavorite(req, res) {
  const target = parseTarget(req.params.entityType, req.params.entityId)
  if (!target) {
    return res.status(400).json({ message: 'Loại bài đăng hoặc ID không hợp lệ' })
  }

  try {
    const [rows] = await pool.query(
      'SELECT id FROM favorites WHERE user_id = ? AND entity_type = ? AND entity_id = ? LIMIT 1',
      [req.user.id, req.params.entityType, target.entityId]
    )
    res.json({ isFavorite: rows.length > 0 })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Lỗi server' })
  }
}

module.exports = { addFavorite, removeFavorite, listFavorites, checkFavorite }
