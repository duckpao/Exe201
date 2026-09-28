import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import PlaceholderImage from './PlaceholderImage.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useSocket } from '../../context/SocketContext.jsx'
import { listConversations } from '../../services/conversationService.js'

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
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const socket = useSocket()
  const [menuOpen, setMenuOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!user) {
      setUnreadCount(0)
      return
    }

    function refreshUnread() {
      listConversations()
        .then((data) => {
          const total = (data.data || []).reduce((sum, item) => sum + (item.unreadCount || 0), 0)
          setUnreadCount(total)
        })
        .catch(() => {})
    }

    refreshUnread()

    if (!socket) return
    socket.on('message:new', refreshUnread)
    return () => socket.off('message:new', refreshUnread)
  }, [user, socket])

  async function handleLogout() {
    setMenuOpen(false)
    await logout()
    navigate('/')
  }

  const navLinks =
    user?.role === 'landlord' ? [...NAV_LINKS, { to: '/phong-tro/dang-bai', label: 'Đăng phòng' }] : NAV_LINKS

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="site-logo">
          <PlaceholderImage src="/images/logo.png" alt="RentMate Hola" className="site-logo-image" />
        </Link>

        <nav className="site-nav">
          {navLinks.map((link) => (
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
          <Link to="/tin-nhan" className="icon-btn" aria-label="Tin nhắn">
            🔔
            {unreadCount > 0 && <span className="icon-badge">{unreadCount}</span>}
          </Link>
          <button type="button" className="icon-btn" aria-label="Cài đặt">
            ⚙️
          </button>
          {user ? (
            <div className="site-avatar-menu">
              <button
                type="button"
                className="site-avatar"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label="Tài khoản"
              >
                <span>{user.full_name?.[0]?.toUpperCase() || 'U'}</span>
              </button>
              {menuOpen && (
                <div className="site-avatar-dropdown">
                  <p className="site-avatar-dropdown-name">{user.full_name}</p>
                  <Link to="/tin-nhan" onClick={() => setMenuOpen(false)}>
                    Nhắn tin
                  </Link>
                  <button type="button" onClick={handleLogout}>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="site-avatar" aria-label="Đăng nhập">
              <span>U</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
