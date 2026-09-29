import { Link, useParams } from 'react-router-dom'
import SiteHeader from '../components/site/SiteHeader.jsx'
import SiteFooter from '../components/site/SiteFooter.jsx'
import PlaceholderImage from '../components/site/PlaceholderImage.jsx'
import ListingMapCard from '../components/site/ListingMapCard.jsx'
import MessageOwnerButton from '../components/site/MessageOwnerButton.jsx'
import FavoriteButton from '../components/site/FavoriteButton.jsx'
import { useListingDetail } from '../hooks/useListingDetail.js'
import { getItem } from '../services/itemService.js'
import '../styles/site.css'
import { Tag, Sparkles, MapPin, BadgeDollarSign, Home, Pin } from 'lucide-react';

const QUICK_FACTS = (item) => [
  { icon: <Tag size={16} />, label: 'Loại đồ', value: item.category },
  { icon: <Sparkles size={16} />, label: 'Tình trạng', value: item.condition || 'Chưa cập nhật' },
  { icon: <MapPin size={16} />, label: 'Khu vực', value: item.location || 'Chưa cập nhật' },
  { icon: <BadgeDollarSign size={16} />, label: 'Giá bán', value: item.price || 'Liên hệ' },
]

export default function PassItemDetailPage() {
  const { itemId } = useParams()
  const { data: item, loading, error } = useListingDetail(getItem, itemId)

  if (loading) {
    return (
      <div className="site-page">
        <SiteHeader />
        <main className="site-main">
          <p className="listing-status">Đang tải thông tin sản phẩm...</p>
        </main>
        <SiteFooter />
      </div>
    )
  }

  if (error || !item) {
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
            <Link to="/"><Home size={16} /></Link>
            <span>/</span>
            <Link to="/pass-do">Pass Đồ</Link>
            <span>/</span>
            <span>{item.title}</span>
          </nav>

          <div className="detail-layout">
            <div className="detail-main">
              <div className="detail-gallery">
                <PlaceholderImage src={item.image} alt={item.title} className="detail-gallery-main" />
                {item.gallery.length > 1 && (
                  <div className="detail-gallery-thumbs">
                    {item.gallery.map((src, index) => (
                      <PlaceholderImage key={src} src={src} alt={`${item.title} - ảnh ${index + 1}`} />
                    ))}
                  </div>
                )}
              </div>

              <h1 className="detail-title">{item.title}</h1>
              <p className="detail-address"><MapPin size={16} /> {item.address || 'Chưa cập nhật địa chỉ'}</p>
              <div className="detail-tags">
                {item.tags.filter(Boolean).map((tag) => (
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
                <p>{item.description || 'Người đăng chưa bổ sung mô tả.'}</p>
              </div>
            </div>

            <aside className="detail-sidebar">
              <div className="sidebar-card price-card">
                <p className="price-amount">{item.price || 'Liên hệ'}</p>
                <div className="price-stats">
                  <span><Tag size={16} /> {item.category}</span>
                  {item.condition && <span><Sparkles size={16} /> {item.condition}</span>}
                  <span><Pin size={16} /> {item.status}</span>
                </div>
                <div className="price-actions" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <MessageOwnerButton
                    listingType="item"
                    listingId={item.id}
                    ownerId={item.ownerId}
                    className="btn btn-primary"
                  />
                  <FavoriteButton entityType="item" entityId={item.id} />
                </div>
              </div>

              <div className="sidebar-card owner-card">
                <PlaceholderImage src={item.poster.avatar} alt={item.poster.name} className="owner-avatar" />
                <div>
                  <p className="owner-name">{item.poster.name}</p>
                  <p className="owner-joined">Người đăng bài</p>
                </div>
              </div>

              <ListingMapCard title={item.title} latitude={item.latitude} longitude={item.longitude} />
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
