import SiteHeader from '../components/site/SiteHeader.jsx'
import SiteFooter from '../components/site/SiteFooter.jsx'
import FilterSidebar from '../components/site/FilterSidebar.jsx'
import TransportCard from '../components/site/TransportCard.jsx'
import { transportServices } from '../data/mockListings.js'
import '../styles/site.css'

const FILTER_GROUPS = [
  { title: 'Khu vực', type: 'select', options: ['Tân Xã', 'Thạch Hòa', 'Thạch Thất'] },
  { title: 'Giá thuê', type: 'range', min: 'Tối thiểu', max: 'Tối đa' },
  { title: 'Loại dịch vụ', type: 'checkbox', options: ['Xe tải nhỏ', 'Xe máy kéo', 'Chuyển nhà trọn gói'] },
  { title: 'Tải trọng', type: 'checkbox', options: ['Dưới 100kg', '100 - 300kg', 'Trên 300kg'] },
]

export default function TransportPage() {
  return (
    <div className="site-page">
      <SiteHeader />
      <main className="site-main">
        <section className="listing-page-hero">
          <div className="listing-page-hero-inner">
            <h1>Vận chuyển đồ</h1>
            <p>Đặt dịch vụ vận chuyển đồ đạc nhanh chóng, an toàn với giá hợp lý.</p>
          </div>
        </section>

        <div className="listing-page-body">
          <FilterSidebar groups={FILTER_GROUPS} />
          <div>
            <div className="listing-grid">
              {transportServices.map((service) => (
                <TransportCard key={service.id} service={service} />
              ))}
            </div>
            <div className="pagination">
              <button type="button">←</button>
              <button type="button" className="active">1</button>
              <button type="button">2</button>
              <button type="button">3</button>
              <button type="button">→</button>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
