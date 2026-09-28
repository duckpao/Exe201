import { Link } from 'react-router-dom'
import PlaceholderImage from '../components/site/PlaceholderImage.jsx'
import SiteHeader from '../components/site/SiteHeader.jsx'
import SiteFooter from '../components/site/SiteFooter.jsx'
import FilterSidebar from '../components/site/FilterSidebar.jsx'
import TransportCard from '../components/site/TransportCard.jsx'
import { useListingList } from '../hooks/useListingList.js'
import { listVehicles } from '../services/vehicleService.js'
import '../styles/site.css'

const FILTER_GROUPS = [
  { title: 'Khu vực', type: 'select', options: ['Tân Xã', 'Thạch Hòa', 'Thạch Thất'] },
  { title: 'Giá thuê', type: 'range', min: 'Tối thiểu', max: 'Tối đa' },
  { title: 'Loại dịch vụ', type: 'checkbox', options: ['Xe tải nhỏ', 'Xe máy kéo', 'Chuyển nhà trọn gói'] },
  { title: 'Tải trọng', type: 'checkbox', options: ['Dưới 100kg', '100 - 300kg', 'Trên 300kg'] },
]

export default function TransportPage() {
  const { items: transportServices, loading, error } = useListingList(listVehicles)

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
          <FilterSidebar groups={FILTER_GROUPS} />
          <div>
            {loading && <p className="listing-status">Đang tải danh sách dịch vụ vận chuyển...</p>}
            {!loading && error && <p className="listing-status listing-status-error">{error}</p>}
            {!loading && !error && transportServices.length === 0 && (
              <p className="listing-status">Chưa có dịch vụ vận chuyển nào được đăng.</p>
            )}
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
