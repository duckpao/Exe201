const pool = require('../config/db')
const { getPlan, BASIC_BOOST_LIMIT } = require('../config/plans')

const ACTIVE_SQL = 'revoked_at IS NULL AND starts_at <= NOW() AND expires_at > NOW()'

// member_rank: 0 = bài thường, 1 = Cơ bản tháng, 2 = Cơ bản năm, 3 = Nâng cao tháng, 4 = Nâng cao năm.
const RANK_TO_MEMBER = {
  1: { tier: 'basic', cycle: 'monthly' },
  2: { tier: 'basic', cycle: 'yearly' },
  3: { tier: 'pro', cycle: 'monthly' },
  4: { tier: 'pro', cycle: 'yearly' },
}

function memberFromRank(rank) {
  return RANK_TO_MEMBER[Number(rank)] || null
}

// Mảnh SQL dùng chung cho danh sách và chi tiết. config lấy từ listingRegistry (hằng số nội bộ),
// alias là bí danh bảng bài đăng trong câu truy vấn gọi.
// Hạng Cơ bản chỉ tính cho BASIC_BOOST_LIMIT bài mới nhất của người đó trong bảng này.
function buildMemberSql(config, alias) {
  const owner = `${alias}.${config.ownerColumn}`
  const newerPosts = `(SELECT COUNT(*) FROM ${config.table} nt
       WHERE nt.${config.ownerColumn} = ${owner} AND nt.deleted_at IS NULL
         AND (nt.created_at > ${alias}.created_at OR (nt.created_at = ${alias}.created_at AND nt.id > ${alias}.id)))`
  return {
    joinSql: `LEFT JOIN user_subscriptions ms ON ms.user_id = ${owner}
       AND ms.revoked_at IS NULL AND ms.starts_at <= NOW() AND ms.expires_at > NOW()`,
    selectSql: `CASE WHEN ms.id IS NULL THEN 0
         WHEN ms.tier = 'basic' AND ${newerPosts} >= ${BASIC_BOOST_LIMIT} THEN 0
         ELSE (CASE ms.tier WHEN 'pro' THEN 2 ELSE 0 END) + (ms.cycle = 'yearly') + 1 END AS member_rank`,
  }
}

async function getActive(userId) {
  const [rows] = await pool.query(
    `SELECT * FROM user_subscriptions WHERE user_id = ? AND ${ACTIVE_SQL} ORDER BY expires_at DESC LIMIT 1`,
    [userId]
  )
  return rows[0] || null
}

// Gói còn hiệu lực hoặc đã xếp hàng chờ (chưa hết hạn, chưa thu hồi), theo thứ tự thời gian.
async function listCurrentAndQueued(userId) {
  const [rows] = await pool.query(
    `SELECT * FROM user_subscriptions
     WHERE user_id = ? AND revoked_at IS NULL AND expires_at > NOW()
     ORDER BY starts_at ASC`,
    [userId]
  )
  return rows
}

// Thời điểm bắt đầu gói mới: ngay bây giờ, hoặc ngay sau gói còn hạn cuối cùng để cộng dồn.
async function nextStartAt(connection, userId) {
  const [[row]] = await connection.query(
    'SELECT MAX(expires_at) AS last_end FROM user_subscriptions WHERE user_id = ? AND revoked_at IS NULL AND expires_at > NOW()',
    [userId]
  )
  return row.last_end || null
}

async function insertPeriod({ userId, plan, source, paymentId = null, grantedBy = null }) {
  const connection = await pool.getConnection()
  try {
    await connection.beginTransaction()
    // Khóa các dòng của người này để hai lần mua đồng thời không tạo hai khoảng thời gian chồng nhau.
    await connection.query('SELECT id FROM user_subscriptions WHERE user_id = ? FOR UPDATE', [userId])
    const lastEnd = await nextStartAt(connection, userId)
    const [result] = await connection.query(
      `INSERT INTO user_subscriptions (user_id, tier, cycle, starts_at, expires_at, source, payment_id, granted_by)
       VALUES (?, ?, ?, COALESCE(?, NOW()), DATE_ADD(COALESCE(?, NOW()), INTERVAL ? MONTH), ?, ?, ?)`,
      [userId, plan.tier, plan.cycle, lastEnd, lastEnd, plan.months, source, paymentId, grantedBy]
    )
    await connection.commit()
    return result.insertId
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

// Webhook có thể gửi lại: payment_id unique nên lần hai không cộng thêm thời hạn.
async function activateFromPayment(payment) {
  const plan = getPlan(payment.plan_code)
  if (!plan) return null
  try {
    return await insertPeriod({ userId: payment.user_id, plan, source: 'payment', paymentId: payment.id })
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return null
    throw error
  }
}

async function grant({ userId, planCode, grantedBy }) {
  const plan = getPlan(planCode)
  if (!plan) return null
  return insertPeriod({ userId, plan, source: 'admin', grantedBy })
}

async function revoke(id) {
  const [result] = await pool.query(
    'UPDATE user_subscriptions SET revoked_at = NOW() WHERE id = ? AND revoked_at IS NULL',
    [id]
  )
  return result.affectedRows > 0
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM user_subscriptions WHERE id = ? LIMIT 1', [id])
  return rows[0] || null
}

async function listForAdmin({ onlyActive, limit, offset }) {
  const where = onlyActive ? `WHERE s.${ACTIVE_SQL.replace(/ AND /g, ' AND s.')}` : ''
  const [rows] = await pool.query(
    `SELECT s.*, u.full_name AS user_name, u.email AS user_email
     FROM user_subscriptions s JOIN users u ON u.id = s.user_id
     ${where}
     ORDER BY s.created_at DESC, s.id DESC LIMIT ? OFFSET ?`,
    [limit, offset]
  )
  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM user_subscriptions s ${where}`)
  return { rows, total }
}

async function markReminderSent(id) {
  await pool.query('UPDATE user_subscriptions SET reminder_sent_at = NOW() WHERE id = ?', [id])
}

module.exports = {
  memberFromRank,
  buildMemberSql,
  getActive,
  listCurrentAndQueued,
  activateFromPayment,
  grant,
  revoke,
  findById,
  listForAdmin,
  markReminderSent,
}
