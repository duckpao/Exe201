// Chỉ nhận đường dẫn nội bộ để returnTo không thành open redirect.
export function safeReturnPath(value, fallback = null) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return fallback
  return value
}
