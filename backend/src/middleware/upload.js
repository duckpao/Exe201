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

module.exports = { uploadImages: upload.array('images', MAX_FILES) }
