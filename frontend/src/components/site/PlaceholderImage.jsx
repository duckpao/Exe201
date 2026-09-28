import { useState } from 'react'

export default function PlaceholderImage({ src, alt, className = '', fallbackSrc, ...rest }) {
  const [failed, setFailed] = useState(false)

  if (failed || !src) {
    if (fallbackSrc) {
      return (
        <img
          src={fallbackSrc}
          alt=""
          className={className}
          style={{ objectFit: 'cover' }}
          {...rest}
        />
      )
    }
    return (
      <div className={`placeholder-image ${className}`} style={{ overflow: 'hidden' }} {...rest}>
        <span style={{ display: 'none' }}>{alt}</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt=""
      className={className}
      onError={() => setFailed(true)}
      {...rest}
    />
  )
}
