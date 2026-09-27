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

const app = express()

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }))
app.use(express.json())
app.use(cookieParser())
app.use('/api/health', healthRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/rooms', roomRoutes)
app.use('/api/roommates', roommateRoutes)
app.use('/api/pass-phong', passRoomRoutes)
app.use('/api/pass-do', itemRoutes)
app.use('/api/transport', vehicleRoutes)

app.use((request, response) => {
  response.status(404).json({ message: 'Không tìm thấy endpoint' })
})

app.use((error, request, response, next) => {
  console.error(error)
  response.status(error.http_code || 500).json({ message: error.message || 'Đã có lỗi xảy ra, vui lòng thử lại' })
})

module.exports = app
