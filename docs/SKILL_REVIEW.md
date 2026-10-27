# Skill nhiều bước — chờ review

Đây là ghi chú cho maintainer, không nằm trong catalog công khai. Chưa thay đổi logic, thứ tự bước hoặc chế độ mặc định.

Đánh dấu khi có ít nhất 4 bước trong một chế độ được kiểm tra, hoặc có bước chọn đối tượng từ kết quả trước. Có 20/23 skill thuộc diện này. Số request tính cả fan-out; không đồng nhất số bước với số lần gọi API. Đây là ước tính trước retry, không phải hóa đơn; pricing OHLC của Token DD Score còn provisional.

Chế độ full/deep/include và wallet tùy chọn được kiểm tra riêng, không phải liệt kê mọi tổ hợp cờ. Budget và lỗi có thể khiến bước sau không chạy.

Chạy `npm run skills:review` để cập nhật phần sinh tự động. Ghi quyết định ở cuối file; lệnh giữ nguyên phần ghi chú ngoài block.

<!-- GENERATED SKILL REVIEW START -->
| Skill ID | Mặc định: bước / request / CU | Chế độ khác | Cần review |
| --- | --- | --- | --- |
| `token-research` | 3 / 3 / 78 | Full: 6 bước, 6 req, 143 CU | Giữ riêng với Token Due Diligence hay gộp thành các mức kiểm tra của một skill? |
| `token-due-diligence` | 2 / 2 / 48 | Full: 5 bước, 5 req, 113 CU | Full thêm markets, pair và profile nhưng không thêm holders. Cần giữ cách mở rộng này hay chuẩn hóa với Token Research? |
| `project-deep-report` | 8 / 8 / 253 | — | Tám bước có cần chạy mặc định hay để người dùng chọn thêm candles/activity? Mô tả phải giới hạn ở dữ liệu on-chain. |
| `wallet-analysis` | 3 / 3 / 50 | Full: 6 bước, 10 req, 224 CU | Một cửa sổ PnL, Full thêm position và kiểm tra token. Tên đang trùng với skill-wallet-analysis đa cửa sổ; cần quyết định tên/phạm vi. |
| `smart-money-profile` | 5 / 13 / 235 | Full: 6 bước, 16 req, 325 CU; Có wallet: 4 bước, 4 req, 70 CU | Có thể discovery nhiều wallet nếu bỏ address. Có nên tách thao tác discovery khỏi profile một wallet? |
| `risk-warning` | 3 / 3 / 78 | Full: 7 bước, 7 req, 198 CU | Full đọc thêm profile, positions và hai timeline. Có cần tất cả cho một lần review rủi ro? |
| `early-project-screening` | 4 / 10 / 264 | — | Cần duyệt tiêu chí chọn token và việc không tự thay token bị loại bằng token khác. Listing time khác creation time. |
| `daily-brief` | 4 / 6 / 146 | Full: 7 bước, 9 req, 236 CU; Có wallet: 5 bước, 7 req, 166 CU | Full gộp dữ liệu chain, smart money, launches; wallet là nhánh tùy chọn. Có nên tách phần wallet khỏi daily brief? |
| `market-opportunities` | 3 / 7 / 169 | Full: 5 bước, 13 req, 289 CU | Chọn theo volume từ một trang, rồi enrich. Cần duyệt giới hạn số token và sự khác biệt với market-shortlist. |
| `market-shortlist` | 3 / 11 / 265 | — | Chọn theo thứ tự provider thay vì xếp lại theo volume. Có nên gộp với market-opportunities bằng tùy chọn chọn mẫu? |
| `skill-token-dd-score` | 7 / 7 / 181 | Standard DD: 2 bước, 2 req, 51 CU | Advanced mặc định có bảy bước; Standard có hai. OHLC 30 CU còn provisional. Cần duyệt chế độ mặc định và bằng chứng tối thiểu trước khi chấm điểm. |
| `skill-smart-wallets` | 2 / 4 / 110 | Standard discovery: 3 bước, 7 req, 170 CU; Deep: 5 bước, 13 req, 320 CU | Token → traders → wallet → PnL/positions. Cần duyệt dedup, số wallet tối đa, và Fast/Standard/Deep. Không cộng PnL theo token thành PnL toàn ví. |
| `skill-token-dd` | 3 / 3 / 58 | Đủ include: 6 bước, 6 req, 268 CU | Các include mở thêm holders, profile, liquidity. Có nên gộp với kiểm tra token khác? Không phát điểm an toàn tổng hợp từ dữ liệu thiếu. |
| `skill-contract-dd` | 4 / 4 / 178 | — | Candles có cần đi cùng kiểm tra contract mặc định? skip-kline giảm một bước; giá không chứng minh contract an toàn. |
| `skill-rugcheck-audit` | 5 / 5 / 258 | — | Tên có thể bị hiểu là tích hợp RugCheck.org dù chỉ dùng Birdeye. Cần duyệt tên và phạm vi kết luận. |
| `skill-wallet-score` | 6 / 6 / 150 | — | Score cần 30d/90d và positions tương ứng. Cần duyệt nhu cầu holdings/first-funded mặc định; thiếu dữ liệu phải giữ điểm unavailable. |
| `skill-wallet-style` | 4 / 4 / 140 | — | Phân loại dùng PnL, positions; first-funded và transactions có thể bỏ. Cần duyệt phần nào thật sự cần cho phân loại. |
| `skill-wallet-analysis` | 9 / 9 / 240 | — | Mặc định năm cửa sổ PnL và bốn bước bổ sung. Có nên mặc định ít cửa sổ hơn? Không cộng các kỳ chồng lấn. |
| `skill-smart-money-profile` | 7 / 7 / 190 | — | Nhiều bằng chứng cho một wallet: PnL, positions, holdings, funding, trades, net worth. Cần duyệt phần nào nên tùy chọn và tên đang gần smart-money-profile. |
| `skill-smart-money-leaderboard` | 3 / 3 / 70 | 10 wallet: 30 bước, 30 req, 700 CU | Mỗi wallet cần ba request, tối đa 10 wallet. Cần duyệt giới hạn, scope PnL thống nhất và cách giữ wallet thiếu dữ liệu ngoài bảng xếp hạng. |

