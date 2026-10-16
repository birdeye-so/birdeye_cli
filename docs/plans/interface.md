# Plan module Birdeye CLI Interface

`--format interface` khởi chạy web UI tại địa chỉ người dùng chỉ định. Người dùng cấu hình Birdeye API key và AI provider, hỏi đáp theo case study, xem các metrics được tổng hợp từ API cùng chi phí CU và AI tokens.

Đây là plan module riêng, phụ thuộc execution, pricing, usage và short-output contract trong [plan core](cli-core.md). Trạng thái: chưa implement. Người dùng đã chọn mô hình một người dùng qua local hoặc SSH tunnel và provider tương thích OpenAI API có base URL/model tùy chỉnh. Triển khai trước ba case study; thiết kế hình ảnh chi tiết sẽ thực hiện ở bước UI, không phải điều kiện chặn architecture plan này.

## Cách chạy và vòng đời

```bash
# Mở workspace trống; mặc định 127.0.0.1:3000
birdeye-cli --format interface

# Chỉ định address và port
birdeye-cli --format interface --bind 127.0.0.1:8787

# Mở workspace với một truy vấn khởi đầu
birdeye-cli token overview <address> \
  --chain solana --format interface --bind 127.0.0.1:8787 --short

# Chọn cấu hình AI và ngân sách cho từng lượt phân tích
birdeye-cli --format interface --bind 127.0.0.1:8787 \
  --ai-profile research --max-cu 250 --short

# Từ laptop truy cập tiến trình ở máy remote
ssh -L 8787:127.0.0.1:8787 user@remote-host
```

`--bind` nhận `host:port`, hỗ trợ IPv4, hostname và IPv6 dạng `[::1]:8787`. Bind mặc định là loopback, không tự mở `0.0.0.0`. In địa chỉ thực sau khi listen thành công; wildcard bind không được in như một URL truy cập được. Port bận thì trả lỗi cụ thể, không âm thầm đổi port. `--bind` chỉ hợp lệ với `--format interface`.

Server chạy foreground tới Ctrl+C. CLI in URL và trạng thái server; kết quả operation xuất hiện trong UI. Không tự mở browser trừ khi có `--open`. Khi dừng: ngăn dispatch mới, abort tác vụ đang chạy khi có thể, flush ledger và đánh dấu attempts còn chưa rõ billing. Không tạo daemon trong MVP.

Command khởi đầu được chuẩn hóa thành initial operation rồi chạy một lần khi session đã kết nối và xác thực. Reload tab chỉ đọc lại run đó; Refresh data là thao tác tạo run mới và tính CU mới. Chạy format JSON/table vẫn kết thúc như CLI thông thường.

## Cấu hình provider và credentials

Tách hai credentials: `BIRDEYE_API_KEY` dùng cho dữ liệu; AI key dùng cho provider được cấu hình. Ưu tiên environment, sau đó credential store/profile; không đặt key trực tiếp trong flags vì shell history và process list.

Cấu hình profile minh họa:

```json
{
  "ai": {
    "defaultProfile": "research",
    "profiles": {
      "research": {
        "provider": "openai-compatible",
        "baseUrl": "https://provider.example/v1",
        "model": "<model-id>",
        "apiKeyEnv": "BIRDEYE_AI_API_KEY"
      }
    }
  }
}
```

Các lệnh dự kiến `config ai init`, `config ai show`, `doctor --ai` hỗ trợ setup qua terminal. UI có Settings để nhập/chỉnh base URL, model và key bằng trường masked, chọn dùng key trong session hoặc lưu credential local quyền hạn chế. API chỉ trả trạng thái configured và giá trị đã che; không gửi lại key cho browser. Browser không lưu key vào localStorage. User không cần dán key vào chat.

