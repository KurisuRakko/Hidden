import { updateInviteCode } from "@/features/admin/service";
import { withApiHandler } from "@/lib/api";
import { requireAdminApi } from "@/lib/auth/guards";
import { ok } from "@/lib/http";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const PATCH = withApiHandler(
  async (request: Request, context: RouteContext) => {
    const admin = await requireAdminApi();
    const { id } = await context.params;
    const body = await request.json();
    return ok(await updateInviteCode(admin.id, id, body));
  },
);
