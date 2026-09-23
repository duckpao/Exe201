# Hướng dẫn Frontend thiết kế 3 màn hình chi tiết (RentMate Hola)

Chào Claude, bạn đang đóng vai trò là Senior Frontend Developer. Nhiệm vụ của bạn là code giao diện cho 3 màn hình trong dự án Vite (sử dụng React + Tailwind CSS hoặc tương đương) chính xác 100% theo mô tả và hình ảnh thiết kế tôi đã cung cấp. 

**Quy tắc chung:**
1. **Màu sắc chủ đạo:** Màu Cam (Primary Orange, khoảng `#f97316` hoặc `#ea580c`), nền xám siêu nhạt/trắng, chữ màu xám đậm.
2. **Hình ảnh (Rất quan trọng):** Do tôi chưa tải ảnh thật lên, bạn bắt buộc phải dùng các đường dẫn ảnh dạng placeholder như `<img src="/images/placeholder-room.jpg" alt="Room" />`. Tuyệt đối không dùng link ảnh external (như unsplash) để tránh vỡ layout. Tôi sẽ chủ động tạo thư mục `public/images/` và đưa ảnh thật vào sau dựa theo tên bạn đặt.
3. **Responsive:** Các màn hình cần sử dụng Grid/Flexbox để chia layout rõ ràng (Thường là tỷ lệ cột trái 7/12, cột phải 5/12 hoặc 8-4).
4. **Header & Footer:** Giữ nguyên Header và Footer như trang chủ, chỉ thay đổi phần thân (Main Content).

---

## Prompt 1: Màn hình "Chi tiết phòng trọ"
*Claude, hãy tạo component cho trang "Chi tiết phòng trọ" (`RoomDetail.jsx`). Cấu trúc body bao gồm:*

1. **Breadcrumb:** (VD: `Phòng trọ > 25m2 - Full nội thất`) có icon Home.
2. **Layout chính (Chia 2 cột):**
   * **Cột trái (Nội dung chính):**
     - **Image Gallery:** 1 ảnh to hiển thị chính (`main-room.jpg`), bên dưới là lưới 4 ảnh thumbnail nhỏ bo góc (`thumb-1.jpg`, `thumb-2.jpg`,...).
     - **Tiêu đề & Địa chỉ:** Tiêu đề in đậm lớn "Phòng trọ 25m2 - Full nội thất", kèm icon location và địa chỉ.
     - **Tags:** Các tag màu xám nhạt (Giờ giấc tự do, Full nội thất, Chung chủ).
     - **Khối thông số nhanh (Box nền trắng bo góc):** Chứa 5 mục (Diện tích, Phòng ngủ, Phòng tắm, Nội thất, Giá thuê) dàn hàng ngang, có icon màu cam nhạt.
     - **Khối Mô tả:** Tiêu đề "Mô tả" và đoạn text chi tiết.
   * **Cột phải (Sidebar):**
     - **Card Giá & Liên hệ:** Giá tiền to màu cam (3.400.000đ/tháng), 3 icon thông số nhỏ dàn ngang. Hai nút bấm lớn: "Liên hệ ngay" (nền cam, chữ trắng) và "Nhắn tin" (nền trắng, viền xám).
     - **Card Người đăng:** Avatar (`avatar-owner.jpg`), Tên, Đánh giá sao, Nút "Xem thêm".
     - **Card Địa chỉ:** Khối xám (placeholder cho Google Map) và nút "Xem Map".

---

## Prompt 2: Màn hình "Đăng bài tìm Roommate"
*Claude, tiếp theo hãy tạo trang form "Đăng bài tìm roommate" (`PostRoommate.jsx`). Cấu trúc gồm:*

1. **Header Banner:** Banner nền cam nhạt, tiêu đề "Đăng bài tìm roommate", mô tả ngắn, bên phải là ảnh minh họa (`banner-roommate.png`). Dưới banner là thanh 4 icons tính năng nổi bật.
2. **Layout chính (Chia 2 cột):**
   * **Cột trái (Form nhập liệu):** Card nền trắng bo góc, chia thành các step:
     - **1. Thông tin cơ bản:** Input Tiêu đề, Radio button Giới tính (Nam/Nữ/Không yêu cầu), Dropdown Địa chỉ, Input Ngân sách.
     - **2. Thông tin chi tiết:** Textarea "Mô tả về bản thân", Textarea "Thông tin về chỗ ở", Khu vực Upload hình ảnh (kèm icon tải ảnh).
     - **3. Thời gian đăng tin:** Radio (Đăng ngay / Đăng theo lịch).
     - **Nút Hành động:** Nút "Xem trước" (viền cam) và "Đăng tin" (nền cam, kèm icon máy bay giấy).
   * **Cột phải (Lưu ý & Preview):**
     - **Card "Một vài lưu ý":** Tiêu đề kèm icon bóng đèn, danh sách bullet point các lưu ý bằng chữ cam/xám.
     - **Card "Xem trước bài đăng":** Đây là một component Card tĩnh hiển thị giao diện giống y hệt một bài đăng tìm roommate ngoài trang chủ (có Avatar, Tên, Tag 'Tìm roommate', Tiêu đề, Giá, Mô tả ngắn, Lưới ảnh thumbnail, Nút tym/comment/share).

---

