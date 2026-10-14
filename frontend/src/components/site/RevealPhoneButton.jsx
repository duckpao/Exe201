import { useState } from 'react'
import { Phone } from 'lucide-react'

// Bấm "Liên hệ ngay" để hiện số điện thoại người đăng; số hiện ra là liên kết gọi được.
export default function RevealPhoneButton({ phone }) {
  const [revealed, setRevealed] = useState(false)

  if (!phone) {
    return <p className="phone-missing">Người đăng chưa cập nhật số điện thoại. Hãy dùng nhắn tin để liên hệ.</p>
  }

  return revealed ? (
    <a href={`tel:${phone}`} className="btn btn-primary phone-revealed" aria-live="polite">
      <Phone size={16} /> {phone}
    </a>
  ) : (
    <button type="button" className="btn btn-primary" onClick={() => setRevealed(true)}>
      Liên hệ ngay
    </button>
  )
}
