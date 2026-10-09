require('dotenv').config()

const cookieParser = require('cookie-parser')
const cors = require('cors')
const express = require('express')
const authRoutes = require('./src/routes/authRoutes')
const healthRoutes = require('./src/routes/healthRoutes')
const roomRoutes = require('./src/routes/roomRoutes')
const roommateRoutes = require('./src/routes/roommateRoutes')
const passRoomRoutes = require('./src/routes/passRoomRoutes')
const itemRoutes = require('./src/routes/itemRoutes')
const vehicleRoutes = require('./src/routes/vehicleRoutes')
const conversationRoutes = require('./src/routes/conversationRoutes')
const userRoutes = require('./src/routes/userRoutes')
const favoriteRoutes = require('./src/routes/favoriteRoutes')
const mapRoutes = require('./src/routes/mapRoutes')
const paymentRoutes = require('./src/routes/paymentRoutes')

const app = express()
app.set('trust proxy', 1)

const configuredOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)
const allowedOrigins = [...new Set([...configuredOrigins, 'http://localhost:5173', 'http://localhost:5174'])]

app.use(cors({ origin: allowedOrigins, credentials: true }))
app.use(express.json())
app.use(cookieParser())
app.use('/api/health', healthRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/rooms', roomRoutes)
app.use('/api/roommates', roommateRoutes)
app.use('/api/pass-phong', passRoomRoutes)
app.use('/api/pass-do', itemRoutes)
app.use('/api/transport', vehicleRoutes)
app.use('/api/conversations', conversationRoutes)
app.use('/api/users', userRoutes)
app.use('/api/favorites', favoriteRoutes)
app.use('/api/maps', mapRoutes)
app.use('/api/payments', paymentRoutes)

app.use((request, response) => {
  response.status(404).json({ message: 'Không tìm thấy endpoint' })
})

app.use((error, request, response, next) => {
  console.error(error)
  response.status(error.http_code || 500).json({ message: error.message || 'Đã có lỗi xảy ra, vui lòng thử lại' })
})

module.exports = app
