# Đối chiếu workflow GMGN → Birdeye

**Ghi chú phiên bản:** đây là bản đối chiếu tại mốc CLI 0.1.0; các cột “Cần wrapper” bên dưới là trạng thái lúc lập kế hoạch. Bản 0.2.0 đã triển khai 21 wrappers và bộ chạy workflow; xem [hướng dẫn hiện hành](../workflows/README.md). Các giới hạn ngữ nghĩa/chain của API vẫn áp dụng.

Ngày đối chiếu: 2026-10-09. Mục tiêu là giữ **câu hỏi mà workflow trả lời**, rồi chọn dữ liệu Birdeye phù hợp; tên endpoint giống nhau chưa đủ để coi là tương đương.

Nguồn GMGN và mục đích từng workflow: [bản nghiên cứu GMGN](gmgn-workflows.md). Bộ hướng dẫn áp dụng: [workflows Birdeye](../workflows/README.md).

Nguồn Birdeye là repo local `bds-docs-mintlify`, commit `b34378ea9a1aad2c22934903ded124cd84729d3f`: [OpenAPI](../../../bds-docs-mintlify/openapi/data/openapi_docs.json), các trang endpoint liên kết bên dưới, [CU catalog](../../../bds-docs-mintlify/resources/compute-unit-cost.mdx). Link tới repo docs bên cạnh chỉ dùng được khi giữ cấu trúc workspace hiện tại. Đây là đối chiếu tài liệu, chưa xác nhận bằng request live hay entitlement của API key.

## Điểm chung có thể giữ lại

Workflow nghiên cứu đều đi từ xác định token/ví → lấy snapshot → xem thanh khoản, giao dịch, phân phối sở hữu hoặc hiệu suất → kiểm tra bằng chứng mâu thuẫn → đưa kết luận có điều kiện. Khác biệt giữa các workflow nằm ở nguồn ứng viên, độ sâu và đầu ra. Vì vậy nên tái sử dụng các bước lấy dữ liệu, thay vì viết chín bộ gọi API riêng.

Với Birdeye, mỗi bước thêm chain, thời gian, coverage, CU và điều kiện dừng. Hành động tiếp theo là nghiên cứu sâu hơn, theo dõi hoặc loại khỏi tiêu chí người dùng; đặt lệnh cần một hệ thống execution riêng. Các Data API được khảo sát không cung cấp luồng ký swap, tạo order và kiểm tra order như GMGN. [Nguồn: OpenAPI local; nghiên cứu GMGN ở trên.]

## Mức tương đương và trạng thái CLI

**Cùng mục đích** nghĩa là đủ loại dữ liệu để trả lời câu hỏi đó, không đảm bảo giá trị, classification hay ranking trùng GMGN. **Một phần** nghĩa là phải thu hẹp kết luận. **Chưa có** nghĩa là chưa thấy dữ liệu đáp ứng trong các nguồn khảo sát.

`Có` trong cột CLI là operation hiện hữu trong [catalog](../../src/catalog.ts). `Cần wrapper` là API có docs nhưng CLI chưa gọi được; các tên operation mới dưới đây là đề xuất, không phải command để chạy.

