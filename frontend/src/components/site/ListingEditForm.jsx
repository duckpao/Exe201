import { useState } from 'react'
import { updateMyListing } from '../../services/userService.js'

// Nhãn tiếng Việt cho trạng thái chủ bài được tự chọn (khớp ownerStatusValues trong listingRegistry).
const STATUS_LABELS = {
  available: 'Còn phòng / còn hàng',
  rented: 'Hết phòng (đã cho thuê)',
  hidden: 'Tạm ẩn',
  active: 'Đang hiển thị / đang tìm',
  closed: 'Đã đóng',
  completed: 'Đã pass xong',
  cancelled: 'Hủy',
  sold: 'Đã bán',
  busy: 'Đang bận',
}

// Form sửa bài dùng chung cho cả 5 loại: fields/statusOptions do backend mô tả
// (listingRegistry.editableFields), nên không cần biết trước loại bài là gì.
export default function ListingEditForm({ item, onCancel, onSaved }) {
  const [values, setValues] = useState(() => ({ ...item.editable, status: item.status }))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const data = await updateMyListing(item.type, item.id, values)
      onSaved(data.listing)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="settings-edit-form" onSubmit={handleSubmit}>
      {error && <div className="banner banner-error visible">{error}</div>}
      {item.fields.map((field) => (
        <div className="form-group" key={field.name}>
          <label>{field.label}</label>
          {field.kind === 'money' ? (
            <input
              type="number"
              min="0"
              value={values[field.name] ?? ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
            />
          ) : (
            <textarea
              rows={field.name === 'description' ? 4 : 1}
              value={values[field.name] ?? ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
            />
          )}
        </div>
      ))}
      <div className="form-group">
        <label>Trạng thái</label>
        <select value={values.status} onChange={(e) => handleChange('status', e.target.value)}>
          {item.statusOptions.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status] || status}
            </option>
          ))}
        </select>
      </div>
      <div className="settings-edit-actions">
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={saving}>
          Hủy
        </button>
      </div>
    </form>
  )
}
