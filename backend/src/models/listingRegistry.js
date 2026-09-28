// Bản đồ 5 loại bài đăng dùng chung cho tính năng nhắn tin đa hình.
// conversations.(listing_type, listing_id) không thể có FOREIGN KEY vì trỏ tới nhiều bảng,
// nên mọi truy vấn cần biết bảng/cột nào ứng với từng listing_type đều đọc từ đây.
const LISTING_TYPES = {
  room: {
    table: 'room_listings',
    ownerColumn: 'landlord_id',
    titleColumn: 'title',
    imageTable: 'room_images',
    imageForeignKey: 'room_listing_id',
    path: '/phong-tro',
    label: 'phòng trọ',
  },
  roommate: {
    table: 'roommate_listings',
    ownerColumn: 'posted_by',
    titleColumn: 'title',
    imageTable: 'roommate_images',
    imageForeignKey: 'roommate_listing_id',
    path: '/tim-roommate',
    label: 'bài tìm roommate',
  },
  pass_room: {
    table: 'room_pass_listings',
    ownerColumn: 'posted_by',
    titleColumn: 'title',
    imageTable: 'room_pass_images',
    imageForeignKey: 'room_pass_listing_id',
    path: '/pass-phong',
    label: 'bài pass phòng',
  },
  item: {
    table: 'item_listings',
    ownerColumn: 'posted_by',
    titleColumn: 'title',
    imageTable: 'item_images',
    imageForeignKey: 'item_listing_id',
    path: '/pass-do',
    label: 'bài pass đồ',
  },
  vehicle: {
    table: 'vehicles',
    ownerColumn: 'owner_id',
    titleColumn: 'name',
    imageTable: 'vehicle_images',
    imageForeignKey: 'vehicle_id',
    path: '/van-chuyen-do',
    label: 'dịch vụ vận chuyển',
  },
}

const LISTING_TYPE_KEYS = Object.keys(LISTING_TYPES)

function getListingType(type) {
  return LISTING_TYPES[type] || null
}

module.exports = { LISTING_TYPES, LISTING_TYPE_KEYS, getListingType }
