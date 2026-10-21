import { useEffect, useRef, useState } from 'react'
import { ExternalLink } from 'lucide-react'

const PAYOS_SCRIPT_URL = 'https://cdn.payos.vn/payos-checkout/v1/stable/payos-initialize.js'

// Khung thanh toán payOS nhúng sẵn. payment cần có checkoutUrl và returnUrl.
// onSuccess chạy khi payOS báo thành công; trạng thái thật vẫn do webhook xác nhận.
export default function PayosCheckoutPanel({ payment, onSuccess, onCancel }) {
  const [scriptReady, setScriptReady] = useState(Boolean(window.PayOSCheckout))
  const [initialized, setInitialized] = useState(false)
  const [open, setOpen] = useState(false)
  const checkoutRef = useRef(null)
  const callbacksRef = useRef({ onSuccess, onCancel })

  useEffect(() => {
    callbacksRef.current = { onSuccess, onCancel }
  }, [onSuccess, onCancel])

  useEffect(() => {
    if (window.PayOSCheckout) {
      setScriptReady(true)
      return undefined
    }
    const existing = document.querySelector('script[data-payos-checkout]')
    const script = existing || document.createElement('script')
    const handleLoad = () => setScriptReady(true)
    script.addEventListener('load', handleLoad)
    script.addEventListener('error', handleLoad)
    if (!existing) {
      script.src = PAYOS_SCRIPT_URL
      script.dataset.payosCheckout = 'true'
      document.head.appendChild(script)
    }
    return () => {
      script.removeEventListener('load', handleLoad)
      script.removeEventListener('error', handleLoad)
    }
  }, [])

  useEffect(() => {
    if (!payment || !scriptReady || !window.PayOSCheckout) return
    checkoutRef.current = window.PayOSCheckout.usePayOS({
      RETURN_URL: payment.returnUrl,
      ELEMENT_ID: 'payos-checkout-frame',
      CHECKOUT_URL: payment.checkoutUrl,
      embedded: true,
      onSuccess: () => {
        setOpen(false)
        callbacksRef.current.onSuccess?.()
      },
      onCancel: () => {
        setOpen(false)
        callbacksRef.current.onCancel?.()
      },
      onExit: () => setOpen(false),
    })
    setInitialized(true)
  }, [payment, scriptReady])

  function openCheckout() {
    if (!checkoutRef.current) return
    setOpen(true)
    checkoutRef.current.open()
  }

  return (
    <section className="payos-checkout-panel" aria-label="Thanh toán qua payOS">
      <div className="payos-panel-heading">
        <span className="payos-brand-mark">payOS</span>
        <span>Thanh toán bằng QR / chuyển khoản</span>
      </div>
      <div id="payos-checkout-frame" className={`payos-checkout-frame${open ? ' is-open' : ''}`} />
      {!open && (
        <div className="payos-checkout-start">
          <p>Quét mã QR bằng ứng dụng ngân hàng hoặc chọn ngân hàng để chuyển khoản.</p>
          <button type="button" className="btn btn-primary" onClick={openCheckout} disabled={!initialized}>
            {initialized ? 'Mở giao diện thanh toán' : 'Đang tải payOS...'}
          </button>
          <a className="payos-hosted-link" href={payment.checkoutUrl} target="_blank" rel="noreferrer">
            Mở trang thanh toán payOS <ExternalLink size={15} />
          </a>
        </div>
      )}
    </section>
  )
}
