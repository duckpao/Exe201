const notificationModel = require('../models/notificationModel')

function toNotification(row) {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    body: row.body,
    listingType: row.listing_type,
    listingId: row.listing_id,
    isRead: row.is_read === 1,
    createdAt: row.created_at,
  }
}

async function listNotifications(request, response) {
  const [rows, unreadCount] = await Promise.all([
    notificationModel.listForUser(request.user.id),
    notificationModel.countUnread(request.user.id),
  ])
  response.json({ data: rows.map(toNotification), unreadCount })
}

async function markRead(request, response) {
  const id = Number(request.params.id)
  if (!Number.isInteger(id) || id <= 0) {
    return response.status(400).json({ message: 'ID không hợp lệ' })
  }
  await notificationModel.markRead(request.user.id, id)
  response.json({ message: 'ok' })
}

async function markAllRead(request, response) {
  await notificationModel.markAllRead(request.user.id)
  response.json({ message: 'ok' })
}

module.exports = { listNotifications, markRead, markAllRead }
