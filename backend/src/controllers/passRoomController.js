const passRoomModel = require('../models/passRoomModel')
const { resolveAddress } = require('../services/addressService')
const { uploadFiles } = require('../utils/cloudinaryUpload')
const { formatVnd, formatArea, parseVndAmount, parseAreaM2, formatAddress } = require('../utils/format')
const { normalizePropertyType, PASS_ROOM_STATUS_LABELS } = require('../utils/enums')
const { parsePagination, buildPagination } = require('../utils/pagination')

function toPassRoomCard(row) {
  return {
    id: row.id,
    title: row.title,
    price: formatVnd(row.monthly_price, '/tháng'),
    area: formatArea(row.area_m2),
    location: row.ward,
    status: PASS_ROOM_STATUS_LABELS[row.status] || row.status,
    image: row.primary_image || null,
  }
}

async function listPassRooms(request, response) {
  const { page, limit, offset } = parsePagination(request.query)

  const query = {
    ward: request.query.ward || null,
    priceMin: Number(request.query.price_min) || null,
    priceMax: Number(request.query.price_max) || null,
    propertyType: normalizePropertyType(request.query.property_type),
    areaMin: Number(request.query.area_min) || null,
    areaMax: Number(request.query.area_max) || null,
    amenities: request.query.amenities ? String(request.query.amenities).split(',').map((item) => item.trim()) : [],
  }

  const { rows, total } = await passRoomModel.list(query, { limit, offset })

  response.json({
    data: rows.map(toPassRoomCard),
    pagination: buildPagination({ page, limit, total }),
  })
}

async function getPassRoom(request, response) {
  const passRoom = await passRoomModel.findById(request.params.id)
  if (!passRoom) {
    return response.status(404).json({ message: 'Không tìm thấy bài pass phòng' })
  }

  const gallery = await passRoomModel.getGallery(passRoom.id)
  const statusLabel = PASS_ROOM_STATUS_LABELS[passRoom.status] || passRoom.status

  response.json({
    id: passRoom.id,
    ownerId: passRoom.posted_by,
    title: passRoom.title,
    price: formatVnd(passRoom.monthly_price, '/tháng'),
    area: formatArea(passRoom.area_m2),
    location: passRoom.ward,
    status: statusLabel,
    image: gallery[0]?.media_url || null,
    bedrooms: 1,
    bathrooms: 1,
    tags: [statusLabel, ...(passRoom.amenities || [])],
    address: formatAddress(passRoom),
    streetAddress: passRoom.street_address,
    latitude: passRoom.latitude != null ? Number(passRoom.latitude) : null,
    longitude: passRoom.longitude != null ? Number(passRoom.longitude) : null,
    description: passRoom.description,
    gallery: gallery.map((item) => item.media_url),
    passType: passRoom.pass_type,
    propertyType: passRoom.property_type,
    maxOccupants: passRoom.max_occupants,
    compensationFee: formatVnd(passRoom.compensation_fee),
    reason: passRoom.reason,
    poster: { name: passRoom.poster_name, avatar: passRoom.poster_avatar },
  })
}

async function createPassRoom(request, response) {
  const {
    postType, title, price, area, passDate, roomType, occupants, amenities, description,
    ward, province, provinceCode, wardCode, streetAddress,
  } = request.body || {}

  if (!title || !price || !ward || !province) {
    return response.status(400).json({ message: 'Vui lòng nhập tiêu đề, giá và khu vực' })
  }

  const address = await resolveAddress({ ward, province, provinceCode, wardCode, streetAddress })

  const parsedAmenities = amenities
    ? Array.isArray(amenities) ? amenities : String(amenities).split(',').map((item) => item.trim())
    : null

  const passRoomId = await passRoomModel.create({
    postedBy: request.user.id,
    addressId: address.id,
    title,
    description,
    passType: postType === 'transfer' ? 'transfer' : 'pass',
    propertyType: normalizePropertyType(roomType),
    areaM2: parseAreaM2(area),
    maxOccupants: occupants ? Number(occupants) : null,
    amenities: parsedAmenities,
    monthlyPrice: parseVndAmount(price),
    contractEndDate: passDate || null,
  })

  if (request.files?.length) {
    const uploaded = await uploadFiles(request.files, 'pass-phong')
    await passRoomModel.addImages(passRoomId, uploaded)
  }

  response.status(201).json({ id: passRoomId, title, status: 'pending' })
}

async function updatePassRoomStatus(request, response) {
  if (request.user.role !== 'admin') {
    return response.status(403).json({ message: 'Chỉ quản trị viên mới có quyền duyệt bài' })
  }

  const { status } = request.body || {}
  const allowedStatuses = ['pending', 'active', 'urgent', 'completed', 'cancelled']
  if (!allowedStatuses.includes(status)) {
    return response.status(400).json({ message: 'Trạng thái không hợp lệ' })
  }

  const passRoom = await passRoomModel.findById(request.params.id)
  if (!passRoom) {
    return response.status(404).json({ message: 'Không tìm thấy bài pass phòng' })
  }

  await passRoomModel.updateStatus(request.params.id, status)
  response.json({ id: Number(request.params.id), status })
}

module.exports = { listPassRooms, getPassRoom, createPassRoom, updatePassRoomStatus }
