import { Link } from 'react-router-dom'
import SiteHeader from '../components/site/SiteHeader.jsx'
import SiteFooter from '../components/site/SiteFooter.jsx'
import '../styles/site.css'

export default function ComingSoonPage({ title = 'Tính năng đang được phát triển' }) {
  return (
    <div className="site-page">
      <SiteHeader />
      <main className="site-main">
        <div className="coming-soon">
          <h1>{title}</h1>
          <p>Chúng tôi đang hoàn thiện tính năng này. Vui lòng quay lại sau nhé!</p>
          <Link to="/" className="btn btn-primary">
            Về trang chủ
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
