import assert from "node:assert/strict";
import test from "node:test";
import { getStatusLabel } from "@/lib/i18n";
import { formatDateTime, formatRelativeState } from "@/lib/format";

test("formatDateTime returns a localized value for valid dates", () => {
  const value = new Date("2026-04-03T15:20:00.000Z");

  assert.match(formatDateTime(value, "en"), /\d{2}\/\d{2}\/\d{4}, \d{2}:\d{2}/);
});

test("formatDateTime returns notSet when the value is missing", () => {
  assert.equal(formatDateTime(null, "zh-CN"), "未设置");
  assert.equal(formatDateTime(undefined, "en"), "Not set");
});

test("formatDateTime returns notSet when the value is invalid", () => {
  assert.equal(formatDateTime("not-a-date", "en"), "Not set");
});

test("formatDateTime falls back to a stable string when locale formatting fails", () => {
  assert.equal(
    formatDateTime("2026-04-03T15:20:00.000Z", "broken-locale" as never),
    "2026-04-03 15:20",
  );
});

test("other format helpers keep existing behavior", () => {
  assert.equal(formatRelativeState(true, "zh-CN"), "开启");
  assert.equal(getStatusLabel("PUBLISHED", "en"), "Published");
});
