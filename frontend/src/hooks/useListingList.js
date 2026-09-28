import { useEffect, useState } from 'react'

// Tải danh sách bài đăng từ API, dùng chung cho các trang danh sách.
// fetcher phải là hàm ổn định (import từ service), không tạo mới mỗi lần render.
export function useListingList(fetcher) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false
    setLoading(true)
    setError('')
    fetcher()
      .then((data) => {
        if (!ignore) setItems(data.data || [])
      })
      .catch((err) => {
        if (!ignore) setError(err.message)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [fetcher])

  return { items, loading, error }
}
