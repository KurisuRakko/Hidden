import { getPublicBoxBySlug } from "@/features/boxes/service";
import { withApiHandler } from "@/lib/api";
import { ok } from "@/lib/http";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export const GET = withApiHandler(
  async (_request: Request, context: RouteContext) => {
    const { slug } = await context.params;
    return ok(await getPublicBoxBySlug(slug));
  },
);
