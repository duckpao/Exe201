import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Pencil, Trash2 } from 'lucide-react'
import SiteHeader from '../components/site/SiteHeader.jsx'
import SiteFooter from '../components/site/SiteFooter.jsx'
import PlaceholderImage from '../components/site/PlaceholderImage.jsx'
import AvailabilityRibbon from '../components/site/AvailabilityRibbon.jsx'
import ListingEditForm from '../components/site/ListingEditForm.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { listConversations } from '../services/conversationService.js'
import { deleteMyListing, listMyListings } from '../services/userService.js'
import '../styles/site.css'

const SECTIONS = [
  ['overview', 'Tổng quan'],
  ['rooms', 'Bài đăng trọ'],
  ['messages', 'Tin nhắn khách thuê'],
]

function useManageData(enabled) {
  const [state, setState] = useState({ rooms: [], conversations: [], loading: true, error: '' })

  const load = useCallback(() => {
    setState((prev) => ({ ...prev, loading: true, error: '' }))
    Promise.all([listMyListings(), listConversations()])
      .then(([listings, conversations]) =>
        setState({
          rooms: (listings.data || []).filter((item) => item.type === 'room'),
          conversations: (conversations.data || []).filter((item) => item.listingType === 'room' && item.isOwner),
          loading: false,
          error: '',
        })
      )
      .catch((error) => setState((prev) => ({ ...prev, loading: false, error: error.message })))
  }, [])

  useEffect(() => {
    if (enabled) load()
  }, [enabled, load])

  return { ...state, reload: load, setRooms: (rooms) => setState((prev) => ({ ...prev, rooms })) }
}

function Overview({ rooms, conversations }) {
  const stats = useMemo(() => {
    const available = rooms.filter((room) => room.status === 'available' && !room.adminHidden).length
    const rented = rooms.filter((room) => room.status === 'rented').length
    const hidden = rooms.filter((room) => room.adminHidden).length
    const unread = conversations.reduce((sum, item) => sum + (item.unreadCount || 0), 0)
    return { total: rooms.length, available, rented, hidden, unread }
  }, [rooms, conversations])

  const items = [
    ['Tổng bài đăng trọ', stats.total],
    ['Còn phòng', stats.available],
    ['Hết phòng', stats.rented],
    ['Bị quản trị viên ẩn', stats.hidden],
    ['Tin nhắn chưa đọc', stats.unread],
  ]

  return (
    <div className="manage-stats">
      {items.map(([label, value]) => (
        <div key={label} className="manage-stat">
          <span className="manage-stat-value">{value}</span>
          <span className="manage-stat-label">{label}</span>
        </div>
      ))}
    </div>
  )
}

