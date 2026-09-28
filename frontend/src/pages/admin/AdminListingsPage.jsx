import { useMemo, useState } from 'react'
import { LISTING_TYPE_LABELS, MODERATION_STATUS_LABELS, mockAdminListings } from '../../data/mockAdminListings.js'

const TABS = Object.keys(LISTING_TYPE_LABELS)

const DEFAULT_LISTING_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' rx='10' fill='%23fef3c7'/%3E%3Cpath fill='%23f59e0b' d='M30 14L12 30h6v18h24V30h6z'/%3E%3Crect x='26' y='36' width='8' height='12' rx='1' fill='%23d97706'/%3E%3C/svg%3E"

export default function AdminListingsPage() {
  const [listings, setListings] = useState(mockAdminListings)
  const [activeTab, setActiveTab] = useState(TABS[0])

  const visibleListings = useMemo(
    () => listings.filter((item) => item.type === activeTab),
    [listings, activeTab]
  )

  function setModerationStatus(id, moderationStatus) {
    setListings((prev) => prev.map((item) => (item.id === id ? { ...item, moderationStatus } : item)))
  }

  function removeListing(id) {
    if (!window.confirm('Xoá tin đăng này?')) return
    setListings((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Quản lý tin đăng</h1>

      <div className="admin-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`admin-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {LISTING_TYPE_LABELS[tab]}
          </button>
        ))}
      </div>

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
            {visibleListings.map((item) => (
              <tr key={item.id}>
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
                  <div className="admin-table-subtitle">{item.subtitle}</div>
                </td>
                <td>{item.postedBy}</td>
                <td>{item.price}</td>
                <td>
                  <span className={`status-badge status-${item.moderationStatus}`}>
                    {MODERATION_STATUS_LABELS[item.moderationStatus]}
                  </span>
                </td>
                <td className="admin-table-actions">
                  {item.moderationStatus !== 'approved' && (
                    <button type="button" className="admin-action-btn" onClick={() => setModerationStatus(item.id, 'approved')}>
                      Duyệt
                    </button>
                  )}
                  {item.moderationStatus !== 'hidden' && (
                    <button type="button" className="admin-action-btn" onClick={() => setModerationStatus(item.id, 'hidden')}>
                      Ẩn
                    </button>
                  )}
                  <button type="button" className="admin-action-btn admin-action-danger" onClick={() => removeListing(item.id)}>
                    Xoá
                  </button>
                </td>
              </tr>
            ))}
            {visibleListings.length === 0 && (
              <tr>
                <td colSpan={6} className="admin-table-empty">
                  Chưa có tin đăng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  )
}
