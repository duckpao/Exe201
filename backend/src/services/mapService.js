const GEOCODE_TIMEOUT_MS = 5000
const VIETMAP_API_URL = 'https://maps.vietmap.vn/api'

function getApiKey() {
  const apiKey = process.env.VIETMAP_API_KEY
  if (!apiKey) {
    const error = new Error('Máy chủ chưa cấu hình VIETMAP_API_KEY')
    error.http_code = 503
    throw error
  }
  return apiKey
}

async function requestVietMap(path, params) {
  const url = new URL(`${VIETMAP_API_URL}/${path}`)
  url.search = new URLSearchParams({ apikey: getApiKey(), ...params })
  const response = await fetch(url, { signal: AbortSignal.timeout(GEOCODE_TIMEOUT_MS) })
  if (!response.ok) {
    const error = new Error(`VietMap trả về HTTP ${response.status}`)
    error.http_code = response.status >= 500 ? 502 : response.status
    throw error
  }
  return response.json()
}

async function autocomplete(text, focus) {
  const normalizedText = String(text || '').trim()
  if (normalizedText.length < 2) return []
  const params = { text: normalizedText, display_type: '5' }
  if (focus) params.focus = focus
  const results = await requestVietMap('autocomplete/v4', params)
  return Array.isArray(results) ? results.slice(0, 10).map((item) => ({
    refId: item.ref_id,
    name: item.name,
    address: item.address,
    display: item.display,
  })) : []
}

async function getPlace(refId) {
  if (!refId || !String(refId).trim()) {
    const error = new Error('Thiếu refId địa điểm')
    error.http_code = 400
    throw error
  }
  const place = await requestVietMap('place/v4', { refid: String(refId).trim() })
  const lat = Number(place.lat)
  const lng = Number(place.lng)
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    const error = new Error('VietMap không trả về tọa độ hợp lệ')
    error.http_code = 502
    throw error
  }
  return {
    refId: String(refId).trim(),
    name: place.name || null,
    address: place.address || null,
    display: place.display || [place.name, place.address].filter(Boolean).join(', '),
    lat,
    lng,
  }
}

async function geocodeAddress({ streetAddress, ward, province }) {
  const apiKey = process.env.VIETMAP_API_KEY
  if (!apiKey) return null

  const fullAddress = [streetAddress, ward, province, 'Việt Nam'].filter(Boolean).join(', ')
  if (!fullAddress) return null

  try {
    const searchUrl = new URL(`${VIETMAP_API_URL}/search/v4`)
    searchUrl.search = new URLSearchParams({ apikey: apiKey, text: fullAddress, display_type: '6' })

    const searchResponse = await fetch(searchUrl, { signal: AbortSignal.timeout(GEOCODE_TIMEOUT_MS) })
    if (!searchResponse.ok) {
      console.error('VietMap Search API trả về HTTP', searchResponse.status)
      return null
    }

    const results = await searchResponse.json()
    const refId = Array.isArray(results) ? results.find((result) => result.ref_id)?.ref_id : null
    if (!refId) return null

    const placeUrl = new URL(`${VIETMAP_API_URL}/place/v4`)
    placeUrl.search = new URLSearchParams({ apikey: apiKey, refid: refId })

    const placeResponse = await fetch(placeUrl, { signal: AbortSignal.timeout(GEOCODE_TIMEOUT_MS) })
    if (!placeResponse.ok) {
      console.error('VietMap Place API trả về HTTP', placeResponse.status)
      return null
    }

    const place = await placeResponse.json()
    const lat = Number(place.lat)
    const lng = Number(place.lng)
    return Number.isFinite(lat) && Number.isFinite(lng) ? { lat, lng } : null
  } catch (error) {
    console.error('Gọi VietMap Geocoding API thất bại:', error.message)
    return null
  }
}

module.exports = { autocomplete, getPlace, geocodeAddress }
