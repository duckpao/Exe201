export const rooms = [
  { id: 1, title: 'Phòng trọ full nội thất gần khu dịch vụ Tân Xã', price: '1.800.000đ/tháng', area: '25m²', location: 'Tân Xã', tag: 'Full nội thất', image: '/images/room-1.jpg' },
  { id: 2, title: 'Phòng trọ mới xây, an ninh 24/7', price: '2.300.000đ/tháng', area: '28m²', location: 'Thạch Hòa', tag: 'Có gác lửng', image: '/images/room-2.jpg' },
  { id: 3, title: 'Phòng trọ giá rẻ cho sinh viên', price: '1.500.000đ/tháng', area: '18m²', location: 'Thạch Thất', tag: 'Full nội thất', image: '/images/room-3.jpg' },
  { id: 4, title: 'Phòng trọ ban công thoáng mát', price: '2.100.000đ/tháng', area: '24m²', location: 'Tân Xã', tag: 'Có ban công', image: '/images/room-4.jpg' },
]

export const roommates = [
  { id: 1, name: 'Lê Thị Mai', age: 20, gender: 'Nữ', description: 'Mình đang thuê phòng 2 người, còn 1 giường trống, tìm bạn nữ ở ghép, sạch sẽ, hoà đồng.', price: '1.300.000đ/tháng', date: '25/09/2026', avatar: '/images/roommate-1.jpg' },
  { id: 2, name: 'Đỗ Thị Hoa', age: 21, gender: 'Không yêu cầu', description: 'Mình mới chuyển ra Hòa Lạc đi làm, muốn tìm phòng và ở ghép cùng 1-2 bạn, ngân sách vừa phải.', price: '1.200.000đ/tháng', date: '26/09/2026', avatar: '/images/roommate-2.jpg' },
  { id: 3, name: 'Hoàng Văn Nam', age: 22, gender: 'Nam', description: 'Phòng 2 người, tiện đi làm, tìm bạn nam sạch sẽ, không hút thuốc trong phòng.', price: '1.400.000đ/tháng', date: '27/09/2026', avatar: '/images/roommate-3.jpg' },
]

export const transportServices = [
  { id: 1, title: 'Ford Transit chở đồ - Chuyển nhà trọn gói', rating: 5, tags: ['Trọn gói', 'Có bảo hiểm'], price: '500.000đ/chuyến', image: '/images/transport-1.jpg' },
  { id: 2, title: 'Xe tải 1.5 tấn - Xe tải nhỏ', rating: 4.5, tags: ['Đường dài', 'Có bốc xếp'], price: '800.000đ/chuyến', image: '/images/transport-2.jpg' },
  { id: 3, title: 'Xe máy chở hàng Honda Wave - Xe máy kéo', rating: 4, tags: ['Giá rẻ', 'Nhanh chóng'], price: '150.000đ/chuyến', image: '/images/transport-3.jpg' },
]

export const roomOwner = {
  name: 'Trần Thị Lan',
  avatar: '/images/avatar-owner.jpg',
  rating: 4.9,
  reviews: 50,
  joined: 'Đã tham gia 3 tháng trước',
}

export function getRoomDetail(id) {
  const room = rooms.find((item) => item.id === Number(id))
  if (!room) return null

  return {
    ...room,
    bedrooms: 1,
    bathrooms: 1,
    tags: [room.tag, 'Giờ giấc tự do', 'Chung chủ'],
    address: `${room.location}, Hòa Lạc, Hà Nội`,
    description: `Phòng trọ ${room.area} tại ${room.location}, ${room.tag.toLowerCase()}, phù hợp cho 1-2 người ở. Khu vực an ninh, gần trường học và chợ, giờ giấc tự do, chủ nhà thân thiện. Giá thuê ${room.price} đã bao gồm các tiện ích cơ bản, chưa gồm điện nước.`,
    gallery: ['/images/thumb-1.jpg', '/images/thumb-2.jpg', '/images/thumb-3.jpg', '/images/thumb-4.jpg'],
  }
}

