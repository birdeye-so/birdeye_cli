# Birdeye CLI

CLI dữ liệu Solana với CU accounting, output `--short` và giao diện local để nghiên cứu token, thị trường và danh mục ví. Bản đầu dùng Birdeye API cho dữ liệu và provider OpenAI-compatible do bạn cấu hình cho hỏi đáp AI.

## Chạy thử

Yêu cầu Node.js **22.16 trở lên**. Phiên bản Node 22 có thể in cảnh báo experimental cho SQLite; dữ liệu JSON vẫn nằm riêng trên stdout.

```bash
npm install
npm run build
node dist/index.js --format interface --bind 127.0.0.1:8787 --short
```

Mở URL được in trong terminal. Browser tự kết nối khi bind loopback (`127.0.0.1`, `localhost`, `::1`), kể cả sau restart; SSH tunnel vào loopback cũng dùng cách này. Vào **Settings** để thêm Birdeye key, AI base URL, model và AI key. **Save connections mặc định lưu vào SQLite local**, nên restart vẫn giữ key và cấu hình provider. Bỏ chọn “Save keys and provider settings on this machine” nếu chỉ muốn áp dụng trong session hiện tại. Credentials qua environment được ưu tiên hơn cấu hình đã lưu.

Chưa cần key để thử preflight:

```bash
node dist/index.js token overview So11111111111111111111111111111111111111112 --estimate-cu --short
node dist/index.js capabilities --short
node dist/index.js doctor
```

Sau khi build, có thể dùng `npm pack` để tạo npm tarball rồi cài bằng `npm install -g ./birdeye-cli-0.4.0.tgz`. Package chưa được publish lên npm registry.

## CLI dữ liệu

Đặt `BIRDEYE_API_KEY` trong môi trường, hoặc chạy `config init` để nhập key ẩn. Không truyền key trong command flags.

```bash
birdeye-cli token price <token-address> --short
birdeye-cli token overview <token-address> --format table
birdeye-cli token security <token-address> --short
birdeye-cli token holders <token-address> --limit 10 --mode wallet --short
birdeye-cli market trending --interval 1h --limit 5 --short
birdeye-cli market ohlcv <token-address> --from 1791417600 --to 1791504000 --interval 1H --short
birdeye-cli portfolio holdings <wallet-address> --limit 20 --short

birdeye-cli case token-research --address <token-address> --max-cu 100 --short
birdeye-cli case market-shortlist --limit 5 --max-cu 250 --short
birdeye-cli case wallet-exposure --address <wallet-address> --short
```

`--short` giữ metrics chính, identity, nguồn, coverage, cảnh báo và CU; loại metadata dư, dùng JSON một dòng. Với analysis, short giữ metrics, security observations và preview tối đa 5 dòng mỗi mảng trong source; `outputTruncation` ghi rõ phần rút gọn. Full output giữ toàn bộ dataset đã tải. Cùng request thì short không giảm CU. Các giá trị vượt precision an toàn của JavaScript được giữ bằng string, số liệu tính toán dùng BigNumber. Table là biểu diễn đọc nhanh, JSON là định dạng cho automation.

List trả một trang. Dùng `--limit`/`--offset` để chọn trang tiếp theo; không có tự động tải toàn bộ. Holdings loại tài sản thanh khoản thấp theo mặc định của upstream. `observedWeightPct` tính trên tài sản đã định giá của trang đã tải, không phải toàn ví.

## CU và workflow

```bash
birdeye-cli workflow create --label research --max-cu 150 --short
# Dùng ID trả về cho các lệnh tiếp theo
birdeye-cli token overview <address> --workflow <id> --short
birdeye-cli token security <address> --workflow <id> --short
birdeye-cli usage show --workflow <id> --short
birdeye-cli usage credits --short
```

- SQLite local ghi từng request attempt, run và workflow. Retry/pagination được tính riêng; reservation atomic giữa nhiều tiến trình.
- `--max-cu` mặc định 250, chặn dispatch khi không còn đủ budget theo catalog. `--workflow` áp dụng thêm budget tích lũy của workflow.
- `estimated` là CU tính theo docs; `reported` để null vì docs chưa có billing xác nhận riêng cho request.
- `budgetUsed` gồm request đã hoàn tất và reservation của request pending/uncertain. Timeout, cancel hay crash không được coi là request miễn phí.
- OHLCV range dùng bound bảo thủ 100 CU. Các rule CU còn mâu thuẫn ngoài phạm vi MVP chưa được bật.
- Credits snapshot là usage toàn account. Refresh credits tốn 1 CU và không được quy thành usage của một command.

Catalog dựa trên snapshot docs local `b34378ea9a1aad2c22934903ded124cd84729d3f`; endpoint và phiên bản hiện trong `capabilities`. `--estimate-cu` không gọi mạng. Budget local là giới hạn theo catalog, không phải hard cap hóa đơn Birdeye.

