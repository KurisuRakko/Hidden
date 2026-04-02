import { listQuestionsForOwnerBox } from "@/features/boxes/service";
import { withApiHandler } from "@/lib/api";
import { requireUserApi } from "@/lib/auth/guards";
import { ok } from "@/lib/http";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const GET = withApiHandler(
  async (_request: Request, context: RouteContext) => {
    const viewer = await requireUserApi();
    const { id } = await context.params;
    return ok(await listQuestionsForOwnerBox(id, viewer.id));
  },
);
