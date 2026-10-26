// Chỉ nhận đường dẫn nội bộ để returnTo không thành open redirect.
export function safeReturnPath(value, fallback = null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return fallback
  return value
}

// payOS chuyển hướng cả trang khi thanh toán xong và làm mất state của React Router,
// nên nơi quay về được nhớ theo mã đơn hàng trong sessionStorage.
const KEY_PREFIX = 'payos-return:'

export function rememberReturnTo(orderCode, path) {
  try {
    if (path) sessionStorage.setItem(`${KEY_PREFIX}${orderCode}`, path)
  } catch {
    // Trình duyệt chặn sessionStorage: bỏ qua, người dùng vẫn ở lại trang hiện tại.
  }
}

export function recallReturnTo(orderCode, fallback = null) {
  try {
    return safeReturnPath(sessionStorage.getItem(`${KEY_PREFIX}${orderCode}`), fallback)
  } catch {
    return fallback
  }
}
