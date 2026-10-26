# Các link cần bổ sung / thay đổi

Theo yêu cầu, bỏ qua các link không truy cập được và dựng trang bằng nội dung hiện có trong repo.

| Link / vị trí | Hiện trạng | Cần bạn cung cấp |
| --- | --- | --- |
| https://claude.ai/artifact/HbN45ytH6GiCPWMEVJ8Yow | Trang ngoài trả HTTP 200 nhưng API nội dung artifact trả 403; trình duyệt hiển thị “Page not found”. Chưa đối chiếu được thiết kế. Người dùng đã xác nhận màu chủ đạo xanh lá; mã triển khai hiện tại #22C55E chưa được trích từ artifact. | Link chia sẻ mở được không cần phiên đăng nhập, ảnh chụp hoặc source export. |
| `https://YOUR_DOCS_HOST/embed` trong README app | Placeholder chỉ nằm trong ví dụ tích hợp, không phải link hiển thị trên website. | Domain thật sau khi deploy. |
| `CATALOG_URL` nếu dùng cập nhật runtime trên serverless | Chưa cấu hình. Mặc định app đọc JSON đi kèm. | URL JSON thật trên storage/content service; bỏ qua nếu dùng file local. |
| Link download package `.tgz` / trang release | Website hiện hướng dẫn cài từ source hoặc file do team cung cấp, chưa có nút tải. | URL release/package công khai bạn muốn dùng. |
| Package `birdeye-cli` trên npm registry | `npm view birdeye-cli` trả 404 khi kiểm tra. Docs hướng dẫn `npm install --global ./birdeye-cli-0.4.0.tgz`. | Tên package / URL npm sau khi publish để chuyển hướng dẫn sang cài từ registry. |

Website không tạo nút GitHub/download giả hoặc gắn link Claude hỏng vào navigation. Các trang trong site dùng anchor nội bộ hoạt động được. Link HTTP(S) trong Markdown nguồn được giữ nguyên; chưa xác minh toàn bộ các website bên ngoài. Tài liệu tương đối chưa được đóng gói hiển thị dưới dạng tham chiếu nguồn để tránh điều hướng đến route 404.