## Prompt 3: Màn hình "Đăng bài pass phòng trọ"
*Claude, hãy tạo trang cuối cùng là "Đăng bài pass phòng trọ" (`PostPassRoom.jsx`). Giao diện tương tự trang Roommate nhưng khác form:*

1. **Header Banner:** Banner nền cam nhạt, tiêu đề "Đăng bài pass phòng trọ", ảnh minh họa (`banner-pass-room.png`).
2. **Layout chính (Chia 2 cột):**
   * **Cột trái (Form nhập liệu "Thông tin phòng trọ"):**
     - Các Input: Tiêu đề, Giá phòng, Địa chỉ, Diện tích, Ngày bắt đầu pass, Loại phòng (dropdown), Số lượng người.
     - **Loại bài đăng (Tab Switcher):** Pass phòng trọ (active màu cam) / Chuyển nhượng hợp đồng.
     - **Tiện ích:** Một lưới các checkbox (WiFi, Máy lạnh, Máy giặt, Bếp, Nội thất...).
     - **Mô tả chi tiết:** Textarea lớn.
     - **Lưu ý màu xanh nhạt:** Box cảnh báo admin xét duyệt.
     - **Nút Hành động:** "Đăng bài" (nền cam) và "Hủy" (nền trắng).
   * **Cột phải (Sidebar):**
     - **Card "Một vài lưu ý":** Tương tự trang trước, đổi nội dung lưu ý cho phù hợp với pass phòng.
     - **Card "Xem trước bài đăng":** Tương tự trang trước, nhưng là giao diện card bài Pass phòng (hiển thị tag 'Pass phòng trọ', các tiện ích, và ảnh thumbnail).
```eof

Bạn hãy copy file này và gửi cho Claude. Nội dung file đã phân tách rõ 3 prompt cho 3 màn hình khác nhau. Hãy yêu cầu Claude thực hiện từng prompt một để đảm bảo chất lượng code và độ chi tiết của giao diện nhé. Chúc dự án của bạn thành công!
---

## Prompt 4: Màn hình "Giới thiệu về trang web" (About Us)
*Claude, hãy tạo trang "Giới thiệu" (`AboutUs.jsx`). Trang này cần thiết kế thu hút, hiện đại để truyền tải thông điệp của website. Cấu trúc bao gồm:*

1. **Hero Section (Banner mở đầu):** 
   - Banner chiếm toàn chiều rộng, nền màu cam nhạt hoặc gradient cam - trắng. 
   - Có tiêu đề lớn (H1): "Về RentMate Hola - Sống trọn thanh xuân".
   - Đoạn văn ngắn mô tả sứ mệnh kết nối sinh viên và người cho thuê.
   - Bên cạnh hoặc bên dưới là một hình ảnh minh họa lớn (`about-hero.jpg`).
2. **Khối "Giá trị cốt lõi / Tại sao chọn chúng tôi":** 
   - Sử dụng CSS Grid chia thành 3 hoặc 4 cột.
   - Mỗi cột là một Card nền trắng, bo góc, đổ bóng nhẹ. Bên trong chứa Icon màu cam to (ví dụ: Icon An toàn, Nhanh chóng, Đa dạng, Hỗ trợ), Tiêu đề in đậm và một đoạn text mô tả ngắn.
3. **Khối "Câu chuyện của chúng tôi" (Tùy chọn):**
   - Layout chia 2 cột (1 cột chữ, 1 cột ảnh `about-story.jpg`). Text màu xám đậm (`text-gray-700`), khoảng cách dòng (`leading-relaxed`) để dễ đọc.
4. **Call to Action (CTA):** Khối banner nhỏ ở cuối trang với thông điệp kêu gọi hành động, kèm nút "Tìm phòng ngay" (nền cam, chữ trắng).

---

## Prompt 5: Màn hình "Điều khoản sử dụng" (Terms of Use)
*Claude, hãy tạo trang "Điều khoản sử dụng" (`TermsOfUse.jsx`). Vì đây là trang thiên về đọc văn bản (Text-heavy), hãy tập trung vào Typography và trải nghiệm đọc:*

1. **Header Trang:** 
   - Tiêu đề lớn căn giữa: "Điều khoản sử dụng dịch vụ". 
   - Dòng text nhỏ bên dưới màu xám: "Cập nhật lần cuối: 15/10/2023".
2. **Layout chính (Chia tỷ lệ 3-9 hoặc thu hẹp ở giữa màn hình):**
   - **Sidebar (Cột trái - 3/12):** Một menu điều hướng (Sticky Sidebar) chứa danh sách các mục: Điều khoản chung, Quyền lợi, Trách nhiệm người đăng tin, Bảo mật. Khi click vào sẽ cuộn đến phần tương ứng. Mục đang active có chữ màu cam.
   - **Nội dung văn bản (Cột phải - 9/12):** 
     - Được đặt trong một khối nền trắng, bo góc lớn, padding rộng rãi, đổ bóng nhẹ (`shadow-sm`).
     - Các tiêu đề mục (H2, H3) to, rõ ràng.
     - Văn bản (`p`) màu xám đậm (`text-gray-700`), `text-justify` hoặc căn trái, `leading-relaxed` để người dùng không bị mỏi mắt.
     - Sử dụng thẻ `ul`, `li` có list-disc màu cam cho các khoản mục nhỏ.