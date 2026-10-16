# Birdeye CLI

<!-- impeccable:product-schema 1 -->

## Platform

web

Sản phẩm chính là CLI. Web UI được phục vụ bởi tiến trình CLI khi chọn `--format interface`.

## Stack

TypeScript, Commander, một npm package chứa CLI và skills. Web UI dùng React, esbuild đóng gói assets, HTTP server Node chạy cùng tiến trình CLI. SQLite lưu ledger CU, API keys và cấu hình provider. Esbuild được dùng thay Vite trong bản thử để build từ dependency cache offline.

## Users

Người dùng dữ liệu Birdeye và AI agent gọi CLI. Interface bản đầu phục vụ một người dùng, truy cập local hoặc qua SSH tunnel; đây là lựa chọn đã xác nhận.

## Product Purpose

Truy vấn dữ liệu Birdeye, tổng hợp metrics theo case study và hỗ trợ hỏi đáp AI dựa trên dữ liệu có nguồn. Người dùng nhìn được CU tiêu thụ theo command và workflow, đồng thời có thể giảm token output bằng `--short`.

## Operating Context

CLI lấy cảm hứng từ `GMGNAI/gmgn-skills`. MVP bắt đầu với dữ liệu Solana và ba nhóm skill token, market, portfolio. Interface bind lên địa chỉ người dùng chỉ định; mặc định dự kiến là loopback.

## Capabilities and Constraints

- JSON, table và interface là các format đầu ra dự kiến.
- Interface dùng provider tương thích OpenAI API, cấu hình base URL, model và API key; lựa chọn provider protocol này đã xác nhận.
- Birdeye API key và AI provider key là credentials riêng.
- Commands, skills và interface phải dùng chung cách tính và ghi nhận CU.
- `--short` rút gọn output có cấu trúc, giữ thông tin chi phí, cảnh báo và chất lượng dữ liệu.
- CU theo rule của docs là ước tính; usage do API credits trả về có phạm vi toàn account.
- Bản thử 0.4.0 có 35 data operations, 22 workflows gồm 11 skill tham khảo mới và 11 case trước đó, interface với API-step editor và AI tool loop. Phạm vi đang có và phần còn lại được ghi trong README; hai plan giữ vai trò roadmap.

## Evidence on Hand

- Docs local: `/Users/toanlk/birdeye.so/bds-docs-mintlify`.
- Snapshot docs dùng cho plan: `b34378ea9a1aad2c22934903ded124cd84729d3f`.
- Hai plan triển khai ở `docs/plans/cli-core.md` và `docs/plans/interface.md`.

## Product Principles

- Metrics phải có công thức, đơn vị, thời gian và nguồn truy xuất.
- Tính CU ở tầng request để mọi cách sử dụng có cùng sổ theo dõi.
- Chỉ gửi cho AI dữ liệu cần thiết để trả lời câu hỏi.
- Phân biệt dữ liệu thiếu, kết quả một phần, số 0 và kết luận của AI.

## Reference interface

UI tham khảo `birdeye-data-skills/deploy/index.html`: console nền tối, skill rail bên trái, form và kết quả ở giữa, history bên phải; có theme sáng. API-step editor mở qua disclosure, estimate luôn hiển thị. Local và SSH tunnel vào loopback tự kết nối browser; `--require-code` giữ chế độ nhập code.

## Saved research and AI knowledge

CLI/interface lưu input, raw datasets, metrics và AI output vào usage.sqlite. History mở lại sau restart không phát sinh request. Chat research mới bật live data để gọi tool trên workflow đang chọn; người dùng có thể chọn saved-only, và hội thoại tiếp tục giữ lựa chọn đã lưu. AI nhận workflow/address/API-step settings, tái sử dụng bằng chứng và gọi các API/workflow đã đăng ký hoặc MCP Birdeye để bổ sung dữ liệu. Catalog calls theo ngân sách CU; MCP có chi phí chưa xác định và dùng giới hạn request chung. Nguồn docs có manifest/hash và SQLite FTS5. AI tokens được theo dõi riêng với CU.
