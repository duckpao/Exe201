import { useCallback, useEffect, useState } from 'react'
import { getMySubscription } from '../services/subscriptionService.js'

export const SUBSCRIPTION_CHANGED_EVENT = 'subscription-changed'

// Giữ kết quả gần nhất theo người dùng để header không nhấp nháy khi chuyển trang.
const cache = { userId: null, data: null }

// Trả về null khi chưa tải xong hoặc tải lỗi; khi đó header không đoán trạng thái gói.
export function useMySubscription(userId) {
  const [data, setData] = useState(cache.userId === userId ? cache.data : null)

  const load = useCallback(() => {
    if (!userId) return () => {}
    let ignore = false
    getMySubscription()
      .then((result) => {
        cache.userId = userId
        cache.data = result
        if (!ignore) setData(result)
      })
      .catch(() => {
        if (!ignore) setData(null)
      })
    return () => {
      ignore = true
    }
  }, [userId])

  useEffect(() => {
    if (!userId) {
      cache.userId = null
      cache.data = null
      setData(null)
      return undefined
    }
    const cancel = load()
    window.addEventListener(SUBSCRIPTION_CHANGED_EVENT, load)
    return () => {
      cancel()
      window.removeEventListener(SUBSCRIPTION_CHANGED_EVENT, load)
    }
  }, [userId, load])

  return data
}
