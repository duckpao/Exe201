import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import PlaceholderImage from '../components/site/PlaceholderImage.jsx'
import SiteHeader from '../components/site/SiteHeader.jsx'
import SiteFooter from '../components/site/SiteFooter.jsx'
import FilterSidebar from '../components/site/FilterSidebar.jsx'
import RoommateCard from '../components/site/RoommateCard.jsx'
import Button from '../components/foundation/Button.jsx'
import EmptyState from '../components/foundation/EmptyState.jsx'
import LoadingState from '../components/foundation/LoadingState.jsx'
import { listRoommates } from '../services/roommateService.js'
import '../styles/site.css'

const FILTER_GROUPS = [
  { title: 'Khu vực', key: 'ward', type: 'select', options: [
    { label: 'Tân Xã', value: 'Tân Xã' },
    { label: 'Thạch Hòa', value: 'Thạch Hòa' },
    { label: 'Thạch Thất', value: 'Thạch Thất' },
  ] },
  { title: 'Ngân sách / tháng', type: 'range', min: 'Từ', max: 'Đến', minKey: 'budget_min', maxKey: 'budget_max' },
  { title: 'Loại phòng', key: 'property_type', type: 'select', options: [
    { label: 'Phòng trọ', value: 'phong_tro' },
    { label: 'Chung cư mini', value: 'chung_cu_mini' },
    { label: 'Nhà nguyên căn', value: 'nha_nguyen_can' },
  ] },
  { title: 'Diện tích', type: 'range', min: 'Từ m²', max: 'Đến m²', minKey: 'area_min', maxKey: 'area_max' },
  { title: 'Giới tính', key: 'gender', type: 'select', options: [
    { label: 'Nam', value: 'male' },
    { label: 'Nữ', value: 'female' },
    { label: 'Không yêu cầu', value: 'any' },
  ] },
]

export default function RoommatesPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const params = useMemo(() => new URLSearchParams(location.search), [location.search])
  const query = useMemo(() => Object.fromEntries(params.entries()), [params])
  const [roommates, setRoommates] = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterValues, setFilterValues] = useState(() => readFilterValues(params))

  useEffect(() => setFilterValues(readFilterValues(params)), [params])

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')
    listRoommates({ ...query, limit: 8 }, { signal: controller.signal })
      .then((data) => {
        setRoommates(data.data || [])
        setPagination(data.pagination || { page: 1, totalPages: 1, total: 0 })
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err.message || 'Không thể tải danh sách roommate.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [query])

  function updateQuery(changes) {
    const next = new URLSearchParams(location.search)
    Object.entries(changes).forEach(([key, value]) => {
      if (value === null || value === '') next.delete(key)
      else next.set(key, String(value))
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
            <h1>Tìm Roommate</h1>
            <p>Kết nối với những người bạn cùng phòng phù hợp với phong cách sống của bạn.</p>
            <div className="listing-hero-image">
              <PlaceholderImage src="/images/hero-roommate.jpg" alt="Tìm roommate" />
              <Link to="/tim-roommate/dang-bai" className="listing-hero-cta">
                Đăng bài tìm Roommate
              </Link>
            </div>
          </div>
        </section>

        <div className="listing-page-body">
          <FilterSidebar
            groups={FILTER_GROUPS}
            values={filterValues}
            onChange={(key, value) => setFilterValues((current) => ({ ...current, [key]: value }))}
            onApply={() => updateQuery({ ...filterValues, page: 1 })}
            onReset={resetFilters}
          />
          <div className="listing-results">
            <div className="listing-results-heading">
              <div><h2>Hồ sơ tìm roommate</h2><p>{pagination.total || 0} bài đang hiển thị</p></div>
            </div>
            {loading && <LoadingState label="Đang tải danh sách bài tìm roommate..." />}
            {!loading && error && <div className="listing-error" role="alert"><p>{error}</p><Button variant="secondary" onClick={() => navigate({ search: location.search })}>Thử lại</Button></div>}
            {!loading && !error && roommates.length === 0 && (
              <EmptyState title="Chưa có hồ sơ phù hợp" description="Thử mở rộng khu vực hoặc ngân sách tìm kiếm." action={<Button variant="secondary" onClick={resetFilters}>Xóa bộ lọc</Button>} />
            )}
            {!loading && !error && roommates.length > 0 && (
              <>
                <div className="listing-grid cols-2">{roommates.map((roommate) => <RoommateCard key={roommate.id} roommate={roommate} />)}</div>
                {pagination.totalPages > 1 && <nav className="listing-pagination" aria-label="Phân trang roommate">
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

function emptyFilters() {
  return { ward: '', budget_min: '', budget_max: '', property_type: '', area_min: '', area_max: '', gender: '' }
}

function readFilterValues(params) {
  return {
    ward: params.get('ward') || '',
    budget_min: params.get('budget_min') || '',
    budget_max: params.get('budget_max') || '',
    property_type: params.get('property_type') || '',
    area_min: params.get('area_min') || '',
    area_max: params.get('area_max') || '',
    gender: params.get('gender') || '',
  }
}
