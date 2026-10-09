import { useEffect, useMemo, useState } from 'react'
import { RefreshCw, WalletCards } from 'lucide-react'
import { listAdminTransactions } from '../../services/paymentService.js'

const SERVICE_LABELS = {
  posting_credit: 'Lượt đăng bài chưa dùng',
  room: 'Phòng trọ',
  roommate: 'Roommate',
  pass_room: 'Pass phòng',
  item: 'Pass đồ',
  vehicle: 'Vận chuyển',
}

export default function AdminPaymentsPage() {
  const [serviceType, setServiceType] = useState('')
  const [data, setData] = useState({ data: [], summary: { transactionCount: 0, totalAmount: 0 }, breakdown: [], pagination: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')
    listAdminTransactions({ listing_type: serviceType, limit: 20 }, { signal: controller.signal })
      .then(setData)
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setError(requestError.message || 'Không thể tải giao dịch.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [serviceType, retry])

  const breakdown = useMemo(() => data.breakdown || [], [data.breakdown])

  return (
    <div className="admin-page">
      <div className="admin-page-heading-row">
        <div>
          <h1 className="admin-page-title">Dòng tiền</h1>
          <p className="admin-page-subtitle">Chỉ hiển thị giao dịch đã được PayOS xác nhận thành công.</p>
        </div>
        <WalletCards size={24} aria-hidden="true" />
      </div>

      <div className="admin-filter-bar">
        <label>
          Phân loại dịch vụ
          <select value={serviceType} onChange={(event) => setServiceType(event.target.value)}>
            <option value="">Tất cả dịch vụ</option>
            {Object.entries(SERVICE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
        </label>
      </div>

      {loading && <p className="listing-status">Đang tải giao dịch...</p>}
      {!loading && error && <div className="listing-error" role="alert"><p>{error}</p><button type="button" className="admin-action-btn" onClick={() => setRetry((value) => value + 1)}>Thử lại</button></div>}

      {!loading && !error && (
        <>
          <div className="stat-grid">
            <div className="stat-card"><div className="stat-card-value">{formatCurrency(data.summary.totalAmount)}</div><div className="stat-card-label">Tổng tiền đã thu</div></div>
            <div className="stat-card"><div className="stat-card-value">{data.summary.transactionCount}</div><div className="stat-card-label">Giao dịch thành công</div></div>
          </div>

          <div className="admin-grid-2">
            <section className="admin-table-card">
              <h2 className="admin-card-title">Theo dịch vụ</h2>
              <table className="admin-table">
                <thead><tr><th>Dịch vụ</th><th>Giao dịch</th><th>Doanh thu</th></tr></thead>
                <tbody>
                  {breakdown.map((item) => <tr key={item.listingType}><td>{SERVICE_LABELS[item.listingType] || item.listingType}</td><td>{item.transactionCount}</td><td>{formatCurrency(item.totalAmount)}</td></tr>)}
                  {!breakdown.length && <tr><td colSpan="3" className="admin-table-empty">Chưa có giao dịch thành công.</td></tr>}
                </tbody>
              </table>
            </section>

            <section className="admin-table-card">
              <h2 className="admin-card-title">Ghi chú đối soát</h2>
              <p className="admin-page-subtitle">Giao dịch được tính theo `status = paid`. Lượt đăng bài chưa gắn với listing được phân loại là “Lượt đăng bài chưa dùng”.</p>
              <button type="button" className="admin-action-btn" onClick={() => window.location.reload()}><RefreshCw size={14} /> Làm mới dữ liệu</button>
            </section>
          </div>

          <section className="admin-table-card">
            <h2 className="admin-card-title">Giao dịch thành công</h2>
            <div className="admin-table-scroll">
              <table className="admin-table">
                <thead><tr><th>Mã giao dịch</th><th>Người trả</th><th>Dịch vụ</th><th>Số tiền</th><th>Nhà cung cấp</th><th>Thời gian</th></tr></thead>
                <tbody>
                  {data.data.map((transaction) => <tr key={transaction.id}><td>{transaction.txnRef}</td><td><strong>{transaction.user.name}</strong><br /><span>{transaction.user.email}</span></td><td>{SERVICE_LABELS[transaction.listingType] || transaction.listingType}</td><td>{formatCurrency(transaction.amount)}</td><td>{transaction.provider}</td><td>{formatDate(transaction.paidAt)}</td></tr>)}
                  {!data.data.length && <tr><td colSpan="6" className="admin-table-empty">Chưa có giao dịch thành công.</td></tr>}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  )
}

function formatCurrency(value) {
  return `${Number(value || 0).toLocaleString('vi-VN')}đ`
}

function formatDate(value) {
  return value ? new Date(value).toLocaleString('vi-VN') : 'Chưa cập nhật'
}
