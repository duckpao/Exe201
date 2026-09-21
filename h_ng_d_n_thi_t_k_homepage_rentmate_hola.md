# Hướng dẫn thiết kế Homepage RentMate Hola (Dành cho Claude)

## 1. Bối cảnh và Vai trò
Chào Claude, bạn đang đóng vai trò là một Senior UI/UX Designer và Frontend Developer. Nhiệm vụ của bạn là clone (lập trình lại) trang chủ (Homepage) của nền tảng "RentMate Hola" chính xác 100% theo các bản thiết kế mà tôi cung cấp. Hệ thống màu chủ đạo là màu Cam (Primary Orange) kết hợp với nền trắng và chữ xám đen.

## 2. Phân tích Cấu trúc Kiến trúc Trang chủ (Homepage)
Dựa trên hình ảnh tổng thể, trang chủ được chia thành các section (từ trên xuống dưới) như sau:

1. **Header (Thanh điều hướng):**
   - Trái: Logo "RentMate Hola" (Màu cam + đỏ).
   - Giữa: Menu Links (Trang chủ, Phòng trọ, Tìm Roommate, Vận chuyển đồ, Pass Phòng, Pass đồ). "Trang chủ" được active (tô đậm).
   - Phải: Icon Chuông thông báo, Avatar người dùng/Nút đăng nhập.

2. **Hero Section (Phần giới thiệu chính):**
   - Trái: Tiêu đề lớn "Tìm phòng dễ dàng Sống trọn thanh xuân", text phụ mô tả nền tảng.
   - Phải: Hình ảnh minh họa lớn (cô gái ngồi trên giường, phòng đẹp).

3. **Quick Access Categories (Truy cập nhanh):**
   - Dải 4 nút bấm ngang nằm lấp lửng giữa Hero section và phần dưới.
   - Các nút: Phòng trọ, Tìm Roommate, Pass đồ, Vận chuyển đồ (Kèm icon tương ứng).

4. **Section "Dịch vụ nổi bật":**
   - Tiêu đề: "Dịch vụ nổi bật" + mô tả ngắn.
   - Lưới 3 cột chứa 3 thẻ dịch vụ lớn: Phòng trọ, Pass đồ, Vận chuyển đồ. Mỗi thẻ có ảnh cover lớn, tiêu đề, và nút mũi tên màu cam tròn ở góc phải.

5. **Section "Phòng trọ nổi bật":**
   - Tiêu đề: "Phòng trọ nổi bật" + mô tả ngắn.
   - Lưới 4 cột chứa 4 thẻ phòng trọ. 
   - **Chi tiết UI của 1 Card phòng trọ (rất quan trọng):** 
     - Ảnh thumbnail bo góc.
     - Tiêu đề in đậm (VD: "Phòng trọ gần khu dịch vụ Tân Xã").
     - Giá tiền nổi bật màu cam (VD: "1.800.000đ/tháng").
     - Thông tin phụ: "25m2 | Tân xã" (Màu xám).
     - Nút tag xám nhạt: "Full nội thất".

6. **Footer:**
   - Cột 1: Logo RentMate Hola + 4 icon mạng xã hội (Facebook, Instagram, LinkedIn, TikTok).
   - Cột 2: "Về RentMate Hola" (Giới thiệu, Điều khoản, Chính sách).
   - Cột 3: "Hỗ trợ" (Liên hệ, Hướng dẫn).
   - Cột 4: "Đăng ký nhận thông tin mới nhất" (Ô input nhập email và nút submit màu cam).

## 3. Hướng dẫn chia nhỏ Prompts để lập trình
Để code không bị cắt ngang và đạt độ chính xác cao nhất, bạn hãy thực hiện theo 4 Prompts sau (hãy chờ tôi gửi từng prompt):

- **Prompt 1 - Khởi tạo & Cấu trúc cơ bản:** "Hãy thiết lập biến CSS chung (màu sắc, font chữ). Sau đó code hoàn chỉnh phần Header và phần Footer (bao gồm form đăng ký email và các icon)."
- **Prompt 2 - Hero Banner & Quick Links:** "Hãy code phần Hero Section với layout chia 2 cột (Text trái, Ảnh phải). Sau đó đè dải 4 Quick Access Categories (Phòng trọ, Roommate...) lên trên ranh giới của Hero section theo đúng thiết kế."
- **Prompt 3 - Dịch vụ nổi bật:** "Hãy code section 'Dịch vụ nổi bật' với 3 thẻ card lớn, đảm bảo hiệu ứng hình ảnh và nút mũi tên tròn màu cam."
- **Prompt 4 - Lưới Phòng Trọ & Card UI:** "Hãy code section 'Phòng trọ nổi bật'. Phân tích kỹ thẻ card phòng trọ chi tiết để hiển thị chính xác ảnh, tiêu đề, giá tiền (màu cam), kích thước, địa chỉ và tag 'Full nội thất'."

## 4. Hướng dẫn xử lý và bổ sung hình ảnh
Vì hiện tại tôi chưa cung cấp file ảnh rời, Claude hãy làm theo hướng dẫn sau:
- Sử dụng thẻ `<img src="/images/ten-anh-tu-dat.jpg" alt="..." />` làm placeholder. Không dùng ảnh từ internet để tránh vỡ layout, hãy quy ước tên file rõ ràng.

**Hướng dẫn dành cho tôi (Người dùng) để bổ sung ảnh sau này:**
Claude hãy hướng dẫn tôi tạo một thư mục `images` trong project và đặt tên file đúng theo quy ước trong code. Ví dụ bạn nên bảo tôi đặt tên như sau:
1. Logo: `logo.svg` hoặc `logo.png`
2. Ảnh Hero: `hero-banner.jpg`
3. Icon các danh mục: `icon-phong-tro.svg`, `icon-roommate.svg`, `icon-pass-do.svg`, `icon-van-chuyen.svg`.
4. Ảnh dịch vụ nổi bật: `service-phong-tro.jpg`, `service-pass-do.jpg`, `service-van-chuyen.jpg`.
5. Ảnh thẻ phòng trọ: `room-1.jpg`, `room-2.jpg`, v.v.
6. Icon mạng xã hội: `fb.svg`, `ig.svg`, `in.svg`, `tiktok.svg`.

Khi tôi tải ảnh lên, tôi chỉ cần đổi tên file trên máy tính của mình cho khớp với danh sách trên và bỏ vào thư mục chứa code là giao diện sẽ hiển thị hoàn hảo.