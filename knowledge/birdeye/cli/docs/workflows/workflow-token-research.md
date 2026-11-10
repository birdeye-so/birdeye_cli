# Token research

**Mục đích:** identity → security → ownership → pool/cohort nếu cần. [Quy tắc chung](README.md).

```bash
birdeye-cli case token-research --address "$TOKEN" --estimate-cu --short
birdeye-cli case token-research --address "$TOKEN" --max-cu 100 --short
birdeye-cli case token-research --address "$TOKEN" --depth full --max-cu 150 --short
```

Chọn core **hoặc** full; chạy cả hai sẽ trả phí lại. Core: overview → security → top 10 holders (wallet mode), **70 CU**. Full thêm market list → pair overview cho pool đầu trang theo liquidity → holder profile, tổng **130 CU** trước retry.

Bật `--exclude-freezeable`, `--max-top10-pct` hoặc `--min-liquidity` nếu người dùng đã chọn tiêu chí. Thiếu field cần cho check thì `insufficient-data`; vi phạm ngưỡng thì `exclude-by-policy`, bỏ enrich token còn lại. Không có policy thì report observations, không tự cho điểm an toàn.

Kết quả giữ token identity, liquidity/volume ratio với basis, security fields, concentration, source/time và CU. Holder/account basis khác nhau: command holders dùng wallet, policy top10 lấy token-account share từ security. Profile trả nhãn Birdeye có thể overlap. Thiếu pool/cohort hoặc API không được cấp quyền phải hiện `missing`.

Các nhánh điều tra thêm chạy bằng wrapper trong cùng `--workflow`: `token holder-positions`, `token first-buyers`, `token money-flow`, `market ohlcv`. Dùng `--estimate-cu` trước khi mở rộng. Không gọi lại chỉ để đổi cách in.