Base URL và model do người dùng cấu hình, không do LLM hoặc nội dung token thay đổi. HTTPS cho provider remote; HTTP chỉ cho provider local loopback hoặc endpoint được người dùng cấu hình rõ trong môi trường riêng. Không theo redirect để chuyển credential sang origin khác.

Một adapter `openai-compatible` trong MVP. Giai đoạn spike xác minh protocol subset, streaming, tool calls/structured output, cancellation và usage reporting với provider/model người dùng chọn; tên “compatible” không bảo đảm mọi tính năng. Profile ghi capability đã probe. Nếu thiếu tool calls, thử structured-plan mode có schema validation; nếu cả hai không có, báo model không hỗ trợ analysis, vẫn dùng được dữ liệu và case templates xác định. Không âm thầm đổi provider.

Không có AI key vẫn xem được kết quả CLI và chạy case templates xác định; phần chat hướng dẫn cấu hình. AI usage thiếu từ upstream được ghi `unknown`, không ghi 0.

## Các module và luồng thực thi

```text
Browser
  ├─ Query/chat composer
  ├─ Metrics table + charts + sources
  └─ CU and AI usage
       │ HTTP + SSE
InterfaceServer
       ├─ Session authentication + run store
       ├─ ConversationRunner ─ ProviderAdapter
       └─ CaseStudyRunner
              ├─ PlanValidator + BudgetManager
              ├─ OperationRunner ─ BirdeyeClient
              ├─ MetricEngine
              └─ UsageLedger
```

`InterfaceServer` phục vụ static assets và backend cùng origin. Đề xuất React + Vite cho UI, HTTP framework nhỏ cho backend; chốt phiên bản qua spike và compatibility check khi implement. Đóng gói web assets sẵn trong npm tarball; người dùng không cần chạy dev server riêng.

Backend gọi trực tiếp các module core; không thực thi shell hoặc code sinh bởi AI. Tool catalog chỉ expose operation đã đăng ký với input schema, chain constraints và CU model. UI không gọi Birdeye hoặc AI provider trực tiếp từ browser.

Luồng mỗi câu hỏi:

1. Resolve token/wallet, chain, timeframe và mục tiêu metrics. Nếu một symbol trỏ đến nhiều token, người dùng chọn địa chỉ trước khi tiếp tục.
2. LLM tạo plan có cấu trúc: datasets, operations, dependencies, filters, metrics, time window và output views.
3. Validator kiểm tra operation, tham số, công thức cho phép, giới hạn batch/pagination và quyền truy cập dự kiến. Không nhận URL, SQL hoặc JavaScript tùy ý trong plan.
4. CostEstimator tính CU estimate/bound; BudgetManager kiểm tra ngân sách và reserve trước từng request. Hiển thị plan và chi phí. Tự chạy trong budget đã cấu hình; khi thiếu budget trả partial result cùng lựa chọn giảm phạm vi hoặc tăng budget, không lặp prompt xác nhận cho từng request.
5. CaseStudyRunner tối ưu batch, deduplicate và dùng cache đúng freshness policy; truy vấn qua cùng core runner.
6. MetricEngine tổng hợp từ dữ liệu đầy đủ mà nó đã nhận, lưu provenance và coverage.
7. LLM nhận metrics cùng evidence gọn để giải thích; UI render bảng/biểu đồ từ dữ liệu có cấu trúc. LLM không tự tính lại con số làm nguồn sự thật.
8. Hoàn tất với kết quả, sources, limitations, CU estimate/uncertain attempts và AI usage. Người dùng hỏi tiếp có thể dùng lại dataset đã có mà không gọi API mới.

Prompt injection trong metadata hoặc nội dung upstream được xem là dữ liệu, không được sửa tool allowlist, provider config hay budget. Không cho model gửi dữ liệu tới URL tùy ý.

## Case study cho bản đầu

