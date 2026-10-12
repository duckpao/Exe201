const adminListingModel = require('../models/adminListingModel')
const notificationModel = require('../models/notificationModel')
const userModel = require('../models/userModel')
const { getListingType, LISTING_TYPE_KEYS } = require('../models/listingRegistry')
const { sendMail } = require('../config/mailer')
const { escapeHtml } = require('../utils/html')
const { parsePagination, buildPagination } = require('../utils/pagination')

const MAX_REASON_LENGTH = 500

function parseTarget(request) {
  const { type } = request.params
  const id = Number(request.params.id)
  if (!getListingType(type) || !Number.isInteger(id) || id <= 0) return null
  return { type, id }
}

async function listListings(request, response) {
  const type = request.query.type || LISTING_TYPE_KEYS[0]
  if (!getListingType(type)) {
    return response.status(400).json({ message: 'Loại bài đăng không hợp lệ' })
  }
  const { page, limit, offset } = parsePagination(request.query, 20)
  const keyword = String(request.query.keyword || '').trim() || null

  const { rows, total } = await adminListingModel.list(type, { keyword, limit, offset })
  response.json({ data: rows, pagination: buildPagination({ page, limit, total }) })
}

// Thông báo trên website là kênh chính (luôn ghi được); email là kênh phụ và không được
// làm hỏng thao tác ẩn bài nếu SMTP lỗi.
async function notifyOwner({ ownerId, type, id, title, reason }) {
  const label = getListingType(type).label
  await notificationModel.create({
    userId: ownerId,
    type: 'listing_hidden',
    title: `Bài đăng "${title}" đã bị ẩn`,
    body: reason,
    listingType: type,
    listingId: id,
  })

  try {
    const owner = await userModel.findById(ownerId)
    if (!owner?.email) return
    await sendMail({
      to: owner.email,
      subject: `Ẩn ${label} của bạn trên RentMate Hola`,
      html: `<p>Xin chào ${escapeHtml(owner.full_name)},</p>
             <p>Bài đăng &quot;${escapeHtml(title)}&quot; của bạn đã bị quản trị viên ẩn khỏi website với lý do:</p>
             <p style="padding:12px;background:#f5f5f5;border-radius:8px">${escapeHtml(reason)}</p>
             <p>Bạn có thể chỉnh sửa bài đăng trong mục Cài đặt &rarr; Bài đăng của tôi, sau đó liên hệ quản trị viên để được xem xét lại.</p>`,
    })
  } catch (error) {
    console.error('Gửi email thông báo ẩn bài thất bại:', error.message)
  }
}

async function hideListing(request, response) {
  const target = parseTarget(request)
  if (!target) {
    return response.status(400).json({ message: 'Loại bài đăng hoặc ID không hợp lệ' })
  }

  const reason = String(request.body?.reason ?? '').trim()
  if (!reason) {
    return response.status(400).json({ message: 'Vui lòng nhập lý do ẩn bài' })
  }
  if (reason.length > MAX_REASON_LENGTH) {
    return response.status(400).json({ message: `Lý do tối đa ${MAX_REASON_LENGTH} ký tự` })
  }

  const listing = await adminListingModel.findForModeration(target.type, target.id)
  if (!listing) {
    return response.status(404).json({ message: 'Không tìm thấy bài đăng' })
  }

  await adminListingModel.setHidden(target.type, target.id, reason)
  await notifyOwner({ ownerId: listing.owner_id, ...target, title: listing.title, reason })

  response.json({ message: 'Đã ẩn bài đăng và thông báo cho người đăng' })
}

async function unhideListing(request, response) {
  const target = parseTarget(request)
  if (!target) {
    return response.status(400).json({ message: 'Loại bài đăng hoặc ID không hợp lệ' })
  }

  const listing = await adminListingModel.findForModeration(target.type, target.id)
  if (!listing) {
    return response.status(404).json({ message: 'Không tìm thấy bài đăng' })
  }

  await adminListingModel.setHidden(target.type, target.id, null)
  await notificationModel.create({
    userId: listing.owner_id,
    type: 'listing_unhidden',
    title: `Bài đăng "${listing.title}" đã được hiển thị lại`,
    listingType: target.type,
    listingId: target.id,
  })

  response.json({ message: 'Đã hiển thị lại bài đăng' })
}

module.exports = { listListings, hideListing, unhideListing }
