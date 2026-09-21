import { useState } from 'react'

export default function PlaceholderImage({ src, alt, className = '', ...rest }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div className={`placeholder-image ${className}`} {...rest}>
        <span>{alt}</span>
      </div>
    )
  }

  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} {...rest} />
}