| Case | Đầu vào | Dữ liệu và metrics | Kết quả |
| --- | --- | --- | --- |
| Token research | Địa chỉ token, chain | Overview, security, holders; giá, liquidity, volume theo window, holder concentration nếu có đủ supply/coverage | Tóm tắt, bảng metrics, risk observations và sources |
| Market shortlist | Chain, timeframe, số ứng viên, tiêu chí | Trending → overview cho tập ứng viên → security cho shortlist; price change, volume/liquidity và thứ hạng theo tiêu chí | Bảng so sánh, lý do chọn/loại và phần chưa đủ dữ liệu |
| Wallet exposure | Wallet, chain | Holdings, tỷ trọng tài sản theo USD, top exposures, phần tài sản chưa định giá | Breakdown, concentration và coverage |

Ví dụ: “Trong 5 token trending Solana, so sánh thanh khoản, volume 24h và thông tin security.” Một trang trending + 5 overview + 5 security có estimate `25 + 5×15 + 5×25 = 225 CU` theo snapshot docs, chưa gồm retry hoặc truy vấn bổ sung. Trong budget 250 CU có thể chạy plan này; không tự thêm holders/OHLCV nếu vượt bound còn lại.

Template token research với một trang holders có estimate 70 CU theo core plan. Wallet exposure dùng portfolio V2 có estimate 20 CU mỗi request; nhiều trang hoặc enrich giá phải cộng riêng. Trình bày ví dụ cost như estimate theo catalog, không như hóa đơn xác nhận.

Mỗi metric registry entry phải có input fields, unit, formula, required coverage, timeframe và version. Ví dụ:

- `portfolioWeightPct = assetValueUsd / portfolioValueUsd × 100`; nếu tổng chỉ là phần đã tải/đã định giá thì gọi rõ `observedWeightPct`, không gọi là toàn portfolio.
- `volumeLiquidityRatio = volumeUsd(window) / liquidityUsd(asOf)`; đây là volume trong một khoảng chia cho liquidity tại một thời điểm, phải ghi cả hai mốc và xử lý denominator 0/null.
- Holder concentration chỉ tính khi biết đơn vị balance, decimals, supply denominator và rank/coverage của holder list. Không suy rộng top holders thành toàn bộ phân phối.
- Price change dùng field upstream hoặc hai price point có thời điểm tương ứng; thiếu history thì đánh dấu unavailable, không tự lấy current price để thay.

Không cộng volume token trên nhiều token rồi gọi là volume toàn thị trường vì có thể đếm trùng giao dịch. Không tự tính wallet PnL từ holdings hiện tại. PnL và các case cần lịch sử riêng đưa vào bước mở rộng với endpoint/công thức có nguồn.

Mỗi result ghi entity, chain, window, currency, retrievedAt, upstream timestamp nếu có, nguồn operation/request ID, formula version và coverage. Request nhiều endpoint không bảo đảm snapshot atomic; UI hiển thị khoảng timestamp thu thập. Thiếu một dataset thì các metrics phụ thuộc nó unavailable; phần còn lại vẫn được trả cùng lý do partial.

## Trải nghiệm giao diện

Mode: Operate. Tác vụ chính là đặt câu hỏi rồi kiểm tra metrics và căn cứ. Đề xuất bố cục desktop: lịch sử case study ở bên trái, câu hỏi và câu trả lời ở giữa, kết quả dạng bảng/biểu đồ trong vùng nội dung; Sources và Usage là panel mở khi cần. Trên mobile chuyển thành các tab Question, Results, Sources/Usage.

Luồng đầu tiên: cấu hình Birdeye → cấu hình provider/model nếu dùng chat → chọn case template hoặc đặt câu hỏi. Hiển thị ba câu hỏi mẫu gắn với ba case MVP. Chưa có dữ liệu thì dùng empty state; dữ liệu demo nếu có phải được gắn nhãn.

