# Workflow Birdeye CLI — 0.2.0

Chín workflow nghiên cứu lấy cảm hứng từ GMGN đã chạy được qua `case`, interface và AI tools. Hai case cũ `market-shortlist`, `wallet-exposure` vẫn được giữ. [Nghiên cứu GMGN](../research/gmgn-workflows.md) · [Đối chiếu dữ liệu và giới hạn API](../research/birdeye-workflow-mapping.md).

## Chọn workflow

| Recipe | Input | Core CU mặc định | Full CU |
| --- | --- | ---: | ---: |
| [Token research](workflow-token-research.md) | Token | 70 | 130 |
| [Token due diligence](workflow-token-due-diligence.md) | Token | 40 | 100 |
| [Project deep report](workflow-project-deep-report.md) | Token | 240 | 240 |
| [Wallet analysis](workflow-wallet-analysis.md) | Wallet | 50 | 80 + 40k, mặc định k=3 |
| [Smart money profile](workflow-smart-money-profile.md) | Wallet hoặc discovery | 70/ví; discovery 25 + 70k, mặc định k=3 | Thêm 30/ví |
| [Risk warning](workflow-risk-warning.md) | Token | 70 | 180 |
| [Early project screening](workflow-early-project-screening.md) | Launch stage, venue | 30 + 65k, mặc định k=3 | Như core |
| [Daily brief](workflow-daily-brief.md) | Market; wallet tùy chọn | 50 + 40k, mặc định k=2 | 140 + 40k |
| [Market opportunities](workflow-market-opportunities.md) | Market | 25 + 40k, mặc định k=3 | 25 + 75k |

CU là upper bound của các bước dự kiến trước retry, có thể thấp hơn nếu ít ứng viên hoặc bị loại sớm. OHLCV reserve 100 CU. `--estimate-cu` dùng cùng planner với execution và không cần key; catalog/price snapshot hiện trong output. Workflow là một lần chạy, chưa có scheduler/WebSocket hay execution giao dịch.

## Chạy CLI

Build theo [README](../../README.md); thay `birdeye-cli` bằng `node dist/index.js` nếu chưa cài global.

```bash
birdeye-cli cases --short
TOKEN='So11111111111111111111111111111111111111112'
birdeye-cli case token-research --address "$TOKEN" --depth full --estimate-cu --short
# Lệnh tiếp theo gọi Birdeye thật, cần key
birdeye-cli case token-research --address "$TOKEN" --depth full --max-cu 150 --short
```

`--limit` giới hạn số ứng viên enrich, `--scan-limit` giới hạn trang discovery; engine dedup contract + chain và tái sử dụng request giống nhau trong một workflow. Trang tiếp theo phải gọi wrapper với pagination phù hợp; engine chưa tự tải toàn bộ. Khi API/coverage thiếu, giữ `missing`, không suy toàn thị trường từ một trang.

`--min-liquidity` lọc ứng viên và kiểm tra overview; `--max-top10-pct` dùng top-10 **token-account** share từ security; `--exclude-freezeable` dừng nếu freezeable hoặc field unknown. Không có ngưỡng ngầm. Dừng sau lỗi auth/403, hết budget hoặc request limit; giữ các dataset đã lấy và CU uncertain. Nếu policy loại một token, bỏ enrich còn lại của token đó.

`--from` và `--to` phải đi cùng nhau, là Unix seconds cho OHLCV, timeline, trader trades hoặc cửa sổ discovery. Mặc định 24h; wallet trades mặc định theo `--duration 30d`. Các snapshot/rolling PnL API vẫn là dữ liệu hiện tại theo thời điểm provider, không biến thành historical snapshot khi truyền range. Smart-money profile luôn so sánh PnL 7d và 30d; trade range được ghi riêng.

## CU tích lũy qua nhiều command

