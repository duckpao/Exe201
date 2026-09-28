import { useMemo, useState } from 'react'
import { mockAdminUsers } from '../../data/mockAdminUsers.js'
import PlaceholderImage from '../../components/site/PlaceholderImage.jsx'

const STATUS_LABELS = { active: 'Hoạt động', locked: 'Đã khoá' }

export default function AdminUsersPage() {
  const [users, setUsers] = useState(mockAdminUsers)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    return users.filter((user) => {
      const matchesKeyword =
        !keyword ||
        user.full_name.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword)
      const matchesRole = roleFilter === 'all' || user.role === roleFilter
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter
      return matchesKeyword && matchesRole && matchesStatus
    })
  }, [users, search, roleFilter, statusFilter])

  function toggleStatus(userId) {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, status: user.status === 'active' ? 'locked' : 'active' } : user
      )
    )
  }

  function changeRole(userId, role) {
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, role } : user)))
  }

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">Quản lý người dùng</h1>

      <div className="admin-filter-bar">
        <input
          type="text"
          placeholder="Tìm theo tên hoặc email..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="admin-search-input"
        />
        <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
          <option value="all">Tất cả vai trò</option>
          <option value="tenant">Người thuê</option>
          <option value="landlord">Chủ trọ</option>
          <option value="admin">Quản trị viên</option>
        </select>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="locked">Đã khoá</option>
        </select>
      </div>

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
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <PlaceholderImage
                    src={user.avatar_url || '/images/avatar-owner.jpg'}
                    alt={user.full_name}
                    className="admin-table-avatar"
                  />
                </td>
                <td>{user.full_name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>
                  <select value={user.role} onChange={(event) => changeRole(user.id, event.target.value)}>
                    <option value="tenant">Người thuê</option>
                    <option value="landlord">Chủ trọ</option>
                    <option value="admin">Quản trị viên</option>
                  </select>
                </td>
                <td>
                  <span className={`status-badge status-${user.status}`}>{STATUS_LABELS[user.status]}</span>
                </td>
                <td>{user.created_at}</td>
                <td>
                  <button type="button" className="admin-action-btn" onClick={() => toggleStatus(user.id)}>
                    {user.status === 'active' ? 'Khoá' : 'Mở khoá'}
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={8} className="admin-table-empty">
                  Không tìm thấy người dùng phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  )
}
