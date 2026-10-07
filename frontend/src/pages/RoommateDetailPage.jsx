import { Link, useParams } from 'react-router-dom'
import SiteHeader from '../components/site/SiteHeader.jsx'
import SiteFooter from '../components/site/SiteFooter.jsx'
import PlaceholderImage from '../components/site/PlaceholderImage.jsx'
import ImageGallery from '../components/site/ImageGallery.jsx'
import ListingMapCard from '../components/site/ListingMapCard.jsx'
import MessageOwnerButton from '../components/site/MessageOwnerButton.jsx'
import FavoriteButton from '../components/site/FavoriteButton.jsx'
import { useListingDetail } from '../hooks/useListingDetail.js'
import { getRoommate } from '../services/roommateService.js'
import '../styles/site.css'
import { MapPin, BadgeDollarSign, Home, Maximize, Bed, User, Users, Calendar } from 'lucide-react';

// Khớp ENUM roommate_listings.room_type
const ROOM_TYPE_LABELS = {
  has_room: 'Đã có phòng, cần tìm người ở ghép',
  looking_for_room: 'Đang tìm phòng và người ở ghép',
}

const QUICK_FACTS = (roommate) => [
  { icon: <User size={16} />, label: 'Tuổi', value: roommate.age ? `${roommate.age} tuổi` : 'Chưa cập nhật' },
  { icon: <Users size={16} />, label: 'Giới tính mong muốn', value: roommate.gender },
  { icon: <Bed size={16} />, label: 'Nhu cầu', value: ROOM_TYPE_LABELS[roommate.roomType] || 'Chưa cập nhật' },
  { icon: <BadgeDollarSign size={16} />, label: 'Ngân sách', value: roommate.price || 'Chưa cập nhật' },
]

export default function RoommateDetailPage() {
  const { roommateId } = useParams()
  const { data: roommate, loading, error } = useListingDetail(getRoommate, roommateId)

  if (loading) {
    return (
      <div className="site-page">
        <SiteHeader />
        <main className="site-main">
          <p className="listing-status">Đang tải thông tin bài tìm roommate...</p>
        </main>
        <SiteFooter />
      </div>
    )
  }

  if (error || !roommate) {
    return (
      <div className="site-page">
        <SiteHeader />
        <main className="site-main">
          <div className="coming-soon">
            <h1>Không tìm thấy bài đăng này</h1>
            <p>Bài đăng có thể đã bị gỡ hoặc đường dẫn không đúng.</p>
            <Link to="/tim-roommate" className="btn btn-primary">
              Về danh sách Tìm Roommate
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
            <Link to="/tim-roommate">Tìm Roommate</Link>
            <span>/</span>
            <span>{roommate.title}</span>
          </nav>

          <div className="detail-layout">
            <div className="detail-main">
              <ImageGallery images={roommate.gallery} title={roommate.title} />

              <h1 className="detail-title">{roommate.title}</h1>
              <p className="detail-address"><MapPin size={16} /> {roommate.address || 'Chưa cập nhật địa chỉ'}</p>
              {roommate.tags.length > 0 && (
                <div className="detail-tags">
                  {roommate.tags.map((tag) => (
                    <span key={tag} className="detail-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="quick-info-box">
                {QUICK_FACTS(roommate).map((fact) => (
                  <div key={fact.label} className="quick-info-item">
                    <span className="quick-info-icon">{fact.icon}</span>
                    <span className="quick-info-label">{fact.label}</span>
                    <span className="quick-info-value">{fact.value}</span>
                  </div>
                ))}
              </div>

              <div className="detail-description">
                <h2>Giới thiệu bản thân</h2>
                <p>{roommate.description || 'Người đăng chưa bổ sung giới thiệu.'}</p>
              </div>

              {roommate.placeInfo && (
                <div className="detail-description">
                  <h2>Thông tin về phòng / nơi ở</h2>
                  <p>{roommate.placeInfo}</p>
                </div>
              )}
            </div>

            <aside className="detail-sidebar">
              <div className="sidebar-card price-card">
                <p className="price-amount">{roommate.price || 'Chưa có ngân sách'}</p>
                <div className="price-stats">
                  {roommate.area && <span><Maximize size={16} /> {roommate.area}</span>}
                  <span><Users size={16} /> {roommate.gender}</span>
                  {roommate.moveInDate && <span><Calendar size={16} /> {roommate.moveInDate}</span>}
                </div>
                <div className="price-actions" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <MessageOwnerButton
                    listingType="roommate"
                    listingId={roommate.id}
                    ownerId={roommate.ownerId}
                    className="btn btn-primary"
                  />
                  <FavoriteButton entityType="roommate" entityId={roommate.id} />
                </div>
              </div>

              <div className="sidebar-card owner-card">
                <PlaceholderImage src={roommate.avatar} alt={roommate.name} className="owner-avatar" />
                <div>
                  <p className="owner-name">{roommate.name}</p>
                  <p className="owner-joined">Đăng ngày {roommate.date}</p>
                </div>
              </div>

              <ListingMapCard
                title={roommate.title}
                latitude={roommate.latitude}
                longitude={roommate.longitude}
              />
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
