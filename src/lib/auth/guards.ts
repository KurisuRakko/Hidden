import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { AppError } from "@/lib/http";
import { getCurrentSession, requireSessionUser } from "@/lib/auth/session";

export async function getViewer() {
  const payload = await getCurrentSession();
  return payload?.user ?? null;
}

export async function requireUserPage() {
  const viewer = await getViewer();

  if (!viewer) {
    redirect("/login");
  }

  if (viewer.status !== "ACTIVE") {
    redirect("/login?disabled=1");
  }

  return viewer;
}

export async function requireAdminPage() {
  const viewer = await requireUserPage();

  if (viewer.role !== UserRole.ADMIN) {
    redirect("/dashboard");
  }

  return viewer;
}

export async function requireUserApi() {
  return requireSessionUser();
}

export async function requireAdminApi() {
  const viewer = await requireSessionUser();

  if (viewer.role !== UserRole.ADMIN) {
    throw new AppError(403, "Admin access required", "FORBIDDEN");
  }

  return viewer;
}
