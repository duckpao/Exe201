import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SiteHeader from '../components/site/SiteHeader.jsx'
import SiteFooter from '../components/site/SiteFooter.jsx'
import PlaceholderImage from '../components/site/PlaceholderImage.jsx'
import LocationSelect from '../components/site/LocationSelect.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useLocationSelect } from '../hooks/useLocationSelect.js'
import { createPassRoom } from '../services/passRoomService.js'
import '../styles/site.css'
import { Camera, Lightbulb } from 'lucide-react';

const ROOM_TYPES = ['Phòng trọ', 'Chung cư mini', 'Nhà nguyên căn']
const AMENITIES = ['WiFi', 'Máy lạnh', 'Máy giặt', 'Bếp', 'Nội thất']

const TIPS = [
  'Ghi rõ thời gian còn lại của hợp đồng thuê.',
  'Đăng ảnh thực tế của phòng để người xem dễ hình dung.',
  'Không đăng trùng lặp nhiều lần trong ngày.',
  'Phản hồi tin nhắn của người thuê sớm để pass phòng nhanh hơn.',
]

export default function PostPassRoomPage() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const location = useLocationSelect()

  const [postType, setPostType] = useState('pass')
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [streetAddress, setStreetAddress] = useState('')
  const [area, setArea] = useState('')
  const [passDate, setPassDate] = useState('')
  const [roomType, setRoomType] = useState('')
  const [occupants, setOccupants] = useState('')
  const [amenities, setAmenities] = useState([])
  const [description, setDescription] = useState('')
  const [images, setImages] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    return () => {
      images.forEach((image) => URL.revokeObjectURL(image.url))
    }
  }, [images])

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login')
    }
  }, [authLoading, user, navigate])

  function toggleAmenity(amenity) {
    setAmenities((prev) => (prev.includes(amenity) ? prev.filter((item) => item !== amenity) : [...prev, amenity]))
  }

  function handleImageChange(event) {
    const files = Array.from(event.target.files ?? [])
    if (files.length === 0) return
    setImages((prev) => [...prev, ...files.map((file) => ({ url: URL.createObjectURL(file), file }))])
    event.target.value = ''
  }

  function handleRemoveImage(url) {
    setImages((prev) => prev.filter((image) => image.url !== url))
    URL.revokeObjectURL(url)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.set('postType', postType)
      formData.set('title', title)
      formData.set('price', price)
      location.appendTo(formData)
      if (streetAddress.trim()) formData.set('streetAddress', streetAddress.trim())
      if (area) formData.set('area', area)
      if (passDate) formData.set('passDate', passDate)
      if (roomType) formData.set('roomType', roomType)
      if (occupants) formData.set('occupants', occupants)
      formData.set('amenities', amenities.join(','))
      formData.set('description', description)
      images.forEach((image) => formData.append('images', image.file))

      const passRoom = await createPassRoom(formData)
      navigate(`/pass-phong/${passRoom.id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (authLoading || !user) {
    return null
  }

  return (
    <div className="site-page">
      <SiteHeader />
      <main className="site-main">
        <section className="post-banner">
          <div className="post-banner-inner">
            <div className="post-banner-text">
              <h1>Đăng bài pass phòng trọ</h1>
              <p>Sang nhượng, pass lại phòng trọ nhanh chóng cho người có nhu cầu.</p>
            </div>
            <PlaceholderImage src="/images/banner-pass-room.png" alt="Đăng bài pass phòng trọ" className="post-banner-image" />
          </div>
        </section>

        <div className="post-layout">
          <form className="post-form-card" onSubmit={handleSubmit}>
            {error && <div className="banner banner-error visible">{error}</div>}

            <h2 className="form-step-title">Loại bài đăng</h2>
            <div className="tab-switcher">
              <button
                type="button"
                className={`tab-btn ${postType === 'pass' ? 'active' : ''}`}
                onClick={() => setPostType('pass')}
              >
                Pass phòng trọ
              </button>
              <button
                type="button"
                className={`tab-btn ${postType === 'transfer' ? 'active' : ''}`}
                onClick={() => setPostType('transfer')}
              >
                Chuyển nhượng hợp đồng
              </button>
            </div>

            <h2 className="form-step-title">Thông tin phòng trọ</h2>
            <div className="form-row">
              <label>
                Tiêu đề
                <input
                  type="text"
                  required
                  placeholder="VD: Pass phòng full nội thất, còn hợp đồng 6 tháng"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </label>
            </div>
            <div className="form-row form-row-split">
              <label>
                Giá phòng (đ/tháng)
                <input
                  type="text"
                  required
                  placeholder="VD: 1.800.000"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                />
              </label>
              <label>
                Diện tích
                <input
                  type="text"
                  placeholder="VD: 25m²"
                  value={area}
                  onChange={(event) => setArea(event.target.value)}
                />
              </label>
            </div>

            <LocationSelect location={location} />

            <div className="form-row form-row-split">
              <label>
                Địa chỉ cụ thể (không bắt buộc)
                <input
                  type="text"
                  placeholder="VD: Số 12, ngõ 5, đường Phùng Khoang"
                  value={streetAddress}
                  onChange={(event) => setStreetAddress(event.target.value)}
                />
              </label>
              <label>
                Loại phòng
                <select value={roomType} onChange={(event) => setRoomType(event.target.value)}>
                  <option value="" disabled>
                    Chọn loại phòng
                  </option>
                  {ROOM_TYPES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="form-row form-row-split">
              <label>
                Ngày bắt đầu pass
                <input type="date" value={passDate} onChange={(event) => setPassDate(event.target.value)} />
              </label>
              <label>
                Số lượng người
                <input
                  type="number"
                  min="1"
                  placeholder="VD: 2"
                  value={occupants}
                  onChange={(event) => setOccupants(event.target.value)}
                />
              </label>
            </div>

            <h2 className="form-step-title">Tiện ích</h2>
            <div className="amenities-grid">
              {AMENITIES.map((amenity) => (
                <label key={amenity} className="amenities-checkbox">
                  <input
                    type="checkbox"
                    checked={amenities.includes(amenity)}
                    onChange={() => toggleAmenity(amenity)}
                  />
                  <span>{amenity}</span>
                </label>
              ))}
            </div>

            <h2 className="form-step-title">Mô tả chi tiết</h2>
            <div className="form-row">
              <label>
                Hình ảnh
                <label className="upload-box">
                  <span><Camera size={16} /> Kéo thả hoặc chọn ảnh để tải lên</span>
                  <input type="file" accept="image/*" multiple onChange={handleImageChange} hidden />
                </label>
              </label>
              {images.length > 0 && (
                <div className="upload-preview-grid">
                  {images.map((image) => (
                    <div key={image.url} className="upload-preview-item">
                      <img src={image.url} alt={image.file.name} />
                      <button type="button" onClick={() => handleRemoveImage(image.url)} aria-label="Xoá ảnh">
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="form-row">
              <textarea
                rows={4}
                placeholder="Mô tả chi tiết về phòng, lý do pass, tình trạng nội thất..."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>

            <div className="notice-box info">
              ℹ️ Bài đăng của bạn sẽ được quản trị viên xét duyệt trước khi hiển thị công khai.
            </div>

            <div className="form-actions">
              <Link to="/pass-phong" className="btn btn-outline">
                Hủy
              </Link>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Đang đăng bài...' : 'Đăng bài'}
              </button>
            </div>
          </form>

          <aside className="post-sidebar">
            <div className="sidebar-card tips-card">
              <h3><Lightbulb size={16} /> Một vài lưu ý</h3>
              <ul>
                {TIPS.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </div>

            <div className="sidebar-card preview-card">
              <h3>Xem trước bài đăng</h3>
              <div className="preview-card-inner">
                <span className="preview-tag">
                  {postType === 'pass' ? 'Pass phòng trọ' : 'Chuyển nhượng hợp đồng'}
                </span>
                <p className="preview-title">{title || 'Tiêu đề bài đăng sẽ hiện ở đây'}</p>
                <p className="preview-price">{price || 'Giá phòng chưa nhập'}</p>
                <p className="preview-desc">
                  {area || 'Diện tích'} | {location.selectedWard?.name || 'Khu vực'}
                </p>
                {amenities.length > 0 && (
                  <div className="detail-tags">
                    {amenities.map((amenity) => (
                      <span key={amenity} className="detail-tag">
                        {amenity}
                      </span>
                    ))}
                  </div>
                )}
                {images.length > 0 ? (
                  <div className="preview-thumb-grid">
                    {images.slice(0, 4).map((image) => (
                      <img key={image.url} src={image.url} alt={image.file.name} />
                    ))}
                  </div>
                ) : (
                  <div className="placeholder-image preview-thumb-empty">
                    <span>Ảnh phòng</span>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