| Mục đích GMGN | Nguồn Birdeye và dữ liệu dùng | Mức tương đương / giới hạn | CLI 0.1.0 |
| --- | --- | --- | --- |
| Xác nhận token, giá, market cap, volume, thanh khoản | [Overview](../../../bds-docs-mintlify/data-api/stats/get-defi-token-overview.mdx) `GET /defi/token_overview`; [search](../../../bds-docs-mintlify/data-api/search-utils/get-defi-v3-search.mdx) `GET /defi/v3/search` để tìm ứng viên theo tên | Cùng mục đích; phải xác nhận contract + chain, symbol không duy nhất | Overview có; search cần wrapper |
| Kiểm tra security | [Security](../../../bds-docs-mintlify/data-api/security/get-defi-token-security.mdx) `GET /defi/token_security`: creator, concentration, freeze/transfer controls theo chain | Một phần: schema Solana và EVM khác nhau; honeypot, LP-lock hay tax của EVM không được tự gán cho Solana; không có GMGN rug score tương đương đã xác nhận | Có |
| Chọn pool, xem depth và hoạt động | [Markets](../../../bds-docs-mintlify/data-api/tokenmarket-list/get-defi-v2-markets.mdx) `GET /defi/v2/markets` → [pair overview](../../../bds-docs-mintlify/data-api/stats/get-defi-v3-pair-overview-single.mdx) `GET /defi/v3/pair/overview/single` | Cùng mục đích tìm venue, chỉ một phần cho khả năng thực thi. Thanh khoản không chứng minh LP lock hay slippage của một order | Cần wrapper |
| Holder concentration | [Holder](../../../bds-docs-mintlify/data-api/holder/get-defi-v3-token-holder.mdx) `GET /defi/v3/token/holder`; [distribution](../../../bds-docs-mintlify/data-api/holder/get-holder-v1-distribution.mdx) `GET /holder/v1/distribution` | Cùng mục đích khi giữ cùng wallet/token-account basis và mẫu số supply | Holder có; distribution cần wrapper |
| Dev, sniper, insider, bundler, smart-money, KOL holdings | [Holder profile](../../../bds-docs-mintlify/data-api/holder/get-token-v1-holder-profile.mdx) `GET /token/v1/holder-profile` → [positions](../../../bds-docs-mintlify/data-api/holder/get-token-v1-holder-positions.mdx) `GET /token/v1/holder-positions` | Cùng mục đích cohort analysis trên Solana; nhãn Birdeye không phải nhãn GMGN. Profile cho tổng cohort; positions cho bằng chứng từng ví | Cần wrapper |
| Ai mua sớm, còn giữ hay đã thoát | [First buyers](../../../bds-docs-mintlify/data-api/holder/get-token-v1-first-buyers.mdx) `GET /token/v1/first-buyers` | Cùng mục đích đối với tối đa 1.000 người mua đầu; `page_summary` chỉ mô tả trang; first buyer không tự đồng nghĩa insider | Cần wrapper |
| Dev/KOL/smart money mua bán lúc nào | [Tags tracker](../../../bds-docs-mintlify/data-api/holder/get-token-v1-wallet-tags-tracker.mdx) `GET /token/v1/wallet-tags-tracker` và `/details` | Cùng mục đích timeline theo token; không phải feed mọi token toàn chain. Tracker chỉ nhận `dev,sniper,smart_trader,kol` | Cần wrapper |
| Tìm token có smart money tham gia | [Smart-money list](../../../bds-docs-mintlify/data-api/smart-money/get-smart-money-v1-token-list.mdx) `GET /smart-money/v1/token/list`: `net_flow`, `smart_traders_no`, buy/sell USD | Cùng mục đích discovery; đây là danh sách **token**, không phải leaderboard ví | Cần wrapper |
| Mua ròng/bán ròng theo nhóm ví | [Money flow](../../../bds-docs-mintlify/data-api/smart-money/post-defi-v3-token-money-flow.mdx) `POST /defi/v3/token/money-flow`: buy/sell values, counts, unique traders | Cùng mục đích cho cohort `smart_money,kol,whales` hoặc ví chỉ định; không chứng minh ý định người giao dịch | Cần wrapper |
| Trending, momentum, chart | [Trending](../../../bds-docs-mintlify/data-api/creation-trending/get-defi-token-trending.mdx), [OHLCV V3](../../../bds-docs-mintlify/data-api/price-ohlcv/get-defi-v3-ohlcv.mdx), [trade data](../../../bds-docs-mintlify/data-api/stats/get-defi-v3-token-trade-data-single.mdx) | Cùng mục đích nhưng ranking/window khác. CLI trending chỉ `1h,4h,24h`; OHLCV ngắn không biến thành trending `1m` | Trending/OHLCV có; trade data cần wrapper |
| Trenches / token mới / graduation | [New listing](../../../bds-docs-mintlify/data-api/tokenmarket-list/get-defi-v2-tokens-new-listing.mdx), [meme list](../../../bds-docs-mintlify/data-api/meme/get-defi-v3-token-meme-list.mdx), [meme detail](../../../bds-docs-mintlify/data-api/meme/get-defi-v3-token-meme-detail-single.mdx) | Cùng mục đích discovery với source, creation time, graduated/progress filters; listing time khác creation time; venue coverage có mốc bắt đầu | Cần wrapper |
| Holdings / exposure ví | [Current net worth](../../../bds-docs-mintlify/data-api/wallet-networth-pnl/get-wallet-v2-current-net-worth.mdx) `GET /wallet/v2/current-net-worth` | Cùng mục đích snapshot Solana, một trang; low-liquidity assets có thể bị lọc. Không suy PnL từ snapshot | Có |
| Hiệu suất, win rate, realized/unrealized PnL | [PnL summary](../../../bds-docs-mintlify/data-api/wallet-networth-pnl/get-wallet-v2-pnl-summary.mdx), [PnL details](../../../bds-docs-mintlify/data-api/wallet-networth-pnl/post-wallet-v2-pnl-details.mdx), [trader trades](../../../bds-docs-mintlify/data-api/transactions/get-trader-txs-seek-by-time.mdx) | Cùng mục đích với duration/accounting cố định; protocol backfill có thể thiếu. Không có copy-trade ROI thực tế nếu thiếu mô hình execution | Cần wrapper |
| Tìm ví có hiệu suất tốt | [Gainers/losers](../../../bds-docs-mintlify/data-api/wallet-networth-pnl/get-trader-gainers-losers.mdx) `GET /trader/gainers-losers`; [top traders](../../../bds-docs-mintlify/data-api/wallet-networth-pnl/get-defi-v2-tokens-top-traders.mdx) theo token | Cùng mục đích discovery theo realized PnL/trading metrics. [Wallet leaderboard](../../../bds-docs-mintlify/data-api/wallet-networth-pnl/get-wallet-v2-leaderboard.mdx) xếp theo tài sản nên dùng cho whale discovery, không thay bảng hiệu suất | Cần wrapper |
| Báo cáo hoạt động toàn chain | [Blockchain metrics](../../../bds-docs-mintlify/data-api/dex-protocol/get-market-v1-blockchain-metrics.mdx) `GET /market/v1/blockchain-metrics` | Cùng mục đích tổng hợp ngày (`1D`); phân biệt volume trong kỳ và stablecoin market cap cuối kỳ | Cần wrapper |
| Theo dõi ví chỉ định | [Trader trades](../../../bds-docs-mintlify/data-api/transactions/get-trader-txs-seek-by-time.mdx), [wallet WebSocket](../../../bds-docs-mintlify/websockets/wallet-transactions.mdx) | Cùng mục đích quan sát. Watchlist phải tự lưu local, token cohort tracker không thay feed ví xuyên token | Cần wrapper + scheduler/subscription |
| Social sentiment, X influence, team/funding/roadmap | Metadata/social URLs từ token data chỉ cung cấp điểm bắt đầu | Chưa có dữ liệu tương đương đủ để xác nhận nội dung social, chất lượng team hay funding; cần nguồn bổ sung được dẫn riêng | Chưa có |
| Swap, limit, TP/SL, order status | Không thấy trong Data OpenAPI khảo sát | Chưa có; workflow kết thúc ở research/watchlist/handoff | Chưa có |

