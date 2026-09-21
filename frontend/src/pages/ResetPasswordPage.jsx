import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { resetPassword } from '../services/authService'
import BrandLogo from '../components/BrandLogo.jsx'
import '../styles/auth.css'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(
    token ? '' : 'Link không hợp lệ hoặc thiếu token. Vui lòng yêu cầu link đặt lại mật khẩu mới.',
  )
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      return
    }

    setLoading(true)
    try {
      const data = await resetPassword(token, newPassword)
      setSuccess(data.message)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const showForm = Boolean(token) && !success

  return (
    <div className="auth-page">
      <aside className="auth-hero">
        <div className="auth-hero-content">
          <BrandLogo />
          <h1>Đặt lại mật khẩu mới.</h1>
          <p>Chọn một mật khẩu mới an toàn để tiếp tục sử dụng RentMate Hola.</p>
        </div>
      </aside>
      <main className="auth-main">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Đặt lại mật khẩu</h2>
            <p className="auth-subtitle">Nhập mật khẩu mới cho tài khoản của bạn</p>
          </div>

          <div className={`banner banner-error ${error ? 'visible' : ''}`}>{error}</div>
          <div className={`banner banner-success ${success ? 'visible' : ''}`}>{success}</div>

          {showForm && (
            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="newPassword">Mật khẩu mới</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  placeholder="••••••••"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="••••••••"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
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