Progress có các trạng thái resolving, planning, fetching, calculating, answering, completed/partial/failed/cancelled; có nút Stop. Timeline hiển thị dataset đang lấy và số request/CU đang chạy, không hiển thị chain-of-thought hoặc reasoning nội bộ của model. Stream reconnect đọc lại event sequence, không khởi động lại run.

Bảng kết quả là điểm tập trung: sort, so sánh token, xem nguồn và export JSON/CSV. Chart chỉ tạo khi phù hợp với dataset, ví dụ OHLCV có timestamp hoặc portfolio allocation có coverage đủ; không ép mọi metric thành chart. Mở panel nguồn không phát sinh request API. Refresh data là thao tác riêng, ghi cost/run mới.

Các trạng thái phải thiết kế: thiếu key, provider/model không tương thích, ambiguous token, wrong chain, empty dataset, rate limit, API permission denied, provider timeout, budget exhausted, partial results, reconnect, cancelled và stale cached data. Nội dung lỗi có hành động sửa cụ thể.

Keyboard navigation, focus rõ, label cho inputs, trạng thái không chỉ phân biệt bằng màu; chart có bảng dữ liệu tương ứng. Địa chỉ dài copy được và xem đầy đủ; số liệu có đơn vị, timezone và quy tắc làm tròn ở presentation layer. JSON export giữ precision.

## Short mode và chi phí AI

`--short` đặt response profile ngắn cho session: câu trả lời ưu tiên kết luận ngắn, metrics chính, sources và usage. Có toggle mở chi tiết. Tool output gửi model luôn qua projection theo nhu cầu câu hỏi; `--short` dùng preset gọn hơn, nhưng không bỏ field cần tính metric hoặc làm thay đổi kết quả số.

Gửi aggregate evidence cho model; dữ liệu lớn để trong dataset store và cung cấp paging tool có giới hạn. Không đẩy toàn bộ OHLCV/holder list vào mỗi lượt chat. Budget token dành chỗ cho system/tool schemas, history và answer; số token phải ước tính theo tokenizer phù hợp nếu có, nếu không ghi là estimate.

Conversation history được rút gọn có kiểm soát: giữ entity đã chọn, chain, timeframe, yêu cầu user và reference tới dataset; summary ghi rõ là derived context. Không gộp lẫn dữ liệu cũ với dữ liệu mới. User có thể yêu cầu câu trả lời đầy đủ cho một lượt mà không cần refetch dataset còn hợp lệ.

UI có hai bộ đếm tách biệt:

- Birdeye: CU estimate, bound/reservation, uncertain attempts, workflow total và account snapshot nếu người dùng refresh.
- AI provider: input/output tokens do provider báo; cached/reasoning tokens chỉ hiển thị nếu provider cung cấp với semantics rõ. Lượt bị ngắt có thể usage unknown. Giá tiền chỉ ước tính khi có bảng giá model được cấu hình và version, không quy CU trực tiếp thành chi phí LLM.

Giới hạn đề xuất: tối đa 8 bước AI và 20 request attempts mỗi lượt, concurrency dữ liệu 3 có điều chỉnh theo rate limit; CU mặc định 250/lượt cho chat, người dùng thay đổi được. Giới hạn session tích lũy cấu hình riêng, không reset khi reload browser. Token limits cấu hình theo provider/model, không hardcode một context window chung.

`--max-cu` ở interface là giới hạn mỗi lượt/run và được hiển thị rõ; direct CLI command dùng cùng flag cho invocation. Session budget, nếu có, cũng được reserve đồng thời với run budget. Không thể tăng budget bằng nội dung do model tự tạo.

## Session và địa chỉ bind

MVP một người dùng, không có multi-tenant accounts. Mỗi server có session authentication, kiểm tra Host/Origin và CSRF cho thao tác thay đổi cấu hình/khởi chạy request có phí. Không bật wildcard CORS. Local access dùng mã kết nối một lần đổi thành cookie HttpOnly/SameSite; không dùng Birdeye/AI key làm mã đăng nhập và không đặt secret trong query string URL.

