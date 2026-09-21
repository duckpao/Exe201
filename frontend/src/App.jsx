import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import RoomsPage from './pages/RoomsPage.jsx'
import RoommatesPage from './pages/RoommatesPage.jsx'
import TransportPage from './pages/TransportPage.jsx'
import PassRoomsPage from './pages/PassRoomsPage.jsx'
import ComingSoonPage from './pages/ComingSoonPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx'
import ResetPasswordPage from './pages/ResetPasswordPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/phong-tro" element={<RoomsPage />} />
      <Route path="/tim-roommate" element={<RoommatesPage />} />
      <Route path="/van-chuyen-do" element={<TransportPage />} />
      <Route path="/pass-phong" element={<PassRoomsPage />} />
      <Route path="/pass-do" element={<ComingSoonPage title="Pass đồ đang được phát triển" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
    </Routes>
  )
}
