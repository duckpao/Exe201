# Danh sách hình ảnh cần chuẩn bị cho website RentMate Hola

Chào bạn, đây là danh sách toàn bộ hình ảnh mà website RentMate Hola cần dùng. Bạn chỉ cần chuẩn bị đúng nội dung, đặt **đúng tên file** như dưới đây, rồi bỏ tất cả vào **một thư mục duy nhất**:

```
frontend/public/images/
```

Không cần sửa code gì cả — cứ thả file đúng tên vào thư mục đó là ảnh sẽ tự hiện lên trên web. Nếu thiếu ảnh nào, web vẫn chạy bình thường, chỗ đó chỉ hiện một khối màu xám tạm thay thế.

**Lưu ý chung:**
- Tên file phải viết đúng như trong bảng (chữ thường, có dấu gạch ngang, đúng đuôi file `.jpg`/`.svg`/`.png`).
- Ảnh chụp/thiết kế theo phong cách: nền sáng, tông màu cam chủ đạo (#f97316), trắng, chữ xám đen — giống các bản thiết kế RentMate Hola đã gửi.
- Với các ảnh có sẵn trong ảnh thiết kế bạn gửi trước đó (7 tấm ảnh RentMate Hola), có thể lấy cảm hứng/cắt trực tiếp từ đó.
- Cột **Trạng thái** dưới đây được kiểm tra trực tiếp trong thư mục `frontend/public/images/` — ✅ là file đã có sẵn trong dự án, ⚠️ là file **còn thiếu**, bạn cần bổ sung.

---

## ⚠️ Còn thiếu — cần bổ sung ngay (18 file)

Đây là toàn bộ ảnh **web đang tham chiếu tới nhưng thư mục `frontend/public/images/` chưa có file**, nên hiện tại các vị trí này đang hiện khối xám placeholder:

| Tên file cần đặt | Kích thước gợi ý | Tỉ lệ | Dùng ở đâu | Nội dung ảnh cần có |
|---|---|---|---|---|
| `avatar-owner.jpg` | 200 x 200px | Vuông 1:1 | Card "Người đăng" ở mọi trang chi tiết (Phòng trọ `/phong-tro/:id`, Pass phòng trọ `/pass-phong/:id`, Pass đồ `/pass-do/:id`), và avatar preview khi đăng bài tìm Roommate | Ảnh đại diện 1 người (nam hoặc nữ, đóng vai "chủ trọ"), chân dung rõ mặt, nền đơn giản, vì ảnh hiện dạng hình tròn nên nên để mặt/chủ thể ở giữa khung hình. |
| `thumb-1.jpg` | 600 x 450px | 4:3 | Ảnh nhỏ số 1 trong khu thư viện ảnh (gallery) ở mọi trang chi tiết (Phòng trọ, Pass phòng trọ, Pass đồ) | Cận cảnh 1 góc phòng trọ/sản phẩm khác với ảnh chính — gợi ý: khu vực giường ngủ. |
| `thumb-2.jpg` | 600 x 450px | 4:3 | Ảnh nhỏ số 2 trong gallery, dùng chung mọi trang chi tiết (Phòng trọ, Pass phòng trọ, Pass đồ) | Cận cảnh góc khác — gợi ý: bàn học/bàn làm việc. |
| `thumb-3.jpg` | 600 x 450px | 4:3 | Ảnh nhỏ số 3 trong gallery, dùng chung mọi trang chi tiết (Phòng trọ, Pass phòng trọ, Pass đồ) | Cận cảnh góc khác — gợi ý: cửa sổ/ban công, ánh sáng tự nhiên. |
| `thumb-4.jpg` | 600 x 450px | 4:3 | Ảnh nhỏ số 4 trong gallery, dùng chung mọi trang chi tiết (Phòng trọ, Pass phòng trọ, Pass đồ) | Cận cảnh góc khác — gợi ý: nhà tắm/khu vực phụ. |
| `banner-roommate.png` | 700 x 500px | ~7:5 | Ảnh minh hoạ bên phải banner đầu trang "Đăng bài tìm Roommate" (`/tim-roommate/dang-bai`) | 2 người (1 nam 1 nữ hoặc 2 bạn cùng giới) đang trò chuyện vui vẻ trong không gian phòng trọ/phòng khách, gợi cảm giác "tìm được người ở ghép hợp ý". |
| `banner-pass-room.png` | 700 x 500px | ~7:5 | Ảnh minh hoạ bên phải banner đầu trang "Đăng bài Pass phòng trọ" (`/pass-phong/dang-bai`) | 1 phòng trọ gọn gàng, đầy đủ nội thất, ánh sáng đẹp — gợi cảm giác "phòng sẵn sàng bàn giao ngay cho người mới". |
| `hero-pass-do.jpg` | 1600 x 600px | ~16:6 (banner ngang, dẹt) | Ảnh banner đầu trang "Pass Đồ" (`/pass-do`) | Ảnh 1 vài món đồ sinh viên hay pass lại (bàn học, quạt, nồi cơm điện...) xếp gọn, tông sáng, gợi cảm giác "đồ cũ còn tốt, đáng mua". |
| `banner-pass-do.png` | 700 x 500px | ~7:5 | Ảnh minh hoạ bên phải banner đầu trang "Đăng bài Pass đồ" (`/pass-do/dang-bai`) | 1 người đang đóng gói/chụp ảnh sản phẩm để đăng bán, hoặc vài món đồ được xếp gọn gàng, tông sáng, gợi cảm giác "rao bán đồ cũ dễ dàng". |
| `pass-item-1.jpg` → `pass-item-9.jpg` (9 file) | 500 x 500px mỗi ảnh | Vuông 1:1 | Ảnh sản phẩm trong lưới danh sách trang "Pass Đồ" (`/pass-do`) | 9 ảnh chụp thật các món đồ khác nhau đang được rao bán/pass lại: bàn học, quạt điện, tủ nhựa, nồi cơm điện, xe đạp, giáo trình, kệ sách, bếp gas mini, loa bluetooth — mỗi ảnh chụp rõ 1 sản phẩm, nền đơn giản, đủ sáng. |

Ngoài ra còn 2 ảnh nữa (mục 6 dưới đây) cũng đang thiếu: `about-hero.jpg` và `about-story.jpg` (dùng ở trang Giới thiệu), và 1 icon mạng xã hội `tiktok.svg` (mục 7) — tuy nhiên `tiktok.svg` hiện đã có file trong thư mục nên có thể đã được bổ sung, xem lại cột Trạng thái ở mục 7.

---

## 1. Trang chủ (Homepage)

| Tên file cần đặt | Trạng thái | Kích thước gợi ý | Tỉ lệ | Nội dung mô tả |
|---|---|---|---|---|
| `hero-home.jpg` | ✅ Đã có | 1200 x 900px | 4:3 | Ảnh lớn bên phải phần banner đầu trang: một bạn trẻ (nữ) đang ngồi thoải mái trong phòng trọ đẹp, gọn gàng, ánh sáng tự nhiên. |
| `icon-phong-tro.svg` | ✅ Đã có | 128 x 128px | Vuông | Icon tròn nhỏ minh hoạ "Phòng trọ" (ví dụ hình ngôi nhà/mái nhà). Nền trong suốt. |
| `icon-roommate.svg` | ✅ Đã có | 128 x 128px | Vuông | Icon minh hoạ "Tìm Roommate" (ví dụ 2 người). Nền trong suốt. |
| `icon-pass-do.svg` | ✅ Đã có | 128 x 128px | Vuông | Icon minh hoạ "Pass đồ" (ví dụ hộp/thùng đồ). Nền trong suốt. |
| `icon-van-chuyen.svg` | ✅ Đã có | 128 x 128px | Vuông | Icon minh hoạ "Vận chuyển đồ" (ví dụ xe tải nhỏ). Nền trong suốt. |
| `service-phong-tro.jpg` | ✅ Đã có | 800 x 1000px | 4:5 (dọc) | Ảnh cover cho thẻ dịch vụ "Phòng trọ" — 1 căn phòng trọ đẹp, có thể có người trong ảnh. |
| `service-pass-do.jpg` | ✅ Đã có | 800 x 1000px | 4:5 (dọc) | Ảnh cover cho thẻ dịch vụ "Pass đồ" — đồ đạc/nội thất được sắp gọn, chuẩn bị sang nhượng. |
| `service-van-chuyen.jpg` | ✅ Đã có | 800 x 1000px | 4:5 (dọc) | Ảnh cover cho thẻ dịch vụ "Vận chuyển đồ" — xe tải nhỏ hoặc người đang bốc xếp đồ. |

Ngoài ra, phần "Phòng trọ nổi bật" ở cuối trang chủ dùng lại 4 ảnh đầu tiên trong mục **Phòng trọ** ở bảng số 2 dưới đây (`room-1.jpg` đến `room-4.jpg`).

---

## 2. Trang "Phòng trọ" (`/phong-tro`)

| Tên file | Trạng thái | Kích thước gợi ý | Tỉ lệ | Nội dung |
|---|---|---|---|---|
| `room-1.jpg` → `room-9.jpg` (9 file) | ✅ Đã có đủ 9 | 800 x 600px mỗi ảnh | 4:3 | 9 ảnh phòng trọ khác nhau: phòng gọn gàng, có nội thất cơ bản (giường, tủ, bàn), ánh sáng đủ sáng. Mỗi ảnh là 1 phòng khác nhau để trông đa dạng. |

---

## 3. Trang "Tìm Roommate" (`/tim-roommate`)

| Tên file | Trạng thái | Kích thước gợi ý | Tỉ lệ | Nội dung |
|---|---|---|---|---|
| `hero-roommate.jpg` | ✅ Đã có | 1600 x 600px | ~16:6 (banner ngang, dẹt) | Ảnh banner lớn ở đầu trang: 2 người (giống ảnh thiết kế mẫu) đang vui vẻ, ngữ cảnh phòng trọ/ở ghép. |
| `roommate-1.jpg` → `roommate-6.jpg` (6 file) | ✅ Đã có đủ 6 | 400 x 400px mỗi ảnh | Vuông 1:1 | Ảnh đại diện (avatar) của 6 người khác nhau — ảnh chân dung, mặt rõ, nền đơn giản. Ảnh sẽ hiện dạng hình tròn nên nên để mặt/chủ thể ở giữa khung. |

---

## 4. Trang "Vận chuyển đồ" (`/van-chuyen-do`)

| Tên file | Trạng thái | Kích thước gợi ý | Tỉ lệ | Nội dung |
|---|---|---|---|---|
| `transport-van.jpg` | ✅ Đã có | 800 x 500px | 16:10 | 1 ảnh xe tải nhỏ/xe chuyển đồ đang bốc xếp. Hiện tại ảnh này dùng chung cho tất cả các thẻ dịch vụ vận chuyển trong trang, nên chọn 1 ảnh đại diện đẹp, rõ nét là đủ. *(Nếu bạn muốn mỗi thẻ có ảnh riêng, báo lại để mình cập nhật code — cần thêm ảnh như `transport-van-2.jpg`, `transport-van-3.jpg`...)* |

---

## 5. Trang "Pass Phòng Trọ" (`/pass-phong`)

| Tên file | Trạng thái | Kích thước gợi ý | Tỉ lệ | Nội dung |
|---|---|---|---|---|
| `hero-pass-phong.jpg` | ✅ Đã có | 1600 x 600px | ~16:6 (banner ngang, dẹt) | Ảnh banner đầu trang: phòng trọ đẹp, gợi cảm giác "sẵn sàng dọn vào ở". |
| `pass-room-1.jpg` → `pass-room-6.jpg` (6 file) | ✅ Đã có đủ 6 | 500 x 500px mỗi ảnh | Vuông 1:1 (hoặc gần vuông) | 6 ảnh phòng trọ khác nhau đang được pass lại — có thể là ảnh thực tế phòng đang cho thuê. |

---

## 6. Trang chi tiết phòng trọ, Đăng bài, Giới thiệu (bổ sung mới)

| Tên file | Trạng thái | Kích thước gợi ý | Tỉ lệ | Nội dung |
|---|---|---|---|---|
| `thumb-1.jpg` | ⚠️ Còn thiếu | 600 x 450px | 4:3 | Xem mô tả chi tiết ở bảng "Còn thiếu" phía trên. |
| `thumb-2.jpg` | ⚠️ Còn thiếu | 600 x 450px | 4:3 | Xem mô tả chi tiết ở bảng "Còn thiếu" phía trên. |
| `thumb-3.jpg` | ⚠️ Còn thiếu | 600 x 450px | 4:3 | Xem mô tả chi tiết ở bảng "Còn thiếu" phía trên. |
| `thumb-4.jpg` | ⚠️ Còn thiếu | 600 x 450px | 4:3 | Xem mô tả chi tiết ở bảng "Còn thiếu" phía trên. Ảnh chính lớn của gallery không cần ảnh mới, web tự lấy lại đúng ảnh phòng tương ứng trong `room-1.jpg`…`room-9.jpg` đã có ở mục 2. |
| `avatar-owner.jpg` | ⚠️ Còn thiếu | 200 x 200px | Vuông 1:1 | Xem mô tả chi tiết ở bảng "Còn thiếu" phía trên. |
| `banner-roommate.png` | ⚠️ Còn thiếu | 700 x 500px | ~7:5 | Xem mô tả chi tiết ở bảng "Còn thiếu" phía trên. |
| `banner-pass-room.png` | ⚠️ Còn thiếu | 700 x 500px | ~7:5 | Xem mô tả chi tiết ở bảng "Còn thiếu" phía trên. |
| `about-hero.jpg` | ⚠️ Còn thiếu | 900 x 700px | 4:3 | Ảnh lớn bên phải banner đầu trang "Giới thiệu" (`/gioi-thieu`) — hình ảnh đại diện cho RentMate Hola: có thể là 1-2 sinh viên trong không gian phòng trọ/khu nhà trọ, tông sáng, năng động, gợi cảm giác tin cậy, thân thiện. |
| `about-story.jpg` | ⚠️ Còn thiếu | 900 x 700px | 4:3 | Ảnh minh hoạ phần "Câu chuyện của chúng tôi" ở trang "Giới thiệu" — có thể là hình nhóm người (đóng vai nhóm sáng lập) đang trao đổi/làm việc cùng nhau, hoặc hình ảnh khu nhà trọ/không gian sống sinh viên, tạo cảm giác gần gũi, đời thường. |

---

## 7. Mạng xã hội (hiện ở chân trang - Footer)

| Tên file | Trạng thái | Kích thước gợi ý | Nội dung |
|---|---|---|---|
| `fb.svg` | ✅ Đã có | 64 x 64px | Icon Facebook, màu trắng hoặc đơn sắc, nền trong suốt (icon nằm trên nền tối). |
| `ig.svg` | ✅ Đã có | 64 x 64px | Icon Instagram, cùng phong cách như trên. |
| `in.svg` | ✅ Đã có | 64 x 64px | Icon LinkedIn, cùng phong cách như trên. |
| `tiktok.svg` | ✅ Đã có | 64 x 64px | Icon TikTok, cùng phong cách như 3 icon trên (đơn sắc, nền trong suốt, đặt trên nền tối ở footer). |

---

## 8. Trang "Pass Đồ" (`/pass-do`)

| Tên file | Trạng thái | Kích thước gợi ý | Tỉ lệ | Nội dung |
|---|---|---|---|---|
| `hero-pass-do.jpg` | ⚠️ Còn thiếu | 1600 x 600px | ~16:6 (banner ngang, dẹt) | Xem mô tả chi tiết ở bảng "Còn thiếu" phía trên. |
| `banner-pass-do.png` | ⚠️ Còn thiếu | 700 x 500px | ~7:5 | Xem mô tả chi tiết ở bảng "Còn thiếu" phía trên. Dùng ở trang "Đăng bài Pass đồ" (`/pass-do/dang-bai`). |
| `pass-item-1.jpg` → `pass-item-9.jpg` (9 file) | ⚠️ Còn thiếu cả 9 | 500 x 500px mỗi ảnh | Vuông 1:1 | Xem mô tả chi tiết ở bảng "Còn thiếu" phía trên. |

---

## Ghi chú thêm

- **Logo "RentMate Hola"**: hiện tại phần header/footer đang hiển thị logo dạng **icon vẽ bằng code** (component `BrandLogo.jsx`, không phải ảnh), nên **không cần** file `logo.png`/`logo.svg` cho bản hiện tại — file `logo.png` hiện có trong thư mục `public/images/` đang **không được web sử dụng**. Nếu bạn có sẵn logo dạng hình ảnh và muốn thay icon hiện tại bằng logo đó, cứ gửi file ảnh, mình sẽ chỉnh code để dùng ảnh logo thay vì icon vẽ.
- Định dạng ảnh chụp/photo: nên dùng `.jpg` (dung lượng nhẹ). Icon nên dùng `.svg` (nét, không bị mờ khi phóng to); nếu không có file `.svg`, dùng `.png` nền trong suốt cũng được — chỉ cần đổi đúng đuôi file trong tên tương ứng.
- Tổng cộng cần chuẩn bị: **1** ảnh hero trang chủ, **4** icon, **3** ảnh dịch vụ, **9** ảnh phòng trọ, **1** ảnh banner roommate, **6** avatar roommate, **1** ảnh xe vận chuyển, **1** ảnh banner pass phòng, **6** ảnh pass phòng, **4** icon mạng xã hội, **4** ảnh thumbnail chi tiết phòng, **1** avatar chủ trọ, **1** banner đăng bài roommate, **1** banner đăng bài pass phòng, **2** ảnh trang Giới thiệu, **1** ảnh hero Pass Đồ, **1** banner đăng bài Pass Đồ, **9** ảnh sản phẩm Pass Đồ.
- **Còn thiếu 20 file** (7 file cũ + 2 ảnh trang Giới thiệu + 11 file mới cho trang "Pass Đồ" vừa hoàn thiện) — xem đầy đủ ở mục "⚠️ Còn thiếu" ngay đầu tài liệu này. Trang "Pass Đồ" (`/pass-do`) nay đã có đủ giao diện danh sách + form đăng bài, chỉ còn thiếu ảnh thật để thay placeholder xám.
