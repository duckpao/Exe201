import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { startConversation } from '../../services/conversationService.js'

// Nút "Nhắn tin" dùng chung cho cả 5 loại bài đăng.
// listingType: 'room' | 'roommate' | 'pass_room' | 'item' | 'vehicle'
function MessageOwnerButton({ listingType, listingId, ownerId, className = 'btn btn-outline' }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState('')
  const [starting, setStarting] = useState(false)

  // Người đăng không thể tự nhắn tin cho chính mình (backend cũng chặn).
  const isOwnListing = user && ownerId && user.id === ownerId

  async function handleClick() {
    if (!user) {
      navigate('/login', { state: { from: `${location.pathname}${location.search}` } })
      return
    }
    setError('')
    setStarting(true)
    try {
      const conversation = await startConversation(listingType, listingId)
      navigate(`/tin-nhan/${conversation.id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setStarting(false)
    }
  }

  if (isOwnListing) {
    return <p className="listing-status">Đây là bài đăng của bạn.</p>
  }

  return (
    <>
      {error && <p className="banner banner-error visible">{error}</p>}
      <button type="button" className={className} onClick={handleClick} disabled={starting}>
        {starting ? 'Đang mở...' : 'Nhắn tin'}
      </button>
    </>
  )
}

export default MessageOwnerButton