## Những khác biệt phải giữ trong model

1. **Nhãn có nguồn riêng.** Birdeye định nghĩa `smart_trader` là ví không bị phân loại bot, thuộc nhóm top realized PnL 90 ngày và realized PnL trên $10.000. `sniper` dùng first-trade slot + 5; `insider` dựa trên transfer trực tiếp từ Chef wallet. Giữ label provider và definition version; không đổi tên `insider` thành GMGN `rat trader` rồi áp cùng ngưỡng. [Holder profile](../../../bds-docs-mintlify/data-api/holder/get-token-v1-holder-profile.mdx).
2. **Cohort chồng lặp.** Tracker `tags` có thể đếm cùng ví nhiều lần; chỉ `tag_combinations` là các tập rời nhau. `top_10_holder` là chiều riêng. `wallet_buy_count` là ví phân biệt, `tx_buy_count` là cặp wallet/transaction. Profile không nên cộng các tag thành total nếu chưa có union wallet IDs. [Tracker](../../../bds-docs-mintlify/data-api/holder/get-token-v1-wallet-tags-tracker.mdx).
3. **Tag vocabulary không thống nhất giữa endpoint.** Holder profile có `smart_trader`; money-flow nhận `smart_money`; tracker không nhận `bundler/insider` dù profile có. `all` của money-flow là tất cả **tag được hỗ trợ**, không phải toàn bộ trader thị trường. [OpenAPI](../../../bds-docs-mintlify/openapi/data/openapi_docs.json), [money flow](../../../bds-docs-mintlify/data-api/smart-money/post-defi-v3-token-money-flow.mdx).
4. **PnL có mẫu số và phương pháp.** Win rate summary chỉ tính token fully realized theo usage note. Cố định `duration`, `position_scope`, `pnl_method`, đồng thời ghi backfill gaps. Văn bản ghi `netcash`, parameter GET enum ghi `net_cash`; chọn `wac` cho recipe đầu, kiểm thử contract trước khi bật lựa chọn còn lại. POST details có schema lồng bất thường ở `pnl_method`; cần adapter/fixture xác nhận. [PnL summary](../../../bds-docs-mintlify/data-api/wallet-networth-pnl/get-wallet-v2-pnl-summary.mdx), [OpenAPI](../../../bds-docs-mintlify/openapi/data/openapi_docs.json).
5. **Chain quyết định khả dụng.** Exit-liquidity single/multiple là **Base-only**, không dùng cho workflow Solana. Solana dùng token/pair liquidity với nhãn phù hợp; chưa đủ để đưa executable price/slippage. Tracker còn loại một số token lớn như wSOL, USDC, USDT, BONK. [Exit liquidity](../../../bds-docs-mintlify/data-api/stats/get-defi-v3-token-exit-liquidity.mdx), [tracker](../../../bds-docs-mintlify/data-api/holder/get-token-v1-wallet-tags-tracker.mdx).
6. **Window không thay thế lẫn nhau.** Profile hiện chỉ `1h`; smart-money ranking là `1d/7d/30d`; money-flow có nhiều frame tới `24h`. Có thể trình bày cạnh nhau với nhãn, không tính ratio hoặc chênh lệch như cùng kỳ. [OpenAPI](../../../bds-docs-mintlify/openapi/data/openapi_docs.json).
7. **Short có giới hạn hiện tại.** `case ... --short` giữ metrics nhưng bỏ datasets, trong khi metrics hiện chưa chứa holder rows và mọi security field. Dùng command nguyên tử `token security --short`, `token holders --short`, hoặc giữ full case JSON nếu kết luận cần các trường này. Overview short bỏ social metadata. Không gọi lại cùng API chỉ để đổi cách in. [Output](../../src/output.ts), [analysis](../../src/analysis.ts).

