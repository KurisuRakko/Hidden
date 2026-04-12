import assert from "node:assert/strict";
import test from "node:test";
import {
  createTranslator,
  getLocalizedErrorMessage,
  getStatusLabel,
  resolveLocale,
  resolveLocaleFromAcceptLanguage,
  translate,
} from "@/lib/i18n";

test("resolveLocaleFromAcceptLanguage prefers Chinese locales", () => {
  assert.equal(resolveLocaleFromAcceptLanguage("zh-CN,zh;q=0.9,en;q=0.8"), "zh-CN");
});

test("resolveLocale falls back to cookie before browser locale", () => {
  assert.equal(
    resolveLocale({
      cookieValue: "en",
      acceptLanguage: "zh-CN,zh;q=0.9",
    }),
    "en",
  );
});

test("translate falls back to the key when a message is missing", () => {
  assert.equal(translate("zh-CN", "missing.key"), "missing.key");
});

test("createTranslator interpolates message values", () => {
  const t = createTranslator("zh-CN");
  assert.equal(t("dashboard.summaryQuestions", { count: 12 }), "累计问题：12");
});

test("getLocalizedErrorMessage translates stable error codes", () => {
  assert.equal(
    getLocalizedErrorMessage({
      locale: "zh-CN",
      code: "PHONE_TAKEN",
      message: "This phone number is already registered.",
    }),
    "这个手机号已经注册过了。",
  );
});

test("getStatusLabel returns the translated label", () => {
  assert.equal(getStatusLabel("PUBLISHED", "en"), "Published");
});

test("translate returns the new about action label", () => {
  assert.equal(translate("zh-CN", "common.actions.about"), "关于");
  assert.equal(translate("en", "project.ctaAction"), "Back to about");
});

test("getLocalizedErrorMessage translates password required validation", () => {
  assert.equal(
    getLocalizedErrorMessage({
      locale: "zh-CN",
      message: "Password is required.",
    }),
    "密码不能为空。",
  );
});
