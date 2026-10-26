// Quản lý migration có ghi nhận phiên bản trong bảng schema_migrations.
//   node scripts/migrate.js status [--target=docker|aiven]   xem file nào đã/chưa áp (chỉ đọc)
//   node scripts/migrate.js up [--target=...]               áp các file còn thiếu theo thứ tự
//   node scripts/migrate.js baseline [--target=...] --yes   ghi nhận mọi file hiện có là đã áp, KHÔNG chạy SQL
// Không có --target thì dùng DB_PROVIDER trong backend/.env.
require('dotenv').config()
const fs = require('fs')
const path = require('path')
const mysql = require('mysql2/promise')

const MIGRATIONS_DIR = path.join(__dirname, '..', 'migrations')
const args = process.argv.slice(2)
const command = args.find((arg) => !arg.startsWith('--'))
const targetArg = (args.find((arg) => arg.startsWith('--target=')) || '').split('=')[1]
const target = targetArg || (process.env.DB_PROVIDER === 'aiven' ? 'aiven' : 'docker')

function connect() {
  if (target === 'aiven') {
    return mysql.createConnection({
      host: process.env.AIVEN_HOST,
      port: Number(process.env.AIVEN_PORT),
      user: process.env.AIVEN_USER,
      password: process.env.AIVEN_PASSWORD,
      database: process.env.DB_NAME,
      multipleStatements: true,
      ssl: { rejectUnauthorized: true, ca: fs.readFileSync(path.resolve(process.env.DB_SSL_CA_PATH)) },
    })
  }
  return mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true,
  })
}

const listFiles = () => fs.readdirSync(MIGRATIONS_DIR).filter((name) => name.endsWith('.sql')).sort()

async function readApplied(connection) {
  const [tables] = await connection.query("SHOW TABLES LIKE 'schema_migrations'")
  if (tables.length === 0) return { exists: false, applied: new Map() }
  const [rows] = await connection.query('SELECT filename, applied_at FROM schema_migrations')
  return { exists: true, applied: new Map(rows.map((row) => [row.filename, row.applied_at])) }
}

const ensureTable = (connection) =>
  connection.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
    filename   VARCHAR(190) NOT NULL PRIMARY KEY,
    applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`)

async function main() {
  if (!['status', 'up', 'baseline'].includes(command)) {
    throw new Error('Dùng: status | up | baseline  (kèm --target=docker hoặc --target=aiven)')
  }
  const connection = await connect()
  try {
    const files = listFiles()
    const { exists, applied } = await readApplied(connection)
    const pending = files.filter((file) => !applied.has(file))
    console.log(`Đích: ${target} | ${files.length} file migration | bảng schema_migrations: ${exists ? 'có' : 'chưa có'}`)

    if (command === 'status') {
      files.forEach((file) => console.log(`  ${applied.has(file) ? 'đã ghi nhận' : 'CHƯA ghi nhận'}  ${file}`))
      if (!exists) console.log('\nDatabase này chưa từng được ghi nhận. Nếu schema đã đủ, chạy: baseline --yes')
      return
    }

    if (command === 'baseline') {
      if (!args.includes('--yes')) throw new Error('baseline chỉ ghi nhận, không chạy SQL. Thêm --yes để xác nhận schema đã đủ.')
      await ensureTable(connection)
      for (const file of pending) await connection.query('INSERT INTO schema_migrations (filename) VALUES (?)', [file])
      console.log(`Đã ghi nhận ${pending.length} file (không chạy SQL).`)
      return
    }

    if (!exists && pending.length === files.length) {
      throw new Error('Database chưa có bản ghi nào. Nếu schema đã được áp tay trước đây, chạy baseline --yes trước, kẻo chạy lại migration cũ có thể lỗi.')
    }
    await ensureTable(connection)
    for (const file of pending) {
      await connection.query(fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8'))
      await connection.query('INSERT INTO schema_migrations (filename) VALUES (?)', [file])
      console.log(`  đã áp ${file}`)
    }
    console.log(pending.length ? `Xong ${pending.length} file.` : 'Không có migration nào còn thiếu.')
  } finally {
    await connection.end()
  }
}

main().catch((error) => {
  console.error('Lỗi:', error.message)
  process.exit(1)
})
