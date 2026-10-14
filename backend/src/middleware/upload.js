const multer = require('multer')

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024
const MAX_FILES = 8

function fileFilter(request, file, callback) {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    return callback(null, true)
  }
  callback(new Error('Chỉ chấp nhận file ảnh hoặc video'))
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_BYTES, files: MAX_FILES },
  fileFilter,
})

// Mỗi bài đăng mới phải kèm đúng một video review. Chạy sau uploadImages, trước khi
// trừ lượt đăng bài, nên bài thiếu video không làm mất lượt đã thanh toán.
function requireReviewVideo(request, response, next) {
  const videoCount = (request.files || []).filter((file) => file.mimetype.startsWith('video/')).length
  if (videoCount === 0) {
    return response.status(400).json({ message: 'Vui lòng tải lên 1 video review cho bài đăng' })
  }
  if (videoCount > 1) {
    return response.status(400).json({ message: 'Chỉ được tải lên 1 video review' })
  }
  next()
}

// Video review tùy chọn: có thể không có, nhưng nếu có thì tối đa một.
function limitReviewVideo(request, response, next) {
  const videoCount = (request.files || []).filter((file) => file.mimetype.startsWith('video/')).length
  if (videoCount > 1) {
    return response.status(400).json({ message: 'Chỉ được tải lên 1 video review' })
  }
  next()
}

module.exports = { uploadImages: upload.array('images', MAX_FILES), requireReviewVideo, limitReviewVideo }
