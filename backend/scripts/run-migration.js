// Chạy một file migration lên database đang cấu hình trong backend/.env (Aiven hoặc local).
// Dùng: node scripts/run-migration.js migrations/009_subscriptions.sql
require('dotenv').config()
const fs = require('fs')
const path = require('path')
const mysql = require('mysql2/promise')

async function main() {
  const file = process.argv[2]
  if (!file) throw new Error('Thiếu đường dẫn file migration')

  const useAiven = process.env.DB_PROVIDER === 'aiven'
  const connection = await mysql.createConnection({
    host: useAiven ? process.env.AIVEN_HOST : process.env.DB_HOST,
    port: Number(useAiven ? process.env.AIVEN_PORT : process.env.DB_PORT),
    user: useAiven ? process.env.AIVEN_USER : process.env.DB_USER,
    password: useAiven ? process.env.AIVEN_PASSWORD : process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true,
    ssl: useAiven
      ? { rejectUnauthorized: true, ca: fs.readFileSync(path.resolve(process.env.DB_SSL_CA_PATH)) }
      : undefined,
  })

  try {
    await connection.query(fs.readFileSync(path.resolve(file), 'utf8'))
    console.log(`Đã chạy ${file} trên ${useAiven ? 'Aiven' : 'database local'}`)
  } finally {
    await connection.end()
  }
}

main().catch((error) => {
  console.error('Lỗi:', error.message)
  process.exit(1)
})
