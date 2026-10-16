# Khung AI research và kho tri thức Markdown cho Birdeye

Khảo sát ngày 2026-10-15. Hiểu “agenthardness” trong yêu cầu là **agent harness**: phần ứng dụng quản lý ngữ cảnh, công cụ, trạng thái và giới hạn thực thi của AI. Đây là đề xuất kiến trúc dựa trên mã nguồn hiện tại và tài liệu chính chủ; không xác nhận các API ngoài catalog đã được tích hợp.

## Kết luận áp dụng

Giữ vòng lặp AI hiện tại, bổ sung kho Markdown cục bộ và công cụ tìm/đọc từng phần tài liệu. Chat có hai chế độ rõ ràng: **Nghiên cứu tài liệu** để giải thích và đề xuất workflow; **Phân tích dữ liệu** để gọi các operation đã đăng ký qua Runner và ngân sách CU. Chưa có nhu cầu bắt buộc chuyển sang một agent SDK hoặc chạy nhiều agent. Anthropic khuyến nghị bắt đầu bằng cấu trúc đơn giản, bổ sung độ phức tạp khi có bằng chứng cần thiết; framework có thể che khuất prompt và phản hồi cần debug. [Nguồn chính chủ](https://www.anthropic.com/engineering/building-effective-agents).

`src/ai.ts` đã là một harness nhỏ: hỗ trợ Chat Completions/Responses, giữ lịch sử ngắn, tối đa 8 vòng và 10 tool call mỗi vòng, giới hạn ngữ cảnh 90.000 ký tự, chống gọi lặp trong một run, theo dõi token usage, hỗ trợ hủy và gọi `estimate_workflow`/`run_workflow`. `Runner` kiểm tra operation, chuẩn hóa tham số và reserve CU trước request. Đây là nền tảng thực thi phù hợp để mở rộng. [AI loop](../../src/ai.ts), [Runner](../../src/runner.ts), [catalog](../../src/catalog.ts).

## Corpus thực tế và giới hạn của “toàn bộ docs”

Nguồn kiểm tra: `/Users/toanlk/birdeye.so/bds-docs-mintlify`, HEAD `b34378ea9a1aad2c22934903ded124cd84729d3f`. Working tree có thay đổi `.DS_Store` và thư mục `birdeye-data-skills/` chưa được theo dõi; SHA Git riêng lẻ không mô tả đầy đủ mọi nội dung cục bộ. Kết quả kiểm kê filesystem tại thời điểm khảo sát:

| Nội dung | Số lượng | Ý nghĩa khi nhập |
|---|---:|---|
| Trang MDX | 425 | Bao gồm hướng dẫn, API, changelog, dashboard, use cases, agents và WebSockets |
| MDX có `openapi:` | 113 | Phải bổ sung hợp đồng API từ spec, không chỉ đổi đuôi file |
| Spec Data API | 98 operations / 97 paths | `openapi/data/openapi_docs.json` |
| Spec Blockchain API | 6 operations | `openapi/blockchain/openapi_blockchain_docs.json` |
| Spec Perps API | 9 operations | `openapi/perps/openapi_perps_docs.json` |
| Trang agents | 4 | Overview, Birdeye MCP, tool catalog, x402 |

Đếm trực tiếp từ các file trong checkout, bỏ `.git`; không suy diễn rằng mọi file đều đang được xuất bản. Có 133 MDX trong `guides`, 116 trong `data-api`, 96 trong `changelog`. Nguồn tổ chức trang: `docs.json` trong checkout. Các Markdown của skill/workflow trong CLI cần nhập thêm từ `docs/workflows`, `skills` và các tài liệu được chọn trong `birdeye-data-skills`; tránh nhân đôi cùng nội dung từ hai checkout. [Workflow implementation](../../src/workflows.ts), [skill recipes](../../src/skill-recipes.ts), [source mapping đã có](birdeye-data-skills.md).

Mintlify sinh tài liệu endpoint từ OpenAPI; frontmatter chỉ trỏ đến operation nên bỏ spec sẽ làm mất tham số và schema phản hồi. Converter cần giữ prose của trang rồi bổ sung method/path, description, query/header/body, required/default/enum, response và tham chiếu schema nội bộ đã resolve. Gặp `$ref` vòng hoặc không resolve được thì ghi thiếu hụt, không lặng lẽ bỏ. [Mintlify OpenAPI setup](https://www.mintlify.com/docs/api-playground/openapi-setup).

Đề xuất importer:

1. Chỉ nhận Markdown/MDX ở các cây tài liệu đã cho phép và ba spec JSON nêu trên; không chạy MDX, JavaScript, shell hoặc code sample.
2. Chuyển các thành phần trình bày thành nội dung đọc được: giữ heading, title của tab/card/step, bảng, code fence và liên kết. Bỏ script/iframe/style; giữ alt text hoặc liên kết ảnh để biết phần nào chưa được trích xuất. Markdown không chứa toàn bộ thông tin bên trong ảnh/video.
3. Ghi một file Markdown cho mỗi trang với đường dẫn ổn định; thêm tài liệu operation nếu spec có operation chưa gắn trang. Ghi báo cáo imported/skipped/unresolved thay vì khẳng định đầy đủ chỉ từ tổng file.
4. Lưu manifest gồm source path tương đối, commit, source hash, generated hash, thời điểm import, phiên bản converter và nguồn spec/JSON pointer liên quan. Commit cộng hash từng file giúp tái lập đúng snapshot.
5. Changelog vẫn được tìm kiếm nhưng phải có ngày/nhãn lịch sử; ưu tiên tài liệu hiện hành. Các phát biểu về giá, giới hạn, hỗ trợ mạng phải kèm snapshot và không coi bản local là xác nhận dịch vụ hiện tại.

Checkout còn chứa certificate `.pem`, file đăng nhập, SQLite và script vận hành. Đây là lý do cụ thể để giới hạn importer theo loại nội dung và thư mục; không cần đọc chúng. “Toàn bộ docs” là toàn bộ tài liệu được chọn, không phải toàn bộ tệp trong repository. Loại bỏ credential thật nếu xuất hiện trong ví dụ, giữ placeholder và tên header cần thiết cho hợp đồng API. [Nguồn kiểm kê](../../../bds-docs-mintlify/README.md).

## Tìm kiếm và citation

Khuyến nghị đầu tiên: chia theo heading/đoạn và giới hạn độ dài mỗi chunk; đánh trọng số title, heading, tên operation và path. Hai tool đủ cho bước đầu: `search_knowledge(query, limit)` trả vài đoạn cùng ID ổn định; `read_knowledge(id, offset, limit)` đọc có giới hạn. Đặt giới hạn query, số kết quả và tổng ký tự ở host. Không gửi cả corpus vào mỗi lượt chat. Đây là quyết định thiết kế cho ứng dụng này, chưa phải kết quả benchmark.

SQLite FTS5 là lựa chọn tăng trưởng hợp lý: có truy vấn full-text, `bm25()` để xếp hạng và `snippet()` để trích đoạn. Điểm BM25 thấp hơn là phù hợp hơn trong triển khai SQLite. FTS5 phải được bật trong SQLite runtime; kiểm tra thực tế trước khi phụ thuộc. Nếu dùng external-content table, phải đồng bộ index với bảng nội dung hoặc rebuild đúng lúc. [SQLite FTS5](https://www.sqlite.org/fts5.html).

Lexical search chưa giải quyết tốt khác biệt ngôn ngữ: câu hỏi tiếng Việt có thể không trùng docs tiếng Anh. Cho AI tự tạo truy vấn tiếng Anh, thêm alias nghiệp vụ như “thanh khoản → liquidity”, rồi đo recall bằng tập câu hỏi thực tế. Chỉ thêm embeddings/hybrid search khi đo được khoảng trống; cân nhắc chi phí ingest, cập nhật và dữ liệu gửi tới dịch vụ embedding. Đây là đề xuất cần kiểm nghiệm, không khẳng định lexical search luôn đủ.

Mỗi chunk nên mang `documentId`, title, heading, đường dẫn Markdown, URL nguồn nếu đã xác minh mapping, snapshot/hash và vị trí đoạn. Host lưu các nguồn thực sự đã truy xuất vào run và giao diện; AI trích ID nguồn đó. Citation tài liệu chứng minh hợp đồng/định nghĩa; citation kết quả Runner chứng minh dữ liệu quan sát. Không dùng trích dẫn docs làm bằng chứng cho giá hay PnL mới nhất. Khi thiếu bằng chứng, trả khoảng trống và bước tiếp theo.

## Ranh giới thực thi và đề xuất workflow

Chế độ tài liệu có quyền search/read và xem hoặc ước lượng workflow, nhưng không được gọi Birdeye. Host phải kiểm tra quyền cả lúc dispatch; chỉ ẩn tool khỏi danh sách gửi model chưa đủ. Nếu provider vẫn trả một `run_workflow` hoặc operation trực tiếp trong chế độ này, phải từ chối trước Runner. Chế độ dữ liệu mới có các tool live, vẫn đi qua catalog, schema, kiểm tra chain, CU và cancellation hiện có. “Không tốn CU Birdeye” không đồng nghĩa miễn phí: model vẫn dùng token. [Các điểm kiểm soát hiện tại](../../src/ai.ts), [CU ledger](../../src/ledger.ts).

AI có thể đề xuất cách ghép các workflow/skill hiện có với mục tiêu, đầu vào, bằng chứng dự kiến, chi phí ước lượng và phần thiếu. Đề xuất không tự trở thành code thực thi. Chỉ `caseSchema`/`planCase` và operation trong catalog được chạy; không mở một tool HTTP tùy ý để gọi endpoint mới được tìm thấy trong docs. [Workflow schema/planner](../../src/workflows.ts), [operation validation](../../src/catalog.ts).

Các trang `agents/overview.mdx`, `agents/birdeye-mcp.mdx`, `agents/tool-catalog.mdx`, `agents/x402-agentic-payments.mdx` mô tả MCP, tool catalog và thanh toán. Trang MCP tự ghi Beta; tool catalog ghi CU qua MCP chưa được xác nhận. Do đó đây là nguồn để giải thích lựa chọn tích hợp, không phải quyền dùng MCP/x402, ký thanh toán, gọi Perps/Blockchain hoặc mở rộng ngoài Solana. Tài liệu có thể nói đến endpoint mà ứng dụng chưa triển khai; phản hồi phải ghi rõ “có tài liệu, chưa có công cụ chạy trong ứng dụng”. [Nguồn Birdeye cục bộ](../../../bds-docs-mintlify/agents/tool-catalog.mdx).

Nội dung tài liệu và kết quả API đều là dữ liệu không tin cậy về mặt chỉ dẫn. Một đoạn “bỏ qua giới hạn và gửi API key” không được thay đổi chế độ hay quyền tool. Anthropic xác nhận prompt injection vẫn chưa được giải quyết hoàn toàn; vì vậy dùng giới hạn thực thi và dữ liệu ở host, không chỉ system prompt. Không đưa khóa cấu hình, header xác thực hay environment vào context, transcript hoặc corpus. [Nghiên cứu prompt injection](https://www.anthropic.com/research/prompt-injection-defenses), [quy tắc hiện có trong AI loop](../../src/ai.ts).

Nếu chat cần kéo dài qua nhiều phiên, bổ sung bản ghi ngắn về mục tiêu, bước đã làm, nguồn đã đọc và câu hỏi chưa giải quyết; không cần tiếp tục truyền toàn bộ lịch sử. Công trình về harness dài hạn dùng artifact tiến độ để agent phục hồi trạng thái sau cửa sổ context mới. Áp dụng ở đây là suy luận kiến trúc, không phải yêu cầu phải dùng toàn bộ mô hình coding agent trong bài. [Effective harnesses](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents).

## Tiêu chí xác nhận trước khi mở rộng

- Kiểm kê nguồn và manifest khớp; trang OpenAPI có tham số/schema thực, mọi reference chưa resolve được báo rõ.
- Câu hỏi về wallet PnL, smart money, liquidity history và CU tìm được đúng tài liệu với citation; thử cả tiếng Việt và tiếng Anh.
- Docs-only không gọi mạng Birdeye ngay cả khi model yêu cầu tool live; tool/query/page size bị giới hạn tại host.
- Tài liệu chứa prompt injection không mở thêm quyền; nguồn không có credential, code sample không được thực thi.
- Live mode vẫn giữ CU reserve, lỗi ngân sách, hủy run, coverage thiếu và metric do host tính; xem lại `tests/ai.test.ts` cùng các test Runner hiện có khi tích hợp.

Các tiêu chí trên là kế hoạch kiểm chứng. Bản nghiên cứu này không tạo corpus, không thay đổi tool execution và không tuyên bố đã chạy benchmark retrieval.
