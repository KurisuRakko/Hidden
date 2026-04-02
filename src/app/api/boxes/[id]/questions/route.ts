import { listQuestionsForOwnerBox } from "@/features/boxes/service";
import { requireUserApi } from "@/lib/auth/guards";
import { errorResponse, ok } from "@/lib/http";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const viewer = await requireUserApi();
    const { id } = await context.params;
    return ok(await listQuestionsForOwnerBox(id, viewer.id));
  } catch (error) {
    return errorResponse(error);
  }
}
