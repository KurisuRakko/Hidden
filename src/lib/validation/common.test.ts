import assert from "node:assert/strict";
import test from "node:test";
import { passwordSchema } from "@/lib/validation/common";

test("passwordSchema accepts short and long non-empty passwords", () => {
  assert.equal(passwordSchema.parse("1"), "1");
  assert.equal(passwordSchema.parse("x".repeat(256)), "x".repeat(256));
});

test("passwordSchema rejects blank passwords", () => {
  assert.throws(() => passwordSchema.parse("   "));
});
