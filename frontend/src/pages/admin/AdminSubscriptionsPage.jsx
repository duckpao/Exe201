import { useCallback, useEffect, useState } from 'react'
import { grantSubscription, listAdminSubscriptions, revokeSubscription } from '../../services/adminSubscriptionService.js'

const PLAN_OPTIONS = [
  ['basic_monthly', 'Cơ bản, theo tháng'],
  ['basic_yearly', 'Cơ bản, theo năm'],
  ['pro_monthly', 'Nâng cao, theo tháng'],
  ['pro_yearly', 'Nâng cao, theo năm'],
]
const STATE_LABELS = { active: 'Đang hiệu lực', queued: 'Chờ bắt đầu', expired: 'Đã hết hạn', revoked: 'Đã thu hồi' }
const STATE_CLASS = { active: 'status-approved', queued: 'status-pending', expired: 'status-hidden', revoked: 'status-hidden' }
const SOURCE_LABELS = { payment: 'Thanh toán', admin: 'Admin cấp' }

const formatDate = (value) => new Date(value).toLocaleDateString('vi-VN')

export default function AdminSubscriptionsPage() {
  const [onlyActive, setOnlyActive] = useState(true)
  const [page, setPage] = useState(1)
  const [data, setData] = useState({ data: [], pagination: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [email, setEmail] = useState('')
  const [planCode, setPlanCode] = useState('basic_monthly')
  const [granting, setGranting] = useState(false)
  const [retry, setRetry] = useState(0)

  const reload = useCallback(() => setRetry((value) => value + 1), [])

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')
    listAdminSubscriptions({ active: onlyActive, page, limit: 20 }, { signal: controller.signal })
      .then(setData)
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setError(requestError.message || 'Không thể tải danh sách gói.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [onlyActive, page, retry])

  async function handleGrant(event) {
    event.preventDefault()
    setGranting(true)
    setActionError('')
    try {
      await grantSubscription(email.trim(), planCode)
      setEmail('')
      reload()
    } catch (requestError) {
      setActionError(requestError.message)
    } finally {
      setGranting(false)
    }
  }

  async function handleRevoke(row) {
    if (!window.confirm(`Thu hồi gói ${row.tierLabel} của ${row.user.name}?`)) return
    setActionError('')
    try {
      await revokeSubscription(row.id)
      reload()
    } catch (requestError) {
      setActionError(requestError.message)
    }
  }

  const pagination = data.pagination

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Gói đăng ký</h1>

      <form className="admin-filter-bar" onSubmit={handleGrant}>
        <label>
          Email người dùng
          <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="email@example.com" />
        </label>
        <label>
          Gói cấp
          <select value={planCode} onChange={(event) => setPlanCode(event.target.value)}>
            {PLAN_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
        <button type="submit" className="admin-action-btn" disabled={granting}>{granting ? 'Đang cấp...' : 'Cấp gói'}</button>
      </form>

      <div className="admin-tabs">
        <button type="button" className={`admin-tab ${onlyActive ? 'active' : ''}`} onClick={() => { setOnlyActive(true); setPage(1) }}>Đang hiệu lực</button>
        <button type="button" className={`admin-tab ${!onlyActive ? 'active' : ''}`} onClick={() => { setOnlyActive(false); setPage(1) }}>Tất cả lịch sử</button>
      </div>

      {actionError && <div className="listing-error" role="alert"><p>{actionError}</p></div>}
      {loading && <p className="listing-status">Đang tải danh sách gói...</p>}
      {!loading && error && (
        <div className="listing-error" role="alert">
          <p>{error}</p>
          <button type="button" className="admin-action-btn" onClick={reload}>Thử lại</button>
        </div>
      )}

      {!loading && !error && (
        <section className="admin-table-card">
          <table className="admin-table">
            <thead>
              <tr><th>Người dùng</th><th>Gói</th><th>Bắt đầu</th><th>Hết hạn</th><th>Nguồn</th><th>Trạng thái</th><th>Hành động</th></tr>
            </thead>
            <tbody>
              {data.data.map((row) => (
                <tr key={row.id}>
                  <td>
                    <div className="admin-table-title">{row.user.name}</div>
                    <div className="admin-table-subtitle">{row.user.email}</div>
                  </td>
                  <td>{row.tierLabel}, theo {row.cycle === 'yearly' ? 'năm' : 'tháng'}</td>
                  <td>{formatDate(row.startsAt)}</td>
                  <td>{formatDate(row.expiresAt)}</td>
                  <td>{SOURCE_LABELS[row.source]}</td>
                  <td><span className={`status-badge ${STATE_CLASS[row.state]}`}>{STATE_LABELS[row.state]}</span></td>
                  <td className="admin-table-actions">
                    {(row.state === 'active' || row.state === 'queued') && (
                      <button type="button" className="admin-action-btn admin-action-danger" onClick={() => handleRevoke(row)}>Thu hồi</button>
                    )}
                  </td>
                </tr>
              ))}
              {data.data.length === 0 && (
                <tr><td colSpan={7} className="admin-table-empty">{onlyActive ? 'Chưa có thành viên nào đang có gói.' : 'Chưa có gói nào được mua hoặc cấp.'}</td></tr>
              )}
            </tbody>
          </table>
        </section>
      )}

      {!loading && !error && pagination && pagination.totalPages > 1 && (
        <div className="admin-filter-bar">
          <button type="button" className="admin-action-btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>Trang trước</button>
          <span>Trang {pagination.page} / {pagination.totalPages}</span>
          <button type="button" className="admin-action-btn" disabled={page >= pagination.totalPages} onClick={() => setPage(page + 1)}>Trang sau</button>
        </div>
      )}
    </div>
  )
}
