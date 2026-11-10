import test from "node:test";
import assert from "node:assert/strict";
import {
  addressEncoding,
  addressParts,
  copyAddress,
} from "../web/address-detection.js";

const sol = "So11111111111111111111111111111111111111112";
const base64 = Buffer.alloc(32, 255).toString("base64");
const base64url = Buffer.alloc(32, 251).toString("base64url");

test("address recognition checks decoded length, padding and both base64 alphabets", () => {
  for (const address of [sol, "1".repeat(32)])
    assert.equal(addressEncoding(address), "base58");
  for (const address of [
    base64,
    base64.slice(0, -1),
    base64url,
    base64url + "=",
  ])
    assert.equal(addressEncoding(address), "base64");
  for (const value of [
    "hello",
    "1".repeat(31),
    "1".repeat(33),
    "z".repeat(44),
    Buffer.alloc(31, 255).toString("base64"),
    base64 + "=",
    base64.slice(0, -2) + "9=",
    "not-an-address",
    "0x" + "f".repeat(40),
  ]) {
    assert.equal(addressEncoding(value), null, value);
  }
});

test("detection preserves JSON/plain text byte for byte and handles adjacent punctuation", () => {
  const text = `Compare (${sol}), [${base64}].\n${JSON.stringify({ wallet: base64url, value: 42 })}`;
  const parts = addressParts(text);
  assert.equal(parts.map((p) => p.text).join(""), text);
  assert.deepEqual(
    parts.filter((p) => p.encoding).map((p) => p.text),
    [sol, base64, base64url],
  );
  assert.deepEqual(addressParts(""), []);
  assert.equal(
    addressParts("prefix" + sol + "suffix").some((p) => p.encoding),
    false,
  );
  assert.equal(
    addressParts(base64 + "==").some((p) => p.encoding),
    false,
  );
});

test("copy writes exactly the original encoding and surfaces clipboard failures", async () => {
  const written: string[] = [];
  const clipboard = {
    writeText: async (value: string) => {
      written.push(value);
    },
  };
  for (const value of [sol, base64, base64url])
    await copyAddress(value, clipboard);
  assert.deepEqual(written, [sol, base64, base64url]);
  await assert.rejects(copyAddress("invalid", clipboard), /recognized/);
  assert.equal(written.length, 3);
  await assert.rejects(
    copyAddress(sol, {
      writeText: async () => {
        throw new Error("Permission denied");
      },
    }),
    /Permission denied/,
  );
  await assert.rejects(copyAddress(sol, undefined), /Clipboard/);
});
