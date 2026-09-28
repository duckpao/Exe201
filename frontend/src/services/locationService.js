const LOCATION_API_URL = 'https://provinces.open-api.vn/api/v2'

async function handleJson(response) {
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || `Request failed: ${response.status}`)
  return data
}

let provincesCache = null

export async function listProvinces() {
  if (provincesCache) return provincesCache
  const response = await fetch(`${LOCATION_API_URL}/p/`)
  provincesCache = await handleJson(response)
  return provincesCache
}

export async function getProvinceWithWards(provinceCode) {
  const response = await fetch(`${LOCATION_API_URL}/p/${provinceCode}?depth=2`)
  return handleJson(response)
}
