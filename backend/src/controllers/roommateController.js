const roommateModel = require('../models/roommateModel')
const { resolveAddress } = require('../services/addressService')
const { uploadFiles } = require('../utils/cloudinaryUpload')
const { formatVnd, formatDateVn, formatArea, formatAddress } = require('../utils/format')
const { normalizePropertyType, normalizeGender, genderLabel } = require('../utils/enums')
const { parsePagination, buildPagination } = require('../utils/pagination')

function toRoommateCard(row) {
  return {
    id: row.id,
    name: row.poster_name,
    age: row.age,
    gender: genderLabel(row.gender_preference),
    description: row.description,
    price: formatVnd(row.budget_max || row.budget_min, '/tháng'),
    date: formatDateVn(row.created_at),
    avatar: row.poster_avatar || row.primary_image || null,
  }
}

async function listRoommates(request, response) {
  const { page, limit, offset } = parsePagination(request.query)

  const query = {
    ward: request.query.ward || null,
    budgetMin: Number(request.query.budget_min) || null,
    budgetMax: Number(request.query.budget_max) || null,
    propertyType: normalizePropertyType(request.query.property_type),
    areaMin: Number(request.query.area_min) || null,
    areaMax: Number(request.query.area_max) || null,
    gender: normalizeGender(request.query.gender),
  }

  const { rows, total } = await roommateModel.list(query, { limit, offset })

  response.json({
    data: rows.map(toRoommateCard),
    pagination: buildPagination({ page, limit, total }),
  })
}

async function getRoommate(request, response) {
  const roommate = await roommateModel.findById(request.params.id)
  if (!roommate) {
    return response.status(404).json({ message: 'Không tìm thấy bài đăng tìm roommate' })
  }

  const gallery = await roommateModel.getGallery(roommate.id)

  response.json({
    id: roommate.id,
    ownerId: roommate.posted_by,
    title: roommate.title,
    name: roommate.poster_name,
    age: roommate.age,
    gender: genderLabel(roommate.gender_preference),
    description: roommate.description,
    placeInfo: roommate.place_info,
    price: formatVnd(roommate.budget_max || roommate.budget_min, '/tháng'),
    date: formatDateVn(roommate.created_at),
    avatar: roommate.poster_avatar || null,
    address: formatAddress(roommate),
    streetAddress: roommate.street_address,
    latitude: roommate.latitude != null ? Number(roommate.latitude) : null,
    longitude: roommate.longitude != null ? Number(roommate.longitude) : null,
    propertyType: roommate.property_type,
    area: formatArea(roommate.area_m2),
    roomType: roommate.room_type,
    moveInDate: formatDateVn(roommate.move_in_date),
    tags: roommate.amenities || [],
    gallery: gallery.map((item) => item.media_url),
  })
}

async function createRoommate(request, response) {
  const {
    title, gender, ward, province, provinceCode, wardCode, streetAddress,
    budget, aboutText, placeText, age, roomType, timing, scheduledDate,
  } = request.body || {}

  if (!title || !ward || !province) {
    return response.status(400).json({ message: 'Vui lòng nhập tiêu đề và khu vực' })
  }

  const address = await resolveAddress({ ward, province, provinceCode, wardCode, streetAddress })

  const budgetValue = budget ? Number(String(budget).replace(/[^\d]/g, '')) : null
  const publishAt = timing === 'scheduled' && scheduledDate ? new Date(scheduledDate) : null

  const roommateId = await roommateModel.create({
    postedBy: request.user.id,
    addressId: address.id,
    title,
    description: aboutText,
    placeInfo: placeText,
    age: age ? Number(age) : null,
    roomType: roomType || 'looking_for_room',
    genderPreference: normalizeGender(gender) || 'any',
    budgetMin: budgetValue,
    budgetMax: budgetValue,
    publishAt,
  })

  if (request.files?.length) {
    const uploaded = await uploadFiles(request.files, 'roommates')
    await roommateModel.addImages(roommateId, uploaded)
  }

  response.status(201).json({ id: roommateId, title })
}

module.exports = { listRoommates, getRoommate, createRoommate }
