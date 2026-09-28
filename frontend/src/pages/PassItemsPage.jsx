import { Link } from 'react-router-dom'
import PlaceholderImage from '../components/site/PlaceholderImage.jsx'
import SiteHeader from '../components/site/SiteHeader.jsx'
import SiteFooter from '../components/site/SiteFooter.jsx'
import FilterSidebar from '../components/site/FilterSidebar.jsx'
import PassItemCard from '../components/site/PassItemCard.jsx'
import { useListingList } from '../hooks/useListingList.js'
import { listItems } from '../services/itemService.js'
import '../styles/site.css'

const FILTER_GROUPS = [
  { title: 'Khu vực', type: 'select', options: ['Tân Xã', 'Thạch Hòa', 'Thạch Thất'] },
  { title: 'Giá bán', type: 'range', min: 'Tối thiểu', max: 'Tối đa' },
  { title: 'Loại đồ', type: 'checkbox', options: ['Nội thất', 'Đồ điện tử', 'Đồ gia dụng', 'Xe cộ', 'Sách - Giáo trình'] },
  { title: 'Tình trạng', type: 'checkbox', options: ['Mới 90%', 'Mới 95%', 'Đã dùng'] },
]

export default function PassItemsPage() {
  const { items: passItems, loading, error } = useListingList(listItems)

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
          <FilterSidebar groups={FILTER_GROUPS} />
          <div>
            {loading && <p className="listing-status">Đang tải danh sách đồ pass...</p>}
            {!loading && error && <p className="listing-status listing-status-error">{error}</p>}
            {!loading && !error && passItems.length === 0 && (
              <p className="listing-status">Chưa có bài pass đồ nào được duyệt.</p>
            )}
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
