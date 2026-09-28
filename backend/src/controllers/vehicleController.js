const vehicleModel = require('../models/vehicleModel')
const addressModel = require('../models/addressModel')
const { uploadFiles } = require('../utils/cloudinaryUpload')
const { formatVnd, formatJoinedDuration } = require('../utils/format')
const { parsePagination, buildPagination } = require('../utils/pagination')

function priceOf(row) {
  if (row.price_per_trip) return formatVnd(row.price_per_trip, '/chuyến')
  if (row.price_per_hour) return formatVnd(row.price_per_hour, '/giờ')
  return null
}

function toVehicleCard(row) {
  return {
    id: row.id,
    title: row.name,
    rating: row.avg_rating ? Number(row.avg_rating).toFixed(1) : null,
    tags: row.tags || [],
    price: priceOf(row),
    image: row.primary_image || null,
  }
}

async function listVehicles(request, response) {
  const { page, limit, offset } = parsePagination(request.query)

  const query = {
    priceMin: Number(request.query.price_min) || null,
    priceMax: Number(request.query.price_max) || null,
    serviceType: request.query.service_type || null,
    capacityMin: Number(request.query.capacity_min) || null,
    capacityMax: Number(request.query.capacity_max) || null,
  }

  const { rows, total } = await vehicleModel.list(query, { limit, offset })

  response.json({
    data: rows.map(toVehicleCard),
    pagination: buildPagination({ page, limit, total }),
  })
}

async function getVehicle(request, response) {
  const vehicle = await vehicleModel.findById(request.params.id)
  if (!vehicle) {
    return response.status(404).json({ message: 'Không tìm thấy dịch vụ vận chuyển' })
  }

  const gallery = await vehicleModel.getGallery(vehicle.id)

  response.json({
    id: vehicle.id,
    ownerId: vehicle.owner_id,
    title: vehicle.name,
    licensePlate: vehicle.license_plate,
    capacity: vehicle.capacity_kg != null ? `${Number(vehicle.capacity_kg)}kg` : null,
    pricePerHour: formatVnd(vehicle.price_per_hour, '/giờ'),
    pricePerTrip: formatVnd(vehicle.price_per_trip, '/chuyến'),
    rating: vehicle.avg_rating ? Number(vehicle.avg_rating).toFixed(1) : null,
    reviews: vehicle.review_count,
    tags: vehicle.tags || [],
    price: priceOf(vehicle),
    image: gallery[0]?.media_url || null,
    gallery: gallery.map((item) => item.media_url),
    description: vehicle.description,
    vehicleType: vehicle.vehicle_type,
    serviceType: vehicle.service_type,
    capacityKg: vehicle.capacity_kg,
    owner: {
      name: vehicle.owner_name,
      avatar: vehicle.owner_avatar,
      joined: formatJoinedDuration(vehicle.created_at),
    },
  })
}

async function createVehicle(request, response) {
  const { vehicleType, serviceType, name, licensePlate, capacityKg, pricePerHour, pricePerTrip, description, tags } = request.body || {}

  if (!vehicleType || !name || !licensePlate) {
    return response.status(400).json({ message: 'Vui lòng nhập loại xe, tên xe và biển số' })
  }

  const parsedTags = tags ? (Array.isArray(tags) ? tags : String(tags).split(',').map((item) => item.trim())) : null

  const vehicleId = await vehicleModel.create({
    ownerId: request.user.id,
    vehicleType,
    serviceType,
    name,
    licensePlate,
    capacityKg: capacityKg ? Number(capacityKg) : null,
    pricePerHour: pricePerHour ? Number(pricePerHour) : null,
    pricePerTrip: pricePerTrip ? Number(pricePerTrip) : null,
    description,
    tags: parsedTags,
  })

  if (request.files?.length) {
    const uploaded = await uploadFiles(request.files, 'transport')
    await vehicleModel.addImages(vehicleId, uploaded)
  }

  response.status(201).json({ id: vehicleId, name })
}

async function createBooking(request, response) {
  const { pickupWard, pickupProvince, pickupDistrict, dropoffWard, dropoffProvince, dropoffDistrict, scheduledAt, estimatedHours, totalPrice, note } =
    request.body || {}

  if (!pickupWard || !dropoffWard || !scheduledAt) {
    return response.status(400).json({ message: 'Vui lòng nhập điểm đón, điểm trả và thời gian' })
  }

  const vehicle = await vehicleModel.findById(request.params.id)
  if (!vehicle) {
    return response.status(404).json({ message: 'Không tìm thấy dịch vụ vận chuyển' })
  }

  const [pickupAddress, dropoffAddress] = await Promise.all([
    addressModel.findOrCreateWard({ ward: pickupWard, province: pickupProvince, district: pickupDistrict }),
    addressModel.findOrCreateWard({ ward: dropoffWard, province: dropoffProvince, district: dropoffDistrict }),
  ])

  const bookingId = await vehicleModel.createBooking({
    vehicleId: vehicle.id,
    renterId: request.user.id,
    pickupAddressId: pickupAddress.id,
    dropoffAddressId: dropoffAddress.id,
    scheduledAt,
    estimatedHours: estimatedHours ? Number(estimatedHours) : null,
    totalPrice: totalPrice ? Number(totalPrice) : null,
    note,
  })

  response.status(201).json({ id: bookingId, status: 'pending' })
}

module.exports = { listVehicles, getVehicle, createVehicle, createBooking }