## Chi tiết thực thi để review

### Token Research — `token-research`

Định nghĩa: [definition.ts](../src/workflows/token-research/definition.ts).

**Mặc định: 3 bước / tối đa 3 request / 78 CU trước retry.**

1. `overview` → `token.overview` (18 CU/request).
2. `security` → `token.security` (30 CU/request).
3. `holders` → `token.holders` (30 CU/request).

**Full: 6 bước / tối đa 6 request / 143 CU trước retry.**

1. `overview` → `token.overview` (18 CU/request).
2. `security` → `token.security` (30 CU/request).
3. `holders` → `token.holders` (30 CU/request).
4. `markets` → `token.markets` (20 CU/request).
5. `pair` → `market.pair-overview` (15 CU/request; lấy tối đa 1 pair từ `markets`, giữ thứ tự provider).
6. `profile` → `token.holder-profile` (30 CU/request).

### Token Due Diligence — `token-due-diligence`

Định nghĩa: [definition.ts](../src/workflows/token-due-diligence/definition.ts).

**Mặc định: 2 bước / tối đa 2 request / 48 CU trước retry.**

1. `overview` → `token.overview` (18 CU/request).
2. `security` → `token.security` (30 CU/request).

**Full: 5 bước / tối đa 5 request / 113 CU trước retry.**

1. `overview` → `token.overview` (18 CU/request).
2. `security` → `token.security` (30 CU/request).
3. `markets` → `token.markets` (20 CU/request).
4. `pair` → `market.pair-overview` (15 CU/request; lấy tối đa 1 pair từ `markets`, giữ thứ tự provider).
5. `profile` → `token.holder-profile` (30 CU/request).

### Project Deep Report — `project-deep-report`

Định nghĩa: [definition.ts](../src/workflows/project-deep-report/definition.ts).

**Mặc định: 8 bước / tối đa 8 request / 253 CU trước retry.**

1. `overview` → `token.overview` (18 CU/request).
2. `security` → `token.security` (30 CU/request).
3. `holders` → `token.holders` (30 CU/request).
4. `markets` → `token.markets` (20 CU/request).
5. `pair` → `market.pair-overview` (15 CU/request; lấy tối đa 1 pair từ `markets`, giữ thứ tự provider).
6. `profile` → `token.holder-profile` (30 CU/request).
7. `candles` → `market.ohlcv` (100 CU/request).
8. `activity` → `token.trade-data` (10 CU/request).

### Wallet Analysis — `wallet-analysis`

Định nghĩa: [definition.ts](../src/workflows/wallet-analysis/definition.ts).

**Mặc định: 3 bước / tối đa 3 request / 50 CU trước retry.**

1. `holdings` → `portfolio.holdings` (20 CU/request).
2. `pnl` → `portfolio.pnl-summary` (20 CU/request).
3. `trades` → `portfolio.trades` (10 CU/request).

**Full: 6 bước / tối đa 10 request / 224 CU trước retry.**

