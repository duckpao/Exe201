const reviewModel = require('../models/reviewModel')
const { getListingType } = require('../models/listingRegistry')

const MAX_COMMENT_LENGTH = 1000

function parseTarget(request) {
  const config = getListingType(request.params.type)
  const id = Number(request.params.id)
  if (!config || !Number.isInteger(id) || id <= 0) return null
  return { type: request.params.type, config, id }
}

function toReview(row) {
  return {
    id: row.id,
    rating: row.rating,
    comment: row.comment,
    createdAt: row.created_at,
    user: { id: row.user_id, name: row.user_name, avatar: row.user_avatar },
  }
}

// Điều kiện đánh giá: đã đăng nhập, không phải chủ bài, và đã nhắn tin với chủ bài.
// Trả lý do từ chối để giao diện nói rõ cần làm gì tiếp.
async function evaluateEligibility(userId, target) {
  if (!userId) return { canReview: false, reason: 'login' }
  const owner = await reviewModel.findListingOwner(target.config, target.id)
  if (!owner) return { canReview: false, reason: 'not_found' }
  if (owner.owner_id === userId) return { canReview: false, reason: 'own_listing' }
  const hasConversation = await reviewModel.hasConversation(target.type, target.id, userId)
  if (!hasConversation) return { canReview: false, reason: 'no_conversation' }
  return { canReview: true, reason: null }
}

async function listReviews(request, response) {
  const target = parseTarget(request)
  if (!target) return response.status(400).json({ message: 'Loại bài đăng hoặc ID không hợp lệ' })

  const userId = request.user?.id || null
  const [rows, summary, eligibility, mine] = await Promise.all([
    reviewModel.list(target.config.reviewTarget, target.id),
    reviewModel.summary(target.config.reviewTarget, target.id),
    evaluateEligibility(userId, target),
    userId ? reviewModel.findByUser(target.config.reviewTarget, target.id, userId) : null,
  ])

  response.json({
    data: rows.map(toReview),
    summary: {
      average: summary.average_rating ? Number(Number(summary.average_rating).toFixed(1)) : null,
      count: Number(summary.review_count),
    },
    canReview: eligibility.canReview,
    cannotReviewReason: eligibility.reason,
    myReview: mine ? toReview(mine) : null,
  })
}

async function saveReview(request, response) {
  const target = parseTarget(request)
  if (!target) return response.status(400).json({ message: 'Loại bài đăng hoặc ID không hợp lệ' })

  const rating = Number(request.body?.rating)
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return response.status(400).json({ message: 'Số sao phải từ 1 đến 5' })
  }
  const comment = String(request.body?.comment ?? '').trim()
  if (comment.length > MAX_COMMENT_LENGTH) {
    return response.status(400).json({ message: `Nhận xét tối đa ${MAX_COMMENT_LENGTH} ký tự` })
  }

  const eligibility = await evaluateEligibility(request.user.id, target)
  if (!eligibility.canReview) {
    const messages = {
      not_found: 'Không tìm thấy bài đăng',
      own_listing: 'Bạn không thể đánh giá bài đăng của chính mình',
      no_conversation: 'Hãy nhắn tin với người đăng trước khi đánh giá',
    }
    return response.status(eligibility.reason === 'not_found' ? 404 : 403).json({ message: messages[eligibility.reason] })
  }

  await reviewModel.upsert({
    userId: request.user.id,
    targetType: target.config.reviewTarget,
    targetId: target.id,
    rating,
    comment: comment || null,
  })
  response.json({ message: 'Đã lưu đánh giá' })
}

async function deleteReview(request, response) {
  const target = parseTarget(request)
  if (!target) return response.status(400).json({ message: 'Loại bài đăng hoặc ID không hợp lệ' })

  const removed = await reviewModel.softDelete(target.config.reviewTarget, target.id, request.user.id)
  if (!removed) return response.status(404).json({ message: 'Bạn chưa có đánh giá cho bài này' })
  response.json({ message: 'Đã xóa đánh giá' })
}

module.exports = { listReviews, saveReview, deleteReview }
