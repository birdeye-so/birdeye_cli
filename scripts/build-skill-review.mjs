import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { loadSkillRuntime, root } from "./lib/skill-runtime.mjs";

const { workflowCatalog, planCase } = await loadSkillRuntime();
const address = "So11111111111111111111111111111111111111112";
const at = 1800000000;
const variants = [
  ["Mặc định", {}],
  ["Full", { depth: "full" }],
  ["Standard DD", { ddMode: "standard" }],
  ["Standard discovery", { skillDepth: "standard" }],
  ["Deep", { skillDepth: "deep" }],
  ["Đủ include", { include: ["list", "advanced_security", "risk_history"] }],
];
const rows = workflowCatalog()
  .filter((item) => item.family !== "legacy")
  .map((item) => {
    const base = {
      kind: item.kind,
      ...(["token", "wallet"].includes(item.subject)
        ? { address }
        : item.subject === "wallets"
          ? { wallets: [address] }
          : {}),
    };
    const plans = [];
    const choices =
      item.kind === "skill-price-surge"
        ? [
            ["Standard", { priceSurge: { mode: "standard" } }],
            ["Advanced", { priceSurge: { mode: "advanced" } }],
            [
              "Advanced + security",
              { priceSurge: { mode: "advanced", with_security: true } },
            ],
          ]
        : variants;
    for (const [label, extra] of choices) {
      const plan = planCase({ ...base, ...extra }, at);
      const key = JSON.stringify(plan.steps);
      if (!plans.some((item) => item.key === key))
        plans.push({ label, plan, key });
    }
    if (item.subject === "optional-wallet")
      plans.push({
        label: "Có wallet",
        plan: planCase({ ...base, address }, at),
      });
    if (item.subject === "wallets")
      plans.push({
        label: "10 wallet",
        plan: planCase(
          {
            ...base,
            wallets: Array.from(
              { length: 10 },
              (_, i) => "1".repeat(31) + "ABCDEFGHJK"[i],
            ),
          },
          at,
        ),
      });
    return {
      item,
      plans,
      complex: plans.some(
        ({ plan }) =>
          plan.steps.length >= 4 || plan.steps.some((step) => step.subjects),
      ),
    };
  });