function RoomManager({ rooms, onChanged, onSaved }) {
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  async function handleDelete(id) {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài đăng này?')) return
    try {
      await deleteMyListing('room', id)
      onChanged()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  if (rooms.length === 0) {
    return (
      <p>
        Bạn chưa đăng phòng nào. <Link to="/phong-tro/dang-bai">Đăng phòng đầu tiên</Link>
      </p>
    )
  }

  return (
    <div className="settings-list">
      {error && <div className="listing-error" role="alert"><p>{error}</p></div>}
      {rooms.map((room) => (
        <div className="settings-list-item settings-list-item-column" key={room.id}>
          <div className="settings-list-item-row">
            <div className="manage-thumb">
              <PlaceholderImage src={room.image} alt={room.title} className="settings-list-thumb" />
              <AvailabilityRibbon available={room.status === 'available'} />
            </div>
            <div className="settings-list-body">
              <Link to={room.path} className="settings-list-title">{room.title}</Link>
              <div className="settings-list-meta">
                {room.price && <span className="settings-list-price">{room.price}</span>}
                {room.adminHidden && <span className="settings-badge settings-badge-hidden">Bị quản trị viên ẩn</span>}
                <span className="settings-list-date">Đăng lúc: {new Date(room.createdAt).toLocaleDateString('vi-VN')}</span>
              </div>
              {room.adminHidden && (
                <div className="settings-hidden-notice" role="note">
                  <strong>Lý do ẩn:</strong> {room.adminHiddenReason}
                </div>
              )}
            </div>
            <div className="settings-list-actions">
              <button type="button" className="btn btn-outline" onClick={() => setEditingId(editingId === room.id ? null : room.id)}>
                <Pencil size={15} /> Sửa
              </button>
              <button type="button" className="btn btn-outline settings-btn-danger" onClick={() => handleDelete(room.id)}>
                <Trash2 size={15} /> Xóa bài
              </button>
            </div>
          </div>
          {editingId === room.id && (
            <ListingEditForm
              item={room}
              onCancel={() => setEditingId(null)}
              onSaved={(updated) => {
                setEditingId(null)
                if (updated) onSaved(updated)
                else onChanged()
              }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

function TenantMessages({ conversations }) {
  if (conversations.length === 0) {
    return <p>Chưa có khách thuê nào nhắn tin về phòng của bạn.</p>
  }
  return (
    <div className="settings-list">
      {conversations.map((item) => (
        <Link key={item.id} to={`/tin-nhan/${item.id}`} className="settings-list-item manage-conversation">
          <PlaceholderImage src={item.counterpart.avatar} alt="" className="review-avatar" />
          <div className="settings-list-body">
            <span className="settings-list-title">{item.counterpart.name}</span>
            <span className="settings-list-meta">Về: {item.listingTitle}</span>
            {item.lastMessage && <span className="manage-last-message">{item.lastMessage}</span>}
          </div>
          {item.unreadCount > 0 && <span className="settings-nav-badge">{item.unreadCount}</span>}
        </Link>
      ))}
    </div>
  )
}

export default function ManageRoomsPage() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [section, setSection] = useState('overview')
  const isLandlord = user?.role === 'landlord'
  const { rooms, conversations, loading, error, reload, setRooms } = useManageData(isLandlord)

  useEffect(() => {
    if (!authLoading && !user) navigate('/login')
  }, [authLoading, user, navigate])

  if (authLoading || !user) return null

  if (!isLandlord) {
    return (
      <div className="site-page">
        <SiteHeader />
        <main className="site-main">
          <div className="post-layout">
            <div className="notice-box info">
              <p>Khu vực quản lý trọ dành cho tài khoản chủ trọ.</p>
              <Link to="/" className="btn btn-primary">Về trang chủ</Link>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  const unread = conversations.reduce((sum, item) => sum + (item.unreadCount || 0), 0)

  return (
    <div className="site-page">
      <SiteHeader />
      <main className="site-main settings-page">
        <div className="settings-container">
          <aside className="settings-sidebar">
            <h3>Quản lý trọ</h3>
            <ul>
              {SECTIONS.map(([key, label]) => (
                <li key={key} className={section === key ? 'active' : ''}>
                  <button type="button" aria-current={section === key ? 'page' : undefined} onClick={() => setSection(key)}>
                    {label}
                    {key === 'messages' && unread > 0 && <span className="settings-nav-badge">{unread}</span>}
                  </button>
                </li>
              ))}
              <li>
                <Link to="/phong-tro/dang-bai" className="manage-sidebar-link">Đăng phòng mới</Link>
              </li>
            </ul>
          </aside>

          <section className="settings-content">
            <div className="settings-card">
              <h2>{SECTIONS.find(([key]) => key === section)[1]}</h2>
              <div style={{ marginTop: 20 }}>
                {loading && <p>Đang tải...</p>}
                {!loading && error && (
                  <div className="listing-error" role="alert">
                    <p>{error}</p>
                    <button type="button" className="btn btn-outline" onClick={reload}>Thử lại</button>
                  </div>
                )}
                {!loading && !error && section === 'overview' && <Overview rooms={rooms} conversations={conversations} />}
                {!loading && !error && section === 'rooms' && (
                  <RoomManager
                    rooms={rooms}
                    onChanged={reload}
                    onSaved={(updated) => setRooms(rooms.map((room) => (room.id === updated.id ? updated : room)))}
                  />
                )}
                {!loading && !error && section === 'messages' && <TenantMessages conversations={conversations} />}
              </div>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
