// Ảnh luôn xếp trước video để ảnh đầu tiên là ảnh đại diện (is_primary); video không bao giờ
// được chọn làm ảnh đại diện vì thẻ danh sách hiển thị nó bằng thẻ <img>.
function buildMediaRows(parentId, uploaded) {
  const ordered = [
    ...uploaded.filter((media) => media.mediaType !== 'video'),
    ...uploaded.filter((media) => media.mediaType === 'video'),
  ]
  let primaryAssigned = false
  return ordered.map((media) => {
    const isPrimary = !primaryAssigned && media.mediaType !== 'video'
    if (isPrimary) primaryAssigned = true
    return [parentId, media.url, media.mediaType, isPrimary ? 1 : 0]
  })
}

// rows: kết quả getGallery() của các model (media_url, media_type).
function splitGallery(rows) {
  return {
    images: rows.filter((row) => row.media_type !== 'video').map((row) => row.media_url),
    videoUrl: rows.find((row) => row.media_type === 'video')?.media_url || null,
  }
}

module.exports = { buildMediaRows, splitGallery }