## Registry đề xuất và CU

Đây là đầu vào cho lần triển khai tiếp theo, **không phải những lệnh đã có**. Tất cả request mới phải đi qua runner/ledger thay vì gọi HTTP bên ngoài để tránh bỏ sót CU. Số dưới đây là một request, một trang, chưa retry, theo snapshot docs nêu đầu tài liệu.

| Operation đề xuất | HTTP endpoint | CU docs |
| --- | --- | ---: |
| `token.search` | GET `/defi/v3/search` | 3 |
| `token.markets` | GET `/defi/v2/markets` | 20 |
| `market.pair-overview` | GET `/defi/v3/pair/overview/single` | 15 |
| `token.trade-data` | GET `/defi/v3/token/trade-data/single` | 10 |
| `token.holder-profile` | GET `/token/v1/holder-profile` | 25 |
| `token.holder-positions` | GET `/token/v1/holder-positions` | 25 |
| `token.holder-distribution` | GET `/holder/v1/distribution` | 30 |
| `token.first-buyers` | GET `/token/v1/first-buyers` | 25 |
| `token.tags-tracker` / `token.tags-tracker-details` | GET `/token/v1/wallet-tags-tracker` / `/details` | 30 mỗi endpoint |
| `token.money-flow` | POST `/defi/v3/token/money-flow` | 10 |
| `market.smart-money` | GET `/smart-money/v1/token/list` | 20 |
| `market.new-listings` | GET `/defi/v2/tokens/new_listing` | 20 |
| `market.meme-list` | GET `/defi/v3/token/meme/list` | 30 |
| `token.meme-detail` | GET `/defi/v3/token/meme/detail/single` | 15 |
| `market.chain-metrics` | GET `/market/v1/blockchain-metrics` | 40 |
| `portfolio.pnl-summary` | GET `/wallet/v2/pnl/summary` | 20 |
| `portfolio.pnl-details` | POST `/wallet/v2/pnl/details` | 30 |
| `portfolio.trades` | GET `/trader/txs/seek_by_time` | 10 |
| `market.trader-ranking` | GET `/trader/gainers-losers` | 25 |
| `token.top-traders` | GET `/defi/v2/tokens/top_traders` | 25 |

Nguồn: [CU catalog](../../../bds-docs-mintlify/resources/compute-unit-cost.mdx). Với OHLCV, CLI hiện reserve 100 CU theo [catalog code](../../src/catalog.ts); docs có tier theo số candle. Batch cần công thức riêng, không nhân số token với giá single. WebSocket tính theo bytes/CUPB, chưa phù hợp với ledger REST hiện tại; thêm đo bytes và giới hạn session trước khi bật watch liên tục.

## Thứ tự triển khai để mở workflow

1. **Research/risk:** markets, pair overview, holder-profile/positions/distribution, first-buyers, trade-data. Mở được phần lớn token research, deep report và risk warning.
2. **Wallet/smart money:** pnl-summary/details, trader trades/ranking, top-traders, money-flow và smart-money list. Dùng adapter giữ accounting và endpoint-specific tag enum.
3. **Discovery/daily:** new-listings, meme list/detail, chain metrics, tags tracker. Thêm snapshot store trước khi xuất nhận định thay đổi theo thời gian.
4. **Continuous monitoring:** scheduler/WebSocket, cursors/dedup, byte accounting và stop policy; giữ execution ngoài phạm vi Data CLI.

Mỗi wrapper hoàn tất khi có schema request/response, chain/plan constraints, CU rule, fixture kiểm tra đơn vị/null/pagination, short projection giữ đủ evidence và đăng ký vào `capabilities`. Agent/interface chỉ được gọi operation đã đăng ký. Các workflow dự thảo không tự mở rộng tool allowlist.
