export default function EmptyState({ title, description, action }) {
  return (
    <div className="f-empty-state" role="status" aria-live="polite">
      <h3>{title}</h3>
      {description ? <p>{description}</p> : null}
      {action}
    </div>
  )
}
