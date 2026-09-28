// Mock data khớp với 6 user thật đã seed trong mock_data.sql, cộng thêm vài user giả
// để bảng quản lý người dùng trong admin dashboard có nội dung phong phú hơn.
export const mockAdminUsers = [
  { id: 1, full_name: 'Nguyễn Văn Admin', email: 'admin@nhatro.vn', phone: '0900000001', avatar_url: null, role: 'admin', status: 'active', created_at: '2026-01-05' },
  { id: 2, full_name: 'Trần Thị Lan', email: 'lan.tran@nhatro.vn', phone: '0900000002', avatar_url: null, role: 'landlord', status: 'active', created_at: '2026-01-08' },
  { id: 3, full_name: 'Phạm Văn Hùng', email: 'hung.pham@nhatro.vn', phone: '0900000003', avatar_url: null, role: 'landlord', status: 'active', created_at: '2026-01-12' },
  { id: 4, full_name: 'Lê Thị Mai', email: 'mai.le@gmail.com', phone: '0900000004', avatar_url: null, role: 'tenant', status: 'active', created_at: '2026-02-02' },
  { id: 5, full_name: 'Hoàng Văn Nam', email: 'nam.hoang@gmail.com', phone: '0900000005', avatar_url: null, role: 'tenant', status: 'active', created_at: '2026-02-14' },
  { id: 6, full_name: 'Đỗ Thị Hoa', email: 'hoa.do@gmail.com', phone: '0900000006', avatar_url: null, role: 'tenant', status: 'locked', created_at: '2026-02-20' },
  { id: 7, full_name: 'Vũ Minh Anh', email: 'anh.vu@gmail.com', phone: '0900000007', avatar_url: null, role: 'tenant', status: 'active', created_at: '2026-03-01' },
  { id: 8, full_name: 'Bùi Quốc Huy', email: 'huy.bui@gmail.com', phone: '0900000008', avatar_url: null, role: 'landlord', status: 'active', created_at: '2026-03-10' },
  { id: 9, full_name: 'Ngô Thanh Trúc', email: 'truc.ngo@gmail.com', phone: '0900000009', avatar_url: null, role: 'tenant', status: 'locked', created_at: '2026-03-18' },
  { id: 10, full_name: 'Đặng Bảo Nam', email: 'nam.dang@gmail.com', phone: '0900000010', avatar_url: null, role: 'tenant', status: 'active', created_at: '2026-03-25' },
]
