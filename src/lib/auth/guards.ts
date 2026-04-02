import { UserRole } from "@prisma/client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  assertAdminPortalHeaders,
  getAdminAppUrl,
  getPublicAppUrl,
  requireAdminPortalPage,
} from "@/lib/admin-portal";
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
  await requireAdminPortalPage();
  const viewer = await getViewer();

  if (!viewer) {
    redirect(getAdminAppUrl("/admin-login"));
  }

  if (viewer.status !== "ACTIVE") {
    redirect(getAdminAppUrl("/admin-login?disabled=1"));
  }

  if (viewer.role !== UserRole.ADMIN) {
    redirect(getPublicAppUrl("/dashboard"));
  }

  return viewer;
}

export async function requireUserApi() {
  return requireSessionUser();
}

export async function requireAdminApi() {
  assertAdminPortalHeaders(await headers());
  const viewer = await requireSessionUser();

  if (viewer.role !== UserRole.ADMIN) {
    throw new AppError(403, "Admin access required", "FORBIDDEN");
  }

  return viewer;
}
