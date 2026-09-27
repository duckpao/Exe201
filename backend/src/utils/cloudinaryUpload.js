const cloudinary = require('../config/cloudinary')

function uploadBuffer(buffer, folder) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'auto', folder },
      (error, result) => {
        if (error) return reject(error)
        resolve({
          url: result.secure_url,
          mediaType: result.resource_type === 'video' ? 'video' : 'image',
        })
      }
    )
    uploadStream.end(buffer)
  })
}

async function uploadFiles(files = [], folder) {
  return Promise.all(files.map((file) => uploadBuffer(file.buffer, folder)))
}

module.exports = { uploadBuffer, uploadFiles }
