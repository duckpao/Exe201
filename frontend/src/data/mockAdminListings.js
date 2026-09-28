import { passItems, passRooms, roommates, rooms } from './mockListings.js'

// mockListings.js chưa có trạng thái duyệt bài (dùng cho trang public), nên ở đây
// ta chỉ tạo thêm một trạng thái duyệt bài giả định theo id, dùng riêng cho khu vực
// quản trị, không đụng tới dữ liệu gốc.
function seedModerationStatus(seed) {
  const bucket = seed % 4
  if (bucket === 2) return 'pending'
  if (bucket === 3) return 'hidden'
  return 'approved'
}

export const LISTING_TYPE_LABELS = {
  room: 'Phòng trọ',
  passRoom: 'Pass phòng',
  roommate: 'Roommate',
  passItem: 'Pass đồ',
}

export const MODERATION_STATUS_LABELS = {
  approved: 'Đã duyệt',
  pending: 'Chờ duyệt',
  hidden: 'Đã ẩn',
}

function buildRows() {
  const roomRows = rooms.map((item) => ({
    id: `room-${item.id}`,
    type: 'room',
    title: item.title,
    subtitle: item.location,
    price: item.price,
    image: item.image,
    postedBy: 'Chủ trọ',
    moderationStatus: seedModerationStatus(item.id),
  }))

  const passRoomRows = passRooms.map((item) => ({
    id: `passRoom-${item.id}`,
    type: 'passRoom',
    title: item.title,
    subtitle: item.location,
    price: item.price,
    image: item.image,
    postedBy: 'Người thuê',
    moderationStatus: seedModerationStatus(item.id + 1),
  }))

  const roommateRows = roommates.map((item) => ({
    id: `roommate-${item.id}`,
    type: 'roommate',
    title: `${item.name} tìm roommate`,
    subtitle: `${item.gender}, ${item.age} tuổi`,
    price: item.price,
    image: item.avatar,
    postedBy: item.name,
    moderationStatus: seedModerationStatus(item.id + 2),
  }))

  const passItemRows = passItems.map((item) => ({
    id: `passItem-${item.id}`,
    type: 'passItem',
    title: item.title,
    subtitle: item.category,
    price: item.price,
    image: item.image,
    postedBy: 'Người bán',
    moderationStatus: seedModerationStatus(item.id + 3),
  }))

  return [...roomRows, ...passRoomRows, ...roommateRows, ...passItemRows]
}

export const mockAdminListings = buildRows()
