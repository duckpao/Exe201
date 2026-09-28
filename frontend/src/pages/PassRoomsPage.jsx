import { Link } from 'react-router-dom'
import PlaceholderImage from '../components/site/PlaceholderImage.jsx'
import SiteHeader from '../components/site/SiteHeader.jsx'
import SiteFooter from '../components/site/SiteFooter.jsx'
import FilterSidebar from '../components/site/FilterSidebar.jsx'
import PassRoomCard from '../components/site/PassRoomCard.jsx'
import { useListingList } from '../hooks/useListingList.js'
import { listPassRooms } from '../services/passRoomService.js'
import '../styles/site.css'

const FILTER_GROUPS = [
  { title: 'Khu vực', type: 'select', options: ['Tân Xã', 'Thạch Hòa', 'Thạch Thất'] },
  { title: 'Giá thuê', type: 'range', min: 'Tối thiểu', max: 'Tối đa' },
  { title: 'Loại phòng', type: 'checkbox', options: ['Phòng trọ', 'Chung cư mini', 'Nhà nguyên căn'] },
  { title: 'Diện tích', type: 'checkbox', options: ['Dưới 20m²', '20 - 30m²', 'Trên 30m²'] },
  { title: 'Tiện ích', type: 'checkbox', options: ['Full nội thất', 'Có ban công', 'Có gác lửng'] },
]

export default function PassRoomsPage() {
  const { items: passRooms, loading, error } = useListingList(listPassRooms)

  return (
    <div className="site-page">
      <SiteHeader />
      <main className="site-main">
        <section className="listing-page-hero">
          <div className="listing-page-hero-inner">
            <h1>Pass Phòng Trọ</h1>
            <p>Sang nhượng, pass phòng nhanh chóng cho người có nhu cầu.</p>
            <div className="listing-hero-image">
              <PlaceholderImage src="/images/hero-pass-phong.jpg" alt="Pass phòng trọ" />
              <Link to="/pass-phong/dang-bai" className="listing-hero-cta">
                Đăng bài Pass phòng
              </Link>
            </div>
          </div>
        </section>

        <div className="listing-page-body">
          <FilterSidebar groups={FILTER_GROUPS} />
          <div>
            {loading && <p className="listing-status">Đang tải danh sách bài pass phòng...</p>}
            {!loading && error && <p className="listing-status listing-status-error">{error}</p>}
            {!loading && !error && passRooms.length === 0 && (
              <p className="listing-status">Chưa có bài pass phòng nào được duyệt.</p>
            )}
            {!loading && !error && passRooms.length > 0 && (
              <div className="listing-grid cols-2">
                {passRooms.map((room) => (
                  <PassRoomCard key={room.id} room={room} />
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
