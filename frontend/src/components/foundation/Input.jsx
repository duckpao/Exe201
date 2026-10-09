export default function Input({ label, error, className = '', ...props }) {
  const classes = ['f-input', error ? 'f-input--error' : '', className].filter(Boolean).join(' ')

  return (
    <label className="f-field">
      {label ? <span className="f-field__label">{label}</span> : null}
      <input className={classes} {...props} />
      {error ? <span className="f-field__error">{error}</span> : null}
    </label>
  )
}
