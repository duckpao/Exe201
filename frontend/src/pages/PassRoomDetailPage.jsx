import { Link, useParams } from 'react-router-dom'
import SiteHeader from '../components/site/SiteHeader.jsx'
import SiteFooter from '../components/site/SiteFooter.jsx'
import PlaceholderImage from '../components/site/PlaceholderImage.jsx'
import ListingMapCard from '../components/site/ListingMapCard.jsx'
import MessageOwnerButton from '../components/site/MessageOwnerButton.jsx'
import { useListingDetail } from '../hooks/useListingDetail.js'
import { getPassRoom } from '../services/passRoomService.js'
import '../styles/site.css'

const QUICK_FACTS = (room) => [
  { icon: '📐', label: 'Diện tích', value: room.area || 'Chưa cập nhật' },
  { icon: '📍', label: 'Khu vực', value: room.location || 'Chưa cập nhật' },
  { icon: '🏷️', label: 'Trạng thái', value: room.status },
  { icon: '💰', label: 'Giá thuê', value: room.price || 'Liên hệ' },
]

export default function PassRoomDetailPage() {
  const { roomId } = useParams()
  const { data: room, loading, error } = useListingDetail(getPassRoom, roomId)

  if (loading) {
    return (
      <div className="site-page">
        <SiteHeader />
        <main className="site-main">
          <p className="listing-status">Đang tải thông tin bài pass phòng...</p>
        </main>
        <SiteFooter />
      </div>
    )
  }

  if (error || !room) {
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
            <span>{room.title}</span>
          </nav>

          <div className="detail-layout">
            <div className="detail-main">
              <div className="detail-gallery">
                <PlaceholderImage src={room.image} alt={room.title} className="detail-gallery-main" />
                {room.gallery.length > 1 && (
                  <div className="detail-gallery-thumbs">
                    {room.gallery.map((src, index) => (
                      <PlaceholderImage key={src} src={src} alt={`${room.title} - ảnh ${index + 1}`} />
                    ))}
                  </div>
                )}
              </div>

              <h1 className="detail-title">{room.title}</h1>
              <p className="detail-address">📍 {room.address || 'Chưa cập nhật địa chỉ'}</p>
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
                <p>{room.description || 'Người đăng chưa bổ sung mô tả.'}</p>
                {room.reason && <p>Lý do pass: {room.reason}</p>}
              </div>
            </div>

            <aside className="detail-sidebar">
              <div className="sidebar-card price-card">
                <p className="price-amount">{room.price || 'Liên hệ'}</p>
                <div className="price-stats">
                  {room.area && <span>📐 {room.area}</span>}
                  {room.maxOccupants && <span>👥 {room.maxOccupants} người</span>}
                  <span>🏷️ {room.status}</span>
                </div>
                {room.compensationFee && <p className="price-note">Phí bù: {room.compensationFee}</p>}
                <div className="price-actions">
                  <MessageOwnerButton
                    listingType="pass_room"
                    listingId={room.id}
                    ownerId={room.ownerId}
                    className="btn btn-primary"
                  />
                </div>
              </div>

              <div className="sidebar-card owner-card">
                <PlaceholderImage src={room.poster.avatar} alt={room.poster.name} className="owner-avatar" />
                <div>
                  <p className="owner-name">{room.poster.name}</p>
                  <p className="owner-joined">Người đăng bài</p>
                </div>
              </div>

              <ListingMapCard title={room.title} latitude={room.latitude} longitude={room.longitude} />
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
