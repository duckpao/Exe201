const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

async function handleJson(response) {
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || `Request failed: ${response.status}`)
  return data
}

// Bốn loại bài đăng (roommate, pass phòng, pass đồ, vận chuyển) có cùng 3 endpoint:
// GET danh sách, GET chi tiết, POST tạo mới bằng FormData (kèm ảnh).
export function createListingApi(basePath) {
  return {
    async list(query = {}) {
      const params = new URLSearchParams()
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') params.set(key, value)
      })
      const response = await fetch(`${apiUrl}${basePath}?${params.toString()}`, {
        credentials: 'include',
      })
      return handleJson(response)
    },

    async get(id) {
      const response = await fetch(`${apiUrl}${basePath}/${id}`, { credentials: 'include' })
      return handleJson(response)
    },

    async create(formData) {
      const response = await fetch(`${apiUrl}${basePath}`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })
      return handleJson(response)
    },
  }
}
