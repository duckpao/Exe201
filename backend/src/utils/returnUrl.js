// Chỉ nhận đường dẫn nội bộ để returnTo không thành open redirect.
function safeReturnPath(value) {
  const path = String(value || '')
  return path.startsWith('/') && !path.startsWith('//') && path.length <= 300 ? path : null
}

// payOS gọi lại đúng returnUrl/cancelUrl này, nên returnTo đi kèm để quay về màn hình trước khi thanh toán.
function buildPayosUrls(pagePath, returnTo) {
  const origin = new URL(process.env.PAYOS_RETURN_URL || 'http://localhost:5173').origin
  const safe = safeReturnPath(returnTo)
  const query = safe ? `?returnTo=${encodeURIComponent(safe)}` : ''
  const cancelQuery = safe ? `${query}&cancel=true` : '?cancel=true'
  return { returnUrl: `${origin}${pagePath}${query}`, cancelUrl: `${origin}${pagePath}${cancelQuery}` }
}

module.exports = { safeReturnPath, buildPayosUrls }
