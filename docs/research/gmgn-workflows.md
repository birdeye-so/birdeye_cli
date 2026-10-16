# Khảo sát workflow GMGN để thiết kế Birdeye CLI

Ngày đọc: 2026-10-09. Nguồn là repository chính thức `GMGNAI/gmgn-skills`, nhánh `main`; giao diện nguồn không cung cấp commit SHA nên đây không phải bản pin theo revision. Đã đọc nội dung cả chín tài liệu workflow được liệt kê trong [thư mục docs](https://github.com/GMGNAI/gmgn-skills/tree/main/docs) và [mục Workflow Docs](https://github.com/GMGNAI/gmgn-skills#7-workflow-docs). Không dùng README làm nguồn duy nhất.

Phần “Khi chuyển sang Birdeye” là phân tích thiết kế, không phải tuyên bố endpoint Birdeye đã hỗ trợ hoặc thiếu dữ liệu. Đối chiếu cụ thể schema, khả năng CLI hiện tại và CU nằm trong [bảng mapping Birdeye](./birdeye-workflow-mapping.md).

## 1. Token research

Nguồn: [workflow-token-research.md](https://github.com/GMGNAI/gmgn-skills/blob/main/docs/workflow-token-research.md).

- **Mục đích/input:** đánh giá một token từ địa chỉ hoặc tên và chain.
- **Trình tự:** thông tin → security → pool → tìm trong trending → holders/traders có nhãn smart money/KOL.
- **Dữ liệu:** giá, circulating market cap, liquidity, holder count, social links; mint/freeze, concentration; DEX/pool age; rank; mua/bán và P&L theo nhóm ví.
- **Output:** kết luận có lý do, theo ba mức buy/watch/skip; security có điều kiện dừng.
- **Khi chuyển sang Birdeye:** giữ cấu trúc chứng cứ và điều kiện dừng. Holder lớn không đồng nghĩa smart money. Không tìm thấy trong trang trending không chứng minh toàn thị trường thiếu quan tâm. Thiếu security phải hiện `unknown`, không tự cho qua.

## 2. Project deep report

Nguồn: [workflow-project-deep-report.md](https://github.com/GMGNAI/gmgn-skills/blob/main/docs/workflow-project-deep-report.md).

- **Mục đích/input:** báo cáo sâu cho một token/chain.
- **Trình tự:** fundamentals → security → pool → conviction của smart money → OHLCV/trending → tổng hợp rủi ro.
- **Dữ liệu:** nền tảng token, concentration, pool age, bonding curve, holdings/P&L của nhóm ví, volume và diễn biến giá.
- **Output:** báo cáo theo chiều phân tích, điểm tối đa 15 và kết luận có hard stop.
- **Khi chuyển sang Birdeye:** không giữ nguyên thang điểm nếu thiếu các chiều đầu vào. Link social không chứng minh kênh đang hoạt động; snapshot holder count không chứng minh tăng trưởng. “Conviction” cần dữ liệu sở hữu và giao dịch theo thời gian, không suy ra chỉ từ P&L dương. Chỉ định rõ cửa sổ và coverage trước khi tính điểm.

## 3. Wallet analysis

Nguồn: [workflow-wallet-analysis.md](https://github.com/GMGNAI/gmgn-skills/blob/main/docs/workflow-wallet-analysis.md).

- **Mục đích/input:** đánh giá một ví có đáng theo dõi, dựa trên địa chỉ/chain.
- **Trình tự:** holdings → stats 30 ngày → activity → feed follow tùy cấu hình → research 3–5 vị thế lớn nhất.
- **Dữ liệu:** USD value, realized/unrealized P&L, win rate, chi phí vốn, tần suất mua/bán, timestamps, phân bổ token.
- **Output:** hiệu quả, phong cách, vị thế và mức đáng theo dõi.
- **Khi chuyển sang Birdeye:** holdings hiện tại chỉ đáp ứng phân bổ vốn, không đủ kết luận thành tích hoặc thời gian giữ. Chỉ tính tỷ trọng trên tập định giá được nếu chưa lấy đủ trang. Follow feed thuộc nền tảng không tương đương lịch sử giao dịch công khai của một ví.

## 4. Smart money profile

Nguồn: [workflow-smart-money-profile.md](https://github.com/GMGNAI/gmgn-skills/blob/main/docs/workflow-smart-money-profile.md).

- **Mục đích/input:** phân tích hành vi và tiềm năng theo dõi một hoặc nhiều ví.
- **Trình tự:** stats 7/30 ngày → activity → ghép vòng mua/bán → phân tích thoát vị thế → ước tính copy → so sánh ví.
- **Dữ liệu:** P&L, win rate, token diversity, giá trị/timestamp từng lần mua bán, cost và vị thế mở.
- **Output:** phong cách, thời gian giữ, mức chốt lời/cắt lỗ và ước tính lợi nhuận lịch sử.
- **Khi chuyển sang Birdeye:** P&L ví không phải lợi nhuận của người copy. Ghép lần mua với lần bán đầu tiên sẽ sai khi có bán từng phần, transfers hoặc nhiều lot. Cần quy tắc kế toán, coverage và giả định latency/fees/slippage. Không tự gắn nhãn smart money cho mọi top trader.

## 5. Risk warning

Nguồn: [workflow-risk-warning.md](https://github.com/GMGNAI/gmgn-skills/blob/main/docs/workflow-risk-warning.md).

- **Mục đích/input:** rà soát rủi ro đang hoạt động của token đang giữ hoặc cân nhắc.
- **Trình tự:** security → liquidity → holder concentration → smart-money flow → OHLCV.
- **Dữ liệu:** quyền contract, concentration, dev holdings, liquidity hiện tại và baseline, top-holder activity, trade direction, price/volume.
- **Output:** mức rủi ro kèm timestamp và tín hiệu cụ thể.
- **Khi chuyển sang Birdeye:** snapshot chỉ mô tả hiện tại; cần baseline cùng định nghĩa để nói liquidity giảm hoặc holder thoát. Giảm số dư có thể là chuyển ví. Liquidity USD giảm còn chịu ảnh hưởng giá, chưa chứng minh rút pool. OHLCV chỉ hỗ trợ phát hiện bất thường, chưa đủ kết luận ai bán hoặc wash trading.

## 6. Early project screening

Nguồn: [workflow-early-project-screening.md](https://github.com/GMGNAI/gmgn-skills/blob/main/docs/workflow-early-project-screening.md).

- **Mục đích/input:** lọc token mới theo chain và giai đoạn launchpad.
- **Trình tự:** trenches new/near-completion/completed → lọc từ response → tối đa năm ứng viên → security → holders/traders → thông tin token.
- **Dữ liệu:** trạng thái bonding curve, tuổi, volume/swaps, nhãn smart money/KOL, rug/bundler/insider, social và quyền mint/freeze.
- **Output:** shortlist và lý do watch/skip hoặc nghiên cứu tiếp.
- **Khi chuyển sang Birdeye:** newly listed, token creation và graduation là ba sự kiện khác nhau. Có danh sách token mới không tự đáp ứng “sắp graduation”. Không thay rug score/bundler label bằng concentration mà giữ tên chỉ số cũ. Phải nêu giai đoạn nào quan sát được và field nào chưa có.

## 7. Daily brief

Nguồn: [workflow-daily-brief.md](https://github.com/GMGNAI/gmgn-skills/blob/main/docs/workflow-daily-brief.md).

- **Mục đích/input:** tổng quan ngày theo chain; có thể bổ sung danh mục đang giữ.
- **Trình tự:** trending 1h/6h → smart-money/KOL activity → token gần/vừa graduation → security cho vị thế hoặc ứng viên quan trọng.
- **Dữ liệu:** rank, price change, volume/swaps, luồng mua/bán theo nhóm ví, launch stage, concentration và security.
- **Output:** market pulse, dòng tiền, early watch, risk và bước nghiên cứu tiếp.
- **Khi chuyển sang Birdeye:** tái sử dụng snapshot giữa các phần giúp giảm CU. Hai danh sách top-N chỉ mô tả mẫu quan sát, không đại diện toàn bộ market breadth. Nếu không có nhãn sector đáng tin, không tự suy ra risk-on/risk-off từ tên token. Phần thiếu nguồn phải ghi chưa đánh giá.

## 8. Market opportunities

Nguồn: [workflow-market-opportunities.md](https://github.com/GMGNAI/gmgn-skills/blob/main/docs/workflow-market-opportunities.md).

- **Mục đích/input:** tìm ứng viên từ trending theo chain/cửa sổ.
- **Trình tự:** lấy khoảng 50 token với filter → xét nhiều tín hiệu → chọn năm → trình bày lý do → research tiếp hoặc giao dịch.
- **Dữ liệu:** smart money/KOL, bluechip ownership, volume/swaps, momentum, liquidity và tuổi token.
- **Output:** bảng top năm với lý do lựa chọn.
- **Khi chuyển sang Birdeye:** giữ mẫu scan rộng rồi enrich ít token, rất phù hợp ngân sách CU. Phải tách rank do API cung cấp với điểm do CLI tính. Nếu CLI lấy năm token đầu rồi mới enrich, mô tả đúng là shortlist trên năm ứng viên, không tuyên bố đã phân tích top 50. Workflow đọc dữ liệu kết thúc ở shortlist.

## 9. Token due diligence

Nguồn: [workflow-token-due-diligence.md](https://github.com/GMGNAI/gmgn-skills/blob/main/docs/workflow-token-due-diligence.md).

- **Mục đích/input:** checklist trước khi ra quyết định với một token.
- **Trình tự:** info → security → pool → holders/traders theo nhãn.
- **Dữ liệu:** cùng nhóm fundamentals/security/liquidity/wallet signals như token research, không có bước trending riêng.
- **Output:** các tín hiệu thuận/nghịch theo checklist.
- **Khi chuyển sang Birdeye:** nên dùng bản quick của token research chung một hợp đồng dữ liệu. Tránh hai workflow tính cùng chỉ số bằng định nghĩa khác nhau. Không biến chỉ số không có thành `false` hoặc zero. Cần kiểm tra phần trăm ở dạng 0–1 hay 0–100 trước khi áp ngưỡng.

## Kết luận thiết kế rút ra từ đối chiếu

Các workflow trên có chung chuỗi: xác định đối tượng và cửa sổ → lấy dữ liệu nền → kiểm tra điều kiện loại → bổ sung một tập nhỏ → tổng hợp chứng cứ → nêu bước tiếp. Có thể dùng cấu trúc này cho Birdeye mà không sao chép kết luận mua/bán hoặc taxonomy của GMGN.

Đề xuất cho Birdeye:

1. Mỗi workflow khai báo purpose, input, dữ liệu bắt buộc/tùy chọn, ngân sách CU, quy tắc dừng và output.
2. Mỗi metric lưu endpoint, timestamp, window, denominator, coverage và trạng thái `observed`/`derived`/`unavailable`.
3. Dùng nhãn đúng nguồn: top holder, top trader, smart money và KOL là bốn khái niệm khác nhau; không đổi tên để làm bảng tương đương trông đầy đủ.
4. Cấu trúc output gồm kết quả, evidence, rủi ro, dữ liệu thiếu và CU. `--short` giảm dòng và field thừa, vẫn giữ coverage và cảnh báo có ý nghĩa.
5. Tách “workflow tài liệu” khỏi `workflow create` đang làm nhóm ngân sách; tách spec endpoint cần phát triển khỏi command đã chạy được.
6. Các ngưỡng tham khảo là policy có phiên bản, không phải tính chất phổ quát của token. Không bê nguyên score khi bộ dữ liệu và mẫu quan sát đã thay đổi.

Những điểm này là đề xuất từ phân tích, không phải tính năng đã triển khai hay bảo đảm về dữ liệu Birdeye.
