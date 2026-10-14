# 3.1. Các tính năng kỹ thuật và đặc tính cơ bản đã hoàn thành của sản phẩm MVP

**Sản phẩm:** RentMate Hola, nền tảng dành cho sinh viên để tìm phòng trọ, tìm roommate, pass phòng, pass đồ và thuê vận chuyển đồ.

**Thành phần hệ thống:** giao diện web (React + Vite), máy chủ API (Node.js + Express), cơ sở dữ liệu MySQL.

---

## 3.1.1. Tổng quan kiến trúc và triển khai

| Thành phần | Công nghệ | Nơi triển khai |
|---|---|---|
| Giao diện người dùng | React 19, React Router, Vite | Firebase Hosting |
| Máy chủ API | Node.js, Express 5 | Render |
| Cơ sở dữ liệu | MySQL (kết nối TLS) | Aiven |
| Lưu ảnh và video | Cloudinary | Dịch vụ ngoài |
| Bản đồ và địa chỉ | VietMap | Dịch vụ ngoài |
| Thanh toán | payOS | Dịch vụ ngoài |
| Trợ lý AI | Gemini (`gemini-3.6-flash`) | Dịch vụ ngoài |
| Tin nhắn thời gian thực | Socket.IO | Chạy cùng máy chủ API |
| Gửi email | Nodemailer (SMTP) | Dịch vụ SMTP |

Giao diện gọi máy chủ qua REST API và dùng cookie phiên đăng nhập. Mọi khóa bí mật (JWT, payOS, Gemini, mật khẩu cơ sở dữ liệu) nằm ở biến môi trường của máy chủ, không có trong mã giao diện.

---

## 3.1.2. Tính năng cho người dùng

### a) Tài khoản và xác thực

- Đăng ký bằng email và mật khẩu, chọn vai trò người thuê hoặc chủ trọ.
- Đăng nhập bằng email hoặc tài khoản Google.
- Quên mật khẩu: hệ thống gửi email chứa liên kết đặt lại, có thời hạn.
- Mật khẩu được băm bằng bcrypt. Phiên đăng nhập dùng JWT lưu trong cookie.
- Tài khoản bị khóa không đăng nhập hoặc gọi API được nữa.
- Trang Cài đặt cho phép đổi họ tên, số điện thoại, ảnh đại diện và mật khẩu.

### b) Năm loại bài đăng

| Loại | Nội dung chính |
|---|---|
| Phòng trọ | Giá thuê, tiền cọc, diện tích, loại hình, tiện ích, số người tối đa; nhãn chéo trên ảnh (xanh: còn phòng, đỏ: hết phòng) |
| Tìm roommate | Ngân sách, giới tính mong muốn, ngày chuyển vào, hẹn giờ đăng |
| Pass phòng | Giá thuê hằng tháng, phí đền bù, ngày muốn pass |
| Pass đồ | Danh mục, tình trạng, giá bán |
| Vận chuyển đồ | Loại xe, tải trọng, số điện thoại chủ xe (chỉ người đã đăng nhập thấy) |

Mỗi loại có trang danh sách, trang chi tiết, trang đăng bài riêng. Danh sách có bộ lọc (từ khóa, khoảng giá, diện tích, khu vực, tiện ích) và phân trang. Mỗi bài có thể đính kèm tối đa 8 ảnh hoặc video, mỗi tệp tối đa 25 MB.

### c) Địa chỉ và bản đồ

- Gợi ý địa chỉ tự động khi gõ (VietMap Autocomplete), lưu kèm tọa độ.
- Bài đăng hiển thị vị trí trên bản đồ ở trang chi tiết.
- Bộ chọn tỉnh và phường theo mã hành chính.

### d) Quản lý bài đăng của chính mình

- Chủ trọ có trang Quản lý trọ riêng với thanh bên gồm Tổng quan, Bài đăng trọ (sửa, xóa) và Tin nhắn khách thuê.

