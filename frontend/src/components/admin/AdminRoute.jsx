import { Navigate } from 'react-router-dom'
import { useAdminAuth } from '../../context/AdminAuthContext.jsx'
import AdminLayout from './AdminLayout.jsx'

export default function AdminRoute() {
  const { admin, loading } = useAdminAuth()

  if (loading) {
    return (
      <div className="admin-loading-screen">
        <span>Đang kiểm tra phiên đăng nhập...</span>
      </div>
    )
  }

  if (!admin) {
    return <Navigate to="/admin/login" replace />
  }

  return <AdminLayout />
}
