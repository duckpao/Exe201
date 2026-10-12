const adminUserModel = require('../models/adminUserModel')
const { parsePagination, buildPagination } = require('../utils/pagination')

const ROLES = ['tenant', 'landlord', 'admin']
const STATUSES = ['active', 'locked']

async function getOverview(request, response) {
  response.json(await adminUserModel.getOverview())
}

async function listUsers(request, response) {
  const { role, status } = request.query
  if ((role && !ROLES.includes(role)) || (status && !STATUSES.includes(status))) {
    return response.status(400).json({ message: 'Bộ lọc không hợp lệ' })
  }
  const { page, limit, offset } = parsePagination(request.query, 20)
  const keyword = String(request.query.keyword || '').trim() || null

  const { rows, total } = await adminUserModel.listUsers({ keyword, role: role || null, status: status || null, limit, offset })
  response.json({ data: rows, pagination: buildPagination({ page, limit, total }) })
}

async function updateUser(request, response) {
  const id = Number(request.params.id)
  if (!Number.isInteger(id) || id <= 0) {
    return response.status(400).json({ message: 'ID không hợp lệ' })
  }

  const { role, status } = request.body || {}
  if (role === undefined && status === undefined) {
    return response.status(400).json({ message: 'Không có thông tin nào để cập nhật' })
  }
  if ((role !== undefined && !ROLES.includes(role)) || (status !== undefined && !STATUSES.includes(status))) {
    return response.status(400).json({ message: 'Vai trò hoặc trạng thái không hợp lệ' })
  }

  // Chặn admin tự khóa / tự hạ quyền để không làm mất quyền quản trị cuối cùng.
  if (id === request.user.id && (status === 'locked' || (role !== undefined && role !== 'admin'))) {
    return response.status(400).json({ message: 'Bạn không thể tự khóa hoặc hạ quyền tài khoản của chính mình' })
  }

  const user = await adminUserModel.findUser(id)
  if (!user) {
    return response.status(404).json({ message: 'Không tìm thấy người dùng' })
  }

  const updated = await adminUserModel.updateUser(id, { role, status })
  response.json({ user: updated })
}

module.exports = { getOverview, listUsers, updateUser }
