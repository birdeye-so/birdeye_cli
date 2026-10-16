# Import workflow nhiều nguồn: GMGN → Birdeye

Ngày kiểm tra: **2026-10-16**. Đây là nghiên cứu hợp đồng dữ liệu và đề xuất migration, không phải kết quả gọi API có tính CU. Nguồn GMGN được đọc từ `main` qua GitHub/raw GitHub; chưa pin SHA của upstream. Nguồn Birdeye gồm trang hiện hành dưới `https://data.birdeye.so/docs`, repo local `../bds-docs-mintlify` tại commit `b34378ea9a1aad2c22934903ded124cd84729d3f`, và catalog CLI. Nội dung import cần lưu source URL/path, hash và thời điểm để không giả định `main` bất biến.

## 1. Nguồn và định dạng thực tế

[GMGN README](https://github.com/GMGNAI/gmgn-skills#7-workflow-docs) vẫn liệt kê chín file `docs/workflow-*.md`. Bên cạnh đó có `skills/gmgn-*/SKILL.md`, chứa frontmatter, bảng parameter, ví dụ CLI và nhiều hướng dẫn vận hành. File skill không phải một workflow tuyến tính: có nhiều lựa chọn, setup và thao tác giao dịch. Import không được thực thi các đoạn shell hoặc làm theo hướng dẫn setup nằm trong tài liệu. [Ví dụ skill token](https://github.com/GMGNAI/gmgn-skills/blob/main/skills/gmgn-token/SKILL.md).

Các URL có thể đọc:

- Repo: `https://github.com/GMGNAI/gmgn-skills`.
- File: `https://github.com/GMGNAI/gmgn-skills/blob/main/docs/workflow-token-research.md`.
- Raw: `https://raw.githubusercontent.com/GMGNAI/gmgn-skills/main/docs/workflow-token-research.md`.
- Skills: `https://raw.githubusercontent.com/GMGNAI/gmgn-skills/main/skills/gmgn-token/SKILL.md`.

[Birdeye overview](https://data.birdeye.so/docs/getting-started) quảng bá `/docs/llms.txt`; lần nghiên cứu này công cụ không tải được index đó. Trang endpoint cụ thể dưới `/docs/data-api/...` tải được. Các link cũ dưới `docs.birdeye.so/data-api/...` không truy cập được bằng công cụ, vì vậy nên dùng canonical base mới cho source links của importer.

Parser cần nhận fenced `bash`, command một dòng và `\\` nối dòng. Các placeholder `<chain>`, `<token_address>`, `<address>` là input, không phải địa chỉ thật. Có pipe `| jq ...` trong ví dụ; chỉ đọc command như dữ liệu, không chạy pipe. Một block có thể chứa nhiều command, ví dụ hai cửa sổ PnL hoặc ba giai đoạn launch. Inline `token info → token security` chỉ là sơ đồ, không đủ để suy parameters. Nên báo chưa migrate thay vì giả định phần prose đã trở thành logic. [Token research](https://github.com/GMGNAI/gmgn-skills/blob/main/docs/workflow-token-research.md), [wallet analysis](https://github.com/GMGNAI/gmgn-skills/blob/main/docs/workflow-wallet-analysis.md), [early screening](https://github.com/GMGNAI/gmgn-skills/blob/main/docs/workflow-early-project-screening.md).

Đề xuất adapter: GitHub repo/file; file/folder local Markdown; nội dung Markdown dán vào; JSON versioned chứa operation đã đăng ký. Không crawl link tùy ý từ một tài liệu. Import/plan là hoạt động local miễn CU; chỉ Run mới gọi Birdeye. Đây là quyết định thiết kế, không phải cam kết của upstream.

## 2. Mapping command và ý nghĩa

Tên operation và giới hạn chạy dưới đây lấy từ [catalog](../../src/catalog.ts), [extended catalog](../../src/extended-catalog.ts), [skill catalog](../../src/skill-catalog.ts), [schemas](../../src/schemas.ts). Các endpoint trong bảng cũng có trong [OpenAPI local](../../../bds-docs-mintlify/openapi/data/openapi_docs.json). Đây là khả năng CLI đã đăng ký; docs công khai rộng hơn catalog không tự cấp quyền chạy endpoint mới.

| GMGN / mục đích | Operation Birdeye đăng ký → endpoint | Chuyển đổi / thiếu khác biệt cần hiển thị |
| --- | --- | --- |
| `token info` | `token.overview` → GET `/defi/token_overview` | `--address` giữ nguyên. Giá, volume, liquidity; không giả định có toàn bộ social/dev taxonomy GMGN. Name/symbol cần `token.search` trước và xác nhận contract. |
| `token security` | `token.security` → GET `/defi/token_security` | Security quan sát được, không copy rug score/hard-stop trên field thiếu. Không biến unknown thành an toàn. |
| `token pool` | `token.markets` → GET `/defi/v2/markets`, rồi `market.pair-overview` → GET `/defi/v3/pair/overview/single` | Token address và pair address khác nhau. Chọn một pool theo liquidity, không tuyên bố là pool chính giống GMGN. |
| `token holders` không tag | `token.holders` → GET `/defi/v3/token/holder` | Holder amount không có đủ PnL fields của GMGN. Giữ wallet/token-account basis. |
| `token holders --tag smart_degen/renowned/dev/sniper/bundler` | `token.holder-positions` → GET `/token/v1/holder-positions` | Nhãn tương ứng về mục đích là `smart_trader/kol/dev/sniper/bundler`; phân loại do Birdeye định nghĩa. `rat_trader` chỉ có proxy `insider` với định nghĩa khác. Sort chỉ `amount`; GMGN `buy_volume_cur`, `sell_volume_cur`, `profit` không thể giữ nguyên thứ tự. |
| Cohort overview | `token.holder-profile` → GET `/token/v1/holder-profile` | Tổng cohort có thể overlap; không cộng tỷ trọng để suy tổng. Khác danh sách wallet positions. |
| `token traders` | `token.top-traders` → GET `/defi/v2/tokens/top_traders` | `profit` → `realized_pnl`, `unrealized_profit` → `unrealized_pnl`, direction → sort_type. Max10/trang; GMGN20/100 phải báo giảm coverage hoặc phân trang có CU. |
| `token traders --tag renowned` | Không tương đương trực tiếp | `wallet_tags` của top-traders không hỗ trợ `kol`. Holder-positions labels kol chỉ là thay đổi mục đích sang positions, cần ghi rõ; không âm thầm bỏ tag. |
| `market trending` | `market.trending` → GET `/defi/token_trending` | order-by volume → sort_by volumeUSD, direction → sort_type. Chỉ1h/4h/24h; 1m/5m/6h không hợp lệ. Max50/trang. GMGN safety/social filters không có ở wrapper này. |
| `market kline` | `market.ohlcv` → GET `/defi/v3/ohlcv` | resolution1h/4h/1d → type1H/4H/1D. Cần time_from/time_to; không suy thời gian chỉ từ độ phân giải. |
| `market trenches --type new_creation` | `market.meme-list` → GET `/defi/v3/token/meme/list` | graduated:false + creation window. Không thay bằng newly listed. Pump.fun → source pump_dot_fun; venue khác phải validate enum. |
| `market trenches --type near_completion` | `market.meme-list` | graduated:false + min_progress_percent do user chọn. GMGN threshold không được công bố trong workflow; không tự giả định80/90%. |
| `market trenches --type completed` | `market.meme-list` | graduated:true + graduation window. Chọn sort graduated_time. |
| `portfolio holdings` | `portfolio.holdings` → GET `/wallet/v2/current-net-worth` | wallet giữ nguyên. Một trang, lọc liquidity upstream; không đồng nghĩa toàn bộ assets/PnL. |
| `portfolio stats`, `portfolio profits` | `portfolio.pnl-summary` → GET `/wallet/v2/pnl/summary`; `portfolio.pnl-details` → POST `/wallet/v2/pnl/details` | period1d → duration24h; giữ7d/30d nếu hợp lệ. Cố định pnl_method và position_scope. Win rate trên realized tokens, không mặc định trade-winrate GMGN. |
| `portfolio activity` | `portfolio.trades` → GET `/trader/txs/seek_by_time` | wallet → address; cần time range. Chỉ trades; nếu muốn transfers dùng `portfolio.transactions` → GET `/v1/wallet/tx_list` và ghi rõ thay đổi dữ liệu. |
| Wallet leaderboard / performance | `market.trader-ranking` → GET `/trader/gainers-losers` | Realized PnL/ranking do Birdeye, không GMGN copy score. |
| `track smartmoney` | Proxy `market.smart-money` → GET `/smart-money/v1/token/list` | Danh sách token có smart-money activity; không phải global trade feed. Window1d/7d/30d. |
| `track kol`, token cohort flows | Token-scoped `token.money-flow` → POST `/defi/v3/token/money-flow`; `token.tags-tracker` và `token.tags-tracker-details` | Có tags kol/smart_trader phù hợp endpoint; cần token và window. Không thay thế global KOL feed hoặc tài khoản theo dõi GMGN. |

Live docs xác nhận [holder positions](https://data.birdeye.so/docs/data-api/holder/get-token-v1-holder-positions) hỗ trợ Solana, sáu labels, sort amount, giới hạn50. [Top traders](https://data.birdeye.so/docs/data-api/wallet-networth-pnl/get-defi-v2-tokens-top-traders) có dev/bundler/sniper/insider/smart_trader, không kol; giới hạn10. [Meme list](https://data.birdeye.so/docs/data-api/meme/get-defi-v3-token-meme-list) có graduation/progress/creation filters, nhiều chain/venue hơn wrapper hiện tại. Không suy wrapper đã hỗ trợ mọi enum vừa xuất hiện trên live docs.

## 3. Chín named adapters: mặc định đề xuất và độ lệch

Các lựa chọn dưới đây là adaptation dùng [recipe hiện tại](../../src/workflows.ts), không phải phiên dịch nguyên xi chương trình GMGN. `depth:full` giúp giữ nhiều chiều dữ liệu nhưng không tự bổ sung mọi bước của source. Mọi `limit` là trần fan-out, không số lượng thực tế luôn có.

| File trong `docs/` của GMGN | Input/default đề xuất | Những phần cần ghi rõ chưa giống source |
| --- | --- | --- |
| [workflow-token-research.md](https://github.com/GMGNAI/gmgn-skills/blob/main/docs/workflow-token-research.md) | kind token-research, token address, depth full | Recipe có overview/security/holders/markets/pair/profile; thiếu bước kiểm tra trending và danh sách tagged positions/traders của source. Profile là cohort aggregate, không bằng positions. |
| [workflow-token-due-diligence.md](https://github.com/GMGNAI/gmgn-skills/blob/main/docs/workflow-token-due-diligence.md) | kind token-due-diligence, token address, depth full | Core chỉ overview/security. Full thêm pools/profile nhưng không lấy holderlist/tagged traderlist. |
| [workflow-project-deep-report.md](https://github.com/GMGNAI/gmgn-skills/blob/main/docs/workflow-project-deep-report.md) | kind project-deep-report, token address, depth full | Source chart4h/3days; recipe default1H/1day phải sửa override+window hoặc ghi thay đổi. Không trending check, không15-point score tương đương, không xác minh hoạt động social/team. |
| [workflow-wallet-analysis.md](https://github.com/GMGNAI/gmgn-skills/blob/main/docs/workflow-wallet-analysis.md) | kind wallet-analysis, wallet address, depth full, duration30d, limit3 | Bounded3 top holdings; không GMGN followed-wallet feed. Không tuyên bố hoàn thành full token-research cho mỗi holding vì recipe chỉ security/overview. |
| [workflow-smart-money-profile.md](https://github.com/GMGNAI/gmgn-skills/blob/main/docs/workflow-smart-money-profile.md) | kind smart-money-profile, optional wallet, depth full, duration30d, limit3 | 7d/30d PnL+trades+details có; ghép lots và copy ROI không thực hiện. Không có address thì Birdeye trader ranking chọn tối đa3 ví. |
| [workflow-risk-warning.md](https://github.com/GMGNAI/gmgn-skills/blob/main/docs/workflow-risk-warning.md) | kind risk-warning, token address, depth full | Snapshot+cohort timeline. Cần baseline để nói thay đổi; không background monitoring hay tự suy liquidity decrease là rút pool. Không tự dùng nguồn rug score GMGN. |
| [workflow-early-project-screening.md](https://github.com/GMGNAI/gmgn-skills/blob/main/docs/workflow-early-project-screening.md) | kind early-project-screening, stage newly-created, source all, limit3; override candidates.graduated=false | Source mô tả ba điểm bắt đầu thay thế; không tự chạy cả ba. Chưa giữ safe/strict presets, rug/bundler/insider filters hay rank smart-degen. Không có threshold thì near-graduation cần user bổ sung. |
| [workflow-daily-brief.md](https://github.com/GMGNAI/gmgn-skills/blob/main/docs/workflow-daily-brief.md) | kind daily-brief, depth full, limit2 | Source1h/6h nhưng recipe1h/24h. Token smart-money list thay global trades; launches mới tạo khác near/completed. Bounded shortlist không đại diện toàn thị trường. |
| [workflow-market-opportunities.md](https://github.com/GMGNAI/gmgn-skills/blob/main/docs/workflow-market-opportunities.md) | kind market-opportunities, depth full, interval1h, scanLimit50, limit5; trending override sort_by volumeUSD + sort_type desc | Source safety/social filters chưa có. Chỉ enrich shortlist, không nói mọi candidate đều có cùng độ sâu. Bỏ execution/swap. |

## 4. Các khoảng trống không được che bằng tên tương tự

- Không migration swap/quote/order/cooking, API-key wallet management, signing hay auto execution. Đây là workflow research dùng catalog đọc dữ liệu hiện tại. [GMGN swap skill](https://github.com/GMGNAI/gmgn-skills/blob/main/skills/gmgn-swap/SKILL.md), [catalog CLI](../../src/catalog.ts).
- Social links không phải social sentiment, số người theo dõi, nội dung tweet, callout hit-rate hoặc độ tin cậy KOL. Các command `callout`, `track follow-wallet`, `track follow-tokens`, hot-searches và signal feed không có registered operation cùng ngữ nghĩa. [GMGN command reference](https://github.com/GMGNAI/gmgn-skills/blob/main/docs/cli-usage.md), [catalog CLI](../../src/catalog.ts).
- Bundler/sniper/insider **có dữ liệu Birdeye**, nhưng không bằng `bundler_rate`, `rat_trader_amount_rate`, `rug_ratio` hoặc wash-trading labels GMGN. Birdeye insider là ví nhận token trực tiếp từ Chef qua transfer; không đổi tên thành thuật toán insider GMGN. [Holder positions docs](https://data.birdeye.so/docs/data-api/holder/get-token-v1-holder-positions).
- Chưa có copy-trade backtest thực tế, latency/slippage/fees hoặc lot accounting đầy đủ từ một trang trades. Không giữ nguyên score/ngưỡng/khuyến nghị source nếu metric đầu vào khác. [Smart-money profile source](https://github.com/GMGNAI/gmgn-skills/blob/main/docs/workflow-smart-money-profile.md), [PnL schema local](../../../bds-docs-mintlify/data-api/wallet-networth-pnl/get-wallet-v2-pnl-summary.mdx).

## 5. CU drift cần lưu dấu vết

Hai trang live kiểm tra ngày2026-10-16 ghi **30 CU/request** cho [holder positions](https://data.birdeye.so/docs/data-api/holder/get-token-v1-holder-positions) và [top traders](https://data.birdeye.so/docs/data-api/wallet-networth-pnl/get-defi-v2-tokens-top-traders); catalog CLI và [CU snapshot local](../../../bds-docs-mintlify/resources/compute-unit-cost.mdx) đang ghi25. Meme-list live ghi30, trùng catalog. Đây là lệch tài liệu đã quan sát, chưa xác nhận CU billing bằng request.

Importer cần giữ pricingVersion và phân biệt estimate với measured/uncertain CU. Nếu catalog chưa được đối chiếu nâng cấp thì phải gọi đúng là estimate theo snapshot, không tuyên bố đã dùng bảng giá live. Mỗi page/retry là request riêng; đổi nguồn import không bỏ qua Runner budget, validation hoặc usage ledger. Nguồn thực thi: [Runner](../../src/runner.ts), [catalog](../../src/catalog.ts).

Sau khảo sát, triển khai importer đã cập nhật hai mức trên lên 30 CU; pricingVersion có suffix `+traders-positions-2026-10-16`. Đây là hai hiệu chỉnh từ trang endpoint, không phải xác nhận billing hoặc cập nhật toàn bộ bảng giá.

## 6. Tiêu chí nghiệm thu importer đề xuất

1. Preview source, intent, step→endpoint, default/required input, CU và semantic gaps trước khi chạy.
2. Phân biệt adapter đã biết với Markdown chỉ tìm thấy commands. File tên giống workflow chuẩn nhưng nội dung khác vẫn giữ hash và warnings; không tuyên bố đã compile mọi logic prose.
3. Các flags không map được phải hiển thị; không silently bỏ chain/tag/filter/window làm thay đổi câu hỏi.
4. JSON custom chỉ dùng operation và Zod params đã đăng ký, bounded fan-out và dependency rõ ràng. Không eval/script/shell/arbitrary HTTP URL.
5. Lưu definition/source metadata vào SQLite; chạy qua Runner và lưu kết quả giống workflow built-in. Import, list, preview, reopen không mất Birdeye CU.
6. Test ít nhất pipe inert, multiline, unknown command, chain không hỗ trợ, KOL trader mismatch, source filters không giữ được, malformed JSON, persistence/restart và budget không bị bypass.

Các tiêu chí trên là đề xuất triển khai từ đối chiếu nguồn, không phải tính năng upstream.
