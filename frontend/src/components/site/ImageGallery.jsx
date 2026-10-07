import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, Minus, Plus, RotateCcw, X } from 'lucide-react'
import PlaceholderImage from './PlaceholderImage.jsx'

const MIN_ZOOM = 1
const MAX_ZOOM = 3
const ZOOM_STEP = 0.5

export default function ImageGallery({ images = [], primaryImage, title }) {
  const galleryImages = useMemo(
    () => [...new Set([primaryImage, ...images].filter(Boolean))],
    [images, primaryImage],
  )
  const [activeIndex, setActiveIndex] = useState(null)
  const [zoom, setZoom] = useState(MIN_ZOOM)
  const isOpen = activeIndex !== null
  const hasMultipleImages = galleryImages.length > 1
  const previewImage = galleryImages[0] || primaryImage

  function closeLightbox() {
    setActiveIndex(null)
    setZoom(MIN_ZOOM)
  }

  function showPrevious() {
    setActiveIndex((current) => (current - 1 + galleryImages.length) % galleryImages.length)
    setZoom(MIN_ZOOM)
  }

  function showNext() {
    setActiveIndex((current) => (current + 1) % galleryImages.length)
    setZoom(MIN_ZOOM)
  }

  useEffect(() => {
    if (!isOpen) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event) {
      if (event.key === 'Escape') closeLightbox()
      if (event.key === 'ArrowLeft' && hasMultipleImages) showPrevious()
      if (event.key === 'ArrowRight' && hasMultipleImages) showNext()
      if (event.key === '+' || event.key === '=') setZoom((value) => Math.min(MAX_ZOOM, value + ZOOM_STEP))
      if (event.key === '-') setZoom((value) => Math.max(MIN_ZOOM, value - ZOOM_STEP))
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, hasMultipleImages, galleryImages.length])

  if (!previewImage) return null

  const lightbox = isOpen ? (
    <div className="image-lightbox" role="dialog" aria-modal="true" aria-label={`Xem ảnh ${title}`} onMouseDown={closeLightbox}>
      <div className="image-lightbox-toolbar" onMouseDown={(event) => event.stopPropagation()}>
        <span>{activeIndex + 1} / {galleryImages.length}</span>
        <button type="button" onClick={() => setZoom((value) => Math.max(MIN_ZOOM, value - ZOOM_STEP))} disabled={zoom <= MIN_ZOOM} aria-label="Thu nhỏ ảnh">
          <Minus size={20} />
        </button>
        <span>{Math.round(zoom * 100)}%</span>
        <button type="button" onClick={() => setZoom((value) => Math.min(MAX_ZOOM, value + ZOOM_STEP))} disabled={zoom >= MAX_ZOOM} aria-label="Phóng to ảnh">
          <Plus size={20} />
        </button>
        <button type="button" onClick={() => setZoom(MIN_ZOOM)} disabled={zoom === MIN_ZOOM} aria-label="Đặt lại kích thước ảnh">
          <RotateCcw size={20} />
        </button>
        <button type="button" onClick={closeLightbox} aria-label="Đóng trình xem ảnh">
          <X size={24} />
        </button>
      </div>

      {hasMultipleImages && (
        <button className="image-lightbox-nav image-lightbox-prev" type="button" onClick={(event) => { event.stopPropagation(); showPrevious() }} aria-label="Ảnh trước">
          <ChevronLeft size={32} />
        </button>
      )}

      <div className="image-lightbox-stage" onMouseDown={(event) => event.stopPropagation()}>
        <img
          src={galleryImages[activeIndex]}
          alt={`${title} - ảnh ${activeIndex + 1}`}
          style={{ transform: `scale(${zoom})` }}
          draggable="false"
        />
      </div>

      {hasMultipleImages && (
        <button className="image-lightbox-nav image-lightbox-next" type="button" onClick={(event) => { event.stopPropagation(); showNext() }} aria-label="Ảnh tiếp theo">
          <ChevronRight size={32} />
        </button>
      )}
    </div>
  ) : null

  return (
    <div className="detail-gallery">
      <button className="detail-gallery-main-button" type="button" onClick={() => setActiveIndex(0)} aria-label={`Phóng to ảnh ${title}`}>
        <PlaceholderImage src={previewImage} alt={title} className="detail-gallery-main" />
        <span className="detail-gallery-inspect">Bấm để xem ảnh lớn</span>
      </button>
      {galleryImages.length > 1 && (
        <div className="detail-gallery-thumbs">
          {galleryImages.map((src, index) => (
            <button key={`${src}-${index}`} type="button" onClick={() => setActiveIndex(index)} aria-label={`Xem ảnh ${index + 1} của ${title}`}>
              <PlaceholderImage src={src} alt={`${title} - ảnh ${index + 1}`} />
            </button>
          ))}
        </div>
      )}
      {lightbox && createPortal(lightbox, document.body)}
    </div>
  )
}