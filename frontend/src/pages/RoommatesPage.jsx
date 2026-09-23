import { Link } from 'react-router-dom'
import PlaceholderImage from '../components/site/PlaceholderImage.jsx'
import SiteHeader from '../components/site/SiteHeader.jsx'
import SiteFooter from '../components/site/SiteFooter.jsx'
import FilterSidebar from '../components/site/FilterSidebar.jsx'
import RoommateCard from '../components/site/RoommateCard.jsx'
import { roommates } from '../data/mockListings.js'
import '../styles/site.css'

const FILTER_GROUPS = [
  { title: 'Khu vực', type: 'select', options: ['Tân Xã', 'Thạch Hòa', 'Thạch Thất'] },
  { title: 'Giá thuê', type: 'range', min: 'Tối thiểu', max: 'Tối đa' },
  { title: 'Loại phòng', type: 'checkbox', options: ['Phòng trọ', 'Chung cư mini', 'Nhà nguyên căn'] },
  { title: 'Diện tích', type: 'checkbox', options: ['Dưới 20m²', '20 - 30m²', 'Trên 30m²'] },
  { title: 'Tiện ích', type: 'checkbox', options: ['Full nội thất', 'Có ban công', 'Có điều hòa'] },
]

export default function RoommatesPage() {
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
          <FilterSidebar groups={FILTER_GROUPS} />
          <div>
            <div className="listing-grid cols-2">
              {roommates.map((roommate) => (
                <RoommateCard key={roommate.id} roommate={roommate} />
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
