import { publishQuestionForOwner } from "@/features/boxes/service";
import { withApiHandler } from "@/lib/api";
import { requireUserApi } from "@/lib/auth/guards";
import { ok } from "@/lib/http";

type RouteContext = {
  params: Promise<{
    id: string;
    questionId: string;
  }>;
};

export const POST = withApiHandler(
  async (_request: Request, context: RouteContext) => {
    const viewer = await requireUserApi();
    const { id, questionId } = await context.params;
    return ok(await publishQuestionForOwner(id, questionId, viewer.id));
  },
  { localizeErrors: true },
);
