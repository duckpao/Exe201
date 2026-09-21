import { Link } from 'react-router-dom'
import SiteHeader from '../components/site/SiteHeader.jsx'
import SiteFooter from '../components/site/SiteFooter.jsx'
import PlaceholderImage from '../components/site/PlaceholderImage.jsx'
import RoomCard from '../components/site/RoomCard.jsx'
import { rooms } from '../data/mockListings.js'
import '../styles/site.css'

const QUICK_ACCESS = [
  { to: '/phong-tro', label: 'Phòng trọ', icon: '/images/icon-phong-tro.svg' },
  { to: '/tim-roommate', label: 'Tìm Roommate', icon: '/images/icon-roommate.svg' },
  { to: '/pass-do', label: 'Pass đồ', icon: '/images/icon-pass-do.svg' },
  { to: '/van-chuyen-do', label: 'Vận chuyển đồ', icon: '/images/icon-van-chuyen.svg' },
]

const SERVICES = [
  { to: '/phong-tro', label: 'Phòng trọ', image: '/images/service-phong-tro.jpg' },
  { to: '/pass-phong', label: 'Pass đồ', image: '/images/service-pass-do.jpg' },
  { to: '/van-chuyen-do', label: 'Vận chuyển đồ', image: '/images/service-van-chuyen.jpg' },
]

export default function HomePage() {
  const featuredRooms = rooms.slice(0, 4)

  return (
    <div className="site-page">
      <SiteHeader />
      <main className="site-main">
        <section className="home-hero">
          <div className="home-hero-inner">
            <div className="home-hero-text">
              <h1>
                Tìm phòng dễ dàng
                <br />
                <em>Sống trọn thanh xuân</em>
              </h1>
              <p>
                RentMate Hola giúp bạn tìm phòng trọ, roommate, pass phòng và vận chuyển đồ đạc nhanh
                chóng, tin cậy chỉ trong vài bước.
              </p>
              <Link to="/phong-tro" className="btn btn-primary">
                Tìm phòng ngay
              </Link>
            </div>
            <div className="home-hero-image">
              <PlaceholderImage src="/images/hero-home.jpg" alt="Phòng trọ đẹp" />
            </div>
          </div>
        </section>

        <div className="quick-access">
          {QUICK_ACCESS.map((item) => (
            <Link key={item.to} to={item.to} className="quick-access-card">
              <PlaceholderImage src={item.icon} alt={item.label} className="quick-access-icon" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        <section className="site-section">
          <div className="site-section-header">
            <h2>Dịch vụ nổi bật</h2>
            <p>Mọi thứ bạn cần cho cuộc sống trọ đều có trên RentMate Hola.</p>
          </div>
          <div className="service-grid">
            {SERVICES.map((service) => (
              <Link key={service.label} to={service.to} className="service-card">
                <PlaceholderImage src={service.image} alt={service.label} />
                <div className="service-card-label">
                  <span>{service.label}</span>
                  <span className="service-card-arrow">→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="site-section">
          <div className="site-section-header">
            <h2>Phòng trọ nổi bật</h2>
            <p>Những phòng trọ được quan tâm nhiều nhất tuần này.</p>
          </div>
          <div className="room-grid">
            {featuredRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
