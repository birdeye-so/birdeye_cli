# Customer demos: từ skill đến sản phẩm dùng được

Các demo chạy trong tab **Demos** và qua lệnh `demo`. Đây là snapshot dữ liệu theo yêu cầu, dùng API Birdeye thật khi có key; không có dữ liệu thị trường giả cài sẵn trong UI. Tests dùng fixture riêng. Chỉ hỗ trợ Solana.

## Chọn demo theo bài toán khách hàng

| Demo / ID | Khách hàng và tác vụ | Workflow chạy | Output sản phẩm | CU catalog / request tối đa |
| --- | --- | --- | --- | --- |
| Research terminal / `terminal` | Research desk muốn shortlist token để tìm hiểu sâu | Market Opportunities core, discovery 20 hàng, enrich tối đa 3 token | Bảng giá/liquidity/volume và control observations theo token | 145 / 7; `--limit 2` là 105 / 5 |
| DEX token inspector / `dex-inspector` | DEX muốn trang thông tin token và pool trước khi người dùng đi tới bước quote riêng | Token Research full | Market snapshot, pool page, security observations; raw pair/profile còn trong sources | 130 / 6 |
| Wallet intelligence / `wallet-intelligence` | Trading platform cần tìm ví trước khi nghiên cứu | Smart Wallets fast → chọn ví → Wallet Analysis 7d/30d | Shortlist khử trùng lặp; PnL/holdings của ví được chọn | Discovery 110 / 4 (limit 3), 80 / 3 (limit 2); analysis 90 / 4 riêng |
| Security signals / `security-signals` | Token review desk muốn xếp hàng kiểm tra theo ngưỡng | Contract DD skill, bỏ nến | 3 rule + 38 metrics/quan sát bổ sung, bảng holder ví; source ID và thời gian | 70 / 3 |
| Telegram research brief / `telegram-brief` | Community bot muốn trả lời lookup token bằng bản tin ngắn | Token DD skill | Plain-text message + đầy đủ JSON evidence để bot sử dụng | 50 / 3 |

CU là output của catalog hiện tại, trước retries; nhánh phụ thuộc có thể gọi ít hơn nếu thiếu subjects. **Không phải báo giá billing hiện hành**: nghiên cứu ngày 2026-10-16 ghi nhận Security live 30 CU so với catalog 25; Wallet PnL summary live 30 so với catalog 20. Chưa đối chiếu toàn bộ giá nên không cộng ra tổng “live” mới. Xem [nghiên cứu và nguồn chính thức](../research/customer-live-demos.md). `--max-cu` giới hạn theo catalog; không phải trần hóa đơn được upstream bảo đảm.

## Chạy demo trên UI

```bash
npm run build
node dist/index.js --format interface --bind 127.0.0.1:8787
```

1. Mở URL trong terminal. Trong Settings, lưu Birdeye key có quyền các endpoint cần dùng. Không cần AI key.
2. Chọn **Demos → tab use case**. Mở **Use case and data coverage** để đọc khách hàng, kết quả và giới hạn.
3. Nhập token nếu demo cần. Wallet intelligence bắt đầu với discovery, không nhập ví; chọn ví từ shortlist để phân tích ở run riêng. Terminal cho chọn số token; Security signals cho chỉnh ngưỡng liquidity/top-10. Ngưỡng mặc định 100.000 USD và 50% là ví dụ cấu hình, không phải tiêu chuẩn an toàn.
4. Chọn **Preview APIs & CU**. Mở API steps để xem mục đích, endpoint, tham số và nhánh phụ thuộc. Bước này miễn CU.
5. Đặt budget đủ cho scope rồi chọn **Run live snapshot**. Có thể Stop; các API đã gửi vẫn được ledger ghi nhận.
6. Xem màn hình sản phẩm và tương tác theo bảng dưới. Mở **Source evidence** để truy vết timestamp/request. Export JSON; với Telegram có **Export message**.
7. Mở lại từ History để dùng snapshot đã lưu, không gọi API. Sửa form không thay đổi kết quả cũ; muốn lấy dữ liệu mới phải preview và run lại.

