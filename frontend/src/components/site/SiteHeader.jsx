import { Link, useLocation } from 'react-router-dom'
import PlaceholderImage from './PlaceholderImage.jsx'

const NAV_LINKS = [
  { to: '/', label: 'Trang chủ' },
  { to: '/phong-tro', label: 'Phòng trọ' },
  { to: '/tim-roommate', label: 'Tìm Roommate' },
  { to: '/van-chuyen-do', label: 'Vận chuyển đồ' },
  { to: '/pass-phong', label: 'Pass Phòng' },
  { to: '/pass-do', label: 'Pass đồ' },
]

export default function SiteHeader() {
  const { pathname } = useLocation()

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="site-logo">
          <PlaceholderImage src="/images/logo.png" alt="RentMate Hola" className="site-logo-image" />
        </Link>

        <nav className="site-nav">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`site-nav-link ${pathname === link.to ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="site-header-actions">
          <button type="button" className="icon-btn" aria-label="Thông báo">
            🔔
            <span className="icon-badge">9</span>
          </button>
          <button type="button" className="icon-btn" aria-label="Cài đặt">
            ⚙️
          </button>
          <Link to="/login" className="site-avatar" aria-label="Đăng nhập">
            <span>U</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
