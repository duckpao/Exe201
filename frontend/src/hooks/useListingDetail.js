import { useEffect, useState } from 'react'

// Tải chi tiết một bài đăng, dùng chung cho các trang chi tiết.
// fetcher phải là hàm ổn định (import từ service), không tạo mới mỗi lần render.
export function useListingDetail(fetcher, id) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false
    setLoading(true)
    setError('')
    fetcher(id)
      .then((result) => {
        if (!ignore) setData(result)
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
  }, [fetcher, id])

  return { data, loading, error }
}
