import test from "node:test";
import assert from "node:assert/strict";
import {build} from "esbuild";
import React from "react";
import {renderToStaticMarkup} from "react-dom/server";

await build({entryPoints: ["web/markdown-text.tsx"], outfile: ".test-dist/web/markdown-text.mjs", bundle: true, packages: "external", platform: "node", format: "esm", jsx: "automatic"});
const {MarkdownText} = await import("../.test-dist/web/markdown-text.mjs");
const render = text => renderToStaticMarkup(React.createElement(MarkdownText, {text}));
const address = "So11111111111111111111111111111111111111112";

test("AI Markdown renders headings, nested lists, tables, code, quotes and references", () => {
  const html = render('# Findings\n\n**Strong** and *emphasis*, ~~old~~, `inline`.\nNext line.\n\n3. Third\n   - Nested\n4. Fourth\n\n> Provider evidence\n\n| Token | Price |\n| --- | ---: |\n| SOL | $42 |\n\n```js\na < b && c\n```\n\n[Source][docs]\n\n[docs]: https://docs.birdeye.so/agents/birdeye-mcp');
  for (const snippet of ['<h3>Findings</h3>', '<strong>Strong</strong>', '<em>emphasis</em>', '<del>old</del>', '<code>inline</code>', '<br/>', '<ol start="3">', '<ul><li>Nested</li></ul>', '<blockquote>', '<table>', 'scope="col"', 'text-align:right', '<code>a &lt; b &amp;&amp; c</code>', 'href="https://docs.birdeye.so/agents/birdeye-mcp"']) assert.ok(html.includes(snippet), snippet);
});

test("AI Markdown cannot inject HTML, scripts, unsafe URLs or automatic image requests", () => {
  const html = render('<script>alert(1)</script>\n\n<img src=x onerror=alert(1)>\n\n[bad](javascript:alert%281%29) [encoded](jav&#x61;script:alert%281%29) [data](data:text/html,evil) [file](file:///etc/passwd)\n\n![External image](https://example.com/tracker.png)\n\n[Good](https://docs.birdeye.so/)');
  assert.doesNotMatch(html, /<script|<img|href="(?:javascript|data|file):/i);
  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /rel="noopener noreferrer"/);
  assert.match(html, /href="https:\/\/example.com\/tracker.png"/);
});

test("address copy actions survive Markdown without nesting buttons in links or code blocks", () => {
  const html = render(`**${address}** and \`${address}\`\n\n[${address}](https://birdeye.so/)\n\n\`\`\`\n${address}\n\`\`\``);
  assert.equal((html.match(/data-address=/g) || []).length, 2);
  assert.match(html, new RegExp(`<code>${address}</code></pre>`));
  assert.doesNotMatch(html, /<a\b[^>]*>[^<]*<button/);
});

test("Markdown keeps code literal, decodes prose entities and tolerates unfinished input", () => {
  const html = render('A &amp; B\n\n`&amp; <tag>`\n\n- [x] Done\n- [ ] Pending\n\n```json\n{"partial":');
  assert.match(html, /A &amp; B/);
  assert.match(html, /<code>&amp;amp; &lt;tag&gt;<\/code>/);
  assert.equal((html.match(/type="checkbox"/g) || []).length, 2);
  assert.match(html, /aria-label="Completed item"/);
  assert.match(html, /aria-label="Incomplete item"/);
  assert.match(html, /\{&quot;partial&quot;:/);
});
