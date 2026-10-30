# Skill nhiều bước — chờ review

Đây là ghi chú cho maintainer, không nằm trong catalog công khai. Chưa thay đổi logic, thứ tự bước hoặc chế độ mặc định.

Đánh dấu khi có ít nhất 4 bước trong một chế độ được kiểm tra, hoặc có bước chọn đối tượng từ kết quả trước. Có 20/23 skill thuộc diện này. Số request tính cả fan-out; không đồng nhất số bước với số lần gọi API. Đây là ước tính trước retry, không phải hóa đơn; pricing OHLC của Token DD Score còn provisional.

Chế độ full/deep/include và wallet tùy chọn được kiểm tra riêng, không phải liệt kê mọi tổ hợp cờ. Budget và lỗi có thể khiến bước sau không chạy.

Chạy `npm run skills:review` để cập nhật phần sinh tự động. Ghi quyết định ở cuối file; lệnh giữ nguyên phần ghi chú ngoài block.

<!-- GENERATED SKILL REVIEW START -->
| Skill ID | Mặc định: bước / request / CU | Chế độ khác | Cần review |
| --- | --- | --- | --- |
| `skill-price-surge` | 1 / 1 / 50 | Advanced: 3 bước, 21 req, 650 CU; Advanced + security: 4 bước, 31 req, 950 CU | Duyệt các bước và phạm vi dữ liệu trước khi đổi mặc định. |
| `skill-launchpad-trending` | 1 / 1 / 30 | Full: 2 bước, 4 req, 75 CU | Duyệt các bước và phạm vi dữ liệu trước khi đổi mặc định. |
| `skill-lp-analysis` | 2 / 4 / 70 | Full: 3 bước, 5 req, 220 CU | Duyệt các bước và phạm vi dữ liệu trước khi đổi mặc định. |
| `skill-smart-money-holders` | 2 / 2 / 60 | Full: 4 bước, 4 req, 120 CU | Duyệt các bước và phạm vi dữ liệu trước khi đổi mặc định. |
| `skill-token-dd-score` | 7 / 7 / 181 | Standard DD: 2 bước, 2 req, 51 CU | Advanced mặc định có bảy bước; Standard có hai. OHLC 30 CU còn provisional. Cần duyệt chế độ mặc định và bằng chứng tối thiểu trước khi chấm điểm. |
| `skill-smart-wallets` | 2 / 4 / 110 | Standard discovery: 3 bước, 7 req, 170 CU; Deep: 5 bước, 13 req, 320 CU | Token → traders → wallet → PnL/positions. Cần duyệt dedup, số wallet tối đa, và Fast/Standard/Deep. Không cộng PnL theo token thành PnL toàn ví. |
| `skill-contract-dd` | 4 / 4 / 178 | — | Candles có cần đi cùng kiểm tra contract mặc định? skip-kline giảm một bước; giá không chứng minh contract an toàn. |
| `skill-rugcheck-audit` | 5 / 5 / 258 | — | Tên có thể bị hiểu là tích hợp RugCheck.org dù chỉ dùng Birdeye. Cần duyệt tên và phạm vi kết luận. |
| `skill-wallet-score` | 6 / 6 / 150 | — | Score cần 30d/90d và positions tương ứng. Cần duyệt nhu cầu holdings/first-funded mặc định; thiếu dữ liệu phải giữ điểm unavailable. |
| `skill-wallet-style` | 4 / 4 / 140 | — | Phân loại dùng PnL, positions; first-funded và transactions có thể bỏ. Cần duyệt phần nào thật sự cần cho phân loại. |
| `skill-wallet-analysis` | 9 / 9 / 240 | — | Mặc định năm cửa sổ PnL và bốn bước bổ sung. Có nên mặc định ít cửa sổ hơn? Không cộng các kỳ chồng lấn. |
| `skill-smart-money-profile` | 7 / 7 / 190 | — | Nhiều bằng chứng cho một wallet: PnL, positions, holdings, funding, trades, net worth. Cần duyệt phần nào nên tùy chọn và tên đang gần smart-money-profile. |
| `skill-smart-money-leaderboard` | 3 / 3 / 70 | 10 wallet: 30 bước, 30 req, 700 CU | Mỗi wallet cần ba request, tối đa 10 wallet. Cần duyệt giới hạn, scope PnL thống nhất và cách giữ wallet thiếu dữ liệu ngoài bảng xếp hạng. |

## Chi tiết thực thi để review

### Price Surge Screen — `skill-price-surge`

Định nghĩa: [definition.ts](../src/workflows/skill-price-surge/definition.ts).

