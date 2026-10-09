import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle2, Clock3, ExternalLink, ShieldCheck } from 'lucide-react'
import SiteHeader from '../components/site/SiteHeader.jsx'
import SiteFooter from '../components/site/SiteFooter.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { createPayosPayment, getPayosPaymentStatus, getPostingStatus } from '../services/paymentService.js'
import '../styles/site.css'

export default function PostingPaymentPage() {
  const [status, setStatus] = useState(null)
  const [payment, setPayment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [checking, setChecking] = useState(false)
  const [checkoutReady, setCheckoutReady] = useState(false)
  const [checkoutInitialized, setCheckoutInitialized] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [returnNotice, setReturnNotice] = useState(null)
  const checkoutRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()
  const returnTo = new URLSearchParams(location.search).get('returnTo') || '/'

  useEffect(() => {
    getPostingStatus().then(setStatus).catch((error) => toast.error(error.message)).finally(() => setLoading(false))
  }, [toast])

  useEffect(() => {
    if (window.PayOSCheckout) {
      setCheckoutReady(true)
      return
    }

    const existingScript = document.querySelector('script[data-payos-checkout]')
    const script = existingScript || document.createElement('script')
    const onLoad = () => setCheckoutReady(true)
    script.addEventListener('load', onLoad)
    script.addEventListener('error', onLoad)
    if (!existingScript) {
      script.src = 'https://cdn.payos.vn/payos-checkout/v1/stable/payos-initialize.js'
      script.dataset.payosCheckout = 'true'
      document.head.appendChild(script)
    }

    return () => {
      script.removeEventListener('load', onLoad)
      script.removeEventListener('error', onLoad)
    }
  }, [])

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
          setReturnNotice({ type: 'success', text: 'Thanh toán đã được webhook xác nhận. Lượt đăng bài đã sẵn sàng.' })
          getPostingStatus().then(setStatus).catch(() => {})
        } else if (wasCancelled) {
          setReturnNotice({ type: 'cancelled', text: 'Giao dịch đã được hủy. Bạn có thể tạo giao dịch mới.' })
        } else {
          setReturnNotice({ type: 'pending', text: 'PayOS chưa gửi xác nhận thanh toán. Trạng thái sẽ cập nhật sau khi webhook đến.' })
        }
      })
      .catch(() => {
        if (!ignore) setReturnNotice({ type: 'pending', text: 'Chưa thể kiểm tra trạng thái. Bạn có thể kiểm tra lại sau.' })
      })
    return () => {
      ignore = true
    }
  }, [location.search])

  useEffect(() => {
    if (!payment || !checkoutReady || !window.PayOSCheckout) return
    checkoutRef.current = window.PayOSCheckout.usePayOS({
      RETURN_URL: payment.returnUrl,
      ELEMENT_ID: 'payos-checkout-frame',
      CHECKOUT_URL: payment.checkoutUrl,
      embedded: true,
      onSuccess: () => {
        setCheckoutOpen(false)
        handleCheckStatus()
      },
      onCancel: () => {
        setCheckoutOpen(false)
        toast.info('Bạn đã đóng hoặc hủy giao diện thanh toán. Trạng thái giao dịch vẫn được xác nhận qua webhook.')
      },
      onExit: () => setCheckoutOpen(false),
    })
    setCheckoutInitialized(true)
  }, [payment, checkoutReady])

  async function handleCreatePayment() {
    setCreating(true)
    try {
      const data = await createPayosPayment()
      setPayment(data)
      toast.success('Đã tạo mã QR thanh toán payOS')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setCreating(false)
    }
  }

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

  function openPayosCheckout() {
    if (!checkoutRef.current) return
    setCheckoutOpen(true)
    checkoutRef.current.open()
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
                <span><CheckCircle2 size={17} /> Cấp lượt sau khi webhook xác nhận</span>
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

              <section className="payos-checkout-panel" aria-label="Thanh toán qua payOS">
                <div className="payos-panel-heading">
                  <span className="payos-brand-mark">payOS</span>
                  <span>Thanh toán bằng QR / chuyển khoản</span>
                </div>
                <div id="payos-checkout-frame" className={`payos-checkout-frame${checkoutOpen ? ' is-open' : ''}`} />
                {!checkoutOpen && (
                  <div className="payos-checkout-start">
                    <p>Quét mã QR bằng ứng dụng ngân hàng hoặc chọn ngân hàng để chuyển khoản.</p>
                    <button type="button" className="btn btn-primary" onClick={openPayosCheckout} disabled={!checkoutInitialized}>
                      {checkoutInitialized ? 'Mở giao diện thanh toán' : 'Đang tải payOS...'}
                    </button>
                    <a className="payos-hosted-link" href={payment.checkoutUrl} target="_blank" rel="noreferrer">
                      Mở trang thanh toán payOS <ExternalLink size={15} />
                    </a>
                  </div>
                )}
              </section>
            </div>
          )}

          <p className="payment-terms">Lượt đăng chỉ được cấp sau khi máy chủ nhận và xác minh webhook từ payOS. <Link to="/dieu-khoan">Điều khoản sử dụng</Link>.</p>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}