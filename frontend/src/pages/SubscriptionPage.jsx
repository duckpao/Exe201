import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import SiteHeader from '../components/site/SiteHeader.jsx'
import SiteFooter from '../components/site/SiteFooter.jsx'
import PayosCheckoutPanel from '../components/site/PayosCheckoutPanel.jsx'
import MemberBadge from '../components/site/MemberBadge.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { getPayosPaymentStatus } from '../services/paymentService.js'
import { SUBSCRIPTION_CHANGED_EVENT } from '../hooks/useMySubscription.js'
import { usePayosWatcher } from '../hooks/usePayosWatcher.js'
import { safeReturnPath } from '../utils/safeReturnPath.js'
import { checkoutSubscription, getMySubscription, getSubscriptionStats, listPlans } from '../services/subscriptionService.js'
import '../styles/site.css'

const TIER_BENEFITS = {
  basic: [
    'Đăng bài không giới hạn, không bị trừ phí từng lượt',
    'Badge thành viên và đẩy lên đầu cho 5 bài mới nhất của bạn',
  ],
  pro: [
    'Đăng bài không giới hạn, không bị trừ phí từng lượt',
    'Badge thành viên và đẩy lên đầu cho mọi bài của bạn',
    'Bài xếp trên bài của thành viên Cơ bản',
    'Thống kê lượt xem và số cuộc trò chuyện theo từng bài',
  ],
}

const formatVnd = (value) => `${Number(value).toLocaleString('vi-VN')}đ`
const formatDate = (value) => new Date(value).toLocaleDateString('vi-VN')

