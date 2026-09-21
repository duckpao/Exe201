# Danh sách hình ảnh cần chuẩn bị cho website RentMate Hola

Chào bạn, đây là danh sách toàn bộ hình ảnh mà website RentMate Hola cần dùng. Bạn chỉ cần chuẩn bị đúng nội dung, đặt **đúng tên file** như dưới đây, rồi bỏ tất cả vào **một thư mục duy nhất**:

```
frontend/public/images/
```

Không cần sửa code gì cả — cứ thả file đúng tên vào thư mục đó là ảnh sẽ tự hiện lên trên web. Nếu thiếu ảnh nào, web vẫn chạy bình thường, chỗ đó chỉ hiện một khối màu xám tạm thay thế.

**Lưu ý chung:**
- Tên file phải viết đúng như trong bảng (chữ thường, có dấu gạch ngang, đúng đuôi file `.jpg`/`.svg`).
- Ảnh chụp/thiết kế theo phong cách: nền sáng, tông màu cam chủ đạo (#f97316), trắng, chữ xám đen — giống các bản thiết kế RentMate Hola đã gửi.
- Với các ảnh có sẵn trong ảnh thiết kế bạn gửi trước đó (7 tấm ảnh RentMate Hola), có thể lấy cảm hứng/cắt trực tiếp từ đó.

---

## 1. Trang chủ (Homepage)

| Tên file cần đặt | Kích thước gợi ý | Tỉ lệ | Nội dung mô tả |
|---|---|---|---|
| `hero-home.jpg` | 1200 x 900px | 4:3 | Ảnh lớn bên phải phần banner đầu trang: một bạn trẻ (nữ) đang ngồi thoải mái trong phòng trọ đẹp, gọn gàng, ánh sáng tự nhiên. |
| `icon-phong-tro.svg` | 128 x 128px | Vuông | Icon tròn nhỏ minh hoạ "Phòng trọ" (ví dụ hình ngôi nhà/mái nhà). Nền trong suốt. |
| `icon-roommate.svg` | 128 x 128px | Vuông | Icon minh hoạ "Tìm Roommate" (ví dụ 2 người). Nền trong suốt. |
| `icon-pass-do.svg` | 128 x 128px | Vuông | Icon minh hoạ "Pass đồ" (ví dụ hộp/thùng đồ). Nền trong suốt. |
| `icon-van-chuyen.svg` | 128 x 128px | Vuông | Icon minh hoạ "Vận chuyển đồ" (ví dụ xe tải nhỏ). Nền trong suốt. |
| `service-phong-tro.jpg` | 800 x 1000px | 4:5 (dọc) | Ảnh cover cho thẻ dịch vụ "Phòng trọ" — 1 căn phòng trọ đẹp, có thể có người trong ảnh. |
| `service-pass-do.jpg` | 800 x 1000px | 4:5 (dọc) | Ảnh cover cho thẻ dịch vụ "Pass đồ" — đồ đạc/nội thất được sắp gọn, chuẩn bị sang nhượng. |
| `service-van-chuyen.jpg` | 800 x 1000px | 4:5 (dọc) | Ảnh cover cho thẻ dịch vụ "Vận chuyển đồ" — xe tải nhỏ hoặc người đang bốc xếp đồ. |

Ngoài ra, phần "Phòng trọ nổi bật" ở cuối trang chủ dùng lại 4 ảnh đầu tiên trong mục **Phòng trọ** ở bảng số 2 dưới đây (`room-1.jpg` đến `room-4.jpg`).

---

## 2. Trang "Phòng trọ" (`/phong-tro`)

| Tên file | Kích thước gợi ý | Tỉ lệ | Nội dung |
|---|---|---|---|
| `room-1.jpg` → `room-9.jpg` (9 file) | 800 x 600px mỗi ảnh | 4:3 | 9 ảnh phòng trọ khác nhau: phòng gọn gàng, có nội thất cơ bản (giường, tủ, bàn), ánh sáng đủ sáng. Mỗi ảnh là 1 phòng khác nhau để trông đa dạng. |

---

## 3. Trang "Tìm Roommate" (`/tim-roommate`)

| Tên file | Kích thước gợi ý | Tỉ lệ | Nội dung |
|---|---|---|---|
| `hero-roommate.jpg` | 1600 x 600px | ~16:6 (banner ngang, dẹt) | Ảnh banner lớn ở đầu trang: 2 người (giống ảnh thiết kế mẫu) đang vui vẻ, ngữ cảnh phòng trọ/ở ghép. |
| `roommate-1.jpg` → `roommate-6.jpg` (6 file) | 400 x 400px mỗi ảnh | Vuông 1:1 | Ảnh đại diện (avatar) của 6 người khác nhau — ảnh chân dung, mặt rõ, nền đơn giản. Ảnh sẽ hiện dạng hình tròn nên nên để mặt/chủ thể ở giữa khung. |

---

## 4. Trang "Vận chuyển đồ" (`/van-chuyen-do`)

| Tên file | Kích thước gợi ý | Tỉ lệ | Nội dung |
|---|---|---|---|
| `transport-van.jpg` | 800 x 500px | 16:10 | 1 ảnh xe tải nhỏ/xe chuyển đồ đang bốc xếp. Hiện tại ảnh này dùng chung cho tất cả các thẻ dịch vụ vận chuyển trong trang, nên chọn 1 ảnh đại diện đẹp, rõ nét là đủ. *(Nếu bạn muốn mỗi thẻ có ảnh riêng, báo lại để mình cập nhật code — cần thêm ảnh như `transport-van-2.jpg`, `transport-van-3.jpg`...)* |

---

## 5. Trang "Pass Phòng Trọ" (`/pass-phong`)

| Tên file | Kích thước gợi ý | Tỉ lệ | Nội dung |
|---|---|---|---|
| `hero-pass-phong.jpg` | 1600 x 600px | ~16:6 (banner ngang, dẹt) | Ảnh banner đầu trang: phòng trọ đẹp, gợi cảm giác "sẵn sàng dọn vào ở". |
| `pass-room-1.jpg` → `pass-room-6.jpg` (6 file) | 500 x 500px mỗi ảnh | Vuông 1:1 (hoặc gần vuông) | 6 ảnh phòng trọ khác nhau đang được pass lại — có thể là ảnh thực tế phòng đang cho thuê. |

---

## 6. Mạng xã hội (hiện ở chân trang - Footer)

| Tên file | Kích thước gợi ý | Nội dung |
|---|---|---|
| `fb.svg` | 64 x 64px | Icon Facebook, màu trắng hoặc đơn sắc, nền trong suốt (icon nằm trên nền tối). |
| `ig.svg` | 64 x 64px | Icon Instagram, cùng phong cách như trên. |
| `in.svg` | 64 x 64px | Icon LinkedIn, cùng phong cách như trên. |
| `tiktok.svg` | 64 x 64px | Icon TikTok, cùng phong cách như trên. |

---

## Ghi chú thêm

- **Logo "RentMate Hola"**: hiện tại phần header/footer đang hiển thị logo dạng **chữ** (không phải ảnh), nên **không cần** file `logo.png`/`logo.svg` cho bản hiện tại. Nếu bạn có sẵn logo dạng hình ảnh và muốn thay chữ bằng logo đó, cứ gửi file ảnh, mình sẽ chỉnh code để dùng ảnh logo thay vì chữ.
- Định dạng ảnh chụp/photo: nên dùng `.jpg` (dung lượng nhẹ). Icon nên dùng `.svg` (nét, không bị mờ khi phóng to); nếu không có file `.svg`, dùng `.png` nền trong suốt cũng được — chỉ cần đổi đúng đuôi file trong tên tương ứng.
- Tổng cộng cần chuẩn bị: **1** ảnh hero trang chủ, **4** icon, **3** ảnh dịch vụ, **9** ảnh phòng trọ, **1** ảnh banner roommate, **6** avatar roommate, **1** ảnh xe vận chuyển, **1** ảnh banner pass phòng, **6** ảnh pass phòng, **4** icon mạng xã hội.
