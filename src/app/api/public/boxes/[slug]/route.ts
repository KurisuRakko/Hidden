import { getPublicBoxBySlug } from "@/features/boxes/service";
import { errorResponse, ok } from "@/lib/http";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;
    return ok(await getPublicBoxBySlug(slug));
  } catch (error) {
    return errorResponse(error);
  }
}
