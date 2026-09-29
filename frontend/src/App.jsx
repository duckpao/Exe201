import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import RoomsPage from './pages/RoomsPage.jsx'
import PostRoomPage from './pages/PostRoomPage.jsx'
import RoomDetailPage from './pages/RoomDetailPage.jsx'
import RoommatesPage from './pages/RoommatesPage.jsx'
import PostRoommatePage from './pages/PostRoommatePage.jsx'
import RoommateDetailPage from './pages/RoommateDetailPage.jsx'
import TransportPage from './pages/TransportPage.jsx'
import PostTransportPage from './pages/PostTransportPage.jsx'
import TransportDetailPage from './pages/TransportDetailPage.jsx'
import PassRoomsPage from './pages/PassRoomsPage.jsx'
import PostPassRoomPage from './pages/PostPassRoomPage.jsx'
import PassRoomDetailPage from './pages/PassRoomDetailPage.jsx'
import PassItemsPage from './pages/PassItemsPage.jsx'
import PostPassItemPage from './pages/PostPassItemPage.jsx'
import PassItemDetailPage from './pages/PassItemDetailPage.jsx'
import AboutUsPage from './pages/AboutUsPage.jsx'
import TermsOfUsePage from './pages/TermsOfUsePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx'
import ResetPasswordPage from './pages/ResetPasswordPage.jsx'
import MessagesPage from './pages/MessagesPage.jsx'
import AdminLoginPage from './pages/admin/AdminLoginPage.jsx'
import AdminOverviewPage from './pages/admin/AdminOverviewPage.jsx'
import AdminUsersPage from './pages/admin/AdminUsersPage.jsx'
import AdminListingsPage from './pages/admin/AdminListingsPage.jsx'
import AdminRoute from './components/admin/AdminRoute.jsx'
import { AdminAuthProvider } from './context/AdminAuthContext.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/phong-tro" element={<RoomsPage />} />
      <Route path="/phong-tro/dang-bai" element={<PostRoomPage />} />
      <Route path="/phong-tro/:roomId" element={<RoomDetailPage />} />
      <Route path="/tim-roommate" element={<RoommatesPage />} />
      <Route path="/tim-roommate/dang-bai" element={<PostRoommatePage />} />
      <Route path="/tim-roommate/:roommateId" element={<RoommateDetailPage />} />
      <Route path="/van-chuyen-do" element={<TransportPage />} />
      <Route path="/van-chuyen-do/dang-bai" element={<PostTransportPage />} />
      <Route path="/van-chuyen-do/:vehicleId" element={<TransportDetailPage />} />
      <Route path="/pass-phong" element={<PassRoomsPage />} />
      <Route path="/pass-phong/dang-bai" element={<PostPassRoomPage />} />
      <Route path="/pass-phong/:roomId" element={<PassRoomDetailPage />} />
      <Route path="/pass-do" element={<PassItemsPage />} />
      <Route path="/pass-do/dang-bai" element={<PostPassItemPage />} />
      <Route path="/pass-do/:itemId" element={<PassItemDetailPage />} />
      <Route path="/gioi-thieu" element={<AboutUsPage />} />
      <Route path="/dieu-khoan" element={<TermsOfUsePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dang-ky" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/tin-nhan" element={<MessagesPage />} />
      <Route path="/tin-nhan/:conversationId" element={<MessagesPage />} />

      {/* Admin routes */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin"
        element={
          <AdminAuthProvider>
            <AdminRoute />
          </AdminAuthProvider>
        }
      >
        <Route index element={<AdminOverviewPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="listings" element={<AdminListingsPage />} />
      </Route>
    </Routes>
  )
}
