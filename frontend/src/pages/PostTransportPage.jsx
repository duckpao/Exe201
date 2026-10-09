import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SiteHeader from '../components/site/SiteHeader.jsx'
import SiteFooter from '../components/site/SiteFooter.jsx'
import PlaceholderImage from '../components/site/PlaceholderImage.jsx'
import ImageUploader from '../components/site/ImageUploader.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { createVehicle } from '../services/vehicleService.js'
import '../styles/site.css'
import { Lightbulb } from 'lucide-react';

// Khớp ENUM vehicles.vehicle_type trong database.sql
const VEHICLE_TYPES = [
  { value: 'motorbike', label: 'Xe máy' },
  { value: 'van', label: 'Xe van' },
  { value: 'truck', label: 'Xe tải' },
]

// Khớp bộ lọc "Loại dịch vụ" ở trang Vận chuyển đồ
const SERVICE_TYPES = ['Xe tải nhỏ', 'Xe máy kéo', 'Chuyển nhà trọn gói']

const TAGS = ['Giá rẻ', 'Bốc xếp tận nơi', 'Hỗ trợ đóng gói', 'Nhận hàng gấp', 'Đi tỉnh']

const TIPS = [
  'Ghi rõ tải trọng và loại xe để khách chọn đúng dịch vụ.',
  'Nêu rõ giá theo giờ hoặc theo chuyến để tránh phát sinh.',
  'Đăng ảnh thật của xe để tăng độ tin cậy.',
  'Phản hồi tin nhắn của khách sớm để nhận được nhiều chuyến hơn.',
]

