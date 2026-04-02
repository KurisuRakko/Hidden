import { submitPublicQuestion } from "@/features/boxes/service";
import { withApiHandler } from "@/lib/api";
import { ok } from "@/lib/http";
import {
  getClientIp,
  getClientUserAgent,
  getOptionalFileFromFormData,
  getStringFromFormData,
} from "@/lib/request";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

export const POST = withApiHandler(
  async (request: Request, context: RouteContext) => {
    const { slug } = await context.params;
    const formData = await request.formData();

    return ok(
      await submitPublicQuestion({
        slug,
        content: getStringFromFormData(formData, "content"),
        image: getOptionalFileFromFormData(formData, "image"),
        ipAddress: getClientIp(request),
        userAgent: getClientUserAgent(request),
      }),
      201,
    );
  },
  { localizeErrors: true },
);
