import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import SiteHeader from '../components/site/SiteHeader.jsx'
import SiteFooter from '../components/site/SiteFooter.jsx'
import FilterSidebar from '../components/site/FilterSidebar.jsx'
import RoomCard from '../components/site/RoomCard.jsx'
import Button from '../components/foundation/Button.jsx'
import EmptyState from '../components/foundation/EmptyState.jsx'
import LoadingState from '../components/foundation/LoadingState.jsx'
import { listRooms } from '../services/roomService.js'
import '../styles/site.css'

const FILTER_GROUPS = [
  { title: 'Giá thuê / tháng', type: 'range', min: 'Từ', max: 'Đến', minKey: 'price_min', maxKey: 'price_max' },
  { title: 'Loại phòng', key: 'property_type', type: 'checkbox', options: [
    { label: 'Phòng trọ', value: 'phong_tro' },
    { label: 'Chung cư mini', value: 'chung_cu_mini' },
    { label: 'Nhà nguyên căn', value: 'nha_nguyen_can' },
  ] },
  { title: 'Diện tích', type: 'range', min: 'Từ m²', max: 'Đến m²', minKey: 'area_min', maxKey: 'area_max' },
  { title: 'Tiện ích', key: 'amenities', type: 'checkbox', options: [
    { label: 'Full nội thất', value: 'Full nội thất' },
    { label: 'Có ban công', value: 'Có ban công' },
    { label: 'Có gác lửng', value: 'Có gác lửng' },
    { label: 'Có điều hòa', value: 'Có điều hòa' },
  ] },
]

export default function RoomsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const params = useMemo(() => new URLSearchParams(location.search), [location.search])
  const [searchInput, setSearchInput] = useState(params.get('keyword') || '')
  const [rooms, setRooms] = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterValues, setFilterValues] = useState(() => readFilterValues(params))

  const query = useMemo(() => Object.fromEntries(params.entries()), [params])

  useEffect(() => {
    setSearchInput(params.get('keyword') || '')
    setFilterValues(readFilterValues(params))
  }, [params])

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')
    listRooms({ ...query, limit: 9 }, { signal: controller.signal })
      .then((data) => {
        setRooms(data.data || [])
        setPagination(data.pagination || { page: 1, totalPages: 1, total: 0 })
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message || 'Không thể tải danh sách phòng.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [query])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateQuery({ keyword: searchInput.trim() || null, page: 1 })
    }, 350)
    return () => clearTimeout(timeoutId)
  }, [searchInput])

  function updateQuery(changes) {
    const next = new URLSearchParams(location.search)
    Object.entries(changes).forEach(([key, value]) => {
      if (value === null || value === '' || (Array.isArray(value) && value.length === 0)) next.delete(key)
      else next.set(key, Array.isArray(value) ? value.join(',') : String(value))
    })
    navigate({ search: next.toString() }, { replace: true })
  }

  function applyFilters() {
    updateQuery({ ...filterValues, page: 1 })
  }

  function resetFilters() {
    setFilterValues({ amenities: [], property_type: [], price_min: '', price_max: '', area_min: '', area_max: '' })
    navigate({ search: query.keyword ? `?keyword=${encodeURIComponent(query.keyword)}` : '' }, { replace: true })
  }

  return (
    <div className="site-page">
      <SiteHeader />
      <main className="site-main">
        <section className="listing-page-hero">
          <div className="listing-page-hero-inner">
            <h1>Tìm phòng trọ theo cách dễ scan hơn</h1>
            <p>Giá, diện tích và tiện ích được gom lại để bạn lọc nhanh rồi xem chi tiết.</p>
            <form className="listing-search-bar" onSubmit={(event) => { event.preventDefault(); updateQuery({ keyword: searchInput.trim() || null, page: 1 }) }}>
              <input
                type="text"
                aria-label="Tìm phòng trọ"
                placeholder="Tìm theo khu vực, tên đường..."
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
              />
              <Button type="submit">Tìm kiếm</Button>
            </form>
          </div>
        </section>

        <div className="listing-page-body">
          <FilterSidebar
            groups={FILTER_GROUPS}
            values={filterValues}
            onChange={(key, value) => setFilterValues((current) => ({ ...current, [key]: value }))}
            onApply={applyFilters}
            onReset={resetFilters}
          />
          <div className="listing-results">
            <div className="listing-results-heading">
              <div>
                <h2>Kết quả phòng trọ</h2>
                <p>{pagination.total || 0} tin đang hiển thị</p>
              </div>
              <span className="sort-note">Đang xem: mới nhất</span>
            </div>

            {loading && <LoadingState label="Đang tải danh sách phòng trọ..." />}
            {!loading && error && <div className="listing-error" role="alert"><p>{error}</p><Button variant="secondary" onClick={() => navigate({ search: location.search })}>Thử lại</Button></div>}
            {!loading && !error && rooms.length === 0 && (
              <EmptyState title="Chưa có phòng phù hợp" description="Thử bỏ bớt một bộ lọc hoặc tìm theo khu vực khác." action={<Button variant="secondary" onClick={resetFilters}>Xóa bộ lọc</Button>} />
            )}
            {!loading && !error && rooms.length > 0 && (
              <>
              <div className="listing-grid">
                {rooms.map((room) => (
                  <RoomCard key={room.id} room={room} />
                ))}
              </div>
              {pagination.totalPages > 1 && <nav className="listing-pagination" aria-label="Phân trang phòng trọ">
                <Button variant="secondary" disabled={pagination.page <= 1} onClick={() => updateQuery({ page: pagination.page - 1 })}>Trang trước</Button>
                <span>Trang {pagination.page} / {pagination.totalPages}</span>
                <Button variant="secondary" disabled={pagination.page >= pagination.totalPages} onClick={() => updateQuery({ page: pagination.page + 1 })}>Trang sau</Button>
              </nav>}
              </>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

function readFilterValues(params) {
  return {
    price_min: params.get('price_min') || '',
    price_max: params.get('price_max') || '',
    area_min: params.get('area_min') || '',
    area_max: params.get('area_max') || '',
    property_type: params.get('property_type') ? params.get('property_type').split(',') : [],
    amenities: params.get('amenities') ? params.get('amenities').split(',') : [],
  }
}
