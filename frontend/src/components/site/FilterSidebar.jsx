export default function FilterSidebar({ groups }) {
  return (
    <aside className="filter-sidebar">
      <h3>Bộ lọc</h3>
      {groups.map((group) => (
        <div key={group.title} className="filter-group">
          <h4>{group.title}</h4>

          {group.type === 'checkbox' &&
            group.options.map((option) => (
              <label key={option} className="filter-checkbox">
                <input type="checkbox" />
                <span>{option}</span>
              </label>
            ))}

          {group.type === 'range' && (
            <div className="filter-range">
              <input type="number" placeholder={group.min ?? 'Từ'} />
              <span>-</span>
              <input type="number" placeholder={group.max ?? 'Đến'} />
            </div>
          )}

          {group.type === 'select' && (
            <select defaultValue="">
              <option value="" disabled>
                Chọn {group.title.toLowerCase()}
              </option>
              {group.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
        </div>
      ))}
      <button type="button" className="btn btn-primary filter-apply">
        Áp dụng
      </button>
    </aside>
  )
}
