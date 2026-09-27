const http = require('http')
const app = require('./app')
const { initSocket } = require('./src/realtime/socket')

const port = process.env.PORT || 3000
const server = http.createServer(app)
initSocket(server)

server.listen(port, () => {
  console.log(`API đang chạy tại http://localhost:${port}`)
})