**Standard: 1 bước / tối đa 1 request / 50 CU trước retry.**

1. `tokens` → `market.token-list` (50 CU/request).

**Advanced: 3 bước / tối đa 21 request / 650 CU trước retry.**

1. `tokens` → `market.token-list` (50 CU/request).
2. `top_traders` → `token.top-traders` (30 CU/request; lấy tối đa 10 token từ `tokens`, giữ thứ tự provider).
3. `holder_profile` → `token.holder-profile` (30 CU/request; lấy tối đa 10 token từ `tokens`, giữ thứ tự provider).

**Advanced + security: 4 bước / tối đa 31 request / 950 CU trước retry.**

1. `tokens` → `market.token-list` (50 CU/request).
2. `security` → `token.security` (30 CU/request; lấy tối đa 10 token từ `tokens`, giữ thứ tự provider).
3. `top_traders` → `token.top-traders` (30 CU/request; lấy tối đa 10 token từ `tokens`, giữ thứ tự provider).
4. `holder_profile` → `token.holder-profile` (30 CU/request; lấy tối đa 10 token từ `tokens`, giữ thứ tự provider).

### Token Launchpad Trending — `skill-launchpad-trending`

Định nghĩa: [definition.ts](../src/workflows/skill-launchpad-trending/definition.ts).

**Mặc định: 1 bước / tối đa 1 request / 30 CU trước retry.**

1. `candidates` → `market.meme-list` (30 CU/request).

**Full: 2 bước / tối đa 4 request / 75 CU trước retry.**

1. `candidates` → `market.meme-list` (30 CU/request).
2. `launch-detail` → `token.meme-detail` (15 CU/request; lấy tối đa 3 token từ `candidates`, giữ thứ tự provider).

### LP Analysis — `skill-lp-analysis`

Định nghĩa: [definition.ts](../src/workflows/skill-lp-analysis/definition.ts).

**Mặc định: 2 bước / tối đa 4 request / 70 CU trước retry.**

1. `markets` → `token.markets` (25 CU/request).
2. `pairs` → `market.pair-overview` (15 CU/request; lấy tối đa 3 pair từ `markets`, giữ thứ tự provider).

**Full: 3 bước / tối đa 5 request / 220 CU trước retry.**

1. `markets` → `token.markets` (25 CU/request).
2. `pairs` → `market.pair-overview` (15 CU/request; lấy tối đa 3 pair từ `markets`, giữ thứ tự provider).
3. `liquidity` → `token.liquidity-history` (150 CU/request).

### Smart Money Holder Analysis — `skill-smart-money-holders`

Định nghĩa: [definition.ts](../src/workflows/skill-smart-money-holders/definition.ts).

**Mặc định: 2 bước / tối đa 2 request / 60 CU trước retry.**

1. `profile` → `token.holder-profile` (30 CU/request).
2. `positions` → `token.holder-positions` (30 CU/request).

**Full: 4 bước / tối đa 4 request / 120 CU trước retry.**

1. `profile` → `token.holder-profile` (30 CU/request).
2. `positions` → `token.holder-positions` (30 CU/request).
3. `timeline` → `token.tags-tracker` (30 CU/request).
4. `timeline-wallets` → `token.tags-tracker-details` (30 CU/request).

### Token DD — `skill-token-dd-score`

Định nghĩa: [definition.ts](../src/workflows/skill-token-dd-score/definition.ts).

**Mặc định: 7 bước / tối đa 7 request / 181 CU trước retry.**

1. `overview` → `token.overview` (21 CU/request).
2. `security` → `token.security` (30 CU/request).
3. `distribution` → `token.holder-distribution` (30 CU/request).
4. `profile` → `token.holder-profile` (30 CU/request).
5. `holders` → `token.holders` (30 CU/request).
6. `flow` → `token.money-flow` (10 CU/request).
7. `liquidity` → `token.liquidity-ohlc` (30 CU/request).

**Standard DD: 2 bước / tối đa 2 request / 51 CU trước retry.**

1. `overview` → `token.overview` (21 CU/request).
2. `security` → `token.security` (30 CU/request).

### Smart Wallets — `skill-smart-wallets`

Định nghĩa: [definition.ts](../src/workflows/skill-smart-wallets/definition.ts).

**Mặc định: 2 bước / tối đa 4 request / 110 CU trước retry.**

1. `smart-tokens` → `market.smart-money` (20 CU/request).
2. `traders` → `token.top-traders` (30 CU/request; lấy tối đa 3 token từ `smart-tokens`, giữ thứ tự provider).

