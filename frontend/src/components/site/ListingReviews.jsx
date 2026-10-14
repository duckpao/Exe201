import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import PlaceholderImage from './PlaceholderImage.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { deleteReview, listReviews, saveReview } from '../../services/reviewService.js'

const BLOCKED_MESSAGES = {
  login: null,
  own_listing: 'Bạn không thể đánh giá bài đăng của chính mình.',
  no_conversation: 'Hãy nhắn tin với người đăng trước, sau đó bạn có thể để lại đánh giá.',
}

function Stars({ value, size = 16 }) {
  return (
    <span className="review-stars" role="img" aria-label={`${value} trên 5 sao`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={size} className={n <= value ? 'review-star-on' : 'review-star-off'} />
      ))}
    </span>
  )
}

function StarPicker({ value, onChange }) {
  return (
    <div className="review-star-picker" role="radiogroup" aria-label="Chọn số sao">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} sao`}
          className="review-star-button"
          onClick={() => onChange(n)}
        >
          <Star size={26} className={n <= value ? 'review-star-on' : 'review-star-off'} />
        </button>
      ))}
    </div>
  )
}

export default function ListingReviews({ listingType, listingId }) {
  const { user } = useAuth()
  const [state, setState] = useState({ status: 'loading', data: null, error: '' })
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const load = useCallback(() => {
    const controller = new AbortController()
    listReviews(listingType, listingId, { signal: controller.signal })
      .then((data) => {
        setState({ status: 'ready', data, error: '' })
        setRating(data.myReview?.rating || 0)
        setComment(data.myReview?.comment || '')
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setState({ status: 'error', data: null, error: error.message })
      })
    return () => controller.abort()
  }, [listingType, listingId])

  useEffect(() => {
    setState({ status: 'loading', data: null, error: '' })
    return load()
  }, [load, user?.id])

  async function handleSubmit(event) {
    event.preventDefault()
    if (!rating) {
      setFormError('Vui lòng chọn số sao.')
      return
    }
    setSaving(true)
    setFormError('')
    try {
      await saveReview(listingType, listingId, { rating, comment })
      load()
    } catch (error) {
      setFormError(error.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm('Xóa đánh giá của bạn?')) return
    try {
      await deleteReview(listingType, listingId)
      setRating(0)
      setComment('')
      load()
    } catch (error) {
      setFormError(error.message)
    }
  }

  if (state.status === 'loading') return <section className="detail-reviews"><p className="listing-status">Đang tải đánh giá...</p></section>
  if (state.status === 'error') {
    return (
      <section className="detail-reviews">
        <div className="listing-error" role="alert">
          <p>{state.error || 'Không thể tải đánh giá.'}</p>
          <button type="button" className="btn btn-outline" onClick={load}>Thử lại</button>
        </div>
      </section>
    )
  }

  const { data } = state
  const blockedMessage = BLOCKED_MESSAGES[data.cannotReviewReason]

  return (
    <section className="detail-reviews" aria-labelledby="reviews-title">
      <div className="detail-reviews-head">
        <h2 id="reviews-title">Đánh giá từ người dùng</h2>
        {data.summary.count > 0 && (
          <p className="detail-reviews-summary">
            <strong>{data.summary.average}</strong> / 5 · {data.summary.count} đánh giá
          </p>
        )}
      </div>

      {data.canReview ? (
        <form className="review-form" onSubmit={handleSubmit}>
          <p className="review-form-title">{data.myReview ? 'Sửa đánh giá của bạn' : 'Viết đánh giá'}</p>
          <StarPicker value={rating} onChange={setRating} />
          <textarea
            rows={3}
            maxLength={1000}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Chia sẻ trải nghiệm của bạn (không bắt buộc)"
            aria-label="Nhận xét"
          />
          {formError && <p className="field-error" role="alert">{formError}</p>}
          <div className="review-form-actions">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Đang lưu...' : data.myReview ? 'Cập nhật' : 'Gửi đánh giá'}
            </button>
            {data.myReview && (
              <button type="button" className="btn btn-outline" onClick={handleDelete}>Xóa đánh giá</button>
            )}
          </div>
        </form>
      ) : data.cannotReviewReason === 'login' ? (
        <p className="review-note"><Link to="/login">Đăng nhập</Link> và nhắn tin với người đăng để để lại đánh giá.</p>
      ) : blockedMessage ? (
        <p className="review-note">{blockedMessage}</p>
      ) : null}

      {data.data.length === 0 ? (
        <p className="review-empty">Chưa có đánh giá nào cho bài đăng này.</p>
      ) : (
        <ul className="review-list">
          {data.data.map((review) => (
            <li key={review.id} className="review-item">
              <PlaceholderImage src={review.user.avatar} alt="" className="review-avatar" />
              <div className="review-body">
                <p className="review-author">{review.user.name}</p>
                <Stars value={review.rating} size={14} />
                {review.comment && <p className="review-comment">{review.comment}</p>}
                <p className="review-date">{new Date(review.createdAt).toLocaleDateString('vi-VN')}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
