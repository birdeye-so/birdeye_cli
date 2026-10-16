# Plan triển khai Birdeye CLI

Birdeye CLI cung cấp các lệnh dữ liệu và skills cho AI agent, bắt đầu với Solana. CU accounting và output tiết kiệm token là yêu cầu nền tảng. Module web và hỏi đáp AI có [plan riêng](interface.md), dùng lại cùng bộ thực thi.

Trạng thái: plan, chưa implement. Ngày lập: 2026-10-09. Tham chiếu cấu trúc CLI và skills: [GMGN](https://github.com/GMGNAI/gmgn-skills). Phạm vi giữ nguyên CLI TypeScript, Commander và một npm package; bổ sung `--format interface`, CU accounting và `--short`.

## Phạm vi command

| Nhóm | Lệnh dự kiến | Vai trò |
| --- | --- | --- |
| Cấu hình | `config init`, `config show`, `doctor` | Credentials, chain mặc định, kiểm tra kết nối |
| Token | `token price`, `token overview`, `token security`, `token holders` | Giá, thông tin, dữ liệu rủi ro, holders |
| Market | `market trending`, `market ohlcv` | Khám phá token, lịch sử nến |
| Portfolio | `portfolio holdings` | Danh mục của ví |
| Khả năng hỗ trợ | `chains`, `capabilities` | Chain, endpoint, giới hạn và pricing coverage |
| Usage | `usage show`, `usage credits` | Sổ CU local và snapshot account từ Birdeye |
| Workflow | `workflow create`, `workflow show` | ID gom nhiều command của một skill hoặc case study |

`usage show`, `capabilities` và thao tác workflow local không gọi API. `chains` đọc catalog đóng gói; `chains --refresh` mới gọi API và tính CU. `doctor` liệt kê kiểm tra local trước, còn `doctor --live` kiểm tra kết nối và báo CU. `usage credits` là request có phí.

Mỗi command có `--help`, ví dụ, kiểu output, CU model và giới hạn chain. `portfolio holdings` ưu tiên `/wallet/v2/current-net-worth` cho Solana sau khi xác minh schema; tránh mặc định endpoint beta chỉ vì giống GMGN.

## Kiến trúc dùng chung

```text
CLI commands ───────┐
                   ├─ OperationRunner ─ BirdeyeClient ─ Birdeye API
Interface tools ───┘          │
                             ├─ Endpoint catalog + input validation
                             ├─ CostEstimator + BudgetManager
                             ├─ UsageLedger
                             └─ MetricEngine

OperationResult ─ JSON renderer / table renderer / interface renderer
```

CLI parse tham số rồi gọi `OperationRunner`. Skills gọi CLI và truyền workflow ID. Web backend gọi module trực tiếp, không spawn shell để gọi lại CLI.

| Module | Interface và trách nhiệm |
| --- | --- |
| EndpointCatalog | Method, path, schema, chain, pagination, pricing rule, nguồn và phiên bản |
| BirdeyeClient | Authentication, timeout, retry có giới hạn, decode response, lỗi upstream |
| OperationRunner | Thực thi operation và chuyển từng request attempt qua accounting |
| CostEstimator | Ước tính trước request và cập nhật theo billing basis đã xác minh |
| BudgetManager | Reserve ngân sách trước dispatch, commit/release sau completion |
| UsageLedger | Ghi request attempt, command, workflow; truy vấn tổng và đối soát |
| MetricEngine | Công thức xác định, precision, missing data và provenance |
| OutputProjector | Field presets và `--short`; không thay dữ liệu đầu vào MetricEngine |

Đề xuất cấu trúc `src/{commands,client,endpoints,execution,usage,metrics,output,config}`. Module interface lazy-load từ `src/interface`; các lệnh dữ liệu không cần khởi tạo web server hoặc AI provider. Inject HTTP transport và clock để kiểm thử retry, budget và billing mà không tiêu CU thật.

## Nguồn và bảng CU khởi đầu

Dùng docs local ở `/Users/toanlk/birdeye.so/bds-docs-mintlify`, snapshot `b34378ea9a1aad2c22934903ded124cd84729d3f`. Catalog phải đóng gói trong npm package; máy người dùng không phụ thuộc đường dẫn docs này.

Nguồn chính:

- [Bảng CU](/Users/toanlk/birdeye.so/bds-docs-mintlify/resources/compute-unit-cost.mdx).
- [Batch CU](/Users/toanlk/birdeye.so/bds-docs-mintlify/guides/compute-unit-cost/batch-token-cu-cost.mdx).
- [Dynamic CU](/Users/toanlk/birdeye.so/bds-docs-mintlify/guides/compute-unit-cost/dynamic-compute-unit-cost.mdx).
- [Multi factor CU](/Users/toanlk/birdeye.so/bds-docs-mintlify/guides/compute-unit-cost/multi-factor-cu-cost.mdx).
- [Credits usage](/Users/toanlk/birdeye.so/bds-docs-mintlify/data-api/search-utils/get-utils-v1-credits.mdx) và [OpenAPI](/Users/toanlk/birdeye.so/bds-docs-mintlify/openapi/data/openapi_docs.json).

| Operation | Endpoint | CU theo snapshot docs |
| --- | --- | --- |
| Price | `GET /defi/price` | 3/request |
| Overview | `GET /defi/token_overview` | 15/request |
| Security | `GET /defi/token_security` | 25/request |
| Holders | `GET /defi/v3/token/holder` | 30/request |
| Trending | `GET /defi/token_trending` | 25/request |
| Portfolio V2 | `GET /wallet/v2/current-net-worth` | 20/request |
| Portfolio beta | `GET /v1/wallet/token_list` | 50/request |
| Credits | `GET /utils/v1/credits` | 1/request |
| Multi price | `GET` hoặc `POST /defi/multi_price` | `ceil(3 × n^0.8)` |
| OHLCV V3 | `GET /defi/v3/ohlcv` | ≤100: 12; ≤300: 25; ≤1000: 40; ≤2000: 75; ≤5000: 100; default: 40 |

Ví dụ không retry, không pagination: overview + security + một trang holders = `15 + 25 + 30 = 70 CU` theo catalog. Multi price cho 10 địa chỉ = `ceil(3 × 10^0.8) = 19 CU`; 10 request price riêng = 30 CU. Sau khi chia batch, phải làm tròn từng request rồi cộng.

## Phân biệt CU ước tính và usage được báo cáo

Mỗi request lưu `estimatedCu`, `reportedCu` nullable, `reservedCu`, `billingBasis`, `pricingVersion`, `pricingStatus`, endpoint, số attempt và trạng thái completion. `reportedCu` chỉ có giá trị khi có tín hiệu billing được upstream xác nhận cho chính request đó.

OpenAPI được kiểm tra chưa mô tả response header CU riêng cho từng request. Do đó bản đầu hiển thị **CU ước tính theo docs**, không gọi đó là số đã bị trừ chính xác. Endpoint credits trả `usage.api`, `usage.ws`, `usage.total` cùng remaining/overage ở cấp account. Các trường remaining/overage có thể null ngoài chu kỳ hiện tại theo Usage Note, dù schema chưa biểu đạt nullable đầy đủ.

`usage credits` ghi snapshot theo account và khoảng thời gian. Chênh lệch hai snapshot có thể chứa traffic từ ứng dụng khác, nhiều API key cùng account, độ trễ cập nhật và chính request credits; không phân bổ trực tiếp vào command. Không tự gọi credits trước/sau mọi command. UI chỉ refresh theo yêu cầu hoặc TTL đã cấu hình, và tính cả 1 CU của mỗi lần refresh.

UsageLedger đề xuất dùng SQLite local với transaction, hỗ trợ nhiều tiến trình. Lưu ID credentials/profile đã che định danh, không lưu API key hoặc response đầy đủ. Tách run, workflow, request attempt và account snapshot. Khóa idempotency theo attempt ID để không ghi CU hai lần khi web stream reconnect.

Mỗi retry và trang tiếp theo là request attempt riêng. Với timeout, lỗi HTTP, cancel hoặc process crash sau dispatch: chưa có bằng chứng billing thì ghi `uncertain`, giữ khoảng chi phí tiềm năng, không coi là miễn phí và không tự ghi thành phí xác nhận. Request chưa dispatch không tiêu CU. Cache hit không tạo CU mới; chia sẻ một request giữa nhiều consumers chỉ ghi một khoản phí và liên kết consumers để tránh cộng lặp.

## Xử lý rule không nhất quán

Docs hiện có các điểm cần xác minh trước khi bật endpoint liên quan:

- Bảng tổng quát nói dynamic theo response size, trong khi guide OHLCV ghi theo số nến requested; recent transactions ghi theo số record returned. Rule phải khai báo billing basis theo từng endpoint.
- Multi factor guide có `× Limit` trong công thức nhưng ví dụ không nhân limit; daily base ở bảng là 2000 còn ví dụ và bảng CU tổng là 200.
- Batch guide ghi base 25 cho net-worth-summary/multiple và 40 cho identity/multiple, trong khi bảng tổng lần lượt ghi 20 và 30.

Giữ `pricingStatus=verified|provisional|conflict|unknown`, nguồn và ngày xác minh. `verified` nghĩa là rule đã đối chiếu, vẫn không thay cho billing của request. Không âm thầm chọn công thức có số thấp hơn. Với `--max-cu`, chỉ dispatch khi có upper bound đáng tin cậy; trả `CU_BOUND_UNAVAILABLE` trước request nếu thiếu bound. Endpoint conflict ở roadmap không chặn xây các command MVP có rule rõ ràng.

Kiểm chứng billing basis OHLCV bằng key kiểm thử trên account có traffic được kiểm soát, nếu có thể; dùng catalog bound bảo thủ khi chưa xác định chính xác. Không hứa budget local là hard cap của hóa đơn toàn account.

## Ngân sách và skills

Các option dự kiến:

```bash
birdeye-cli token overview <address> --short --estimate-cu
birdeye-cli market trending --limit 20 --max-cu 50 --short
birdeye-cli workflow create --label token-research --max-cu 150
birdeye-cli token security <address> --workflow <id> --short
birdeye-cli usage show --workflow <id> --short
birdeye-cli usage credits --short
```

`--estimate-cu` chỉ tạo request plan và cost/bound từ catalog, không gọi Birdeye. `--max-cu` áp dụng cho invocation; nếu có workflow thì cả hai budget đều phải còn đủ. Budget reservation atomic ngăn các request song song cùng tiêu phần ngân sách còn lại. Reserve cả retry mới trước dispatch; request uncertain giữ reservation cho tới khi được xử lý rõ ràng. Reopen workflow không reset usage.

Ba skills `birdeye-token`, `birdeye-market`, `birdeye-portfolio` dùng workflow ID cho tác vụ nhiều command, ưu tiên `--short`, đặt limit rõ và đọc tổng CU từ ledger. Skills không tự duy trì bản sao công thức CU hoặc cộng usage snapshot lặp lại. Tóm tắt cuối workflow phải có data coverage, CU estimate, uncertain attempts và phần chưa hoàn thành. Gọi CLI thông thường không bắt buộc cấu hình AI key.

## Hợp đồng short output

`--short` là phép chiếu deterministic trên kết quả có cấu trúc, không gọi LLM để rút gọn. Áp dụng cho JSON, table và interface. JSON short được serialize một dòng; tên field giữ rõ nghĩa.

- Giữ identity token/wallet, chain, timestamp, đơn vị, metrics chính, pagination/coverage, cảnh báo và CU.
- Loại raw payload, metadata lặp, logo/social links và field không phục vụ command.
- Không cắt địa chỉ, làm tròn số trong JSON, biến null thành 0 hoặc bỏ cờ risk chỉ vì giá trị false/null.
- Không tự giảm `--limit`, lấy ít trang hơn hoặc đổi query. `--limit` điều khiển khối lượng dữ liệu; `--short` điều khiển biểu diễn.
- `--fields` ghi đè preset data fields, còn metadata CU/coverage/warnings bắt buộc vẫn giữ. Field không tồn tại trả lỗi trước request khi schema cho phép kiểm tra.
- List giữ toàn bộ rows đã chọn với các cột ngắn gọn. OHLCV short dùng `columns` + `rows` để tránh lặp tên field cho từng nến; không âm thầm downsample.
- Error short vẫn giữ code, retryable, hint cần thiết và usage đã phát sinh.
- Interface dùng chế độ tóm tắt mặc định cho câu trả lời và tool context; người dùng mở chi tiết local không gây request mới.

Ví dụ dữ liệu minh họa, không phải response thật:

```json
{"schemaVersion":1,"data":{"address":"<address>","priceUsd":1.25},"meta":{"chain":"solana","asOf":"2026-10-09T00:00:00Z","cu":{"estimated":3,"reported":null,"uncertainAttempts":0},"coverage":"complete","warnings":[]}}
```

Preset version phải ổn định trong schema version. Benchmark token trên fixture bằng tokenizer được chọn và ghi rõ tokenizer/version; mục tiêu giảm ít nhất 50% cho fixture overview/trending nhiều metadata, không áp mục tiêu đó cho response giá vốn ngắn. Không tuyên bố phần trăm token chung cho mọi model. `--short` không tự giảm CU của cùng một API request.

## Các bước triển khai và nghiệm thu

| Bước | Deliverable | Tiêu chí nghiệm thu | Ước lượng |
| --- | --- | --- | --- |
| 1 | Endpoint và pricing catalog | Mapping MVP, nguồn, rule version, conflict list, fixture | 1–2 ngày |
| 2 | CLI foundation + price | Config, client, errors, JSON/table, price chạy end to end | 2 ngày |
| 3 | UsageLedger + budgets | CU theo attempt, concurrent reservation, workflow totals | 2–3 ngày |
| 4 | Token/market/portfolio | Validation, pagination, null/precision, partial failure | 3–4 ngày |
| 5 | Short output + skills | Preset theo command, workflow ID, token benchmark | 2 ngày |
| 6 | Package và validation | Cài tarball, help, CI, smoke test có key riêng | 1–2 ngày |

Tổng core cập nhật: khoảng 11–15 ngày cho một engineer, phụ thuộc API access và xác minh billing. Interface triển khai theo plan riêng sau khi execution/usage contract ổn định.

Các test quan trọng: fixed CU; ceil theo batch chunk; ranh giới dynamic 100/101, 300/301, 1000/1001, 2000/2001; unknown billing basis; retry và timeout; cancel sau dispatch; crash recovery; hai tiến trình reserve cùng budget; workflow không double count; cache hit; short giữ warnings/null/precision/coverage; credits snapshot không bị quy về một command. Live test chạy tách biệt và báo CU test đã dùng.

Release gate: các lệnh API có accounting; rule mâu thuẫn được nhận diện; JSON sạch trên stdout; lỗi trên stderr có cấu trúc; key không lọt vào log; skills dùng contract chung; smoke test cài package thành công. Giai đoạn hiện tại chỉ tạo tài liệu, chưa có build hoặc test runtime.
