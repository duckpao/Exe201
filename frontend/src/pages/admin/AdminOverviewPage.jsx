import { useEffect, useState } from 'react'
import { getAdminOverview } from '../../services/adminUserService.js'
import { Users, FolderOpen, Hourglass, Lock, EyeOff } from 'lucide-react'

const ROLE_LABELS = { tenant: 'Người thuê', landlord: 'Chủ trọ', admin: 'Quản trị viên' }

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString('vi-VN') : ''
}

export default function AdminOverviewPage() {
  const [overview, setOverview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')
    getAdminOverview({ signal: controller.signal })
      .then(setOverview)
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setError(requestError.message || 'Không thể tải dữ liệu tổng quan.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [retry])

  const byType = overview?.listings.byType || []
  const maxCount = Math.max(...byType.map((item) => item.total), 1)

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Tổng quan</h1>
      {loading && <p className="listing-status">Đang tải dữ liệu quản trị...</p>}
      {!loading && error && (
        <div className="listing-error" role="alert">
          <p>{error}</p>
          <button type="button" className="admin-action-btn" onClick={() => setRetry((value) => value + 1)}>Thử lại</button>
        </div>
      )}

      {!loading && !error && overview && (
        <>
          <div className="stat-grid">
            <div className="stat-card">
              <span className="stat-card-icon"><Users size={16} /></span>
              <div className="stat-card-value">{overview.users.total}</div>
              <div className="stat-card-label">Tổng người dùng</div>
            </div>
            <div className="stat-card">
              <span className="stat-card-icon"><FolderOpen size={16} /></span>
              <div className="stat-card-value">{overview.listings.total}</div>
              <div className="stat-card-label">Tổng tin đăng</div>
            </div>
            <div className="stat-card">
              <span className="stat-card-icon"><Hourglass size={16} /></span>
              <div className="stat-card-value">{overview.listings.pending}</div>
              <div className="stat-card-label">Tin chờ duyệt</div>
            </div>
            <div className="stat-card">
              <span className="stat-card-icon"><EyeOff size={16} /></span>
              <div className="stat-card-value">{overview.listings.hidden}</div>
              <div className="stat-card-label">Tin bị ẩn</div>
            </div>
            <div className="stat-card">
              <span className="stat-card-icon"><Lock size={16} /></span>
              <div className="stat-card-value">{overview.users.locked}</div>
              <div className="stat-card-label">Tài khoản bị khoá</div>
            </div>
          </div>

          <div className="admin-grid-2">
            <section className="admin-table-card">
              <h2 className="admin-card-title">Tin đăng theo loại</h2>
              <div className="admin-bar-chart">
                {byType.map((item) => (
                  <div className="admin-bar-row" key={item.type}>
                    <span className="admin-bar-label">{item.label}</span>
                    <div className="admin-bar-track">
                      <div className="admin-bar-fill" style={{ width: `${(item.total / maxCount) * 100}%` }} />
                    </div>
                    <span className="admin-bar-count">{item.total}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="admin-table-card">
              <h2 className="admin-card-title">Người dùng mới nhất</h2>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Họ tên</th>
                    <th>Vai trò</th>
                    <th>Ngày tạo</th>
                  </tr>
                </thead>
                <tbody>
                  {overview.recentUsers.map((user) => (
                    <tr key={user.id}>
                      <td>{user.full_name}</td>
                      <td>
                        <span className={`status-badge role-${user.role}`}>{ROLE_LABELS[user.role]}</span>
                      </td>
                      <td>{formatDate(user.created_at)}</td>
                    </tr>
                  ))}
                  {overview.recentUsers.length === 0 && (
                    <tr><td colSpan={3} className="admin-table-empty">Chưa có người dùng.</td></tr>
                  )}
                </tbody>
              </table>
            </section>
          </div>
        </>
      )}
    </div>
  )
}
