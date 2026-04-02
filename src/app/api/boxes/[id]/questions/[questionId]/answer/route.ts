import { saveAnswerForQuestion } from "@/features/boxes/service";
import { requireUserApi } from "@/lib/auth/guards";
import { errorResponse, ok } from "@/lib/http";
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

export async function POST(request: Request, context: RouteContext) {
  try {
    const viewer = await requireUserApi();
    const { id, questionId } = await context.params;
    const formData = await request.formData();

    return ok(
      await saveAnswerForQuestion(id, questionId, viewer.id, {
        content: getStringFromFormData(formData, "content"),
        image: getOptionalFileFromFormData(formData, "image"),
      }),
    );
  } catch (error) {
    return errorResponse(error);
  }
}
