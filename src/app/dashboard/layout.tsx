import {
  DashboardRounded,
  FolderRounded,
} from "@mui/icons-material";
import { WorkspaceShell } from "@/components/layout/workspace-shell";
import { requireUserPage } from "@/lib/auth/guards";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const viewer = await requireUserPage();

  return (
    <WorkspaceShell
      title="User dashboard"
      description="Manage your question boxes, review submissions, and publish the Q&A you want to keep public."
      viewer={viewer}
      navigation={[
        {
          href: "/dashboard",
          label: "Overview",
          icon: <DashboardRounded />,
        },
        {
          href: "/dashboard/boxes",
          label: "Question boxes",
          icon: <FolderRounded />,
        },
      ]}
    >
      {children}
    </WorkspaceShell>
  );
}