1. `holdings` → `portfolio.holdings` (20 CU/request).
2. `pnl` → `portfolio.pnl-summary` (20 CU/request).
3. `trades` → `portfolio.trades` (10 CU/request).
4. `pnl-details` → `portfolio.pnl-details` (30 CU/request).
5. `security` → `token.security` (30 CU/request; lấy tối đa 3 token từ `holdings`, giữ thứ tự provider).
6. `overview` → `token.overview` (18 CU/request; lấy tối đa 3 token từ `holdings`, giữ thứ tự provider).

### Smart Money Profile — `smart-money-profile`

Định nghĩa: [definition.ts](../src/workflows/smart-money-profile/definition.ts).

**Mặc định: 5 bước / tối đa 13 request / 235 CU trước retry.**

1. `wallets` → `market.trader-ranking` (25 CU/request).
2. `holdings` → `portfolio.holdings` (20 CU/request; lấy tối đa 3 wallet từ `wallets`, giữ thứ tự provider).
3. `pnl7` → `portfolio.pnl-summary` (20 CU/request; lấy tối đa 3 wallet từ `wallets`, giữ thứ tự provider).
4. `pnl30` → `portfolio.pnl-summary` (20 CU/request; lấy tối đa 3 wallet từ `wallets`, giữ thứ tự provider).
5. `trades` → `portfolio.trades` (10 CU/request; lấy tối đa 3 wallet từ `wallets`, giữ thứ tự provider).

**Full: 6 bước / tối đa 16 request / 325 CU trước retry.**

1. `wallets` → `market.trader-ranking` (25 CU/request).
2. `holdings` → `portfolio.holdings` (20 CU/request; lấy tối đa 3 wallet từ `wallets`, giữ thứ tự provider).
3. `pnl7` → `portfolio.pnl-summary` (20 CU/request; lấy tối đa 3 wallet từ `wallets`, giữ thứ tự provider).
4. `pnl30` → `portfolio.pnl-summary` (20 CU/request; lấy tối đa 3 wallet từ `wallets`, giữ thứ tự provider).
5. `trades` → `portfolio.trades` (10 CU/request; lấy tối đa 3 wallet từ `wallets`, giữ thứ tự provider).
6. `pnl-details` → `portfolio.pnl-details` (30 CU/request; lấy tối đa 3 wallet từ `wallets`, giữ thứ tự provider).

**Có wallet: 4 bước / tối đa 4 request / 70 CU trước retry.**

1. `holdings` → `portfolio.holdings` (20 CU/request).
2. `pnl7` → `portfolio.pnl-summary` (20 CU/request).
3. `pnl30` → `portfolio.pnl-summary` (20 CU/request).
4. `trades` → `portfolio.trades` (10 CU/request).

### Risk Warning — `risk-warning`

Định nghĩa: [definition.ts](../src/workflows/risk-warning/definition.ts).

**Mặc định: 3 bước / tối đa 3 request / 78 CU trước retry.**

1. `security` → `token.security` (30 CU/request).
2. `overview` → `token.overview` (18 CU/request).
3. `holders` → `token.holders` (30 CU/request).

**Full: 7 bước / tối đa 7 request / 198 CU trước retry.**

1. `security` → `token.security` (30 CU/request).
2. `overview` → `token.overview` (18 CU/request).
3. `holders` → `token.holders` (30 CU/request).
4. `profile` → `token.holder-profile` (30 CU/request).
5. `positions` → `token.holder-positions` (30 CU/request).
6. `timeline` → `token.tags-tracker` (30 CU/request).
7. `timeline-wallets` → `token.tags-tracker-details` (30 CU/request).

### Early Project Screening — `early-project-screening`

Định nghĩa: [definition.ts](../src/workflows/early-project-screening/definition.ts).

**Mặc định: 4 bước / tối đa 10 request / 264 CU trước retry.**

1. `candidates` → `market.meme-list` (30 CU/request).
2. `security` → `token.security` (30 CU/request; lấy tối đa 3 token từ `candidates`, giữ thứ tự provider).
3. `overview` → `token.overview` (18 CU/request; lấy tối đa 3 token từ `candidates`, giữ thứ tự provider).
4. `profiles` → `token.holder-profile` (30 CU/request; lấy tối đa 3 token từ `candidates`, giữ thứ tự provider).

### Daily Brief — `daily-brief`

Định nghĩa: [definition.ts](../src/workflows/daily-brief/definition.ts).

**Mặc định: 4 bước / tối đa 6 request / 146 CU trước retry.**

