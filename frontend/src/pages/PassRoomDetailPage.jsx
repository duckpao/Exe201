import { Link, useParams } from 'react-router-dom'
import SiteHeader from '../components/site/SiteHeader.jsx'
import SiteFooter from '../components/site/SiteFooter.jsx'
import PlaceholderImage from '../components/site/PlaceholderImage.jsx'
import { getPassRoomDetail, roomOwner } from '../data/mockListings.js'
import '../styles/site.css'

const QUICK_FACTS = (room) => [
  { icon: '📐', label: 'Diện tích', value: room.area },
  { icon: '📍', label: 'Khu vực', value: room.location },
  { icon: '🏷️', label: 'Trạng thái', value: room.status },
  { icon: '💰', label: 'Giá thuê', value: room.price },
]

export default function PassRoomDetailPage() {
  const { roomId } = useParams()
  const room = getPassRoomDetail(roomId)

  if (!room) {
    return (
      <div className="site-page">
        <SiteHeader />
        <main className="site-main">
          <div className="coming-soon">
            <h1>Không tìm thấy bài pass phòng này</h1>
            <p>Bài đăng có thể đã bị gỡ hoặc đường dẫn không đúng.</p>
            <Link to="/pass-phong" className="btn btn-primary">
              Về danh sách Pass Phòng Trọ
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  return (
    <div className="site-page">
      <SiteHeader />
      <main className="site-main">
        <div className="detail-page-inner">
          <nav className="breadcrumb">
            <Link to="/">🏠</Link>
            <span>/</span>
            <Link to="/pass-phong">Pass Phòng Trọ</Link>
            <span>/</span>
            <span>
              {room.area} - {room.location}
            </span>
          </nav>

          <div className="detail-layout">
            <div className="detail-main">
              <div className="detail-gallery">
                <PlaceholderImage src={room.image} alt={room.title} className="detail-gallery-main" />
                <div className="detail-gallery-thumbs">
                  {room.gallery.map((src, index) => (
                    <PlaceholderImage key={src} src={src} alt={`${room.title} - ảnh ${index + 1}`} />
                  ))}
                </div>
              </div>

              <h1 className="detail-title">{room.title}</h1>
              <p className="detail-address">📍 {room.address}</p>
              <div className="detail-tags">
                {room.tags.map((tag) => (
                  <span key={tag} className="detail-tag">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="quick-info-box">
                {QUICK_FACTS(room).map((fact) => (
                  <div key={fact.label} className="quick-info-item">
                    <span className="quick-info-icon">{fact.icon}</span>
                    <span className="quick-info-label">{fact.label}</span>
                    <span className="quick-info-value">{fact.value}</span>
                  </div>
                ))}
              </div>

              <div className="detail-description">
                <h2>Mô tả</h2>
                <p>{room.description}</p>
              </div>
            </div>

            <aside className="detail-sidebar">
              <div className="sidebar-card price-card">
                <p className="price-amount">{room.price}</p>
                <div className="price-stats">
                  <span>📐 {room.area}</span>
                  <span>📍 {room.location}</span>
                  <span>🏷️ {room.status}</span>
                </div>
                <div className="price-actions">
                  <button type="button" className="btn btn-primary">
                    Liên hệ ngay
                  </button>
                  <button type="button" className="btn btn-outline">
                    Nhắn tin
                  </button>
                </div>
              </div>

              <div className="sidebar-card owner-card">
                <PlaceholderImage src={roomOwner.avatar} alt={roomOwner.name} className="owner-avatar" />
                <div>
                  <p className="owner-name">{roomOwner.name}</p>
                  <p className="owner-rating">
                    ⭐ {roomOwner.rating} · {roomOwner.reviews} đánh giá
                  </p>
                  <p className="owner-joined">{roomOwner.joined}</p>
                </div>
                <button type="button" className="btn btn-outline owner-more">
                  Xem thêm
                </button>
              </div>

              <div className="sidebar-card address-card">
                <p className="address-card-title">Địa chỉ</p>
                <div className="map-placeholder">Bản đồ Google Map</div>
                <button type="button" className="btn btn-outline">
                  Xem Map
                </button>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
