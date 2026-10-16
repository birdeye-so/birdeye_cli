# Smart money profile

**Mục đích:** tìm ví có hiệu suất đáng xem và đối chiếu PnL với activity/exposure. Đối chiếu [GMGN](https://github.com/GMGNAI/gmgn-skills/blob/main/docs/workflow-smart-money-profile.md). [Quy tắc chung](README.md).

```bash
birdeye-cli case smart-money-profile --limit 3 --estimate-cu --short
birdeye-cli case smart-money-profile --limit 3 --max-cu 250 --short
# Hoặc một ví đã biết, không gọi ranking
birdeye-cli case smart-money-profile --address "$WALLET" --max-cu 100 --short
```

Discovery lấy trader ranking 30d theo realized PnL (25 CU), chọn tối đa k ví rồi holdings (20) + summary 7d (20) + summary 30d (20) + một trang trades (10) cho mỗi ví. Base **25 + 70k**, mặc định **235 CU**. Với address chỉ **70 CU**. Full thêm PnL details **30 CU/ví**; duration cho trades/details mặc định 30d, hai summary luôn là 7d/30d.

Cùng `pnl_method`, `position_scope=duration_only`; không coi 7d/30d là hai mẫu độc lập. Wallet ranking dựa hiệu suất khác rich list; cũng không tự chứng nhận nhãn `smart_trader`. Profile giữ scope, sample size nếu có, unknown và backfill warnings. Không ghép lần mua đầu/lần bán đầu để đo holding time khi thiếu lot history.

`copyTradeRoi` trả null: chưa có execution/backtest model gồm latency, fees, slippage, partial sells và transfers. Wallet PnL không phải lợi nhuận người copy.

## Token discovery theo smart money

Đây là nhánh dùng wrappers, không thay profile ví bằng danh sách token:

```bash
birdeye-cli market smart-money --interval 1d --limit 10 --estimate-cu --short
birdeye-cli token money-flow "$TOKEN" --frames 24h --wallet-tags smart_money --estimate-cu --short
```

Bỏ estimate để gọi thật trong cùng `--workflow`. `1d` của list khác enum `24h` của money-flow; giữ timestamps thực tế, không giả định ranh giới aggregate giống nhau. Flow mặc định theo cohort; `all` chỉ gồm các tag được hỗ trợ, không phải toàn bộ trader thị trường. Tag `smart_money` không tự bằng `smart_trader` của holder-profile.
