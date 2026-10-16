# Demo sản phẩm cho khách hàng từ Birdeye CLI

Ngày đối chiếu: **16/10/2026**. Phạm vi: source đang có trong workspace, checkout `birdeye-data-skills`, tài liệu BDS cục bộ và tài liệu chính thức đang công bố. Nghiên cứu này được thực hiện trước bước xây giao diện demo và chỉ chạy `planCase` offline, **không gọi API dữ liệu có tính CU**.

**Cập nhật triển khai:** sau nghiên cứu đã thêm 5 preset snapshot trong tab Demos và lệnh CLI `demo`. Xem [hướng dẫn chạy và contract tích hợp](../workflows/customer-demos.md) cho phạm vi đã triển khai. Các phần bot delivery, scheduler, streaming và giao dịch trong lộ trình dưới đây vẫn là công việc tiếp theo; không có kiểm chứng API live hoặc billing trong lượt triển khai này.

**Nên bắt đầu với terminal khám phá token và trang thông tin token/pool cho DEX.** Cả hai tạo được hành trình khách hàng rõ ràng từ một đầu vào đến dữ liệu có nguồn, dùng recipe đã đăng ký, không cần tích hợp thực thi giao dịch. Tiếp theo là hồ sơ ví và bảng so sánh trader; demo tín hiệu rủi ro và Telegram dùng lại các kết quả này. Thứ tự này là đề xuất sản phẩm dựa trên mức độ sẵn có của [recipe](../../src/skill-recipes.ts) và [workflow](../../src/workflows.ts).

## Ma trận 5 use case

“Có sẵn” trong bảng nghĩa là recipe/operation tồn tại tại thời điểm nghiên cứu; không đồng nghĩa toàn bộ sản phẩm production đã được triển khai. CU là **ước tính của catalog hiện tại**, chưa phải báo giá hóa đơn Birdeye; xem mục sai lệch giá bên dưới.

| Ưu tiên | Khách hàng / việc cần làm | Demo khách hàng thấy | Recipe và operation thực sự có | Đầu vào tối thiểu | CU / request tối đa mỗi lượt |
|---|---|---|---|---|---:|
| P0 | Terminal / token screener: tìm token đáng nghiên cứu | Danh sách hoạt động → chọn token → thị trường, money flow và biểu đồ có giải thích | `skill-trending-list` → `skill-token-dd` → `skill-kline-pattern` | `scanLimit=20`, `interval=24h`; sau đó token mint Solana | **200 / 5** cho V3 list + một Token DD + một Kline |
| P0 | DEX / trang token: hiểu thị trường trước khi mở giao dịch | Giá, volume, thanh khoản, top holders, danh sách pool và thông tin một pool | `project-deep-report`: overview, security, holders, markets, pair-overview, holder-profile, OHLCV, trade-data | Token mint; mặc định cửa sổ 24h | **240 / 8** |
| P1 | Trading platform: nghiên cứu trader/ví | Hồ sơ PnL 7d/30d, positions, tài sản, swaps và net worth; so sánh ví | `skill-smart-money-profile`; `skill-smart-money-leaderboard` | Một wallet; hoặc 1–10 wallet do người dùng cung cấp | **190 / 7** cho profile; **140 / 6** cho hai ví leaderboard |
| P1 | Security signals / nhóm kiểm duyệt token | Các quan sát contract/holders và thay đổi liquidity với trạng thái thiếu dữ liệu | `skill-rugcheck-audit`; mở rộng `risk-warning --depth full` để xem cohort/timeline | Token mint; mặc định 7 ngày cho skill | **245 / 5** cho audit; **185 / 7** cho risk-warning full |
| P2 | Telegram research bot: truy vấn nhanh từ chat | `/token`, `/wallet`, `/brief` trả bản tóm tắt có thời điểm và nguồn | Adapter mới gọi `skill-token-dd`, `skill-smart-money-profile`, `daily-brief` | Lệnh hợp lệ + mint/wallet; brief không cần address | **50 / 3**, **190 / 7**, **130 / 6** tương ứng |

Nguồn cho toàn bộ mapping và cách tính: [addSkillSteps](../../src/skill-recipes.ts), [planCase](../../src/workflows.ts), [catalog](../../src/catalog.ts), [extended catalog](../../src/extended-catalog.ts), [skill catalog](../../src/skill-catalog.ts). Các tổng nhiều recipe là phép cộng các plan riêng; không giả định cache hay tự loại request trùng.

