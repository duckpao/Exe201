import { Link, useParams } from 'react-router-dom'
import SiteHeader from '../components/site/SiteHeader.jsx'
import SiteFooter from '../components/site/SiteFooter.jsx'
import PlaceholderImage from '../components/site/PlaceholderImage.jsx'
import MessageOwnerButton from '../components/site/MessageOwnerButton.jsx'
import { useListingDetail } from '../hooks/useListingDetail.js'
import { getVehicle } from '../services/vehicleService.js'
import '../styles/site.css'

// Khớp ENUM vehicles.vehicle_type
const VEHICLE_TYPE_LABELS = {
  motorbike: 'Xe máy',
  van: 'Xe van',
  truck: 'Xe tải',
}

const QUICK_FACTS = (vehicle) => [
  { icon: '🚚', label: 'Loại xe', value: VEHICLE_TYPE_LABELS[vehicle.vehicleType] || 'Chưa cập nhật' },
  { icon: '🧰', label: 'Loại dịch vụ', value: vehicle.serviceType || 'Chưa cập nhật' },
  { icon: '⚖️', label: 'Tải trọng', value: vehicle.capacity || 'Chưa cập nhật' },
  { icon: '🔖', label: 'Biển số', value: vehicle.licensePlate },
]

export default function TransportDetailPage() {
  const { vehicleId } = useParams()
  const { data: vehicle, loading, error } = useListingDetail(getVehicle, vehicleId)

  if (loading) {
    return (
      <div className="site-page">
        <SiteHeader />
        <main className="site-main">
          <p className="listing-status">Đang tải thông tin dịch vụ vận chuyển...</p>
        </main>
        <SiteFooter />
      </div>
    )
  }

  if (error || !vehicle) {
    return (
      <div className="site-page">
        <SiteHeader />
        <main className="site-main">
          <div className="coming-soon">
            <h1>Không tìm thấy dịch vụ này</h1>
            <p>Dịch vụ có thể đã bị gỡ hoặc đường dẫn không đúng.</p>
            <Link to="/van-chuyen-do" className="btn btn-primary">
              Về danh sách Vận chuyển đồ
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
            <Link to="/van-chuyen-do">Vận chuyển đồ</Link>
            <span>/</span>
            <span>{vehicle.title}</span>
          </nav>

          <div className="detail-layout">
            <div className="detail-main">
              <div className="detail-gallery">
                <PlaceholderImage src={vehicle.image} alt={vehicle.title} className="detail-gallery-main" />
                {vehicle.gallery.length > 1 && (
                  <div className="detail-gallery-thumbs">
                    {vehicle.gallery.map((src, index) => (
                      <PlaceholderImage key={src} src={src} alt={`${vehicle.title} - ảnh ${index + 1}`} />
                    ))}
                  </div>
                )}
              </div>

              <h1 className="detail-title">{vehicle.title}</h1>
              <p className="detail-address">
                ⭐ {vehicle.rating || 'Chưa có đánh giá'}
                {vehicle.rating ? ` · ${vehicle.reviews} đánh giá` : ''}
              </p>
              {vehicle.tags.length > 0 && (
                <div className="detail-tags">
                  {vehicle.tags.map((tag) => (
                    <span key={tag} className="detail-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="quick-info-box">
                {QUICK_FACTS(vehicle).map((fact) => (
                  <div key={fact.label} className="quick-info-item">
                    <span className="quick-info-icon">{fact.icon}</span>
                    <span className="quick-info-label">{fact.label}</span>
                    <span className="quick-info-value">{fact.value}</span>
                  </div>
                ))}
              </div>

              <div className="detail-description">
                <h2>Mô tả dịch vụ</h2>
                <p>{vehicle.description || 'Chủ xe chưa bổ sung mô tả.'}</p>
              </div>
            </div>

            <aside className="detail-sidebar">
              <div className="sidebar-card price-card">
                <p className="price-amount">{vehicle.price || 'Liên hệ để báo giá'}</p>
                <div className="price-stats">
                  {vehicle.pricePerHour && <span>⏱️ {vehicle.pricePerHour}</span>}
                  {vehicle.pricePerTrip && <span>🛣️ {vehicle.pricePerTrip}</span>}
                  {vehicle.capacity && <span>⚖️ {vehicle.capacity}</span>}
                </div>
                <div className="price-actions">
                  <MessageOwnerButton
                    listingType="vehicle"
                    listingId={vehicle.id}
                    ownerId={vehicle.ownerId}
                    className="btn btn-primary"
                  />
                </div>
              </div>

              <div className="sidebar-card owner-card">
                <PlaceholderImage src={vehicle.owner.avatar} alt={vehicle.owner.name} className="owner-avatar" />
                <div>
                  <p className="owner-name">{vehicle.owner.name}</p>
                  <p className="owner-joined">{vehicle.owner.joined}</p>
                </div>
              </div>

              <div className="sidebar-card">
                <p className="address-card-title">Cần chuyển đồ?</p>
                <p className="owner-joined">
                  Nhắn tin để trao đổi điểm đón, điểm trả và thời gian với chủ xe trước khi chốt chuyến.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
