import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SiteHeader from '../components/site/SiteHeader.jsx'
import SiteFooter from '../components/site/SiteFooter.jsx'
import PlaceholderImage from '../components/site/PlaceholderImage.jsx'
import '../styles/site.css'

const AREAS = ['Tân Xã', 'Thạch Hòa', 'Thạch Thất']
const CATEGORIES = ['Nội thất', 'Đồ điện tử', 'Đồ gia dụng', 'Xe cộ', 'Sách - Giáo trình']
const CONDITIONS = ['Mới 90%', 'Mới 95%', 'Đã dùng']

const TIPS = [
  'Ghi rõ tình trạng sử dụng thực tế của đồ.',
  'Đăng ảnh thật của sản phẩm để người mua dễ hình dung.',
  'Không đăng trùng lặp nhiều lần trong ngày.',
  'Phản hồi tin nhắn người mua sớm để bán nhanh hơn.',
]

export default function PostPassItemPage() {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [category, setCategory] = useState('')
  const [condition, setCondition] = useState('')
  const [address, setAddress] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState([])
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
              <h1>Đăng bài pass đồ</h1>
              <p>Sang nhượng, bán lại đồ dùng cũ nhanh chóng cho sinh viên có nhu cầu.</p>
            </div>
            <PlaceholderImage src="/images/banner-pass-do.png" alt="Đăng bài pass đồ" className="post-banner-image" />
          </div>
        </section>

        <div className="post-layout">
          <form className="post-form-card" onSubmit={handleSubmit}>
            {submitted && (
              <div className="notice-box success">
                <p>Đăng bài thành công! Bài đăng sẽ hiển thị sau khi được kiểm duyệt.</p>
                <Link to="/pass-do" className="btn btn-primary">
                  Về trang Pass Đồ
                </Link>
              </div>
            )}

            <h2 className="form-step-title">Thông tin sản phẩm</h2>
            <div className="form-row">
              <label>
                Tiêu đề
                <input
                  type="text"
                  required
                  placeholder="VD: Bàn học gỗ + ghế xoay, còn mới 90%"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </label>
            </div>
            <div className="form-row form-row-split">
              <label>
                Giá bán
                <input
                  type="text"
                  required
                  placeholder="VD: 350.000đ"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                />
              </label>
              <label>
                Khu vực
                <select value={address} onChange={(event) => setAddress(event.target.value)} required>
                  <option value="" disabled>
                    Chọn khu vực
                  </option>
                  {AREAS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="form-row form-row-split">
              <label>
                Loại đồ
                <select value={category} onChange={(event) => setCategory(event.target.value)} required>
                  <option value="" disabled>
                    Chọn loại đồ
                  </option>
                  {CATEGORIES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Tình trạng
                <select value={condition} onChange={(event) => setCondition(event.target.value)}>
                  <option value="" disabled>
                    Chọn tình trạng
                  </option>
                  {CONDITIONS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <h2 className="form-step-title">Mô tả chi tiết</h2>
            <div className="form-row">
              <label>
                Hình ảnh
                <label className="upload-box">
                  <span>📷 Kéo thả hoặc chọn ảnh để tải lên</span>
                  <input type="file" accept="image/*" multiple onChange={handleImageChange} hidden />
                </label>
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
            <div className="form-row">
              <textarea
                rows={4}
                placeholder="Mô tả chi tiết về sản phẩm, lý do bán, tình trạng sử dụng..."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>

            <div className="notice-box info">
              ℹ️ Bài đăng của bạn sẽ được quản trị viên xét duyệt trước khi hiển thị công khai.
            </div>

            <div className="form-actions">
              <Link to="/pass-do" className="btn btn-outline">
                Hủy
              </Link>
              <button type="submit" className="btn btn-primary">
                Đăng bài
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

            <div className="sidebar-card preview-card">
              <h3>Xem trước bài đăng</h3>
              <div className="preview-card-inner">
                <span className="preview-tag">Pass đồ</span>
                <p className="preview-title">{title || 'Tiêu đề bài đăng sẽ hiện ở đây'}</p>
                <p className="preview-price">{price || 'Giá bán chưa nhập'}</p>
                <p className="preview-desc">
                  {category || 'Loại đồ'} | {address || 'Khu vực'}
                </p>
                {condition && (
                  <div className="detail-tags">
                    <span className="detail-tag">{condition}</span>
                  </div>
                )}
                {images.length > 0 ? (
                  <div className="preview-thumb-grid">
                    {images.slice(0, 4).map((image) => (
                      <img key={image.url} src={image.url} alt={image.name} />
                    ))}
                  </div>
                ) : (
                  <div className="placeholder-image preview-thumb-empty">
                    <span>Ảnh sản phẩm</span>
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
