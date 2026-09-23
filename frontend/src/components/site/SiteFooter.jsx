import { useState } from 'react'
import { Link } from 'react-router-dom'
import PlaceholderImage from './PlaceholderImage.jsx'

const SOCIALS = [
  { name: 'Facebook', src: '/images/fb.svg' },
  { name: 'Instagram', src: '/images/ig.svg' },
  { name: 'LinkedIn', src: '/images/in.svg' },
  { name: 'TikTok', src: '/images/tiktok.svg' },
]

export default function SiteFooter() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  function handleSubscribe(event) {
    event.preventDefault()
    setSubscribed(true)
  }

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-col footer-brand">
          <div className="site-logo">
            <span className="site-logo-mark">RentMate</span>
            <span className="site-logo-accent">Hola</span>
          </div>
          <p>Nền tảng tìm phòng trọ, roommate, pass phòng và vận chuyển đồ dành cho sinh viên.</p>
          <div className="footer-socials">
            {SOCIALS.map((social) => (
              <a key={social.name} href="#" aria-label={social.name} className="footer-social-icon">
                <PlaceholderImage src={social.src} alt={social.name} />
              </a>
            ))}
          </div>
        </div>

        <div className="footer-col">
          <h4>Về RentMate Hola</h4>
          <ul>
            <li><Link to="/gioi-thieu">Giới thiệu</Link></li>
            <li><Link to="/dieu-khoan">Điều khoản</Link></li>
            <li><Link to="/dieu-khoan">Chính sách</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Hỗ trợ</h4>
          <ul>
            <li><Link to="/">Liên hệ</Link></li>
            <li><Link to="/">Hướng dẫn</Link></li>
          </ul>
        </div>

        <div className="footer-col footer-subscribe">
          <h4>Đăng ký nhận thông tin mới nhất</h4>
          {subscribed ? (
            <p className="footer-subscribe-success">Cảm ơn bạn đã đăng ký!</p>
          ) : (
            <form onSubmit={handleSubscribe} className="footer-subscribe-form">
              <input
                type="email"
                required
                placeholder="Email của bạn"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <button type="submit">Gửi</button>
            </form>
          )}
        </div>
      </div>
    </footer>
  )
}
