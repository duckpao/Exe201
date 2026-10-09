import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import PlaceholderImage from '../components/site/PlaceholderImage.jsx'
import SiteHeader from '../components/site/SiteHeader.jsx'
import SiteFooter from '../components/site/SiteFooter.jsx'
import FilterSidebar from '../components/site/FilterSidebar.jsx'
import PassRoomCard from '../components/site/PassRoomCard.jsx'
import Button from '../components/foundation/Button.jsx'
import EmptyState from '../components/foundation/EmptyState.jsx'
import LoadingState from '../components/foundation/LoadingState.jsx'
import { listPassRooms } from '../services/passRoomService.js'
import '../styles/site.css'

const FILTER_GROUPS = [
  { title: 'Khu vực', key: 'ward', type: 'select', options: [{ label: 'Tân Xã', value: 'Tân Xã' }, { label: 'Thạch Hòa', value: 'Thạch Hòa' }, { label: 'Thạch Thất', value: 'Thạch Thất' }] },
  { title: 'Giá thuê / tháng', type: 'range', min: 'Từ', max: 'Đến', minKey: 'price_min', maxKey: 'price_max' },
  { title: 'Loại phòng', key: 'property_type', type: 'select', options: [{ label: 'Phòng trọ', value: 'phong_tro' }, { label: 'Chung cư mini', value: 'chung_cu_mini' }, { label: 'Nhà nguyên căn', value: 'nha_nguyen_can' }] },
  { title: 'Diện tích', type: 'range', min: 'Từ m²', max: 'Đến m²', minKey: 'area_min', maxKey: 'area_max' },
  { title: 'Tiện ích', key: 'amenities', type: 'checkbox', options: [{ label: 'Full nội thất', value: 'Full nội thất' }, { label: 'Có ban công', value: 'Có ban công' }, { label: 'Có gác lửng', value: 'Có gác lửng' }] },
]

export default function PassRoomsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const params = useMemo(() => new URLSearchParams(location.search), [location.search])
  const query = useMemo(() => Object.fromEntries(params.entries()), [params])
  const [passRooms, setPassRooms] = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterValues, setFilterValues] = useState(() => readFilterValues(params))

  useEffect(() => setFilterValues(readFilterValues(params)), [params])
  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')
    listPassRooms({ ...query, limit: 8 }, { signal: controller.signal })
      .then((data) => { setPassRooms(data.data || []); setPagination(data.pagination || { page: 1, totalPages: 1, total: 0 }) })
      .catch((err) => { if (err.name !== 'AbortError') setError(err.message || 'Không thể tải bài pass phòng.') })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [query])

  function updateQuery(changes) {
    const next = new URLSearchParams(location.search)
    Object.entries(changes).forEach(([key, value]) => {
      if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) next.delete(key)
      else next.set(key, Array.isArray(value) ? value.join(',') : String(value))
    })
    navigate({ search: next.toString() }, { replace: true })
  }

  function resetFilters() {
    setFilterValues(emptyFilters())
    navigate({ search: '' }, { replace: true })
  }

  return (
    <div className="site-page">
      <SiteHeader />
      <main className="site-main">
        <section className="listing-page-hero">
          <div className="listing-page-hero-inner">
            <h1>Pass Phòng Trọ</h1>
            <p>Sang nhượng, pass phòng nhanh chóng cho người có nhu cầu.</p>
            <div className="listing-hero-image">
              <PlaceholderImage src="/images/hero-pass-phong.jpg" alt="Pass phòng trọ" />
              <Link to="/pass-phong/dang-bai" className="listing-hero-cta">
                Đăng bài Pass phòng
              </Link>
            </div>
          </div>
        </section>

        <div className="listing-page-body">
          <FilterSidebar groups={FILTER_GROUPS} values={filterValues} onChange={(key, value) => setFilterValues((current) => ({ ...current, [key]: value }))} onApply={() => updateQuery({ ...filterValues, page: 1 })} onReset={resetFilters} />
          <div className="listing-results">
            <div className="listing-results-heading"><div><h2>Phòng đang sang nhượng</h2><p>{pagination.total || 0} tin đang hiển thị</p></div></div>
            {loading && <LoadingState label="Đang tải danh sách bài pass phòng..." />}
            {!loading && error && <div className="listing-error" role="alert"><p>{error}</p><Button variant="secondary" onClick={() => navigate({ search: location.search })}>Thử lại</Button></div>}
            {!loading && !error && passRooms.length === 0 && (
              <EmptyState title="Chưa có phòng phù hợp" description="Thử mở rộng khu vực hoặc bỏ bớt bộ lọc." action={<Button variant="secondary" onClick={resetFilters}>Xóa bộ lọc</Button>} />
            )}
            {!loading && !error && passRooms.length > 0 && (
              <div className="listing-grid cols-2">
                {passRooms.map((room) => (
                  <PassRoomCard key={room.id} room={room} />
                ))}
              </div>
            )}
            {!loading && !error && passRooms.length > 0 && pagination.totalPages > 1 && <nav className="listing-pagination" aria-label="Phân trang pass phòng"><Button variant="secondary" disabled={pagination.page <= 1} onClick={() => updateQuery({ page: pagination.page - 1 })}>Trang trước</Button><span>Trang {pagination.page} / {pagination.totalPages}</span><Button variant="secondary" disabled={pagination.page >= pagination.totalPages} onClick={() => updateQuery({ page: pagination.page + 1 })}>Trang sau</Button></nav>}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

function emptyFilters() { return { ward: '', price_min: '', price_max: '', property_type: '', area_min: '', area_max: '', amenities: [] } }

function readFilterValues(params) {
  return { ward: params.get('ward') || '', price_min: params.get('price_min') || '', price_max: params.get('price_max') || '', property_type: params.get('property_type') || '', area_min: params.get('area_min') || '', area_max: params.get('area_max') || '', amenities: params.get('amenities') ? params.get('amenities').split(',') : [] }
}