| Giao diện | Cách sử dụng dữ liệu |
| --- | --- |
| Terminal | Lọc theo symbol/address, sort volume/liquidity/24h change, chọn hàng token để xem panel chi tiết. Thanh liquidity dùng cùng scale của giá trị lớn nhất trong watchlist, không phải lịch sử giá. |
| DEX | Các pool xếp theo liquidity giảm dần. Chọn pool để xem address, liquidity, volume và request gốc; không suy ra route swap tốt nhất. |
| Wallet | Discover smart wallets → Select wallet → preview CU riêng → run analysis. Shortlist theo provider order, khử trùng lặp; mỗi ví giữ các quan sát token và source riêng. Nút 7 days / 30 days chỉ đổi kỳ hiển thị trong dữ liệu đã lấy. Biểu đồ lãi/lỗ có mốc 0 giữa; allocation tính theo priced page, không khẳng định là toàn bộ ví. |
| Security | Thanh đo hiển thị giá trị quan sát, vạch ngưỡng và điều kiện kích hoạt; filter All/Attention/Unknown không gọi API. Unknown không trở thành pass. |
| Telegram | Xem bot message dưới dạng hội thoại, mở Inspect plain text và Export message. Bản text có thêm run/source references; không có chức năng Send. |

Màn hình chưa có dữ liệu vẫn có bố cục từng sản phẩm, với Unavailable/Unknown và hướng dẫn chạy. UI không vẽ nến hay lịch sử giá khi workflow chỉ trả snapshot. Giá nhỏ giữ phần thập phân; số tiền có USD, tỷ lệ có %, số âm/0 và missing được phân biệt. Snapshot cũ thiếu field mới vẫn mở được; UI để field đó Unknown thay vì tự gọi lại API.

Wallet discovery dùng smart-money token list (1d, một trang tối đa 20 token), top traders (30d, một trang 10 trader/token) cho tối đa `limit` token. Shortlist chọn tối đa `limit` ví hợp lệ, khử trùng lặp theo provider order; đây không phải bảng xếp hạng PnL toàn ví. Các ví được tìm vì có giao dịch với token trong smart-money list; không mặc nhiên được gắn nhãn smart money. Chỉ khi chọn một ví và chạy analysis mới lấy PnL/holdings; không tự chạy cho mọi ví. Hai pha có CU và snapshot SQLite riêng, History phân biệt `discover` với địa chỉ ví rút gọn. Reopen discovery để chọn ví khác, không gọi lại API discovery. Ví rỗng (`address` bị bỏ qua, chuỗi rỗng hoặc khoảng trắng) được chuẩn hóa thành không có địa chỉ; discovery preview/run không yêu cầu ví. Địa chỉ sai nhưng không rỗng vẫn bị từ chối. CLI có `--address` vẫn hỗ trợ phân tích trực tiếp một ví đã biết; bỏ `--address` sẽ discover. `data.demo.walletStage` phân biệt `discovery` và `analysis`; report cũ thiếu field vẫn mở theo `input.address`.

Các demo là preset sản phẩm. Để chỉnh API từng step hoặc thêm chart/liquidity history, dùng workflow tương ứng trong Research hoặc import JSON; không giả định các cờ không hiện ở demo sẽ tự được áp dụng.

## Chạy bằng CLI

Thay `TOKEN_MINT`, `WALLET_ADDRESS`, `RUN_ID` bằng giá trị thực. Nếu cài global, thay `node dist/index.js` bằng `birdeye-cli`.

```bash
# Liệt kê và estimate: miễn CU, không cần key
node dist/index.js demos --short
node dist/index.js demo terminal --limit 2 --estimate-cu --short
node dist/index.js demo dex-inspector --address TOKEN_MINT --estimate-cu
node dist/index.js demo wallet-intelligence --limit 2 --estimate-cu
node dist/index.js demo wallet-intelligence --address WALLET_ADDRESS --estimate-cu
node dist/index.js demo security-signals --address TOKEN_MINT --min-liquidity 200000 --max-top10-pct 40 --estimate-cu
node dist/index.js demo telegram-brief --address TOKEN_MINT --estimate-cu

# Chạy thật: các lệnh dưới có gọi Birdeye, không tự retry cả workflow
node dist/index.js demo terminal --limit 2 --max-cu 150 > terminal-result.json
node dist/index.js demo dex-inspector --address TOKEN_MINT --max-cu 180 > dex-result.json
node dist/index.js demo wallet-intelligence --limit 2 --max-cu 100 > wallet-discovery.json
# Chọn ví từ Discovered wallets trong file discovery trước bước này
node dist/index.js demo wallet-intelligence --address WALLET_ADDRESS --max-cu 150 > wallet-result.json
node dist/index.js demo security-signals --address TOKEN_MINT --min-liquidity 200000 --max-top10-pct 40 --max-cu 120 > signals-result.json
node dist/index.js demo telegram-brief --address TOKEN_MINT --max-cu 100 > brief-result.json

# Dùng lại dữ liệu gốc; không gọi Birdeye hoặc AI
node dist/index.js history list --short
node dist/index.js history show RUN_ID > saved-run.json
```

