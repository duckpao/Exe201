import { Link } from 'react-router-dom'
import PlaceholderImage from '../components/site/PlaceholderImage.jsx'
import SiteHeader from '../components/site/SiteHeader.jsx'
import SiteFooter from '../components/site/SiteFooter.jsx'
import FilterSidebar from '../components/site/FilterSidebar.jsx'
import PassItemCard from '../components/site/PassItemCard.jsx'
import { passItems } from '../data/mockListings.js'
import '../styles/site.css'

const FILTER_GROUPS = [
  { title: 'Khu vực', type: 'select', options: ['Tân Xã', 'Thạch Hòa', 'Thạch Thất'] },
  { title: 'Giá bán', type: 'range', min: 'Tối thiểu', max: 'Tối đa' },
  { title: 'Loại đồ', type: 'checkbox', options: ['Nội thất', 'Đồ điện tử', 'Đồ gia dụng', 'Xe cộ', 'Sách - Giáo trình'] },
  { title: 'Tình trạng', type: 'checkbox', options: ['Mới 90%', 'Mới 95%', 'Đã dùng'] },
]

export default function PassItemsPage() {
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
            <div className="listing-grid cols-2">
              {passItems.map((item) => (
                <PassItemCard key={item.id} item={item} />
              ))}
            </div>
            <div className="pagination">
              <button type="button">←</button>
              <button type="button" className="active">1</button>
              <button type="button">2</button>
              <button type="button">→</button>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
