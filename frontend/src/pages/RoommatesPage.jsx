import { Link } from 'react-router-dom'
import PlaceholderImage from '../components/site/PlaceholderImage.jsx'
import SiteHeader from '../components/site/SiteHeader.jsx'
import SiteFooter from '../components/site/SiteFooter.jsx'
import FilterSidebar from '../components/site/FilterSidebar.jsx'
import RoommateCard from '../components/site/RoommateCard.jsx'
import { useListingList } from '../hooks/useListingList.js'
import { listRoommates } from '../services/roommateService.js'
import '../styles/site.css'

const FILTER_GROUPS = [
  { title: 'Khu vực', type: 'select', options: ['Tân Xã', 'Thạch Hòa', 'Thạch Thất'] },
  { title: 'Giá thuê', type: 'range', min: 'Tối thiểu', max: 'Tối đa' },
  { title: 'Loại phòng', type: 'checkbox', options: ['Phòng trọ', 'Chung cư mini', 'Nhà nguyên căn'] },
  { title: 'Diện tích', type: 'checkbox', options: ['Dưới 20m²', '20 - 30m²', 'Trên 30m²'] },
  { title: 'Tiện ích', type: 'checkbox', options: ['Full nội thất', 'Có ban công', 'Có điều hòa'] },
]

export default function RoommatesPage() {
  const { items: roommates, loading, error } = useListingList(listRoommates)

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
            {loading && <p className="listing-status">Đang tải danh sách bài tìm roommate...</p>}
            {!loading && error && <p className="listing-status listing-status-error">{error}</p>}
            {!loading && !error && roommates.length === 0 && (
              <p className="listing-status">Chưa có bài tìm roommate nào được đăng.</p>
            )}
            {!loading && !error && roommates.length > 0 && (
              <div className="listing-grid cols-2">
                {roommates.map((roommate) => (
                  <RoommateCard key={roommate.id} roommate={roommate} />
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
