// Số di động/cố định Việt Nam: 10 chữ số, bắt đầu bằng 0. Bỏ khoảng trắng, dấu chấm, gạch
// ngang người dùng hay gõ; chuỗi rỗng nghĩa là không nhập (số điện thoại là tùy chọn).
function normalizeVnPhone(value) {
  const compact = String(value ?? '').replace(/[\s.\-()]/g, '')
  if (!compact) return { value: null }
  if (!/^0\d{9}$/.test(compact)) return { error: 'Số điện thoại phải gồm 10 chữ số và bắt đầu bằng 0' }
  return { value: compact }
}

module.exports = { normalizeVnPhone }
