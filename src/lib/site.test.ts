import assert from "node:assert/strict";
import test from "node:test";
import {
  buildPublicPageUrl,
  publicPagePaths,
  siteConfig,
  supportEmailHref,
} from "@/lib/site";

test("site config exposes the canonical public links", () => {
  assert.equal(siteConfig.publicBaseUrl, "https://hidden.rakko.cn");
  assert.equal(siteConfig.officialSiteUrl, "https://rakko.cn");
  assert.equal(
    siteConfig.projectRepositoryUrl,
    "https://github.com/KurisuRakko/Hidden",
  );
  assert.equal(siteConfig.supportEmail, "y@rakko.cn");
  assert.equal(supportEmailHref, "mailto:y@rakko.cn");
});

test("site config exposes stable public page paths", () => {
  assert.equal(publicPagePaths.home, "/");
  assert.equal(publicPagePaths.about, "/about");
  assert.equal(publicPagePaths.project, "/project");
  assert.equal(buildPublicPageUrl(publicPagePaths.about), "https://hidden.rakko.cn/about");
});
