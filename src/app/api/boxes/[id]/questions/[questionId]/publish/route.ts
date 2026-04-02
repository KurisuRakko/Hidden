import { publishQuestionForOwner } from "@/features/boxes/service";
import { requireUserApi } from "@/lib/auth/guards";
import { errorResponse, ok } from "@/lib/http";

type RouteContext = {
  params: Promise<{
    id: string;
    questionId: string;
  }>;
};

export async function POST(_request: Request, context: RouteContext) {
  try {
    const viewer = await requireUserApi();
    const { id, questionId } = await context.params;
    return ok(await publishQuestionForOwner(id, questionId, viewer.id));
  } catch (error) {
    return errorResponse(error);
  }
}
