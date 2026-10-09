import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import PlaceholderImage from './PlaceholderImage.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useSocket } from '../../context/SocketContext.jsx'
import { listConversations } from '../../services/conversationService.js'
import { Bell, Menu, Settings, X } from 'lucide-react';

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
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
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

  useEffect(() => {
    setMobileNavOpen(false)
    setMenuOpen(false)
  }, [pathname])

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
          <button
            type="button"
            className="mobile-nav-toggle"
            onClick={() => setMobileNavOpen((open) => !open)}
            aria-expanded={mobileNavOpen}
            aria-label={mobileNavOpen ? 'Đóng menu' : 'Mở menu'}
          >
            {mobileNavOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
          <Link to="/tin-nhan" className="icon-btn" aria-label="Tin nhắn">
            <Bell size={16} />
            {unreadCount > 0 && <span className="icon-badge">{unreadCount}</span>}
          </Link>
          <Link to="/settings" className="icon-btn" aria-label="Cài đặt">
            <Settings size={16} />
          </Link>
          {user ? (
            <div className="site-avatar-menu">
              <button
                type="button"
                className="site-avatar"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label="Tài khoản"
              >
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="Avatar" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />
                ) : (
                  <span>{user.full_name?.[0]?.toUpperCase() || 'U'}</span>
                )}
              </button>
              {menuOpen && (
                <div className="site-avatar-dropdown">
                  <p className="site-avatar-dropdown-name">{user.full_name}</p>
                  <Link to="/tin-nhan" onClick={() => setMenuOpen(false)}>
                    Nhắn tin
                  </Link>
                  <Link to="/settings" onClick={() => setMenuOpen(false)}>
                    Cài đặt
                  </Link>
                  <button type="button" onClick={handleLogout}>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="site-header-login-btn" aria-label="Đăng nhập">
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
      {mobileNavOpen && (
        <nav className="mobile-site-nav" aria-label="Điều hướng trên điện thoại">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to} className={pathname === link.to ? 'active' : ''}>
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
