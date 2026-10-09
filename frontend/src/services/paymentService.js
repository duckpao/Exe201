const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

async function handleJson(response) {
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    const error = new Error(data.message || `Request failed: ${response.status}`)
    error.code = data.code
    error.status = response.status
    throw error
  }
  return data
}

export async function getPostingStatus() {
  return handleJson(await fetch(`${apiUrl}/api/payments/posting-status`, { credentials: 'include' }))
}

export async function createPayosPayment() {
  return handleJson(await fetch(`${apiUrl}/api/payments/payos/create`, {
    method: 'POST',
    credentials: 'include',
  }))
}

export async function getPayosPaymentStatus(orderCode) {
  return handleJson(await fetch(`${apiUrl}/api/payments/payos/status/${orderCode}`, { credentials: 'include' }))
}