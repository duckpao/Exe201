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

function requireRole(...roles) {
  return function (request, response, next) {
    if (!roles.includes(request.user?.role)) {
      return response.status(403).json({ message: 'Bạn không có quyền thực hiện hành động này' })
    }
    next()
  }
}

module.exports = { requireAuth, requireRole }
