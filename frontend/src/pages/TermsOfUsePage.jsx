import { useEffect, useRef, useState } from 'react'
import SiteHeader from '../components/site/SiteHeader.jsx'
import SiteFooter from '../components/site/SiteFooter.jsx'
import '../styles/site.css'

const SECTIONS = [
  { id: 'dieu-khoan-chung', label: 'Điều khoản chung' },
  { id: 'quyen-loi', label: 'Quyền lợi' },
  { id: 'trach-nhiem', label: 'Trách nhiệm người đăng tin' },
  { id: 'bao-mat', label: 'Bảo mật' },
]

export default function TermsOfUsePage() {
  const [activeId, setActiveId] = useState(SECTIONS[0].id)
  const sectionRefs = useRef({})

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: '-30% 0px -60% 0px' }
    )

    SECTIONS.forEach((section) => {
      const el = sectionRefs.current[section.id]
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  function handleNavClick(id) {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="site-page">
      <SiteHeader />
      <main className="site-main">
        <header className="terms-header">
          <h1>Điều khoản sử dụng dịch vụ</h1>
          <p>Cập nhật lần cuối: 15/10/2023</p>
        </header>

        <div className="terms-layout">
          <nav className="terms-nav">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                type="button"
                className={activeId === section.id ? 'active' : ''}
                onClick={() => handleNavClick(section.id)}
              >
                {section.label}
              </button>
            ))}
          </nav>

          <div className="terms-content-card">
            <section id="dieu-khoan-chung" ref={(el) => (sectionRefs.current['dieu-khoan-chung'] = el)}>
              <h2>1. Điều khoản chung</h2>
              <p>
                Bằng việc truy cập và sử dụng RentMate Hola, bạn đồng ý tuân thủ các điều khoản sử dụng dịch vụ
                được nêu dưới đây. RentMate Hola là nền tảng kết nối người thuê, người cho thuê, roommate và các
                dịch vụ hỗ trợ liên quan đến chỗ ở cho sinh viên.
              </p>
              <ul>
                <li>Người dùng phải cung cấp thông tin chính xác khi đăng tin hoặc liên hệ qua nền tảng.</li>
                <li>RentMate Hola có quyền chỉnh sửa, gỡ bỏ nội dung vi phạm mà không cần báo trước.</li>
                <li>Điều khoản có thể được cập nhật theo thời gian, phiên bản mới nhất sẽ được đăng tại đây.</li>
              </ul>
            </section>

            <section id="quyen-loi" ref={(el) => (sectionRefs.current['quyen-loi'] = el)}>
              <h2>2. Quyền lợi</h2>
              <p>
                Người dùng khi sử dụng RentMate Hola được hưởng các quyền lợi nhằm đảm bảo trải nghiệm tìm phòng,
                tìm roommate và pass phòng diễn ra thuận lợi, minh bạch.
              </p>
              <ul>
                <li>Được tiếp cận thông tin phòng trọ, roommate và dịch vụ vận chuyển miễn phí.</li>
                <li>Được hỗ trợ báo cáo tin đăng sai sự thật hoặc có dấu hiệu lừa đảo.</li>
                <li>Được bảo vệ thông tin cá nhân theo chính sách bảo mật của nền tảng.</li>
              </ul>
            </section>

            <section id="trach-nhiem" ref={(el) => (sectionRefs.current['trach-nhiem'] = el)}>
              <h2>3. Trách nhiệm người đăng tin</h2>
              <p>
                Người đăng tin (cho thuê phòng, tìm roommate, pass phòng) chịu trách nhiệm hoàn toàn về tính chính
                xác của thông tin mình cung cấp.
              </p>
              <ul>
                <li>Không đăng thông tin sai sự thật, gây hiểu lầm về giá, diện tích hoặc tình trạng phòng.</li>
                <li>Không đăng trùng lặp nhiều tin cùng nội dung trong thời gian ngắn.</li>
                <li>Chủ động gỡ tin khi phòng đã cho thuê hoặc đã pass thành công.</li>
              </ul>
            </section>

            <section id="bao-mat" ref={(el) => (sectionRefs.current['bao-mat'] = el)}>
              <h2>4. Bảo mật</h2>
              <p>
                RentMate Hola cam kết bảo vệ thông tin cá nhân của người dùng theo đúng quy định pháp luật hiện
                hành.
              </p>
              <ul>
                <li>Thông tin liên hệ chỉ được chia sẻ khi có sự đồng ý của người dùng.</li>
                <li>Dữ liệu tài khoản được lưu trữ và bảo mật bằng các biện pháp kỹ thuật phù hợp.</li>
                <li>Người dùng có quyền yêu cầu chỉnh sửa hoặc xoá thông tin cá nhân của mình.</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