```bash
birdeye-cli workflow create --label research --max-cu 300 --short
WF='id-vua-tra-ve'
birdeye-cli case token-research --address "$TOKEN" --workflow "$WF" --max-cu 150 --short
birdeye-cli token first-buyers "$TOKEN" --limit 20 --workflow "$WF" --short
birdeye-cli usage show --workflow "$WF" --short
```

`workflow create` là nhóm budget; `case` là bộ chạy recipe. `--max-cu` giới hạn run, workflow ID áp thêm budget tích lũy. Không cộng các tổng CU đã tích lũy sau mỗi response. Retry là attempt riêng; timeout/cancel không đồng nghĩa miễn phí. Chạy lại recipe sẽ tốn CU mới.

## Hợp đồng report

Kết quả có `data.kind`, `plan`, `metrics`, `sources`, `selections`, `outcomes`, `missing`, `scopeNotes`, `status`; metadata giữ CU, thời gian, coverage và cảnh báo.

- `selections`: universe của các trang đã scan, địa chỉ đã chọn, selection basis. Ranking local dùng `volume24hUSD`; không thay rank do API cung cấp.
- `outcomes`: token bị loại theo policy hoặc thiếu field cho check bắt buộc, kèm source ID và lý do.
- `missing`: step/operation/subject chưa hoàn tất, gồm bước bị policy bỏ qua.
- `status`: `complete-for-requested-scope` hoặc `partial`. Đây không phải safety verdict; CLI trả exit `5` cho partial.
- `metrics`: giá trị host tính hoặc provider observation, kèm basis/window/source. `null` vẫn là unknown, không đổi thành zero.

`--short` giữ scalar evidence và preview tối đa 5 phần tử mỗi mảng của source data; `outputTruncation` chỉ rõ path bị cắt. Metrics và warnings vẫn còn. Full JSON giữ mọi dòng đã tải; không cần gọi lại chỉ để đổi format nếu đã lưu full result. Một source preview không đại diện toàn bộ holders hay toàn bộ lịch sử.

Volume/liquidity dùng volume trong kỳ chia liquidity tại snapshot. Cohort tags có thể overlap; không cộng tag shares. PnL giữ `duration`, `position_scope`, `pnl_method`; wallet holdings không chứng minh PnL và wallet PnL không phải copy-trade ROI. Giữ nguyên định nghĩa Birdeye thay vì dùng nhãn GMGN cho số khác nghĩa.

## Interface và AI

```bash
birdeye-cli --format interface --bind 127.0.0.1:8787 --short --max-cu 250 --session-max-cu 1000
# Hoặc mở một workflow khởi đầu
birdeye-cli case token-research --address "$TOKEN" --format interface --bind 127.0.0.1:8787
```

Chọn recipe trong Workflow, nhập scope/policy rồi bấm **Estimate CU** để xem kế hoạch miễn phí. Credentials ở Settings. Initial workflow chạy sau khi kết nối; reconnect không chạy lại. Full report và datasets có thể export JSON.

AI provider có các data tools, `estimate_workflow` và `run_workflow`; schema và CU dùng chung registry. AI chỉ được gọi tools trong allowlist, không thay budget hoặc ký order. Chat có giới hạn 8 lượt model và 20 attempts; recipe CLI/interface trực tiếp có attempt bound dựa trên planner. Chat partial vẫn giữ evidence và missing checks.

## Kiểm tra

```bash
npm run typecheck
npm test
npm run build
npm run test:browser
```

Test tự động dùng fixture và không tốn CU. Browser smoke cần Chrome và quyền mở cổng; `CHROME_PATH` chọn executable. Live coverage, entitlement và hóa đơn chưa được xác nhận bằng các fixture tests. Các command wrapper dùng trực tiếp có trong `capabilities --short`, chi tiết cờ ở `--help`.

## Birdeye Data Skills collection

[Eleven reference workflows](birdeye-data-skills.md) are available as `case skill-<name>`, with Discover / Token / Wallet UI groups, API-step editing, documented CU and versioned derived findings. The earlier recipes above retain their behavior.
