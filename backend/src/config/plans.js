// Giá do máy chủ quyết định; client chỉ gửi planCode. Giá hiện là bộ tạm, chỉnh tại đây khi chốt.
const PLANS = {
  basic_monthly: { code: 'basic_monthly', tier: 'basic', cycle: 'monthly', months: 1, price: 49000 },
  basic_yearly: { code: 'basic_yearly', tier: 'basic', cycle: 'yearly', months: 12, price: 490000 },
  pro_monthly: { code: 'pro_monthly', tier: 'pro', cycle: 'monthly', months: 1, price: 99000 },
  pro_yearly: { code: 'pro_yearly', tier: 'pro', cycle: 'yearly', months: 12, price: 990000 },
}

const TIER_LABELS = { basic: 'Cơ bản', pro: 'Nâng cao' }
const CYCLE_LABELS = { monthly: 'tháng', yearly: 'năm' }

// Hạng Cơ bản chỉ có badge và được đẩy cho số bài mới nhất này (tính riêng từng loại bài).
const BASIC_BOOST_LIMIT = 5

function getPlan(code) {
  return PLANS[code] || null
}

module.exports = { PLANS, TIER_LABELS, CYCLE_LABELS, BASIC_BOOST_LIMIT, getPlan }