1. `trending` → `market.trending` (25 CU/request).
2. `daily` → `market.trending` (25 CU/request).
3. `security` → `token.security` (30 CU/request; lấy tối đa 2 token từ `trending`, `daily`, xếp theo volume24hUSD).
4. `overview` → `token.overview` (18 CU/request; lấy tối đa 2 token từ `trending`, `daily`, xếp theo volume24hUSD).

**Full: 7 bước / tối đa 9 request / 236 CU trước retry.**

1. `trending` → `market.trending` (25 CU/request).
2. `daily` → `market.trending` (25 CU/request).
3. `chain` → `market.chain-metrics` (40 CU/request).
4. `smart-tokens` → `market.smart-money` (20 CU/request).
5. `launches` → `market.meme-list` (30 CU/request).
6. `security` → `token.security` (30 CU/request; lấy tối đa 2 token từ `trending`, `daily`, xếp theo volume24hUSD).
7. `overview` → `token.overview` (18 CU/request; lấy tối đa 2 token từ `trending`, `daily`, xếp theo volume24hUSD).

**Có wallet: 5 bước / tối đa 7 request / 166 CU trước retry.**

1. `trending` → `market.trending` (25 CU/request).
2. `daily` → `market.trending` (25 CU/request).
3. `holdings` → `portfolio.holdings` (20 CU/request).
4. `security` → `token.security` (30 CU/request; lấy tối đa 2 token từ `trending`, `daily`, xếp theo volume24hUSD).
5. `overview` → `token.overview` (18 CU/request; lấy tối đa 2 token từ `trending`, `daily`, xếp theo volume24hUSD).

### Market Opportunities — `market-opportunities`

Định nghĩa: [definition.ts](../src/workflows/market-opportunities/definition.ts).

**Mặc định: 3 bước / tối đa 7 request / 169 CU trước retry.**

1. `trending` → `market.trending` (25 CU/request).
2. `security` → `token.security` (30 CU/request; lấy tối đa 3 token từ `trending`, xếp theo volume24hUSD).
3. `overview` → `token.overview` (18 CU/request; lấy tối đa 3 token từ `trending`, xếp theo volume24hUSD).

**Full: 5 bước / tối đa 13 request / 289 CU trước retry.**

1. `trending` → `market.trending` (25 CU/request).
2. `security` → `token.security` (30 CU/request; lấy tối đa 3 token từ `trending`, xếp theo volume24hUSD).
3. `overview` → `token.overview` (18 CU/request; lấy tối đa 3 token từ `trending`, xếp theo volume24hUSD).
4. `flow` → `token.money-flow` (10 CU/request; lấy tối đa 3 token từ `trending`, xếp theo volume24hUSD).
5. `profiles` → `token.holder-profile` (30 CU/request; lấy tối đa 3 token từ `trending`, xếp theo volume24hUSD).

### Market Shortlist — `market-shortlist`

Định nghĩa: [definition.ts](../src/workflows/market-shortlist/definition.ts).

**Mặc định: 3 bước / tối đa 11 request / 265 CU trước retry.**

1. `trending` → `market.trending` (25 CU/request).
2. `security` → `token.security` (30 CU/request; lấy tối đa 5 token từ `trending`, giữ thứ tự provider).
3. `overview` → `token.overview` (18 CU/request; lấy tối đa 5 token từ `trending`, giữ thứ tự provider).

### Token DD Score · Advanced — `skill-token-dd-score`

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

### Token DD — `skill-token-dd`

Định nghĩa: [definition.ts](../src/workflows/skill-token-dd/definition.ts).

**Mặc định: 3 bước / tối đa 3 request / 58 CU trước retry.**

1. `overview` → `token.overview` (18 CU/request).
2. `security` → `token.security` (30 CU/request).
3. `flow` → `token.money-flow` (10 CU/request).

**Đủ include: 6 bước / tối đa 6 request / 268 CU trước retry.**

1. `overview` → `token.overview` (18 CU/request).
2. `security` → `token.security` (30 CU/request).
3. `flow` → `token.money-flow` (10 CU/request).
4. `holders` → `token.holders` (30 CU/request).
5. `profile` → `token.holder-profile` (30 CU/request).
6. `liquidity` → `token.liquidity-history` (150 CU/request).

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

- `wallet-exposure`: 1 bước, 1 request, 20 CU mặc định.
- `skill-trending-list`: 1 bước, 1 request, 50 CU mặc định.
- `skill-kline-pattern`: 1 bước, 1 request, 100 CU mặc định.

<!-- GENERATED SKILL REVIEW END -->

## Quyết định của bạn

- Chưa review. Ghi skill ID, bước cần bỏ/tách và chế độ mặc định mong muốn tại đây.
