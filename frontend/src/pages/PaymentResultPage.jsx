import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, Clock3, XCircle } from 'lucide-react'
import SiteHeader from '../components/site/SiteHeader.jsx'
import SiteFooter from '../components/site/SiteFooter.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { getPayosPaymentStatus } from '../services/paymentService.js'
import '../styles/site.css'

export default function PaymentResultPage() {
  const [params] = useSearchParams()
  const orderCode = params.get('orderCode')
  const returnedStatus = params.get('status')
  const cancelled = params.get('cancel') === 'true' || returnedStatus === 'CANCELLED'
  const [result, setResult] = useState(cancelled ? 'cancelled' : 'pending')
  const [checking, setChecking] = useState(Boolean(orderCode) && !cancelled)
  const toast = useToast()

  useEffect(() => {
    if (cancelled) {
      toast.error('Bạn đã hủy giao dịch payOS.')
      return
    }
    if (!orderCode) {
      setResult('failed')
      toast.error('Thiếu mã giao dịch payOS.')
      return
    }

    let ignore = false
    getPayosPaymentStatus(orderCode)
      .then((data) => {
        if (ignore) return
        if (data.paid) {
          setResult('success')
          toast.success('Thanh toán thành công. Bạn đã có 1 lượt đăng bài.')
        } else if (data.status === 'cancelled' || data.status === 'failed') {
          setResult(data.status)
          toast.error(data.status === 'cancelled' ? 'Giao dịch đã bị hủy.' : 'Giao dịch chưa thành công.')
        } else {
          setResult('pending')
          toast.info('payOS đang xác nhận giao dịch. Vui lòng kiểm tra lại sau ít phút.')
        }
      })
      .catch((error) => {
        if (!ignore) {
          setResult('failed')
          toast.error(error.message)
        }
      })
      .finally(() => {
        if (!ignore) setChecking(false)
      })
    return () => {
      ignore = true
    }
  }, [cancelled, orderCode, toast])

  const success = result === 'success'
  const pending = result === 'pending'
  const Icon = success ? CheckCircle2 : pending ? Clock3 : XCircle

  return (
    <div className="site-page">
      <SiteHeader />
      <main className="site-main payment-page">
        <section className={`payment-card payment-result-card ${result}`}>
          <span className="payment-result-icon"><Icon size={40} /></span>
          <h1>{checking ? 'Đang kiểm tra giao dịch' : success ? 'Thanh toán thành công' : pending ? 'Đang xác nhận giao dịch' : result === 'cancelled' ? 'Đã hủy thanh toán' : 'Thanh toán chưa thành công'}</h1>
          <p>{checking
            ? 'Hệ thống đang đối chiếu trạng thái với payOS.'
            : success
              ? 'Lượt đăng bài đã được ghi nhận vào tài khoản của bạn.'
              : pending
                ? 'Webhook từ payOS có thể đến chậm vài giây. Hãy quay lại Payment Hub để kiểm tra.'
                : 'Bạn chưa bị trừ lượt đăng và có thể tạo giao dịch mới.'}</p>
          {orderCode && <small>Mã đơn hàng: {orderCode}</small>}
          <Link className="btn btn-primary" to={success ? '/phong-tro/dang-bai' : '/thanh-toan/dang-bai'}>
            {success ? 'Tiếp tục đăng bài' : pending ? 'Quay lại Payment Hub' : 'Thử thanh toán lại'}
          </Link>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}