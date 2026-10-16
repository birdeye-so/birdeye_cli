# Early project screening

**Mục đích:** tìm ứng viên theo sự kiện launch và kiểm tra security/ownership. Đối chiếu [GMGN](https://github.com/GMGNAI/gmgn-skills/blob/main/docs/workflow-early-project-screening.md). [Quy tắc chung](README.md).

```bash
birdeye-cli case early-project-screening --stage newly-created --source pump_dot_fun --limit 3 --estimate-cu --short
birdeye-cli case early-project-screening --stage near-graduation --min-progress 80 --source pump_dot_fun --limit 3 --max-cu 250 --short
```

Chọn stage đúng mục đích:

| Stage | Request discovery |
| --- | --- |
| newly-listed | New listing, `time_to`, tối đa 20 dòng; lọc `liquidityAddedAt` trong window |
| newly-created | Meme list với min/max creation time |
| near-graduation | Meme list chưa graduated, creation window và `--min-progress` do người dùng chỉ định |
| graduated | Meme list với min/max graduation time |

Mặc định window 24h; thay bằng `--from` và `--to`. Venue filters hỗ trợ Solana theo registry; newly-listed không nhận venue cụ thể và sẽ báo invalid nếu source khác all. Không coi listing time là creation time.

Sau discovery, dedup address → chọn tối đa k theo thứ tự provider và liquidity filter nếu có → security → overview → holder-profile. Security policy loại token thì bỏ các bước sau. Base **30 + 65k** cho meme discovery, **20 + 65k** cho new-listing; mặc định k=3 là **225/215 CU**, chưa retry. `--depth` không đổi recipe này.

Report giữ selection scope, raw launch metadata, security/cohort observations, missing fields và CU. Không suy stage từ price change hoặc tự thay GMGN rug score bằng concentration. Source/venue coverage có mốc bắt đầu; không có kết quả không chứng minh token không tồn tại. Muốn drilldown dùng `token meme-detail`, `token first-buyers`, `token holder-positions` với cùng ledger budget.
