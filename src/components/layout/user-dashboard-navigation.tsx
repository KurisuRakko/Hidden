import {
  AddRounded,
  PersonRounded,
  QuestionAnswerRounded,
} from "@mui/icons-material";

export type UserDashboardNavItem = {
  key: "questions" | "create" | "me";
  href: string;
  labelKey: string;
  icon: React.ReactNode;
  matches: (pathname: string) => boolean;
  mobileOnlyPrimaryAction?: boolean;
};

export const userDashboardNavigation: UserDashboardNavItem[] = [
  {
    key: "questions",
    href: "/dashboard/questions",
    labelKey: "common.nav.questions",
    icon: <QuestionAnswerRounded />,
    matches: (pathname) =>
      pathname === "/dashboard/questions" ||
      (pathname.startsWith("/dashboard/boxes/") &&
        pathname !== "/dashboard/boxes/new" &&
        !/\/dashboard\/boxes\/[^/]+\/created$/.test(pathname)),
  },
  {
    key: "create",
    href: "/dashboard/boxes/new",
    labelKey: "common.nav.create",
    icon: <AddRounded />,
    mobileOnlyPrimaryAction: true,
    matches: (pathname) =>
      pathname === "/dashboard/boxes/new" ||
      /\/dashboard\/boxes\/[^/]+\/created$/.test(pathname),
  },
  {
    key: "me",
    href: "/dashboard/me",
    labelKey: "common.nav.me",
    icon: <PersonRounded />,
    matches: (pathname) => pathname === "/dashboard/me",
  },
];

export function getActiveUserDashboardItem(pathname: string) {
  return (
    userDashboardNavigation.find((item) => item.matches(pathname)) ??
    userDashboardNavigation[0]
  );
}