## AI và interface

```bash
birdeye-cli config ai init --base-url https://your-provider.example/v1 --model your-model --api-format responses
# Cấu hình BIRDEYE_AI_API_KEY trong môi trường, hoặc nhập key trong Settings
birdeye-cli doctor --ai
birdeye-cli --format interface --bind 127.0.0.1:8787 --ai-profile research --max-cu 250 --session-max-cu 2000
```

Provider cần hỗ trợ **Responses API** (`--api-format responses`, endpoint `/responses`) hoặc **Chat Completions** (`--api-format chat-completions`, endpoint `/chat/completions`) và function/tool calling. Trong UI chọn **Settings → AI provider → API format**. Base URL là gốc API, ví dụ `https://api.openai.com/v1`; không thêm `/responses` hay `/chat/completions` vào URL này. Profile mới mặc định Responses; profile cũ thiếu `apiFormat` vẫn dùng Chat Completions. Chạy lại `config ai init` giữ format hiện có nếu không truyền `--api-format`.

Responses dùng `input`, `function_call_output`, `max_output_tokens`, giữ nguyên output/reasoning items giữa các vòng tool và gửi `store: false`. Tool schema dùng `strict: false` để giữ các tham số tùy chọn của CLI; host vẫn validate input trước khi gọi Birdeye. Triển khai theo [OpenAI Docs — function calling](https://developers.openai.com/api/docs/guides/function-calling). Token usage lấy từ `input_tokens`/`output_tokens`; response incomplete báo lỗi, không chạy các tool chưa hoàn tất, và vẫn ghi nhận usage nếu có.

Interface stream **tiến độ tác vụ** qua SSE; câu trả lời AI được gửi khi provider hoàn tất, chưa stream từng token hoặc có structured-plan fallback. `doctor --ai` dùng format đã chọn để kiểm tra request cơ bản, không chứng nhận tất cả tính năng provider.

AI chỉ gọi các operation có trong catalog. Các metrics được tính ở host; source data và phần thiếu dữ liệu được lưu trong run. Mỗi lượt chat giới hạn 8 bước AI và 20 request attempts. Workflow trực tiếp giới hạn attempts theo số bước tối đa và một lần retry mỗi request. Budget CU mỗi lượt và session độc lập; AI token usage được báo riêng, không đổi trực tiếp thành USD. Nếu provider không báo usage thì ghi unknown.

Chín workflow và hai case cũ chạy được mà không có AI key. `cases --short` liệt kê tên và loại địa chỉ cần nhập. Chat cần AI key. Reload/reconnect chỉ đọc lại run; Refresh hay gửi câu hỏi mới có thể phát sinh phí mới. Hội thoại, input, dataset đầy đủ và kết quả được lưu vào SQLite. Chat mặc định dùng docs và dữ liệu đã lưu; bật Allow new Birdeye requests để cho phép lấy dữ liệu mới. Mỗi câu hỏi mới có thể phát sinh AI tokens.

Mở interface với dữ liệu khởi đầu:

```bash
birdeye-cli token overview <address> --format interface --bind 127.0.0.1:8787
```

Remote qua SSH:

```bash
# Trên server
birdeye-cli --format interface --bind 127.0.0.1:8787
# Trên laptop, rồi mở http://127.0.0.1:8787
ssh -L 8787:127.0.0.1:8787 user@remote-host
```

Bind ngoài loopback yêu cầu `--tls-cert` và `--tls-key`; wildcard bind cần thêm `--public-url https://hostname:port` để xác minh Host/Origin. Local browser cùng origin tự nhận session cookie HttpOnly; Host/Origin và Fetch Metadata vẫn được kiểm tra. Dùng `--require-code` để bắt nhập code cả trên loopback. Bind remote hoặc dùng `--public-url` luôn cần code. Không đưa API key vào browser storage. Port bận trả lỗi; Ctrl+C dừng server và giữ lại usage đã phát sinh.

Cấu hình và ledger mặc định ở `~/.config/birdeye`; thay bằng `BIRDEYE_CONFIG_DIR` hoặc `--config-dir`. Luôn dùng cùng thư mục khi restart để đọc lại cấu hình đã lưu. `doctor --short` hiển thị đường dẫn database, không gọi API.

| File | Nội dung |
| --- | --- |
| `config.sqlite` | Birdeye API key, AI profiles, base URL, model, API format, tên biến môi trường chứa key, AI key đã lưu và default profile |
| `usage.sqlite` | CU ledger, workflow budgets, request attempts, saved runs/datasets/chat và chỉ mục knowledge base |

Database cấu hình có permission `0600`; thư mục mới tạo dùng `0700`. Key nằm trong database local, không mã hóa; UI và `config show` chỉ trả trạng thái đã cấu hình, không trả key. Không đưa key vào browser storage. Environment override chỉ áp dụng khi chạy và không tự ghi đè key trong SQLite.

Nếu có `config.json` cũ, lần đọc đầu tiên tự nhập vào SQLite khi database chưa có cấu hình. File JSON cũ được giữ nguyên làm bản dự phòng; sau khi nhập, SQLite là nguồn chính và CLI không ghi lại JSON. Lỗi cấu hình hoặc database được báo rõ, không tự reset key. Cấu hình chỉ lưu trong memory ở phiên cũ không thể khôi phục sau khi tắt server; cần nhập và Save một lần.

Chế độ chỉ dùng session không xóa cấu hình đã lưu trước đó: restart sẽ dùng lại bản SQLite. Lịch sử chat và dataset được lưu trong usage.sqlite; connection code và các tùy chọn chạy như bind/CU budget vẫn theo phiên hoặc cờ CLI. Dữ liệu trong thư mục cấu hình là local riêng tư, không commit vào repo.

## Workflow nghiên cứu

Bộ [chín workflow Birdeye CLI](docs/workflows/README.md) đối chiếu với GMGN theo mục đích: token research, due diligence, deep report, wallet analysis, smart money, risk warning, early screening, daily brief và market opportunities. Mỗi recipe ghi input, thứ tự gọi, CU, điều kiện dừng và kết quả cần trả.

Xem [phân tích workflow GMGN](docs/research/gmgn-workflows.md) và [mapping dữ liệu/API Birdeye](docs/research/birdeye-workflow-mapping.md) để biết dữ liệu nào tương đương, khác ý nghĩa hoặc chưa có wrapper. `workflow create` là nhóm ngân sách tích lũy; `case <kind>` thực thi recipe. Bản 0.4.0 có 35 data operations và 22 workflows (11 từ Birdeye Data Skills, 11 case trước đó), dùng chung registry cho CLI/AI/interface.

### Workflow chạy được ở 0.2.0

```bash
node dist/index.js cases --short
node dist/index.js case token-research --address So11111111111111111111111111111111111111112 --depth full --estimate-cu --short
node dist/index.js case market-opportunities --scan-limit 50 --limit 3 --estimate-cu --short
node dist/index.js case early-project-screening --stage near-graduation --source pump_dot_fun --min-progress 80 --limit 3 --estimate-cu --short
```

Các lệnh trên không gọi API. Để chạy thật, bỏ `--estimate-cu`, cấu hình Birdeye key và đặt `--max-cu` phù hợp. Một ví dụ live:

```bash
node dist/index.js case market-opportunities --scan-limit 50 --limit 3 --max-cu 160 --short
```

Base estimate của ví dụ là 145 CU (25 discovery + 3 × 40 enrich), chưa retry. Shortlist xếp theo `volume24hUSD` trong trang đã lấy; `market-shortlist` cũ vẫn chỉ enrich các token đầu trang.

| Workflow | CU base mặc định, chưa retry |
| --- | ---: |
| `token-due-diligence` | 40; full 100 |
| `token-research` | 70; full 130 |
| `project-deep-report` | 240, gồm OHLCV reserve 100 |
| `wallet-analysis` | 50; full tối đa 200 với 3 vị thế |
| `smart-money-profile` | 235 cho tối đa 3 ví từ ranking; 70 nếu có `--address` |
| `risk-warning` | 70; full 180 |
| `early-project-screening` | 225 cho tối đa 3 token từ meme list |
| `daily-brief` | 130 cho tối đa 2 token; full 220 |
| `market-opportunities` | 145 cho tối đa 3 token; full 250 |

Dùng `--estimate-cu` để xem kế hoạch thực tế sau khi đổi limit/depth. `--min-liquidity`, `--max-top10-pct`, `--exclude-freezeable` là tiêu chí người dùng chỉ định; thiếu field cần cho check thì dừng token đó và ghi `insufficient-data`. Top-10 policy dùng **token-account supply share**, không phải top-10 wallets. Report giữ `missing`, `outcomes`, `selections`, `scopeNotes`; exit code `5` nghĩa là kết quả một phần.

Trong interface, chọn workflow rồi bấm **Estimate CU** để xem chi phí miễn phí. Có thể mở kèm workflow khởi đầu:

```bash
node dist/index.js case token-research --address So11111111111111111111111111111111111111112 --depth full --format interface --bind 127.0.0.1:8787 --max-cu 150
```

Workflow khởi đầu chỉ dispatch sau khi kết nối; reconnect không chạy lại. Chat AI có `estimate_workflow` và `run_workflow`, cùng budget/ledger với các operation nguyên tử.

### Wrapper mới và preflight

Các cờ array nhận danh sách phân tách bằng dấu phẩy; cờ boolean của wrapper mới nhận giá trị `true` hoặc `false`. Xem `--help` và `capabilities` để lấy schema hiện tại.

```bash
node dist/index.js token holder-profile So11111111111111111111111111111111111111112 --include-zero-balance false --estimate-cu --short
node dist/index.js token holder-positions So11111111111111111111111111111111111111112 --labels dev,kol --limit 10 --estimate-cu --short
node dist/index.js token money-flow So11111111111111111111111111111111111111112 --wallet-tags smart_money,kol --frames 1h,24h --estimate-cu --short
node dist/index.js market smart-money --interval 1d --limit 10 --estimate-cu --short
node dist/index.js market new-listings --limit 10 --estimate-cu --short
node dist/index.js market chain-metrics --count 2 --estimate-cu --short
# Thay bằng wallet Solana cần nghiên cứu trước khi chạy
WALLET='dia-chi-vi-solana'
node dist/index.js portfolio pnl-summary "$WALLET" --duration 30d --pnl-method wac --estimate-cu --short
node dist/index.js portfolio pnl-details "$WALLET" --duration 30d --pnl-method wac --limit 20 --estimate-cu --short
node dist/index.js case wallet-analysis --address "$WALLET" --estimate-cu --short
```

Các ví dụ WSOL chỉ dùng kiểm tra cú pháp/estimate, không bảo đảm endpoint cohort hỗ trợ token này. Tracker có các token bị loại theo coverage upstream. Birdeye entitlement và response live cần kiểm tra với key thực tế; tests tự động dùng fixture, không xác nhận billing thực.

## Các lệnh chạy để test

Chạy từ thư mục repo. Các ví dụ dùng `node dist/index.js` nên không cần cài CLI global.

### 1. Kiểm tra tự động — không cần key, không tốn CU

```bash
npm ci
npm run typecheck
npm test
npm run build
```

Kỳ vọng: các lệnh kết thúc với exit code `0`. `npm test` biên dịch và chạy tests core, CLI và HTTP handler với upstream giả lập; không gọi Birdeye hoặc AI thật.

Browser smoke test chạy riêng, cần Chrome và quyền mở cổng loopback:

```bash
# macOS có Google Chrome ở vị trí mặc định
npm run test:browser

# Hoặc chỉ định executable Chrome, ví dụ trên Linux
CHROME_PATH=/usr/bin/google-chrome npm run test:browser
```

Test browser dùng fixture, kiểm tra kết nối, token research, reload không tăng CU và layout mobile. Kỳ vọng có dòng `Browser smoke passed`; screenshot lưu tại `.impeccable/review/desktop.png` và `mobile.png`.

### 2. CLI và ước tính CU — không gọi API

```bash
node dist/index.js --help
node dist/index.js capabilities --short
node dist/index.js doctor
node dist/index.js token price So11111111111111111111111111111111111111112 --estimate-cu --short
node dist/index.js case token-research --address So11111111111111111111111111111111111111112 --estimate-cu --short
node dist/index.js usage show --short
```

Kỳ vọng: estimate cho price là **3 CU**, token research là **70 CU** theo catalog hiện tại. Estimate không gửi request và không tăng usage; `usage show` đọc ledger local.

### 3. Birdeye live và budget — cần Birdeye key

Nhập key ẩn bằng `config init`, hoặc cấu hình sẵn biến môi trường `BIRDEYE_API_KEY`. Các lệnh live dưới đây phát sinh CU thật; số CU nêu là ước tính mỗi lần gọi thành công, chưa tính retry.

```bash
node dist/index.js config init
node dist/index.js doctor --live --short
node dist/index.js token price So11111111111111111111111111111111111111112 --max-cu 3 --short
node dist/index.js case token-research --address So11111111111111111111111111111111111111112 --max-cu 100 --short
node dist/index.js usage show --short
```

Kỳ vọng: `doctor --live` dùng 1 CU, price dùng 3 CU, research dùng 70 CU khi đủ dữ liệu và không retry. Kết quả kèm CU; ledger tăng tương ứng các request attempts.

Sau khi đã cấu hình key, thử chặn request vượt budget:

```bash
node dist/index.js token price So11111111111111111111111111111111111111112 --max-cu 2 --short
```

Kỳ vọng: lỗi `CU_BUDGET_EXCEEDED`, exit code `4`; không gửi request Birdeye và không tiêu thêm CU.

### Workflows theo Birdeye Data Skills

UI có 11 skill theo source `./birdeye-data-skills`, chia **Discover / Token / Wallet**. Các case cũ nằm trong **Earlier workflows**. Xem [workflow, mục đích, API steps, CU và các điểm điều chỉnh](docs/workflows/birdeye-data-skills.md).

```bash
# Preflight miễn phí
node dist/index.js case skill-trending-list --estimate-cu --short
node dist/index.js case skill-smart-wallets --skill-depth deep --limit 3 --estimate-cu --short
node dist/index.js case skill-wallet-analysis --address So11111111111111111111111111111111111111112 --intervals 7d,30d --estimate-cu --short
node dist/index.js case skill-smart-money-leaderboard --wallets So11111111111111111111111111111111111111112,11111111111111111111111111111112 --estimate-cu --short
```

Trong UI: chọn nhóm → skill → nhập subject và options → xem/chỉnh **Workflow overview** → kiểm tra CU → **Run research**. Wallet leaderboard nhận 1–10 ví; Kline/Wallet Score/Style và leaderboard có **Skill findings** cùng formula/evidence. Score thiếu dữ liệu sẽ là unavailable; Token/Contract DD không gắn nhãn an toàn từ dữ liệu thiếu. Liquidity history dùng dữ liệu liquidity thật và giữ upper-bound CU theo resolution.

### 4. Interface — bind địa chỉ local

```bash
node dist/index.js --format interface --bind 127.0.0.1:8787 --short --max-cu 100 --session-max-cu 300
```

Mở `http://127.0.0.1:8787`; browser tự kết nối local. Vào Settings để cấu hình key. Chỉ mở interface chưa gọi API.

Bind loopback chấp nhận Host `localhost`, `127.0.0.1` và `[::1]` trên cùng port; kết nối vẫn phải đến được địa chỉ đang listen. Nếu cấu hình `--public-url`, chỉ Host của URL đó được chấp nhận. Origin của browser phải khớp Host và protocol đang truy cập.

Trong terminal khác, kiểm tra không tốn CU:

```bash
curl -i http://localhost:8787/          # 200, HTML giao diện
curl -i http://127.0.0.1:8787/         # 200, HTML giao diện
curl -i http://localhost:8787/api/status # 401 khi chưa đăng nhập
curl -i -H 'Host: evil.test:8787' http://127.0.0.1:8787/ # 403
```

Nếu bản cũ trả `ORIGIN_DENIED` khi dùng `localhost`, dùng URL `127.0.0.1` hoặc build lại (`npm run build`) rồi dừng và khởi động lại interface.

1. Chọn case study, đọc **Purpose** và **What you get**. Mở **Workflow overview → Review API steps** để xem các bước kể cả khi chưa nhập địa chỉ: mục đích, thông tin lấy về, method/path API, nguồn subject và CU mỗi request. Xem hoặc chỉnh overview không gọi Birdeye.
2. Chọn **Earlier workflows → Token Research**, nhập `So11111111111111111111111111111111111111112`. Mở **Review API steps → Adjust parameters** ở bước **Top holders**, đổi **Rows per request** thành `3` và **Holder grouping** thành `token_account`. Overview kiểm tra lại tham số và hiển thị `70 CU before retries · at most 3 requests`.
3. Thử nhập `101` vào Rows per request: phải có lỗi ở bước holders và nút Run research bị khóa. Sửa về `3` hoặc dùng **Reset this step** để về mặc định `10`/`wallet`. **Reset all steps** xóa mọi chỉnh sửa riêng của các bước.
4. Chạy research khi tham số hợp lệ. Bước này dùng Birdeye CU thật, không cần AI key. Kiểm tra request params trong Sources: API holders phải nhận đúng `limit`/`mode` đã chọn. Kết quả JSON lưu `data.plan.input.stepOverrides` và `data.plan.steps` để đối chiếu.
5. Chọn **Earlier workflows → Wallet Analysis**, mở **Review API steps → PnL summary**, đổi **PnL period** hoặc **PnL accounting method**. Kiểm tra tham số/metrics của run mới khớp lựa chọn; sửa cửa sổ PnL không tự sửa cửa sổ trades hoặc các bước khác.
6. Reload trang, mở lại run và kiểm tra CU không tăng. Chạy lại research sẽ gửi request mới.
7. Nhấn `Ctrl+C` ở terminal để dừng server; `node dist/index.js usage show --short` vẫn đọc được ledger.

Tham số từng bước dùng cùng schema với API wrapper: số, enum, boolean và danh sách phân cách bằng dấu phẩy. Để trống một trường để dùng mặc định của recipe. Địa chỉ token/ví được kế thừa từ case hoặc kết quả bước trước; chỉnh địa chỉ chung ở đầu form. Thay đổi thiết lập workflow phía trên sẽ reset chỉnh sửa riêng của các bước. Tham số API của bước không thay đổi quy tắc chọn candidate/screening của workflow. Khoảng thời gian mặc định được cố định khi overview tải để plan và run khớp nhau; timestamp từng bước có thể sửa bằng Unix seconds. CU là upper bound trước retry, không nhất thiết tăng khi đổi số dòng trong một request.

Kiểm tra tự động (fixture, không dùng API key/CU thật):

```bash
npm run typecheck
npm test
npm run test:browser
```

Browser smoke kiểm tra overview khi chưa có địa chỉ, sửa/reset tham số, chặn input lỗi, request thực nhận tham số và layout mobile. Cần môi trường cho phép mở port local và chạy Chrome; sandbox chặn `listen` sẽ trả `EPERM`.

### 5. AI — cần provider, model và AI key

Chạy lệnh tương tác để nhập base URL và model của provider hỗ trợ OpenAI-compatible Responses/tool calling:

```bash
node dist/index.js config ai init --api-format responses
# Cấu hình BIRDEYE_AI_API_KEY trong môi trường trước khi chạy lệnh này
node dist/index.js doctor --ai --short
node dist/index.js --format interface --bind 127.0.0.1:8787 --ai-profile research --max-cu 100 --session-max-cu 300
```

`doctor --ai` phát sinh AI tokens; kỳ vọng `connected: true`, `apiFormat: "responses"` và usage nếu provider báo. Có thể nhập AI key trong Settings của interface thay cho biến môi trường; nếu chọn cách đó, kiểm tra chat trực tiếp trong UI. Với provider chỉ hỗ trợ Chat Completions, chạy `node dist/index.js config ai init --api-format chat-completions` hoặc đổi API format trong Settings.

Test Responses bằng upstream giả lập (không dùng key thật, không phát sinh CU/token):

```bash
npm run typecheck
npm test
npm run build
```

Suite kiểm tra Responses nhiều vòng tool, giữ reasoning items và `call_id`, dedup request Birdeye, giới hạn CU, usage khi incomplete, refusal, lỗi provider, cancellation, và khả năng đọc profile Chat Completions cũ. Sau khi build, restart interface để dùng UI mới.

### 6. Kiểm tra lưu key/config qua restart — không cần gọi API

```bash
npm run build
node dist/index.js --format interface --bind 127.0.0.1:8787 --config-dir "$HOME/.config/birdeye"
```

Trong Settings nhập Birdeye key, AI base URL/model/API format/key, giữ checkbox lưu trên máy và bấm **Save connections**. Dừng server bằng Ctrl+C rồi chạy lại cùng lệnh. Browser tự kết nối lại; Settings phải giữ provider/model/format và trạng thái **Configured**. Ô key vẫn trống để không hiển thị secret; để trống khi Save sẽ giữ key đã lưu nếu provider vẫn cùng origin.

Cũng có thể lưu từ CLI:

```bash
# Nhập Birdeye key ẩn (hoặc dùng BIRDEYE_API_KEY đã cấu hình)
node dist/index.js config init
# Nhập base URL/model và AI key ẩn; --save-key cũng nhận key từ biến môi trường của profile
node dist/index.js config ai init --api-format responses --save-key
# Các lệnh sau chỉ đọc local, không tiêu CU hoặc AI token
node dist/index.js config show --short
node dist/index.js config ai show --short
node dist/index.js doctor --short
```

`config ai init` giữ key đã lưu khi đổi model/API format cùng provider; đổi origin base URL sẽ bỏ key cũ. Không dùng `--save-key` thì key từ environment không được sao chép vào SQLite. Nếu dùng `--config-dir` tùy chỉnh, thêm cùng cờ đó vào các lệnh cấu hình/kiểm tra.

`npm test` có test SQLite qua tiến trình CLI mới, migration JSON một lần, restart HTTP handler, session-only, giữ key khi sửa profile, environment override, permission, dữ liệu lỗi và ghi thất bại. Các test dùng thư mục tạm và key giả.

### 7. Kiểm tra bản đang chạy và regression các skill migrate

Nếu `birdeye-cli` vẫn hỏi code hoặc không đọc SQLite, kiểm tra có đang dùng bản global cũ không:

```bash
command -v birdeye-cli
birdeye-cli --version
node dist/index.js --version
# Chạy trực tiếp bản workspace mới, bỏ qua binary global cũ
node dist/index.js --format interface --bind 127.0.0.1:8787
```

Bản sửa này là **0.4.0**. Có thể cập nhật bản global bằng tarball mới:

```bash
npm install -g ./artifacts/birdeye-cli-0.4.0.tgz
birdeye-cli --version
```

Test offline cả 11 recipe với request constraints trích từ OpenAPI và response fixtures theo source/docs:

```bash
npm run typecheck
npm test
npm run test:browser
```

`test:browser` cần quyền mở cổng và chạy Chrome. Test kiểm tra tự kết nối local, chọn skill theo nhóm/rail, chỉnh từng API step, Smart Wallets với response raw array, kết quả UI/JSON, history và overflow mobile. Trong sandbox hiện tại TCP listen (`EPERM`), Chrome launch và DNS upstream bị chặn; không coi các test fixture là kiểm chứng API live hay hình render thực tế.

Kiểm tra live Smart Wallets (cần key Birdeye đã lưu, phát sinh CU):

```bash
# Preflight miễn phí
node dist/index.js case skill-smart-wallets --skill-depth fast --scan-limit 20 --limit 1 --estimate-cu --short
# Tối đa 45 CU; budget không cho retry vượt mức này
node dist/index.js case skill-smart-wallets --skill-depth fast --scan-limit 20 --limit 1 --max-cu 45 --short
```

Kết quả có token list và trader dataset nếu upstream có dữ liệu, wallet shortlist dedup theo provider order. Empty/denied/missing checks vẫn được báo rõ. CU reserved được hiển thị cả khi billing chưa xác định; `0 estimated` không có nghĩa request lỗi miễn phí.

Chi tiết đối chiếu và lỗi đã sửa: [migration audit](docs/workflows/migration-audit.md).

Trong interface, thử hỏi: “Tổng hợp giá, thanh khoản, volume 24h và rủi ro của token So11111111111111111111111111111111111111112, kèm nguồn dữ liệu.” Kiểm tra câu trả lời, metrics, CU Birdeye và AI token usage. Chat có thể phát sinh cả CU lẫn AI tokens; kiểm tra `doctor --ai` thành công chưa bảo đảm provider hỗ trợ tool calling.

Trong sandbox triển khai ban đầu, TCP listen và Chrome launch bị chặn. Typecheck, build và tests trong tiến trình đã được kiểm tra; browser rendering, SSH thực tế và API live cần chạy trong môi trường có quyền mở cổng và credentials. Không dùng key thật trong test suite.

## Skills và phát triển

Ba skill có trong `skills/birdeye-token`, `skills/birdeye-market`, `skills/birdeye-portfolio`. Cài thư mục skill vào nơi agent của bạn đọc skills, và bảo đảm executable `birdeye-cli` nằm trên PATH. Skills dùng CU do CLI trả về, không nhân bản bảng giá.

Phạm vi tiếp theo: multi-chain, multi-price batching, pagination tự động, scheduler/WebSocket, provider capability probing/fallback, biểu đồ và kiểm thử live. Workflow hiện chạy một lần; không tự giao dịch, không backtest copy-trade ROI. Hai [plan core](docs/plans/cli-core.md) và [interface](docs/plans/interface.md) mô tả đích triển khai rộng hơn bản thử này.

### 8. Copy địa chỉ trong interface (0.4.0)

UI nhận diện chuỗi giải mã thành địa chỉ 32 byte: base58, base64 chuẩn và base64url (có hoặc không có padding). Địa chỉ có gạch chân chấm; click hoặc focus bằng Tab rồi Enter/Space để copy nguyên chuỗi. Ô trong bảng có thể rút gọn nhưng clipboard luôn nhận đầy đủ địa chỉ, giữ nguyên encoding. Có thông báo Copied; nếu browser từ chối clipboard, UI hiện đầy đủ địa chỉ để chọn/copy thủ công và giữ thông báo đến khi đóng hoặc copy lại.

Áp dụng trong metrics, wallet shortlist/leaderboard, AI findings, workflow subject, JSON/Plain và source/evidence. Nhận diện encoding không xác minh tài khoản tồn tại; không tự đổi base64 thành base58. API requests vẫn dùng địa chỉ Solana base58 như trước. Export JSON/CSV giữ dữ liệu gốc.

```bash
npm run typecheck
npm test
npm run build
node dist/index.js --format interface --bind 127.0.0.1:8787
# Test browser với dữ liệu/clipboard giả, không gọi API thật
npm run test:browser
```

Test thủ công: mở một kết quả, click địa chỉ trong metrics hoặc wallet shortlist rồi paste vào editor; phải nhận chuỗi đầy đủ. Chuyển JSON/Plain, thử địa chỉ base58 và base64; kiểm tra phản hồi Copied. Dùng Tab rồi Enter/Space để thử bàn phím. Test browser kiểm tra ghi đúng clipboard và thông báo khi quyền clipboard bị từ chối.

### 9. Lưu và tái sử dụng kết quả (0.4.0)

Mỗi data command, workflow và chat trong interface được lưu vào bảng `saved_runs` của `usage.sqlite`: input/params, dữ liệu nguồn đầy đủ, metrics, kết quả AI, trạng thái, thời điểm tạo/lưu và AI usage. `--short` chỉ rút gọn output; bản lưu vẫn đủ dữ liệu trả về. Không lưu cấu hình provider/key/header vào record của run; nội dung câu hỏi do người dùng nhập là một phần của lịch sử.

**History** tồn tại qua restart, tải 50 lượt mỗi trang và có **Load older runs**. Mở lại, copy địa chỉ hoặc export JSON/CSV không gọi Birdeye/AI. CU hiển thị là chi phí của lượt chạy gốc. Dùng **New run** để bắt đầu ngữ cảnh mới; nút này không xóa bản lưu.

```bash
# Đọc local, không cần API key, không phát sinh CU/tokens
node dist/index.js history list --limit 20 --short
node dist/index.js history list --limit 20 --before <nextCursor> --short
node dist/index.js history show <run-id> > saved-run.json
node dist/index.js history show <run-id> --format interface --bind 127.0.0.1:8787
```

Workflow/chat lưu checkpoint sau khi nhận dữ liệu. Snapshot chưa kết thúc từ tiến trình khác được hiển thị `incomplete`, không tự tiếp tục request. Nếu ghi SQLite lỗi, UI giữ kết quả trong phiên và báo cần export; bước API còn lại dừng khi checkpoint không lưu được. Dữ liệu cũ chưa từng được lưu ở các phiên bản trước không thể khôi phục. Không có tự động xóa hoặc TTL; người dùng chủ động chọn snapshot hoặc chạy mới.

Test restart: chạy một workflow, ghi lại run ID/CU, Ctrl+C, khởi động lại với cùng `--config-dir`, mở History và export. Input, dữ liệu và timestamp phải giữ nguyên; CU không tăng. `npm test` có test restart SQLite/HTTP thật, đọc từ CLI mới, pagination, checkpoint, lỗi ghi và lưu đầy đủ khi `--short`.

### 10. AI chat và Markdown knowledge base

Chọn **Ask AI** hoặc **Discuss saved data with AI** dưới kết quả. Khung chat hiển thị các lượt hỏi/đáp, dữ liệu gắn vào, thời điểm nguồn và docs đã tra cứu. Mở lại lượt chat trong History để tiếp tục. UI hiển thị tối đa 20 lượt trong nhánh hội thoại; model nhận tối đa 3 lượt gần nhất cùng dữ liệu nguồn theo tool.

- Mặc định: docs + saved data, **0 Birdeye CU mới**. Không cần Birdeye key; vẫn cần AI provider và có AI token usage.
- Bật **Allow new Birdeye requests**: AI có thể phối hợp các API/workflow trong catalog theo ngân sách CU đã chọn. Quyền này được kiểm tra ở server, kể cả khi model tự yêu cầu tool bị ẩn.
- AI có thể đề xuất chuỗi nghiên cứu mới từ skill hiện có; việc đề xuất không tự thêm command hoặc chạy endpoint chưa tích hợp.

Bộ Markdown trong `knowledge/birdeye` nhập 425 MDX + README từ docs local, bổ sung 113 hợp đồng OpenAPI đã resolve, cùng workflow/skill của CLI và hướng dẫn sử dụng/harness. Manifest ghi source commit, hash từng trang và thời điểm tạo; các file cấu hình bí mật/certificate/database/script không được nhập. Nội dung MDX được giữ trong file `.md` như văn bản tham khảo; không thực thi JSX. SQLite FTS5 tìm các đoạn liên quan, không gửi toàn bộ kho docs cho mỗi câu hỏi; không dùng embedding API.

```bash
# Tìm/đọc docs offline: 0 Birdeye CU, 0 AI tokens
node dist/index.js knowledge search "smart money top_traders" --short
node dist/index.js knowledge show <document-id> --offset 0
# Trong workspace, cập nhật Markdown từ checkout docs rồi build lại
npm run knowledge:sync -- /Users/toanlk/birdeye.so/bds-docs-mintlify
npm run build
```

Tools mới: `search_birdeye_docs`, `read_birdeye_doc`, `read_saved_data`; `estimate_workflow` vẫn miễn phí. Harness giới hạn 8 vòng AI, 10 tool calls/vòng và 90.000 ký tự ngữ cảnh; docs được gắn nguồn/hash. Dữ liệu/docs là đầu vào tham khảo, không được đổi provider, vượt ngân sách hay thực thi code. Context lớn trả preview có ghi rõ giới hạn; không suy luận các dòng bị bỏ.

```bash
npm run typecheck
npm test
npm run test:browser
```

Test offline bao gồm tìm/đọc docs có nguồn, dữ liệu/schema OpenAPI, chặn paid tools trong saved-only, tiếp tục chat sau restart, giữ nguồn/timestamp và tách AI tokens khỏi Birdeye CU. Test browser dùng provider/clipboard/dataset giả, kiểm tra chat với dữ liệu cũ và mở lại history; môi trường sandbox hiện chặn TCP listen nên chưa xác minh browser thực tế.

Phân tích lựa chọn harness/knowledge base: [nghiên cứu](docs/research/agent-harness-knowledge.md).
