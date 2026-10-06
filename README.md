# CodeNest - Nền Tảng Học Lập Trình Thực Chiến (Online EdTech Platform)

CodeNest là một nền tảng học lập trình trực tuyến thương mại hoàn chỉnh (SaaS/EdTech), được thiết kế với giao diện sáng (Light Modern Theme), tinh tế, chuyên nghiệp và giàu tính tương tác.

## Thông tin dự án
- **Platform Name:** CodeNest
- **Domain:** [myweb.nhungg.id.vn](https://myweb.nhungg.id.vn)
- **VPS IP:** 160.250.181.149
- **Node.js:** v24 LTS
- **Port:** Sử dụng `process.env.PORT || 3002` (cấu hình trong `.env` là `PORT=3003` để tương thích với reverse proxy CloudPanel Nginx)
- **Công nghệ:** Node.js, Express, HTML5, CSS3 thuần (Vanilla), JavaScript thuần, FontAwesome CDN

## Cấu trúc thư mục dự án
```
myweb.nhungg.id.vn/
├── .env                  # Cấu hình môi trường (PORT=3003, NODE_ENV)
├── .gitignore            # Bỏ qua node_modules, .env, *.log
├── package.json          # Dependency Express & npm scripts
├── server.js             # Express server, route aliases & API endpoints
├── README.md             # Tài liệu dự án
├── .well-known/          # Thư mục hệ thống CloudPanel (bảo toàn 100%)
└── public/
    ├── css/
    │   ├── main.css           # Design tokens, light theme, header, footer, toast
    │   ├── components.css     # Buttons, course cards, form controls, tables, badges
    │   └── pages.css          # Bố cục trang Home, Courses, Learning, Dashboard, Admin
    ├── js/
    │   ├── data.js            # Mock Database độc lập (Courses, Users, Paths, Notifs)
    │   ├── app.js             # Global app controller (Navigation, Toasts, Dropdowns)
    │   ├── courses.js         # Marketplace filtering, search, sorting & pagination
    │   ├── course-detail.js   # Chi tiết khóa học & ghi danh
    │   ├── learning.js        # Lớp học tương tác 3 cột & code viewer
    │   ├── dashboard.js       # Dashboard học viên & thanh tiến độ
    │   ├── settings.js        # Cài đặt tài khoản (Tabs, Toggles, Appearance)
    │   └── admin.js           # Bảng quản trị Users & Courses
    ├── index.html             # Trang chủ (Home)
    ├── courses.html           # Khám phá khóa học (Marketplace)
    ├── course.html            # Chi tiết khóa học
    ├── learning.html          # Lớp học trực tuyến tương tác
    ├── dashboard.html         # Dashboard học viên
    ├── my-learning.html       # Khóa học của tôi (In Progress, Completed, Saved)
    ├── wishlist.html          # Danh sách khóa học yêu thích
    ├── profile.html           # Hồ sơ cá nhân học viên
    ├── settings.html          # Cài đặt tài khoản chi tiết
    ├── login.html             # Đăng nhập
    ├── register.html          # Đăng ký
    ├── forgot-password.html   # Quên mật khẩu
    ├── admin.html             # Admin Dashboard tổng quan
    ├── admin-users.html       # Admin quản lý học viên
    ├── admin-courses.html     # Admin quản lý khóa học
    └── admin-settings.html    # Admin cài đặt hệ thống
```

## Các trang & Chức năng Frontend đã hoạt động
1. **Trang chủ (`/`)**:
   - Header sticky: Logo CodeNest, Navigation, Search, Notification dropdown (đánh dấu đã đọc), Avatar dropdown.
   - Hero section: "Learn to Code. Build Your Future." với code window mockup minh họa bằng CSS.
   - Statistics bar: 10K+ Learners, 100+ Courses, 500+ Lessons, 50+ Projects.
   - Popular Courses: Lưới khóa học với thông tin đầy đủ, rating, số học viên, thời lượng, nút lưu yêu thích.
   - Learning Paths: 5 lộ trình chuyên sâu (Frontend, Backend, Full Stack, Data & AI, Database).
   - Why CodeNest: 4 ưu điểm nổi bật.
   - Testimonials: Đánh giá thực tế từ học viên.
   - Call to Action & Footer đầy đủ.
2. **Khám phá Khóa học (`/courses`)**:
   - Tìm kiếm thời gian thực (Search bar).
   - Bộ lọc đa tiêu chí: Danh mục (Frontend, Backend, Database), Cấp độ (Beginner, Intermediate, All Levels).
   - Sắp xếp: Phổ biến nhất, Đánh giá cao nhất, Thời lượng.
3. **Chi tiết Khóa học (`/course?id=...`)**:
   - Thông tin khóa học, kết quả đạt được, yêu cầu tiên quyết, giáo trình dạng Accordion.
   - Nút Đăng ký khóa học (Enroll) với cập nhật trạng thái thời gian thực và thông báo Toast.
4. **Lớp học trực tuyến tương tác (`/learning?course=...`)**:
   - 3 cột: Cột trái (Giáo trình), Cột giữa (Nội dung bài học, khối Code Editor, nút Mark as Complete, nút Next/Prev), Cột phải (Tiến độ và thông tin khóa học).
5. **Dashboard Học viên (`/dashboard`)**:
   - Lời chào cá nhân hóa, 4 thẻ thống kê, khung "Continue Learning" tiếp tục bài học gần nhất với thanh tiến độ, danh sách khóa học đang theo học và lịch sử hoạt động.
6. **Khóa học của tôi (`/my-learning`)**:
   - Chuyển tab giữa Khóa học đang học (In Progress) và Đã hoàn thành (Completed).
7. **Yêu thích (`/wishlist`)**:
   - Danh sách khóa học đã lưu yêu thích với nút bỏ lưu và đăng ký học; hiển thị Empty state nếu trống.
8. **Hồ sơ cá nhân (`/profile`)**:
   - Thông tin cá nhân, bio, ngày tham gia và thống kê học tập.
9. **Cài đặt tài khoản (`/settings`)**:
   - Đầy đủ 6 nhóm cài đặt: Account, Profile, Security, Notifications (toggle switches), Appearance (Theme Light/Dark, Accent Color, Font Size), Privacy (Profile & Activity visibility).
10. **Hệ thống Quản trị (`/admin`, `/admin/users`, `/admin/courses`, `/admin/settings`)**:
    - Thống kê toàn sàn, biểu đồ tăng trưởng học viên và phân bổ ngôn ngữ bằng CSS.
    - Quản lý học viên: Tìm kiếm, lọc theo vai trò, đổi trạng thái hoạt động, xóa.
    - Quản lý khóa học: Tìm kiếm, xuất bản/gỡ xuất bản.
    - Cài đặt hệ thống: Quản lý tham số nền tảng, bảo mật, giới hạn tần suất.
11. **Xác thực (`/login`, `/register`, `/forgot-password`)**:
    - Form đăng nhập với nút xem mật khẩu, tài khoản mẫu.
    - Form đăng ký với thanh đo độ mạnh mật khẩu và kiểm tra xác nhận mật khẩu.
    - Form khôi phục mật khẩu.

## Cách chạy
```bash
# Khởi chạy ứng dụng
npm start

# Khởi chạy với PM2
pm2 restart myweb
```

## Các chức năng chờ kết nối Database & Backend thật
- Lưu trữ cơ sở dữ liệu thật vào MySQL/PostgreSQL cho các Entity: `User`, `Role`, `Course`, `Category`, `Lesson`, `Enrollment`, `Progress`, `Wishlist`, `Notification`, `Review`, `Settings`.
- Băm mật khẩu (bcrypt), cấp phát token JWT / Session cookies.
- Trình biên dịch mã nguồn trực tiếp (Code Execution Engine Sandbox).
- Upload file media thực tế lên Object Storage (S3 / CloudPanel Storage).
- Cổng thanh toán trực tuyến.
