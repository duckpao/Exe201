const { Server } = require('socket.io')
const { parse: parseCookie } = require('cookie')
const { verifyAuthToken } = require('../utils/token')
const conversationModel = require('../models/conversationModel')
const messagingService = require('../services/messagingService')
const userModel = require('../models/userModel')

const COOKIE_NAME = process.env.COOKIE_NAME || 'auth_token'
const configuredOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)
const allowedOrigins = [...new Set([...configuredOrigins, 'http://localhost:5173', 'http://localhost:5174'])]

let io = null

function initSocket(server) {
  io = new Server(server, {
    cors: { origin: allowedOrigins, credentials: true },
  })

  io.use(async (socket, next) => {
    const rawCookie = socket.handshake.headers.cookie
    if (!rawCookie) {
      return next(new Error('Chưa đăng nhập'))
    }

    const cookies = parseCookie(rawCookie)
    const token = cookies[COOKIE_NAME]
    if (!token) {
      return next(new Error('Chưa đăng nhập'))
    }

    try {
      const tokenUser = verifyAuthToken(token)
      const user = await userModel.findById(tokenUser.id)
      if (!user || user.status === 'locked') {
        return next(new Error('Tài khoản không còn được phép truy cập'))
      }
      socket.user = { id: user.id, email: user.email, role: user.role }
      next()
    } catch (error) {
      next(new Error('Phiên đăng nhập không hợp lệ hoặc đã hết hạn'))
    }
  })

  io.on('connection', (socket) => {
    socket.on('conversation:join', async (conversationId) => {
      try {
        const allowed = await conversationModel.isParticipant(conversationId, socket.user.id)
        if (allowed) {
          socket.join(`conv:${conversationId}`)
        }
      } catch (error) {
        socket.emit('message:error', { message: 'Không thể tham gia cuộc trò chuyện' })
      }
    })

    socket.on('message:send', async ({ conversationId, body } = {}, acknowledge) => {
      try {
        await messagingService.sendMessage({ conversationId, senderId: socket.user.id, body, io })
        acknowledge?.({ ok: true })
      } catch (error) {
        const payload = { message: error.message }
        acknowledge?.({ ok: false, ...payload })
        socket.emit('message:error', payload)
      }
    })
  })

  return io
}

function getIO() {
  return io
}

module.exports = { initSocket, getIO }
