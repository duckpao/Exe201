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
  maxIdle: 10,
  idleTimeout: 60000,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  connectTimeout: 10000,
  dateStrings: true,
  charset: 'utf8mb4',
  ...(ssl ? { ssl } : {}),
})

async function queryWithRetry(sql, params = [], attempts = 2) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await pool.query(sql, params)
    } catch (error) {
      const retryable = ['PROTOCOL_CONNECTION_LOST', 'ECONNRESET', 'ETIMEDOUT'].includes(error.code)
      if (!retryable || attempt === attempts) throw error
    }
  }
}

module.exports = pool
module.exports.queryWithRetry = queryWithRetry
