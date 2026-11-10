# Token due diligence

**Mục đích:** checklist nhanh trước khi trả CU cho điều tra sâu. [Quy tắc chung](README.md).

```bash
birdeye-cli case token-due-diligence --address "$TOKEN" --estimate-cu --short
birdeye-cli case token-due-diligence --address "$TOKEN" --max-cu 50 --short
```

Core lấy overview và security, **40 CU**. `--depth full` thêm markets, một pair overview và holder profile: **100 CU**. Core chỉ kiểm tra dữ liệu identity, thị trường và security đang có; không giả định đã kiểm tra pool/cohort.

Mỗi observation phải giữ value, nguồn, timestamp. Ngưỡng loại được bật bằng các option policy chung, không có ngưỡng “safe” mặc định. Field thiếu không phải pass. Engine dừng subject khi có vi phạm hoặc thiếu field bắt buộc cho policy, và ghi các bước chưa làm vào `missing`.

Cần danh sách holders hoặc timeline thì chuyển token research/risk warning hoặc gọi wrapper. Hai recipe dùng cùng catalog, đơn vị và policy; không có thang điểm riêng. Kết quả không phải xác nhận có thể mua/bán token.
