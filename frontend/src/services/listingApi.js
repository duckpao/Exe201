import { deleteJson, getJson, postJson } from './api.js'

// Bốn loại bài đăng (roommate, pass phòng, pass đồ, vận chuyển) có cùng 3 endpoint:
// GET danh sách, GET chi tiết, POST tạo mới bằng FormData (kèm ảnh).
export function createListingApi(basePath) {
  return {
    async list(query = {}, options = {}) {
      return getJson(basePath, query, options)
    },

    async get(id, options = {}) {
      return getJson(`${basePath}/${id}`, {}, options)
    },

    async create(formData, options = {}) {
      return postJson(basePath, formData, options)
    },

    async remove(id, options = {}) {
      return deleteJson(`${basePath}/${id}`, options)
    },
  }
}
