import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../services/authService'
import BrandLogo from '../components/BrandLogo.jsx'
import '../styles/auth.css'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await forgotPassword(email.trim())
      setSuccess(data.message)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <aside className="auth-hero">
        <div className="auth-hero-content">
          <BrandLogo />
          <h1>Quên mật khẩu không phải là vấn đề.</h1>
          <p>Nhập email đã đăng ký, chúng tôi sẽ gửi cho bạn link đặt lại mật khẩu.</p>
        </div>
      </aside>
      <main className="auth-main">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Quên mật khẩu?</h2>
            <p className="auth-subtitle">Nhập email để nhận link đặt lại mật khẩu</p>
          </div>

          <div className={`banner banner-error ${error ? 'visible' : ''}`}>{error}</div>
          <div className={`banner banner-success ${success ? 'visible' : ''}`}>{success}</div>

          {!success && (
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
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Đang gửi...' : 'Gửi link đặt lại mật khẩu'}
              </button>
            </form>
          )}

          <p className="back-to-login">
            <Link className="auth-link" to="/login">
              ← Về trang đăng nhập
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