function StatsTab({ isPro, onUpgrade }) {
  const [state, setState] = useState({ status: isPro ? 'loading' : 'locked', data: null, error: '' })

  useEffect(() => {
    if (!isPro) return undefined
    const controller = new AbortController()
    getSubscriptionStats({ signal: controller.signal })
      .then((data) => setState({ status: 'ready', data, error: '' }))
      .catch((error) => {
        if (error.name !== 'AbortError') setState({ status: 'error', data: null, error: error.message })
      })
    return () => controller.abort()
  }, [isPro])

  if (state.status === 'locked') {
    return (
      <div className="sub-empty">
        <p>Thống kê lượt xem và lượt nhắn tin chỉ có ở gói Nâng cao.</p>
        <button type="button" className="btn btn-primary" onClick={onUpgrade}>Xem gói Nâng cao</button>
      </div>
    )
  }
  if (state.status === 'loading') return <p className="listing-status">Đang tải thống kê...</p>
  if (state.status === 'error') return <div className="listing-error" role="alert"><p>{state.error}</p></div>
  if (state.data.data.length === 0) {
    return <p className="sub-empty">Bạn chưa có bài đăng nào. Số liệu sẽ xuất hiện sau khi có bài được xem.</p>
  }

  return (
    <div>
      <p className="sub-stats-total">
        30 ngày gần nhất: <strong>{state.data.totals.views30d}</strong> lượt xem, <strong>{state.data.totals.conversations}</strong> cuộc trò chuyện.
        Mỗi người được tính một lượt xem mỗi ngày; lượt xem của chính bạn không được tính.
      </p>
      <div className="sub-table-wrap">
        <table className="sub-table">
          <thead>
            <tr><th>Bài đăng</th><th>Loại</th><th>Lượt xem 30 ngày</th><th>Cuộc trò chuyện</th></tr>
          </thead>
          <tbody>
            {state.data.data.map((item) => (
              <tr key={`${item.type}-${item.id}`}>
                <td><Link to={item.path}>{item.title}</Link></td>
                <td>{item.label}</td>
                <td>{item.views30d}</td>
                <td>{item.conversations}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function SubscriptionPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, loading: authLoading } = useAuth()
  const toast = useToast()

  const [plans, setPlans] = useState([])
  const [mine, setMine] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [cycle, setCycle] = useState('monthly')
  const [tab, setTab] = useState('plans')
  const [creatingCode, setCreatingCode] = useState('')
  const [payment, setPayment] = useState(null)
  const [checking, setChecking] = useState(false)
  const [notice, setNotice] = useState(null)

  // Màn hình trước khi vào trang gói: ưu tiên returnTo do payOS gọi lại, rồi tới nơi người dùng bấm vào.
  const returnTo =
    safeReturnPath(new URLSearchParams(location.search).get('returnTo')) ||
    safeReturnPath(location.state?.from)
  const backTo = returnTo && !returnTo.startsWith('/goi-dang-ky') ? returnTo : null

  const reload = useCallback(() => {
    return Promise.all([listPlans(), getMySubscription()])
      .then(([planData, mineData]) => {
        setPlans(planData.data)
        setMine(mineData)
        setLoadError('')
        window.dispatchEvent(new Event(SUBSCRIPTION_CHANGED_EVENT))
      })
      .catch((error) => setLoadError(error.message))
  }, [])

  useEffect(() => {
    if (!authLoading && !user) navigate('/login', { state: { from: location.pathname } })
  }, [authLoading, user, navigate, location.pathname])

  useEffect(() => {
    if (user) reload()
  }, [user, reload])

  // Người dùng quay về từ payOS: hỏi máy chủ trạng thái thật thay vì tin tham số trên URL.
  useEffect(() => {
    if (!user) return undefined
    const params = new URLSearchParams(location.search)
    const orderCode = params.get('orderCode')
    if (!orderCode) {
      if (params.get('cancel') === 'true') setNotice({ type: 'cancelled', text: 'Giao dịch đã được hủy. Bạn có thể chọn gói lại.' })
      return undefined
    }
    let ignore = false
    getPayosPaymentStatus(orderCode)
      .then((data) => {
        if (ignore) return
        if (data.paid) {
          setNotice({ type: 'success', text: 'Thanh toán đã được xác nhận. Gói của bạn đã được kích hoạt.' })
          reload().then(() => backTo && navigate(backTo, { replace: true }))
        } else {
          setNotice({ type: 'pending', text: 'payOS chưa ghi nhận thanh toán. Hệ thống sẽ tự kiểm tra lại, bạn có thể chờ ở trang này.' })
        }
      })
      .catch((error) => !ignore && setNotice({ type: 'pending', text: error.message }))
    return () => {
      ignore = true
    }
  }, [user, location.search, reload])

  async function handleBuy(plan) {
    setCreatingCode(plan.code)
    try {
      setPayment(await checkoutSubscription(plan.code, backTo || undefined))
    } catch (error) {
      toast.error(error.message)
    } finally {
      setCreatingCode('')
    }
  }

  // Gói đã kích hoạt: làm mới trạng thái rồi quay về màn hình trước đó (nếu biết).
  async function finishPaid() {
    toast.success('Thanh toán thành công. Gói của bạn đã được kích hoạt.')
    setPayment(null)
    await reload()
    if (backTo) navigate(backTo, { replace: true })
  }

  usePayosWatcher(payment?.orderCode, {
    onPaid: finishPaid,
    onEnded: () => {
      toast.info('Giao dịch đã bị hủy hoặc hết hạn. Bạn có thể chọn gói lại.')
      setPayment(null)
    },
  })

  async function handleCheck() {
    if (!payment) return
    setChecking(true)
    try {
      const data = await getPayosPaymentStatus(payment.orderCode)
      if (data.paid) {
        await finishPaid()
      } else {
        toast.info(data.status === 'cancelled' ? 'Giao dịch đã bị hủy.' : 'Chưa ghi nhận thanh toán. Vui lòng kiểm tra lại sau ít phút.')
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setChecking(false)
    }
  }

  if (authLoading || !user) return null

  const isPro = mine?.current?.tier === 'pro'
  const visiblePlans = plans.filter((plan) => plan.cycle === cycle)

  return (
    <div className="site-page">
      <SiteHeader />
      <main className="site-main sub-page">
        <h1>Gói đăng ký</h1>
        <p className="sub-intro">
          Có gói còn hạn thì bạn đăng bài không bị trừ phí từng lượt. Bài của thành viên có badge, và ở Phòng trọ và Pass phòng được xếp lên đầu danh sách.
        </p>

        {notice && <div className={`payos-return-notice ${notice.type}`} role="status">{notice.text}</div>}
        {loadError && <div className="listing-error" role="alert"><p>{loadError}</p><button type="button" className="btn btn-outline" onClick={reload}>Thử lại</button></div>}

        {mine && (
          <section className="sub-current" aria-labelledby="sub-current-title">
            <h2 id="sub-current-title">Gói hiện tại</h2>
            {mine.current ? (
              <p>
                <MemberBadge member={mine.current} /> Gói {mine.current.tierLabel} theo {mine.current.cycle === 'yearly' ? 'năm' : 'tháng'}, hết hạn ngày <strong>{formatDate(mine.current.expiresAt)}</strong>.
              </p>
            ) : (
              <p>Bạn chưa có gói nào. Bài đăng được tính phí theo lượt sau 2 tháng miễn phí đầu tiên.</p>
            )}
            {mine.queued.map((item) => (
              <p key={item.id} className="sub-queued">
                Gói {item.tierLabel} theo {item.cycle === 'yearly' ? 'năm' : 'tháng'} sẽ bắt đầu ngày {formatDate(item.startsAt)} và hết hạn ngày {formatDate(item.expiresAt)}.
              </p>
            ))}
          </section>
        )}

        <div className="sub-tabs" role="tablist">
          <button type="button" role="tab" aria-selected={tab === 'plans'} className={tab === 'plans' ? 'active' : ''} onClick={() => setTab('plans')}>Chọn gói</button>
          <button type="button" role="tab" aria-selected={tab === 'stats'} className={tab === 'stats' ? 'active' : ''} onClick={() => setTab('stats')}>Thống kê</button>
        </div>

        {tab === 'plans' && (
          <>
            <div className="sub-cycle" role="radiogroup" aria-label="Chu kỳ thanh toán">
              {[['monthly', 'Theo tháng'], ['yearly', 'Theo năm']].map(([value, label]) => (
                <button key={value} type="button" role="radio" aria-checked={cycle === value} className={cycle === value ? 'active' : ''} onClick={() => setCycle(value)}>
                  {label}
                </button>
              ))}
            </div>

            <div className="sub-plans">
              {visiblePlans.map((plan) => {
                const blocked = mine?.lockedTier && mine.lockedTier !== plan.tier
                return (
                  <article key={plan.code} className="sub-plan">
                    <h2>{plan.tierLabel}</h2>
                    <p className="sub-plan-price">
                      <strong>{formatVnd(plan.price)}</strong> / {plan.cycle === 'yearly' ? 'năm' : 'tháng'}
                    </p>
                    {plan.savings > 0 && <p className="sub-plan-savings">Rẻ hơn {formatVnd(plan.savings)} so với trả theo tháng.</p>}
                    <ul>
                      {TIER_BENEFITS[plan.tier].map((benefit) => <li key={benefit}>{benefit}</li>)}
                    </ul>
                    <button type="button" className="btn btn-primary" disabled={blocked || Boolean(creatingCode) || Boolean(payment)} onClick={() => handleBuy(plan)}>
                      {creatingCode === plan.code ? 'Đang tạo giao dịch...' : mine?.lockedTier === plan.tier ? 'Gia hạn' : 'Mua gói'}
                    </button>
                    {blocked && (
                      <p className="sub-plan-blocked">
                        Bạn đang dùng hạng khác đến {formatDate(mine.renewableFrom)}. Bạn có thể mua hạng này sau ngày đó.
                      </p>
                    )}
                  </article>
                )
              })}
            </div>
            <p className="sub-note">Thanh toán một lần, không tự động gia hạn. Gia hạn khi còn hạn sẽ được cộng dồn thời gian. Không hoàn tiền. <Link to="/dieu-khoan">Điều khoản sử dụng</Link>.</p>

            {payment && (
              <div className="sub-checkout">
                <div className="sub-checkout-summary">
                  <h2>Đơn thanh toán</h2>
                  <p>Gói {payment.plan.tierLabel} theo {payment.plan.cycle === 'yearly' ? 'năm' : 'tháng'}: <strong>{formatVnd(payment.amount)}</strong></p>
                  <p>Mã đơn hàng: {payment.orderCode}</p>
                  <button type="button" className="btn btn-outline" onClick={handleCheck} disabled={checking}>
                    {checking ? 'Đang kiểm tra...' : 'Tôi đã thanh toán, kiểm tra trạng thái'}
                  </button>
                  <button type="button" className="btn btn-outline" onClick={() => setPayment(null)}>Chọn gói khác</button>
                </div>
                <PayosCheckoutPanel
                  payment={payment}
                  onSuccess={handleCheck}
                  onCancel={() => toast.info('Bạn đã đóng giao diện thanh toán. Hệ thống vẫn theo dõi giao dịch và sẽ tự cập nhật.')}
                />
              </div>
            )}
          </>
        )}

        {tab === 'stats' && mine && <StatsTab isPro={isPro} onUpgrade={() => { setTab('plans'); setCycle('monthly') }} />}
      </main>
      <SiteFooter />
    </div>
  )
}
