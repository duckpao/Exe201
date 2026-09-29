import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import SiteHeader from '../components/site/SiteHeader.jsx'
import SiteFooter from '../components/site/SiteFooter.jsx'
import PlaceholderImage from '../components/site/PlaceholderImage.jsx'
import { Pencil, Trash2, HeartOff } from 'lucide-react'
import '../styles/site.css'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function FavoriteList() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchFavorites = () => {
    setLoading(true)
    fetch(`${apiUrl}/api/favorites`, { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        if (d.data) setFavorites(d.data)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchFavorites()
  }, [])

  const handleUnfavorite = async (entityType, entityId) => {
    try {
      await fetch(`${apiUrl}/api/favorites/${entityType}/${entityId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      setFavorites((prev) => prev.filter((f) => !(f.entityType === entityType && f.entityId === entityId)))
    } catch (e) {
      alert('Không thể bỏ lưu, vui lòng thử lại.')
    }
  }

  if (loading) return <p>Đang tải...</p>
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

// Form sửa bài dùng chung cho cả 5 loại: fields/statusOptions do backend mô tả
// (listingRegistry.editableFields), nên không cần biết trước loại bài là gì.
function ListingEditForm({ item, onCancel, onSaved }) {
  const [values, setValues] = useState(() => ({ ...item.editable, status: item.status }))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`${apiUrl}/api/users/listings/${item.type}/${item.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      onSaved(data.listing)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="settings-edit-form" onSubmit={handleSubmit}>
      {error && <div className="banner banner-error visible">{error}</div>}
      {item.fields.map((field) => (
        <div className="form-group" key={field.name}>
          <label>{field.label}</label>
          {field.kind === 'money' ? (
            <input
              type="number"
              min="0"
              value={values[field.name] ?? ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
            />
          ) : (
            <textarea
              rows={field.name === 'description' ? 4 : 1}
              value={values[field.name] ?? ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
            />
          )}
        </div>
      ))}
      <div className="form-group">
        <label>Trạng thái</label>
        <select value={values.status} onChange={(e) => handleChange('status', e.target.value)}>
          {item.statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
      <div className="settings-edit-actions">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={saving}>
          Hủy
        </button>
      </div>
    </form>
  )
}

function MyListingsList() {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingKey, setEditingKey] = useState(null)

  const fetchListings = () => {
    setLoading(true)
    fetch(`${apiUrl}/api/users/listings`, { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        if (d.data) setListings(d.data)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchListings()
  }, [])

  const handleDelete = async (type, id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa bài đăng này?')) return
    try {
      const res = await fetch(`${apiUrl}/api/users/listings/${type}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message)
      }
      fetchListings()
    } catch (e) {
      alert(e.message)
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
                  <span className="settings-list-date">
                    Đăng lúc: {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
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
  const { user } = useAuth() // Assuming we might need to refresh user or we can use a custom update function
  const [activeTab, setActiveTab] = useState('profile')
  const [fullName, setFullName] = useState(user?.full_name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(false)

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
      const response = await fetch(`${apiUrl}/api/users/profile`, { credentials: 'include',
        method: 'PUT',
        body: formData,
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message)
      setMessage({ type: 'success', text: 'Cập nhật hồ sơ thành công!' })
      setTimeout(() => window.location.reload(), 1500) // Reload to get updated context
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
      const response = await fetch(`${apiUrl}/api/users/password`, { credentials: 'include',
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message)
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
              <li className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>Hồ sơ cá nhân</li>
              <li className={activeTab === 'password' ? 'active' : ''} onClick={() => setActiveTab('password')}>Bảo mật &amp; Mật khẩu</li>
              <li className={activeTab === 'listings' ? 'active' : ''} onClick={() => setActiveTab('listings')}>Bài đăng của tôi</li>
              <li className={activeTab === 'favorites' ? 'active' : ''} onClick={() => setActiveTab('favorites')}>Đã lưu (Yêu thích)</li>
              <li className={activeTab === 'system' ? 'active' : ''} onClick={() => setActiveTab('system')}>Hệ thống (Thông báo)</li>
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
