const roomModel = require('../models/roomModel')
const addressModel = require('../models/addressModel')
const mapService = require('../services/mapService')
const { uploadFiles } = require('../utils/cloudinaryUpload')
const { formatVnd, formatArea, formatJoinedDuration } = require('../utils/format')
const { normalizePropertyType } = require('../utils/enums')
const { parsePagination, buildPagination } = require('../utils/pagination')

function toRoomCard(row) {
  const amenities = row.amenities || []
  return {
    id: row.id,
    title: row.title,
    price: formatVnd(row.price_per_month, '/tháng'),
    area: formatArea(row.area_m2),
    location: row.ward,
    tag: amenities[0] || null,
    image: row.primary_image || null,
    status: row.status,
    propertyType: row.property_type,
  }
}

async function listRooms(request, response) {
  const { page, limit, offset } = parsePagination(request.query)

  const query = {
    keyword: request.query.keyword || null,
    priceMin: Number(request.query.price_min) || null,
    priceMax: Number(request.query.price_max) || null,
    propertyType: normalizePropertyType(request.query.property_type),
    areaMin: Number(request.query.area_min) || null,
    areaMax: Number(request.query.area_max) || null,
    ward: request.query.ward || null,
    amenities: request.query.amenities ? String(request.query.amenities).split(',').map((item) => item.trim()) : [],
  }

  const { rows, total } = await roomModel.list(query, { limit, offset })

  response.json({
    data: rows.map(toRoomCard),
    pagination: buildPagination({ page, limit, total }),
  })
}

async function getRoom(request, response) {
  const room = await roomModel.findById(request.params.id)
  if (!room) {
    return response.status(404).json({ message: 'Không tìm thấy phòng trọ' })
  }

  const [gallery, ownerRating] = await Promise.all([
    roomModel.getGallery(room.id),
    roomModel.getLandlordRating(room.landlord_id),
  ])

  const amenities = room.amenities || []

  response.json({
    id: room.id,
    title: room.title,
    price: formatVnd(room.price_per_month, '/tháng'),
    area: formatArea(room.area_m2),
    location: room.ward,
    tag: amenities[0] || null,
    image: gallery[0]?.media_url || null,
    status: room.status,
    propertyType: room.property_type,
    bedrooms: 1,
    bathrooms: 1,
    tags: amenities,
    address: `${room.ward ? room.ward + ', ' : ''}${room.district ? room.district + ', ' : ''}${room.province}`,
    streetAddress: room.street_address,
    latitude: room.latitude != null ? Number(room.latitude) : null,
    longitude: room.longitude != null ? Number(room.longitude) : null,
    description: room.description,
    gallery: gallery.map((item) => item.media_url),
    depositAmount: formatVnd(room.deposit_amount),
    maxOccupants: room.max_occupants,
    owner: {
      id: room.landlord_user_id,
      name: room.landlord_name,
      avatar: room.landlord_avatar,
      phone: room.landlord_phone,
      email: room.landlord_email,
      rating: ownerRating.avg_rating ? Number(ownerRating.avg_rating).toFixed(1) : null,
      reviews: ownerRating.review_count,
      joined: formatJoinedDuration(room.landlord_created_at),
    },
  })
}

async function createRoom(request, response) {
  const {
    title, description, propertyType, pricePerMonth, depositAmount, areaM2, maxOccupants, amenities,
    ward, province, provinceCode, wardCode, streetAddress,
  } = request.body || {}

  if (!title || !pricePerMonth || !ward || !province) {
    return response.status(400).json({ message: 'Vui lòng nhập tiêu đề, giá thuê và khu vực' })
  }

  const coords = await mapService.geocodeAddress({ streetAddress, ward, province })

  const address = await addressModel.findOrCreateWard({
    ward,
    province,
    district: null,
    provinceCode: provinceCode ? Number(provinceCode) : null,
    wardCode: wardCode ? Number(wardCode) : null,
    streetAddress: streetAddress || null,
    latitude: coords?.lat ?? null,
    longitude: coords?.lng ?? null,
  })

  const parsedAmenities = amenities
    ? Array.isArray(amenities) ? amenities : String(amenities).split(',').map((item) => item.trim())
    : null

  const roomId = await roomModel.create({
    landlordId: request.user.id,
    addressId: address.id,
    title,
    description,
    propertyType: normalizePropertyType(propertyType) || 'phong_tro',
    pricePerMonth: Number(pricePerMonth),
    depositAmount: depositAmount ? Number(depositAmount) : null,
    areaM2: areaM2 ? Number(areaM2) : null,
    maxOccupants: maxOccupants ? Number(maxOccupants) : null,
    amenities: parsedAmenities,
  })

  if (request.files?.length) {
    const uploaded = await uploadFiles(request.files, 'rooms')
    await roomModel.addImages(roomId, uploaded)
  }

  const room = await roomModel.findById(roomId)
  response.status(201).json({ id: room.id, title: room.title })
}

module.exports = { listRooms, getRoom, createRoom }
