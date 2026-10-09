const userModel = require('../models/userModel')
const bcrypt = require('bcryptjs')
const { uploadBuffer } = require('../utils/cloudinaryUpload')
const pool = require('../config/db')
const { getListingType } = require('../models/listingRegistry')
const listingSummaryModel = require('../models/listingSummaryModel')
const { parseVndAmount } = require('../utils/format')

async function updateProfile(request, response) {
  const { fullName, phone } = request.body
  const userId = request.user.id

  try {
    let avatarUrl = undefined
    if (request.file) {
      const result = await uploadBuffer(request.file.buffer, 'avatars')
      avatarUrl = result.url
    }

    const updates = []
    const params = []
    if (fullName !== undefined) {
      updates.push('full_name = ?')
      params.push(fullName)
    }
    if (phone !== undefined) {
      updates.push('phone = ?')
      params.push(phone)
    }
    if (avatarUrl !== undefined) {
      updates.push('avatar_url = ?')
      params.push(avatarUrl)
    }

    if (updates.length > 0) {
      params.push(userId)
      await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params)
    }

    const updatedUser = await userModel.findById(userId)
    response.json({
      message: 'Cập nhật thành công',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        full_name: updatedUser.full_name,
        avatar_url: updatedUser.avatar_url,
        phone: updatedUser.phone,
        role: updatedUser.role,
      }
    })
  } catch (error) {
    console.error(error)
    response.status(500).json({ message: 'Lỗi server' })
  }
}

async function changePassword(request, response) {
  const { oldPassword, newPassword } = request.body
  const userId = request.user.id

  try {
    if (typeof newPassword !== 'string' || newPassword.length < 8) {
      return response.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 8 ký tự' })
    }
    const user = await userModel.findById(userId)
    if (!user) return response.status(404).json({ message: 'User not found' })

    if (user.password_hash) {
      const isMatch = await bcrypt.compare(oldPassword, user.password_hash)
      if (!isMatch) return response.status(400).json({ message: 'Mật khẩu cũ không chính xác' })
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(newPassword, salt)

    await userModel.updatePasswordById(userId, hash)
    response.json({ message: 'Đổi mật khẩu thành công' })
  } catch (error) {
    console.error(error)
    response.status(500).json({ message: 'Lỗi server' })
  }
}

async function myListings(request, response) {
  try {
    const data = await listingSummaryModel.findSummariesByOwner(request.user.id)
    response.json({ data })
  } catch (error) {
    console.error(error)
    response.status(500).json({ message: 'Lỗi server' })
  }
}

// :type và :id là input người dùng nên luôn đi qua registry + Number trước khi
// tên bảng/cột được nội suy vào SQL.
function parseListingParams(request) {
  const config = getListingType(request.params.type)
  const id = Number(request.params.id)
  if (!config || !Number.isInteger(id) || id <= 0) return null
  return { config, id }
}

// audit_logs.changed_by đọc từ session var @app_user_id (xem comment trong database.sql).
// Biến này thuộc từng connection nên phải SET và chạy query trên CÙNG một connection
// lấy ra từ pool, nếu không trigger sẽ ghi NULL và không biết ai đã sửa/xóa bài.
async function queryAsUser(userId, sql, params) {
  const connection = await pool.getConnection()
  try {
    await connection.query('SET @app_user_id = ?', [userId])
    const [result] = await connection.query(sql, params)
    return result
  } finally {
    connection.release()
  }
}

async function deleteListing(request, response) {
  const target = parseListingParams(request)
  if (!target) {
    return response.status(400).json({ message: 'Loại bài đăng hoặc ID không hợp lệ' })
  }

  const { config, id } = target
  try {
    // Soft delete theo đúng quy ước của mọi model (đều filter deleted_at IS NULL).
    // DELETE thật sẽ để lại conversations mồ côi vì quan hệ đa hình không có FK để cascade.
    const result = await queryAsUser(
      request.user.id,
      `UPDATE ${config.table} SET deleted_at = NOW()
        WHERE id = ? AND ${config.ownerColumn} = ? AND deleted_at IS NULL`,
      [id, request.user.id]
    )

    if (result.affectedRows === 0) {
      return response
        .status(404)
        .json({ message: 'Không tìm thấy bài đăng hoặc bạn không có quyền xóa' })
    }
    response.json({ message: 'Đã xóa bài đăng thành công' })
  } catch (error) {
    console.error(error)
    response.status(500).json({ message: 'Lỗi server' })
  }
}

// Chỉ nhận các field có trong config.editableFields; field không gửi lên thì giữ nguyên
// (partial update). Trả { error } thay vì throw để controller map thẳng sang 400.
function buildListingUpdate(config, body) {
  const updates = []
  const params = []

  for (const [name, field] of Object.entries(config.editableFields)) {
    if (!(name in body)) continue

    if (field.kind === 'money') {
      const amount = parseVndAmount(body[name])
      if (amount === null && field.required) {
        return { error: `${field.label} không được để trống` }
      }
      if (amount !== null && amount < 0) {
        return { error: `${field.label} không hợp lệ` }
      }
      updates.push(`${field.column} = ?`)
      params.push(amount)
      continue
    }

    const text = body[name] === null || body[name] === undefined ? '' : String(body[name]).trim()
    if (!text && field.required) {
      return { error: `${field.label} không được để trống` }
    }
    updates.push(`${field.column} = ?`)
    params.push(text || null)
  }

  if ('status' in body) {
    // ownerStatusValues CỐ TÌNH không chứa available/active/urgent với item & pass_room —
    // hai loại này tạo ra ở trạng thái pending và phải qua kiểm duyệt, chủ bài không
    // được tự phê duyệt bài của mình bằng cách PUT status.
    if (!config.ownerStatusValues.includes(body.status)) {
      return {
        error: `Trạng thái không hợp lệ. Chỉ được chọn: ${config.ownerStatusValues.join(', ')}`,
      }
    }
    updates.push('status = ?')
    params.push(body.status)
  }

  if (updates.length === 0) return { error: 'Không có thông tin nào để cập nhật' }
  return { updates, params }
}

async function updateListing(request, response) {
  const target = parseListingParams(request)
  if (!target) {
    return response.status(400).json({ message: 'Loại bài đăng hoặc ID không hợp lệ' })
  }

  const { config, id } = target
  const update = buildListingUpdate(config, request.body || {})
  if (update.error) {
    return response.status(400).json({ message: update.error })
  }

  try {
    // Điều kiện ownerColumn nằm trong chính câu UPDATE nên không có khoảng trống
    // giữa lúc kiểm tra quyền và lúc ghi.
    const result = await queryAsUser(
      request.user.id,
      `UPDATE ${config.table} SET ${update.updates.join(', ')}
        WHERE id = ? AND ${config.ownerColumn} = ? AND deleted_at IS NULL`,
      [...update.params, id, request.user.id]
    )

    if (result.affectedRows === 0) {
      return response
        .status(404)
        .json({ message: 'Không tìm thấy bài đăng hoặc bạn không có quyền sửa' })
    }

    const listing = await listingSummaryModel.findOwnedSummary(
      request.params.type,
      id,
      request.user.id
    )
    response.json({ message: 'Đã cập nhật bài đăng', listing })
  } catch (error) {
    console.error(error)
    response.status(500).json({ message: 'Lỗi server' })
  }
}

module.exports = { updateProfile, changePassword, myListings, updateListing, deleteListing }
