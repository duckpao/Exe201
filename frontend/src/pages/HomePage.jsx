import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SiteHeader from '../components/site/SiteHeader.jsx'
import SiteFooter from '../components/site/SiteFooter.jsx'
import PlaceholderImage from '../components/site/PlaceholderImage.jsx'
import RoomCard from '../components/site/RoomCard.jsx'
import Button from '../components/foundation/Button.jsx'
import EmptyState from '../components/foundation/EmptyState.jsx'
import LoadingState from '../components/foundation/LoadingState.jsx'
import SectionHeader from '../components/foundation/SectionHeader.jsx'
import { listRooms } from '../services/roomService.js'
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
  const [featuredRooms, setFeaturedRooms] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    setLoading(true)
    listRooms({ limit: 4 })
      .then((data) => {
        if (!ignore) {
          setFeaturedRooms(data.data || [])
          setLoading(false)
        }
      })
      .catch(() => {
        if (!ignore) {
          setFeaturedRooms([])
          setLoading(false)
        }
      })

    return () => {
      ignore = true
    }
  }, [])

  return (
    <div className="site-page">
      <SiteHeader />
      <main className="site-main">
        <section className="home-hero">
          <div className="home-hero-inner">
            <div className="home-hero-text">
              <p className="home-hero__eyebrow">Trang chủ / Khám phá</p>
              <h1>
                Tìm phòng dễ dàng
                <br />
                <em>Sống trọn thanh xuân</em>
              </h1>
              <p>
                RentMate Hola giúp bạn tìm phòng trọ, roommate, pass phòng và vận chuyển đồ đạc nhanh
                chóng, tin cậy chỉ trong vài bước.
              </p>
              <div className="hero-actions">
                <Button type="button" onClick={() => (window.location.href = '/phong-tro')}>
                  Tìm phòng ngay
                </Button>
                <Link to="/tim-roommate" className="text-link">
                  Tìm roommate
                </Link>
              </div>
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
          <SectionHeader
            eyebrow="Dịch vụ"
            title="Dịch vụ nổi bật"
            description="Mọi thứ bạn cần cho cuộc sống trọ đều có trên RentMate Hola."
          />
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
          <SectionHeader
            eyebrow="Phòng trọ"
            title="Phòng trọ nổi bật"
            description="Những phòng trọ được quan tâm nhiều nhất tuần này."
          />
          {loading ? (
            <LoadingState label="Đang tải phòng trọ nổi bật..." />
          ) : featuredRooms.length > 0 ? (
            <div className="room-grid">
              {featuredRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Chưa có phòng trọ nào được đăng"
              description="Hãy quay lại sau hoặc đăng tin mới để bắt đầu."
              action={<Link to="/phong-tro/dang-bai" className="inline-action">Đăng tin ngay</Link>}
            />
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
