export const publicPagePaths = {
  home: "/",
  about: "/about",
  project: "/project",
} as const;

export const siteConfig = {
  appName: "Hidden",
  creatorName: "KurisuRakko",
  publicBaseUrl: "https://hidden.rakko.cn",
  publicHomeUrl: "https://hidden.rakko.cn",
  officialSiteUrl: "https://rakko.cn",
  projectRepositoryUrl: "https://github.com/KurisuRakko/Hidden",
  supportEmail: "y@rakko.cn",
} as const;

export const supportEmailHref = `mailto:${siteConfig.supportEmail}`;

export function buildPublicPageUrl(pathname: string) {
  const normalizedPathname = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return new URL(normalizedPathname, `${siteConfig.publicBaseUrl}/`).toString();
}
