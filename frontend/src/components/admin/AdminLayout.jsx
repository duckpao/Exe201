import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'
import PlaceholderImage from '../site/PlaceholderImage.jsx'
import '../../styles/admin.css'

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
            <PlaceholderImage
              src={admin?.avatar_url || '/images/avatar-owner.jpg'}
              alt={admin?.full_name || 'Admin'}
              className="admin-topbar-avatar"
            />
            <div>
              <div className="admin-topbar-name">{admin?.full_name}</div>
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
