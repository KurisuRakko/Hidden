import { deleteQuestionAsAdmin } from "@/features/admin/service";
import { requireAdminApi } from "@/lib/auth/guards";
import { errorResponse, ok } from "@/lib/http";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const admin = await requireAdminApi();
    const { id } = await context.params;
    return ok(await deleteQuestionAsAdmin(admin.id, id));
  } catch (error) {
    return errorResponse(error);
  }
}
