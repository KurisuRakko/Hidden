import { deleteAnswerAsAdmin } from "@/features/admin/service";
import { withApiHandler } from "@/lib/api";
import { requireAdminApi } from "@/lib/auth/guards";
import { ok } from "@/lib/http";

type RouteContext = {
  params: Promise<unknown>;
};

export const DELETE = withApiHandler(
  async (_request: Request, context: RouteContext) => {
    const admin = await requireAdminApi();
    const { id } = (await context.params) as {
      id: string;
    };
    return ok(await deleteAnswerAsAdmin(admin.id, id));
  },
);
