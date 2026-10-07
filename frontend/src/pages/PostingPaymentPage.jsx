import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import SiteHeader from '../components/site/SiteHeader.jsx'
import SiteFooter from '../components/site/SiteFooter.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { createVnpayPayment, getPostingStatus } from '../services/paymentService.js'
import '../styles/site.css'

export default function PostingPaymentPage() {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  const returnTo = new URLSearchParams(location.search).get('returnTo') || '/'

  useEffect(() => {
    getPostingStatus().then(setStatus).catch((error) => toast.error(error.message)).finally(() => setLoading(false))
  }, [toast])

  async function handlePayment() {
    setPaying(true)
    try {
      const data = await createVnpayPayment()
      window.location.assign(data.paymentUrl)
    } catch (error) {
      toast.error(error.message)
      setPaying(false)
    }
  }

  useEffect(() => {
    if (status?.inFreeTrial || status?.hasCredit) navigate(returnTo, { replace: true })
  }, [status, navigate, returnTo])

  return (
    <div className="site-page">
      <SiteHeader />
      <main className="site-main payment-page">
        <section className="payment-card">
          <span className="payment-eyebrow">Thanh toán an toàn qua VNPay</span>
          <h1>Phí đăng bài</h1>
          <p>Tài khoản được đăng bài miễn phí trong 2 tháng đầu. Sau thời gian này, mỗi lần thanh toán cấp một lượt đăng bài.</p>
          {loading ? <p>Đang kiểm tra tài khoản...</p> : status && (
            <div className="payment-summary">
              <span>01 lượt đăng bài</span>
              <strong>{Number(status.fee).toLocaleString('vi-VN')}đ</strong>
            </div>
          )}
          <button type="button" className="btn btn-primary" onClick={handlePayment} disabled={loading || paying}>
            {paying ? 'Đang chuyển tới VNPay...' : 'Thanh toán bằng VNPay'}
          </button>
          <Link className="btn btn-outline" to={returnTo}>Quay lại bài đăng</Link>
          <small>Bằng việc thanh toán, bạn đồng ý với <Link to="/dieu-khoan">Điều khoản sử dụng</Link>.</small>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}