import { Link } from 'react-router-dom'
import SiteHeader from '../components/site/SiteHeader.jsx'
import SiteFooter from '../components/site/SiteFooter.jsx'
import PlaceholderImage from '../components/site/PlaceholderImage.jsx'
import '../styles/site.css'

const VALUES = [
  { icon: '🛡️', title: 'An toàn', desc: 'Thông tin phòng trọ và người dùng được kiểm duyệt kỹ càng.' },
  { icon: '⚡', title: 'Nhanh chóng', desc: 'Tìm phòng, tìm roommate hay pass phòng chỉ trong vài bước.' },
  { icon: '🏘️', title: 'Đa dạng', desc: 'Hàng trăm phòng trọ, dịch vụ vận chuyển ở nhiều khu vực.' },
  { icon: '🎧', title: 'Hỗ trợ', desc: 'Đội ngũ hỗ trợ luôn sẵn sàng giải đáp mọi thắc mắc.' },
]

export default function AboutUsPage() {
  return (
    <div className="site-page">
      <SiteHeader />
      <main className="site-main">
        <section className="about-hero">
          <div className="about-hero-inner">
            <div className="about-hero-text">
              <h1>Về RentMate Hola - Sống trọn thanh xuân</h1>
              <p>
                RentMate Hola ra đời với sứ mệnh kết nối sinh viên và người cho thuê một cách nhanh chóng,
                minh bạch và đáng tin cậy - để việc tìm phòng trọ, roommate hay chuyển đồ không còn là nỗi lo.
              </p>
            </div>
            <PlaceholderImage src="/images/about-hero.jpg" alt="RentMate Hola" className="about-hero-image" />
          </div>
        </section>

        <section className="site-section">
          <div className="site-section-header">
            <h2>Tại sao chọn chúng tôi</h2>
            <p>Những giá trị cốt lõi giúp RentMate Hola trở thành lựa chọn của hàng ngàn sinh viên.</p>
          </div>
          <div className="value-grid">
            {VALUES.map((value) => (
              <div key={value.title} className="value-card">
                <span className="value-icon">{value.icon}</span>
                <h3>{value.title}</h3>
                <p>{value.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="site-section about-story-section">
          <div className="about-story-text">
            <h2>Câu chuyện của chúng tôi</h2>
            <p>
              RentMate Hola bắt đầu từ trải nghiệm thực tế của chính những sinh viên từng gặp khó khăn khi tìm
              phòng trọ phù hợp, tìm roommate hợp tính hay loay hoay khi cần pass lại phòng trước khi chuyển đi.
            </p>
            <p>
              Từ đó, chúng tôi xây dựng một nền tảng tập trung, nơi mọi nhu cầu về chỗ ở của sinh viên - từ thuê
              phòng, ở ghép, pass phòng đến vận chuyển đồ đạc - đều có thể được giải quyết ở một nơi duy nhất,
              nhanh chóng và đáng tin cậy.
            </p>
          </div>
          <PlaceholderImage src="/images/about-story.jpg" alt="Câu chuyện RentMate Hola" className="about-story-image" />
        </section>

        <section className="about-cta">
          <div className="about-cta-inner">
            <h2>Sẵn sàng tìm phòng trọ mơ ước?</h2>
            <p>Khám phá hàng trăm phòng trọ, roommate và dịch vụ hỗ trợ ngay hôm nay.</p>
            <Link to="/phong-tro" className="btn btn-primary">
              Tìm phòng ngay
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
