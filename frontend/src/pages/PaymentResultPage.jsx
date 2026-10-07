import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import SiteHeader from '../components/site/SiteHeader.jsx'
import SiteFooter from '../components/site/SiteFooter.jsx'
import { useToast } from '../context/ToastContext.jsx'
import '../styles/site.css'

export default function PaymentResultPage() {
  const [params] = useSearchParams()
  const status = params.get('status')
  const success = status === 'success'
  const toast = useToast()
  useEffect(() => {
    if (success) toast.success('Thanh toán thành công. Bạn đã có 1 lượt đăng bài.')
    else toast.error(status === 'invalid' ? 'Chữ ký thanh toán không hợp lệ.' : 'Giao dịch chưa thành công.')
  }, [success, status, toast])
  return (
    <div className="site-page">
      <SiteHeader />
      <main className="site-main payment-page">
        <section className="payment-card">
          <h1>{success ? 'Thanh toán thành công' : 'Thanh toán chưa thành công'}</h1>
          <p>{success ? 'Lượt đăng bài đã được ghi nhận vào tài khoản của bạn.' : 'Bạn chưa bị trừ lượt đăng. Hãy thử lại khi sẵn sàng.'}</p>
          <Link className="btn btn-primary" to={success ? '/phong-tro/dang-bai' : '/thanh-toan/dang-bai'}>
            {success ? 'Tiếp tục đăng bài' : 'Thử thanh toán lại'}
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}