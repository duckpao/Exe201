const subscriptionModel = require('../models/subscriptionModel')
const userModel = require('../models/userModel')
const { notifyUser } = require('../services/notifyService')
const { getPlan, TIER_LABELS, CYCLE_LABELS } = require('../config/plans')
const { parsePagination, buildPagination } = require('../utils/pagination')

function toRow(row) {
  const now = new Date()
  const revoked = row.revoked_at != null
  const state = revoked ? 'revoked' : new Date(row.expires_at) <= now ? 'expired' : new Date(row.starts_at) > now ? 'queued' : 'active'
  return {
    id: row.id,
    user: { id: row.user_id, name: row.user_name, email: row.user_email },
    tier: row.tier,
    tierLabel: TIER_LABELS[row.tier],
    cycle: row.cycle,
    startsAt: row.starts_at,
    expiresAt: row.expires_at,
    source: row.source,
    state,
  }
}

async function listSubscriptions(request, response) {
  const { page, limit, offset } = parsePagination(request.query, 20)
  const onlyActive = request.query.active === 'true'
  const { rows, total } = await subscriptionModel.listForAdmin({ onlyActive, limit, offset })
  response.json({ data: rows.map(toRow), pagination: buildPagination({ page, limit, total }) })
}

async function grantSubscription(request, response) {
  const plan = getPlan(request.body?.planCode)
  if (!plan) return response.status(400).json({ message: 'Gói đăng ký không hợp lệ' })

  const email = String(request.body?.email || '').trim().toLowerCase()
  const user = email ? await userModel.findByEmail(email) : null
  if (!user) return response.status(404).json({ message: 'Không tìm thấy người dùng với email này' })

  const active = await subscriptionModel.listCurrentAndQueued(user.id)
  const last = active[active.length - 1]
  if (last && last.tier !== plan.tier) {
    return response.status(400).json({ message: `Người dùng đang có gói ${TIER_LABELS[last.tier]}. Hãy thu hồi gói đó trước khi cấp hạng khác.` })
  }

  await subscriptionModel.grant({ userId: user.id, planCode: plan.code, grantedBy: request.user.id })
  await notifyUser({
    userId: user.id,
    type: 'subscription',
    title: `Bạn được cấp gói ${TIER_LABELS[plan.tier]} theo ${CYCLE_LABELS[plan.cycle]}`,
    body: 'Quản trị viên đã cấp gói cho tài khoản của bạn. Xem thời hạn tại mục Gói đăng ký.',
    emailSubject: 'Bạn được cấp gói đăng ký RentMate Hola',
  })
  response.status(201).json({ message: 'Đã cấp gói đăng ký' })
}

async function revokeSubscription(request, response) {
  const id = Number(request.params.id)
  if (!Number.isInteger(id) || id <= 0) return response.status(400).json({ message: 'ID không hợp lệ' })

  const row = await subscriptionModel.findById(id)
  if (!row) return response.status(404).json({ message: 'Không tìm thấy gói đăng ký' })
  if (!(await subscriptionModel.revoke(id))) return response.status(400).json({ message: 'Gói này đã được thu hồi' })

  await notifyUser({
    userId: row.user_id,
    type: 'subscription',
    title: `Gói ${TIER_LABELS[row.tier]} của bạn đã bị thu hồi`,
    body: 'Liên hệ quản trị viên nếu bạn cần biết thêm lý do.',
    emailSubject: 'Gói đăng ký RentMate Hola đã bị thu hồi',
  })
  response.json({ message: 'Đã thu hồi gói đăng ký' })
}

module.exports = { listSubscriptions, grantSubscription, revokeSubscription }