export const passRooms = [
  { id: 1, title: 'Pass phòng trọ giá sinh viên, còn hợp đồng 6 tháng', price: '1.500.000đ/tháng', area: '18m²', location: 'Thạch Thất', status: 'Còn trống', image: '/images/pass-room-1.jpg' },
  { id: 2, title: 'Pass gấp phòng trọ gần trường, giá tốt', price: '1.600.000đ/tháng', area: '20m²', location: 'Thạch Hòa', status: 'Cần pass gấp', image: '/images/pass-room-2.jpg' },
  { id: 3, title: 'Sang nhượng hợp đồng chung cư mini Tân Xã', price: '2.300.000đ/tháng', area: '26m²', location: 'Tân Xã', status: 'Còn trống', image: '/images/pass-room-3.jpg' },
]

export function getPassRoomDetail(id) {
  const room = passRooms.find((item) => item.id === Number(id))
  if (!room) return null

  return {
    ...room,
    bedrooms: 1,
    bathrooms: 1,
    tags: [room.status, 'Còn thời hạn hợp đồng', 'Chung chủ'],
    address: `${room.location}, Hòa Lạc, Hà Nội`,
    description: `Cần pass lại phòng trọ ${room.area} tại ${room.location}, ${room.status === 'Cần pass gấp' ? 'cần pass gấp do có việc đột xuất' : 'còn thời hạn hợp đồng, chuyển đi vì lý do cá nhân'}. Phòng còn mới, đầy đủ nội thất cơ bản, an ninh tốt, gần trường học và chợ. Giá ${room.price} đã bao gồm các tiện ích cơ bản, chưa gồm điện nước.`,
    gallery: ['/images/thumb-1.jpg', '/images/thumb-2.jpg', '/images/thumb-3.jpg', '/images/thumb-4.jpg'],
  }
}

export const passItems = [
  { id: 1, title: 'Bàn học gỗ + ghế xoay, còn mới 90%', price: '350.000đ', category: 'Nội thất', condition: 'Mới 90%', location: 'Tân Xã', status: 'Còn hàng', image: '/images/pass-item-1.jpg' },
  { id: 2, title: 'Quạt điện Panasonic 3 tốc độ', price: '180.000đ', category: 'Đồ điện tử', condition: 'Đã dùng', location: 'Thạch Hòa', status: 'Cần bán gấp', image: '/images/pass-item-2.jpg' },
  { id: 3, title: 'Tủ nhựa 5 tầng đựng quần áo', price: '150.000đ', category: 'Nội thất', condition: 'Đã dùng', location: 'Tân Xã', status: 'Còn hàng', image: '/images/pass-item-3.jpg' },
  { id: 4, title: 'Nồi cơm điện Sharp 1.8L', price: '250.000đ', category: 'Đồ gia dụng', condition: 'Mới 95%', location: 'Thạch Thất', status: 'Cần bán gấp', image: '/images/pass-item-4.jpg' },
  { id: 5, title: 'Xe đạp cào cào cho sinh viên', price: '600.000đ', category: 'Xe cộ', condition: 'Đã dùng', location: 'Tân Xã', status: 'Còn hàng', image: '/images/pass-item-5.jpg' },
  { id: 6, title: 'Bộ giáo trình Đại học Kinh tế năm 2', price: '120.000đ', category: 'Sách - Giáo trình', condition: 'Đã dùng', location: 'Thạch Hòa', status: 'Còn hàng', image: '/images/pass-item-6.jpg' },
]

export function getPassItemDetail(id) {
  const item = passItems.find((entry) => entry.id === Number(id))
  if (!item) return null

  return {
    ...item,
    tags: [item.category, item.condition, item.status],
    address: `${item.location}, Hòa Lạc, Hà Nội`,
    description: `${item.title}, tình trạng ${item.condition.toLowerCase()}, thuộc nhóm ${item.category.toLowerCase()}. ${item.status === 'Cần bán gấp' ? 'Cần bán gấp do chuyển đi/không còn nhu cầu sử dụng.' : 'Còn dùng tốt, bán lại cho ai cần với giá hợp lý.'} Giá ${item.price}, có thể trao đổi trực tiếp tại ${item.location}.`,
    gallery: ['/images/thumb-1.jpg', '/images/thumb-2.jpg', '/images/thumb-3.jpg', '/images/thumb-4.jpg'],
  }
}
