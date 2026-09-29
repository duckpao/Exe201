import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SiteHeader from '../components/site/SiteHeader.jsx'
import SiteFooter from '../components/site/SiteFooter.jsx'
import PlaceholderImage from '../components/site/PlaceholderImage.jsx'
import LocationSelect from '../components/site/LocationSelect.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useLocationSelect } from '../hooks/useLocationSelect.js'
import { createRoommate } from '../services/roommateService.js'
import '../styles/site.css'
import { ShieldCheck, Zap, Camera, Lightbulb, Target, MessageSquare, Send } from 'lucide-react';

const GENDERS = ['Nam', 'Nữ', 'Không yêu cầu']

const ROOM_TYPES = [
  { value: 'has_room', label: 'Đã có phòng, cần tìm người ở ghép' },
  { value: 'looking_for_room', label: 'Đang tìm phòng và người ở ghép' },
]

const FEATURES = [
  { icon: <ShieldCheck size={16} />, label: 'An toàn & tin cậy' },
  { icon: <Zap size={16} />, label: 'Đăng tin nhanh' },
  { icon: <Target size={16} />, label: 'Đúng nhu cầu' },
  { icon: <MessageSquare size={16} />, label: 'Kết nối trực tiếp' },
]

const TIPS = [
  'Mô tả rõ về bản thân và thói quen sinh hoạt để tìm đúng người phù hợp.',
  'Ghi rõ ngân sách và khu vực mong muốn.',
  'Đăng ảnh thật về chỗ ở để tăng độ tin cậy.',
  'Phản hồi tin nhắn sớm để không bỏ lỡ roommate phù hợp.',
]

