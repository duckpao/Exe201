const pool = require('../config/db')

async function getPostingAccess(userId) {
  const [[user]] = await pool.query(
    `SELECT id, created_at, DATE_ADD(created_at, INTERVAL 2 MONTH) AS free_until,
            NOW() < DATE_ADD(created_at, INTERVAL 2 MONTH) AS in_free_trial
     FROM users WHERE id = ? LIMIT 1`,
    [userId]
  )
  if (!user) return null
  const [[credit]] = await pool.query(
    `SELECT id, txn_ref, paid_at FROM listing_payments
     WHERE user_id = ? AND status = 'paid' AND consumed_at IS NULL
     ORDER BY paid_at ASC, id ASC LIMIT 1`,
    [userId]
  )
  return { user, credit: credit || null }
}

async function createPending({ userId, txnRef, amount, provider = 'payos', orderCode = null, paymentLinkId = null }) {
  await pool.query(
    `INSERT INTO listing_payments
       (user_id, txn_ref, amount, provider, provider_order_code, payment_link_id)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, txnRef, amount, provider, orderCode, paymentLinkId]
  )
}

async function findByTxnRef(txnRef) {
  const [rows] = await pool.query('SELECT * FROM listing_payments WHERE txn_ref = ? LIMIT 1', [txnRef])
  return rows[0] || null
}

async function findByOrderCode(orderCode) {
  const [rows] = await pool.query('SELECT * FROM listing_payments WHERE provider_order_code = ? LIMIT 1', [orderCode])
  return rows[0] || null
}

async function markResult({ txnRef, paid, responseCode, providerTransaction }) {
  await pool.query(
    `UPDATE listing_payments
     SET status = ?, response_code = ?, provider_transaction = ?, paid_at = IF(? = 1, COALESCE(paid_at, NOW()), paid_at)
     WHERE txn_ref = ? AND status = 'pending'`,
    [paid ? 'paid' : 'failed', responseCode || null, providerTransaction || null, paid ? 1 : 0, txnRef]
  )
  return findByTxnRef(txnRef)
}

async function markPayosResult({ orderCode, status, providerTransaction, paymentLinkId }) {
  const normalizedStatus = ['paid', 'failed', 'cancelled'].includes(status) ? status : 'pending'
  await pool.query(
    `UPDATE listing_payments
     SET status = ?, provider_transaction = COALESCE(?, provider_transaction),
         payment_link_id = COALESCE(?, payment_link_id), response_code = ?,
         paid_at = IF(? = 'paid', COALESCE(paid_at, NOW()), paid_at)
     WHERE provider_order_code = ? AND status = 'pending'`,
    [normalizedStatus, providerTransaction || null, paymentLinkId || null, normalizedStatus.toUpperCase(), normalizedStatus, orderCode]
  )
  return findByOrderCode(orderCode)
}

async function consumeCredit({ paymentId, userId, listingType, listingId }) {
  const [result] = await pool.query(
    `UPDATE listing_payments SET consumed_at = NOW(), listing_type = ?, listing_id = ?
     WHERE id = ? AND user_id = ? AND status = 'paid' AND consumed_at IS NULL`,
    [listingType, listingId, paymentId, userId]
  )
  return result.affectedRows === 1
}

module.exports = {
  getPostingAccess,
  createPending,
  findByTxnRef,
  findByOrderCode,
  markResult,
  markPayosResult,
  consumeCredit,
}