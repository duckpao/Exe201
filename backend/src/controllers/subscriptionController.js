const subscriptionModel = require('../models/subscriptionModel')
const paymentModel = require('../models/paymentModel')
const listingSummaryModel = require('../models/listingSummaryModel')
const viewModel = require('../models/viewModel')
const pool = require('../config/db')
const payosService = require('../services/payosService')
const { notifyUser } = require('../services/notifyService')
const { PLANS, TIER_LABELS, CYCLE_LABELS, BASIC_BOOST_LIMIT, getPlan } = require('../config/plans')

const REMINDER_DAYS = 3

function toPlan(plan) {
  const monthly = PLANS[`${plan.tier}_monthly`]
  return {
    code: plan.code,
    tier: plan.tier,
    tierLabel: TIER_LABELS[plan.tier],
    cycle: plan.cycle,
    months: plan.months,
    price: plan.price,
    // Số tiền tiết kiệm so với trả theo tháng cho cùng số tháng; null với gói tháng.
    savings: plan.cycle === 'yearly' ? monthly.price * plan.months - plan.price : null,
  }
}

function toPeriod(row) {
  return {
    id: row.id,
    tier: row.tier,
    tierLabel: TIER_LABELS[row.tier],
    cycle: row.cycle,
    startsAt: row.starts_at,
    expiresAt: row.expires_at,
    source: row.source,
  }
}

function formatDate(value) {
  return new Date(value).toLocaleDateString('vi-VN')
}

async function listPlans(request, response) {
  response.json({ data: Object.values(PLANS).map(toPlan), basicBoostLimit: BASIC_BOOST_LIMIT })
}

// Nhắc một lần khi gói sắp hết hạn và chưa có gói nối tiếp. Chạy khi người dùng mở trang gói,
// vì máy chủ có thể ngủ nên không dựa vào lịch chạy nền.
async function sendReminderIfDue(userId, periods) {
  const current = periods.find((row) => new Date(row.starts_at) <= new Date())
  if (!current || current.reminder_sent_at) return
  const hasNext = periods.some((row) => new Date(row.starts_at) >= new Date(current.expires_at))
  const daysLeft = (new Date(current.expires_at) - Date.now()) / 86400000
  if (hasNext || daysLeft > REMINDER_DAYS) return

  await subscriptionModel.markReminderSent(current.id)
  await notifyUser({
    userId,
    type: 'subscription',
    title: `Gói ${TIER_LABELS[current.tier]} sẽ hết hạn vào ${formatDate(current.expires_at)}`,
    body: 'Gia hạn tại mục Gói đăng ký để giữ badge và vị trí bài đăng.',
    emailSubject: 'Gói đăng ký RentMate Hola sắp hết hạn',
  })
}

async function getMine(request, response) {
  const periods = await subscriptionModel.listCurrentAndQueued(request.user.id)
  await sendReminderIfDue(request.user.id, periods)

  const now = new Date()
  const current = periods.find((row) => new Date(row.starts_at) <= now) || null
  const queued = periods.filter((row) => new Date(row.starts_at) > now)
  const last = periods[periods.length - 1] || null

  response.json({
    current: current ? toPeriod(current) : null,
    queued: queued.map(toPeriod),
    // Khi còn hạn chỉ được mua tiếp cùng hạng; null nghĩa là mua hạng nào cũng được.
    lockedTier: last ? last.tier : null,
    renewableFrom: last ? last.expires_at : null,
  })
}

async function checkout(request, response) {
  const plan = getPlan(request.body?.planCode)
  if (!plan) return response.status(400).json({ message: 'Gói đăng ký không hợp lệ' })

  const periods = await subscriptionModel.listCurrentAndQueued(request.user.id)
  const last = periods[periods.length - 1]
  if (last && last.tier !== plan.tier) {
    return response.status(400).json({
      message: `Bạn đang dùng gói ${TIER_LABELS[last.tier]} đến ${formatDate(last.expires_at)}. Hãy chờ hết hạn để mua gói ${TIER_LABELS[plan.tier]}, hoặc gia hạn cùng hạng.`,
    })
  }

  const returnBase = new URL(process.env.PAYOS_RETURN_URL || 'http://localhost:5173').origin
  const orderCode = Date.now()
  const paymentLink = await payosService.createPaymentLink({
    orderCode,
    amount: plan.price,
    description: `SUB${request.user.id}`.slice(0, 9),
    itemName: `Gói ${TIER_LABELS[plan.tier]} theo ${CYCLE_LABELS[plan.cycle]} RentMate Hola`,
    returnUrl: `${returnBase}/goi-dang-ky`,
    cancelUrl: `${returnBase}/goi-dang-ky?cancel=true`,
  })

  await paymentModel.createPending({
    userId: request.user.id,
    txnRef: `PAYOS${orderCode}`,
    amount: plan.price,
    provider: 'payos',
    orderCode,
    paymentLinkId: paymentLink.paymentLinkId,
    purpose: 'subscription',
    planCode: plan.code,
  })

  response.status(201).json({
    orderCode,
    amount: plan.price,
    checkoutUrl: paymentLink.checkoutUrl,
    qrCode: paymentLink.qrCode,
    paymentLinkId: paymentLink.paymentLinkId,
    returnUrl: `${returnBase}/goi-dang-ky`,
    plan: toPlan(plan),
  })
}

async function getStats(request, response) {
  const active = await subscriptionModel.getActive(request.user.id)
  if (!active || active.tier !== 'pro') {
    return response.status(403).json({ message: 'Thống kê chỉ dành cho gói Nâng cao' })
  }

  const listings = await listingSummaryModel.findSummariesByOwner(request.user.id)
  const idsByType = {}
  for (const item of listings) (idsByType[item.type] ||= []).push(item.id)

  const [viewMaps, [conversationRows]] = await Promise.all([
    Promise.all(Object.entries(idsByType).map(async ([type, ids]) => [type, await viewModel.viewsLast30Days(type, ids)])),
    pool.query('SELECT listing_type, listing_id, COUNT(*) AS total FROM conversations WHERE owner_id = ? GROUP BY listing_type, listing_id', [request.user.id]),
  ])
  const views = Object.fromEntries(viewMaps)
  const conversations = new Map(conversationRows.map((row) => [`${row.listing_type}:${row.listing_id}`, Number(row.total)]))

  const data = listings
    .map((item) => ({
      type: item.type,
      id: item.id,
      title: item.title,
      label: item.label,
      path: item.path,
      views30d: views[item.type]?.get(item.id) || 0,
      conversations: conversations.get(`${item.type}:${item.id}`) || 0,
    }))
    .sort((a, b) => b.views30d - a.views30d || b.conversations - a.conversations)

  response.json({
    data,
    totals: {
      views30d: data.reduce((sum, item) => sum + item.views30d, 0),
      conversations: data.reduce((sum, item) => sum + item.conversations, 0),
    },
  })
}

module.exports = { listPlans, getMine, checkout, getStats }