export default function PostRoommatePage() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const location = useLocationSelect()
  const previewRef = useRef(null)

  const [title, setTitle] = useState('')
  const [gender, setGender] = useState(GENDERS[2])
  const [roomType, setRoomType] = useState(ROOM_TYPES[1].value)
  const [age, setAge] = useState('')
  const [streetAddress, setStreetAddress] = useState('')
  const [budget, setBudget] = useState('')
  const [aboutText, setAboutText] = useState('')
  const [placeText, setPlaceText] = useState('')
  const [images, setImages] = useState([])
  const [timing, setTiming] = useState('now')
  const [scheduledDate, setScheduledDate] = useState('')
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

  function handlePreviewScroll() {
    previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.set('title', title)
      formData.set('gender', gender)
      formData.set('roomType', roomType)
      if (age) formData.set('age', age)
      location.appendTo(formData)
      if (streetAddress.trim()) formData.set('streetAddress', streetAddress.trim())
      if (budget) formData.set('budget', budget)
      formData.set('aboutText', aboutText)
      formData.set('placeText', placeText)
      formData.set('timing', timing)
      if (timing === 'scheduled' && scheduledDate) formData.set('scheduledDate', scheduledDate)
      images.forEach((image) => formData.append('images', image.file))

      const roommate = await createRoommate(formData)
      navigate(`/tim-roommate/${roommate.id}`)
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
              <h1>Đăng bài tìm Roommate</h1>
              <p>Chia sẻ thông tin của bạn để tìm được người ở ghép phù hợp nhất trong vài phút.</p>
            </div>
            <PlaceholderImage src="/images/banner-roommate.png" alt="Đăng bài tìm roommate" className="post-banner-image" />
          </div>
          <div className="post-banner-features">
            {FEATURES.map((feature) => (
              <div key={feature.label} className="post-banner-feature">
                <span>{feature.icon}</span>
                <span>{feature.label}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="post-layout">
          <form className="post-form-card" onSubmit={handleSubmit}>
            {error && <div className="banner banner-error visible">{error}</div>}

            <h2 className="form-step-title">1. Thông tin cơ bản</h2>
            <div className="form-row">
              <label>
                Tiêu đề
                <input
                  type="text"
                  required
                  placeholder="VD: Tìm bạn nữ ở ghép gần Đại học"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </label>
            </div>
            <div className="form-row">
              <span className="form-label">Giới tính</span>
              <div className="radio-pill-group">
                {GENDERS.map((option) => (
                  <label key={option} className={`radio-pill ${gender === option ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="gender"
                      value={option}
                      checked={gender === option}
                      onChange={() => setGender(option)}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="form-row">
              <span className="form-label">Bạn đang</span>
              <div className="radio-pill-group">
                {ROOM_TYPES.map((option) => (
                  <label key={option.value} className={`radio-pill ${roomType === option.value ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="roomType"
                      checked={roomType === option.value}
                      onChange={() => setRoomType(option.value)}
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
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
                Ngân sách (đ/tháng)
                <input
                  type="text"
                  required
                  placeholder="VD: 1.200.000"
                  value={budget}
                  onChange={(event) => setBudget(event.target.value)}
                />
              </label>
            </div>
            <div className="form-row form-row-split">
              <label>
                Tuổi (không bắt buộc)
                <input
                  type="number"
                  min="16"
                  max="99"
                  placeholder="VD: 21"
                  value={age}
                  onChange={(event) => setAge(event.target.value)}
                />
              </label>
            </div>

            <h2 className="form-step-title">2. Thông tin chi tiết</h2>
            <div className="form-row">
              <label>
                Mô tả về bản thân
                <textarea
                  rows={3}
                  placeholder="Thói quen sinh hoạt, giờ giấc, tính cách..."
                  value={aboutText}
                  onChange={(event) => setAboutText(event.target.value)}
                />
              </label>
            </div>
            <div className="form-row">
              <label>
                Thông tin về chỗ ở
                <textarea
                  rows={3}
                  placeholder="Diện tích, tiện ích, số người ở hiện tại..."
                  value={placeText}
                  onChange={(event) => setPlaceText(event.target.value)}
                />
              </label>
            </div>
            <div className="form-row">
              <span className="form-label">Hình ảnh</span>
              <label className="upload-box">
                <span><Camera size={16} /> Kéo thả hoặc chọn ảnh để tải lên</span>
                <input type="file" accept="image/*" multiple onChange={handleImageChange} hidden />
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

            <h2 className="form-step-title">3. Thời gian đăng tin</h2>
            <div className="form-row">
              <div className="radio-pill-group">
                <label className={`radio-pill ${timing === 'now' ? 'active' : ''}`}>
                  <input type="radio" name="timing" checked={timing === 'now'} onChange={() => setTiming('now')} />
                  <span>Đăng ngay</span>
                </label>
                <label className={`radio-pill ${timing === 'scheduled' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="timing"
                    checked={timing === 'scheduled'}
                    onChange={() => setTiming('scheduled')}
                  />
                  <span>Đăng theo lịch</span>
                </label>
              </div>
              {timing === 'scheduled' && (
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(event) => setScheduledDate(event.target.value)}
                  className="schedule-date-input"
                />
              )}
            </div>

            <div className="notice-box info">
              ℹ️ Bài đăng hiển thị công khai ngay sau khi đăng (hoặc đúng ngày bạn đã hẹn).
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-outline" onClick={handlePreviewScroll}>
                Xem trước
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Đang đăng tin...' : <><span style={{marginRight: 5}}>Đăng tin</span> <Send size={16} /></>}
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

            <div ref={previewRef} className="sidebar-card preview-card">
              <h3>Xem trước bài đăng</h3>
              <div className="preview-card-inner">
                <div className="preview-card-head">
                  <PlaceholderImage src={user.avatar_url} alt={user.full_name || 'Bạn'} className="preview-avatar" />
                  <div>
                    <p className="preview-name">{user.full_name || 'Bạn'}</p>
                    <span className="preview-tag">Tìm roommate</span>
                  </div>
                </div>
                <p className="preview-title">{title || 'Tiêu đề bài đăng sẽ hiện ở đây'}</p>
                <p className="preview-price">{budget ? `${budget}đ/tháng` : 'Ngân sách chưa nhập'}</p>
                <p className="preview-desc">
                  {location.selectedWard?.name || 'Khu vực'} · {aboutText || 'Mô tả về bản thân sẽ hiện ở đây...'}
                </p>
                {images.length > 0 && (
                  <div className="preview-thumb-grid">
                    {images.slice(0, 4).map((image) => (
                      <img key={image.url} src={image.url} alt={image.file.name} />
                    ))}
                  </div>
                )}
                <div className="preview-card-actions">
                  <Link to="/tim-roommate">Xem tất cả bài tìm roommate</Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
