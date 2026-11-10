// Detect credential-shaped literals, not public chain addresses named "token".
// This complements a full secret scanner; it does not prove a repository secret-free.
const rules = [
  [
    "api-key-literal",
    /(?:x-api-key|api[_-]?key|birdeye[_-]?key)[\s"'`:=\\-]{1,12}([a-f0-9]{20,64})\b/gi,
  ],
  ["private-key", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/g],
  [
    "github-token",
    /\b(?:gh[pousr]_[A-Za-z0-9]{36,}|github_pat_[A-Za-z0-9_]{50,})\b/g,
  ],
];
export function credentialFindings(text) {
  return rules.flatMap(([rule, pattern]) =>
    [...text.matchAll(new RegExp(pattern))].map((match) => ({
      rule,
      line: text.slice(0, match.index).split("\n").length,
      value: match[1] || match[0],
    })),
  );
}
export function redactCredentialExamples(text) {
  for (const finding of credentialFindings(text)) {
    // Private keys and other token families must be reviewed, never silently
    // copied into a documentation snapshot.
    if (finding.rule !== "api-key-literal")
      throw new Error(`Credential detected: ${finding.rule}; import rejected.`);
    text = text.replaceAll(finding.value, "YOUR_API_KEY");
  }
  return text;
}
