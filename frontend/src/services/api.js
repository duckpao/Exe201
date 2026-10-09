const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export function buildQueryString(query = {}) {
  const params = new URLSearchParams()

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    params.set(key, String(value))
  })

  const queryString = params.toString()
  return queryString ? `?${queryString}` : ''
}

export function normalizeApiError(payload, status) {
  const message = payload?.message || `Request failed: ${status}`
  const error = new Error(message)
  error.status = status
  error.code = payload?.code || null
  error.fieldErrors = payload?.fieldErrors || null
  error.raw = payload
  return error
}

export async function apiRequest(path, options = {}) {
  const finalOptions = {
    credentials: 'include',
    ...options,
  }

  if (
    finalOptions.body !== undefined &&
    finalOptions.body !== null &&
    !(finalOptions.body instanceof FormData) &&
    !(finalOptions.body instanceof URLSearchParams)
  ) {
    const headers = new Headers(finalOptions.headers || {})
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }
    finalOptions.headers = headers
    finalOptions.body = JSON.stringify(finalOptions.body)
  }

  const response = await fetch(`${apiUrl}${path}`, finalOptions)
  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw normalizeApiError(payload, response.status)
  }

  return payload
}

export function getJson(path, query = {}, options = {}) {
  return apiRequest(`${path}${buildQueryString(query)}`, options)
}

export function postJson(path, body, options = {}) {
  return apiRequest(path, {
    method: 'POST',
    ...options,
    body,
  })
}

export function putJson(path, body, options = {}) {
  return apiRequest(path, {
    method: 'PUT',
    ...options,
    body,
  })
}

export function deleteJson(path, options = {}) {
  return apiRequest(path, {
    method: 'DELETE',
    ...options,
  })
}