## 1. Terminal: khám phá → kiểm tra token → đọc chart

**Câu chuyện demo:** khách hàng mở “Token đang hoạt động”, chọn một token, thấy lý do cần nghiên cứu thêm từ volume/liquidity, money flow được gắn nhãn và hành vi nến. Có nút xem nguồn, thời điểm lấy dữ liệu và tải kết quả JSON.

**Cấu hình có sẵn:** `skill-trending-list` mặc định dùng `market.token-list` (`GET /defi/v3/token/list`, 50 CU), sort volume 24h, tối đa `scanLimit=50`. Có thể chọn native trending (`market.trending`, 25 CU); native hỗ trợ volume/liquidity/rank, còn platform filter cần V3 list. Sau khi người dùng chọn mint, `skill-token-dd` gọi `token.overview` + `token.security` + `token.money-flow` với tag `smart_money`, frame `24h`. `skill-kline-pattern` gọi OHLCV V3, mặc định 7 ngày/15m. [Nguồn recipe](../../src/skill-recipes.ts), [validation](../../src/workflows.ts).

**Đầu ra:** bảng token lấy từ `data.sources`; giá/volume/liquidity trong `data.metrics`; security evidence trong `data.skillAnalysis.findings`; Kline có `pattern`, `score`, `formulaVersion`, các phép đo và `sourceIds`. Kline dùng nến đã đóng, cần ít nhất 8 nến hợp lệ; điểm là heuristic, không phải xác suất tăng giá. Các trường thiếu phải giữ trạng thái unavailable. [Công thức hiện tại](../../src/skill-metrics.ts).

