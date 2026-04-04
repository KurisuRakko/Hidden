import { impersonateUser } from "@/features/admin/service";
import { withApiHandler } from "@/lib/api";
import { requireAdminApi } from "@/lib/auth/guards";
import { getPublicAppUrl } from "@/lib/admin-portal";
import { ok } from "@/lib/http";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const POST = withApiHandler(
  async (_request: Request, context: RouteContext) => {
    const admin = await requireAdminApi();
    const { id } = await context.params;
    const session = await impersonateUser(admin.id, id);
    const impersonateUrl = await getPublicAppUrl("/api/auth/impersonate");
    const url = new URL(impersonateUrl);
    url.searchParams.set("token", session.token);
    return ok({ impersonateUrl: url.toString() });
  },
);
