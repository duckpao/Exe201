import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import BrandLogo from '../components/BrandLogo.jsx'
import { useToast } from '../context/ToastContext.jsx'
import '../styles/auth.css'

export default function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [isLandlord, setIsLandlord] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { register } = useAuth()
  const toast = useToast()

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    try {
      const user = await register({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        password,
        role: isLandlord ? 'landlord' : 'tenant',
      })
      
      if (user?.role === 'admin') {
        navigate('/admin')
      } else if (user?.role === 'landlord') {
        navigate('/phong-tro/dang-bai')
      } else {
        navigate('/')
      }
    } catch (err) {
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
          <h1>Tạo tài khoản để đăng bài hoặc liên hệ thuê phòng.</h1>
          <p>Đăng ký làm chủ nhà nếu bạn muốn đăng tin phòng trọ cho thuê trên RentMate Hola.</p>
        </div>
      </aside>
      <main className="auth-main">
        <div className="auth-card">
          <div className="auth-card-header">
            <h2>Đăng ký</h2>
            <p className="auth-subtitle">Tạo tài khoản mới cho RentMate Hola</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="fullName">Họ và tên</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Nguyễn Văn A"
                required
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
              />
            </div>
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
              <label htmlFor="phone">Số điện thoại</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="09xxxxxxxx"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
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
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>
            <div className="form-group form-checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={isLandlord}
                  onChange={(event) => setIsLandlord(event.target.checked)}
                />
                Đăng ký làm chủ nhà (cho phép đăng bài phòng trọ cho thuê)
              </label>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Đang tạo tài khoản...' : 'Đăng ký'}
            </button>
            <p className="auth-consent">Khi đăng ký, bạn xác nhận đã đọc và đồng ý với <Link className="auth-link" to="/dieu-khoan">Điều khoản sử dụng</Link>.</p>
          </form>

          <p className="auth-footer">
            Đã có tài khoản?{' '}
            <Link className="auth-link" to="/login">
              Đăng nhập
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
