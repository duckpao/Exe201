import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SiteHeader from '../components/site/SiteHeader.jsx'
import SiteFooter from '../components/site/SiteFooter.jsx'
import PlaceholderImage from '../components/site/PlaceholderImage.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { createRoom } from '../services/roomService.js'
import { listProvinces, getProvinceWithWards } from '../services/locationService.js'
import '../styles/site.css'
import { Camera, Lightbulb } from 'lucide-react';

const ROOM_TYPES = ['Phòng trọ', 'Chung cư mini', 'Nhà nguyên căn']
const AMENITIES = ['WiFi', 'Máy lạnh', 'Máy giặt', 'Bếp', 'Nội thất']

const TIPS = [
  'Ghi rõ giá thuê và tiền đặt cọc để người xem dễ quyết định.',
  'Đăng ảnh thực tế của phòng để tăng độ tin cậy.',
  'Mô tả rõ diện tích, số người tối đa và tiện ích đi kèm.',
  'Phản hồi tin nhắn của người thuê sớm để cho thuê nhanh hơn.',
]

export default function PostRoomPage() {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()

  const [title, setTitle] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [pricePerMonth, setPricePerMonth] = useState('')
  const [depositAmount, setDepositAmount] = useState('')
  const [areaM2, setAreaM2] = useState('')
  const [maxOccupants, setMaxOccupants] = useState('')
  const [provinces, setProvinces] = useState([])
  const [provincesLoading, setProvincesLoading] = useState(true)
  const [provincesError, setProvincesError] = useState('')
  const [provinceCode, setProvinceCode] = useState('')
  const [wards, setWards] = useState([])
  const [wardsLoading, setWardsLoading] = useState(false)
  const [wardCode, setWardCode] = useState('')
  const [streetAddress, setStreetAddress] = useState('')
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

  useEffect(() => {
    let ignore = false
    setProvincesLoading(true)
    setProvincesError('')
    listProvinces()
      .then((data) => {
        if (!ignore) setProvinces(data)
      })
      .catch((err) => {
        if (!ignore) setProvincesError(err.message)
      })
      .finally(() => {
        if (!ignore) setProvincesLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    if (!provinceCode) {
      setWards([])
      setWardCode('')
      return
    }
    let ignore = false
    setWardsLoading(true)
    setWardCode('')
    getProvinceWithWards(provinceCode)
      .then((data) => {
        if (!ignore) setWards(data.wards || [])
      })
      .catch(() => {
        if (!ignore) setWards([])
      })
      .finally(() => {
        if (!ignore) setWardsLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [provinceCode])

  const selectedProvince = provinces.find((item) => String(item.code) === provinceCode)
  const selectedWard = wards.find((item) => String(item.code) === wardCode)

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
      formData.set('title', title)
      formData.set('description', description)
      formData.set('propertyType', propertyType)
      formData.set('pricePerMonth', pricePerMonth)
      if (depositAmount) formData.set('depositAmount', depositAmount)
      if (areaM2) formData.set('areaM2', areaM2)
      if (maxOccupants) formData.set('maxOccupants', maxOccupants)
      formData.set('province', selectedProvince?.name || '')
      formData.set('provinceCode', provinceCode)
      formData.set('ward', selectedWard?.name || '')
      formData.set('wardCode', wardCode)
      if (streetAddress.trim()) formData.set('streetAddress', streetAddress.trim())
      formData.set('amenities', amenities.join(','))
      images.forEach((image) => formData.append('images', image.file))

      const room = await createRoom(formData)
      navigate(`/phong-tro/${room.id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (authLoading || !user) {
    return null
  }

  if (user.role !== 'landlord') {
    return (
      <div className="site-page">
        <SiteHeader />
        <main className="site-main">
          <div className="post-layout">
            <div className="notice-box info">
              <p>Bạn cần đăng ký làm chủ nhà để đăng bài phòng trọ cho thuê.</p>
              <Link to="/dang-ky" className="btn btn-primary">
                Đăng ký làm chủ nhà
              </Link>
            </div>
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
        <section className="post-banner">
          <div className="post-banner-inner">
            <div className="post-banner-text">
              <h1>Đăng bài phòng trọ cho thuê</h1>
              <p>Đăng tin cho thuê phòng trọ để tiếp cận người thuê phù hợp.</p>
            </div>
            <PlaceholderImage src="/images/banner-pass-room.png" alt="Đăng bài phòng trọ" className="post-banner-image" />
          </div>
        </section>

        <div className="post-layout">
          <form className="post-form-card" onSubmit={handleSubmit}>
            {error && <div className="banner banner-error visible">{error}</div>}

            <h2 className="form-step-title">Thông tin phòng trọ</h2>
            <div className="form-row">
              <label>
                Tiêu đề
                <input
                  type="text"
                  required
                  placeholder="VD: Phòng trọ full nội thất gần trung tâm"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </label>
            </div>
            <div className="form-row form-row-split">
              <label>
                Giá thuê (đ/tháng)
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="VD: 1800000"
                  value={pricePerMonth}
                  onChange={(event) => setPricePerMonth(event.target.value)}
                />
              </label>
              <label>
                Tiền đặt cọc (đ)
                <input
                  type="number"
                  min="0"
                  placeholder="VD: 1800000"
                  value={depositAmount}
                  onChange={(event) => setDepositAmount(event.target.value)}
                />
              </label>
            </div>
            <div className="form-row form-row-split">
              <label>
                Diện tích (m²)
                <input
                  type="number"
                  min="0"
                  placeholder="VD: 25"
                  value={areaM2}
                  onChange={(event) => setAreaM2(event.target.value)}
                />
              </label>
              <label>
                Số người tối đa
                <input
                  type="number"
                  min="1"
                  placeholder="VD: 2"
                  value={maxOccupants}
                  onChange={(event) => setMaxOccupants(event.target.value)}
                />
              </label>
            </div>
            <div className="form-row form-row-split">
              <label>
                Tỉnh / Thành phố
                <select
                  value={provinceCode}
                  onChange={(event) => setProvinceCode(event.target.value)}
                  required
                  disabled={provincesLoading}
                >
                  <option value="" disabled>
                    {provincesLoading ? 'Đang tải...' : 'Chọn tỉnh/thành'}
                  </option>
                  {provinces.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Phường / Xã
                <select
                  value={wardCode}
                  onChange={(event) => setWardCode(event.target.value)}
                  required
                  disabled={!provinceCode || wardsLoading}
                >
                  <option value="" disabled>
                    {wardsLoading ? 'Đang tải...' : 'Chọn phường/xã'}
                  </option>
                  {wards.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {provincesError && (
              <div className="notice-box info">
                Không tải được danh sách tỉnh/thành.{' '}
                <button type="button" onClick={() => window.location.reload()}>
                  Thử lại
                </button>
              </div>
            )}
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
                <select value={propertyType} onChange={(event) => setPropertyType(event.target.value)}>
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
                placeholder="Mô tả chi tiết về phòng, nội thất, khu vực xung quanh..."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>

            <div className="notice-box info">
              ℹ️ Bài đăng của bạn sẽ hiển thị công khai ngay sau khi đăng.
            </div>

            <div className="form-actions">
              <Link to="/phong-tro" className="btn btn-outline">
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
                <span className="preview-tag">{propertyType || 'Phòng trọ'}</span>
                <p className="preview-title">{title || 'Tiêu đề bài đăng sẽ hiện ở đây'}</p>
                <p className="preview-price">
                  {pricePerMonth ? `${Number(pricePerMonth).toLocaleString('vi-VN')}đ/tháng` : 'Giá thuê chưa nhập'}
                </p>
                <p className="preview-desc">
                  {areaM2 ? `${areaM2}m²` : 'Diện tích'} | {selectedWard?.name || 'Khu vực'}
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
