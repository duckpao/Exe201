const addressModel = require('../models/addressModel')
const mapService = require('./mapService')

// Dùng chung cho mọi loại bài đăng: geocode địa chỉ rồi tạo/tái dùng row trong addresses.
// district luôn là null (literal JS, không lấy từ client) vì Việt Nam đã bỏ cấp huyện từ 7/2025.
async function resolveAddress({ ward, province, provinceCode, wardCode, streetAddress, formattedAddress, vietmapRefId, latitude, longitude }) {
  let place = null
  if (vietmapRefId) place = await mapService.getPlace(vietmapRefId)
  const submittedLat = Number(latitude)
  const submittedLng = Number(longitude)
  const hasSubmittedCoords = Number.isFinite(submittedLat) && Number.isFinite(submittedLng)
  const coords = place || (hasSubmittedCoords
    ? { lat: submittedLat, lng: submittedLng }
    : await mapService.geocodeAddress({ streetAddress, ward, province }))

  return addressModel.findOrCreateWard({
    ward,
    province,
    district: null,
    provinceCode: provinceCode ? Number(provinceCode) : null,
    wardCode: wardCode ? Number(wardCode) : null,
    streetAddress: streetAddress || null,
    formattedAddress: place?.display || formattedAddress || null,
    vietmapRefId: place?.refId || vietmapRefId || null,
    latitude: coords?.lat ?? null,
    longitude: coords?.lng ?? null,
    locationSource: vietmapRefId ? 'vietmap' : 'manual',
  })
}

module.exports = { resolveAddress }
