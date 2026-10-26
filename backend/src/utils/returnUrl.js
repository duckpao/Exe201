// Script nhúng của payOS ghép returnUrl vào địa chỉ iframe mà không mã hóa, nên returnUrl phải là
// địa chỉ thuần, không có query. Nơi quay về sau thanh toán do giao diện tự nhớ, không đi qua payOS.
function buildPayosUrls(pagePath) {
  const origin = new URL(process.env.PAYOS_RETURN_URL || 'http://localhost:5173').origin
  return { returnUrl: `${origin}${pagePath}`, cancelUrl: `${origin}${pagePath}?cancel=true` }
}

module.exports = { buildPayosUrls }
