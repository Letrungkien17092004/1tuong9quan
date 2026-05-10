# Project Context: Node.js Game Server

## 1. Tổng quan dự án
Tôi đang phát triển một **Back-end Game Server**. Đây là server xử lý logic thời gian thực, quản lý kết nối người chơi và điều phối trạng thái trận đấu.

## 2. Tech Stack (Công nghệ sử dụng)
Khi viết code hoặc đề xuất giải pháp, hãy luôn tuân thủ bộ công nghệ này:
- **Runtime:** Node.js .
- **Language:** TypeScript .
- **Web Framework:** Express.js (Dùng cho API bổ trợ như Auth).
- **Real-time Communication:** WebSocket (Sử dụng thư viện `socket.io`).
- **Architecture:** Event-driven architecture. Clean Architechture

## 3. Quy ước lập trình (Coding Conventions)
- **Kiểu dữ liệu:** Luôn định nghĩa `interface` hoặc `type` rõ ràng cho các gói tin WebSocket (Message Packets).
- **Xử lý lỗi:** Sử dụng Try-Catch trong các controller và có Middleware xử lý lỗi tập trung cho Express.
- **Async/Await:** Ưu tiên sử dụng async/await thay vì callback.
- **Cấu trúc thư mục:**
    - `/src/services`: Xử lý logic nghiệp vụ game.
    - `/src/sockets`: Quản lý các sự kiện WebSocket.
    - `/src/routes`: Các API endpoint của Express.
    - `/src/models`: Định nghĩa schema dữ liệu.

## 4. Trạng thái hiện tại & Nhiệm vụ tiếp theo
- [x] Xây dựng thành công và hoạt động ổn định các chức năng chính.

## 5. Chỉ dẫn dành cho AI (AI Instructions)
- Trước khi sửa đổi code, hãy tóm tắt giải pháp bạn định thực hiện.
- Luôn kiểm tra tính an toàn của dữ liệu đầu vào từ WebSocket để tránh tấn công injection hoặc làm sập server.
- Nếu cần thêm thư viện mới, hãy hỏi ý kiến tôi trước.