const complex = rows.filter((row) => row.complex);
const questions = {
  "token-research":
    "Giữ riêng với Token Due Diligence hay gộp thành các mức kiểm tra của một skill?",
  "token-due-diligence":
    "Full thêm markets, pair và profile nhưng không thêm holders. Cần giữ cách mở rộng này hay chuẩn hóa với Token Research?",
  "project-deep-report":
    "Tám bước có cần chạy mặc định hay để người dùng chọn thêm candles/activity? Mô tả phải giới hạn ở dữ liệu on-chain.",
  "risk-warning":
    "Full đọc thêm profile, positions và hai timeline. Có cần tất cả cho một lần review rủi ro?",
  "early-project-screening":
    "Cần duyệt tiêu chí chọn token và việc không tự thay token bị loại bằng token khác. Listing time khác creation time.",
  "daily-brief":
    "Full gộp dữ liệu chain, smart money, launches; wallet là nhánh tùy chọn. Có nên tách phần wallet khỏi daily brief?",
  "market-opportunities":
    "Chọn theo volume từ một trang, rồi enrich. Cần duyệt giới hạn số token và sự khác biệt với market-shortlist.",
  "market-shortlist":
    "Chọn theo thứ tự provider thay vì xếp lại theo volume. Có nên gộp với market-opportunities bằng tùy chọn chọn mẫu?",
  "wallet-analysis":
    "Một cửa sổ PnL, Full thêm position và kiểm tra token. Tên đang trùng với skill-wallet-analysis đa cửa sổ; cần quyết định tên/phạm vi.",
  "smart-money-profile":
    "Có thể discovery nhiều wallet nếu bỏ address. Có nên tách thao tác discovery khỏi profile một wallet?",
  "skill-token-dd-score":
    "Advanced mặc định có bảy bước; Standard có hai. OHLC 30 CU còn provisional. Cần duyệt chế độ mặc định và bằng chứng tối thiểu trước khi chấm điểm.",
  "skill-smart-wallets":
    "Token → traders → wallet → PnL/positions. Cần duyệt dedup, số wallet tối đa, và Fast/Standard/Deep. Không cộng PnL theo token thành PnL toàn ví.",
  "skill-token-dd":
    "Các include mở thêm holders, profile, liquidity. Có nên gộp với kiểm tra token khác? Không phát điểm an toàn tổng hợp từ dữ liệu thiếu.",
  "skill-contract-dd":
    "Candles có cần đi cùng kiểm tra contract mặc định? skip-kline giảm một bước; giá không chứng minh contract an toàn.",
  "skill-rugcheck-audit":
    "Tên có thể bị hiểu là tích hợp RugCheck.org dù chỉ dùng Birdeye. Cần duyệt tên và phạm vi kết luận.",
  "skill-wallet-score":
    "Score cần 30d/90d và positions tương ứng. Cần duyệt nhu cầu holdings/first-funded mặc định; thiếu dữ liệu phải giữ điểm unavailable.",
  "skill-wallet-style":
    "Phân loại dùng PnL, positions; first-funded và transactions có thể bỏ. Cần duyệt phần nào thật sự cần cho phân loại.",
  "skill-wallet-analysis":
    "Mặc định năm cửa sổ PnL và bốn bước bổ sung. Có nên mặc định ít cửa sổ hơn? Không cộng các kỳ chồng lấn.",
  "skill-smart-money-profile":
    "Nhiều bằng chứng cho một wallet: PnL, positions, holdings, funding, trades, net worth. Cần duyệt phần nào nên tùy chọn và tên đang gần smart-money-profile.",
  "skill-smart-money-leaderboard":
    "Mỗi wallet cần ba request, tối đa 10 wallet. Cần duyệt giới hạn, scope PnL thống nhất và cách giữ wallet thiếu dữ liệu ngoài bảng xếp hạng.",
};
const lines = [
  "| Skill ID | Mặc định: bước / request / CU | Chế độ khác | Cần review |",
  "| --- | --- | --- | --- |",
];
for (const { item, plans } of complex) {
  const first = plans[0].plan;
  lines.push(
    `| \`${item.kind}\` | ${first.steps.length} / ${first.maxRequests} / ${first.estimatedCu} | ${
      plans
        .slice(1)
        .map(
          ({ label, plan }) =>
            `${label}: ${plan.steps.length} bước, ${plan.maxRequests} req, ${plan.estimatedCu} CU`,
        )
        .join("; ") || "—"
    } | ${questions[item.kind] || "Duyệt các bước và phạm vi dữ liệu trước khi đổi mặc định."} |`,
  );
}
lines.push("", "## Chi tiết thực thi để review", "");
for (const { item, plans } of complex) {
  lines.push(
    `### ${item.title} — \`${item.kind}\``,
    "",
    `Định nghĩa: [definition.ts](../src/workflows/${item.kind}/definition.ts).`,
    "",
  );
  for (const { label, plan } of plans) {
    lines.push(
      `**${label}: ${plan.steps.length} bước / tối đa ${plan.maxRequests} request / ${plan.estimatedCu} CU trước retry.**`,
      "",
    );
    for (const [index, step] of plan.steps.entries()) {
      const selector = step.subjects;
      const dependency = selector
        ? `; lấy tối đa ${selector.take} ${selector.kind} từ ${selector.from.map((id) => `\`${id}\``).join(", ")}${selector.sort ? ", xếp theo volume24hUSD" : ", giữ thứ tự provider"}`
        : "";
      lines.push(
        `${index + 1}. \`${step.id}\` → \`${step.operation}\` (${step.cost} CU/request${dependency}).`,
      );
    }
    lines.push("");
  }
}
lines.push(
  "## Trường hợp đơn giản hơn",
  "",
  ...rows
    .filter((row) => !row.complex)
    .map(
      ({ item, plans }) =>
        `- \`${item.kind}\`: ${plans[0].plan.steps.length} bước, ${plans[0].plan.maxRequests} request, ${plans[0].plan.estimatedCu} CU mặc định.`,
    ),
  "",
);
const start = "<!-- GENERATED SKILL REVIEW START -->",
  end = "<!-- GENERATED SKILL REVIEW END -->";
const path = resolve(root, "docs/SKILL_REVIEW.md");
let previous;
try {
  previous = await readFile(path, "utf8");
} catch {}
const header = `# Skill nhiều bước — chờ review\n\nĐây là ghi chú cho maintainer, không nằm trong catalog công khai. Chưa thay đổi logic, thứ tự bước hoặc chế độ mặc định.\n\nĐánh dấu khi có ít nhất 4 bước trong một chế độ được kiểm tra, hoặc có bước chọn đối tượng từ kết quả trước. Có ${complex.length}/${rows.length} skill thuộc diện này. Số request tính cả fan-out; không đồng nhất số bước với số lần gọi API. Đây là ước tính trước retry, không phải hóa đơn; pricing OHLC của Token Due-Diligence Score còn provisional.\n\nChế độ full/deep/include và wallet tùy chọn được kiểm tra riêng, không phải liệt kê mọi tổ hợp cờ. Budget và lỗi có thể khiến bước sau không chạy.\n\nChạy \`npm run skills:review\` để cập nhật phần sinh tự động. Ghi quyết định ở cuối file; lệnh giữ nguyên phần ghi chú ngoài block.\n\n`;
const generated = `${start}\n${lines.join("\n")}\n${end}`;
const content =
  previous?.includes(start) && previous.includes(end)
    ? previous.slice(0, previous.indexOf(start)) +
      generated +
      previous.slice(previous.indexOf(end) + end.length)
    : header +
      generated +
      "\n\n## Quyết định của bạn\n\n- Chưa review. Ghi skill ID, bước cần bỏ/tách và chế độ mặc định mong muốn tại đây.\n";
if (process.argv.includes("--check")) {
  if (previous !== content)
    throw new Error("Skill review is stale; run npm run skills:review");
} else await writeFile(path, content);
console.log(
  `Skill review: ${complex.length} multi-step/dependent skills; no API calls`,
);