- Xem toàn bộ bài đã đăng trong Cài đặt, kèm trạng thái.
- Sửa tiêu đề, mô tả, giá và trạng thái. Backend chỉ cho sửa bài thuộc về chính người đó, và chỉ các trường nằm trong danh sách cho phép.
- Xóa bài. Việc xóa là xóa mềm, nên các cuộc trò chuyện liên quan không bị mất dữ liệu.
- Với Pass phòng và Pass đồ, bài mới tạo ở trạng thái chờ duyệt và chủ bài không tự chuyển sang trạng thái hiển thị được.

### e) Lưu yêu thích

- Lưu và bỏ lưu bất kỳ loại bài nào.
- Trang "Đã lưu" hiển thị lại tiêu đề, ảnh, giá. Bài đã bị xóa hoặc gỡ được đánh dấu rõ.

### f) Nhắn tin trực tiếp

- Người quan tâm bắt đầu cuộc trò chuyện với người đăng ngay từ trang chi tiết của bài.
- Tin nhắn gửi và nhận theo thời gian thực qua Socket.IO, có đếm tin chưa đọc trên thanh điều hướng.
- Khi có tin nhắn mới, chủ bài nhận thêm email báo tin.
- Chỉ hai người trong cuộc trò chuyện mới đọc và gửi được tin.

### g) Trợ lý AI

- Trong khung chat của một bài đăng, người dùng đặt câu hỏi cho trợ lý AI (Gemini).
- AI chỉ trả lời từ dữ liệu của bài đăng và danh sách phòng tương tự do hệ thống cung cấp. Nếu thiếu thông tin, AI nói rõ là chưa có và khuyên hỏi chủ bài.
- Email và số điện thoại trong lịch sử chat được che trước khi gửi cho AI.
- Mỗi lần gọi có giới hạn thời gian chờ 20 giây để không treo giao diện.

### h) Video review và đánh giá

- Mỗi bài đăng mới bắt buộc kèm 1 video review (tối đa 25 MB). Máy chủ từ chối bài thiếu video trước khi trừ lượt đăng đã thanh toán. Bài đăng cũ không bị ảnh hưởng.
- Trang chi tiết có trình phát video và mục đánh giá từ 1 đến 5 sao kèm nhận xét.
- Chỉ người đã nhắn tin với chủ bài mới được đánh giá. Chủ bài không tự đánh giá bài của mình. Mỗi người một đánh giá cho mỗi bài và được sửa hoặc xóa.

### i) Thông báo

- Mục "Thông báo" trong Cài đặt, có số thông báo chưa đọc, đánh dấu từng thông báo hoặc tất cả là đã đọc.
- Hiện dùng cho việc báo bài bị ẩn hoặc được hiển thị lại (xem 3.1.3).

---

## 3.1.3. Tính năng quản trị

Khu vực quản trị nằm ở đường dẫn `/admin`, chỉ tài khoản có vai trò quản trị mới vào được. Mọi API quản trị đều kiểm tra vai trò ở phía máy chủ.

| Trang | Chức năng |
|---|---|
| Tổng quan | Số liệu thật: tổng người dùng, tổng tin đăng, tin chờ duyệt, tin bị ẩn, tài khoản bị khóa; biểu đồ tin theo loại; 5 người dùng mới nhất |
| Người dùng | Tìm theo tên hoặc email, lọc theo vai trò và trạng thái, phân trang; khóa, mở khóa và đổi vai trò. Quản trị viên không tự khóa hoặc hạ quyền chính mình |
| Tin đăng | Xem tin theo từng loại, tìm kiếm, phân trang; ẩn tin kèm lý do bắt buộc; hiện lại tin |
| Dòng tiền | Danh sách giao dịch payOS đã thanh toán thành công, tổng tiền, thống kê theo loại dịch vụ |

### Ẩn bài đăng kèm lý do

1. Quản trị viên bấm "Ẩn" ở một tin. Hộp thoại yêu cầu nhập lý do (tối đa 500 ký tự). Để trống thì không ẩn được, và máy chủ kiểm tra lại điều này.
2. Tin bị ẩn biến khỏi danh sách và trang chi tiết công khai, và không ai nhắn tin hỏi về tin đó được nữa. Chủ bài vẫn xem được bài của mình.
3. Chủ bài nhận lý do qua hai kênh: thông báo trên website và email. Trong "Bài đăng của tôi", tin bị ẩn hiện nhãn đỏ cùng lý do.
4. Trạng thái ẩn lưu ở cột riêng (`admin_hidden_at`), tách khỏi cột trạng thái, nên chủ bài không tự bỏ ẩn được bằng cách sửa trạng thái.
5. Khi quản trị viên hiện lại tin, chủ bài nhận một thông báo trên website.

