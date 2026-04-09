import assert from "node:assert/strict";
import test from "node:test";
import { buildPublicMetadata } from "@/lib/public-metadata";
import { publicPagePaths } from "@/lib/site";

test("buildPublicMetadata returns canonical and social metadata", () => {
  const metadata = buildPublicMetadata({
    pathname: publicPagePaths.project,
    locale: "zh-CN",
    title: "关于 Hidden 项目",
    description: "了解 Hidden 的产品目标、角色模型、技术栈与部署形态。",
  });

  const openGraph = metadata.openGraph as
    | { type?: string; url?: string | URL; locale?: string }
    | null
    | undefined;
  const twitter = metadata.twitter as
    | { card?: string }
    | null
    | undefined;

  assert.equal(metadata.applicationName, "Hidden");
  assert.equal(metadata.alternates?.canonical, "https://hidden.rakko.cn/project");
  assert.equal(openGraph?.type, "website");
  assert.equal(String(openGraph?.url), "https://hidden.rakko.cn/project");
  assert.equal(openGraph?.locale, "zh_CN");
  assert.equal(twitter?.card, "summary");
});
