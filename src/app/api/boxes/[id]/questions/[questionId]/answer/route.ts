import { saveAnswerForQuestion } from "@/features/boxes/service";
import { withApiHandler } from "@/lib/api";
import { requireUserApi } from "@/lib/auth/guards";
import { ok } from "@/lib/http";
import {
  getOptionalFileFromFormData,
  getStringFromFormData,
} from "@/lib/request";

type RouteContext = {
  params: Promise<{
    id: string;
    questionId: string;
  }>;
};

export const POST = withApiHandler(
  async (request: Request, context: RouteContext) => {
    const viewer = await requireUserApi();
    const { id, questionId } = await context.params;
    const formData = await request.formData();

    return ok(
      await saveAnswerForQuestion(id, questionId, viewer.id, {
        content: getStringFromFormData(formData, "content"),
        image: getOptionalFileFromFormData(formData, "image"),
      }),
    );
  },
);
