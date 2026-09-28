const addressModel = require('../models/addressModel')
const mapService = require('./mapService')

// Dùng chung cho mọi loại bài đăng: geocode địa chỉ rồi tạo/tái dùng row trong addresses.
// district luôn là null (literal JS, không lấy từ client) vì Việt Nam đã bỏ cấp huyện từ 7/2025.
async function resolveAddress({ ward, province, provinceCode, wardCode, streetAddress }) {
  const coords = await mapService.geocodeAddress({ streetAddress, ward, province })

  return addressModel.findOrCreateWard({
    ward,
    province,
    district: null,
    provinceCode: provinceCode ? Number(provinceCode) : null,
    wardCode: wardCode ? Number(wardCode) : null,
    streetAddress: streetAddress || null,
    latitude: coords?.lat ?? null,
    longitude: coords?.lng ?? null,
  })
}

module.exports = { resolveAddress }
