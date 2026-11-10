# Project deep report

**Mục đích:** báo cáo on-chain về valuation, security, ownership, pools và price action. [Quy tắc chung](README.md).

```bash
birdeye-cli case project-deep-report --address "$TOKEN" --estimate-cu --short
birdeye-cli case project-deep-report --address "$TOKEN" --max-cu 300 --short
```

Recipe lấy overview → security → holders → markets → một pair overview → holder profile → OHLCV 1H → trade-data. Base **240 CU**, gồm reserve OHLCV **100 CU**. `--depth` không đổi recipe này. Dùng `--from`/`--to` nếu cần chart range rõ ràng; snapshot/token-trade rolling fields vẫn giữ thời gian provider của chúng.

Host tính volume/liquidity và return giữa first-open/last-close của các nến 1H đã đóng trong tập lấy được. Không tính nến đang mở; gaps chưa xác minh được ghi trong basis. Dataset OHLCV vẫn có các dòng đã lấy để kiểm tra lại.

Report cần giữ mỗi chiều cùng provenance: valuation; token/pair liquidity; security và quyền; holder cohorts; candle range; missing checks và CU. Một pool hoặc một trang holders không đại diện toàn bộ thị trường. Giữ security/account/wallet basis riêng.

Off-chain team, funding, roadmap và social sentiment chưa được xác minh từ API này. Link social không chứng minh nội dung kênh. Recipe không chấm điểm tổng hợp; kết luận phải căn cứ scope thực tế. Cần wallet-level proof có thể gọi `token holder-positions`; nguồn early buyers và money-flow là nhánh bổ sung, chưa chạy mặc định.
