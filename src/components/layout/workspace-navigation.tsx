export type WorkspaceNavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  matches?: (pathname: string) => boolean;
};

export function isWorkspaceNavItemActive(
  item: WorkspaceNavItem,
  pathname: string,
) {
  if (item.matches) {
    return item.matches(pathname);
  }

  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function getActiveWorkspaceNavItem(
  navigation: WorkspaceNavItem[],
  pathname: string,
) {
  const matches = navigation.filter((item) =>
    isWorkspaceNavItemActive(item, pathname),
  );

  if (matches.length > 0) {
    return matches.sort((left, right) => right.href.length - left.href.length)[0];
  }

  return navigation[0] ?? null;
}