`demo <id>` nhận `--address`, `--limit` (terminal hoặc wallet discovery, 1–5, mặc định 3), `--min-liquidity`/`--max-top10-pct` (security rules), cặp `--from`/`--to` (window quan sát Unix giây) và các cờ chung `--estimate-cu`, `--max-cu`, `--workflow`, `--short`, `--config-dir`. `from/to` chỉ áp dụng cho bước dùng window; không biến token overview/current holdings hay PnL duration thành dữ liệu as-of trong quá khứ. `--format interface` mở từ lệnh gốc rồi chọn Demos, không mở trực tiếp qua `demo <id>`.

## Contract để nhúng vào terminal, DEX hoặc trading platform

Chạy CLI ở backend của ứng dụng, không đưa key ra browser. Truyền argv dưới dạng array, không ghép input người dùng vào shell. Ví dụ Node.js sau dùng bản CLI global:

```js
import { spawn } from 'node:child_process';

export function researchDemo(id, address) {
  return new Promise((resolve, reject) => {
    const args = ['demo', id, '--max-cu', '200'];
    if (address) args.push('--address', address);
    const child = spawn('birdeye-cli', args, { shell: false });
    let stdout = '', stderr = '';
    child.stdout.setEncoding('utf8');
    child.stderr.setEncoding('utf8');
    child.stdout.on('data', chunk => { stdout += chunk; });
    child.stderr.on('data', chunk => { stderr += chunk; });
    child.on('error', reject);
    child.on('close', code => {
      // Exit 5 vẫn có dữ liệu hữu ích: đọc coverage/missing thay vì bỏ JSON.
      if (code !== 0 && code !== 5) return reject(new Error(stderr));
      try { resolve(JSON.parse(stdout)); } catch (error) { reject(error); }
    });
  });
}
```

Backend production cần thêm giới hạn concurrency, timeout/cancel, kích thước output và quota theo khách hàng. UI server hiện là workspace một người dùng, không phải API SaaS đa tenant.

| JSON field | Dùng để |
| --- | --- |
| `data.demo.version`, `id` | Chọn adapter UI; version contract hiện là 1 |
| `data.demo.input` | Input/threshold và window thực tế đã chạy |
| `data.demo.sections[]` | Bảng sản phẩm: title, columns `{key,label}`, rows; null phải hiển thị Unavailable |
| `data.demo.signalState` | `attention`, `unknown`, `no-configured-rule-triggered`; chỉ có ở Security signals |
| `data.demo.message`, `delivery` | Bản tin plain text và trạng thái `preview-only`; chỉ ở Telegram brief |
| `data.sources[]`, `data.metrics` | Evidence gốc, công thức/đơn vị, source request IDs |
| `data.missing`, `data.scopeNotes`, `meta.coverage` | Phạm vi thiếu dữ liệu; không dùng partial như dữ liệu đầy đủ |
| `meta.runId`, `meta.retrievedAt`, `meta.cu` | Truy vết, freshness và chi phí của lần chạy |

`history show` bọc report trong `result`; export từ UI và stdout của `demo` trả report trực tiếp. Short output giữ product result, rút gọn source arrays; bỏ `--short` khi cần evidence đầy đủ.

## Security signals: nghĩa chính xác

- **Liquidity:** attention khi giá trị quan sát nhỏ hơn minLiquidity; không suy ra có thể khớp giao dịch ở mức liquidity đó.
- **Concentration:** attention khi top10HolderPercent từ Security API, đổi ratio × 100, vượt maxTop10Pct. Đây là token-account share, không thay bằng wallet share từ bước distribution.
- **Freezeable:** chỉ boolean `true` là attention; `false` là not-observed. Missing, chuỗi không hợp lệ hoặc tỷ lệ ngoài [0,100] là unknown.
- Kết luận tổng ưu tiên attention, tiếp theo unknown, cuối cùng no-configured-rule-triggered. Trạng thái cuối chỉ nói ba rule đã không kích hoạt, không phải token an toàn. Contract DD vẫn có thể partial vì không có bằng chứng honeypot/LP-lock.

