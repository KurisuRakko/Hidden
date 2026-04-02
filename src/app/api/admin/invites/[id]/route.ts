import { updateInviteCode } from "@/features/admin/service";
import { requireAdminApi } from "@/lib/auth/guards";
import { errorResponse, ok } from "@/lib/http";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const admin = await requireAdminApi();
    const { id } = await context.params;
    const body = await request.json();
    return ok(await updateInviteCode(admin.id, id, body));
  } catch (error) {
    return errorResponse(error);
  }
}
