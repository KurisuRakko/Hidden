import { hardDeleteBox } from "@/features/admin/service";
import { withApiHandler } from "@/lib/api";
import { requireAdminApi } from "@/lib/auth/guards";
import { ok } from "@/lib/http";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const DELETE = withApiHandler(
  async (_request: Request, context: RouteContext) => {
    const admin = await requireAdminApi();
    const { id } = await context.params;
    await hardDeleteBox(admin.id, id);
    return ok({ deleted: true });
  },
);
