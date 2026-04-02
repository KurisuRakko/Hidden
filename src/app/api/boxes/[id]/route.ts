import { updateBoxForOwner } from "@/features/boxes/service";
import { requireUserApi } from "@/lib/auth/guards";
import { errorResponse, ok } from "@/lib/http";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const viewer = await requireUserApi();
    const body = await request.json();
    const { id } = await context.params;
    return ok(await updateBoxForOwner(id, viewer.id, body));
  } catch (error) {
    return errorResponse(error);
  }
}
