import {
  ArticleRounded,
  CategoryRounded,
  DashboardRounded,
  GroupRounded,
  KeyRounded,
  QuestionAnswerRounded,
} from "@mui/icons-material";
import { WorkspaceShell } from "@/components/layout/workspace-shell";
import { getAdminAppUrl } from "@/lib/admin-portal";
import { requireAdminPage } from "@/lib/auth/guards";

type AdminLayoutProps = {
  children: React.ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const viewer = await requireAdminPage();

  return (
    <WorkspaceShell
      title="Admin console"
      description="Review users, boxes, questions, and invite codes across the whole platform."
      viewer={viewer}
      logoutRedirectTo={await getAdminAppUrl("/admin-login")}
      navigation={[
        {
          href: "/admin",
          label: "Overview",
          icon: <DashboardRounded />,
        },
        {
          href: "/admin/users",
          label: "Users",
          icon: <GroupRounded />,
        },
        {
          href: "/admin/boxes",
          label: "Boxes",
          icon: <CategoryRounded />,
        },
        {
          href: "/admin/questions",
          label: "Questions",
          icon: <QuestionAnswerRounded />,
        },
        {
          href: "/admin/invites",
          label: "Invites",
          icon: <KeyRounded />,
        },
        {
          href: "/admin/logs",
          label: "Logs",
          icon: <ArticleRounded />,
        },
      ]}
    >
      {children}
    </WorkspaceShell>
  );
}
