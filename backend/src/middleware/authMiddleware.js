const { verifyAuthToken } = require('../utils/token')

function requireAuth(request, response, next) {
  const cookieName = process.env.COOKIE_NAME || 'auth_token'
  const token = request.cookies?.[cookieName]

  if (!token) {
    return response.status(401).json({ message: 'Chưa đăng nhập' })
  }

  try {
    request.user = verifyAuthToken(token)
    next()
  } catch (error) {
    return response.status(401).json({ message: 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn' })
  }
}

module.exports = { requireAuth }
