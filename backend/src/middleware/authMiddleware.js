const { verifyAuthToken } = require('../utils/token')
const userModel = require('../models/userModel')

async function requireAuth(request, response, next) {
  const cookieName = process.env.COOKIE_NAME || 'auth_token'
  const token = request.cookies?.[cookieName]

  if (!token) {
    return response.status(401).json({ message: 'Chưa đăng nhập' })
  }

  try {
    const tokenUser = verifyAuthToken(token)
    const user = await userModel.findById(tokenUser.id)
    if (!user || user.status === 'locked') {
      return response.status(401).json({ message: 'Tài khoản không còn được phép truy cập' })
    }
    request.user = { id: user.id, email: user.email, role: user.role }
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

  async function optionalAuth(request, response, next) {
    const cookieName = process.env.COOKIE_NAME || 'auth_token'
    const token = request.cookies?.[cookieName]
    if (!token) return next()

    try {
      const tokenUser = verifyAuthToken(token)
      const user = await userModel.findById(tokenUser.id)
      if (user && user.status !== 'locked') {
        request.user = { id: user.id, email: user.email, role: user.role }
      }
    } catch (error) {
      // Public detail pages remain usable when an old cookie is invalid.
    }
    next()
  }

  module.exports = { requireAuth, requireRole, optionalAuth }
