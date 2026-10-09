export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  ...props
}) {
  const classes = ['f-button', `f-button--${variant}`, `f-button--${size}`, className].filter(Boolean).join(' ')

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  )
}
