// Bản đồ 5 loại bài đăng dùng chung cho tính năng nhắn tin đa hình.
// conversations.(listing_type, listing_id) và favorites.(entity_type, entity_id)
// không thể có FOREIGN KEY vì trỏ tới nhiều bảng, nên mọi truy vấn cần biết
// bảng/cột nào ứng với từng loại bài đăng đều đọc từ đây.
//
// priceColumn: biểu thức SQL cho "giá đại diện" hiển thị trên thẻ danh sách.
// ownerStatusValues: các status chủ bài đăng được tự đổi. Với item/pass_room đang
// bị kiểm duyệt (tạo ra ở trạng thái pending), danh sách này CỐ TÌNH không chứa
// 'available'/'active'/'urgent' để chủ bài không tự phê duyệt bài của mình.
// editableFields: whitelist cho form "sửa bài đăng" — map tên field của API sang
// cột thật. Vì đây cũng là nguồn dữ liệu prefill cho form (xem listingSummaryModel),
// backend và frontend không thể lệch nhau. Mọi cột ngoài danh sách này (ảnh, địa chỉ,
// address_id, posted_by...) chỉ sửa được bằng cách xóa rồi đăng lại.
// Giá luôn là 'money' để đi qua parseVndAmount, chấp nhận cả "1.800.000đ" người dùng gõ.
const LISTING_TYPES = {
  room: {
    table: 'room_listings',
    ownerColumn: 'landlord_id',
    titleColumn: 'title',
    priceColumn: 'price_per_month',
    priceSuffix: '/tháng',
    imageTable: 'room_images',
    imageForeignKey: 'room_listing_id',
    ownerStatusValues: ['available', 'rented', 'hidden'],
    editableFields: {
      title: { column: 'title', kind: 'text', label: 'Tiêu đề', required: true },
      description: { column: 'description', kind: 'text', label: 'Mô tả' },
      price: { column: 'price_per_month', kind: 'money', label: 'Giá thuê / tháng', required: true },
      deposit: { column: 'deposit_amount', kind: 'money', label: 'Tiền cọc' },
    },
    path: '/phong-tro',
    label: 'phòng trọ',
    publicStatusSql: "l.status = 'available'",
  },
  roommate: {
    table: 'roommate_listings',
    ownerColumn: 'posted_by',
    titleColumn: 'title',
    priceColumn: 'budget_max',
    priceSuffix: '/tháng',
    imageTable: 'roommate_images',
    imageForeignKey: 'roommate_listing_id',
    ownerStatusValues: ['active', 'closed'],
    editableFields: {
      title: { column: 'title', kind: 'text', label: 'Tiêu đề', required: true },
      description: { column: 'description', kind: 'text', label: 'Mô tả' },
      budgetMin: { column: 'budget_min', kind: 'money', label: 'Ngân sách tối thiểu' },
      budgetMax: { column: 'budget_max', kind: 'money', label: 'Ngân sách tối đa' },
    },
    path: '/tim-roommate',
    label: 'bài tìm roommate',
    publicStatusSql: "l.status = 'active' AND (l.publish_at IS NULL OR l.publish_at <= NOW())",
  },
  pass_room: {
    table: 'room_pass_listings',
    ownerColumn: 'posted_by',
    titleColumn: 'title',
    priceColumn: 'monthly_price',
    priceSuffix: '/tháng',
    imageTable: 'room_pass_images',
    imageForeignKey: 'room_pass_listing_id',
    ownerStatusValues: ['completed', 'cancelled'],
    editableFields: {
      title: { column: 'title', kind: 'text', label: 'Tiêu đề', required: true },
      description: { column: 'description', kind: 'text', label: 'Mô tả' },
      price: { column: 'monthly_price', kind: 'money', label: 'Giá thuê / tháng', required: true },
      compensationFee: { column: 'compensation_fee', kind: 'money', label: 'Phí đền bù' },
    },
    path: '/pass-phong',
    label: 'bài pass phòng',
    publicStatusSql: "l.status IN ('active','urgent')",
  },
  item: {
    table: 'item_listings',
    ownerColumn: 'posted_by',
    titleColumn: 'title',
    priceColumn: 'price',
    priceSuffix: '',
    imageTable: 'item_images',
    imageForeignKey: 'item_listing_id',
    ownerStatusValues: ['sold'],
    editableFields: {
      title: { column: 'title', kind: 'text', label: 'Tiêu đề', required: true },
      description: { column: 'description', kind: 'text', label: 'Mô tả' },
      price: { column: 'price', kind: 'money', label: 'Giá bán', required: true },
    },
    path: '/pass-do',
    label: 'bài pass đồ',
    publicStatusSql: "l.status IN ('available','urgent')",
  },
  vehicle: {
    table: 'vehicles',
    ownerColumn: 'owner_id',
    titleColumn: 'name',
    priceColumn: 'COALESCE(price_per_trip, price_per_hour)',
    priceSuffix: '',
    imageTable: 'vehicle_images',
    imageForeignKey: 'vehicle_id',
    ownerStatusValues: ['available', 'busy', 'hidden'],
    // Lộ cả hai cột giá thay vì gộp theo priceColumn: nếu chỉ cho sửa một "giá",
    // xe đang có price_per_hour sẽ hiện giá theo giờ nhưng lưu sang price_per_trip.
    editableFields: {
      title: { column: 'name', kind: 'text', label: 'Tên dịch vụ / xe', required: true },
      description: { column: 'description', kind: 'text', label: 'Mô tả' },
      pricePerHour: { column: 'price_per_hour', kind: 'money', label: 'Giá theo giờ' },
      pricePerTrip: { column: 'price_per_trip', kind: 'money', label: 'Giá theo chuyến' },
    },
    path: '/van-chuyen-do',
    label: 'dịch vụ vận chuyển',
    publicStatusSql: "l.status = 'available'",
  },
}

const LISTING_TYPE_KEYS = Object.keys(LISTING_TYPES)

function getListingType(type) {
  return LISTING_TYPES[type] || null
}

module.exports = { LISTING_TYPES, LISTING_TYPE_KEYS, getListingType }