**Standard discovery: 3 bước / tối đa 7 request / 170 CU trước retry.**

1. `smart-tokens` → `market.smart-money` (20 CU/request).
2. `traders` → `token.top-traders` (30 CU/request; lấy tối đa 3 token từ `smart-tokens`, giữ thứ tự provider).
3. `pnl` → `portfolio.pnl-summary` (20 CU/request; lấy tối đa 3 wallet từ `traders`, giữ thứ tự provider).

**Deep: 5 bước / tối đa 13 request / 320 CU trước retry.**

1. `smart-tokens` → `market.smart-money` (20 CU/request).
2. `traders` → `token.top-traders` (30 CU/request; lấy tối đa 3 token từ `smart-tokens`, giữ thứ tự provider).
3. `pnl` → `portfolio.pnl-summary` (20 CU/request; lấy tối đa 3 wallet từ `traders`, giữ thứ tự provider).
4. `holdings` → `portfolio.holdings` (20 CU/request; lấy tối đa 3 wallet từ `traders`, giữ thứ tự provider).
5. `pnl-details` → `portfolio.pnl-details` (30 CU/request; lấy tối đa 3 wallet từ `traders`, giữ thứ tự provider).

### Contract DD — `skill-contract-dd`

Định nghĩa: [definition.ts](../src/workflows/skill-contract-dd/definition.ts).

**Mặc định: 4 bước / tối đa 4 request / 178 CU trước retry.**

1. `overview` → `token.overview` (18 CU/request).
2. `security` → `token.security` (30 CU/request).
3. `distribution` → `token.holder-distribution` (30 CU/request).
4. `candles` → `market.ohlcv` (100 CU/request).

### RugCheck Audit — `skill-rugcheck-audit`

Định nghĩa: [definition.ts](../src/workflows/skill-rugcheck-audit/definition.ts).

**Mặc định: 5 bước / tối đa 5 request / 258 CU trước retry.**

1. `overview` → `token.overview` (18 CU/request).
2. `security` → `token.security` (30 CU/request).
3. `holders` → `token.holders` (30 CU/request).
4. `profile` → `token.holder-profile` (30 CU/request).
5. `liquidity` → `token.liquidity-history` (150 CU/request).

### Wallet Score — `skill-wallet-score`

Định nghĩa: [definition.ts](../src/workflows/skill-wallet-score/definition.ts).

**Mặc định: 6 bước / tối đa 6 request / 150 CU trước retry.**

1. `pnl30` → `portfolio.pnl-summary` (20 CU/request).
2. `pnl90` → `portfolio.pnl-summary` (20 CU/request).
3. `pnl24` → `portfolio.pnl-summary` (20 CU/request).
4. `pnl-details` → `portfolio.pnl-details` (30 CU/request).
5. `holdings` → `portfolio.holdings` (20 CU/request).
6. `first-funded` → `portfolio.first-funded` (40 CU/request).

### Wallet Style — `skill-wallet-style`

Định nghĩa: [definition.ts](../src/workflows/skill-wallet-style/definition.ts).

**Mặc định: 4 bước / tối đa 4 request / 140 CU trước retry.**

1. `pnl` → `portfolio.pnl-summary` (20 CU/request).
2. `pnl-details` → `portfolio.pnl-details` (30 CU/request).
3. `first-funded` → `portfolio.first-funded` (40 CU/request).
4. `transactions` → `portfolio.transactions` (50 CU/request).

### Wallet Analysis — `skill-wallet-analysis`

Định nghĩa: [definition.ts](../src/workflows/skill-wallet-analysis/definition.ts).

**Mặc định: 9 bước / tối đa 9 request / 240 CU trước retry.**

1. `pnl-24h` → `portfolio.pnl-summary` (20 CU/request).
2. `pnl-7d` → `portfolio.pnl-summary` (20 CU/request).
3. `pnl-30d` → `portfolio.pnl-summary` (20 CU/request).
4. `pnl-90d` → `portfolio.pnl-summary` (20 CU/request).
5. `pnl-all` → `portfolio.pnl-summary` (20 CU/request).
6. `pnl-details` → `portfolio.pnl-details` (30 CU/request).
7. `holdings` → `portfolio.holdings` (20 CU/request).
8. `first-funded` → `portfolio.first-funded` (40 CU/request).
9. `transactions` → `portfolio.transactions` (50 CU/request).

### Smart Money Profile — `skill-smart-money-profile`

Định nghĩa: [definition.ts](../src/workflows/skill-smart-money-profile/definition.ts).

**Mặc định: 7 bước / tối đa 7 request / 190 CU trước retry.**