**Giới hạn cần thể hiện:** đây là một trang kết quả có thứ tự theo API, không phải toàn thị trường. So sánh danh sách 1h với 24h không tự tạo lịch sử biến động hạng. “Thanh khoản cao” không được đổi thành “an toàn”. Giao dịch và chart trực tiếp liên tục là phần mở rộng: Birdeye có `SUBSCRIBE_PRICE`, nhưng CLI hiện chưa tạo subscription; adapter cần quản lý kết nối/reconnect và cập nhật nến. [Workflow notes](../../src/workflows.ts), [WebSocket chính thức](https://data.birdeye.so/docs/websockets/subscribe-price-ohlcv).

**Biến thể kế tiếp:** launchpad screener dùng `early-project-screening`, `stage=near-graduation`, `minProgress=80`, `scanLimit=20`, `limit=3`: 225 CU/10 request theo planner. Recipe lấy `market.meme-list`, rồi security/overview/holder-profile cho tối đa ba token. Đây là tiến độ bonding curve trong phạm vi nguồn dữ liệu, không phải dự báo token sẽ tốt sau graduation. [Workflow](../../src/workflows.ts).

## 2. DEX: trang thông tin token và pool

**Câu chuyện demo:** dán mint → thấy thị trường và pool thanh khoản lớn trong trang trả về → mở bằng chứng security/holders → có đủ bối cảnh để khách hàng tiếp tục sang sản phẩm giao dịch của họ.

**Recipe sẵn có:** `project-deep-report` gọi đúng tám operation: `token.overview`, `token.security`, `token.holders`, `token.markets`, `market.pair-overview`, `token.holder-profile`, `market.ohlcv`, `token.trade-data`. `token.markets` lấy tối đa 10 pool theo liquidity giảm dần; `pair-overview` lấy một pair được chọn từ kết quả đó. Phải phân biệt mint đầu vào với địa chỉ pool lấy từ bước markets. OHLCV của recipe này là **token**, không phải chart riêng của pair. [Workflow và selection](../../src/workflows.ts).

**Đầu ra:** thẻ token + bảng pool trong nguồn markets; pair card từ nguồn pair-overview; chart từ nguồn OHLCV; distribution/nhóm holder từ holders và profile. Adapter render từ `data.sources`, không chờ một “DEX page DTO” có sẵn. Recipe có thể thiếu nhánh pair nếu không lấy được market phù hợp; dùng `data.outcomes`, `data.missing`, `data.status` để giải thích. [Result contract](../../src/analysis.ts), [execution](../../src/workflows.ts).

**Giới hạn sản phẩm:** đây là trang dữ liệu hỗ trợ DEX. CLI không cung cấp quote có thể thực thi, route swap, slippage, ký transaction hay gửi lệnh. Cũng chưa xác minh team/funding/roadmap của token dù recipe mang tên “project-deep-report”. Với bảng so sánh nhiều pool sâu hơn, cần gọi thêm pair operation cho từng pool và tăng ngân sách; recipe hiện chỉ làm giàu một pool. [Workflow notes và catalog](../../src/workflows.ts).

## 3. Trading platform: hồ sơ trader và so sánh ví

**Câu chuyện demo:** chọn ví → xem realized/unrealized PnL 7d/30d và positions → so sánh hai ví trên cùng phương pháp kế toán → mở dữ liệu giải thích thay vì chỉ thấy điểm số.

**Recipe chính:** `skill-smart-money-profile` gọi hai `portfolio.pnl-summary` (7d/30d), `portfolio.pnl-details` (30d, 100 dòng), `portfolio.holdings` (100 dòng), `portfolio.first-funded`, `portfolio.trades` (100 dòng trong cửa sổ), `portfolio.net-worth-history` (30 snapshot ngày). Với danh sách wallet rõ ràng, `skill-smart-money-leaderboard` gọi 7d summary + 30d summary + positions cho mỗi ví: **70 CU/3 request mỗi ví**, tối đa 10 ví sau loại trùng. [Recipe](../../src/skill-recipes.ts).

**Đầu ra:** summary và positions kèm phạm vi từng request; leaderboard có rank, score thành phần và source IDs trong `skillAnalysis.findings`. Chỉ xếp hạng ví có đủ dữ liệu so sánh; thiếu dữ liệu giữ `rank=null`. Rank là tương đối trong nhóm ví được gửi vào, không phải hạng toàn thị trường. `skill-wallet-score` là lựa chọn thêm, 150 CU/6 request mặc định, trả alpha heuristic có phiên bản và breakdown; không nên dùng nó làm nhãn “copy được”. [Metrics](../../src/skill-metrics.ts).

**Discovery nếu chưa có ví:** `skill-smart-wallets --skill-depth standard --limit 3` lấy smart-money tokens → top traders của tối đa ba token → deduplicate wallet → 30d PnL của tối đa ba ví, 170 CU/7 request. Thứ tự wallet theo provider, không phải thuật toán tự tìm ba ví tốt nhất; PnL từng token không được cộng thành PnL toàn ví. [Recipe](../../src/skill-recipes.ts).

**Giới hạn:** PnL bị ảnh hưởng bởi độ đầy đủ lịch sử protocol; tài liệu chính thức nói trade data có thể chưa backfill đầy đủ. Cần giữ `duration`, `position_scope=duration_only` và `pnl_method=wac` cùng nguồn. Không cộng các cửa sổ 7d/30d chồng lấn. Tăng net worth có thể do nạp tiền; first-funded không chứng minh tuổi ví; transaction list chứa cả chuyển tiền. Chưa có latency/slippage/fees và mô phỏng thực thi để suy ra copy-trade ROI. [Wallet PnL chính thức](https://data.birdeye.so/docs/data-api/wallet-networth-pnl/get-wallet-v2-pnl-summary), [recipe notes](../../src/skill-recipes.ts).

## 4. Security signals: bảng bằng chứng cho một token

**Câu chuyện demo:** nhập mint → xem các kiểm tra được quan sát, phần chưa có bằng chứng, holder concentration và liquidity theo thời gian → mở nguồn thay vì nhận một dấu “safe”.

**Recipe chính:** `skill-rugcheck-audit` gọi overview (15), security (25), holders (30), holder-profile (25), liquidity-history (150 CU dự phòng) = 245 CU. Tên recipe giữ tương thích với reference; **không tích hợp RugCheck.org**. Giao diện khách hàng nên gọi “Token risk evidence” và giữ tên kỹ thuật trong chi tiết. `skill-contract-dd` là nhánh khác: security + overview + holder-distribution + Kline, 170 CU/4 request; bỏ Kline còn 70 CU/3 request. [Recipe](../../src/skill-recipes.ts).

**Đầu ra:** `security-evidence` có `compositeSafetyScore=null`, quan sát freezeable/mintable/top10 share và missing checks; `liquidity-change` tính thay đổi đầu-cuối của các snapshot được lấy. Mặc định 7 ngày, `4h`, 42 snapshot; `count` bị chặn 100 nên tăng `windowDays` không bảo đảm đủ toàn bộ cửa sổ. API liquidity trả giá trị tại đầu nến, không phải full OHLC. [Skill metrics](../../src/skill-metrics.ts), [liquidity docs chính thức](https://data.birdeye.so/docs/data-api/price-ohlcv/get-defi-v3-liquidity-history-token).

**Giới hạn quan trọng:** honeypot simulation và xác minh LP lock không có trong các bước này; unknown không phải passed check. Tỷ lệ token account và tỷ lệ wallet không được trộn. USD liquidity giảm có thể gồm ảnh hưởng giá, chưa đủ kết luận rút LP hay rug. Birdeye cũng hướng dẫn security data là một phần của đánh giá rộng hơn. [Metrics hiện tại](../../src/skill-metrics.ts), [Token Security chính thức](https://data.birdeye.so/docs/data-api/security/get-defi-token-security).

**Monitoring là bước sau:** `risk-warning` hiện là snapshot, kể cả khi có baseline do người dùng nhập. `depth=full` thêm holder-profile, holder-positions, tags-tracker và tags-tracker-details; không tự chạy lặp hay gửi cảnh báo. Muốn cảnh báo thay đổi cần scheduler/stream, lưu baseline, luật ngưỡng, chống gửi lặp, cooldown và xử lý khoảng trống dữ liệu. Đó là hạ tầng mới, không phải hành vi đã có trong recipe. [Workflow](../../src/workflows.ts).

## 5. Telegram: lớp truy vấn nghiên cứu qua chat

**Chỉ nghiên cứu mẫu tích hợp:** chưa tạo bot, chưa đọc token bot, chưa gửi tin, chưa đăng ký webhook và chưa triển khai dịch vụ.

Đề xuất adapter dùng allowlist lệnh: `/token <mint>` → Token DD; `/wallet <wallet>` → Smart Money Profile; `/brief` → Daily Brief. Adapter parse dữ liệu thành `CaseInput`, chạy `planCase`, áp dụng ngân sách/request limit rồi gọi runner; không ghép text chat thành shell command. Kết quả ngắn gồm subject, thời điểm, vài metrics, missing-data note và run ID. Các command này là **API của adapter đề xuất**, chưa phải lệnh Telegram tồn tại trong repo. [Case schema và planner](../../src/workflows.ts), [runner](../../src/runner.ts).

Telegram hỗ trợ `getUpdates` hoặc webhook, hai cơ chế loại trừ nhau; có thể dùng polling cho demo sau này. Lưu `update_id` để chống xử lý lại. `sendMessage` giới hạn 4096 ký tự sau parse entities: gửi bản tóm tắt ngắn và giữ evidence JSON ở kho run, hoặc chia nội dung có kiểm soát. Các hành động nhận/gửi Telegram chỉ được thực hiện khi phần triển khai được yêu cầu riêng. [Telegram Bot API](https://core.telegram.org/bots/api#getting-updates), [sendMessage](https://core.telegram.org/bots/api#sendmessage).

Đầu ra của `/token` phải giữ trạng thái partial khi thiếu checks, dù các REST call đều thành công. `/brief` lấy hai rolling trending windows và làm giàu tối đa hai token mặc định, không phải bản tin tự xuất bản mỗi ngày. Lịch gửi, subscriber preferences, chat allowlist, secret storage, worker queue, retry/backoff và giới hạn CU theo chat/ngày là phần cần xây. Ngân sách Birdeye trong bảng không gồm chi phí hosting hay các dịch vụ bổ sung. [Analysis status](../../src/analysis.ts), [daily-brief](../../src/workflows.ts).

## Hợp đồng đầu ra dùng chung cho mọi demo

Không cần phát minh kết quả mới để bắt đầu: `runCase` đã trả envelope dưới đây. Các view nên dùng một adapter mỏng và giữ nguyên nguồn gốc số liệu. [Source của contract](../../src/analysis.ts).

| Trường hiện có | Vai trò trong demo |
|---|---|
| `schemaVersion` | Phiên bản envelope; hiện là 1 |
| `data.kind`, `data.plan` | Recipe, input đã chuẩn hóa, các step, estimated CU, max requests và pricing version |
| `data.metrics` | Các metric suy ra; mỗi metric có basis/source ID khi phù hợp |
| `data.sources[]` | Kết quả từng operation: raw data cùng metadata, params, thời điểm, coverage |
| `data.selections`, `data.outcomes`, `data.missing` | Token/wallet/pair được chọn, bước thành công/bỏ qua/thất bại, phần thiếu |
| `data.skillAnalysis.findings` | Có ở `skill-*`; pattern/alpha/ranking/security evidence và missing checks |
| `data.status`, `meta.coverage` | `partial` hoặc `complete-for-requested-scope`; complete chỉ trong phạm vi yêu cầu |
| `meta.chain`, `meta.retrievedAt`, `meta.cu`, `meta.warnings` | Solana, thời điểm chạy, số liệu ledger, cảnh báo |

`data.answer` không phải bản báo cáo tự sinh được bảo đảm cho `case`: màn hình đầu tiên nên render dữ liệu xác định từ metrics/sources. Nếu thêm LLM narrative, đó là lớp bổ sung có chi phí/độ trễ riêng. Token DD/Contract DD/RugCheck cố ý phát missing checks về honeypot/LP lock, nên có thể trả `partial` và CLI exit code **5** ngay cả khi request đều thành công; adapter không được vứt JSON chỉ vì process exit khác 0. [Analysis](../../src/analysis.ts), [skill metrics](../../src/skill-metrics.ts), [CLI exit behavior](../../src/index.ts).

## Chi phí: kết quả planner và sai lệch với tài liệu live

Đã compile source TypeScript vào thư mục tạm ngoài repo và gọi `planCase(input, 1792108800)` với địa chỉ Solana hợp lệ chỉ để kiểm tra schema. Không dùng các địa chỉ placeholder làm ví mẫu có PnL thật. Pricing version nhận được: **`bds-b34378ea-2026-10-09+traders-positions-2026-10-16`**. Các plan giữ một trang mỗi step, không cộng retry; nhánh phụ thuộc có thể gọi ít hơn `maxRequests` khi thiếu subjects. [Planner](../../src/workflows.ts).

| Cấu hình được chạy offline | CU catalog | Request tối đa |
|---|---:|---:|
| Trending List V3 / native trending, scanLimit 20 | 50 / 25 | 1 / 1 |
| Token DD mặc định / include cả list, advanced_security, risk_history | 50 / 255 | 3 / 6 |
| Contract DD mặc định | 170 | 4 |
| RugCheck Audit mặc định | 245 | 5 |
| Kline Pattern mặc định | 100 | 1 |
| Project Deep Report mặc định | 240 | 8 |
| Wallet Analysis mặc định, 5 PnL windows | 240 | 9 |
| Wallet Style mặc định | 140 | 4 |
| Wallet Score mặc định | 150 | 6 |
| Smart Money Profile mặc định | 190 | 7 |
| Smart Money Leaderboard, 2 ví khác nhau | 140 | 6 |
| Smart Wallets, standard, limit 3 | 170 | 7 |
| Risk Warning core / full | 70 / 185 | 3 / 7 |
| Daily Brief mặc định | 130 | 6 |
| Early Project Screening, near-graduation, minProgress 80, limit 3 | 225 | 10 |

**Có pricing drift cần xử lý trước khi hứa ngân sách với khách hàng:** trang live Token Security ghi **30 CU** trong khi [catalog](../../src/catalog.ts) và [MDX cục bộ](../../../bds-docs-mintlify/data-api/security/get-defi-token-security.mdx) ghi **25 CU**. Trang live Wallet PnL ghi **30 CU** trong khi [extended catalog](../../src/extended-catalog.ts) ghi **20 CU**. Các số ở bảng là output đúng của planner hiện hành, không xác nhận bill upstream. Chưa kiểm chứng toàn bộ endpoint để đưa một tổng “live price” thay thế. [Security live](https://data.birdeye.so/docs/data-api/security/get-defi-token-security), [PnL live](https://data.birdeye.so/docs/data-api/wallet-networth-pnl/get-wallet-v2-pnl-summary).

OHLCV đang dự phòng 100 CU; liquidity-history `4h` dự phòng 150 CU theo hệ số lookback tối đa. Vì có giá động và drift, không mô tả mọi con số là charge chính xác, và không coi `--max-cu` theo catalog là trần hóa đơn upstream được bảo đảm. Không chuyển CU sang USD khi chưa biết gói/quota/điều khoản tài khoản. [Catalog](../../src/catalog.ts), [skill catalog](../../src/skill-catalog.ts), [liquidity pricing live](https://data.birdeye.so/docs/data-api/price-ohlcv/get-defi-v3-liquidity-history-token).

Các lệnh dưới đây chỉ estimate, không gọi Birdeye. Thay `TOKEN_MINT`/`WALLET_ADDRESS` bằng địa chỉ Solana hợp lệ khi dùng:

```sh
birdeye-cli --estimate-cu case skill-trending-list --scan-limit 20
birdeye-cli --estimate-cu case skill-token-dd --address TOKEN_MINT
birdeye-cli --estimate-cu case project-deep-report --address TOKEN_MINT
birdeye-cli --estimate-cu case skill-smart-money-profile --address WALLET_ADDRESS
birdeye-cli --estimate-cu case skill-rugcheck-audit --address TOKEN_MINT
birdeye-cli --estimate-cu case daily-brief
```

`--estimate-cu` trả trước khi tạo Runner/API request trong đường chạy `case`. Muốn chạy demo live thật cần API key và quyền endpoint phù hợp của tài khoản; việc có recipe không chứng minh gói hiện tại được truy cập mọi endpoint. [CLI](../../src/index.ts).

## Lộ trình đề xuất và phụ thuộc bên ngoài

| Giai đoạn | Kết quả review được | Cần thêm |
|---|---|---|
| 1 — Demo nguồn dữ liệu | Terminal discovery + token page/DEX inspector với evidence drawer, CU estimate và partial state | UI adapter; bộ mint có dữ liệu/ít dữ liệu; đối chiếu pricing; xác nhận endpoint entitlement |
| 2 — Wallet intelligence | Profile và leaderboard cho ví do khách hàng nhập; optional Smart Wallets discovery | Chọn ví mẫu có lịch sử phù hợp; thể hiện accounting/window/page coverage; xử lý API thiếu dữ liệu |
| 3 — Risk evidence | Security checklist và liquidity timeline; snapshot review | Presentation cho unknown/missing; nếu cần LP lock/honeypot thật phải tích hợp nguồn hoặc simulation độc lập |
| 4 — Telegram command demo | Input JSON/text mẫu → CaseInput → bản tóm tắt cục bộ trước; bot thật ở công việc triển khai tiếp theo | Bot token, hosting/worker, polling hoặc HTTPS webhook, chat authorization, dedup và quota |
| 5 — Monitoring liên tục | Thay đổi giá/risk có baseline và alert rules được kiểm chứng | Scheduler/WebSocket consumer, persistence, reconnect/backfill, cooldown, notification adapter và quyền dữ liệu |
| Ngoài phạm vi hiện tại — giao dịch | Quote/route, ký và gửi transaction, theo dõi fills | DEX/aggregator execution API, wallet signing, slippage/fees, RPC, transaction lifecycle; đây là hệ thống bổ sung |

Nguồn cho ranh giới hiện tại: [recipe registry](../../src/skill-recipes.ts), [workflow notes](../../src/workflows.ts). Khả năng WebSocket upstream được xác minh ở [SUBSCRIBE_PRICE](https://data.birdeye.so/docs/websockets/subscribe-price-ohlcv); không suy diễn rằng CLI đã hỗ trợ vì upstream có endpoint.

## Ghi chú đối chiếu reference

Checkout `birdeye-data-skills` cung cấp ý tưởng workflow và thuật ngữ khách hàng; CLI này đăng ký **11 skill recipes**, cộng các legacy workflows. Không sao chép toàn bộ lời hứa trong tài liệu reference: [Trending List reference](../../birdeye-data-skills/docs/trending-list-workflow.md) liệt kê nhiều chain/interval, gọi liquidity “safest” và ghi khoảng 30 CU; implementation hiện tại chỉ Solana, interval 1h/4h/24h cho list, V3 50/native 25 CU theo catalog. Giới hạn và phép tính trong tài liệu này lấy từ implementation, không từ tên marketing. [Registry](../../src/skill-recipes.ts), [schema](../../src/workflows.ts), [ghi chú mapping trước đó](birdeye-data-skills.md).

Các nguồn cục bộ BDS nằm ở sibling checkout `bds-docs-mintlify`; liên kết tương đối đến đó chỉ hoạt động khi có checkout cạnh repo. Những endpoint quan trọng và tích hợp tương lai đã có liên kết công khai ở từng mục. Toàn bộ nhận định về lộ trình và ưu tiên là đề xuất thiết kế; kết quả live, SLA, latency và mức độ đầy đủ dữ liệu chưa được benchmark trong nghiên cứu offline này.
