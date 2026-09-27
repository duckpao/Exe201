const GEOCODE_TIMEOUT_MS = 5000

async function geocodeAddress({ streetAddress, ward, province }) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY
  if (!apiKey) return null

  const fullAddress = [streetAddress, ward, province, 'Việt Nam'].filter(Boolean).join(', ')
  if (!fullAddress) return null

  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${apiKey}`
    const response = await fetch(url, { signal: AbortSignal.timeout(GEOCODE_TIMEOUT_MS) })
    const data = await response.json()

    if (data.status !== 'OK' || !data.results?.length) {
      if (data.status !== 'ZERO_RESULTS') {
        console.error('Geocoding API trả về lỗi:', data.status, data.error_message)
      }
      return null
    }

    const { lat, lng } = data.results[0].geometry.location
    return { lat, lng }
  } catch (error) {
    console.error('Gọi Geocoding API thất bại:', error.message)
    return null
  }
}

module.exports = { geocodeAddress }
