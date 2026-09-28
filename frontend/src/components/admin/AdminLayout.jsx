import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'
import PlaceholderImage from '../site/PlaceholderImage.jsx'
import '../../styles/admin.css'

const DEFAULT_USER_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='20' fill='%23fed7aa'/%3E%3Ccircle cx='20' cy='15' r='6' fill='%23ea580c'/%3E%3Cpath fill='%23ea580c' d='M9 33c0-6.1 4.9-11 11-11s11 4.9 11 11'/%3E%3C/svg%3E"

const NAV_LINKS = [
  { to: '/admin', label: 'Tổng quan', icon: '📊', end: true },
  { to: '/admin/users', label: 'Người dùng', icon: '👥' },
  { to: '/admin/listings', label: 'Tin đăng', icon: '🗂️' },
]

export default function AdminLayout() {
  const { admin, logout } = useAdminAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/admin/login')
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/admin" className="admin-sidebar-logo">
          <PlaceholderImage src="/images/logo.png" alt="RentMate Hola" className="admin-sidebar-logo-image" />
          <span>Quản trị</span>
        </Link>

        <nav className="admin-sidebar-nav">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `admin-nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="admin-nav-icon">{link.icon}</span>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <Link to="/" className="admin-nav-link admin-nav-back">
          <span className="admin-nav-icon">↩️</span>
          Về trang chủ
        </Link>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-user">
            <img
              src={admin?.avatar_url || DEFAULT_USER_AVATAR}
              alt=""
              className="admin-topbar-avatar"
              onError={(event) => {
                event.currentTarget.onerror = null
                event.currentTarget.src = DEFAULT_USER_AVATAR
              }}
            />
            <div>
              <div className="admin-topbar-name">{admin?.full_name || 'Admin'}</div>
              <div className="admin-topbar-role">Quản trị viên</div>
            </div>
          </div>
          <button type="button" className="btn admin-logout-btn" onClick={handleLogout}>
            Đăng xuất
          </button>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
