# Risk warning

**Mục đích:** rà soát token theo security, ownership và timeline có bằng chứng. [Quy tắc chung](README.md).

```bash
birdeye-cli case risk-warning --address "$TOKEN" --estimate-cu --short
birdeye-cli case risk-warning --address "$TOKEN" --max-cu 100 --short
birdeye-cli case risk-warning --address "$TOKEN" --depth full --max-cu 220 --short
```

Chọn core hoặc full để tránh gọi lại. Core security trước → overview → top holders: **70 CU**. Full thêm holder-profile (25), một trang positions dev/bundler/insider/sniper (30), tags-tracker (30), tracker details (30): **185 CU**. Holder-positions được đối chiếu lại với trang endpoint ngày 2026-10-16.

Optional policy: `--exclude-freezeable`, `--max-top10-pct <percent>`, `--min-liquidity <usd>`. Ngưỡng do người dùng chọn; field unknown không tự pass. Top10 policy dùng token-account basis. Labels của profile không thể truyền nguyên sang tracker: tracker chỉ hỗ trợ dev/sniper/smart_trader/kol. Một số token lớn như wSOL, USDC, USDT, BONK bị upstream loại khỏi tracker; kết quả sẽ partial khi endpoint không hỗ trợ.

Muốn so liquidity snapshot với baseline tự cung cấp, dùng cả `--baseline-liquidity <usd>` và `--baseline-time <unix-seconds>`. Host tính `100 × (current / baseline − 1)`, baseline phải >0 và có timestamp trước observation time. Giữ cùng token/basis; đây không phải baseline đã được hệ thống xác minh.

USD liquidity giảm chưa chứng minh rút pool; holding giảm chưa chứng minh bán. Cohort tags overlap, không cộng shares. Tracker là một trang/window; cursors và missing checks được giữ để điều tra tiếp. Cần OHLCV thì gọi wrapper theo budget riêng.

Recipe chạy một lần; chưa có scheduler, snapshot history hoặc subscription. Không gọi snapshot này là cảnh báo liên tục hay tự động mở vòng polling vô hạn.
