import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle2, Clock3, ShieldCheck } from 'lucide-react'
import SiteHeader from '../components/site/SiteHeader.jsx'
import SiteFooter from '../components/site/SiteFooter.jsx'
import PayosCheckoutPanel from '../components/site/PayosCheckoutPanel.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { createPayosPayment, getPayosPaymentStatus, getPostingStatus } from '../services/paymentService.js'
import { usePayosWatcher } from '../hooks/usePayosWatcher.js'
import { recallReturnTo, rememberReturnTo, safeReturnPath } from '../utils/safeReturnPath.js'
import '../styles/site.css'

export default function PostingPaymentPage() {
  const [status, setStatus] = useState(null)
  const [payment, setPayment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [checking, setChecking] = useState(false)
  const [returnNotice, setReturnNotice] = useState(null)
  const [statusError, setStatusError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  const searchParams = new URLSearchParams(location.search)
  const returnTo =
    safeReturnPath(searchParams.get('returnTo')) || recallReturnTo(searchParams.get('orderCode')) || '/'

  useEffect(() => {
    getPostingStatus()
      .then(setStatus)
      .catch((error) => setStatusError(error.message))
      .finally(() => setLoading(false))
  }, [toast])

  useEffect(() => {
    if (status?.inFreeTrial || status?.hasCredit) navigate(returnTo, { replace: true })
  }, [status, navigate, returnTo])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const orderCode = params.get('orderCode')
    const wasCancelled = params.get('cancel') === 'true' || params.get('status') === 'CANCELLED'
    if (!orderCode) {
      if (wasCancelled) setReturnNotice({ type: 'cancelled', text: 'Giao dịch đã được hủy. Bạn có thể tạo giao dịch mới.' })
      return
    }

    let ignore = false
    setReturnNotice({ type: 'pending', text: 'Đang đối chiếu trạng thái giao dịch với máy chủ.' })
    getPayosPaymentStatus(orderCode)
      .then((data) => {
        if (ignore) return
        if (data.paid) {
          setReturnNotice({ type: 'success', text: 'Thanh toán đã được xác nhận. Lượt đăng bài đã sẵn sàng.' })
          getPostingStatus().then(setStatus).catch(() => {})
        } else if (wasCancelled) {
          setReturnNotice({ type: 'cancelled', text: 'Giao dịch đã được hủy. Bạn có thể tạo giao dịch mới.' })
        } else {
          setReturnNotice({ type: 'pending', text: 'payOS chưa ghi nhận thanh toán. Hệ thống sẽ tự kiểm tra lại, bạn có thể chờ ở trang này.' })
        }
      })
      .catch((error) => {
        if (!ignore) setReturnNotice({ type: 'pending', text: error.message || 'Chưa thể kiểm tra trạng thái. Bạn có thể kiểm tra lại sau.' })
      })
    return () => {
      ignore = true
    }
  }, [location.search])

  async function handleCreatePayment() {
    setCreating(true)
    try {
      const data = await createPayosPayment()
      rememberReturnTo(data.orderCode, returnTo)
      setPayment(data)
      toast.success('Đã tạo mã QR thanh toán payOS')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setCreating(false)
    }
  }

  usePayosWatcher(payment?.orderCode, {
    onPaid: () => {
      toast.success('Thanh toán thành công. Bạn đã có 1 lượt đăng bài.')
      navigate(returnTo, { replace: true })
    },
    onEnded: () => {
      toast.info('Giao dịch đã bị hủy hoặc hết hạn. Bạn có thể tạo giao dịch mới.')
      setPayment(null)
    },
  })

  async function handleCheckStatus() {
    if (!payment?.orderCode) return
    setChecking(true)
    try {
      const data = await getPayosPaymentStatus(payment.orderCode)
      if (data.paid) {
        toast.success('Thanh toán thành công. Bạn đã có 1 lượt đăng bài.')
        navigate(returnTo, { replace: true })
      } else {
        toast.info(data.status === 'cancelled' ? 'Giao dịch đã bị hủy.' : 'Chưa ghi nhận thanh toán. Vui lòng kiểm tra lại sau.')
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="site-page">
      <SiteHeader />
      <main className="site-main payment-hub-page">
        <section className="payment-hub">
          <div className="payment-hub-heading">
            <span className="payment-eyebrow"><ShieldCheck size={16} /> Payment Hub</span>
            <h1>Thanh toán phí đăng bài</h1>
            <p>Thanh toán chuyển khoản bảo mật qua payOS. Mỗi giao dịch thành công cấp một lượt đăng bài.</p>
          </div>
          {returnNotice && <div className={`payos-return-notice ${returnNotice.type}`} role="status">{returnNotice.text}</div>}
          {statusError && <div className="listing-error" role="alert"><p>{statusError}</p><button type="button" className="btn btn-outline" onClick={() => window.location.reload()}>Thử lại</button></div>}

          {loading ? <p className="listing-status">Đang kiểm tra quyền đăng bài...</p> : !payment ? (
            <div className="payment-plan-card">
              <div className="payment-plan-copy">
                <span className="payment-plan-label">Gói đăng bài</span>
                <h2>01 lượt đăng bài</h2>
                <p>Áp dụng cho phòng trọ, roommate, pass phòng, pass đồ hoặc dịch vụ vận chuyển.</p>
              </div>
              <div className="payment-plan-price">
                <span>Tổng thanh toán</span>
                <strong>{Number(status?.fee || 0).toLocaleString('vi-VN')}<small>đ</small></strong>
              </div>
              <div className="payment-benefits">
                <span><CheckCircle2 size={17} /> Tự cấp lượt khi payOS xác nhận giao dịch</span>
                <span><CheckCircle2 size={17} /> Không tự động gia hạn</span>
                <span><CheckCircle2 size={17} /> Miễn phí đăng bài trong 2 tháng đầu</span>
              </div>
              <div className="payment-plan-actions">
                <button type="button" className="btn btn-primary" onClick={handleCreatePayment} disabled={creating}>
                  <ShieldCheck size={18} /> {creating ? 'Đang tạo giao dịch...' : 'Tiếp tục với payOS'}
                </button>
                <Link className="btn btn-outline" to={returnTo}>Quay lại</Link>
              </div>
            </div>
          ) : (
            <div className="payos-hub-layout">
              <section className="payos-order-summary">
                <div className="payos-order-title">
                  <span className="payment-plan-label">Đơn thanh toán</span>
                  <span className="payos-pending-badge"><Clock3 size={15} /> Chờ thanh toán</span>
                </div>
                <h2>01 lượt đăng bài</h2>
                <div className="payos-order-total">
                  <span>Tổng cộng</span>
                  <strong>{Number(payment.amount).toLocaleString('vi-VN')}<small>đ</small></strong>
                </div>
                <div className="payos-order-meta">
                  <span>Mã đơn hàng</span>
                  <strong>{payment.orderCode}</strong>
                </div>
                <p className="payos-trust-note"><ShieldCheck size={17} /> Thanh toán được xử lý an toàn bởi payOS. Không chia sẻ mã đơn hàng hoặc thông tin ngân hàng.</p>
                <button type="button" className="btn btn-outline payos-check-status" onClick={handleCheckStatus} disabled={checking}>
                  {checking ? 'Đang kiểm tra...' : 'Tôi đã thanh toán, kiểm tra trạng thái'}
                </button>
                <Link className="payos-back-link" to={returnTo}>Quay lại sau</Link>
              </section>

              <PayosCheckoutPanel
                payment={payment}
                onSuccess={handleCheckStatus}
                onCancel={() => toast.info('Bạn đã đóng giao diện thanh toán. Hệ thống vẫn theo dõi giao dịch và sẽ tự cập nhật.')}
              />
            </div>
          )}

          <p className="payment-terms">Lượt đăng chỉ được cấp sau khi máy chủ đối soát và xác nhận giao dịch với payOS. <Link to="/dieu-khoan">Điều khoản sử dụng</Link>.</p>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
