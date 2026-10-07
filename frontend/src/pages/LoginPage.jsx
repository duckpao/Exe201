import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import BrandLogo from '../components/BrandLogo.jsx'
import { useToast } from '../context/ToastContext.jsx'
import '../styles/auth.css'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleUnavailable, setGoogleUnavailable] = useState(false)
  const googleButtonRef = useRef(null)
  const navigate = useNavigate()
  const { login, loginWithGoogle } = useAuth()
  const toast = useToast()

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      setGoogleUnavailable(true)
      return
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCredential,
      })
      if (googleButtonRef.current) {
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          width: 320,
        })
      }
    }
    script.onerror = () => setGoogleUnavailable(true)
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSuccessfulLogin(user) {
    if (user?.role === 'admin') {
      navigate('/admin')
    } else if (user?.role === 'landlord') {
      navigate('/phong-tro/dang-bai')
    } else {
      navigate('/')
    }
  }

  async function handleGoogleCredential(credentialResponse) {
    setError('')
    setLoading(true)
    try {
      const user = await loginWithGoogle(credentialResponse.credential)
      handleSuccessfulLogin(user)
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(email.trim(), password)
      handleSuccessfulLogin(user)
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <aside className="auth-hero">
        <div className="auth-hero-content">
          <BrandLogo />
          <h1>Tìm phòng trọ, pass phòng &amp; roommate dễ dàng hơn.</h1>
          <p>Đăng nhập để quản lý tin đăng, liên hệ chủ trọ và đặt xe vận chuyển đồ đạc chỉ trong vài bước.</p>
        </div>
      </aside>
      <main className="auth-main">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Đăng nhập</h2>
            <p className="auth-subtitle">Chào mừng bạn quay lại RentMate Hola</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="ban@gmail.com"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                required
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <div className="auth-action-links">
              <Link className="auth-link" to="/forgot-password">
                Quên mật khẩu?
              </Link>
              <Link className="auth-link" to="/dang-ky">
                Chưa có tài khoản? <strong>Đăng ký ngay</strong>
              </Link>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>

          <div className="auth-divider">hoặc</div>

          <div ref={googleButtonRef} id="google-signin-button"></div>
          {googleUnavailable && (
            <div className="banner google-unavailable">
              Đăng nhập Google chưa được cấu hình (cần <code>VITE_GOOGLE_CLIENT_ID</code>).
            </div>
          )}

          <p className="auth-footer">Bằng việc đăng nhập, bạn đồng ý với <Link className="auth-link" to="/dieu-khoan">Điều khoản sử dụng</Link> của RentMate Hola.</p>
        </div>
      </main>
    </div>
  )
}
