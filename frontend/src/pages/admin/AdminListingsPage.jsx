import { useCallback, useEffect, useState } from 'react'
import { hideAdminListing, listAdminListings, unhideAdminListing } from '../../services/adminListingService.js'

const DEFAULT_LISTING_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' rx='10' fill='%23fef3c7'/%3E%3Cpath fill='%23f59e0b' d='M30 14L12 30h6v18h24V30h6z'/%3E%3Crect x='26' y='36' width='8' height='12' rx='1' fill='%23d97706'/%3E%3C/svg%3E"

const TYPE_LABELS = {
  room: 'Phòng trọ',
  pass_room: 'Pass phòng',
  roommate: 'Roommate',
  item: 'Pass đồ',
  vehicle: 'Vận chuyển',
}

const MAX_REASON_LENGTH = 500

export default function AdminListingsPage() {
  const [activeTab, setActiveTab] = useState('room')
  const [keywordInput, setKeywordInput] = useState('')
  const [keyword, setKeyword] = useState('')
  const [page, setPage] = useState(1)
  const [data, setData] = useState({ data: [], pagination: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retry, setRetry] = useState(0)

  // Bài đang được nhập lý do ẩn: { item, reason, saving, error }
  const [hiding, setHiding] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')
    listAdminListings({ type: activeTab, keyword, page, limit: 20 }, { signal: controller.signal })
      .then(setData)
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setError(requestError.message || 'Không thể tải tin đăng.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [activeTab, keyword, page, retry])

  const reload = useCallback(() => setRetry((value) => value + 1), [])

  function changeTab(tab) {
    setActiveTab(tab)
    setPage(1)
  }

  function submitSearch(event) {
    event.preventDefault()
    setKeyword(keywordInput.trim())
    setPage(1)
  }

  async function confirmHide(event) {
    event.preventDefault()
    const reason = hiding.reason.trim()
    if (!reason) {
      setHiding((prev) => ({ ...prev, error: 'Vui lòng nhập lý do ẩn bài.' }))
      return
    }
    setHiding((prev) => ({ ...prev, saving: true, error: '' }))
    try {
      await hideAdminListing(hiding.item.type, hiding.item.id, reason)
      setHiding(null)
      reload()
    } catch (requestError) {
      setHiding((prev) => ({ ...prev, saving: false, error: requestError.message }))
    }
  }

  async function handleUnhide(item) {
    if (!window.confirm('Hiển thị lại bài đăng này?')) return
    try {
      await unhideAdminListing(item.type, item.id)
      reload()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const pagination = data.pagination

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Quản lý tin đăng</h1>

      <div className="admin-tabs">
        {Object.entries(TYPE_LABELS).map(([tab, label]) => (
          <button
            key={tab}
            type="button"
            className={`admin-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => changeTab(tab)}
          >
            {label}
          </button>
        ))}
      </div>

      <form className="admin-filter-bar" onSubmit={submitSearch}>
        <label>
          Tìm theo tiêu đề / người đăng
          <input
            type="search"
            value={keywordInput}
            onChange={(event) => setKeywordInput(event.target.value)}
            placeholder="Nhập từ khóa..."
          />
        </label>
        <button type="submit" className="admin-action-btn">Tìm</button>
      </form>

      {loading && <p className="listing-status">Đang tải tin đăng...</p>}
      {!loading && error && (
        <div className="listing-error" role="alert">
          <p>{error}</p>
          <button type="button" className="admin-action-btn" onClick={reload}>Thử lại</button>
        </div>
      )}

      {!loading && !error && (
        <section className="admin-table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Tiêu đề</th>
                <th>Người đăng</th>
                <th>Giá</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((item) => (
                <tr key={`${item.type}-${item.id}`}>
                  <td>
                    <img
                      src={item.image || DEFAULT_LISTING_IMAGE}
                      alt=""
                      className="admin-table-thumb"
                      onError={(event) => {
                        event.currentTarget.onerror = null
                        event.currentTarget.src = DEFAULT_LISTING_IMAGE
                      }}
                    />
                  </td>
                  <td>
                    <div className="admin-table-title">{item.title}</div>
                    {item.hidden && item.hiddenReason && (
                      <div className="admin-table-subtitle">Lý do ẩn: {item.hiddenReason}</div>
                    )}
                  </td>
                  <td>{item.ownerName}</td>
                  <td>{item.price}</td>
                  <td>
                    <span className={`status-badge ${item.hidden ? 'status-hidden' : 'status-approved'}`}>
                      {item.hidden ? 'Đã ẩn' : 'Đang hiển thị'}
                    </span>
                  </td>
                  <td className="admin-table-actions">
                    {item.hidden ? (
                      <button type="button" className="admin-action-btn" onClick={() => handleUnhide(item)}>
                        Hiện lại
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="admin-action-btn admin-action-danger"
                        onClick={() => setHiding({ item, reason: '', saving: false, error: '' })}
                      >
                        Ẩn
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {data.data.length === 0 && (
                <tr>
                  <td colSpan={6} className="admin-table-empty">Chưa có tin đăng nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      )}

      {!loading && !error && pagination && pagination.totalPages > 1 && (
        <div className="admin-filter-bar">
          <button type="button" className="admin-action-btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Trang trước
          </button>
          <span>Trang {pagination.page} / {pagination.totalPages}</span>
          <button
            type="button"
            className="admin-action-btn"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage(page + 1)}
          >
            Trang sau
          </button>
        </div>
      )}

      {hiding && (
        <div className="admin-modal-backdrop" role="presentation">
          <form className="admin-modal" role="dialog" aria-modal="true" aria-labelledby="hide-title" onSubmit={confirmHide}>
            <h2 id="hide-title">Ẩn bài đăng</h2>
            <p className="admin-modal-target">{hiding.item.title}</p>
            <label htmlFor="hide-reason">Lý do ẩn bài (bắt buộc)</label>
            <textarea
              id="hide-reason"
              rows={4}
              maxLength={MAX_REASON_LENGTH}
              value={hiding.reason}
              onChange={(event) => setHiding((prev) => ({ ...prev, reason: event.target.value, error: '' }))}
              placeholder="Ví dụ: Thông tin giá không đúng thực tế, hình ảnh không phù hợp..."
              autoFocus
            />
            <small>Lý do này sẽ được gửi cho người đăng qua thông báo trên website và email.</small>
            {hiding.error && <p className="admin-modal-error" role="alert">{hiding.error}</p>}
            <div className="admin-modal-actions">
              <button type="button" className="admin-action-btn" onClick={() => setHiding(null)} disabled={hiding.saving}>
                Hủy
              </button>
              <button type="submit" className="admin-action-btn admin-action-danger" disabled={hiding.saving}>
                {hiding.saving ? 'Đang ẩn...' : 'Xác nhận ẩn'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
