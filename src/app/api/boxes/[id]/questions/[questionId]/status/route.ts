import { QuestionStatus } from "@prisma/client";
import { z } from "zod";
import { updateQuestionStatusForOwner } from "@/features/boxes/service";
import { requireUserApi } from "@/lib/auth/guards";
import { errorResponse, ok } from "@/lib/http";

const requestSchema = z.object({
  status: z.enum([QuestionStatus.REJECTED, QuestionStatus.DELETED]),
});

type RouteContext = {
  params: Promise<{
    id: string;
    questionId: string;
  }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const viewer = await requireUserApi();
    const body = requestSchema.parse(await request.json());
    const { id, questionId } = await context.params;
    return ok(
      await updateQuestionStatusForOwner(id, questionId, viewer.id, body.status),
    );
  } catch (error) {
    return errorResponse(error);
  }
}
