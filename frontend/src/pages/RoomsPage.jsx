import { useState } from 'react'
import SiteHeader from '../components/site/SiteHeader.jsx'
import SiteFooter from '../components/site/SiteFooter.jsx'
import FilterSidebar from '../components/site/FilterSidebar.jsx'
import RoomCard from '../components/site/RoomCard.jsx'
import { rooms } from '../data/mockListings.js'
import '../styles/site.css'

const FILTER_GROUPS = [
  { title: 'Giá thuê', type: 'range', min: 'Tối thiểu', max: 'Tối đa' },
  { title: 'Loại phòng', type: 'checkbox', options: ['Phòng trọ', 'Chung cư mini', 'Nhà nguyên căn'] },
  { title: 'Diện tích', type: 'checkbox', options: ['Dưới 20m²', '20 - 30m²', 'Trên 30m²'] },
  { title: 'Tiện ích', type: 'checkbox', options: ['Full nội thất', 'Có ban công', 'Có gác lửng', 'Có điều hòa'] },
]

export default function RoomsPage() {
  const [keyword, setKeyword] = useState('')

  return (
    <div className="site-page">
      <SiteHeader />
      <main className="site-main">
        <section className="listing-page-hero">
          <div className="listing-page-hero-inner">
            <h1>Phòng trọ</h1>
            <p>Tìm phòng trọ phù hợp với nhu cầu và ngân sách của bạn.</p>
            <form
              className="listing-search-bar"
              onSubmit={(event) => event.preventDefault()}
            >
              <input
                type="text"
                placeholder="Tìm theo khu vực, tên đường..."
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
              />
              <button type="submit">Tìm kiếm</button>
            </form>
          </div>
        </section>

        <div className="listing-page-body">
          <FilterSidebar groups={FILTER_GROUPS} />
          <div>
            <div className="listing-grid">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
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
