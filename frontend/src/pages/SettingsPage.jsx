import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import SiteHeader from '../components/site/SiteHeader.jsx'
import SiteFooter from '../components/site/SiteFooter.jsx'
import PlaceholderImage from '../components/site/PlaceholderImage.jsx'
import { listFavorites, removeFavorite } from '../services/favoriteService.js'
import ListingEditForm from '../components/site/ListingEditForm.jsx'
import { changePassword, deleteMyListing, listMyListings, updateProfile } from '../services/userService.js'
import { listNotifications, markAllNotificationsRead, markNotificationRead } from '../services/notificationService.js'
import { Pencil, Trash2, HeartOff } from 'lucide-react'
import '../styles/site.css'

function FavoriteList() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchFavorites = () => {
    setLoading(true)
    setError('')
    listFavorites()
      .then((data) => setFavorites(data.data || []))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchFavorites()
  }, [])

  const handleUnfavorite = async (entityType, entityId) => {
    try {
      await removeFavorite(entityType, entityId)
      setFavorites((prev) => prev.filter((f) => !(f.entityType === entityType && f.entityId === entityId)))
    } catch (requestError) {
      setError(requestError.message || 'Không thể bỏ lưu, vui lòng thử lại.')
    }
  }

  if (loading) return <p>Đang tải...</p>
  if (error) return <div className="listing-error" role="alert"><p>{error}</p><button type="button" className="btn btn-outline" onClick={fetchFavorites}>Thử lại</button></div>
  if (favorites.length === 0) return <p>Bạn chưa lưu bài đăng nào.</p>

  return (
    <div className="settings-list">
      {favorites.map((f) => {
        const { listing } = f
        return (
          <div className="settings-list-item" key={f.id}>
            <PlaceholderImage
              src={listing?.image}
              alt={listing?.title || ''}
              className="settings-list-thumb"
            />
            <div className="settings-list-body">
              {listing ? (
                <Link to={listing.path} className="settings-list-title">
                  {listing.title}
                </Link>
              ) : (
                <span className="settings-list-title settings-list-title-gone">
                  Bài đăng đã bị gỡ hoặc xóa
                </span>
              )}
              <div className="settings-list-meta">
                <span className="settings-badge">{listing?.label || f.entityType}</span>
                {listing?.price && <span className="settings-list-price">{listing.price}</span>}
                <span className="settings-list-date">
                  Đã lưu lúc: {new Date(f.createdAt).toLocaleString('vi-VN')}
                </span>
              </div>
            </div>
            <div className="settings-list-actions">
              <button
                type="button"
                className="btn btn-outline settings-btn-danger"
                onClick={() => handleUnfavorite(f.entityType, f.entityId)}
              >
                <HeartOff size={15} /> Bỏ lưu
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function NotificationList({ onChanged }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchNotifications = () => {
    setLoading(true)
    setError('')
    listNotifications()
      .then((data) => setItems(data.data || []))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const handleRead = async (item) => {
    if (item.isRead) return
    try {
      await markNotificationRead(item.id)
      setItems((prev) => prev.map((entry) => (entry.id === item.id ? { ...entry, isRead: true } : entry)))
      onChanged()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const handleReadAll = async () => {
    try {
      await markAllNotificationsRead()
      setItems((prev) => prev.map((entry) => ({ ...entry, isRead: true })))
      onChanged()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  if (loading) return <p>Đang tải...</p>
  if (error) return <div className="listing-error" role="alert"><p>{error}</p><button type="button" className="btn btn-outline" onClick={fetchNotifications}>Thử lại</button></div>
  if (items.length === 0) return <p>Bạn chưa có thông báo nào.</p>

  return (
    <>
      {items.some((item) => !item.isRead) && (
        <div className="notification-toolbar">
          <button type="button" className="btn btn-outline" onClick={handleReadAll}>Đánh dấu tất cả đã đọc</button>
        </div>
      )}
      <div className="notification-list">
        {items.map((item) => (
          <div key={item.id} className={`notification-item ${item.isRead ? '' : 'unread'}`}>
            <p className="notification-item-title">{item.title}</p>
            {item.body && <p className="notification-item-body"><strong>Lý do:</strong> {item.body}</p>}
            <div className="notification-item-meta">
              <span>{new Date(item.createdAt).toLocaleString('vi-VN')}</span>
              {!item.isRead && (
                <button type="button" className="btn btn-outline" onClick={() => handleRead(item)}>Đã đọc</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function MyListingsList() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingKey, setEditingKey] = useState(null)
  const [error, setError] = useState('')

  const fetchListings = () => {
    setLoading(true)
    setError('')
    listMyListings()
      .then((data) => setListings(data.data || []))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchListings()
  }, [])

  const handleDelete = async (type, id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài đăng này?')) return
    try {
      await deleteMyListing(type, id)
      fetchListings()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const handleSaved = (updated, key) => {
    setEditingKey(null)
    if (updated) {
      setListings((prev) => prev.map((item) => (`${item.type}-${item.id}` === key ? updated : item)))
    } else {
      fetchListings()
    }
  }

  if (loading) return <p>Đang tải...</p>
  if (error) return <div className="listing-error" role="alert"><p>{error}</p><button type="button" className="btn btn-outline" onClick={fetchListings}>Thử lại</button></div>
  if (listings.length === 0) return <p>Bạn chưa đăng bài nào.</p>

  return (
    <div className="settings-list">
      {listings.map((item) => {
        const key = `${item.type}-${item.id}`
        const isEditing = editingKey === key
        return (
          <div className="settings-list-item settings-list-item-column" key={key}>
            <div className="settings-list-item-row">
              <PlaceholderImage src={item.image} alt={item.title} className="settings-list-thumb" />
              <div className="settings-list-body">
                <Link to={item.path} className="settings-list-title">
                  {item.title}
                </Link>
                <div className="settings-list-meta">
                  <span className="settings-badge">{item.label}</span>
                  {item.price && <span className="settings-list-price">{item.price}</span>}
                  <span className="settings-badge settings-badge-status">{item.status}</span>
                  {item.adminHidden && (
                    <span className="settings-badge settings-badge-hidden">Bị quản trị viên ẩn</span>
                  )}
                  <span className="settings-list-date">
                    Đăng lúc: {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
                {item.adminHidden && (
                  <div className="settings-hidden-notice" role="note">
                    <strong>Lý do ẩn:</strong> {item.adminHiddenReason}
                  </div>
                )}
              </div>
              <div className="settings-list-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setEditingKey(isEditing ? null : key)}
                >
                  <Pencil size={15} /> Sửa
                </button>
                <button
                  type="button"
                  className="btn btn-outline settings-btn-danger"
                  onClick={() => handleDelete(item.type, item.id)}
                >
                  <Trash2 size={15} /> Xóa bài
                </button>
              </div>
            </div>
            {isEditing && (
              <ListingEditForm
                item={item}
                onCancel={() => setEditingKey(null)}
                onSaved={(updated) => handleSaved(updated, key)}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function SettingsPage() {
  const { user, refreshUser } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [fullName, setFullName] = useState(user?.full_name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(0)

  const refreshUnreadNotifications = () => {
    listNotifications()
      .then((data) => setUnreadNotifications(data.unreadCount || 0))
      .catch(() => {})
  }

  useEffect(() => {
    refreshUnreadNotifications()
  }, [])

  const fileInputRef = useRef(null)
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar_url || '')
  const [avatarFile, setAvatarFile] = useState(null)

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    const formData = new FormData()
    formData.append('fullName', fullName)
    formData.append('phone', phone)
    if (avatarFile) formData.append('avatar', avatarFile)

    try {
      const data = await updateProfile(formData)
      await refreshUser()
      setMessage({ type: 'success', text: 'Cập nhật hồ sơ thành công!' })
      setAvatarPreview(data.user?.avatar_url || avatarPreview)
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })
    try {
      await changePassword(oldPassword, newPassword)
      setMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' })
      setOldPassword('')
      setNewPassword('')
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="site-page">
      <SiteHeader />
      <main className="site-main settings-page">
        <div className="settings-container">
          <aside className="settings-sidebar">
            <h3>Cài đặt</h3>
            <ul>
              {[
                ['profile', 'Hồ sơ cá nhân'],
                ['password', 'Bảo mật & Mật khẩu'],
                ['notifications', 'Thông báo'],
                ['listings', 'Bài đăng của tôi'],
                ['favorites', 'Đã lưu (Yêu thích)'],
                ['system', 'Hệ thống (Thông báo)'],
              ].map(([tab, label]) => (
                <li key={tab} className={activeTab === tab ? 'active' : ''}>
                  <button type="button" aria-current={activeTab === tab ? 'page' : undefined} onClick={() => setActiveTab(tab)}>
                    {label}
                    {tab === 'notifications' && unreadNotifications > 0 && (
                      <span className="settings-nav-badge">{unreadNotifications}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          <section className="settings-content">
            {message.text && (
              <div className={`banner banner-${message.type} visible`} style={{ marginBottom: 20 }}>
                {message.text}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="settings-card">
                <h2>Hồ sơ cá nhân</h2>
                <form onSubmit={handleSaveProfile} className="auth-form" style={{ marginTop: 20 }}>
                  <div className="form-group avatar-upload" style={{ textAlign: 'center', marginBottom: 20 }}>
                    <div className="avatar-preview" style={{ width: 100, height: 100, borderRadius: '50%', background: '#ccc', margin: '0 auto', overflow: 'hidden', cursor: 'pointer' }} onClick={() => fileInputRef.current?.click()}>
                      {avatarPreview ? (
                        <img src={avatarPreview} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ lineHeight: '100px', fontSize: 36, color: '#fff' }}>{user?.full_name?.[0]?.toUpperCase()}</span>
                      )}
                    </div>
                    <input type="file" hidden ref={fileInputRef} accept="image/*" onChange={handleAvatarChange} />
                    <button type="button" className="btn btn-secondary" style={{ marginTop: 10 }} onClick={() => fileInputRef.current?.click()}>Đổi ảnh đại diện</button>
                  </div>
                  <div className="form-group">
                    <label>Họ và tên</label>
                    <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>Số điện thoại</label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'password' && (
              <div className="settings-card">
                <h2>Đổi mật khẩu</h2>
                <form onSubmit={handleChangePassword} className="auth-form" style={{ marginTop: 20 }}>
                  <div className="form-group">
                    <label>Mật khẩu cũ</label>
                    <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>Mật khẩu mới</label>
                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Đang đổi...' : 'Đổi mật khẩu'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="settings-card">
                <h2>Thông báo</h2>
                <div style={{ marginTop: 20 }}>
                  <NotificationList onChanged={refreshUnreadNotifications} />
                </div>
              </div>
            )}

            {activeTab === 'listings' && (
              <div className="settings-card">
                <h2>Bài đăng của tôi</h2>
                <div style={{ marginTop: 20 }}>
                  <MyListingsList />
                </div>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="settings-card">
                <h2>Bài đăng đã lưu</h2>
                <div style={{ marginTop: 20 }}>
                  <FavoriteList />
                </div>
              </div>
            )}

            {activeTab === 'system' && (
              <div className="settings-card">
                <h2>Cài đặt hệ thống</h2>
                <div style={{ marginTop: 20 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked />
                    Nhận thông báo qua email khi có tin nhắn mới
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', marginTop: 15 }}>
                    <input type="checkbox" defaultChecked />
                    Âm thanh thông báo
                  </label>
                  <button className="btn btn-primary" style={{ marginTop: 20 }}>Lưu cài đặt</button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
