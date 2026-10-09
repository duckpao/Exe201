import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Heart } from 'lucide-react'
import { addFavorite, checkFavorite, removeFavorite } from '../../services/favoriteService.js'

export default function FavoriteButton({ entityType, entityId }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isFav, setIsFav] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return
    const controller = new AbortController()
    checkFavorite(entityType, entityId, { signal: controller.signal })
      .then((data) => setIsFav(data.isFavorite))
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setError(requestError.message)
      })
    return () => controller.abort()
  }, [user, entityType, entityId])

  const toggleFav = async () => {
    if (!user) {
      navigate('/login', { state: { from: `${location.pathname}${location.search}` } })
      return
    }
    setLoading(true)
    setError('')
    try {
      if (isFav) {
        await removeFavorite(entityType, entityId)
        setIsFav(false)
      } else {
        await addFavorite(entityType, entityId)
        setIsFav(true)
      }
    } catch (requestError) {
      setError(requestError.message || 'Không thể cập nhật bài đã lưu.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <span className="favorite-control">
      <button
        type="button"
        className="favorite-button"
        onClick={toggleFav}
        disabled={loading}
        aria-label={isFav ? 'Bỏ lưu bài viết' : 'Lưu bài viết'}
        aria-pressed={isFav}
        title={isFav ? 'Bỏ lưu' : 'Lưu bài viết'}
      >
        <Heart size={20} fill={isFav ? 'currentColor' : 'none'} strokeWidth={2} />
      </button>
      {error && <span className="field-error" role="alert">{error}</span>}
    </span>
  )
}