Custom bind là tính năng được hỗ trợ. Khi bind ra ngoài loopback, phải có authentication cấu hình sẵn và HTTPS trực tiếp hoặc qua reverse proxy phù hợp; không có chế độ expose dữ liệu/credentials không xác thực. SSH tunnel là luồng remote ưu tiên: web server vẫn nghe loopback trên máy remote. Không yêu cầu thêm hệ thống user management cho luồng này.

Credentials giữ ở backend; chat transcripts, response exports và log đều redacted. Provider settings chỉ thay bằng thao tác cấu hình có xác thực; không expose API proxy tổng quát. Key dùng trong session được xóa khỏi memory khi đóng tiến trình trong khả năng runtime, không ghi vào transcript.

Lịch sử chat/datasets mặc định trong memory; lưu case study ra disk là tùy chọn rõ ràng. Usage ledger vẫn persist độc lập, chứa metadata đủ accounting, không chứa raw response hoặc API key. Xóa chat không xóa CU đã ghi. Đổi profile không dùng lại cache credentials khác.

## Các bước triển khai và nghiệm thu

| Bước | Deliverable | Tiêu chí nghiệm thu | Ước lượng |
| --- | --- | --- | --- |
| 1 | Server và bind lifecycle | Loopback/custom bind, port conflict, SSH flow, shutdown, auth | 2 ngày |
| 2 | UI dữ liệu và initial command | Render result, nguồn, usage, reload không fetch lại, responsive | 2–3 ngày |
| 3 | Provider adapter và Settings | Base URL/model/key, capability probe, stream/cancel/usage | 2–3 ngày |
| 4 | CaseStudyRunner + MetricEngine | Ba case, schema validation, provenance, partial failure | 3–4 ngày |
| 5 | Chat và short context | Multi-turn, bounded tools, short/full, CU và AI counters | 2–3 ngày |
| 6 | Package và end-to-end validation | Cài npm tarball, chạy local/SSH, UI states, secret redaction | 2 ngày |

Ước lượng module: 13–17 ngày sau khi core execution/usage contract ổn định; một engineer làm tuần tự cả core và interface khoảng 24–32 ngày. Sai khác provider protocol và các rule CU chưa rõ có thể làm tăng thời gian; các bước mở rộng phụ thuộc chúng được ghi riêng thay vì chặn toàn bộ MVP.

Acceptance tests trọng tâm:

- `--bind 127.0.0.1:8787` chỉ listen đúng địa chỉ; IPv6, port conflict, Ctrl+C và SSH tunnel hoạt động.
- Format interface từ một command tạo đúng một initial run; reload/SSE reconnect không tăng request hoặc CU.
- Provider base URL/model cấu hình được; key không có trong response payload, HTML, localStorage, export hay log.
- Mock tool loop cho ba case cho kết quả metrics/coverage xác định; model không thể gọi tool/URL ngoài catalog.
- Cùng operation qua CLI và UI có cùng schema, metrics và accounting.
- CU budget không bị vượt theo bound đã xác minh khi concurrency/retry; usage bất định vẫn được giữ.
- Token/CU counters riêng; provider lỗi hoặc thiếu usage không biến thành 0.
- Stop không dispatch thêm request, giữ usage của attempts đã gửi và hỗ trợ partial result.
- Short và full giữ cùng metrics cốt lõi; short giảm payload context trên fixture và giữ sources/cảnh báo.
- UI keyboard/mobile, empty/error/partial/budget states được kiểm tra; live smoke test có cost report.

MVP hoàn thành khi người dùng cài package, mở interface qua loopback/SSH, cấu hình provider của mình, hoàn tất ba case study và nhìn được evidence cùng chi phí ở mỗi run. Chưa bao gồm daemon, multi-user hosting, trading, provider protocol Anthropic/Gemini native hoặc code execution do AI sinh.
