const PROPERTY_TYPE_LABELS = {
  phong_tro: 'Phòng trọ',
  chung_cu_mini: 'Chung cư mini',
  nha_nguyen_can: 'Nhà nguyên căn',
}

const PROPERTY_TYPE_SLUGS = Object.fromEntries(
  Object.entries(PROPERTY_TYPE_LABELS).map(([slug, label]) => [label, slug])
)

function normalizePropertyType(value) {
  if (!value) return null
  if (PROPERTY_TYPE_LABELS[value]) return value
  return PROPERTY_TYPE_SLUGS[value] || null
}

function propertyTypeLabel(slug) {
  return PROPERTY_TYPE_LABELS[slug] || slug
}

const GENDER_LABELS = {
  male: 'Nam',
  female: 'Nữ',
  any: 'Không yêu cầu',
}

const GENDER_SLUGS = Object.fromEntries(
  Object.entries(GENDER_LABELS).map(([slug, label]) => [label, slug])
)

function normalizeGender(value) {
  if (!value) return null
  if (GENDER_LABELS[value]) return value
  return GENDER_SLUGS[value] || null
}

function genderLabel(slug) {
  return GENDER_LABELS[slug] || slug
}

const PASS_ROOM_STATUS_LABELS = {
  active: 'Còn trống',
  urgent: 'Cần pass gấp',
  completed: 'Đã pass xong',
  cancelled: 'Đã huỷ',
  pending: 'Đang chờ duyệt',
}

const ITEM_STATUS_LABELS = {
  available: 'Còn hàng',
  urgent: 'Cần bán gấp',
  sold: 'Đã bán',
  pending: 'Đang chờ duyệt',
}

module.exports = {
  PROPERTY_TYPE_LABELS,
  normalizePropertyType,
  propertyTypeLabel,
  GENDER_LABELS,
  normalizeGender,
  genderLabel,
  PASS_ROOM_STATUS_LABELS,
  ITEM_STATUS_LABELS,
}
