import { mockAdminUsers } from '../../data/mockAdminUsers.js'
import { LISTING_TYPE_LABELS, mockAdminListings } from '../../data/mockAdminListings.js'

const ROLE_LABELS = { tenant: 'Người thuê', landlord: 'Chủ trọ', admin: 'Quản trị viên' }

export default function AdminOverviewPage() {
  const totalUsers = mockAdminUsers.length
  const lockedUsers = mockAdminUsers.filter((user) => user.status === 'locked').length
  const totalListings = mockAdminListings.length
  const pendingListings = mockAdminListings.filter((item) => item.moderationStatus === 'pending').length

  const listingsByType = Object.keys(LISTING_TYPE_LABELS).map((type) => ({
    type,
    label: LISTING_TYPE_LABELS[type],
    count: mockAdminListings.filter((item) => item.type === type).length,
  }))
  const maxCount = Math.max(...listingsByType.map((item) => item.count), 1)

  const recentUsers = [...mockAdminUsers]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5)

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Tổng quan</h1>

      <div className="stat-grid">
        <div className="stat-card">
          <span className="stat-card-icon">👥</span>
          <div className="stat-card-value">{totalUsers}</div>
          <div className="stat-card-label">Tổng người dùng</div>
        </div>
        <div className="stat-card">
          <span className="stat-card-icon">🗂️</span>
          <div className="stat-card-value">{totalListings}</div>
          <div className="stat-card-label">Tổng tin đăng</div>
        </div>
        <div className="stat-card">
          <span className="stat-card-icon">⏳</span>
          <div className="stat-card-value">{pendingListings}</div>
          <div className="stat-card-label">Tin chờ duyệt</div>
        </div>
        <div className="stat-card">
          <span className="stat-card-icon">🔒</span>
          <div className="stat-card-value">{lockedUsers}</div>
          <div className="stat-card-label">Tài khoản bị khoá</div>
        </div>
      </div>

      <div className="admin-grid-2">
        <section className="admin-table-card">
          <h2 className="admin-card-title">Tin đăng theo loại</h2>
          <div className="admin-bar-chart">
            {listingsByType.map((item) => (
              <div className="admin-bar-row" key={item.type}>
                <span className="admin-bar-label">{item.label}</span>
                <div className="admin-bar-track">
                  <div
                    className="admin-bar-fill"
                    style={{ width: `${(item.count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="admin-bar-count">{item.count}</span>
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
              {recentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.full_name}</td>
                  <td>
                    <span className={`status-badge role-${user.role}`}>{ROLE_LABELS[user.role]}</span>
                  </td>
                  <td>{user.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  )
}