Snapshot mới bổ sung bốn nhóm dữ liệu (38 trường) và bảng holder, tái sử dụng ba source hiện có, không tăng request/CU catalog:

- **Market depth & activity (14):** market cap, FDV, holder count, total/circulating supply, liquidity/market cap %, volume/liquidity, số trade/buy/sell/active wallets 24h, buy/sell/net-buy volume USD. Net buy volume là chênh lệch khối lượng, không phải vốn ròng đi vào token.
- **Ownership concentration (13):** share và balance của top-10 token accounts, top-10 unique users, creator, owner và metadata authority. Share từ Security API được đổi ratio × 100; các nhóm có thể chồng lấp, không cộng các share. Thêm số ví, tổng lượng token và % tổng cung của nhóm top 10 từ distribution summary.
- **Token control observations (7):** freezeable, mutable metadata, transfer fee, non-transferable, Token-2022, imitation/canonical flags. Chỉ nhận boolean thật; hai cờ định danh cuối là heuristic của provider. Đây là dữ liệu hỗ trợ, không thêm rule vào `signalState`.
- **Authority addresses (4):** creator, owner, freeze authority, metadata update authority. Thiếu địa chỉ không chứng minh quyền đã bị thu hồi.
- **Holder wallets:** top 10 ví theo thứ tự provider, `holding` và `percent_of_supply` từ API distribution với `address_type=wallet`. Distribution đã trả về phần trăm (không nhân 100). Không chia số dư cho supply từ API khác vì đơn vị scaled UI có thể khác nhau.

Mỗi quan sát giữ `sourceId`, `asOf`, đơn vị và basis. Số âm không hợp lệ, tỷ lệ ngoài miền, count không nguyên và mẫu số 0 trở thành unavailable (net buy volume vẫn cho phép âm). Số dư giữ precision trong JSON và tooltip. Snapshot đã lưu từ phiên bản cũ vẫn mở được; cần chạy snapshot mới để có các section mới.

Monitor liên tục cần scheduler/stream, baseline cùng token/window, cooldown và dedup alerts. Demo hiện không chạy ngầm hay tự refresh.

## Telegram: nối vào bot của khách hàng

Demo đã tạo bản tin thật từ dữ liệu Birdeye, không đăng ký bot hoặc gửi tin. Trong adapter Telegram của bạn:

1. Nhận command như `/research TOKEN_MINT`, xác thực chat/user được phép và kiểm tra quota.
2. Gọi `demo telegram-brief --address ...` bằng argv; không dùng shell input.
3. Đọc exit 0/5 và `data.demo.message`, lưu `meta.runId` để truy vết/dedup; không tự chạy lại workflow chỉ để gửi lại tin.
4. Gửi message bằng Bot API trong hạ tầng của bạn, dùng plain text (không đặt parse_mode). Giữ bot token trên server; bổ sung authorization, dedup update và rate limit trước khi mở cho nhiều chat.

Xem [nghiên cứu Telegram và tài liệu Bot API chính thức](../research/customer-live-demos.md#5-telegram-lớp-truy-vấn-nghiên-cứu-qua-chat). Bản tin có source IDs, run ID, thời gian, coverage và CU, không đưa API key vào nội dung. Không có Telegram network call trong demo CLI/UI.

## Kiểm tra

```bash
npm run typecheck
npm test
npm run build
# Sau npm test: regression riêng, fixture transport, không tiêu CU thật
node --test .test-dist/tests/demos.test.js
# Cần Chrome và quyền listen loopback; fixture, không gọi Birdeye thật
npm run test:browser
# UI riêng: chỉ cần Chrome, không cần HTTP listen; tương tác + capture 5 demo
npm run test:demos:browser
# Regression render/format, không cần Chrome
node --test tests/demo-ui.test.mjs
```

Suite gồm render/format từng UI, giá nhỏ/zero/negative/missing, legacy snapshots, wallet discovery → chọn ví → analysis và 5 recipe, estimate, cố định window, budget chặn request, missing/malformed/zero observations, HTTP execution, persistence/restart, CLI preflight và message preview. Browser smoke có demo estimate/run, invalidation khi sửa input, desktop/mobile và History reuse. Test UI riêng kiểm tra filter/sort/selection, chuyển kỳ PnL, lọc rule và export message bằng fixture. Môi trường phát triển hiện chặn TCP listen và Chrome launch (`EPERM`/`SIGABRT`), nên chưa có capture demo và chưa xác minh entitlement/billing bằng API live.
