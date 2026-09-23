import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import SiteHeader from '../components/site/SiteHeader.jsx'
import SiteFooter from '../components/site/SiteFooter.jsx'
import PlaceholderImage from '../components/site/PlaceholderImage.jsx'
import '../styles/site.css'

const AREAS = ['Tân Xã', 'Thạch Hòa', 'Thạch Thất']
const GENDERS = ['Nam', 'Nữ', 'Không yêu cầu']

const FEATURES = [
  { icon: '🛡️', label: 'An toàn & tin cậy' },
  { icon: '⚡', label: 'Đăng tin nhanh' },
  { icon: '🎯', label: 'Đúng nhu cầu' },
  { icon: '💬', label: 'Kết nối trực tiếp' },
]

const TIPS = [
  'Mô tả rõ về bản thân và thói quen sinh hoạt để tìm đúng người phù hợp.',
  'Ghi rõ ngân sách và khu vực mong muốn.',
  'Đăng ảnh thật về chỗ ở để tăng độ tin cậy.',
  'Phản hồi tin nhắn sớm để không bỏ lỡ roommate phù hợp.',
]

export default function PostRoommatePage() {
  const previewRef = useRef(null)

  const [title, setTitle] = useState('')
  const [gender, setGender] = useState(GENDERS[2])
  const [address, setAddress] = useState('')
  const [budget, setBudget] = useState('')
  const [aboutText, setAboutText] = useState('')
  const [placeText, setPlaceText] = useState('')
  const [images, setImages] = useState([])
  const [timing, setTiming] = useState('now')
  const [scheduledDate, setScheduledDate] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    return () => {
      images.forEach((image) => URL.revokeObjectURL(image.url))
    }
  }, [images])

  function handleImageChange(event) {
    const files = Array.from(event.target.files ?? [])
    if (files.length === 0) return
    setImages((prev) => [...prev, ...files.map((file) => ({ url: URL.createObjectURL(file), name: file.name }))])
    event.target.value = ''
  }

  function handleRemoveImage(url) {
    setImages((prev) => prev.filter((image) => image.url !== url))
    URL.revokeObjectURL(url)
  }

  function handlePreviewScroll() {
    previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleSubmit(event) {
    event.preventDefault()
    setSubmitted(true)
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
            {submitted && (
              <div className="notice-box success">
                <p>Đăng tin thành công! Bài đăng của bạn sẽ hiển thị ở trang Tìm Roommate.</p>
                <Link to="/tim-roommate" className="btn btn-primary">
                  Về trang Tìm Roommate
                </Link>
              </div>
            )}

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
            <div className="form-row form-row-split">
              <label>
                Địa chỉ
                <select value={address} onChange={(event) => setAddress(event.target.value)} required>
                  <option value="" disabled>
                    Chọn khu vực
                  </option>
                  {AREAS.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Ngân sách
                <input
                  type="text"
                  required
                  placeholder="VD: 1.200.000đ/tháng"
                  value={budget}
                  onChange={(event) => setBudget(event.target.value)}
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
                <span>📷 Kéo thả hoặc chọn ảnh để tải lên</span>
                <input type="file" accept="image/*" multiple onChange={handleImageChange} hidden />
              </label>
              {images.length > 0 && (
                <div className="upload-preview-grid">
                  {images.map((image) => (
                    <div key={image.url} className="upload-preview-item">
                      <img src={image.url} alt={image.name} />
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

            <div className="form-actions">
              <button type="button" className="btn btn-outline" onClick={handlePreviewScroll}>
                Xem trước
              </button>
              <button type="submit" className="btn btn-primary">
                Đăng tin ✈️
              </button>
            </div>
          </form>

          <aside className="post-sidebar">
            <div className="sidebar-card tips-card">
              <h3>💡 Một vài lưu ý</h3>
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
                  <PlaceholderImage src="/images/avatar-owner.jpg" alt="Bạn" className="preview-avatar" />
                  <div>
                    <p className="preview-name">Bạn</p>
                    <span className="preview-tag">Tìm roommate</span>
                  </div>
                </div>
                <p className="preview-title">{title || 'Tiêu đề bài đăng sẽ hiện ở đây'}</p>
                <p className="preview-price">{budget || 'Ngân sách chưa nhập'}</p>
                <p className="preview-desc">{aboutText || 'Mô tả về bản thân sẽ hiện ở đây...'}</p>
                {images.length > 0 && (
                  <div className="preview-thumb-grid">
                    {images.slice(0, 4).map((image) => (
                      <img key={image.url} src={image.url} alt={image.name} />
                    ))}
                  </div>
                )}
                <div className="preview-card-actions">
                  <span>🤍 Yêu thích</span>
                  <span>💬 Bình luận</span>
                  <span>↗️ Chia sẻ</span>
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
