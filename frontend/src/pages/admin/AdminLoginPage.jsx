import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, logout, me } from '../../services/authService.js'
import BrandLogo from '../../components/BrandLogo.jsx'
import '../../styles/auth.css'
import '../../styles/admin.css'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false
    me()
      .then((data) => {
        if (!cancelled && data?.user?.role === 'admin') {
          navigate('/admin', { replace: true })
        }
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [navigate])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await login(email.trim(), password)
      if (data.user?.role !== 'admin') {
        await logout().catch(() => {})
        setError('Tài khoản này không có quyền truy cập trang quản trị.')
        return
      }
      navigate('/admin')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <aside className="auth-hero admin-hero">
        <div className="auth-hero-content">
          <BrandLogo />
          <h1>Trang quản trị RentMate Hola</h1>
          <p>Quản lý người dùng, tin đăng phòng trọ, pass phòng, roommate và pass đồ tại một nơi duy nhất.</p>
        </div>
      </aside>
      <main className="auth-main">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Đăng nhập quản trị</h2>
            <p className="auth-subtitle">Chỉ dành cho quản trị viên hệ thống</p>
          </div>

          <div className={`banner banner-error ${error ? 'visible' : ''}`}>{error}</div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="admin-email">Email quản trị</label>
              <input
                type="email"
                id="admin-email"
                name="email"
                placeholder="admin@nhatro.vn"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="admin-password">Mật khẩu</label>
              <input
                type="password"
                id="admin-password"
                name="password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <p className="auth-footer">Khu vực dành riêng cho quản trị viên. Người dùng thông thường vui lòng đăng nhập tại trang chủ.</p>
        </div>
      </main>
    </div>
  )
}
