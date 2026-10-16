# Daily brief

**Mục đích:** tóm tắt rolling market samples, shortlist và portfolio tùy chọn. Đối chiếu [GMGN](https://github.com/GMGNAI/gmgn-skills/blob/main/docs/workflow-daily-brief.md). [Quy tắc chung](README.md).

```bash
birdeye-cli case daily-brief --limit 2 --estimate-cu --short
birdeye-cli case daily-brief --limit 2 --max-cu 160 --short
birdeye-cli case daily-brief --depth full --limit 2 --max-cu 250 --short
```

Chọn core hoặc full. Core trending 1h + 24h (50 CU) → union/dedup address → sort `volume24hUSD` → security + overview cho k token (40k). Mặc định k=2: **130 CU**. Full thêm chain metrics 1D (40), smart-money token list 1d (20), meme-list với creation window (30): **220 CU** mặc định. `--address "$WALLET"` thêm holdings 20 CU; không tự enrich thêm mọi vị thế.

Snapshot trong hai window trending không phải historical rank changes. Chain metrics có volume/activity theo bucket, stablecoin market cap tại cuối bucket; không cộng volume của top-N thành tổng chain. Core không có chain/cohort/launch datasets thì chỉ mô tả mẫu trending. Full giữ các dataset bổ sung để AI/người đọc tổng hợp, không tự phát narrative risk-on/risk-off.

Report gồm market sample, shortlist và metric quyết định, security risks/unknown, portfolio page nếu yêu cầu, sources/time/CU. Không suy sector rotation từ tên token. Missing API/entitlement giữ `partial`; những section chưa có dữ liệu phải nêu rõ.

Lệnh không lập lịch chạy ngày hôm sau. Rolling 24h không tự bằng ngày lịch; `--from`/`--to` chỉ áp dụng các source có historical filters, không biến trending thành snapshot quá khứ.
