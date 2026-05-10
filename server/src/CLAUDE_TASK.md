# Mục tiêu: Refactor lại cách tổ chức namespace và gắn listener cho socket
- Hiện tại tôi đang tạo namespace và gắn socket listenner theo cách tạo class, nó khá phức tạp
và tôi muốn bạn làm cho nó tốt hơn về cách tổ chức.
# Hướng dẫn:
- thư mục `core`: chứa các core business như: usecase, interface của repository, các lớp entity.
- thư mục `exrpess`: Là thư mục tổ chức express nhưng tạm thời không cần quan tâm thư mục này và cũng không sửa thư mục này.
- thư mục `socketIO`: Đây chính là nơi cần refactor. tại đây tôi có định nghĩa
 - `io.ts`: là file tạo io object
 - `listener`: chứa các file đóng vai trò là listener khi được gắn vào socket
 - `sockets`: chứa các file định nghĩa socket, namespace.
- file `containers.ts`: là nơi tôi khởi tạo repository để tránh việc tạo quá nhiều instance của repo.
- file `server.ts`: là entry point, khởi động app, nơi gọi tới cách file boots của IO hay express
- các thư mục/file còn lại là file nháp hoặc file test. không cần quan tâm để tránh tốn token
# Quy tắc:
- Sử dụng TypeScript.
- Không dùng thư viện ngoài trừ `firebase/auth`.