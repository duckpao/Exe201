import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import PlaceholderImage from '../components/site/PlaceholderImage.jsx'
import SiteHeader from '../components/site/SiteHeader.jsx'
import SiteFooter from '../components/site/SiteFooter.jsx'
import FilterSidebar from '../components/site/FilterSidebar.jsx'
import PassItemCard from '../components/site/PassItemCard.jsx'
import Button from '../components/foundation/Button.jsx'
import EmptyState from '../components/foundation/EmptyState.jsx'
import LoadingState from '../components/foundation/LoadingState.jsx'
import { listItems } from '../services/itemService.js'
import '../styles/site.css'

const FILTER_GROUPS = [
  { title: 'Khu vực', key: 'ward', type: 'select', options: [{ label: 'Tân Xã', value: 'Tân Xã' }, { label: 'Thạch Hòa', value: 'Thạch Hòa' }, { label: 'Thạch Thất', value: 'Thạch Thất' }] },
  { title: 'Giá bán', type: 'range', min: 'Từ', max: 'Đến', minKey: 'price_min', maxKey: 'price_max' },
  { title: 'Loại đồ', key: 'category', type: 'select', options: [{ label: 'Nội thất', value: 'Nội thất' }, { label: 'Đồ điện tử', value: 'Đồ điện tử' }, { label: 'Đồ gia dụng', value: 'Đồ gia dụng' }, { label: 'Xe cộ', value: 'Xe cộ' }, { label: 'Sách - Giáo trình', value: 'Sách - Giáo trình' }] },
  { title: 'Tình trạng', key: 'condition', type: 'select', options: [{ label: 'Mới 90%', value: 'Mới 90%' }, { label: 'Mới 95%', value: 'Mới 95%' }, { label: 'Đã dùng', value: 'Đã dùng' }] },
]

export default function PassItemsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const params = useMemo(() => new URLSearchParams(location.search), [location.search])
  const query = useMemo(() => Object.fromEntries(params.entries()), [params])
  const [passItems, setPassItems] = useState([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterValues, setFilterValues] = useState(() => readFilterValues(params))

  useEffect(() => setFilterValues(readFilterValues(params)), [params])
  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')
    listItems({ ...query, limit: 8 }, { signal: controller.signal })
      .then((data) => { setPassItems(data.data || []); setPagination(data.pagination || { page: 1, totalPages: 1, total: 0 }) })
      .catch((err) => { if (err.name !== 'AbortError') setError(err.message || 'Không thể tải danh sách pass đồ.') })
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
            <h1>Pass Đồ</h1>
            <p>Sang nhượng, bán lại đồ dùng cũ nhanh chóng cho sinh viên.</p>
            <div className="listing-hero-image">
              <PlaceholderImage src="/images/hero-pass-do.jpg" alt="Pass đồ" />
              <Link to="/pass-do/dang-bai" className="listing-hero-cta">
                Đăng bài Pass đồ
              </Link>
            </div>
          </div>
        </section>

        <div className="listing-page-body">
          <FilterSidebar groups={FILTER_GROUPS} values={filterValues} onChange={(key, value) => setFilterValues((current) => ({ ...current, [key]: value }))} onApply={() => updateQuery({ ...filterValues, page: 1 })} onReset={resetFilters} />
          <div className="listing-results">
            <div className="listing-results-heading"><div><h2>Đồ đang được pass</h2><p>{pagination.total || 0} tin đang hiển thị</p></div></div>
            {loading && <LoadingState label="Đang tải danh sách đồ pass..." />}
            {!loading && error && <div className="listing-error" role="alert"><p>{error}</p><Button variant="secondary" onClick={() => navigate({ search: location.search })}>Thử lại</Button></div>}
            {!loading && !error && passItems.length === 0 && (
              <EmptyState title="Chưa có món đồ phù hợp" description="Thử chọn danh mục khác hoặc mở rộng khoảng giá." action={<Button variant="secondary" onClick={resetFilters}>Xóa bộ lọc</Button>} />
            )}
            {!loading && !error && passItems.length > 0 && pagination.totalPages > 1 && <nav className="listing-pagination" aria-label="Phân trang pass đồ"><Button variant="secondary" disabled={pagination.page <= 1} onClick={() => updateQuery({ page: pagination.page - 1 })}>Trang trước</Button><span>Trang {pagination.page} / {pagination.totalPages}</span><Button variant="secondary" disabled={pagination.page >= pagination.totalPages} onClick={() => updateQuery({ page: pagination.page + 1 })}>Trang sau</Button></nav>}
            {!loading && !error && passItems.length > 0 && (
              <div className="listing-grid cols-2">
                {passItems.map((item) => (
                  <PassItemCard key={item.id} item={item} />
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

function emptyFilters() { return { ward: '', price_min: '', price_max: '', category: '', condition: '' } }
function readFilterValues(params) { return { ward: params.get('ward') || '', price_min: params.get('price_min') || '', price_max: params.get('price_max') || '', category: params.get('category') || '', condition: params.get('condition') || '' } }
