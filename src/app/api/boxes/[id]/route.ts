import { updateBoxForOwner } from "@/features/boxes/service";
import { withApiHandler } from "@/lib/api";
import { requireUserApi } from "@/lib/auth/guards";
import { ok } from "@/lib/http";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export const PATCH = withApiHandler(
  async (request: Request, context: RouteContext) => {
    const viewer = await requireUserApi();
    const body = await request.json();
    const { id } = await context.params;
    return ok(await updateBoxForOwner(id, viewer.id, body));
  },
);
