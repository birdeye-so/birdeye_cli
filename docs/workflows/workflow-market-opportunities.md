# Market opportunities

**Mục đích:** scan rộng, enrich ít token theo câu hỏi/ngưỡng của người dùng. Đối chiếu [GMGN](https://github.com/GMGNAI/gmgn-skills/blob/main/docs/workflow-market-opportunities.md). [Quy tắc chung](README.md).

```bash
birdeye-cli case market-opportunities --interval 1h --scan-limit 50 --limit 3 --estimate-cu --short
birdeye-cli case market-opportunities --interval 1h --scan-limit 50 --limit 3 --max-cu 170 --short
```

Trending lấy một trang tối đa 50 → lọc liquidity nếu người dùng cung cấp → dedup address → sort theo trường **volume24hUSD** (missing đứng sau) → chọn tối đa k → security rồi overview. Đây là local ranking trong trang, không thay rank do provider trả. Window `--interval` chọn bảng trending, còn metric local selection vẫn là volume24hUSD.

Base **25 + 40k CU**, mặc định k=3 là **145 CU**; k=5 là 225. Full thêm money-flow frame24h và holder-profile mỗi token: **25 + 75k**, k=3 là **250 CU**. Chừa phần retry trong budget nếu cần; giới hạn số token thực tế không bảo đảm đủ k kết quả.

`--exclude-freezeable` và `--max-top10-pct` dừng enrich token vi phạm hoặc thiếu check. Token bị loại không được tự thay bằng một token khác ngoài shortlist để tránh phát sinh CU không tính trước. Report giữ selected addresses, selection basis, outcomes và missing checks; không xuất buy recommendation hay GMGN score.

Case cũ `market-shortlist --limit 5` chỉ lấy năm token đầu theo provider order, không scan50 rồi chọn5. Muốn tìm token mới theo tuổi/graduation, dùng early-project-screening thay vì suy tuổi từ trending. Workflow kết thúc ở shortlist; swap/order execution nằm ngoài CLI.
