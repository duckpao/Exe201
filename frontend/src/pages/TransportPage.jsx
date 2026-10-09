import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import PlaceholderImage from '../components/site/PlaceholderImage.jsx'
import SiteHeader from '../components/site/SiteHeader.jsx'
import SiteFooter from '../components/site/SiteFooter.jsx'
import FilterSidebar from '../components/site/FilterSidebar.jsx'
import TransportCard from '../components/site/TransportCard.jsx'
import Button from '../components/foundation/Button.jsx'
import EmptyState from '../components/foundation/EmptyState.jsx'
import LoadingState from '../components/foundation/LoadingState.jsx'
import { listVehicles } from '../services/vehicleService.js'
import '../styles/site.css'

const FILTER_GROUPS = [
  { title: 'Giá dịch vụ', type: 'range', min: 'Từ', max: 'Đến', minKey: 'price_min', maxKey: 'price_max' },
  { title: 'Loại dịch vụ', key: 'service_type', type: 'select', options: [{ label: 'Xe tải nhỏ', value: 'small_truck' }, { label: 'Xe máy kéo', value: 'motorbike' }, { label: 'Chuyển nhà trọn gói', value: 'moving' }] },
  { title: 'Tải trọng tối thiểu', key: 'capacity_min', type: 'select', options: [{ label: 'Dưới 100kg', value: '0' }, { label: '100kg trở lên', value: '100' }, { label: '300kg trở lên', value: '300' }] },
]

export default function TransportPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const params = useMemo(() => new URLSearchParams(location.search), [location.search])
  const query = useMemo(() => Object.fromEntries(params.entries()), [params])
  const [transportServices, setTransportServices] = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterValues, setFilterValues] = useState(() => readFilterValues(params))

  useEffect(() => setFilterValues(readFilterValues(params)), [params])
  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')
    listVehicles({ ...query, limit: 8 }, { signal: controller.signal })
      .then((data) => { setTransportServices(data.data || []); setPagination(data.pagination || { page: 1, totalPages: 1, total: 0 }) })
      .catch((err) => { if (err.name !== 'AbortError') setError(err.message || 'Không thể tải dịch vụ vận chuyển.') })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
    return () => controller.abort()
  }, [query])

  function updateQuery(changes) {
    const next = new URLSearchParams(location.search)
    Object.entries(changes).forEach(([key, value]) => value === null || value === '' ? next.delete(key) : next.set(key, String(value)))
    navigate({ search: next.toString() }, { replace: true })
  }

  function resetFilters() { setFilterValues(emptyFilters()); navigate({ search: '' }, { replace: true }) }

  return (
    <div className="site-page">
      <SiteHeader />
      <main className="site-main">
        <section className="listing-page-hero">
          <div className="listing-page-hero-inner">
            <h1>Vận chuyển đồ</h1>
            <p>Đặt dịch vụ vận chuyển đồ đạc nhanh chóng, an toàn với giá hợp lý.</p>
            <div className="listing-hero-image">
              <PlaceholderImage src="/images/hero-van-chuyen.jpg" alt="Vận chuyển đồ" />
              <Link to="/van-chuyen-do/dang-bai" className="listing-hero-cta">
                Đăng dịch vụ vận chuyển
              </Link>
            </div>
          </div>
        </section>

        <div className="listing-page-body">
          <FilterSidebar groups={FILTER_GROUPS} values={filterValues} onChange={(key, value) => setFilterValues((current) => ({ ...current, [key]: value }))} onApply={() => updateQuery({ ...filterValues, page: 1 })} onReset={resetFilters} />
          <div className="listing-results">
            <div className="listing-results-heading"><div><h2>Dịch vụ vận chuyển</h2><p>{pagination.total || 0} tin đang hiển thị</p></div></div>
            {loading && <LoadingState label="Đang tải danh sách dịch vụ vận chuyển..." />}
            {!loading && error && <div className="listing-error" role="alert"><p>{error}</p><Button variant="secondary" onClick={() => navigate({ search: location.search })}>Thử lại</Button></div>}
            {!loading && !error && transportServices.length === 0 && (
              <EmptyState title="Chưa có dịch vụ phù hợp" description="Thử chọn loại dịch vụ khác hoặc mở rộng khoảng giá." action={<Button variant="secondary" onClick={resetFilters}>Xóa bộ lọc</Button>} />
            )}
            {!loading && !error && transportServices.length > 0 && pagination.totalPages > 1 && <nav className="listing-pagination" aria-label="Phân trang vận chuyển"><Button variant="secondary" disabled={pagination.page <= 1} onClick={() => updateQuery({ page: pagination.page - 1 })}>Trang trước</Button><span>Trang {pagination.page} / {pagination.totalPages}</span><Button variant="secondary" disabled={pagination.page >= pagination.totalPages} onClick={() => updateQuery({ page: pagination.page + 1 })}>Trang sau</Button></nav>}
            {!loading && !error && transportServices.length > 0 && (
              <div className="listing-grid">
                {transportServices.map((service) => (
                  <TransportCard key={service.id} service={service} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}

function emptyFilters() { return { price_min: '', price_max: '', service_type: '', capacity_min: '' } }
function readFilterValues(params) { return { price_min: params.get('price_min') || '', price_max: params.get('price_max') || '', service_type: params.get('service_type') || '', capacity_min: params.get('capacity_min') || '' } }
