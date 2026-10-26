import { useEffect, useRef } from 'react'
import { getPayosPaymentStatus } from '../services/paymentService.js'

const POLL_INTERVAL_MS = 3000
// Liên kết payOS hết hạn sau 15 phút, nên ngừng hỏi sau mốc này.
const MAX_WATCH_MS = 16 * 60 * 1000

// Hỏi máy chủ trạng thái giao dịch cho đến khi có kết quả. Máy chủ tự đối soát với payOS
// theo mã đơn hàng, nên không phụ thuộc webhook có đến được hay không.
export function usePayosWatcher(orderCode, { onPaid, onEnded }) {
  const callbacksRef = useRef({ onPaid, onEnded })

  useEffect(() => {
    callbacksRef.current = { onPaid, onEnded }
  }, [onPaid, onEnded])

  useEffect(() => {
    if (!orderCode) return undefined
    let stopped = false
    let timer = null
    const startedAt = Date.now()

    async function tick() {
      if (stopped) return
      try {
        const data = await getPayosPaymentStatus(orderCode)
        if (stopped) return
        if (data.paid) {
          stopped = true
          callbacksRef.current.onPaid?.(data)
          return
        }
        if (data.status === 'cancelled' || data.status === 'failed') {
          stopped = true
          callbacksRef.current.onEnded?.(data)
          return
        }
      } catch {
        // Lỗi mạng tạm thời: thử lại ở lần hỏi sau.
      }
      if (Date.now() - startedAt < MAX_WATCH_MS) timer = setTimeout(tick, POLL_INTERVAL_MS)
    }

    timer = setTimeout(tick, POLL_INTERVAL_MS)
    return () => {
      stopped = true
      clearTimeout(timer)
    }
  }, [orderCode])
}
