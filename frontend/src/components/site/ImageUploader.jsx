import { useEffect, useRef, useState } from 'react'
import { Camera } from 'lucide-react'

const MAX_FILES = 8
const MAX_FILE_SIZE = 25 * 1024 * 1024

export default function ImageUploader({ images, onChange, accept = 'image/*' }) {
  const [error, setError] = useState('')
  const imagesRef = useRef(images)

  useEffect(() => {
    imagesRef.current = images
  }, [images])

  useEffect(() => () => {
    imagesRef.current.forEach((image) => URL.revokeObjectURL(image.url))
  }, [])

  function handleChange(event) {
    const files = Array.from(event.target.files || [])
    event.target.value = ''
    if (!files.length) return

    const remaining = MAX_FILES - images.length
    if (remaining <= 0) {
      setError(`Bạn chỉ có thể tải tối đa ${MAX_FILES} file.`)
      return
    }

    const accepted = []
    const rejected = []
    files.slice(0, remaining).forEach((file) => {
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        rejected.push(`${file.name}: chỉ chấp nhận ảnh hoặc video`)
      } else if (file.size > MAX_FILE_SIZE) {
        rejected.push(`${file.name}: vượt quá giới hạn 25MB`)
      } else {
        accepted.push({ file, url: URL.createObjectURL(file) })
      }
    })

    if (files.length > remaining) rejected.push(`Chỉ còn ${remaining} vị trí tải file.`)
    setError(rejected.join('. '))
    if (accepted.length) onChange([...images, ...accepted])
  }

  function removeImage(url) {
    const image = images.find((entry) => entry.url === url)
    if (image) URL.revokeObjectURL(image.url)
    onChange(images.filter((entry) => entry.url !== url))
  }

  return (
    <div className="image-uploader">
      <label className="upload-box">
        <span><Camera size={16} /> Chọn ảnh hoặc video (tối đa {MAX_FILES} file, 25MB/file)</span>
        <input type="file" accept={accept} multiple onChange={handleChange} hidden />
      </label>
      {error && <p className="field-error" role="alert">{error}</p>}
      {images.length > 0 && (
        <div className="upload-preview-grid">
          {images.map((image) => (
            <div key={image.url} className="upload-preview-item">
              {image.file.type.startsWith('video/') ? <video src={image.url} controls aria-label={image.file.name} /> : <img src={image.url} alt={image.file.name} />}
              <button type="button" onClick={() => removeImage(image.url)} aria-label={`Xóa ${image.file.name}`}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
