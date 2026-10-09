export default function FilterSidebar({ groups, values = {}, onChange, onApply, onReset }) {
  return (
    <form className="filter-sidebar" onSubmit={(event) => { event.preventDefault(); onApply?.() }}>
      <h3>Bộ lọc</h3>
      {groups.map((group) => (
        <div key={group.title} className="filter-group">
          <h4>{group.title}</h4>

          {group.type === 'checkbox' &&
            group.options.map((option) => {
              const normalizedOption = normalizeOption(option)
              return (
              <label key={normalizedOption.value} className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={(values[group.key] || []).includes(normalizedOption.value)}
                  onChange={(event) => {
                    const current = values[group.key] || []
                    onChange?.(group.key, event.target.checked ? [...current, normalizedOption.value] : current.filter((value) => value !== normalizedOption.value))
                  }}
                />
                <span>{normalizedOption.label}</span>
              </label>
              )
            })}

          {group.type === 'range' && (
            <div className="filter-range">
              <input
                type="number"
                min="0"
                value={values[group.minKey] || ''}
                placeholder={group.min ?? 'Từ'}
                onChange={(event) => onChange?.(group.minKey, event.target.value)}
              />
              <span>-</span>
              <input
                type="number"
                min="0"
                value={values[group.maxKey] || ''}
                placeholder={group.max ?? 'Đến'}
                onChange={(event) => onChange?.(group.maxKey, event.target.value)}
              />
            </div>
          )}

          {group.type === 'select' && (
            <select
              value={values[group.key] || ''}
              onChange={(event) => onChange?.(group.key, event.target.value)}
            >
              <option value="" disabled>
                Chọn {group.title.toLowerCase()}
              </option>
              {group.options.map((option) => (
                <option key={normalizeOption(option).value} value={normalizeOption(option).value}>
                  {normalizeOption(option).label}
                </option>
              ))}
            </select>
          )}
        </div>
      ))}
      <div className="filter-actions">
        <button type="submit" className="btn btn-primary filter-apply">Áp dụng</button>
        <button type="button" className="filter-reset" onClick={onReset}>Xóa lọc</button>
      </div>
    </form>
  )
}

function normalizeOption(option) {
  return typeof option === 'string' ? { label: option, value: option } : option
}
