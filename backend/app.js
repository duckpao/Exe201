require('dotenv').config()

const cors = require('cors')
const express = require('express')
const healthRoutes = require('./src/routes/healthRoutes')
const taskRoutes = require('./src/routes/taskRoutes')

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/health', healthRoutes)
app.use('/api/tasks', taskRoutes)

app.use((request, response) => {
  response.status(404).json({ message: 'Không tìm thấy endpoint' })
})

module.exports = app
