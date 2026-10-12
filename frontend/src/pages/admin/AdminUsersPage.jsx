import { useEffect, useState } from 'react'
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'
import { listAdminUsers, updateAdminUser } from '../../services/adminUserService.js'

const STATUS_LABELS = { active: 'Hoạt động', locked: 'Đã khoá' }

const DEFAULT_USER_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='20' fill='%23fed7aa'/%3E%3Ccircle cx='20' cy='15' r='6' fill='%23ea580c'/%3E%3Cpath fill='%23ea580c' d='M9 33c0-6.1 4.9-11 11-11s11 4.9 11 11'/%3E%3C/svg%3E"

export default function AdminUsersPage() {
  const { admin } = useAdminAuth()
  const [data, setData] = useState({ data: [], pagination: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [keyword, setKeyword] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [retry, setRetry] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')
    listAdminUsers(
      { keyword, role: roleFilter, status: statusFilter, page, limit: 20 },
      { signal: controller.signal }
    )
      .then(setData)
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setError(requestError.message || 'Không thể tải người dùng.')
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [keyword, roleFilter, statusFilter, page, retry])

  function submitSearch(event) {
    event.preventDefault()
    setKeyword(searchInput.trim())
    setPage(1)
  }

  function changeFilter(setter) {
    return (event) => {
      setter(event.target.value)
      setPage(1)
    }
  }

  async function applyChange(user, changes, confirmText) {
    if (confirmText && !window.confirm(confirmText)) return
    setActionError('')
    try {
      const { user: updated } = await updateAdminUser(user.id, changes)
      setData((prev) => ({ ...prev, data: prev.data.map((item) => (item.id === updated.id ? updated : item)) }))
    } catch (requestError) {
      setActionError(requestError.message)
    }
  }

  const pagination = data.pagination

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Quản lý người dùng</h1>

      <form className="admin-filter-bar" onSubmit={submitSearch}>
        <input
          type="search"
          placeholder="Tìm theo tên hoặc email..."
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          className="admin-search-input"
        />
        <select value={roleFilter} onChange={changeFilter(setRoleFilter)}>
          <option value="">Tất cả vai trò</option>
          <option value="tenant">Người thuê</option>
          <option value="landlord">Chủ trọ</option>
          <option value="admin">Quản trị viên</option>
        </select>
        <select value={statusFilter} onChange={changeFilter(setStatusFilter)}>
          <option value="">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="locked">Đã khoá</option>
        </select>
        <button type="submit" className="admin-action-btn">Tìm</button>
      </form>

      {actionError && <div className="listing-error" role="alert"><p>{actionError}</p></div>}
      {loading && <p className="listing-status">Đang tải người dùng...</p>}
      {!loading && error && (
        <div className="listing-error" role="alert">
          <p>{error}</p>
          <button type="button" className="admin-action-btn" onClick={() => setRetry((value) => value + 1)}>Thử lại</button>
        </div>
      )}

      {!loading && !error && (
        <section className="admin-table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>SĐT</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {data.data.map((user) => {
                const isSelf = user.id === admin?.id
                return (
                  <tr key={user.id}>
                    <td>
                      <img
                        src={user.avatar_url || DEFAULT_USER_AVATAR}
                        alt=""
                        className="admin-table-avatar"
                        onError={(event) => {
                          event.currentTarget.onerror = null
                          event.currentTarget.src = DEFAULT_USER_AVATAR
                        }}
                      />
                    </td>
                    <td>{user.full_name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>
                      <select
                        value={user.role}
                        disabled={isSelf}
                        onChange={(event) =>
                          applyChange(user, { role: event.target.value }, `Đổi vai trò của ${user.full_name}?`)
                        }
                      >
                        <option value="tenant">Người thuê</option>
                        <option value="landlord">Chủ trọ</option>
                        <option value="admin">Quản trị viên</option>
                      </select>
                    </td>
                    <td>
                      <span className={`status-badge status-${user.status}`}>{STATUS_LABELS[user.status]}</span>
                    </td>
                    <td>{new Date(user.created_at).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <button
                        type="button"
                        className="admin-action-btn"
                        disabled={isSelf}
                        onClick={() =>
                          applyChange(
                            user,
                            { status: user.status === 'active' ? 'locked' : 'active' },
                            user.status === 'active' ? `Khoá tài khoản ${user.full_name}?` : null
                          )
                        }
                      >
                        {user.status === 'active' ? 'Khoá' : 'Mở khoá'}
                      </button>
                    </td>
                  </tr>
                )
              })}
              {data.data.length === 0 && (
                <tr>
                  <td colSpan={8} className="admin-table-empty">Không tìm thấy người dùng phù hợp.</td>
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
    </div>
  )
}
