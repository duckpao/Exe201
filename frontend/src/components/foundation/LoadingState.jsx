export default function LoadingState({ label = 'Đang tải…' }) {
  return (
    <div className="f-loading-state" role="status" aria-live="polite">
      <span className="f-loading-state__spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
