import { Link, useParams } from 'react-router-dom'
import SiteHeader from '../components/site/SiteHeader.jsx'
import SiteFooter from '../components/site/SiteFooter.jsx'
import PlaceholderImage from '../components/site/PlaceholderImage.jsx'
import { getPassItemDetail, roomOwner } from '../data/mockListings.js'
import '../styles/site.css'

const QUICK_FACTS = (item) => [
  { icon: '🏷️', label: 'Loại đồ', value: item.category },
  { icon: '✨', label: 'Tình trạng', value: item.condition },
  { icon: '📍', label: 'Khu vực', value: item.location },
  { icon: '💰', label: 'Giá bán', value: item.price },
]

export default function PassItemDetailPage() {
  const { itemId } = useParams()
  const item = getPassItemDetail(itemId)

  if (!item) {
    return (
      <div className="site-page">
        <SiteHeader />
        <main className="site-main">
          <div className="coming-soon">
            <h1>Không tìm thấy sản phẩm này</h1>
            <p>Bài đăng có thể đã bị gỡ hoặc đường dẫn không đúng.</p>
            <Link to="/pass-do" className="btn btn-primary">
              Về danh sách Pass Đồ
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
            <Link to="/pass-do">Pass Đồ</Link>
            <span>/</span>
            <span>
              {item.category} - {item.location}
            </span>
          </nav>

          <div className="detail-layout">
            <div className="detail-main">
              <div className="detail-gallery">
                <PlaceholderImage src={item.image} alt={item.title} className="detail-gallery-main" />
                <div className="detail-gallery-thumbs">
                  {item.gallery.map((src, index) => (
                    <PlaceholderImage key={src} src={src} alt={`${item.title} - ảnh ${index + 1}`} />
                  ))}
                </div>
              </div>

              <h1 className="detail-title">{item.title}</h1>
              <p className="detail-address">📍 {item.address}</p>
              <div className="detail-tags">
                {item.tags.map((tag) => (
                  <span key={tag} className="detail-tag">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="quick-info-box">
                {QUICK_FACTS(item).map((fact) => (
                  <div key={fact.label} className="quick-info-item">
                    <span className="quick-info-icon">{fact.icon}</span>
                    <span className="quick-info-label">{fact.label}</span>
                    <span className="quick-info-value">{fact.value}</span>
                  </div>
                ))}
              </div>

              <div className="detail-description">
                <h2>Mô tả</h2>
                <p>{item.description}</p>
              </div>
            </div>

            <aside className="detail-sidebar">
              <div className="sidebar-card price-card">
                <p className="price-amount">{item.price}</p>
                <div className="price-stats">
                  <span>🏷️ {item.category}</span>
                  <span>✨ {item.condition}</span>
                  <span>📍 {item.location}</span>
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
