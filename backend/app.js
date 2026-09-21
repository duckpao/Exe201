require('dotenv').config()

const cookieParser = require('cookie-parser')
const cors = require('cors')
const express = require('express')
const authRoutes = require('./src/routes/authRoutes')
const healthRoutes = require('./src/routes/healthRoutes')
const taskRoutes = require('./src/routes/taskRoutes')

const app = express()

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }))
app.use(express.json())
app.use(cookieParser())
app.use('/api/health', healthRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/auth', authRoutes)

app.use((request, response) => {
  response.status(404).json({ message: 'Không tìm thấy endpoint' })
})

module.exports = app
