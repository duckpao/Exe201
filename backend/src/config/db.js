const mysql = require('mysql2/promise')
const fs = require('fs')
const path = require('path')

const useAiven = process.env.DB_PROVIDER === 'aiven'
const sslSetting = process.env.DB_SSL?.toLowerCase()
const sslEnabled = sslSetting ? ['1', 'true', 'require'].includes(sslSetting) : useAiven
const sslCaPath = process.env.DB_SSL_CA_PATH

const ssl = sslEnabled
  ? {
      rejectUnauthorized: true,
      ...(sslCaPath ? { ca: fs.readFileSync(path.resolve(sslCaPath)) } : {}),
    }
  : undefined

const pool = mysql.createPool({
  host: (useAiven ? process.env.AIVEN_HOST : process.env.DB_HOST) || 'localhost',
  port: Number(useAiven ? process.env.AIVEN_PORT : process.env.DB_PORT) || 3306,
  database: process.env.DB_NAME || 'nhatro',
  user: (useAiven ? process.env.AIVEN_USER : process.env.DB_USER) || 'root',
  password: (useAiven ? process.env.AIVEN_PASSWORD : process.env.DB_PASSWORD) || '',
  waitForConnections: true,
  connectionLimit: 10,
  dateStrings: true,
  charset: 'utf8mb4',
  ...(ssl ? { ssl } : {}),
})

module.exports = pool
