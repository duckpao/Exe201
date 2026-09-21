const { OAuth2Client } = require('google-auth-library')

const userModel = require('../models/userModel')
const passwordResetModel = require('../models/passwordResetModel')
const { hashPassword, comparePassword } = require('../utils/password')
const { signAuthToken, generateResetToken, hashResetToken } = require('../utils/token')
const { sendMail } = require('../config/mailer')

const COOKIE_NAME = process.env.COOKIE_NAME || 'auth_token'
const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000
const RESET_TOKEN_EXPIRES_MIN = Number(process.env.RESET_TOKEN_EXPIRES_MIN) || 30

const googleClient = process.env.GOOGLE_CLIENT_ID ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID) : null

function sanitizeUser(user) {
  if (!user) return null
  const { password_hash, ...safeUser } = user
  return safeUser
}

function setAuthCookie(response, token) {
  response.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE_MS,
  })
}

async function register(request, response) {
  const { fullName, email, phone, password } = request.body || {}

  if (!fullName || !email || !password) {
    return response.status(400).json({ message: 'Vui lòng nhập họ tên, email và mật khẩu' })
  }

  const existingUser = await userModel.findByEmail(email)
  if (existingUser) {
    return response.status(409).json({ message: 'Email này đã được sử dụng' })
  }

  const passwordHash = await hashPassword(password)
  const user = await userModel.createUser({ fullName, email, phone, passwordHash })

  const token = signAuthToken({ id: user.id, email: user.email, role: user.role })
  setAuthCookie(response, token)

  response.status(201).json({ user: sanitizeUser(user) })
}

async function login(request, response) {
  const { email, password } = request.body || {}

  if (!email || !password) {
    return response.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' })
  }

  const user = await userModel.findByEmail(email)
  if (!user) {
    return response.status(401).json({ message: 'Email hoặc mật khẩu không đúng' })
  }

  if (!user.password_hash) {
    return response.status(400).json({ message: 'Tài khoản này chỉ đăng nhập bằng Google' })
  }

  if (user.status === 'locked') {
    return response.status(403).json({ message: 'Tài khoản của bạn đã bị khoá' })
  }

  const isPasswordValid = await comparePassword(password, user.password_hash)
  if (!isPasswordValid) {
    return response.status(401).json({ message: 'Email hoặc mật khẩu không đúng' })
  }

  const token = signAuthToken({ id: user.id, email: user.email, role: user.role })
  setAuthCookie(response, token)

  response.json({ user: sanitizeUser(user) })
}

async function googleLogin(request, response) {
  if (!googleClient) {
    return response.status(501).json({
      message: 'Đăng nhập Google chưa được cấu hình. Vui lòng thêm GOOGLE_CLIENT_ID vào backend/.env',
    })
  }

  const { idToken } = request.body || {}
  if (!idToken) {
    return response.status(400).json({ message: 'Thiếu idToken' })
  }

  let payload
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    payload = ticket.getPayload()
  } catch (error) {
    return response.status(401).json({ message: 'idToken của Google không hợp lệ' })
  }

  const providerUid = payload.sub
  const existingOauth = await userModel.findOauthAccount('google', providerUid)

  let user
  if (existingOauth) {
    user = await userModel.findById(existingOauth.user_id)
  } else {
    user = await userModel.createUserWithGoogle({
      fullName: payload.name || payload.email,
      email: payload.email,
      providerUid,
      providerEmail: payload.email,
      avatarUrl: payload.picture || null,
    })
  }

  const token = signAuthToken({ id: user.id, email: user.email, role: user.role })
  setAuthCookie(response, token)

  response.json({ user: sanitizeUser(user) })
}

async function forgotPassword(request, response) {
  const { email } = request.body || {}
  const genericMessage = 'Nếu email tồn tại trong hệ thống, chúng tôi đã gửi link đặt lại mật khẩu.'

  if (!email) {
    return response.status(400).json({ message: 'Vui lòng nhập email' })
  }

  const user = await userModel.findByEmail(email)
  if (user) {
    const { rawToken, tokenHash } = generateResetToken()
    const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRES_MIN * 60 * 1000)

    await passwordResetModel.invalidateActiveTokensForUser(user.id)
    await passwordResetModel.createToken({ userId: user.id, tokenHash, expiresAt })

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`

    try {
      await sendMail({
        to: user.email,
        subject: 'Đặt lại mật khẩu RentMate Hola',
        html: `<p>Xin chào ${user.full_name},</p>
               <p>Nhấn vào link sau để đặt lại mật khẩu (hết hạn sau ${RESET_TOKEN_EXPIRES_MIN} phút):</p>
               <p><a href="${resetUrl}">${resetUrl}</a></p>
               <p>Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>`,
      })
    } catch (error) {
      console.error('Gửi email đặt lại mật khẩu thất bại:', error.message)
    }
  }

  response.json({ message: genericMessage })
}

async function resetPassword(request, response) {
  const { token, newPassword } = request.body || {}

  if (!token || !newPassword) {
    return response.status(400).json({ message: 'Thiếu token hoặc mật khẩu mới' })
  }

  const tokenHash = hashResetToken(token)
  const resetToken = await passwordResetModel.findValidTokenByHash(tokenHash)

  if (!resetToken) {
    return response.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn' })
  }

  const passwordHash = await hashPassword(newPassword)
  await userModel.updatePasswordById(resetToken.user_id, passwordHash)
  await passwordResetModel.markUsed(resetToken.id)
  await passwordResetModel.invalidateActiveTokensForUser(resetToken.user_id)

  response.json({ message: 'Đặt lại mật khẩu thành công, vui lòng đăng nhập lại' })
}

function logout(request, response) {
  response.clearCookie(COOKIE_NAME)
  response.json({ message: 'Đã đăng xuất' })
}

async function me(request, response) {
  const user = await userModel.findById(request.user.id)
  if (!user) {
    return response.status(404).json({ message: 'Không tìm thấy người dùng' })
  }
  response.json({ user: sanitizeUser(user) })
}

module.exports = { register, login, googleLogin, forgotPassword, resetPassword, logout, me }
