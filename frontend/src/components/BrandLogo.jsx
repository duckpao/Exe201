export default function BrandLogo() {
  return (
    <div className="brand-logo">
      <svg className="brand-logo-icon" width="36" height="36" viewBox="0 0 48 48" aria-hidden="true">
        <defs>
          <linearGradient id="logoGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>
        <path d="M24 4 L44 20 V42 H4 V20 Z" fill="url(#logoGradient)" />
        <rect x="18" y="25" width="12" height="17" fill="#fff8f0" />
      </svg>
      <span className="brand-word">
        RentMate <em>Hola</em>
      </span>
    </div>
  )
}