1. `pnl7` → `portfolio.pnl-summary` (20 CU/request).
2. `pnl30` → `portfolio.pnl-summary` (20 CU/request).
3. `pnl-details` → `portfolio.pnl-details` (30 CU/request).
4. `holdings` → `portfolio.holdings` (20 CU/request).
5. `first-funded` → `portfolio.first-funded` (40 CU/request).
6. `trades` → `portfolio.trades` (10 CU/request).
7. `net-worth-history` → `portfolio.net-worth-history` (50 CU/request).

### Smart Money Leaderboard — `skill-smart-money-leaderboard`

Định nghĩa: [definition.ts](../src/workflows/skill-smart-money-leaderboard/definition.ts).

**Mặc định: 3 bước / tối đa 3 request / 70 CU trước retry.**

1. `wallet-1-7d` → `portfolio.pnl-summary` (20 CU/request).
2. `wallet-1-30d` → `portfolio.pnl-summary` (20 CU/request).
3. `wallet-1-positions` → `portfolio.pnl-details` (30 CU/request).

**10 wallet: 30 bước / tối đa 30 request / 700 CU trước retry.**

1. `wallet-1-7d` → `portfolio.pnl-summary` (20 CU/request).
2. `wallet-1-30d` → `portfolio.pnl-summary` (20 CU/request).
3. `wallet-1-positions` → `portfolio.pnl-details` (30 CU/request).
4. `wallet-2-7d` → `portfolio.pnl-summary` (20 CU/request).
5. `wallet-2-30d` → `portfolio.pnl-summary` (20 CU/request).
6. `wallet-2-positions` → `portfolio.pnl-details` (30 CU/request).
7. `wallet-3-7d` → `portfolio.pnl-summary` (20 CU/request).
8. `wallet-3-30d` → `portfolio.pnl-summary` (20 CU/request).
9. `wallet-3-positions` → `portfolio.pnl-details` (30 CU/request).
10. `wallet-4-7d` → `portfolio.pnl-summary` (20 CU/request).
11. `wallet-4-30d` → `portfolio.pnl-summary` (20 CU/request).
12. `wallet-4-positions` → `portfolio.pnl-details` (30 CU/request).
13. `wallet-5-7d` → `portfolio.pnl-summary` (20 CU/request).
14. `wallet-5-30d` → `portfolio.pnl-summary` (20 CU/request).
15. `wallet-5-positions` → `portfolio.pnl-details` (30 CU/request).
16. `wallet-6-7d` → `portfolio.pnl-summary` (20 CU/request).
17. `wallet-6-30d` → `portfolio.pnl-summary` (20 CU/request).
18. `wallet-6-positions` → `portfolio.pnl-details` (30 CU/request).
19. `wallet-7-7d` → `portfolio.pnl-summary` (20 CU/request).
20. `wallet-7-30d` → `portfolio.pnl-summary` (20 CU/request).
21. `wallet-7-positions` → `portfolio.pnl-details` (30 CU/request).
22. `wallet-8-7d` → `portfolio.pnl-summary` (20 CU/request).
23. `wallet-8-30d` → `portfolio.pnl-summary` (20 CU/request).
24. `wallet-8-positions` → `portfolio.pnl-details` (30 CU/request).
25. `wallet-9-7d` → `portfolio.pnl-summary` (20 CU/request).
26. `wallet-9-30d` → `portfolio.pnl-summary` (20 CU/request).
27. `wallet-9-positions` → `portfolio.pnl-details` (30 CU/request).
28. `wallet-10-7d` → `portfolio.pnl-summary` (20 CU/request).
29. `wallet-10-30d` → `portfolio.pnl-summary` (20 CU/request).
30. `wallet-10-positions` → `portfolio.pnl-details` (30 CU/request).

## Trường hợp đơn giản hơn

- `skill-token-security`: 1 bước, 1 request, 30 CU mặc định.
- `skill-token-stats`: 2 bước, 2 request, 30 CU mặc định.
- `skill-top-holder-analysis`: 1 bước, 1 request, 30 CU mặc định.
- `skill-top-trader-analysis`: 1 bước, 1 request, 30 CU mặc định.
- `skill-kol-signal`: 1 bước, 1 request, 30 CU mặc định.
- `skill-trending-list`: 1 bước, 1 request, 50 CU mặc định.
- `skill-kline-pattern`: 1 bước, 1 request, 100 CU mặc định.

<!-- GENERATED SKILL REVIEW END -->

## Quyết định của bạn

- Chưa review. Ghi skill ID, bước cần bỏ/tách và chế độ mặc định mong muốn tại đây.
