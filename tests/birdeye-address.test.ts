import test from "node:test";
import assert from "node:assert/strict";
import {
  birdeyeAddressUrl,
  metricAddressKind,
  operationSubject,
} from "../web/birdeye-address.js";

const address = "So11111111111111111111111111111111111111112";
test("Birdeye links use separate token/wallet routes and the supplied chain", () => {
  assert.equal(
    birdeyeAddressUrl(address, "token", "solana"),
    `https://birdeye.so/solana/token/${address}`,
  );
  assert.equal(
    birdeyeAddressUrl(address, "wallet", "Solana"),
    `https://birdeye.so/solana/wallet-analyzer/${address}`,
  );
  assert.equal(
    birdeyeAddressUrl(address, "token", "other-chain"),
    `https://birdeye.so/other-chain/token/${address}`,
  );
  for (const chain of ["", "../evil", "https://evil.test", "solana?x=1"])
    assert.equal(birdeyeAddressUrl(address, "token", chain), undefined);
  for (const invalid of ["invalid", "<script>", address + "/extra"])
    assert.equal(birdeyeAddressUrl(invalid, "token", "solana"), undefined);
});
test("Solana base64 links canonicalize to base58 without changing copied source data", () => {
  assert.equal(
    birdeyeAddressUrl(Buffer.alloc(32).toString("base64"), "wallet", "solana"),
    `https://birdeye.so/solana/wallet-analyzer/${"1".repeat(32)}`,
  );
  // Wrapped SOL mint bytes; known base58 above.
  const bytes = Buffer.from(
    "069b8857feab8184fb687f634618c035dac439dc1aeb3b5598a0f00000000001",
    "hex",
  );
  for (const value of [bytes.toString("base64"), bytes.toString("base64url")]) {
    assert.equal(
      birdeyeAddressUrl(value, "token", "solana"),
      `https://birdeye.so/solana/token/${address}`,
    );
  }
});
test("metric link types distinguish wallet subjects, token holdings, traders and unclassified addresses", () => {
  assert.equal(operationSubject("portfolio.holdings"), "wallet");
  assert.equal(metricAddressKind("address", "portfolio.holdings"), "token");
  assert.equal(metricAddressKind("address", "portfolio.pnl-summary"), "wallet");
  assert.equal(metricAddressKind("address", "market.smart-money"), "token");
  assert.equal(metricAddressKind("wallet", "token.top-traders"), "wallet");
  assert.equal(metricAddressKind("token", "token.top-traders"), "token");
  assert.equal(metricAddressKind("address", "token.security"), "token");
  assert.equal(metricAddressKind("sourceId", "token.security"), undefined);
  assert.equal(metricAddressKind("address"), undefined);
  assert.equal(operationSubject("market.pair-ohlcv"), undefined);
});
