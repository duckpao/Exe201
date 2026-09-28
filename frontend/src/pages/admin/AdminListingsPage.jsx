import { useMemo, useState } from 'react'
import { LISTING_TYPE_LABELS, MODERATION_STATUS_LABELS, mockAdminListings } from '../../data/mockAdminListings.js'
import PlaceholderImage from '../../components/site/PlaceholderImage.jsx'

const TABS = Object.keys(LISTING_TYPE_LABELS)

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
                  <PlaceholderImage src={item.image} alt={item.title} className="admin-table-thumb" />
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
