import { deleteAnswerAsAdmin } from "@/features/admin/service";
import { requireAdminApi } from "@/lib/auth/guards";
import { errorResponse, ok } from "@/lib/http";

type RouteContext = {
  params: Promise<unknown>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const admin = await requireAdminApi();
    const { id } = (await context.params) as {
      id: string;
    };
    return ok(await deleteAnswerAsAdmin(admin.id, id));
  } catch (error) {
    return errorResponse(error);
  }
}
