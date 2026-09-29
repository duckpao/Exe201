import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Heart } from 'lucide-react'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export default function FavoriteButton({ entityType, entityId }) {
  const { user } = useAuth()
  const [isFav, setIsFav] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) return
    fetch(`${apiUrl}/api/favorites/check/${entityType}/${entityId}`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => setIsFav(d.isFavorite))
      .catch(console.error)
  }, [user, entityType, entityId])

  const toggleFav = async () => {
    if (!user) {
      alert('Vui lòng đăng nhập để lưu bài đăng')
      return
    }
    setLoading(true)
    try {
      if (isFav) {
        await fetch(`${apiUrl}/api/favorites/${entityType}/${entityId}`, { method: 'DELETE', credentials: 'include' })
        setIsFav(false)
      } else {
        await fetch(`${apiUrl}/api/favorites`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ entityType, entityId })
        })
        setIsFav(true)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={toggleFav}
      disabled={loading}
      style={{
        background: 'white',
        border: '1.5px solid var(--brand-border)',
        borderRadius: '50%',
        width: 48,
        height: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: isFav ? 'var(--brand-danger)' : 'var(--brand-text-soft)',
        transition: 'all 0.2s',
      }}
      title={isFav ? "Bỏ lưu" : "Lưu bài viết"}
    >
      <Heart size={20} fill={isFav ? "currentColor" : "none"} strokeWidth={2} />
    </button>
  )
}
