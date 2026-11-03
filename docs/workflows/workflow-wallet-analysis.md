# Wallet analysis

**Mục đích:** holdings, PnL và recent trades cho một ví. Đối chiếu [GMGN](https://github.com/GMGNAI/gmgn-skills/blob/main/docs/workflow-wallet-analysis.md). [Quy tắc chung](README.md).

```bash
birdeye-cli case wallet-analysis --address "$WALLET" --duration 30d --pnl-method wac --estimate-cu --short
birdeye-cli case wallet-analysis --address "$WALLET" --duration 30d --pnl-method wac --max-cu 80 --short
# Full là lựa chọn thay thế nếu cần contributor và vị thế
birdeye-cli case wallet-analysis --address "$WALLET" --depth full --limit 3 --max-cu 230 --short
```

Core: current holdings (20) → PnL summary (20) → một trang trades trước `to` (10): **50 CU**. Trades chỉ gửi `before_time=to`, có thể chứa giao dịch cũ hơn `from`; đây không phải dữ liệu đầy đủ trong window. Step override có thể chuyển sang `after_time`, nhưng không được gửi cả hai mốc. Full thêm PnL details (30) và security + overview cho tối đa k vị thế theo thứ tự holdings: **80 + 40k CU**, mặc định k=3, tổng **200 CU** trước retry.

PnL summary/details dùng cùng duration, `position_scope=duration_only`, `pnl_method` mặc định `wac`; option `net_cash` giữ đúng enum OpenAPI. Văn bản upstream có chỗ ghi `netcash`, nên response live cần xác nhận; wrapper không silently đổi phương pháp.

Report tách realized/unrealized và giữ win rate theo provider/fully-realized population. Holdings weights là mẫu assets đã định giá trong trang, không phải toàn ví. PnL details sort theo last trade, không suy top contributors toàn ví từ trang đầu. Trade page có `hasMore` thì report vẫn chỉ mô tả trang, không suy holding time toàn lịch sử.

Nếu chỉ cần snapshot exposure, case cũ `wallet-exposure` tốn 20 CU. Thiếu PnL hoặc permission thì giữ exposure và `missing`; không coi ví nhiều tiền là smart money. Có thể gọi thêm trang bằng wrappers và cùng workflow budget.
