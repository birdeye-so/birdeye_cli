# Birdeye CLI

[English quick start](README.md) · [Changelog](CHANGELOG.md) · [Release process](docs/RELEASING.md)

Bản tham khảo chi tiết được giữ lại từ README trước khi tách tài liệu. Các ghi chú kiểm thử ở phần cuối phản ánh lịch sử phát triển; quy trình phát hành nằm trong [Release process](docs/RELEASING.md).

CLI dữ liệu Solana với CU accounting, output `--short` và giao diện local để nghiên cứu token, thị trường và danh mục ví. Bản đầu dùng Birdeye API cho dữ liệu và provider OpenAI-compatible do bạn cấu hình cho hỏi đáp AI.

Tra nhanh: [Cài đặt](#cài-đặt-và-bắt-đầu-sử-dụng) · [Tham số CLI và ý nghĩa](#cli-arguments) · [Demo cho khách hàng](docs/workflows/customer-demos.md).

## API wrapper chạy riêng

`birdeye-api` là entrypoint riêng cho service nghiên cứu, mặc định port 8788:

```bash
npm run build
npm run api:start -- --port 8788 --max-cu 320
# Nếu đã cài package global: birdeye-api --port 8788 --max-cu 320
```

Client gửi Birdeye API key của user qua header `X-API-KEY` trong từng request live. Wrapper dùng đúng key đó cho mọi lời gọi Birdeye và retry của request; CU được tính vào tài khoản Birdeye của user. Server không đọc key từ env/config, không dùng lại key của request trước và không yêu cầu token internal riêng. Key không được lưu vào input/history; ledger chỉ giữ fingerprint. `POST /price-surge` hỗ trợ Solana, BSC, Base, Ethereum, Robinhood; holder health chỉ Solana. `POST /token-dd` chỉ hỗ trợ Solana, có mode standard/advanced. Cả hai trả dữ liệu nguồn, kết quả tính toán, phần còn thiếu và CU; `estimate_cu: true` chỉ lập kế hoạch, không gọi Birdeye và không cần key.

`--max-cu` trên service là trần mỗi request, client chỉ có thể giảm. Mỗi process chạy tối đa một live request; chạy lại POST sẽ tạo run và tiêu CU mới. CLI/skill tiếp tục dùng logic chung trong process của CLI. Web interface vẫn chạy riêng qua `birdeye-cli --format interface` trên port 8787; `/price-surge` đã chuyển khỏi interface, không dùng cookie của UI nữa. Xem [hướng dẫn API, input Token Due-Diligence Score, giới hạn và chuyển đổi client](docs/workflows/internal-api.md).

## Cài đặt và bắt đầu sử dụng

Hướng dẫn dưới đây dùng terminal Bash/Zsh trên macOS/Linux; trên Windows có thể dùng terminal WSL. Chọn **một** trong hai cách cài ở bước 2. Bản hướng dẫn này đi kèm package **0.4.0**; tên file và kết quả `--version` phải khớp bản bạn nhận.

### 1. Chuẩn bị

- Cài **Node.js từ 22.16 trở lên** và npm từ [trang tải Node.js](https://nodejs.org/en/download). CLI dùng SQLite tích hợp trong Node, không cần cài SQLite server, Docker hoặc Python.
- Cần Birdeye API key để tải dữ liệu thật. Tạo tài khoản/key theo [hướng dẫn Birdeye Data](https://data.birdeye.so/docs/getting-started); các endpoint sử dụng phải được gói API của bạn cho phép.
- AI là tùy chọn: chỉ cần provider, base URL, model và AI key khi dùng chat. Các workflow dữ liệu chạy được với Birdeye key mà không cần AI.
- Cần mạng để npm tải dependencies và để gọi Birdeye/AI/GitHub. Xem dữ liệu History đã lưu và ước tính CU không cần gọi API.

Kiểm tra trước khi cài:

```bash
node --version
npm --version
```

Node 22 có thể in `ExperimentalWarning: SQLite is an experimental feature` trên stderr; đây không phải lỗi cài đặt, JSON vẫn nằm riêng trên stdout.

### 2A. Cài từ file package `.tgz` — dành cho người dùng

Nhận file `birdeye-cli-0.4.0.tgz` từ người cung cấp bản build, mở terminal tại thư mục chứa file rồi chạy:

```bash
npm install --global ./birdeye-cli-0.4.0.tgz
birdeye-cli --version
birdeye-cli --help
```

`.tgz` (tarball) là file nén chứa package CLI đã build. npm tự giải nén/cài dependencies và tạo lệnh `birdeye-cli`; bạn không cần giải nén hay chạy `npm run build`. Package này **chưa được publish lên npm registry**, vì vậy hãy dùng đường dẫn file nhận được, không thay bằng `npm install -g birdeye-cli`.

Sau khi cài global, có thể chạy `birdeye-cli` từ bất kỳ thư mục nào. Nếu tên file khác phiên bản trên, thay bằng tên file thực tế.

### 2B. Chạy từ source — dành cho người có mã nguồn

Clone repo hoặc giải nén source do người cung cấp dự án gửi, rồi mở terminal trong thư mục chứa `package.json` và `package-lock.json`. Source của CLI là dự án này; repo `gmgn-skills` và `birdeye-data-skills` là nguồn tham khảo workflow, không phải bộ cài CLI.

```bash
npm ci
npm run build
node dist/index.js --version
node dist/index.js --help
```

Với cách này, **thay `birdeye-cli` trong các ví dụ bên dưới bằng `node dist/index.js`** và chạy từ thư mục source. Ví dụ mở UI:

```bash
node dist/index.js --format interface --bind 127.0.0.1:8787
```

Nếu muốn tạo file cài để dùng global hoặc gửi cho người khác, chạy từ source đã cài dependencies:

```bash
npm pack
# npm pack tự build qua prepack và in tên file .tgz ở cuối
npm install --global ./birdeye-cli-0.4.0.tgz
birdeye-cli --version
```

#### Ubuntu dùng nvm: cài xong nhưng `birdeye-cli: command not found`

CLI cần Node >=22.16; log `current: node v18...` nghĩa là shell vẫn đang chọn Node 18. Cảnh báo `EBADENGINE` không giải thích đầy đủ việc thiếu executable: npm còn phải tạo link vào đúng prefix. Với nvm, global packages thuộc từng phiên bản Node. Không dùng `sudo npm install` cho Node được cài bằng nvm.

Ví dụ file nằm ở `/path/to/birdeye_cli/birdeye-cli-0.4.0.tgz`:

```bash
nvm install 22
nvm use 22
node -v

# NVM_BIN do nvm use thiết lập; cài vào đúng phiên bản đang dùng, bật tạo executable link
npm install --global --prefix "$NVM_BIN/.." --bin-links=true /path/to/birdeye_cli/birdeye-cli-0.4.0.tgz
hash -r
command -v birdeye-cli
birdeye-cli --version
birdeye-cli --format interface --bind 127.0.0.1:8787
```

Khi mở shell mới hoặc đổi Node, chạy lại `nvm use 22` trước khi gọi CLI. Lệnh cài trên chỉ đặt prefix cho lần cài này, không sửa npm config của các ứng dụng khác.

Nếu vẫn thiếu lệnh, kiểm tra các giá trị cụ thể (không cần gửi toàn bộ `.npmrc`, vì file đó có thể chứa token):

```bash
node -v
command -v npm
npm prefix -g
npm config get bin-links
ls -l "$NVM_BIN/birdeye-cli"
tar -xOf /path/to/birdeye_cli/birdeye-cli-0.4.0.tgz package/package.json
tar -tzf /path/to/birdeye_cli/birdeye-cli-0.4.0.tgz | grep '^package/dist/index.js$'
```

`npm` là file executable, không phải thư mục để `cd` vào. Nếu cần chạy ngay từ source đã build, sau `nvm use 22` dùng `node /path/to/birdeye_cli/dist/index.js --format interface --bind 127.0.0.1:8787`.

Tham khảo: [npm global executable locations](https://docs.npmjs.com/cli/v10/configuring-npm/folders/) và [nvm: global packages theo phiên bản](https://github.com/nvm-sh/nvm#usage).

### 3. Cấu hình Birdeye một lần

Có thể chọn cấu hình qua **CLI** hoặc **UI**; cả hai cùng lưu vào SQLite local.

Qua CLI, chạy lệnh rồi dán Birdeye key vào prompt ẩn:

```bash
birdeye-cli config init
birdeye-cli config show --short
birdeye-cli doctor --short
```

Kỳ vọng `birdeyeConfigured: true`; `doctor` hiển thị thư mục/database đang dùng. Các lệnh này không gọi Birdeye và không tiêu CU. Không truyền API key vào cờ lệnh.

Hoặc mở UI để nhập key:

```bash
birdeye-cli --format interface --bind 127.0.0.1:8787
```

Mở **http://127.0.0.1:8787** → **Settings** → nhập Birdeye API key → giữ chọn **Save keys and provider settings on this machine** → **Save connections**. Sau khi lưu, ô key có thể trống nhưng trạng thái phải là **Configured**; UI không hiện lại secret. Để trống key khi lưu lại sẽ giữ key đã lưu.

Restart với cùng tài khoản hệ điều hành và cùng config directory sẽ giữ key. Browser tự kết nối khi bind loopback, trừ khi bật `--require-code` hoặc `--public-url`. Nếu cần nhập code, dùng code in ở terminal của server đang chạy, không dùng API key.

### 4. Kiểm tra và chạy lệnh đầu tiên

Kiểm tra miễn phí, chưa gửi request ra Birdeye:

```bash
birdeye-cli capabilities --short
birdeye-cli cases --short
birdeye-cli token price So11111111111111111111111111111111111111112 --estimate-cu --short
```

Lệnh price trên dự kiến **3 CU** theo catalog. Để kiểm tra key và lấy dữ liệu thật, chạy riêng các lệnh sau; chúng có tiêu CU:

```bash
# Kiểm tra kết nối Birdeye: ước tính 1 CU trước retry
birdeye-cli doctor --live --short
# Lấy giá WSOL: ước tính 3 CU, giới hạn budget 3 CU
birdeye-cli token price So11111111111111111111111111111111111111112 --max-cu 3 --short
# Xem CU đã ghi nhận, không gửi request mới
birdeye-cli usage show --short
```

`--short` rút gọn output để tiết kiệm token khi đưa vào AI; không giảm số CU của cùng request. Muốn JSON đầy đủ, bỏ `--short`. `--estimate-cu` chỉ lập kế hoạch; bỏ cờ này mới chạy API. `--max-cu` đặt giới hạn CU ước tính khi cần; mặc định không giới hạn CU.

### 5. Dùng giao diện nghiên cứu

```bash
birdeye-cli --format interface --bind 127.0.0.1:8787 --max-cu 250 --session-max-cu 2000
```

Giữ terminal này mở, truy cập URL được in ra. Cổng 8787 là lựa chọn trong hướng dẫn; nếu bỏ `--bind`, mặc định hiện tại là `127.0.0.1:3000`. Chỉ mở UI chưa gọi API; các lệnh mở kèm token/workflow có thể chạy tác vụ khởi đầu sau khi kết nối.

1. Trong **Case studies**, chọn workflow/skill, đọc mục đích và nhập địa chỉ nếu được yêu cầu.
2. Xem **Workflow overview**, chỉnh tham số từng bước và kiểm tra CU trước khi **Run research**. **CLI command** mở sẵn mặc định để xem/copy lệnh tương ứng, gồm window, CU limit và tham số API đã chỉnh. Demos và Imports cũng có mục này; Imports cần preview mapping trước. Copy lệnh không gọi API. Lệnh dùng cú pháp Bash/Zsh và cấu hình CLI trên máy thực thi.
3. Dùng **History** để mở lại kết quả hoặc export dữ liệu, không gọi lại API. Chạy research mới sẽ gọi API mới.
4. Trong **Imports**, nhập URL GMGN hoặc upload/paste workflow. Xem mapping, phần chưa hỗ trợ, tham số và CU; bấm **Preview mapping & CU** trước khi chạy. Import/preview không tiêu Birdeye CU.
5. Nhấn `Ctrl+C` ở terminal để dừng. Chạy lại cùng lệnh để mở lại; cấu hình, imports và History vẫn được giữ.

Ví dụ import từ CLI, miễn CU:

```bash
birdeye-cli workflow import https://github.com/GMGNAI/gmgn-skills/tree/main/docs
birdeye-cli workflow imports list --short
birdeye-cli history list --limit 20 --short
```

### 6. Thêm AI chat — tùy chọn

Trong **Settings → AI provider**, nhập base URL, model ID, API key và chọn API format mà provider hỗ trợ: **Responses** hoặc **Chat Completions**. Provider cần hỗ trợ tool/function calling để AI gọi dữ liệu. Base URL là gốc API, không phải URL kết thúc bằng `/responses` hay `/chat/completions`.

Hoặc cấu hình qua prompt CLI; `--save-key` nhập key ẩn và lưu để dùng sau restart:

```bash
birdeye-cli config ai init --api-format responses --save-key
birdeye-cli config ai show --short
# Gửi một request thử tới AI, có dùng AI tokens
birdeye-cli doctor --ai --short
```

Nếu provider chỉ hỗ trợ Chat Completions, thay `responses` bằng `chat-completions`. Nhập đúng model ID do provider cung cấp. Nếu cấu hình bằng CLI khi UI đang mở, dừng/khởi động lại UI để nạp cấu hình mới.

Mở khung chat trong UI và gửi câu hỏi. Chat mới mặc định cho phép lấy dữ liệu Birdeye mới; bỏ chọn **Allow new Birdeye requests** nếu chỉ muốn hỏi trên docs/dữ liệu đã lưu. Cả hai chế độ vẫn có thể dùng AI tokens. CU của Birdeye và token của AI được ghi riêng; MCP có thể có chi phí chưa xác định như mô tả ở phần MCP phía dưới.

### 7. Chạy trên server qua SSH tunnel

Cài CLI, cấu hình key và chạy trên server:

```bash
birdeye-cli --format interface --bind 127.0.0.1:8787
```

Trên máy cá nhân, mở terminal khác, thay `user@remote-host` bằng tài khoản/server của bạn:

```bash
ssh -N -L 8787:127.0.0.1:8787 user@remote-host
```

Giữ cả tiến trình server và tunnel đang chạy, mở **http://127.0.0.1:8787** trên máy cá nhân. Nếu cổng local 8787 đang bận, đổi **cả server và tunnel** sang 8788: chạy server với `--bind 127.0.0.1:8788`, tunnel bằng `ssh -N -L 8788:127.0.0.1:8788 user@remote-host`, rồi mở `http://127.0.0.1:8788`. Giữ cùng port ở hai đầu để Host/Origin khớp kiểm tra của CLI. API keys và SQLite nằm trên máy chạy CLI. Dùng SSH tunnel không cần bind `0.0.0.0` hoặc mở cổng UI ra Internet.

#### Chia sẻ connection code để nhiều người test qua tunnel

Connection code dùng lại được cho nhiều browser trong cùng phiên server. Mã và session cookie cũ hết hiệu lực khi restart; lấy mã mới từ terminal. Người kết nối dùng chung workspace, cấu hình, lịch sử và ngân sách API; chưa có tài khoản hay phân quyền riêng.

Trên server, bật yêu cầu code cả khi truy cập qua tunnel:

```bash
node dist/index.js --format interface --bind 127.0.0.1:8787 --require-code
```

Mỗi người chạy tunnel trên máy của mình (cần quyền SSH vào server):

```bash
ssh -N -L 8787:127.0.0.1:8787 user@remote-host
```

Mở `http://127.0.0.1:8787`, nhập cùng connection code do người chạy server chia sẻ. Test bằng hai browser hoặc một cửa sổ thường và một cửa sổ riêng tư: cả hai phải kết nối được bằng cùng mã. Restart server thì mã và cookie cũ phải bị từ chối. Giới hạn 10 lần thử kết nối/phút dùng chung cho server vẫn áp dụng. Với server có `--public-url`, truy cập đúng domain public; ví dụ tunnel local này dành cho server không đặt `--public-url`.

```bash
# Regression test: nhiều browser, mã sai, giới hạn thử và vô hiệu hóa sau restart
npx tsc -p tsconfig.test.json
node --test --test-name-pattern='connection codes admit multiple browsers' .test-dist/tests/interface.test.js
```

#### Cloudflare → Nginx → CLI

Nếu dùng domain HTTPS qua Nginx, khai báo URL browser bằng `--public-url`. Nginx kết thúc TLS và chuyển tiếp HTTP đến CLI trên loopback. Thay `research.example.com` trong toàn bộ ví dụ bằng domain thật; triển khai ở gốc domain, không phải subpath.

Sau khi cập nhật source chứa bản sửa proxy, build và khởi động lại process đang chạy:

```bash
nvm use 22
npm run build
node dist/index.js --format interface --bind 127.0.0.1:8787 \
  --public-url https://research.example.com
```

Nếu dùng bản cài global, cần đóng gói/cài lại tarball mới trước khi chạy `birdeye-cli` với cùng tham số. Build source không cập nhật bản global đã cài:

```bash
npm pack
npm install --global --prefix "$NVM_BIN/.." --bin-links=true ./birdeye-cli-0.4.0.tgz
```

Trong `server` HTTPS của Nginx đang phục vụ domain đó, dùng:

```nginx
location / {
    proxy_pass http://127.0.0.1:8787;
    proxy_http_version 1.1;
    proxy_set_header Host $http_host;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_buffering off;
    proxy_cache off;
    proxy_read_timeout 3600s;
}
```

Giữ nguyên header `Origin` của browser. `Host` phải là domain public (kèm port nếu không dùng port mặc định), không phải `127.0.0.1:8787`. CLI kiểm tra Host/Origin theo `--public-url`, không dùng `X-Forwarded-*` để cấp quyền. Cookie có `Secure` khi public URL dùng HTTPS. Giao diện qua public URL cần connection code in ở terminal; loopback upstream không bật tự đăng nhập cho người truy cập domain.

```bash
sudo nginx -t && sudo systemctl reload nginx

# Kiểm tra upstream từ server, không gọi Birdeye/AI:
# 401 CONNECT_REQUIRED = Host/Origin đã đúng, chưa có session đăng nhập
curl -i http://127.0.0.1:8787/api/status \
  -H 'Host: research.example.com' -H 'Origin: https://research.example.com'

# Origin khác vẫn bị chặn: 403 ORIGIN_DENIED
curl -i http://127.0.0.1:8787/api/status \
  -H 'Host: research.example.com' -H 'Origin: https://evil.example'

# Qua cả Cloudflare/Nginx, trước đăng nhập cũng phải nhận 401
curl -i https://research.example.com/api/status
```

Cloudflare dùng **Full (strict)** với chứng chỉ hợp lệ trên Nginx và bỏ qua cache cho hostname giao diện/API. Không cần mở port 8787 ra Internet. Tham khảo [Nginx proxy headers/buffering](https://nginx.org/en/docs/http/ngx_http_proxy_module.html) và [Cloudflare Full (strict)](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full-strict/).

Regression tests cho Host/Origin, proxy HTTPS, cookie và connection code chạy trong process, không gọi API và không cần mở cổng:

```bash
npx tsc -p tsconfig.test.json
node --test .test-dist/tests/interface.test.js
```

### 8. Dữ liệu lưu ở đâu, cập nhật và gỡ cài đặt

Mặc định dùng `~/.config/birdeye` của tài khoản đang chạy CLI:

| File | Dữ liệu được giữ qua restart |
| --- | --- |
| `config.sqlite` | Birdeye key, AI key và cấu hình provider/profile |
| `usage.sqlite` | CU ledger, kết quả/dataset/chat History, workflow imports và chỉ mục docs |

Không cần cài dịch vụ database. Key được lưu local với quyền file riêng tư, **không mã hóa**; bảo quản cả bản sao lưu như dữ liệu chứa key. `doctor --short` cho biết đường dẫn thực tế. Có thể chọn thư mục khác cho phiên terminal:

```bash
export BIRDEYE_CONFIG_DIR="$HOME/.config/birdeye-work"
birdeye-cli doctor --short
birdeye-cli --format interface --bind 127.0.0.1:8787
```

Dùng cùng giá trị cho mọi lệnh cấu hình/chạy và mỗi lần restart. Hoặc thêm `--config-dir /duong/dan/tuy-chon` vào từng lệnh. Cờ `--config-dir` ưu tiên hơn `BIRDEYE_CONFIG_DIR`. Chạy bằng tài khoản khác, `sudo`, hoặc thư mục config khác sẽ đọc một bộ dữ liệu khác.

Biến môi trường `BIRDEYE_API_KEY` và biến AI key của profile (mặc định `BIRDEYE_AI_API_KEY`) ưu tiên hơn key đã lưu. CLI không tự nạp file `.env`. Nếu muốn dùng key từ SQLite, bỏ environment override trong terminal chạy CLI rồi restart server. Bỏ chọn lưu trong Settings chỉ áp dụng config cho phiên hiện tại, không xóa bản đã lưu trước đó.

Trước khi sao lưu, dừng tất cả tiến trình CLI đang dùng thư mục đó bằng `Ctrl+C`. Ví dụ sao lưu nguyên thư mục mặc định hoặc thư mục đang chọn qua environment:

```bash
birdeye_backup="$HOME/birdeye-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -m 700 "$birdeye_backup"
cp -R "${BIRDEYE_CONFIG_DIR:-$HOME/.config/birdeye}/." "$birdeye_backup/"
```

Nếu dùng `--config-dir`, thay đường dẫn nguồn trong lệnh `cp` bằng đường dẫn mà `doctor` báo. Để thử đọc bản sao lưu mà không ghi đè dữ liệu hiện tại, chạy `birdeye-cli doctor --config-dir "$birdeye_backup" --short`, sau đó dùng cùng cờ khi mở UI.

**Cập nhật bản global:** dừng UI, nhận file `.tgz` mới, chạy `npm install --global ./ten-file-moi.tgz`, kiểm tra `birdeye-cli --version` rồi mở lại UI. Dùng đúng tên file nhận được. Cài lại package không xóa thư mục cấu hình.

**Cập nhật bản source:** nhận source mới, chạy `npm ci` và `npm run build`, rồi restart `node dist/index.js ...`. Nếu dùng lệnh global thì cần `npm pack` và cài lại file `.tgz` mới; build source không tự cập nhật bản global. Refresh tab trình duyệt sau khi restart.

**Gỡ bản global:** `npm uninstall --global birdeye-cli`. Lệnh này gỡ CLI, vẫn giữ thư mục cấu hình và dữ liệu để dùng lại. Xóa từng lượt/toàn bộ History qua UI vẫn giữ API keys và CU ledger.

### 9. Lỗi thường gặp

| Triệu chứng | Cách kiểm tra/xử lý |
| --- | --- |
| `node: command not found`, `npm: command not found`, `ERR_UNKNOWN_BUILTIN_MODULE` với `node:sqlite` | Cài Node đúng yêu cầu, mở terminal mới rồi kiểm tra `node --version`. |
| `birdeye-cli: command not found` | Kiểm tra cài global đã thành công bằng `npm list --global birdeye-cli --depth=0`; kiểm tra PATH bằng `command -v birdeye-cli`. Nếu chạy source, dùng `node dist/index.js`. |
| `EACCES` khi cài global | Dùng npm prefix thuộc tài khoản của bạn theo hướng dẫn ngay dưới bảng, hoặc chạy trực tiếp từ source. |
| `Cannot find module .../dist/index.js` | Đứng trong đúng thư mục source, chạy `npm ci` rồi `npm run build`. |
| UI vẫn là bản cũ | Kiểm tra `command -v birdeye-cli` và `birdeye-cli --version`; dừng server cũ, cài/build lại đúng cách rồi restart và refresh browser. Cùng số version vẫn có thể là hai build khác nhau. |
| Cổng bận / `EADDRINUSE` | Dừng server cũ bằng `Ctrl+C` hoặc chọn `--bind 127.0.0.1:8788` và mở đúng URL mới. |
| `ORIGIN_DENIED` | Mở đúng URL in trong terminal. Với loopback dùng `http://127.0.0.1:8787`. Qua Cloudflare/Nginx: dùng bản CLI đã cập nhật, đặt `--public-url https://domain` và giữ Host public ở proxy; xem cấu hình phía trên. |
| UI yêu cầu connection code | Dùng code của server hiện tại; cùng mã dùng lại được cho nhiều browser đến khi restart. Với local, bỏ `--require-code`/`--public-url` nếu không cần chế độ này. |
| Save config lỗi hoặc restart mất key | Xem lỗi trong UI, dùng `doctor --short` kiểm tra config directory, tài khoản, quyền ghi và environment overrides. Giữ checkbox lưu trên máy khi Save. |
| Birdeye trả 401/403 | Kiểm tra key, gói API và quyền endpoint; chạy `doctor --live` để kiểm tra cơ bản (có CU). Key hoạt động ở một endpoint chưa đảm bảo quyền ở tất cả endpoint. |
| Import GMGN trả 403/429 | Bản hiện tại tự chuyển sang 9 file raw khi API liệt kê lỗi. Nếu raw cũng bị chặn, dùng file local/upload; thông báo mới ghi rõ host. |
| AI báo thiếu cấu hình/key hoặc lỗi 404 | Kiểm tra base URL, model, API format và `config ai show`; lưu key bằng Settings hoặc `config ai init --save-key`. `doctor --ai` thử kết nối và dùng AI tokens. |
| `CU_BUDGET_EXCEEDED` hoặc kết quả `partial` | Xem CU/mục dữ liệu thiếu; giảm số lượng/bước hoặc tăng budget sau khi estimate. Exit code `5` là kết quả một phần, không tự chạy lại nếu chưa xem chi phí. |

Nếu npm global không có quyền ghi, cấu hình prefix riêng cho tài khoản rồi cài lại file package:

```bash
npm config set prefix "$HOME/.local"
export PATH="$HOME/.local/bin:$PATH"
npm install --global ./birdeye-cli-0.4.0.tgz
birdeye-cli --version
```

Thêm dòng `export PATH="$HOME/.local/bin:$PATH"` vào file cấu hình shell của bạn (`~/.zshrc` cho Zsh hoặc `~/.bashrc` cho Bash) để terminal sau vẫn tìm thấy CLI. Lựa chọn prefix này áp dụng cho các package npm global của tài khoản.

Các phần tiếp theo là lệnh tham khảo, cơ chế CU/AI và quy trình test chi tiết. Những placeholder như `<token-address>`, `<import-id>` phải được thay bằng giá trị thực trước khi chạy.

<a id="cli-arguments"></a>

## Tham số CLI: cú pháp, ý nghĩa và mặc định

Tham chiếu cho bản CLI đi kèm README này. Nếu chạy từ source, thay `birdeye-cli` bằng `node dist/index.js`.

```text
birdeye-cli [cờ chung] <nhóm lệnh> <lệnh con> [đối số] [cờ của lệnh]
birdeye-cli case <kind> [cờ workflow] [cờ chung]
birdeye-cli --format interface [cờ giao diện]
```

`<...>` là giá trị cần thay, không nhập dấu ngoặc. `[ ... ]` trong cú pháp là phần tùy chọn. Đối số vị trí như địa chỉ phải đứng sau lệnh con; ví dụ `token price ADDRESS`, còn `case` dùng `--address ADDRESS`. Tác vụ Solana cần địa chỉ base58 hợp lệ; các operation EVM được hỗ trợ cần địa chỉ contract `0x` 20 byte. Không dùng symbol hoặc chuỗi base64. Dùng dấu nháy cho chuỗi có khoảng trắng, đường dẫn và JSON.

```bash
birdeye-cli --help
birdeye-cli token top-traders --help
birdeye-cli case --help
birdeye-cli workflow imports run --help
birdeye-cli config ai init --help
# Catalog kèm schema, enum, giá trị mặc định và CU; không gọi API
birdeye-cli capabilities
```

### Cờ chung

| Cờ | Mặc định / giá trị | Ý nghĩa |
| --- | --- | --- |
| `-h`, `--help` | Không cần giá trị | Xem trợ giúp của cấp lệnh hiện tại; không chạy tác vụ. |
| `-V`, `--version` | Không cần giá trị | In phiên bản CLI. |
| `--format <format>` | `json`; nhận `json`, `table`, `interface` | JSON cho automation; table để đọc nhanh; interface mở UI ở các lệnh có hỗ trợ. |
| `--short` | Tắt | Output ngắn, JSON một dòng; không giảm CU của request. Không cần truyền `true`. |
| `--chain <chain>` | `solana` | Chain tùy skill/operation: Price Surge hỗ trợ solana, bsc, base, ethereum, robinhood; các skill khác chỉ Solana. Xem [ma trận hỗ trợ](docs/workflows/skill-support.md). |
| `--max-cu <cu>` | Không giới hạn; nếu đặt thì số nguyên ≥ 0 | Budget CU ước tính mỗi lượt; với `workflow create` là budget của nhóm workflow mới. Không bao gồm AI tokens hoặc chi phí MCP chưa xác định. |
| `--workflow <id>` | Không có | Khi chạy API qua CLI, ghi CU vào budget tích lũy đã tạo bằng `workflow create`; dùng với `usage show` để lọc tổng CU theo nhóm. Đây không phải ID workflow import; UI dùng `--session-max-cu` cho budget phiên. |
| `--estimate-cu` | Tắt | Lập kế hoạch cho lệnh dữ liệu, `case` hoặc `workflow imports run`, không gửi request Birdeye. Không phải dry-run chung cho lệnh ghi config/import. |
| `--config-dir <path>` | `BIRDEYE_CONFIG_DIR`, nếu không có thì `~/.config/birdeye` | Chọn thư mục SQLite/config cho lệnh; ưu tiên hơn environment. |
| `--ai-profile <name>` | Default profile trong config, ban đầu `research` | Chọn profile AI cho UI hoặc `doctor --ai`; không tạo profile mới. |

`--format interface` mở UI khi chạy lệnh gốc, lệnh dữ liệu, `case` hoặc `history show`. `workflow imports run` cần chạy qua CLI hoặc tab Imports, không nhận chế độ mở UI trực tiếp. Các lệnh chỉ in config/catalog/list không tự mở web server dù nhận cờ output chung. Chỉ dùng cờ trong phạm vi mô tả; ví dụ `config init --estimate-cu` vẫn là lệnh lưu cấu hình.

### Cờ giao diện và kết nối

| Cờ | Mặc định / giá trị | Ý nghĩa |
| --- | --- | --- |
| `--bind <host:port>` | `127.0.0.1:3000` | Địa chỉ listen; chỉ dùng cùng `--format interface`. Ví dụ `127.0.0.1:8787`, IPv6 là `[::1]:8787`. |
| `--session-max-cu <cu>` | Không đặt budget session riêng | Giới hạn CU tích lũy của các lượt chạy trong phiên UI; budget mỗi lượt vẫn áp dụng. Restart tạo phiên mới. |
| `--require-code` | Tắt trên loopback | Bắt nhập connection code kể cả local. Remote hoặc `--public-url` luôn cần code. |
| `--tls-cert <path>` | Không có | File chứng chỉ HTTPS; phải đi cùng `--tls-key`. Bắt buộc nếu bind ngoài loopback. |
| `--tls-key <path>` | Không có | File private key cho chứng chỉ HTTPS. |
| `--public-url <url>` | URL từ địa chỉ bind | URL browser được phép truy cập, dùng kiểm tra Host/Origin. HTTPS public có thể đi qua reverse proxy đến HTTP loopback. Các trường hợp khác giao thức phải khớp server. Bắt buộc cho wildcard `0.0.0.0`/`[::]`; bind remote vẫn cần TLS trực tiếp. |

```bash
birdeye-cli --format interface --bind 127.0.0.1:8787 \
  --ai-profile research --max-cu 250 --session-max-cu 2000
```

### Đối số và cờ các lệnh quản lý

| Lệnh | Đối số / cờ riêng | Ý nghĩa |
| --- | --- | --- |
| `capabilities` | Không có | Xem API operations, schema và CU local. |
| `chains` | `--refresh` | Không có cờ: chain CLI hỗ trợ. Có cờ: hỏi upstream, ước tính 1 CU; không bật thêm chain cho CLI. |
| `cases` | Không có | Liệt kê workflow, mục đích và loại subject. |
| `demos` | Không có | Liệt kê 5 use case sản phẩm chạy trên workflow thật, không gọi API. |
| `demo <id>` | `--address`, `--limit`, `--min-liquidity`, `--max-top10-pct`, `--from`, `--to` | Chạy snapshot sản phẩm. `limit` cho terminal hoặc wallet discovery (1–5, mặc định 3); wallet không có `--address` sẽ discover trước, có `--address` sẽ phân tích ví đã chọn; hai ngưỡng cho security (mặc định 100.000 USD/50%); from/to là cặp Unix giây. Dùng `--estimate-cu` để preview miễn CU. Xem [hướng dẫn demo](docs/workflows/customer-demos.md). |
| `usage show` | Dùng cờ chung `--workflow <id>`, `--short` | Đọc CU ledger; bản full kèm attempts. |
| `usage credits` | Không có cờ riêng | Lấy credits toàn tài khoản từ Birdeye, ước tính 1 CU. |
| `workflow create` | `--label <label>` mặc định `research` | Tạo nhóm budget, trả ID để dùng với `--workflow`; budget lấy từ `--max-cu`. |
| `workflow show <id>` | ID budget workflow | Đọc budget đã tạo. |
| `workflow import <source>` | URL GitHub, file hoặc thư mục local; `--ref <revision>` | Nhập định nghĩa, không gọi Birdeye. `--ref` chọn branch/tag/commit cho URL GitHub repo/tree/blob; URL raw dùng ref nằm trong URL. |
| `workflow imports list` | Không có | Liệt kê các definition đã lưu. |
| `workflow imports show <id>` | ID import | Xem mapping và kế hoạch của definition. |
| `workflow imports plan <id>` | `--address <address>`, `--params <json>` mặc định `{}` | Xem kế hoạch/CU, không gọi Birdeye. Thiếu address có thể vẫn preview nhưng chưa chạy được. |
| `workflow imports run <id>` | Cùng cờ với `plan` | Thực thi definition; dùng `--estimate-cu` nếu chỉ muốn preview. |
| `history list` | `--limit <n>` mặc định `50` (1–100); `--before <cursor>` | Đọc một trang History; `before` là `nextCursor` của trang trước, không phải timestamp. |
| `history show <id>` | ID run | Đọc/export snapshot; `--format interface` mở kết quả trong UI. Không gọi lại API. |
| `knowledge search <query>` | Chuỗi truy vấn, đặt trong dấu nháy nếu có khoảng trắng | Tìm docs Markdown local. |
| `knowledge show <id>` | ID tài liệu; `--offset <n>` mặc định `0` (0–10.000.000) | Đọc tài liệu từ vị trí ký tự; offset này không phải offset trang API. |
| `config init` | Không có cờ riêng | Lưu Birdeye key từ `BIRDEYE_API_KEY` hoặc prompt ẩn. |
| `config show` | Không có | Xem trạng thái cấu hình đã che key. |
| `config ai show` | Không có | Xem AI profiles và trạng thái key. |
| `doctor` | `--live` hoặc `--ai` | Không có cờ: kiểm tra local; `--live`: Birdeye, ước tính 1 CU; `--ai`: request AI có token. Chạy hai kiểm tra riêng; nếu truyền cả hai thì `--live` được xử lý trước. |

`workflow imports plan/run --params` nhận JSON gồm `address`, cặp `from`/`to` (Unix giây, `from < to`), `limit` (1–5) và `stepOverrides` theo step ID. Cờ `--address` ưu tiên hơn `address` trong JSON. Với workflow JSON, `limit` chặn số subject lấy từ bước trước; không thay `limit` của từng API. Tham số bên trong `stepOverrides` dùng tên API dạng `snake_case`, không dùng dấu gạch nối.

```bash
# Thay IMPORT_ID bằng ID từ workflow imports list
birdeye-cli workflow imports plan IMPORT_ID \
  --params '{"limit":2,"stepOverrides":{"trending":{"limit":10,"sort_by":"volumeUSD"}}}'
# Step ID phải tồn tại trong definition; ví dụ trên cần bước trending
```

### Cờ cấu hình AI: `config ai init`

| Cờ | Mặc định / giá trị | Ý nghĩa |
| --- | --- | --- |
| `--name <name>` | `research` | Tên profile cần tạo/cập nhật; profile này trở thành default sau khi lưu. |
| `--base-url <url>` | Hỏi qua prompt nếu bỏ trống | Gốc API provider; HTTPS cho remote, HTTP chỉ cho loopback; không kèm credentials/query/fragment. |
| `--model <model>` | Hỏi qua prompt nếu bỏ trống | Model ID của provider. |
| `--api-format <format>` | Profile mới: `responses`; profile cũ: giữ format hiện tại | Nhận `responses` hoặc `chat-completions`. Profile cũ không có format dùng `chat-completions`. |
| `--api-key-env <name>` | Giữ tên đã lưu, nếu chưa có dùng `BIRDEYE_AI_API_KEY` | **Tên** biến môi trường chứa AI key, không phải giá trị secret. |
| `--save-key` | Tắt | Lưu key từ biến môi trường của profile hoặc prompt ẩn vào SQLite. Không có cờ: không sao chép env key vào DB, giữ key cũ nếu provider cùng origin. |

```bash
# Nhập base URL, model và key bằng prompt
birdeye-cli config ai init --name research --api-format responses --save-key
birdeye-cli doctor --ai --ai-profile research --short
```

### Cờ workflow: `case <kind>`

Lấy `<kind>` bằng `birdeye-cli cases --short`. Các giá trị dưới đây là mặc định đầu vào; từng recipe chỉ dùng những cờ liên quan. Xem `--estimate-cu` để biết tham số thực tế và các bước sẽ gọi.

| Cờ | Mặc định / giá trị | Ý nghĩa |
| --- | --- | --- |
| `--address <address>` | Không có | Địa chỉ token/ví theo recipe; bắt buộc với workflow cần subject. Discovery thuần không nhận địa chỉ. |
| `--limit <n>` | `3`; market-shortlist `5`, daily-brief `2`; phạm vi 1–5 | Số subject tối đa được nghiên cứu sâu từ kết quả trước. |
| `--scan-limit <n>` | `50`, phạm vi 1–50 | Số hàng discovery muốn lấy; recipe có thể giới hạn lại theo endpoint. |
| `--interval <interval>` | `24h`; `1h`, `4h`, `24h` | Cửa sổ trending/discovery có hỗ trợ; không đổi mọi window trong workflow. |
| `--depth <depth>` | `core`; `core`, `full` | Độ sâu các workflow cũ; `full` có thể thêm request. Smart Wallets dùng `--skill-depth`. |
| `--duration <duration>` | `30d`; `24h`, `7d`, `30d`, `90d` | Cửa sổ PnL/trades của recipe ví. Wallet Style chỉ `7d`/`30d`; Wallet Score yêu cầu `30d`. |
| `--pnl-method <method>` | `wac`; `wac`, `net_cash` | Phương pháp PnL: giá vốn bình quân hoặc dòng tiền ròng, theo contract của Birdeye. |
| `--step-overrides <json>` | `{}` | Tham số API theo step ID, ví dụ `'{"holders":{"limit":3,"mode":"token_account"}}'`. Dùng tên API dạng `snake_case`; cùng validation với chỉnh step trong UI. |
| `--from <seconds>`, `--to <seconds>` | Tự tính theo recipe | Window quan sát Unix **giây**, truyền đủ cặp và `from < to`. Nếu bỏ trống: kết thúc hiện tại; thường 24h cho token workflow cũ, theo duration cho ví, theo window-days cho token skill. |
| `--stage <stage>` | `newly-created` | Early screening: `newly-listed`, `newly-created`, `near-graduation`, `graduated`. |
| `--source <venue>` | `all` | Venue: `all`, `pump_dot_fun`, `moonshot`, `raydium_launchlab`, `meteora_dynamic_bonding_curve`; newly-listed chỉ nhận `all`. |
| `--min-progress <percent>` | Không có; > 0 và < 100 | Ngưỡng tiến độ bắt buộc khi chọn near-graduation. |
| `--min-liquidity <usd>` | Không có; ≥ 0 | Screening liquidity tối thiểu của workflow cũ. |
| `--max-top10-pct <percent>` | Không có; 0–100 | Screening tỷ trọng supply top-10 **token accounts**, không phải top-10 ví. |
| `--exclude-freezeable` | Tắt | Dừng enrich token nếu freezeable hoặc thiếu dữ liệu để kiểm tra. |
| `--baseline-liquidity <usd>` | Không có; > 0 | Liquidity baseline do người dùng cung cấp, chỉ cho risk-warning. |
| `--baseline-time <seconds>` | Không có | Thời điểm baseline, phải đi cùng baseline-liquidity và trước cuối window quan sát. |
| `--wallets <addresses>` | Không có; 1–10 địa chỉ, cách bằng dấu phẩy | Danh sách ví bắt buộc cho skill-smart-money-leaderboard; không dùng cho recipe khác. |
| `--intervals <durations>` | `24h,7d,30d,90d,all` | Các cửa sổ PnL của wallet skill có hỗ trợ; 1–5 giá trị khác nhau. |
| `--skill-depth <depth>` | `fast`; `fast`, `standard`, `deep` | Smart Wallets: shortlist; thêm PnL; thêm holdings/PnL từng token. |
| `--list-source <source>` | `v3-list`; `v3-list`, `trending` | Nguồn cho skill-trending-list. |
| `--sort-by <field>` | `volume` | Token Trending: `volume`, `liquidity`, `market_cap`, `holder`, `trade_count`, `rank`; trending chỉ volume/liquidity/rank, v3-list không có rank. |
| `--platform <name>` | Không có | Lọc platform với nguồn v3-list. |
| `--resolution <interval>` | `15m` | Nến token skill: `1m`, `5m`, `15m`, `30m`, `1H`, `4H`, `1D`; phân biệt chữ hoa/thường. Không đổi resolution của mọi bước liquidity. |
| `--window-days <days>` | `7`, phạm vi 1–30 | Window mặc định của token skill khi không truyền from/to. |
| `--include <features>` | Không thêm bước tùy chọn | Token DD: `list`, `advanced_security`, `risk_history`, cách bằng dấu phẩy. |
| `--skip-kline` | Tắt | Bỏ bước nến Contract Due-Diligence Score. |
| `--skip-portfolio` | Tắt | Bỏ bước holdings của wallet skill có hỗ trợ. |
| `--skip-first-funded` | Tắt | Bỏ tra cứu lần funding đầu. |
| `--skip-transactions` | Tắt | Bỏ trang transactions/trades của wallet skill có hỗ trợ. |
| `--skip-positions` | Tắt | Bỏ PnL từng token; score cần dữ liệu này có thể không tính được. |

Các cờ screening `--min-liquidity`, `--max-top10-pct`, `--exclude-freezeable` không áp dụng cho `skill-*`; dùng bộ chỉnh tham số API từng bước trong UI. CLI `case` hiện không có cờ `--step-overrides`; JSON `stepOverrides` được hỗ trợ qua `workflow imports plan/run --params` hoặc UI. Cờ boolean workflow như `--skip-kline` là công tắc, không truyền `true/false`.

```bash
birdeye-cli case token-research \
  --address So11111111111111111111111111111111111111112 \
  --depth full --estimate-cu --short
birdeye-cli case skill-trending-list \
  --list-source trending --interval 1h --sort-by volume --scan-limit 10 \
  --estimate-cu --short
```

### Cờ các lệnh dữ liệu

Các bảng dưới liệt kê cờ riêng; cờ chung vẫn áp dụng. API chỉ lấy một trang mỗi lần. `--limit` của API là số hàng trong trang, khác `--limit` của `case` là số subject nghiên cứu sâu.

| Lệnh | Cờ riêng và ý nghĩa |
| --- | --- |
| `token price <address>`, `token overview <address>`, `token security <address>` | Không có cờ riêng; đối số là địa chỉ token. Price/overview chỉ Solana; security hỗ trợ năm chain của Price Surge. |
| `token holders <address>` | `--limit <n>`: mặc định 10, 1–100; `--offset <n>`: mặc định 0, 0–10.000, offset + limit ≤ 10.000; `--mode <mode>`: `wallet` mặc định hoặc `token_account`, cách nhóm holders. |
| `market trending` | `--limit <n>`: mặc định 20, 1–50; `--offset <n>`: mặc định 0; `--interval <window>`: mặc định `24h`, nhận `1h`, `4h`, `24h`; `--sort-by <field>`: mặc định `rank`, nhận `rank`, `volumeUSD`, `liquidity`; `--sort-type <direction>`: mặc định `asc`, nhận `asc`, `desc`. |
| `market ohlcv <address>` | Bắt buộc `--from <seconds>` và `--to <seconds>`, Unix giây, from < to; `--interval <value>` mặc định `1H`, chọn khung nến. Các giá trị: `1s`, `15s`, `30s`, `1m`, `3m`, `5m`, `15m`, `30m`, `1H`, `2H`, `4H`, `6H`, `8H`, `12H`, `1D`, `3D`, `1W`, `1M`. |
| `portfolio holdings <wallet>` | Địa chỉ ví; `--limit <n>` mặc định 20, 1–100; `--offset <n>` mặc định 0. CLI không expose cờ sort cho lệnh này, API params dùng `sort_type: desc`. |

Các wrapper mở rộng bên dưới sinh cờ từ schema. **Boolean phải có giá trị** (`--graduated false`, `--include-zero-balance true`); array truyền bằng dấu phẩy (`--labels dev,kol`). Tên cờ CLI đổi `_` thành `-`, ví dụ `time_from` → `--time-from`; không thay bằng `--from` trừ lệnh có đăng ký cờ đó. Enum phân biệt chữ hoa/thường. Ô “bắt buộc” được schema kiểm tra trước request, dù `--help` của wrapper không đánh dấu required.

<!-- DATA-ARGS-START -->

<details>
<summary>token search &lt;keyword&gt;</summary>

Find token candidates by name/symbol; confirm the contract before research.

| Đối số / cờ | Giá trị hợp lệ | Mặc định / bắt buộc | Ý nghĩa |
| --- | --- | --- | --- |
| `<keyword>` | Chuỗi | Bắt buộc | Từ khóa tìm token theo chế độ/tên trường tìm kiếm. |
| `--target <value>` | `token` | `token` | Loại kết quả tìm kiếm, wrapper chỉ nhận token. |
| `--search-mode <value>` | `exact`, `fuzzy` | `exact` | exact: khớp chính xác; fuzzy: tìm gần đúng. |
| `--search-by <value>` | `combination`, `address`, `name`, `symbol` | `symbol` | Trường dùng để tìm kiếm; combination kết hợp các trường. |
| `--sort-by <value>` | `liquidity`, `volume_24h_usd`, `marketcap` | `volume_24h_usd` | Trường xếp hạng kết quả; dùng đúng tên enum của endpoint. |
| `--sort-type <value>` | `asc`, `desc` | `desc` | asc: tăng dần; desc: giảm dần. |
| `--limit <value>` | Số nguyên; ≥ 1; ≤ 20 | `20` | Số hàng tối đa của một trang trả về. |
| `--offset <value>` | Số nguyên; ≥ 0; ≤ 10000 | `0` | Số hàng bỏ qua trước trang hiện tại. |

</details>

<details>
<summary>token markets &lt;address&gt;</summary>

One page of pools for a token; liquidity is not an executable quote.

| Đối số / cờ | Giá trị hợp lệ | Mặc định / bắt buộc | Ý nghĩa |
| --- | --- | --- | --- |
| `<address>` | Chuỗi | Bắt buộc | Địa chỉ token Solana. |
| `--sort-by <value>` | `liquidity`, `volume24h` | `liquidity` | Trường xếp hạng kết quả; dùng đúng tên enum của endpoint. |
| `--sort-type <value>` | `asc`, `desc` | `desc` | asc: tăng dần; desc: giảm dần. |
| `--limit <value>` | Số nguyên; ≥ 1; ≤ 20 | `10` | Số hàng tối đa của một trang trả về. |
| `--offset <value>` | Số nguyên; ≥ 0; ≤ 10000 | `0` | Số hàng bỏ qua trước trang hiện tại. |

</details>

<details>
<summary>market pair-overview &lt;address&gt;</summary>

Pair-level price, liquidity and activity; requires a pair address.

| Đối số / cờ | Giá trị hợp lệ | Mặc định / bắt buộc | Ý nghĩa |
| --- | --- | --- | --- |
| `<address>` | Chuỗi | Bắt buộc | Địa chỉ pool/pair Solana, không phải token mint. |
| `--ui-amount-mode <value>` | `raw`, `scaled` | `raw` | raw: số lượng theo đơn vị gốc; scaled: số lượng đã điều chỉnh decimals. |

</details>

<details>
<summary>token trade-data &lt;address&gt;</summary>

Token buy/sell activity and unique-wallet metrics for selected frames.

| Đối số / cờ | Giá trị hợp lệ | Mặc định / bắt buộc | Ý nghĩa |
| --- | --- | --- | --- |
| `<address>` | Chuỗi | Bắt buộc | Địa chỉ token Solana. |
| `--frames <value>` | `1m`, `5m`, `30m`, `1h`, `2h`, `4h`, `8h`, `24h`, `6h`, `12h`; ít nhất 1 mục; tối đa 10 mục | `1h,24h` | Các cửa sổ tổng hợp hoạt động/dòng tiền, cách bằng dấu phẩy. |
| `--ui-amount-mode <value>` | `raw`, `scaled` | `raw` | raw: số lượng theo đơn vị gốc; scaled: số lượng đã điều chỉnh decimals. |

</details>

<details>
<summary>token holder-profile &lt;token_address&gt;</summary>

Labeled holder cohorts and supply shares; volume window is 1h.

| Đối số / cờ | Giá trị hợp lệ | Mặc định / bắt buộc | Ý nghĩa |
| --- | --- | --- | --- |
| `<token_address>` | Chuỗi | Bắt buộc | Địa chỉ token Solana. |
| `--interval <value>` | `1h` | `1h` | Cửa sổ tổng hợp dữ liệu của endpoint. |
| `--ui-amount-mode <value>` | `raw`, `scaled` | `raw` | raw: số lượng theo đơn vị gốc; scaled: số lượng đã điều chỉnh decimals. |
| `--include-zero-balance <value>` | `true`, `false` | `false` | Có lấy cả ví đã hết số dư token hay không. |

</details>

<details>
<summary>token holder-positions &lt;token_address&gt;</summary>

One page of exact wallet positions for explicit holder labels.

| Đối số / cờ | Giá trị hợp lệ | Mặc định / bắt buộc | Ý nghĩa |
| --- | --- | --- | --- |
| `<token_address>` | Chuỗi | Bắt buộc | Địa chỉ token Solana. |
| `--labels <value>` | `bundler`, `sniper`, `insider`, `dev`, `smart_trader`, `kol`; ít nhất 1 mục; tối đa 6 mục | Bắt buộc | Nhãn nhóm holder muốn lấy, cách bằng dấu phẩy. |
| `--sort-by <value>` | `amount` | `amount` | Trường xếp hạng kết quả; dùng đúng tên enum của endpoint. |
| `--order-type <value>` | `asc`, `desc` | `desc` | Thứ tự theo amount: asc tăng dần, desc giảm dần. |
| `--ui-amount-mode <value>` | `raw`, `scaled` | `raw` | raw: số lượng theo đơn vị gốc; scaled: số lượng đã điều chỉnh decimals. |
| `--include-zero-balance <value>` | `true`, `false` | `false` | Có lấy cả ví đã hết số dư token hay không. |
| `--limit <value>` | Số nguyên; ≥ 1; ≤ 50 | `10` | Số hàng tối đa của một trang trả về. |
| `--offset <value>` | Số nguyên; ≥ 0; ≤ 10000 | `0` | Số hàng bỏ qua trước trang hiện tại. |

</details>

<details>
<summary>token holder-distribution &lt;token_address&gt;</summary>

Supply distribution by top holders or supply-share range.

| Đối số / cờ | Giá trị hợp lệ | Mặc định / bắt buộc | Ý nghĩa |
| --- | --- | --- | --- |
| `<token_address>` | Chuỗi | Bắt buộc | Địa chỉ token Solana. |
| `--address-type <value>` | `wallet`, `token_account` | `wallet` | Nhóm theo ví hoặc theo token account. |
| `--mode <value>` | `top`, `percent` | `top` | top: nhóm holder đứng đầu; percent: lọc theo khoảng phần trăm supply. |
| `--top-n <value>` | Số nguyên; ≥ 1; ≤ 10000 | Không đặt | Số holder đứng đầu để thống kê trong mode top. |
| `--min-percent <value>` | Số; ≥ 0; ≤ 100 | Không đặt | Tỷ lệ supply tối thiểu trong mode percent. |
| `--max-percent <value>` | Số; ≥ 0; ≤ 100 | Không đặt | Tỷ lệ supply tối đa trong mode percent. |
| `--include-list <value>` | `true`, `false` | `true` | Có trả kèm danh sách holder hay chỉ summary. |
| `--limit <value>` | Số nguyên; ≥ 1; ≤ 50 | `10` | Số hàng tối đa của một trang trả về. |
| `--offset <value>` | Số nguyên; ≥ 0; ≤ 10000 | `0` | Số hàng bỏ qua trước trang hiện tại. |

</details>

<details>
<summary>token first-buyers &lt;token_address&gt;</summary>

One page of the first 1000 buyers; status is relative to first-buy holdings.

| Đối số / cờ | Giá trị hợp lệ | Mặc định / bắt buộc | Ý nghĩa |
| --- | --- | --- | --- |
| `<token_address>` | Chuỗi | Bắt buộc | Địa chỉ token Solana. |
| `--limit <value>` | Số nguyên; ≥ 1; ≤ 100 | `70` | Số hàng tối đa của một trang trả về. |
| `--offset <value>` | Số nguyên; ≥ 0; ≤ 10000 | `0` | Số hàng bỏ qua trước trang hiện tại. |

</details>

<details>
<summary>token tags-tracker &lt;token_address&gt;</summary>

Token cohort timeline; only tag_combinations are disjoint.

| Đối số / cờ | Giá trị hợp lệ | Mặc định / bắt buộc | Ý nghĩa |
| --- | --- | --- | --- |
| `<token_address>` | Chuỗi | Bắt buộc | Địa chỉ token Solana. |
| `--time-from <value>` | Số nguyên; ≥ 1; ≤ 10000000000 | Bắt buộc | Đầu window quan sát, Unix giây. |
| `--time-to <value>` | Số nguyên; ≥ 1; ≤ 10000000000 | Bắt buộc | Cuối window quan sát/phân trang theo thời gian, Unix giây. |
| `--time-frame <value>` | `1s`, `5s`, `15s`, `30s`, `1m`, `3m`, `5m`, `15m`, `30m`, `1h`, `2h`, `4h`, `1D`, `1W`, `1M` | `1h` | Khung thời gian tổng hợp/xếp hạng; dùng đúng enum của endpoint. |
| `--tags <value>` | `dev`, `sniper`, `smart_trader`, `kol`; ít nhất 1 mục; tối đa 4 mục | `dev,sniper,smart_trader,kol` | Các nhãn cohort để theo dõi. |
| `--top-10-holder <value>` | `true`, `false` | `false` | Có thêm nhóm top-10 holders vào tracker. |
| `--include-tag-combinations <value>` | `true`, `false` | `true` | Có trả các nhóm giao nhau của nhãn; dùng để phân biệt cohort chồng lấn. |

</details>

<details>
<summary>token tags-tracker-details &lt;token_address&gt;</summary>

Wallet-level evidence for cohort timeline buckets.

| Đối số / cờ | Giá trị hợp lệ | Mặc định / bắt buộc | Ý nghĩa |
| --- | --- | --- | --- |
| `<token_address>` | Chuỗi | Bắt buộc | Địa chỉ token Solana. |
| `--time-from <value>` | Số nguyên; ≥ 1; ≤ 10000000000 | Bắt buộc | Đầu window quan sát, Unix giây. |
| `--time-to <value>` | Số nguyên; ≥ 1; ≤ 10000000000 | Bắt buộc | Cuối window quan sát/phân trang theo thời gian, Unix giây. |
| `--time-frame <value>` | `1s`, `5s`, `15s`, `30s`, `1m`, `3m`, `5m`, `15m`, `30m`, `1h`, `2h`, `4h`, `1D`, `1W`, `1M` | `1h` | Khung thời gian tổng hợp/xếp hạng; dùng đúng enum của endpoint. |
| `--tags <value>` | `dev`, `sniper`, `smart_trader`, `kol`; ít nhất 1 mục; tối đa 4 mục | `dev,sniper,smart_trader,kol` | Các nhãn cohort để theo dõi. |
| `--top-10-holder <value>` | `true`, `false` | `false` | Có thêm nhóm top-10 holders vào tracker. |
| `--wallets <value>` | Danh sách; ít nhất 1 mục; tối đa 50 mục | Không đặt | Danh sách địa chỉ ví để lọc, cách bằng dấu phẩy. |
| `--min-volume-usd <value>` | Số; ≥ 0 | `0` | Ngưỡng volume USD tối thiểu. |
| `--limit-wallet <value>` | Số nguyên; ≥ 1; ≤ 50 | `10` | Số ví tối đa trong kết quả tracker details. |
| `--limit-bucket <value>` | Số nguyên; ≥ 1; ≤ 300 | `100` | Số bucket thời gian tối đa trong tracker details. |

</details>

<details>
<summary>token money-flow &lt;token_address&gt;</summary>

Buy/sell flow for smart_money, kol, whales or specified wallets; all means supported tags.

| Đối số / cờ | Giá trị hợp lệ | Mặc định / bắt buộc | Ý nghĩa |
| --- | --- | --- | --- |
| `<token_address>` | Chuỗi | Bắt buộc | Địa chỉ token Solana. |
| `--wallet-tags <value>` | `all`, `smart_money`, `kol`, `whales`; ít nhất 1 mục; tối đa 4 mục | `smart_money` | Nhãn ví cần lọc; tên nhãn khác nhau theo endpoint. |
| `--frames <value>` | `1m`, `5m`, `30m`, `1h`, `2h`, `4h`, `8h`, `24h`; ít nhất 1 mục; tối đa 8 mục | `24h` | Các cửa sổ tổng hợp hoạt động/dòng tiền, cách bằng dấu phẩy. |
| `--wallets <value>` | Danh sách; ít nhất 1 mục; tối đa 50 mục | Không đặt | Danh sách địa chỉ ví để lọc, cách bằng dấu phẩy. |

</details>

<details>
<summary>market smart-money</summary>

Tokens ranked by smart-money activity; not a wallet leaderboard.

| Đối số / cờ | Giá trị hợp lệ | Mặc định / bắt buộc | Ý nghĩa |
| --- | --- | --- | --- |
| `--interval <value>` | `1d`, `7d`, `30d` | `1d` | Cửa sổ tổng hợp dữ liệu của endpoint. |
| `--trader-style <value>` | `all`, `risk_averse`, `risk_balancers`, `trenchers` | `all` | Phong cách smart-money theo phân loại của provider. |
| `--sort-by <value>` | `net_flow`, `smart_traders_no`, `market_cap` | `smart_traders_no` | Trường xếp hạng kết quả; dùng đúng tên enum của endpoint. |
| `--sort-type <value>` | `asc`, `desc` | `desc` | asc: tăng dần; desc: giảm dần. |
| `--limit <value>` | Số nguyên; ≥ 1; ≤ 20 | `20` | Số hàng tối đa của một trang trả về. |
| `--offset <value>` | Số nguyên; ≥ 0; ≤ 10000 | `0` | Số hàng bỏ qua trước trang hiện tại. |

</details>

<details>
<summary>market new-listings</summary>

New listings, not necessarily new mints; paginate explicitly with time_to.

| Đối số / cờ | Giá trị hợp lệ | Mặc định / bắt buộc | Ý nghĩa |
| --- | --- | --- | --- |
| `--time-to <value>` | Số nguyên; ≥ 1; ≤ 10000000000 | Không đặt | Cuối window quan sát/phân trang theo thời gian, Unix giây. |
| `--limit <value>` | Số nguyên; ≥ 1; ≤ 20 | `20` | Số hàng tối đa của một trang trả về. |
| `--meme-platform-enabled <value>` | `true`, `false` | `true` | Có bật dữ liệu meme platform trong trang listing. |

</details>

<details>
<summary>market meme-list</summary>

Launchpad tokens filtered by creation time, graduation and progress.

| Đối số / cờ | Giá trị hợp lệ | Mặc định / bắt buộc | Ý nghĩa |
| --- | --- | --- | --- |
| `--source <value>` | `all`, `pump_dot_fun`, `moonshot`, `raydium_launchlab`, `meteora_dynamic_bonding_curve` | `all` | Nguồn launchpad cần lọc; all là tất cả nguồn được hỗ trợ. |
| `--sort-by <value>` | `progress_percent`, `graduated_time`, `creation_time`, `liquidity`, `market_cap`, `recent_listing_time`, `volume_24h_usd` | `creation_time` | Trường xếp hạng kết quả; dùng đúng tên enum của endpoint. |
| `--sort-type <value>` | `asc`, `desc` | `desc` | asc: tăng dần; desc: giảm dần. |
| `--graduated <value>` | `true`, `false` | Không đặt | true: đã graduation; false: chưa; bỏ cờ để không đặt filter này. |
| `--min-progress-percent <value>` | Số; > 0; ≤ 100 | Không đặt | Ngưỡng progress tối thiểu (%). |
| `--max-progress-percent <value>` | Số; > 0; < 100 | Không đặt | Ngưỡng progress tối đa (%). |
| `--min-creation-time <value>` | Số nguyên; ≥ 1; ≤ 10000000000 | Không đặt | Mốc tạo token sớm nhất, Unix giây. |
| `--max-creation-time <value>` | Số nguyên; ≥ 1; ≤ 10000000000 | Không đặt | Mốc tạo token muộn nhất, Unix giây. |
| `--min-graduated-time <value>` | Số nguyên; ≥ 1; ≤ 10000000000 | Không đặt | Mốc graduation sớm nhất, Unix giây. |
| `--max-graduated-time <value>` | Số nguyên; ≥ 1; ≤ 10000000000 | Không đặt | Mốc graduation muộn nhất, Unix giây. |
| `--min-liquidity <value>` | Số; ≥ 0 | Không đặt | Liquidity tối thiểu, USD. |
| `--min-volume-24h-usd <value>` | Số; ≥ 0 | Không đặt | Volume 24h tối thiểu, USD. |
| `--limit <value>` | Số nguyên; ≥ 1; ≤ 100 | `20` | Số hàng tối đa của một trang trả về. |
| `--offset <value>` | Số nguyên; ≥ 0; ≤ 10000 | `0` | Số hàng bỏ qua trước trang hiện tại. |

</details>

<details>
<summary>token meme-detail &lt;address&gt;</summary>

Launch metadata for one meme token; venue coverage varies.

| Đối số / cờ | Giá trị hợp lệ | Mặc định / bắt buộc | Ý nghĩa |
| --- | --- | --- | --- |
| `<address>` | Chuỗi | Bắt buộc | Địa chỉ token Solana. |

</details>

<details>
<summary>market chain-metrics</summary>

Daily chain aggregates and end-of-bucket stablecoin market cap.

| Đối số / cờ | Giá trị hợp lệ | Mặc định / bắt buộc | Ý nghĩa |
| --- | --- | --- | --- |
| `--time-frame <value>` | `1D` | `1D` | Khung thời gian tổng hợp/xếp hạng; dùng đúng enum của endpoint. |
| `--time <value>` | Số nguyên; ≥ 1; ≤ 10000000000 | Không đặt | Mốc thời gian tham chiếu, Unix giây. |
| `--direction <value>` | `backward`, `forward` | `backward` | Hướng lấy các điểm thời gian từ mốc tham chiếu: lùi hoặc tiến. |
| `--count <value>` | Số nguyên; ≥ 1; ≤ 10 | `2` | Số điểm/bucket lịch sử yêu cầu. |

</details>

<details>
<summary>portfolio pnl-summary &lt;wallet&gt;</summary>

Wallet realized/unrealized PnL with explicit accounting and duration.

| Đối số / cờ | Giá trị hợp lệ | Mặc định / bắt buộc | Ý nghĩa |
| --- | --- | --- | --- |
| `<wallet>` | Chuỗi | Bắt buộc | Địa chỉ ví Solana. |
| `--duration <value>` | `24h`, `7d`, `30d`, `90d`, `all` | `30d` | Cửa sổ PnL; all lấy phạm vi lịch sử provider hỗ trợ. |
| `--position-scope <value>` | `duration_only`, `cumulative` | `duration_only` | duration_only: phạm vi kỳ chọn; cumulative: phạm vi tích lũy theo provider. |
| `--pnl-method <value>` | `wac`, `net_cash` | `wac` | wac: giá vốn bình quân; net_cash: phương pháp dòng tiền ròng. |

</details>

<details>
<summary>portfolio pnl-details &lt;wallet&gt;</summary>

One page of per-token PnL and a summary scoped by request filters.

| Đối số / cờ | Giá trị hợp lệ | Mặc định / bắt buộc | Ý nghĩa |
| --- | --- | --- | --- |
| `<wallet>` | Chuỗi | Bắt buộc | Địa chỉ ví Solana. |
| `--duration <value>` | `24h`, `7d`, `30d`, `90d`, `all` | `30d` | Cửa sổ PnL; all lấy phạm vi lịch sử provider hỗ trợ. |
| `--position-scope <value>` | `duration_only`, `cumulative` | `duration_only` | duration_only: phạm vi kỳ chọn; cumulative: phạm vi tích lũy theo provider. |
| `--pnl-method <value>` | `wac`, `net_cash` | `wac` | wac: giá vốn bình quân; net_cash: phương pháp dòng tiền ròng. |
| `--token-addresses <value>` | Danh sách; ít nhất 1 mục; tối đa 100 mục | Không đặt | Danh sách token cần lọc PnL, cách bằng dấu phẩy. |
| `--sort-by <value>` | `last_trade` | `last_trade` | Trường xếp hạng kết quả; dùng đúng tên enum của endpoint. |
| `--sort-type <value>` | `asc`, `desc` | `desc` | asc: tăng dần; desc: giảm dần. |
| `--limit <value>` | Số nguyên; ≥ 1; ≤ 100 | `20` | Số hàng tối đa của một trang trả về. |
| `--offset <value>` | Số nguyên; ≥ 0; ≤ 10000 | `0` | Số hàng bỏ qua trước trang hiện tại. |

</details>

<details>
<summary>portfolio trades &lt;address&gt;</summary>

One page of wallet trades in a bounded time range; not transfer history.

| Đối số / cờ | Giá trị hợp lệ | Mặc định / bắt buộc | Ý nghĩa |
| --- | --- | --- | --- |
| `<address>` | Chuỗi | Bắt buộc | Địa chỉ ví Solana cần lấy giao dịch. |
| `--after-time <value>` | Số nguyên; ≥ 1; ≤ 10000000000 | Bắt buộc | Mốc đầu của trang giao dịch, Unix giây. |
| `--before-time <value>` | Số nguyên; ≥ 1; ≤ 10000000000 | Bắt buộc | Mốc cuối của trang giao dịch, Unix giây. |
| `--tx-type <value>` | `swap`, `add`, `remove`, `all` | `swap` | swap: giao dịch đổi token; add/remove: thêm/rút thanh khoản; all: mọi loại được endpoint hỗ trợ. |
| `--ui-amount-mode <value>` | `raw`, `scaled` | `raw` | raw: số lượng theo đơn vị gốc; scaled: số lượng đã điều chỉnh decimals. |
| `--limit <value>` | Số nguyên; ≥ 1; ≤ 100 | `100` | Số hàng tối đa của một trang trả về. |
| `--offset <value>` | Số nguyên; ≥ 0; ≤ 10000 | `0` | Số hàng bỏ qua trước trang hiện tại. |

</details>

<details>
<summary>market trader-ranking</summary>

Discover wallets by realized PnL or provider trader score, not wealth.

| Đối số / cờ | Giá trị hợp lệ | Mặc định / bắt buộc | Ý nghĩa |
| --- | --- | --- | --- |
| `--type <value>` | `yesterday`, `today`, `1W`, `30d`, `90d` | `30d` | Cửa sổ ranking hoặc độ phân giải lịch sử theo endpoint. |
| `--sort-by <value>` | `PnL`, `realized_pnl`, `unrealized_pnl`, `trader_score` | `realized_pnl` | Trường xếp hạng kết quả; dùng đúng tên enum của endpoint. |
| `--min-trade <value>` | Số nguyên; ≥ 0; ≤ 9007199254740991 | Không đặt | Số giao dịch tối thiểu của trader. |
| `--min-realized-pnl <value>` | Số; ≥ 1000 | Không đặt | PnL đã thực hiện tối thiểu, USD. |
| `--limit <value>` | Số nguyên; ≥ 1; ≤ 100 | `5` | Số hàng tối đa của một trang trả về. |
| `--offset <value>` | Số nguyên; ≥ 0; ≤ 10000 | `0` | Số hàng bỏ qua trước trang hiện tại. |

</details>

<details>
<summary>token top-traders &lt;address&gt;</summary>

Token traders with optional wallet tags; highest volume does not imply highest skill.

Operation này hỗ trợ `solana`, `bsc`, `base`, `ethereum`, `robinhood`. `all_time`, `hold_volume`, `wallet_tags` và `get_holders_networth=true` chỉ dành cho Solana; không dùng chúng với EVM.

| Đối số / cờ | Giá trị hợp lệ | Mặc định / bắt buộc | Ý nghĩa |
| --- | --- | --- | --- |
| `<address>` | Chuỗi | Bắt buộc | Địa chỉ token Solana hoặc contract EVM `0x` 20 byte theo `--chain`. |
| `--time-frame <value>` | `30m`, `1h`, `2h`, `4h`, `6h`, `8h`, `12h`, `24h`, `2d`, `3d`, `7d`, `14d`, `30d`, `60d`, `90d`, `all_time` | `24h` | Khung thời gian tổng hợp/xếp hạng; dùng đúng enum của endpoint. |
| `--sort-by <value>` | `volume`, `trade`, `total_pnl`, `unrealized_pnl`, `realized_pnl`, `volume_usd`, `hold_volume` | `realized_pnl` | Trường xếp hạng kết quả; dùng đúng tên enum của endpoint. |
| `--sort-type <value>` | `asc`, `desc` | `desc` | asc: tăng dần; desc: giảm dần. |
| `--wallet-tags <value>` | `dev`, `bundler`, `sniper`, `insider`, `smart_trader`; ít nhất 1 mục; tối đa 5 mục | Không đặt | Nhãn ví cần lọc; tên nhãn khác nhau theo endpoint. |
| `--ui-amount-mode <value>` | `raw`, `scaled` | `raw` | raw: số lượng theo đơn vị gốc; scaled: số lượng đã điều chỉnh decimals. |
| `--get-holders-networth <value>` | `true`, `false` | `false` | Có yêu cầu net worth của holders trong kết quả top-traders. |
| `--limit <value>` | Số nguyên; ≥ 1; ≤ 10 | `10` | Số hàng tối đa của một trang trả về. |
| `--offset <value>` | Số nguyên; ≥ 0; ≤ 10000 | `0` | Số hàng bỏ qua trước trang hiện tại. |

</details>

<details>
<summary>market token-list</summary>

Raw operation hỗ trợ `solana`, `bsc`, `base`, `ethereum`, `robinhood`; skill `skill-trending-list` vẫn chỉ hỗ trợ Solana. Các bộ lọc mới theo khoảng thời gian, vốn hóa và giá nằm trong `market token-list --help`; dùng [Price Surge](docs/workflows/price-surge.md) để chạy logic screening tổng hợp.

Token discovery ranked by market data, with optional platform filter.

| Đối số / cờ | Giá trị hợp lệ | Mặc định / bắt buộc | Ý nghĩa |
| --- | --- | --- | --- |
| `--sort-by <value>` | `liquidity`, `market_cap`, `fdv`, `holder`, `volume_1h_usd`, `volume_4h_usd`, `volume_24h_usd`, `trade_1h_count`, `trade_4h_count`, `trade_24h_count` | `volume_24h_usd` | Trường xếp hạng kết quả; dùng đúng tên enum của endpoint. |
| `--sort-type <value>` | `asc`, `desc` | `desc` | asc: tăng dần; desc: giảm dần. |
| `--platform-name <value>` | Chuỗi | Không đặt | Tên platform dùng lọc token list. |
| `--min-liquidity <value>` | Số; ≥ 0 | Không đặt | Liquidity tối thiểu, USD. |
| `--min-volume-1h-usd <value>` | Số; ≥ 0 | Không đặt | Volume 1h tối thiểu, USD. |
| `--min-volume-4h-usd <value>` | Số; ≥ 0 | Không đặt | Volume 4h tối thiểu, USD. |
| `--min-volume-24h-usd <value>` | Số; ≥ 0 | Không đặt | Volume 24h tối thiểu, USD. |
| `--limit <value>` | Số nguyên; ≥ 1; ≤ 100 | `20` | Số hàng tối đa của một trang trả về. |
| `--offset <value>` | Số nguyên; ≥ 0; ≤ 10000 | `0` | Số hàng bỏ qua trước trang hiện tại. |

</details>

<details>
<summary>token liquidity-history &lt;address&gt;</summary>

Historical liquidity snapshots; reserve maximum lookback multiplier for chosen resolution.

| Đối số / cờ | Giá trị hợp lệ | Mặc định / bắt buộc | Ý nghĩa |
| --- | --- | --- | --- |
| `<address>` | Chuỗi | Bắt buộc | Địa chỉ token Solana. |
| `--resolution <value>` | `1m`, `4h`, `1D` | `4h` | Độ phân giải snapshot liquidity, không phải giá/nến. |
| `--time <value>` | Số nguyên; ≥ 1; ≤ 10000000000 | Bắt buộc | Mốc thời gian tham chiếu, Unix giây. |
| `--direction <value>` | `back`, `forward` | `back` | Hướng lấy các điểm thời gian từ mốc tham chiếu: lùi hoặc tiến. |
| `--count <value>` | Số nguyên; ≥ 1; ≤ 100 | `6` | Số điểm/bucket lịch sử yêu cầu. |

</details>

<details>
<summary>portfolio first-funded &lt;wallet&gt;</summary>

First funding transaction for one wallet (not proof of wallet creation time).

| Đối số / cờ | Giá trị hợp lệ | Mặc định / bắt buộc | Ý nghĩa |
| --- | --- | --- | --- |
| `<wallet>` | Chuỗi | Bắt buộc | Địa chỉ ví Solana. |

</details>

<details>
<summary>portfolio net-worth-history &lt;wallet&gt;</summary>

Wallet net-worth snapshots; deposits and withdrawals affect this series.

| Đối số / cờ | Giá trị hợp lệ | Mặc định / bắt buộc | Ý nghĩa |
| --- | --- | --- | --- |
| `<wallet>` | Chuỗi | Bắt buộc | Địa chỉ ví Solana. |
| `--time <value>` | Chuỗi | Bắt buộc | Mốc thời gian tham chiếu, Unix giây. |
| `--type <value>` | `1h`, `1d` | `1d` | Cửa sổ ranking hoặc độ phân giải lịch sử theo endpoint. |
| `--count <value>` | Số nguyên; ≥ 1; ≤ 90 | `30` | Số điểm/bucket lịch sử yêu cầu. |
| `--direction <value>` | `back`, `forward` | `back` | Hướng lấy các điểm thời gian từ mốc tham chiếu: lùi hoặc tiến. |
| `--sort-type <value>` | `asc`, `desc` | `desc` | asc: tăng dần; desc: giảm dần. |

</details>

<details>
<summary>portfolio transactions &lt;wallet&gt;</summary>

One page of wallet transactions, including non-trade activity.

| Đối số / cờ | Giá trị hợp lệ | Mặc định / bắt buộc | Ý nghĩa |
| --- | --- | --- | --- |
| `<wallet>` | Chuỗi | Bắt buộc | Địa chỉ ví Solana. |
| `--limit <value>` | Số nguyên; ≥ 1; ≤ 100 | `100` | Số hàng tối đa của một trang trả về. |
| `--before <value>` | Chuỗi | Không đặt | Cursor giao dịch của trang trước để lấy trang cũ hơn; không phải Unix timestamp. |
| `--ui-amount-mode <value>` | `raw`, `scaled` | `raw` | raw: số lượng theo đơn vị gốc; scaled: số lượng đã điều chỉnh decimals. |

</details>

<!-- DATA-ARGS-END -->

Một số ràng buộc kết hợp không thể hiện hết trong bảng:

- Các wrapper có `limit`/`offset` yêu cầu tổng ≤ 10.000; first-buyers giới hạn tổng ≤ 1.000.
- Holder distribution `mode=percent` cần cả min/max-percent đúng thứ tự và không nhận top-n; `mode=top` không nhận min/max-percent.
- Tracker cần time-from < time-to; độ dài window tối đa 30 ngày với frame giây, 60 ngày với phút, 90 ngày với giờ, 365 ngày với frame còn lại.
- Money flow dùng `wallet-tags=all` riêng, không kết hợp với tag khác. PnL/trader/cohort của provider có thể khác nhau về phạm vi dữ liệu.
- Meme list yêu cầu min ≤ max cho từng cặp filter; trades cần after-time < before-time. `--estimate-cu` kiểm tra schema trước khi chạy thật.

### Mã thoát cho script

| Exit code | Ý nghĩa |
| --- | --- |
| `0` | Lệnh hoàn tất, gồm help/version hoặc estimate hợp lệ. |
| `1` | Lỗi khác: mạng, provider, storage hoặc lỗi ứng dụng không thuộc nhóm dưới. Xem JSON lỗi trên stderr. |
| `2` | Tham số không hợp lệ (`INVALID_INPUT`). |
| `3` | Lỗi xác thực có mã bắt đầu bằng `AUTH`. |
| `4` | Không đủ budget CU (`CU_BUDGET_EXCEEDED`). |
| `5` | Workflow có kết quả một phần; dữ liệu đã lấy và thông tin thiếu vẫn được trả/lưu. |

JSON kết quả ở stdout, lỗi ở stderr. `--short` không bỏ chi phí hay cảnh báo quan trọng. Khi tự động hóa, đọc cả `error.code`/coverage và exit code; không tự retry lệnh có phí chỉ vì kết quả partial.

## Live demo cho khách hàng

Tab **Demos** có 5 giao diện sản phẩm riêng, lấy dữ liệu từ workflow và mở lại snapshot từ History SQLite:

| Demo | UI và thao tác |
| --- | --- |
| Research terminal | Watchlist giá/24h change/volume/liquidity; tìm kiếm, sắp xếp, chọn token để xem controls và so sánh thanh khoản. |
| DEX token inspector | Thông số token, bảng pool, thanh so sánh liquidity; chọn pool để xem chi tiết và nguồn. |
| Wallet intelligence | Discover smart wallets từ smart-money tokens → top traders → shortlist khử trùng lặp. Chọn ví, preview CU riêng rồi xem 7d/30d PnL, allocation và holdings. |
| Security signals | Ba rule theo ngưỡng, 38 metrics/quan sát bổ sung về market, sở hữu, quyền kiểm soát và authority; bảng holder ví với lượng token và % tổng cung. |
| Telegram research brief | Khung hội thoại với token, market metrics, controls và coverage; xem/export plain text cho bot adapter. |

Chọn **Preview APIs & CU → Run live snapshot** để lấy dữ liệu bằng Birdeye key. API steps và JSON evidence nằm trong mục mở rộng; **Source evidence** truy vết timestamp/request của từng nhóm dữ liệu. Đổi kỳ, lọc/sort, chọn token/pool và mở lại History không gọi API. Dữ liệu thiếu hiển thị Unavailable/Unknown; UI không cài sẵn giá giả, không tự refresh, đặt lệnh hay gửi Telegram.

```bash
npm run build
node dist/index.js demos --short
node dist/index.js demo terminal --limit 2 --estimate-cu --short
node dist/index.js --format interface --bind 127.0.0.1:8787
# Mở Demos → chọn use case → Preview APIs & CU → Run live snapshot
```

Xem [cách chạy, contract JSON và tích hợp vào ứng dụng/bot](docs/workflows/customer-demos.md). CU vẫn là estimate theo catalog; nghiên cứu ghi nhận giá Security và Wallet PnL live khác snapshot, chưa xác nhận billing bằng key thật.

Wallet intelligence bắt đầu ở **Discover smart wallets**, không cần nhập ví. `Maximum tokens / wallets` giới hạn số token lookup và số ví trong shortlist. Chọn **Select wallet → Preview APIs & CU → Run live snapshot** để phân tích. Discovery mặc định tối đa 110 CU/4 requests theo catalog (20 + 3 × 30); phân tích một ví 90 CU/4 requests, budget áp dụng riêng từng run. Chọn ví và preview không tiêu CU. History phân biệt `Wallet intelligence · discover` và run có địa chỉ ví rút gọn; mở lại discovery để chọn ví khác mà không fetch lại shortlist.

```bash
# Khám phá trước, không cần wallet address; --limit 2: tối đa 80 CU
node dist/index.js demo wallet-intelligence --limit 2 --estimate-cu --short
node dist/index.js demo wallet-intelligence --limit 2 --max-cu 100 > wallet-discovery.json
# Chọn address trong data.demo.sections (Discovered wallets), rồi phân tích riêng
node dist/index.js demo wallet-intelligence --address WALLET_ADDRESS --estimate-cu
node dist/index.js demo wallet-intelligence --address WALLET_ADDRESS --max-cu 120 > wallet-analysis.json
```

Để trống ví (`address` bị bỏ qua, `""` hoặc chỉ có khoảng trắng) đều chạy discovery. Địa chỉ không rỗng nhưng sai định dạng vẫn bị từ chối. Trên UI, chọn **Preview APIs & CU** trước; **Run live snapshot** chỉ bật khi preview hợp lệ và không đặt CU limit hoặc limit đủ cho estimate. Không cần điền ví để mở khóa discovery.

```bash
# Regression cho input ví rỗng; estimate miễn CU, không cần key
node dist/index.js demo wallet-intelligence --address "" --estimate-cu --short
# Regression HTTP thật trong process, dùng fixture và không tiêu CU
npm test
node --test --test-name-pattern="HTTP wallet discovery previews and runs" .test-dist/tests/demos.test.js
```

Nếu UI vẫn yêu cầu ví ở discovery, dừng process interface cũ, chạy `npm run build`, khởi động lại bằng `node dist/index.js --format interface --bind 127.0.0.1:8787`, rồi reload browser. Build không thay thế module đã được process Node cũ load vào bộ nhớ.

Shortlist gồm trader của smart-money-list tokens, không tự chứng minh mọi ví là smart money hay có lợi nhuận. Token-level PnL được giữ theo từng quan sát, không cộng thành wallet-wide PnL.

Kiểm tra UI demo (fixture, không dùng key và không tiêu CU):

```bash
npm run typecheck
npm test
npm run build
# Render/data regression cho 5 UI
node --test tests/demo-ui.test.mjs
# Tương tác và screenshot desktop/mobile, cần Chrome; không cần mở cổng HTTP
npm run test:demos:browser
# Linux hoặc Chrome nằm ở đường dẫn khác
CHROME_PATH=/usr/bin/google-chrome npm run test:demos:browser
# Toàn bộ app: CU preview/run và History, cần Chrome + quyền listen loopback
npm run test:browser
```

Sau khi build, dừng process interface cũ và chạy lại lệnh trên, rồi reload browser. Regression Wallet discovery, typecheck và build đã qua. Chrome vẫn bị chặn trong sandbox nên chưa xác nhận screenshot/browser interaction. Test riêng lưu capture ở `.impeccable/review/demo-*-desktop.png` và `demo-*-mobile.png` khi chạy được Chrome; fixture chỉ được import bởi tests.

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
- Mặc định không giới hạn CU. Khi đặt `--max-cu`, chặn dispatch khi không còn đủ budget theo catalog. `--workflow` áp dụng thêm budget tích lũy của workflow.
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

AI gọi các operation trong catalog và có thể khám phá/gọi tool từ MCP Birdeye khi bật live data. Các metrics của catalog được tính ở host; source data và phần thiếu dữ liệu được lưu trong run. Mỗi lượt chat giới hạn 8 bước AI và 20 data request attempts, dùng chung cho REST và MCP. Workflow trực tiếp giới hạn attempts theo số bước tối đa và một lần retry mỗi REST request; MCP không tự retry tool call. Budget CU mỗi lượt và session áp dụng cho API đã biết giá; **CU của MCP chưa xác định và không nằm trong tổng CU ước tính**. AI token usage được báo riêng, không đổi trực tiếp thành USD. Nếu provider không báo usage thì ghi unknown.

Chín workflow và hai case cũ chạy được mà không có AI key. `cases --short` liệt kê tên và loại địa chỉ cần nhập. Chat cần AI key. Reload/reconnect chỉ đọc lại run; Refresh hay gửi câu hỏi mới có thể phát sinh phí mới. Hội thoại, input, dataset đầy đủ và kết quả được lưu vào SQLite. Chat research mới mặc định bật Allow new Birdeye requests để AI gọi tool và chạy workflow; bỏ chọn để chỉ dùng docs và dữ liệu đã lưu. Hội thoại tiếp tục giữ lựa chọn live/saved-only đã lưu. Mỗi câu hỏi mới có thể phát sinh AI tokens.

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

Xem [workflow migration audit](docs/workflows/migration-audit.md) để biết phạm vi và giới hạn của các workflow. `workflow create` là nhóm ngân sách tích lũy; `case <kind>` thực thi recipe. Bản 0.4.0 có 36 data operations, 20 skill hiện tại và 12 case tương thích, dùng chung registry cho CLI/AI/interface.

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
| `risk-warning` | 70; full 185 |
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

Kỳ vọng: estimate cho price là **3 CU**, token research là **78 CU** theo catalog hiện tại. Estimate không gửi request và không tăng usage; `usage show` đọc ledger local.

### 3. Birdeye live và budget — cần Birdeye key

Nhập key ẩn bằng `config init`, hoặc cấu hình sẵn biến môi trường `BIRDEYE_API_KEY`. Các lệnh live dưới đây phát sinh CU thật; số CU nêu là ước tính mỗi lần gọi thành công, chưa tính retry.

```bash
node dist/index.js config init
node dist/index.js doctor --live --short
node dist/index.js token price So11111111111111111111111111111111111111112 --max-cu 3 --short
node dist/index.js case token-research --address So11111111111111111111111111111111111111112 --max-cu 100 --short
node dist/index.js usage show --short
```

Kỳ vọng: `doctor --live` dùng 1 CU, price dùng 3 CU, research dùng 78 CU khi đủ dữ liệu và không retry. Kết quả kèm CU; ledger tăng tương ứng các request attempts.

Sau khi đã cấu hình key, thử chặn request vượt budget:

```bash
node dist/index.js token price So11111111111111111111111111111111111111112 --max-cu 2 --short
```

Kỳ vọng: lỗi `CU_BUDGET_EXCEEDED`, exit code `4`; không gửi request Birdeye và không tiêu thêm CU.

### Workflows theo Birdeye Data Skills

CLI và UI có 20 skill hiện tại, chia **Discover / Token / Wallet**. Các case cũ nằm trong **Earlier workflows**. Xem [chain hỗ trợ và giới hạn](docs/workflows/skill-support.md).

Tám skill dữ liệu bổ sung có mục đích riêng:

| Skill | Mục đích và trường hợp sử dụng | API chính |
| --- | --- | --- |
| `skill-launchpad-trending` | Tìm token mới tạo, gần tốt nghiệp hoặc đã tốt nghiệp; ví dụ lọc Pump.fun đạt tiến độ từ 80%. | Meme List, Meme Detail; New Listing cho sự kiện niêm yết. |
| `skill-token-security` | Kiểm tra quyền mint/freeze, khả năng chuyển token và các quan sát bảo mật trước khi nghiên cứu sâu. | Token Security. |
| `skill-token-stats` | Xem giá, vốn hóa, thanh khoản, holder; so sánh hoạt động 1h với 24h. | Token Overview + Trade Data. |
| `skill-top-holder-analysis` | Xác định ví nắm giữ lớn và mức tập trung nguồn cung; bổ sung nhóm holder khi cần. | Holder Distribution theo wallet; Holder Profile. |
| `skill-top-trader-analysis` | Tìm ví giao dịch nhiều hoặc có lợi nhuận cao trên một token trong kỳ chọn. | Top Traders; PnL chỉ thuộc token đang xét. |
| `skill-lp-analysis` | Xác định pool cung cấp thanh khoản chính và xem biến động thanh khoản cấp token. | Markets + Pair Overview; Liquidity History. |
| `skill-smart-money-holders` | Tìm ví được Birdeye gắn nhãn smart trader còn giữ token; xem thêm mua/bán trong khoảng thời gian khi cần. | Holder Profile + Holder Positions (`smart_trader`); Wallet Tags Tracker. |
| `skill-kol-signal` | So sánh lượng mua/bán quan sát được của nhóm KOL, tìm ví mẫu đóng góp vào hoạt động đó. | Wallet Tags Tracker (`kol`) + Details. |

Xem [cách chạy, tham số, API và cách diễn giải dữ liệu](docs/workflows/token-data-skills.md). Mỗi package trong `skills/` có `SKILL.md` và reference đi kèm. Tám skill này hỗ trợ Solana; KOL chạy theo từng yêu cầu, LP phân tích pool của token. Dữ liệu thiếu giữ trạng thái chưa xác định, không được coi là an toàn hoặc bằng 0.

### Token Due-Diligence Score Advanced · Node.js

Skill mới có entrypoint **Node.js**, dùng chung công thức với CLI/UI. Sau `npm run build`, có thể chạy file `.mjs`; khi cài package bằng npm sẽ có thêm lệnh `token-dd-score`. Chi tiết công thức và các giả định tái dựng nằm trong [doc.md](skills/token-duediligence/doc.md).

```bash
npm ci
npm run build

# Xem help và plan offline: không cần API key, không tốn CU
node skills/token-duediligence/token-dd-score.mjs --help
node skills/token-duediligence/token-dd-score.mjs So11111111111111111111111111111111111111112 --mode advanced --estimate-cu --format json

# Chạy thật: dùng Birdeye key đã lưu trong Settings hoặc BIRDEYE_API_KEY
node skills/token-duediligence/token-dd-score.mjs So11111111111111111111111111111111111111112 --mode advanced --format plain --explain

# Cùng workflow qua CLI
node dist/index.js case skill-token-dd-score --address So11111111111111111111111111111111111111112 --dd-mode advanced --format json

# UI: Token Due Diligence → Token Due-Diligence Score · Advanced
node dist/index.js case skill-token-dd-score --address So11111111111111111111111111111111111111112 --format interface --bind 127.0.0.1:8787
```

| Arg | Ý nghĩa |
|---|---|
| `--mode standard/advanced` | Entrypoint Node; mặc định advanced. Trong `birdeye-cli case` dùng `--dd-mode` |
| `--top-n 10..50` | Số hàng holder lấy trong một trang; mặc định 50 |
| `--liq-resolution` | `1m/5m/15m/30m/1h/4h/1D`; mặc định 15m |
| `--liq-candles 1..100` | Số nến liquidity; mặc định 96, tương ứng cửa sổ yêu cầu 24h ở 15m |
| `--rescore <source>` | ID History, full JSON path, hoặc `base64:<JSON đã encode>`; tính lại local, 0 API calls / 0 CU |
| `--weights-preset default` | Entrypoint Node chỉ hỗ trợ default; tài liệu chưa định nghĩa các preset còn lại |
| `--explain` | Entrypoint Node thêm quy tắc từng tín hiệu vào plain output |
| `--format` | Entrypoint Node: `plain`, `telegram`, `ui`, `json`, `raw-json`, `interface`. JSON/UI có CU trong metadata; plain/Telegram có footer CU |
| `--short` | Tóm tắt tiết kiệm token; raw data vẫn lưu SQLite. Dùng ID hoặc full JSON để re-score |
| `--estimate-cu` | Chỉ lập kế hoạch, không gọi API |
| `--max-cu` | Budget CU ước tính tùy chọn; mặc định không trần |
| `--config-dir` | Chọn thư mục cấu hình và SQLite đang chứa lượt chạy |
| `--chain` | Price Surge: `solana`, `bsc`, `base`, `ethereum`, `robinhood`; các skill khác: `solana` |
| `--bind`, `--public-url` | Địa chỉ bind và origin công khai cho `--format interface` |

Standard dùng overview + security: **2 calls / 51 CU**. Advanced thêm distribution, holder profile, top holders, tagged money flow và liquidity OHLC: **7 calls / tạm tính 181 CU** trước retry. Giá OHLC 30 CU lấy từ đặc tả; docs provider còn mô tả giá theo resolution nên đây **không phải upper bound đã xác minh**. `cu_billed_total` để null, còn CU ước tính/reserved lấy từ ledger.

UI hiển thị điểm, rating, 5 trụ cột, coverage, từng rule/input, liquidity stats, holder concentration và các giả định. Dữ liệu thiếu giữ N/A; standard và advanced không có cùng coverage. LST/canonical-mint chưa có danh sách chuẩn nên giữ N/A; `--pace` và preset khác default chưa hỗ trợ. Không có dữ liệu live giả lập để làm đầy kết quả.

Lấy run ID từ `meta.runId` hoặc History, rồi tái sử dụng:

```bash
node skills/token-duediligence/token-dd-score.mjs --rescore <run-id> --mode standard --format plain
node skills/token-duediligence/token-dd-score.mjs --rescore ./full-export.json --liq-candles 32 --explain
node dist/index.js case skill-token-dd-score --rescore <run-id> --dd-mode standard --short
```

Nút **Re-score saved evidence · 0 CU** trên UI cho đổi mode, topN và số nến. Mỗi lần tạo một History mới, giữ nguyên raw sources và thời gian quan sát; không cần API key. Tăng giới hạn không thể bổ sung dữ liệu chưa fetch. Đổi resolution/địa chỉ/API params cần lượt gọi mới. Xóa History sẽ xóa dữ liệu dùng để replay.

Các lệnh kiểm thử (fixture, không gọi Birdeye thật):

```bash
npm run typecheck
npm run build
npx tsc -p tsconfig.test.json
node --test .test-dist/tests/token-dd-score.test.js .test-dist/tests/token-dd-interface.test.js tests/token-dd-ui.test.mjs
npm test
```

```bash
# Preflight miễn phí
node dist/index.js case skill-trending-list --estimate-cu --short
node dist/index.js case skill-smart-wallets --skill-depth deep --limit 3 --estimate-cu --short
node dist/index.js case skill-wallet-analysis --address So11111111111111111111111111111111111111112 --intervals 7d,30d --estimate-cu --short
node dist/index.js case skill-smart-money-leaderboard --wallets So11111111111111111111111111111111111111112,11111111111111111111111111111112 --estimate-cu --short
```

Trong UI: chọn nhóm → skill → nhập subject và options → xem/chỉnh **Workflow overview** → kiểm tra CU → **Run research**. Wallet leaderboard nhận 1–10 ví; Kline/Wallet Score/Style và leaderboard có **Skill findings** cùng formula/evidence. Score thiếu dữ liệu sẽ là unavailable; Token DD/Contract Due-Diligence Score không gắn nhãn an toàn từ dữ liệu thiếu. Liquidity history dùng dữ liệu liquidity thật và giữ upper-bound CU theo resolution.

### 4. Interface — bind địa chỉ local

```bash
node dist/index.js --format interface --bind 127.0.0.1:8787 --short --max-cu 100 --session-max-cu 300
```

Mở `http://127.0.0.1:8787`; browser tự kết nối local. Vào Settings để cấu hình key. Chỉ mở interface chưa gọi API.

Bind loopback chấp nhận Host `localhost`, `127.0.0.1` và `[::1]` trên cùng port; kết nối vẫn phải đến được địa chỉ đang listen. Nếu cấu hình `--public-url`, chỉ Host của URL đó được chấp nhận và Origin của browser phải khớp origin public, kể cả khi proxy chuyển HTTPS xuống HTTP loopback. Khi không có public URL, Origin phải khớp Host và protocol của listener.

Trong terminal khác, kiểm tra không tốn CU:

```bash
curl -i http://localhost:8787/          # 200, HTML giao diện
curl -i http://127.0.0.1:8787/         # 200, HTML giao diện
curl -i http://localhost:8787/api/status # 401 khi chưa đăng nhập
curl -i -H 'Host: evil.test:8787' http://127.0.0.1:8787/ # 403
```

Nếu bản cũ trả `ORIGIN_DENIED` khi dùng `localhost`, dùng URL `127.0.0.1` hoặc build lại (`npm run build`) rồi dừng và khởi động lại interface.

1. Chọn case study, đọc **Purpose** và **What you get**. Mở **Workflow overview → Review API steps** để xem các bước kể cả khi chưa nhập địa chỉ: mục đích, thông tin lấy về, method/path API, nguồn subject và CU mỗi request. Xem hoặc chỉnh overview không gọi Birdeye.
2. Chọn **Earlier workflows → Token Research**, nhập `So11111111111111111111111111111111111111112`. Mở **Review API steps → Adjust parameters** ở bước **Top holders**, đổi **Rows per request** thành `3` và **Holder grouping** thành `token_account`. Overview kiểm tra lại tham số và hiển thị `78 CU before retries · at most 3 requests`.
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

Nếu giữ tab Settings mở khi restart server local, Save connections tự kết nối lại rồi gửi lại form khi nhận `CONNECT_REQUIRED`; các giá trị đang nhập được giữ nguyên. Chỉ lỗi phiên kết nối này được retry, không tự gửi lại khi lỗi mạng, validation hoặc ghi SQLite. `--require-code` vẫn yêu cầu kết nối bằng code.

```bash
# Regression: mở Settings → restart server → Save → đọc lại SQLite
./node_modules/.bin/tsc -p tsconfig.test.json
node --test .test-dist/tests/settings-client.test.js
```

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
# Tối đa 50 CU; budget không cho retry vượt mức này
node dist/index.js case skill-smart-wallets --skill-depth fast --scan-limit 20 --limit 1 --max-cu 50 --short
```

Kết quả có token list và trader dataset nếu upstream có dữ liệu, wallet shortlist dedup theo provider order. Empty/denied/missing checks vẫn được báo rõ. CU reserved được hiển thị cả khi billing chưa xác định; `0 estimated` không có nghĩa request lỗi miễn phí.

Chi tiết đối chiếu và lỗi đã sửa: [migration audit](docs/workflows/migration-audit.md).

Trong interface, thử hỏi: “Tổng hợp giá, thanh khoản, volume 24h và rủi ro của token So11111111111111111111111111111111111111112, kèm nguồn dữ liệu.” Kiểm tra câu trả lời, metrics, CU Birdeye và AI token usage. Chat có thể phát sinh cả CU lẫn AI tokens; kiểm tra `doctor --ai` thành công chưa bảo đảm provider hỗ trợ tool calling.

Trong sandbox triển khai ban đầu, TCP listen và Chrome launch bị chặn. Typecheck, build và tests trong tiến trình đã được kiểm tra; browser rendering, SSH thực tế và API live cần chạy trong môi trường có quyền mở cổng và credentials. Không dùng key thật trong test suite.

## Skills và phát triển

Ba skill có trong `skills/birdeye-token`, `skills/birdeye-market`, `skills/birdeye-portfolio`. Cài thư mục skill vào nơi agent của bạn đọc skills, và bảo đảm executable `birdeye-cli` nằm trên PATH. Skills dùng CU do CLI trả về, không nhân bản bảng giá.

Price Surge đã hỗ trợ năm chain nêu trong [ma trận hỗ trợ](docs/workflows/skill-support.md); các skill khác vẫn chỉ Solana. Phạm vi tiếp theo: mở rộng multi-chain cho các skill khác, multi-price batching, pagination tự động, scheduler/WebSocket, provider capability probing/fallback, biểu đồ và kiểm thử live. Workflow hiện chạy một lần; không tự giao dịch, không backtest copy-trade ROI.

### CU limit tùy chọn và command preview

CLI/interface mặc định không đặt trần CU. Trong Research, Demos và Imports, để trống **CU limit** (`Unlimited`) để chạy không giới hạn CU; có thể đặt số nguyên không âm nếu muốn tự giới hạn. Bỏ trần nhập 100.000 CU. Giá trị `0` vẫn chặn request có phí và request chưa biết chi phí; chat **saved-only** vẫn dùng 0 CU cho dữ liệu mới. Ledger SQLite vẫn ghi CU/reservation/attempts, kể cả khi không đặt limit. Giới hạn số request và phạm vi workflow vẫn áp dụng.

`--max-cu` đặt budget mặc định cho từng lượt; UI có thể xóa ô để chạy unlimited. `--session-max-cu` nếu được đặt vẫn giới hạn tổng CU của phiên. Các nhóm workflow đã lưu trước đây giữ budget đã được đặt. Trong HTTP API, bỏ `maxCu` để dùng mặc định server; `maxCu: null` yêu cầu không đặt budget riêng cho lượt chạy.

**CLI command** ở Workflows, Demos và Imports mặc định mở rộng, vẫn có thể bấm để thu gọn. Khi unlimited, lệnh copy không có `--max-cu`; nếu nhập limit thì lệnh giữ đúng số đó.

```bash
# Không giới hạn CU mặc định
node dist/index.js --format interface --bind 127.0.0.1:8787
# Preview miễn phí, cho phép đặt limit lớn hơn 100.000 khi cần
node dist/index.js case market-shortlist --max-cu 200000 --estimate-cu --short
# Regression: accounting unlimited, giới hạn chủ động, HTTP và command serialization
npx tsc -p tsconfig.test.json
node --test .test-dist/tests/core.test.js .test-dist/tests/interface.test.js .test-dist/tests/cli-preview.test.js
```

Test UI: mở Research/Demos/Imports, kiểm tra ô CU limit trống và CLI command đã mở. Lệnh preview phải không có `--max-cu`; nhập `200000` để thấy cờ này xuất hiện, xóa giá trị để trở lại unlimited. Preview/copy không gọi Birdeye API; Run có gọi API và vẫn ghi CU.

### 8. Copy địa chỉ và mở Birdeye trong interface (0.4.0)

UI nhận diện chuỗi giải mã thành địa chỉ 32 byte: base58, base64 chuẩn và base64url (có hoặc không có padding). Địa chỉ có gạch chân chấm; click hoặc focus bằng Tab rồi Enter/Space để copy nguyên chuỗi. Ô trong bảng có thể rút gọn nhưng clipboard luôn nhận đầy đủ địa chỉ, giữ nguyên encoding. Có thông báo Copied; nếu browser từ chối clipboard, UI hiện đầy đủ địa chỉ để chọn/copy thủ công và giữ thông báo đến khi đóng hoặc copy lại.

Copy áp dụng trong metrics, wallet shortlist/leaderboard, AI findings, workflow subject, JSON/Plain và source/evidence. Nhận diện encoding không xác minh tài khoản tồn tại. API requests vẫn dùng địa chỉ Solana base58 như trước. Export JSON/CSV giữ dữ liệu gốc.

Địa chỉ xác định được là token hoặc wallet có thêm icon mở Birdeye bên cạnh:

- Token: `https://birdeye.so/{chain}/token/{token_address}`.
- Wallet: `https://birdeye.so/{chain}/wallet-analyzer/{wallet_address}`.

Click địa chỉ chỉ copy; click icon mở tab mới trong browser đang dùng (Chrome nếu mở UI bằng Chrome). Tooltip và tên truy cập ghi rõ token/wallet và tab mới; Tab rồi Enter cũng mở được link. Chain lấy từ dữ liệu kết quả; dữ liệu Solana cũ không ghi chain dùng `solana`. Token trong holdings mở trang token; ví trong smart traders/shortlist mở Wallet Analyzer. Pool, địa chỉ chưa biết loại và chuỗi trong JSON/AI tự do giữ copy, không đoán thành token hay ví.

Khi địa chỉ Solana được biểu diễn bằng base64, chỉ URL được chuyển sang base58 để mở đúng trang; clipboard và exports vẫn giữ nguyên encoding nguồn. Mở link không gọi API qua CLI và không ghi thêm CU vào ledger.

```bash
npm run typecheck
npm test
npm run build
node dist/index.js --format interface --bind 127.0.0.1:8787
# Test browser với dữ liệu/clipboard giả, không gọi API thật
npm run test:browser
# Test riêng copy + icon Birdeye, dùng fixture và chặn mọi request mạng
# Cần Chrome; có thể đặt CHROME_PATH=/path/to/chrome
node tests/address-ui-browser.mjs
```

Test thủ công: mở một kết quả, click địa chỉ trong metrics hoặc wallet shortlist rồi paste vào editor; phải nhận chuỗi đầy đủ. Click icon bên cạnh token và wallet: mỗi loại mở đúng đường dẫn ở tab mới và không đổi clipboard. Trong Wallet Intelligence, token holdings phải mở `/token/`, ví đang phân tích mở `/wallet-analyzer/`. Chuyển JSON/Plain, thử địa chỉ base58 và base64; kiểm tra phản hồi Copied. Dùng Tab rồi Enter/Space để thử copy; Enter trên icon mở trang. Test browser kiểm tra ghi đúng clipboard và thông báo khi quyền clipboard bị từ chối.

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

Trong **History**, chọn **Delete** cạnh một lượt hoặc **Clear history** để xóa toàn bộ, kể cả các trang chưa tải. UI yêu cầu xác nhận; không thể hoàn tác. Kết quả/chat được xóa khỏi SQLite và phiên hiện tại, còn API keys/config và CU ledger được giữ. Các lượt chat khác có thể đã lưu bản sao của dữ liệu nguồn; xóa một lượt không xóa các bản sao đó. Đợi lượt đang chạy kết thúc trước khi xóa. Checkpoint ghi muộn không thể tạo lại run đã xóa.

```bash
# Test xóa/restart, giữ CU, clear mọi trang, rollback lỗi ghi và chặn active run
./node_modules/.bin/tsc -p tsconfig.test.json
node --test .test-dist/tests/history-delete.test.js
```

Test restart: chạy một workflow, ghi lại run ID/CU, Ctrl+C, khởi động lại với cùng `--config-dir`, mở History và export. Input, dữ liệu và timestamp phải giữ nguyên; CU không tăng. `npm test` có test restart SQLite/HTTP thật, đọc từ CLI mới, pagination, checkpoint, lỗi ghi và lưu đầy đủ khi `--short`.

### 10. AI chat và Markdown knowledge base

Chọn **Ask AI** hoặc **Discuss saved data with AI** dưới kết quả. Khung chat hiển thị các lượt hỏi/đáp, dữ liệu gắn vào, thời điểm nguồn và docs đã tra cứu. Mở lại lượt chat trong History để tiếp tục. UI hiển thị tối đa 20 lượt trong nhánh hội thoại; model nhận tối đa 3 lượt gần nhất cùng dữ liệu nguồn theo tool.

Câu trả lời AI hiển thị Markdown: tiêu đề, đậm/nghiêng, danh sách lồng nhau, checklist, bảng, trích dẫn, liên kết và code. Bảng/khối code dài cuộn bên trong câu trả lời. Địa chỉ trong văn bản và inline code vẫn bấm để sao chép được; code block giữ nguyên nội dung. HTML được hiển thị như văn bản, liên kết chỉ mở HTTP/HTTPS/mailto, ảnh được trình bày thành liên kết. Lịch sử cũ cũng dùng cách hiển thị này; dữ liệu lưu và export vẫn giữ Markdown gốc.

- Chat research mới mặc định bật **Allow new Birdeye requests**: AI có thể phối hợp các API/workflow trong catalog theo ngân sách CU đã chọn và khám phá/gọi MCP Birdeye theo giới hạn 20 data request attempts/lượt. MCP có CU chưa xác định, nên budget CU không bảo đảm trần phí của MCP.
- Bỏ chọn để dùng docs + saved data, **0 Birdeye CU mới**. Server chặn data tools kể cả khi model yêu cầu tool bị ẩn. Hội thoại được mở lại/tiếp tục giữ lựa chọn đã lưu. Chat có thể dùng docs/MCP public khi chưa có Birdeye key; API REST vẫn yêu cầu key. AI provider và AI token usage áp dụng cho cả hai chế độ.
- AI có thể đề xuất chuỗi nghiên cứu mới từ skill hiện có; việc đề xuất không tự thêm command hoặc chạy endpoint chưa tích hợp.

Khi chuyển từ workflow sang **Ask AI**, chat mang theo workflow đang chọn, địa chỉ, khoảng thời gian và các chỉnh sửa API-step đã hợp lệ. `read_research_context` cho AI đọc ngữ cảnh/ước tính, `list_workflows` khám phá các flow có sẵn, và `run_selected_workflow` chạy đúng cấu hình đã chọn. `run_workflow` dùng khi cần flow khác hoặc người dùng đổi phạm vi. Workflow còn thiếu địa chỉ chỉ được truyền tên, để AI hỏi bổ sung; không dùng địa chỉ giả. Yêu cầu phân tích/research được hướng dẫn thực hiện tool calls và trả kết luận dựa trên bằng chứng, tái sử dụng dữ liệu đã có trước khi gọi thêm. Kết quả và nguồn được lưu vào History như workflow chạy trực tiếp.

Bộ Markdown trong `knowledge/birdeye` nhập 425 MDX + README từ docs local, bổ sung 113 hợp đồng OpenAPI đã resolve, cùng workflow/skill của CLI và hướng dẫn sử dụng/harness. Manifest ghi source commit, hash từng trang và thời điểm tạo; các file cấu hình bí mật/certificate/database/script không được nhập. Nội dung MDX được giữ trong file `.md` như văn bản tham khảo; không thực thi JSX. SQLite FTS5 tìm các đoạn liên quan, không gửi toàn bộ kho docs cho mỗi câu hỏi; không dùng embedding API.

```bash
# Tìm/đọc docs offline: 0 Birdeye CU, 0 AI tokens
node dist/index.js knowledge search "smart money top_traders" --short
node dist/index.js knowledge show <document-id> --offset 0
# Trong workspace, cập nhật Markdown từ checkout docs rồi build lại
npm run knowledge:sync -- ../bds-docs-mintlify
npm run build
```

Tools mới: `search_birdeye_docs`, `read_birdeye_doc`, `read_saved_data`; `estimate_workflow` vẫn miễn phí. Harness giới hạn 8 vòng AI, 10 tool calls/vòng và 90.000 ký tự ngữ cảnh; docs được gắn nguồn/hash. Dữ liệu/docs là đầu vào tham khảo, không được đổi provider, vượt ngân sách hay thực thi code. Context lớn trả preview có ghi rõ giới hạn; không suy luận các dòng bị bỏ.

```bash
npm run typecheck
npm test
npm run test:browser
```

Test offline bao gồm tìm/đọc docs có nguồn, dữ liệu/schema OpenAPI, chặn paid tools trong saved-only, tiếp tục chat sau restart, giữ nguồn/timestamp và tách AI tokens khỏi Birdeye CU. Test browser dùng provider/clipboard/dataset giả, kiểm tra chat với dữ liệu cũ và mở lại history; môi trường sandbox hiện chặn TCP listen nên chưa xác minh browser thực tế.



### 11. Khám phá và gọi tool qua Birdeye MCP

Trong chat, bật **Allow new Birdeye requests**, rồi hỏi ví dụ: “Khám phá các tool Birdeye MCP liên quan đến token transfers, đọc schema của tool phù hợp và truy vấn địa chỉ này trên Solana: …”. Agent có ba tool:

| Tool | Chức năng |
| --- | --- |
| `search_birdeye_mcp_tools` | Lấy catalog thật từ server, tìm theo tên/mô tả; query rỗng để liệt kê, có phân trang và `refresh` |
| `read_birdeye_mcp_tool` | Đọc input JSON schema và annotations của một tool |
| `call_birdeye_mcp_tool` | Validate arguments rồi gọi tool đã khám phá; lưu nguyên kết quả làm nguồn |

Kết nối dùng endpoint cố định `https://mcp.birdeye.so/mcp`, lấy `BIRDEYE_API_KEY` hoặc Birdeye key trong Settings qua header `x-api-key`. Không có key thì kết nối public; tool khả dụng phụ thuộc quyền và giới hạn của server. Không cần cài thêm `mcp-remote`. Kết nối được mở khi agent cần MCP và đóng sau lượt chat; chat saved-only không gửi request MCP nào, kể cả discovery. Định nghĩa tool được cache trong lượt chat; agent có thể refresh khi cần.

Catalog được đọc theo [MCP Streamable HTTP](https://modelcontextprotocol.io/specification/2025-06-18/basic/transports), hỗ trợ JSON/SSE, session, timeout, hủy request và phân trang. Tool không tồn tại, arguments sai schema, schema không validate được hoặc tool khai báo destructive mà không read-only sẽ bị từ chối. Agent được hướng dẫn ưu tiên API trong catalog nếu cùng đáp ứng yêu cầu, dùng Solana, và xem nội dung MCP là dữ liệu tham khảo.

Mỗi `tools/call` dùng một request attempt chung với REST. Gọi trùng tên + arguments trong cùng lượt được tái sử dụng; lỗi mạng không tự retry. Ledger ghi `estimated: null`, `pricing_version: mcp-unpriced` cho attempt, và `cu.unknownCostAttempts` trong tổng hợp. Tổng `estimated`/`budgetUsed` chỉ cộng chi phí đã biết, **không có nghĩa MCP miễn phí**; cảnh báo này được giữ trong kết quả và nguồn. Budget bằng 0 chặn MCP data calls. Kết quả `isError` được giữ như nguồn lỗi, không dùng làm bằng chứng thị trường thành công. Nội dung lớn được lưu đầy đủ trong History/export, phần gửi model được giới hạn.

Test offline kiểm tra initialize/session/header, catalog phân trang, SSE chia chunk, schema, lỗi/redaction/cancellation, giới hạn request chung, saved-only, cả hai AI API format, tránh gọi trùng và lưu nguồn qua interface. Endpoint thật chưa được kiểm thử trong môi trường phát triển này do DNS bị chặn.

### 12. Import và migrate workflow từ nhiều nguồn

Mở tab **Imports**: nhập URL GitHub hoặc upload/paste Markdown/JSON → **Import source** → chọn bản lưu → xem **Migration differences**, mapping command/endpoint và các bước thực thi → chỉnh address/params → **Preview mapping & CU** → **Run imported workflow**. Import/preview không gọi Birdeye và không cần AI provider. Run mới tiêu CU; kết quả được lưu vào History, có thể mở lại hoặc trao đổi tiếp với AI.

Nguồn hỗ trợ:

- GitHub public: URL repo, `tree`, `blob` hoặc `raw.githubusercontent.com`. Không clone hay thực thi script. Có thể dùng `--ref` để chọn commit/tag/branch.
- File hoặc thư mục local qua CLI; UI nhận file upload/paste, không đọc đường dẫn tùy ý trên server.
- Chín file `workflow-*.md` của GMGN được chuyển sang recipe Birdeye có sẵn, kèm các khác biệt về dữ liệu/filter/window và phần chưa migrate. Đây là adaptation, không phải thực thi toàn bộ logic trong prose/shell.
- Sáu file `*-workflow.md` trong `birdeye-data-skills/docs` dùng recipe đã đối chiếu của CLI.
- Markdown chưa có adapter chỉ tạo bản cần đối chiếu và các endpoint candidates nhận diện được. **Không tự chạy** tài liệu lạ. JSON version 1 định nghĩa chuỗi API mới trong catalog.

```bash
npm run build
# Import nguồn public: tốn GitHub requests, 0 Birdeye CU
node dist/index.js workflow import https://github.com/GMGNAI/gmgn-skills/tree/main/docs
# Nguồn local và JSON mẫu: hoàn toàn offline, dùng cùng --config-dir với UI
node dist/index.js workflow import ./birdeye-data-skills/docs
node dist/index.js workflow import ./docs/workflows/import-examples
node dist/index.js workflow imports list --short
node dist/index.js workflow imports show <import-id>
node dist/index.js workflow imports plan <import-id> --address So11111111111111111111111111111111111111112
# Có gọi Birdeye; ví dụ Token evidence cần 40 CU trước retries
node dist/index.js workflow imports run <import-id> --address So11111111111111111111111111111111111111112 --max-cu 40 --short
# Tùy chỉnh tham số runtime/bước, vẫn kiểm tra bằng schema catalog
node dist/index.js workflow imports plan <import-id> --params '{"limit":2,"stepOverrides":{}}'
node dist/index.js --format interface --bind 127.0.0.1:8787
```

Các lệnh `workflow create/show` cũ vẫn quản lý budget ledger; definition nhập nằm ở `workflow imports`. Bảng SQLite `workflow_imports` giữ source text, hash, origin, adapter, definition và mapping; cùng content+origin không tạo bản trùng. Xóa History không xóa definition/import hoặc config. Batch import lỗi validation không lưu dở dang.

JSON mẫu: [Token evidence](docs/workflows/import-examples/token-evidence.workflow.json), [Trending token evidence](docs/workflows/import-examples/discovery.workflow.json). Mỗi step có `id`, `operation`, `params`, `purpose` tùy chọn. Chỉ dùng operation trong `capabilities`, chain Solana, tối đa 20 steps. Binding chính xác `{{address}}`, `{{from}}`, `{{to}}`; mặc định window 24h. `subjects: {from:["step-id"],kind:"token"|"wallet"|"pair",take:1..5}` chọn địa chỉ duy nhất từ bước trước theo provider order; dùng `subjectKey:"wallet"` hoặc `"token_address"` nếu API cần. Mỗi bước chỉ lấy một trang. Dependency phải trỏ về bước trước; không eval, shell, URL API tùy ý hay lệnh giao dịch.

UI hiển thị địa chỉ thực tế ở từng bước. Địa chỉ cố định trong JSON có thể sửa trong Step parameters; ô address chung chỉ áp dụng khi workflow dùng binding `{{address}}`. Sửa một tham số giữ nguyên các filter mặc định khác của adapter. Mọi thay đổi input/bước cần Preview mapping & CU lại trước khi chạy.

Giới hạn import: 256 KB/tài liệu, 40 files/2 MB mỗi batch. Directory chỉ chọn `workflow-*.md`, `*-workflow.md`, `SKILL.md`, `*.workflow.json`; bỏ hidden directories, node_modules, symlinks và các file vận hành. Unknown source không tự sinh command thực thi. GitHub rate limits/lỗi mạng được báo để chọn file hoặc upload local.

Nếu GitHub API trả **403/429** khi liệt kê repo `GMGNAI/gmgn-skills` hoặc thư mục `docs`, importer tự tải trực tiếp **9 workflow đã hỗ trợ** từ `raw.githubusercontent.com`, không cần GitHub token. Đường dự phòng giữ nguyên branch/`--ref`; URL repo không có ref dùng branch từ metadata nếu đã lấy được, hoặc `main` nếu metadata bị chặn. Nó không quét thêm skill/file mới. Nếu nguồn raw cũng lỗi, import dừng và báo rõ host + HTTP status; dùng file local/upload khi mạng không truy cập được GitHub.

CU vẫn đi qua Runner và ledger chung. Đã cập nhật riêng top-traders và holder-positions từ 25 lên **30 CU/request** theo trang endpoint Birdeye ngày 2026-10-16; phần còn lại dùng snapshot catalog. Đây là ước tính tài liệu, chưa xác nhận billing bằng API live. Đối chiếu và giới hạn nằm trong [workflow migration audit](docs/workflows/migration-audit.md).

```bash
npm run typecheck
npm test
# Chỉ regression importer: adapter, JSON/schema, dependencies, GitHub/local,
# persistence/restart, HTTP/CLI, giới hạn CU và kết quả History
node --test .test-dist/tests/workflow-import.test.js
# Regression lỗi GMGN 403/429 (mock network, 0 CU; npm test biên dịch trước)
node --test --test-name-pattern='GMGN imports recover|GMGN fallback preserves|HTTP import' .test-dist/tests/workflow-import.test.js
npm run test:browser
```
