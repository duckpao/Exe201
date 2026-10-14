import { useEffect, useRef, useState } from 'react'
import { Video } from 'lucide-react'

const MAX_VIDEO_SIZE = 25 * 1024 * 1024

// Ô chọn video review. value: { file, url } hoặc null. optional=false thì hiển thị nhãn "bắt buộc".
export default function VideoUploader({ value, onChange, optional = false }) {
  const [error, setError] = useState('')
  const urlRef = useRef(null)

  useEffect(() => {
    urlRef.current = value?.url || null
  }, [value])

  useEffect(() => () => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current)
  }, [])

  function handleChange(event) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!file.type.startsWith('video/')) {
      setError('Vui lòng chọn một tệp video.')
      return
    }
    if (file.size > MAX_VIDEO_SIZE) {
      setError('Video vượt quá giới hạn 25MB.')
      return
    }
    setError('')
    if (value?.url) URL.revokeObjectURL(value.url)
    onChange({ file, url: URL.createObjectURL(file) })
  }

  function remove() {
    if (value?.url) URL.revokeObjectURL(value.url)
    onChange(null)
  }

  return (
    <div className="video-uploader">
      {value ? (
        <div className="video-uploader-preview">
          <video src={value.url} controls preload="metadata" playsInline />
          <div className="video-uploader-meta">
            <span>{value.file.name}</span>
            <button type="button" className="btn btn-outline" onClick={remove}>Chọn video khác</button>
          </div>
        </div>
      ) : (
        <label className="upload-box">
          <span><Video size={16} /> Chọn 1 video review ({optional ? 'tùy chọn' : 'bắt buộc'}, tối đa 25MB)</span>
          <input type="file" accept="video/*" onChange={handleChange} hidden />
        </label>
      )}
      {error && <p className="field-error" role="alert">{error}</p>}
    </div>
  )
}