---

## 3.1.4. Thanh toán phí đăng bài

- Tài khoản mới được đăng bài miễn phí trong 2 tháng kể từ ngày tạo.
- Hết thời gian miễn phí, mỗi lần đăng cần một lượt thanh toán qua payOS. Mức phí cấu hình bằng biến môi trường `LISTING_FEE_VND`.
- Luồng thanh toán: tạo liên kết thanh toán, chuyển người dùng sang payOS, nhận kết quả qua webhook, kiểm tra lại trạng thái trên trang kết quả.
- Mỗi lượt đã thanh toán chỉ dùng được một lần. Hệ thống ghi lại bài đăng đã dùng lượt đó.
- Nếu chưa thanh toán, API đăng bài trả mã 402 và giao diện đưa người dùng sang trang thanh toán.

---

## 3.1.5. Cơ sở dữ liệu và bảo mật

**Cơ sở dữ liệu**

- Các bảng chính: người dùng, địa chỉ, năm bảng bài đăng cùng năm bảng ảnh, yêu thích, cuộc trò chuyện, tin nhắn, thanh toán, thông báo, nhật ký kiểm toán.
- Có script migration đánh số theo thứ tự (`001` đến `006`) và tệp `database.sql` để dựng cơ sở dữ liệu mới.
- Có trigger ghi nhật ký kiểm toán (ai sửa, giá trị cũ và mới) cho người dùng, phòng trọ, pass phòng, roommate, pass đồ và đặt xe (bảng xe vận chuyển chưa có trigger).
- Kết nối tới Aiven bắt buộc dùng TLS với chứng chỉ CA.

**Bảo mật**

- Truy vấn SQL dùng tham số hóa. Tên bảng và cột chỉ lấy từ danh sách hằng số trong mã.
- Nội dung đưa vào email được thoát ký tự HTML.
- Phân quyền theo vai trò ở phía máy chủ, kiểm tra quyền sở hữu ngay trong câu lệnh cập nhật.
- CORS chỉ cho phép địa chỉ giao diện đã khai báo; cookie phiên gửi kèm thông tin xác thực.
- Chỉ nhận ảnh và video khi tải lên, có giới hạn dung lượng và số tệp.

---

## 3.1.6. Những phần chưa hoàn thành trong MVP

Báo cáo ghi rõ các giới hạn để tránh hiểu nhầm về phạm vi sản phẩm:

- **Duyệt bài Pass phòng và Pass đồ:** hệ thống đã có API để quản trị viên đổi trạng thái từ chờ duyệt sang hiển thị, nhưng trang quản trị chưa có nút duyệt. Hiện chỉ làm được qua API.
- **Đặt xe vận chuyển:** có thông tin dịch vụ và nhắn tin với chủ xe, chưa có luồng đặt lịch và thanh toán theo chuyến.
- **Thông báo đẩy và thông báo tin nhắn trên web:** tin nhắn mới hiện được báo bằng email và số đếm trên thanh điều hướng, chưa có thông báo đẩy của trình duyệt.
- **Kiểm thử tự động:** chưa có bộ kiểm thử tự động. Các tính năng mới được kiểm tra bằng cách biên dịch giao diện, nạp thử máy chủ và chạy thử thủ công.
- **Đo lường người dùng thật:** chưa có số liệu về lượng người dùng thật, nên báo cáo này không nêu con số nào về mức sử dụng.

---

## 3.1.7. Kết luận

Sản phẩm MVP đã có đủ luồng chính của một nền tảng đăng tin: đăng ký, đăng bài năm loại, tìm kiếm có bộ lọc, nhắn tin thời gian thực, hỏi trợ lý AI, thu phí đăng bài, và khu vực quản trị với dữ liệu thật. Hệ thống đã triển khai trên Firebase, Render và Aiven. Các phần còn thiếu ở mục 3.1.6 là công việc cho giai đoạn tiếp theo.