export default function PostTransportPage() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const toast = useToast()

  const [name, setName] = useState('')
  const [vehicleType, setVehicleType] = useState('')
  const [serviceType, setServiceType] = useState('')
  const [licensePlate, setLicensePlate] = useState('')
  const [capacityKg, setCapacityKg] = useState('')
  const [pricePerHour, setPricePerHour] = useState('')
  const [pricePerTrip, setPricePerTrip] = useState('')
  const [tags, setTags] = useState([])
  const [description, setDescription] = useState('')
  const [images, setImages] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login')
    }
  }, [authLoading, user, navigate])

  function toggleTag(tag) {
    setTags((prev) => (prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const formData = new FormData()
      formData.set('name', name)
      formData.set('vehicleType', vehicleType)
      if (serviceType) formData.set('serviceType', serviceType)
      formData.set('licensePlate', licensePlate)
      if (capacityKg) formData.set('capacityKg', capacityKg)
      if (pricePerHour) formData.set('pricePerHour', pricePerHour)
      if (pricePerTrip) formData.set('pricePerTrip', pricePerTrip)
      formData.set('tags', tags.join(','))
      formData.set('description', description)
      images.forEach((image) => formData.append('images', image.file))

      const vehicle = await createVehicle(formData)
      navigate(`/van-chuyen-do/${vehicle.id}`)
    } catch (err) {
      if (err.status === 402) navigate(`/thanh-toan/dang-bai?returnTo=${encodeURIComponent('/van-chuyen-do/dang-bai')}`)
      else { setError(err.message); toast.error(err.message) }
    } finally {
      setSubmitting(false)
    }
  }

  if (authLoading || !user) {
    return null
  }

  const selectedVehicleType = VEHICLE_TYPES.find((item) => item.value === vehicleType)

  return (
    <div className="site-page">
      <SiteHeader />
      <main className="site-main">
        <section className="post-banner">
          <div className="post-banner-inner">
            <div className="post-banner-text">
              <h1>Đăng dịch vụ vận chuyển đồ</h1>
              <p>Giới thiệu xe và dịch vụ của bạn để nhận chuyến từ sinh viên cần chuyển trọ.</p>
            </div>
            <PlaceholderImage
              src="/images/banner-transport.png"
              alt="Đăng dịch vụ vận chuyển đồ"
              className="post-banner-image"
            />
          </div>
        </section>

        <div className="post-layout">
          <form className="post-form-card" onSubmit={handleSubmit}>
            <h2 className="form-step-title">Thông tin dịch vụ</h2>
            <div className="form-row">
              <label>
                Tên dịch vụ
                <input
                  type="text"
                  required
                  placeholder="VD: Xe tải nhỏ 500kg chuyển trọ giá rẻ"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </label>
            </div>
            <div className="form-row form-row-split">
              <label>
                Loại xe
                <select value={vehicleType} onChange={(event) => setVehicleType(event.target.value)} required>
                  <option value="" disabled>
                    Chọn loại xe
                  </option>
                  {VEHICLE_TYPES.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Loại dịch vụ
                <select value={serviceType} onChange={(event) => setServiceType(event.target.value)}>
                  <option value="" disabled>
                    Chọn loại dịch vụ
                  </option>
                  {SERVICE_TYPES.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="form-row form-row-split">
              <label>
                Biển số xe
                <input
                  type="text"
                  required
                  placeholder="VD: 29C-123.45"
                  value={licensePlate}
                  onChange={(event) => setLicensePlate(event.target.value)}
                />
              </label>
              <label>
                Tải trọng (kg)
                <input
                  type="number"
                  min="0"
                  placeholder="VD: 500"
                  value={capacityKg}
                  onChange={(event) => setCapacityKg(event.target.value)}
                />
              </label>
            </div>
            <div className="form-row form-row-split">
              <label>
                Giá theo giờ (đ)
                <input
                  type="number"
                  min="0"
                  placeholder="VD: 150000"
                  value={pricePerHour}
                  onChange={(event) => setPricePerHour(event.target.value)}
                />
              </label>
              <label>
                Giá theo chuyến (đ)
                <input
                  type="number"
                  min="0"
                  placeholder="VD: 400000"
                  value={pricePerTrip}
                  onChange={(event) => setPricePerTrip(event.target.value)}
                />
              </label>
            </div>

            <h2 className="form-step-title">Điểm mạnh của dịch vụ</h2>
            <div className="amenities-grid">
              {TAGS.map((tag) => (
                <label key={tag} className="amenities-checkbox">
                  <input type="checkbox" checked={tags.includes(tag)} onChange={() => toggleTag(tag)} />
                  <span>{tag}</span>
                </label>
              ))}
            </div>

            <h2 className="form-step-title">Mô tả chi tiết</h2>
            <div className="form-row">
              <span className="form-label">Hình ảnh</span>
              <ImageUploader images={images} onChange={setImages} />
            </div>
            <div className="form-row">
              <textarea
                rows={4}
                placeholder="Khu vực hoạt động, có bốc xếp không, thời gian nhận chuyến..."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>

            <div className="notice-box info">
              ℹ️ Dịch vụ của bạn sẽ hiển thị công khai ngay sau khi đăng. Khách quan tâm sẽ nhắn tin trực tiếp cho bạn.
            </div>

            <div className="form-actions">
              <Link to="/van-chuyen-do" className="btn btn-outline">
                Hủy
              </Link>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Đang đăng bài...' : 'Đăng dịch vụ'}
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
                <span className="preview-tag">{selectedVehicleType?.label || 'Vận chuyển đồ'}</span>
                <p className="preview-title">{name || 'Tên dịch vụ sẽ hiện ở đây'}</p>
                <p className="preview-price">
                  {pricePerTrip
                    ? `${Number(pricePerTrip).toLocaleString('vi-VN')}đ/chuyến`
                    : pricePerHour
                      ? `${Number(pricePerHour).toLocaleString('vi-VN')}đ/giờ`
                      : 'Giá chưa nhập'}
                </p>
                <p className="preview-desc">
                  {capacityKg ? `Tải trọng ${capacityKg}kg` : 'Tải trọng'} | {serviceType || 'Loại dịch vụ'}
                </p>
                {tags.length > 0 && (
                  <div className="detail-tags">
                    {tags.map((tag) => (
                      <span key={tag} className="detail-tag">
                        {tag}
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
                    <span>Ảnh xe</span>
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
