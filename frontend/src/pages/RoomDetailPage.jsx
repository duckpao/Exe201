import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import SiteHeader from '../components/site/SiteHeader.jsx'
import SiteFooter from '../components/site/SiteFooter.jsx'
import PlaceholderImage from '../components/site/PlaceholderImage.jsx'
import ListingMapCard from '../components/site/ListingMapCard.jsx'
import FavoriteButton from '../components/site/FavoriteButton.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { getRoom } from '../services/roomService.js'
import { startConversation } from '../services/conversationService.js'
import '../styles/site.css'
import { Star, MapPin, BadgeDollarSign, Home, Maximize, Bed, Bath, Armchair } from 'lucide-react';

const QUICK_FACTS = (room) => [
  { icon: <Maximize size={16} />, label: 'Diện tích', value: room.area },
  { icon: <Bed size={16} />, label: 'Phòng ngủ', value: `${room.bedrooms} phòng` },
  { icon: <Bath size={16} />, label: 'Phòng tắm', value: `${room.bathrooms} phòng` },
  { icon: <Armchair size={16} />, label: 'Nội thất', value: room.tag },
  { icon: <BadgeDollarSign size={16} />, label: 'Giá thuê', value: room.price },
]

export default function RoomDetailPage() {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [contactError, setContactError] = useState('')
  const [starting, setStarting] = useState(false)

  useEffect(() => {
    let ignore = false
    setLoading(true)
    getRoom(roomId)
      .then((data) => {
        if (!ignore) setRoom(data)
      })
      .catch((err) => {
        if (!ignore) setError(err.message)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [roomId])

  async function handleMessage() {
    if (!user) {
      navigate('/login')
      return
    }
    setContactError('')
    setStarting(true)
    try {
      const conversation = await startConversation('room', room.id)
      navigate(`/tin-nhan/${conversation.id}`)
    } catch (err) {
      setContactError(err.message)
    } finally {
      setStarting(false)
    }
  }

  if (loading) {
    return (
      <div className="site-page">
        <SiteHeader />
        <main className="site-main">
          <p className="listing-status">Đang tải thông tin phòng trọ...</p>
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
            <h1>Không tìm thấy phòng trọ này</h1>
            <p>Phòng trọ có thể đã bị gỡ hoặc đường dẫn không đúng.</p>
            <Link to="/phong-tro" className="btn btn-primary">
              Về danh sách phòng trọ
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
            <Link to="/phong-tro">Phòng trọ</Link>
            <span>/</span>
            <span>
              {room.area} - {room.tag}
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
              <p className="detail-address"><MapPin size={16} /> {room.address}</p>
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
                  <span><Maximize size={16} /> {room.area}</span>
                  <span><Bed size={16} /> {room.bedrooms} PN</span>
                  <span><Bath size={16} /> {room.bathrooms} WC</span>
                </div>
                {contactError && <p className="banner banner-error visible">{contactError}</p>}
                <div className="price-actions">
                  {room.owner.phone ? (
                    <a href={`tel:${room.owner.phone}`} className="btn btn-primary">
                      Liên hệ ngay
                    </a>
                  ) : null}
                  <button type="button" className="btn btn-outline" onClick={handleMessage} disabled={starting}>
                    {starting ? 'Đang mở...' : 'Nhắn tin'}
                  </button>
                  <FavoriteButton entityType="room" entityId={room.id} />
                </div>
              </div>

              <div className="sidebar-card owner-card">
                <PlaceholderImage src={room.owner.avatar} alt={room.owner.name} className="owner-avatar" />
                <div>
                  <p className="owner-name">{room.owner.name}</p>
                  <p className="owner-rating">
                    <Star size={16} /> {room.owner.rating || 'Chưa có đánh giá'}
                    {room.owner.rating ? ` · ${room.owner.reviews} đánh giá` : ''}
                  </p>
                  <p className="owner-joined">{room.owner.joined}</p>
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
