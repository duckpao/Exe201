const itemModel = require('../models/itemModel')
const addressModel = require('../models/addressModel')
const { uploadFiles } = require('../utils/cloudinaryUpload')
const { formatVnd, parseVndAmount } = require('../utils/format')
const { ITEM_STATUS_LABELS } = require('../utils/enums')
const { parsePagination, buildPagination } = require('../utils/pagination')

function toItemCard(row) {
  return {
    id: row.id,
    title: row.title,
    price: formatVnd(row.price),
    category: row.category,
    condition: row.item_condition,
    location: row.ward,
    status: ITEM_STATUS_LABELS[row.status] || row.status,
    image: row.primary_image || null,
  }
}

async function listItems(request, response) {
  const { page, limit, offset } = parsePagination(request.query)

  const query = {
    ward: request.query.ward || null,
    priceMin: Number(request.query.price_min) || null,
    priceMax: Number(request.query.price_max) || null,
    category: request.query.category || null,
    condition: request.query.condition || null,
  }

  const { rows, total } = await itemModel.list(query, { limit, offset })

  response.json({
    data: rows.map(toItemCard),
    pagination: buildPagination({ page, limit, total }),
  })
}

async function getItem(request, response) {
  const item = await itemModel.findById(request.params.id)
  if (!item) {
    return response.status(404).json({ message: 'Không tìm thấy đồ pass' })
  }

  const gallery = await itemModel.getGallery(item.id)
  const statusLabel = ITEM_STATUS_LABELS[item.status] || item.status

  response.json({
    id: item.id,
    title: item.title,
    price: formatVnd(item.price),
    category: item.category,
    condition: item.item_condition,
    location: item.ward,
    status: statusLabel,
    image: gallery[0]?.media_url || null,
    tags: [item.category, item.item_condition, statusLabel],
    address: `${item.ward ? item.ward + ', ' : ''}${item.district}, ${item.province}`,
    description: item.description,
    gallery: gallery.map((entry) => entry.media_url),
    poster: { name: item.poster_name, avatar: item.poster_avatar },
  })
}

async function createItem(request, response) {
  const { title, price, category, condition, ward, province, district, description } = request.body || {}

  if (!title || !price || !category || !ward) {
    return response.status(400).json({ message: 'Vui lòng nhập tiêu đề, giá, loại đồ và khu vực' })
  }

  const address = await addressModel.findOrCreateWard({ ward, province, district })

  const itemId = await itemModel.create({
    postedBy: request.user.id,
    addressId: address.id,
    title,
    description,
    category,
    itemCondition: condition,
    price: parseVndAmount(price),
  })

  if (request.files?.length) {
    const uploaded = await uploadFiles(request.files, 'pass-do')
    await itemModel.addImages(itemId, uploaded)
  }

  response.status(201).json({ id: itemId, title, status: 'pending' })
}

async function updateItemStatus(request, response) {
  if (request.user.role !== 'admin') {
    return response.status(403).json({ message: 'Chỉ quản trị viên mới có quyền duyệt bài' })
  }

  const { status } = request.body || {}
  const allowedStatuses = ['pending', 'available', 'urgent', 'sold']
  if (!allowedStatuses.includes(status)) {
    return response.status(400).json({ message: 'Trạng thái không hợp lệ' })
  }

  const item = await itemModel.findById(request.params.id)
  if (!item) {
    return response.status(404).json({ message: 'Không tìm thấy đồ pass' })
  }

  await itemModel.updateStatus(request.params.id, status)
  response.json({ id: Number(request.params.id), status })
}

module.exports = { listItems, getItem, createItem, updateItemStatus }
