import { submitPublicQuestion } from "@/features/boxes/service";
import { errorResponse, ok } from "@/lib/http";
import { getClientIp, getOptionalFileFromFormData, getStringFromFormData } from "@/lib/request";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const formData = await request.formData();

    return ok(
      await submitPublicQuestion({
        slug,
        content: getStringFromFormData(formData, "content"),
        image: getOptionalFileFromFormData(formData, "image"),
        ipAddress: getClientIp(request),
      }),
      201,
    );
  } catch (error) {
    return errorResponse(error);
  }
}
